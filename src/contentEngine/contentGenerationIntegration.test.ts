import express from "express";
import type { Server } from "node:http";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContentGenerationCoordinator, createContentGenerationRouter } from "../../server/contentApi";
import type { StructuredContentProvider } from "./generation";
import { ContentPoolManager } from "./contentPoolManager";
import { LocalStorageContentPoolRepository } from "./contentPoolRepository";
import { buildContentGenerationRequest } from "./learnerContext";
import { adaptSpeedMathRound, recordBlueprintSessionCompletion, recordSpeedMathBlueprintResponse } from "./gameAdapters";
import { getOrGenerateGameBlueprint } from "../services/gameContentService";
import { getActiveLearnerId, getLearnerModel, saveLearnerModel, setActiveLearnerId } from "../utils/learnerBrain";
import { getOrCreateDailyLearningRoute, validateDailyLearningRoute } from "../utils/dailyLearningRoute";
import { CURRICULUM_SKILL_NODES } from "../data/curriculumUniverse";
import { resolveActivityDefinition } from "../data/activitySkillRegistry";
import { todayISO } from "../utils/dateUtils";
import { clearGeneratedContentCacheForTests } from "./cache";
import type { SpeedMathPayload } from "./types";

const authState = vi.hoisted(() => ({
  currentUser: null as null | { uid: string; getIdToken: () => Promise<string> },
}));

vi.mock("../firebaseCore", () => ({
  auth: authState,
  saveLearnerModelToCloud: vi.fn().mockResolvedValue(undefined),
  fetchLearnerModelFromCloud: vi.fn().mockResolvedValue(null),
  recordCloudLearningEvent: vi.fn().mockResolvedValue(undefined),
  notifySyncStatus: vi.fn(),
}));

class MemoryStorage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(String(key)) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(String(key)); }
  setItem(key: string, value: string) { this.values.set(String(key), String(value)); }
}

const PAYLOADS: SpeedMathPayload[] = [
  {
    gameType: "speed-math",
    objective: "Practice multiplication facts with friendly space explorers.",
    instructions: "Choose the product that matches each multiplication fact.",
    feedback: { correct: "Great thinking!", incorrect: "Take another look at the groups.", completion: "You finished the multiplication mission!" },
    hints: ["Count equal groups to find the product."],
    voice: { introduction: "Ready for a multiplication mission?" },
    rounds: [
      { leftOperand: 2, rightOperand: 3, answer: 6, choices: [6, 5, 7, 8], explanation: "Two groups of three make six.", hint: "Count three, then count three more." },
      { leftOperand: 3, rightOperand: 4, answer: 12, choices: [12, 10, 14, 16], explanation: "Three groups of four make twelve.", hint: "Add four three times." },
      { leftOperand: 4, rightOperand: 5, answer: 20, choices: [20, 18, 22, 24], explanation: "Four groups of five make twenty.", hint: "Count by fives four times." },
    ],
  },
  {
    gameType: "speed-math",
    objective: "Build multiplication confidence one fact at a time.",
    instructions: "Find the product for each pair of factors.",
    feedback: { correct: "That product is right!", incorrect: "Try grouping the factors again.", completion: "Multiplication mission complete!" },
    hints: ["Use an array or repeated addition."],
    voice: { introduction: "Let's solve a few multiplication facts." },
    rounds: [
      { leftOperand: 2, rightOperand: 4, answer: 8, choices: [8, 6, 10, 12], explanation: "Two groups of four make eight.", hint: "Add four twice." },
      { leftOperand: 3, rightOperand: 5, answer: 15, choices: [15, 12, 18, 20], explanation: "Three groups of five make fifteen.", hint: "Count by fives three times." },
      { leftOperand: 2, rightOperand: 5, answer: 10, choices: [10, 8, 12, 15], explanation: "Two groups of five make ten.", hint: "Add five twice." },
    ],
  },
];

describe("authenticated generated-content learning integration", () => {
  afterEach(() => {
    authState.currentUser = null;
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("authenticates generation, refills and reserves reusable content, adapts a game response, and updates only Learner Brain evidence", async () => {
    const storage = new MemoryStorage();
    vi.stubGlobal("localStorage", storage);
    vi.stubGlobal("window", new EventTarget());
    clearGeneratedContentCacheForTests();

    const learnerId = `generated-route-integration-${Date.now()}`;
    setActiveLearnerId(`generated-route-reset-${learnerId}`);
    setActiveLearnerId(learnerId);
    authState.currentUser = { uid: "firebase-account-integration", getIdToken: async () => "verified-test-token" };

    const learner = getLearnerModel(learnerId);
    const targetSkillId = "math-23-multiplication";
    const targetSkill = CURRICULUM_SKILL_NODES.find((skill) => skill.id === targetSkillId);
    if (!targetSkill) throw new Error("Integration fixture skill is missing from the canonical curriculum.");
    for (const prerequisiteId of targetSkill.prerequisites) {
      learner.skillMastery[prerequisiteId].tier = "practitioner";
    }
    learner.skillMastery[targetSkillId].needsReview = true;
    learner.skillMastery[targetSkillId].strugglesCount = 1;
    learner.skillMastery[targetSkillId].totalAttempts = 1;
    learner.skillMastery[targetSkillId].lastPracticedTimestamp = Date.now() - 24 * 60 * 60 * 1000;
    saveLearnerModel(learner, learnerId);

    const route = getOrCreateDailyLearningRoute(learner, todayISO());
    expect(validateDailyLearningRoute(route)).toEqual([]);
    const routeItem = route.items.find((item) => item.skillId === targetSkillId);
    expect(routeItem?.delivery).toMatchObject({ kind: "generated-content", gameType: "speed-math" });
    if (!routeItem || routeItem.delivery?.kind !== "generated-content") throw new Error("Expected a generated Speed Math route item.");

    const registeredActivity = resolveActivityDefinition(routeItem.activityId);
    expect(registeredActivity.experienceId).toBe(routeItem.experienceId);
    expect(registeredActivity.launch.route).toBe(routeItem.targetTab);
    expect(registeredActivity.launch.targetId).toBe(routeItem.targetId);
    expect(registeredActivity.skillIds).toContain(routeItem.skillId);

    const request = buildContentGenerationRequest(
      learner,
      routeItem.delivery.gameType,
      routeItem.skillId,
      routeItem.delivery.theme,
      3,
      routeItem.delivery.difficulty
    );
    let providerCalls = 0;
    const provider = {
      name: "integration-gemini-boundary",
      generateStructuredContent: vi.fn(async () => JSON.stringify(PAYLOADS[Math.min(providerCalls++, PAYLOADS.length - 1)])),
    } satisfies StructuredContentProvider;
    const verifiedTokens: string[] = [];
    const app = express();
    app.use(express.json());
    app.use(createContentGenerationRouter({
      verifier: {
        verify: async (token) => {
          verifiedTokens.push(token);
          return token === "verified-test-token" ? { uid: "firebase-account-integration" } : null;
        },
      },
      quotaStore: {
        consume: async (request) => ({
          allowed: true,
          organizationId: request.organizationId ?? null,
          scope: request.organizationId ? "user+organization" : "user",
          dailyLimitUnits: 20,
          remainingDailyUnits: 19,
          resetAt: request.now + 60_000,
        }),
      },
      coordinator: new ContentGenerationCoordinator(),
      provider,
      persistBlueprint: async () => true,
      apiKeyAvailable: () => true,
    }));
    const server: Server = app.listen(0, "127.0.0.1");
    await new Promise<void>((resolve) => server.once("listening", resolve));
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("Integration server did not bind to a TCP port.");
    const baseUrl = `http://127.0.0.1:${address.port}`;
    const originalFetch = globalThis.fetch;
    const scopedFetch: typeof fetch = (input, init) => {
      const target = typeof input === "string" && input.startsWith("/") ? new URL(input, baseUrl) : input;
      return originalFetch(target, init);
    };
    vi.stubGlobal("fetch", scopedFetch);

    try {
      const pool = new ContentPoolManager(new LocalStorageContentPoolRepository());
      const beforeRequest = vi.fn();
      const admittedGeneration = vi.fn();
      const result = await getOrGenerateGameBlueprint(request, learnerId, {
        poolManager: pool,
        beforeRequest,
        onGenerationAdmitted: admittedGeneration,
      });
      expect(result.source).toBe("generated");
      expect(result.cached).toBe(true);
      if (result.blueprint.gameType !== "speed-math") throw new Error("The route did not receive its registered Speed Math renderer blueprint.");
      expect(providerCalls).toBe(2);
      expect(verifiedTokens).toEqual(["verified-test-token", "verified-test-token"]);
      expect(beforeRequest).toHaveBeenCalledTimes(2);
      expect(admittedGeneration).toHaveBeenCalledTimes(2);

      const compatibleLearnerId = `${learnerId}-compatible`;
      const compatibleRequest = {
        ...request,
        learnerContext: {
          ...request.learnerContext,
          masteryBand: "developing" as const,
          recentIncorrectCount: Math.min(10, request.learnerContext.recentIncorrectCount + 1),
        },
      };
      const reused = await getOrGenerateGameBlueprint(compatibleRequest, compatibleLearnerId, { poolManager: pool });
      expect(reused.source).toBe("cache");
      expect(providerCalls).toBe(2);
      expect(await pool.getAvailableContent(request, compatibleLearnerId)).toHaveLength(1);

      const displayedRound = adaptSpeedMathRound(result.blueprint, 0);
      if (!displayedRound) throw new Error("The existing renderer adapter could not display the generated round.");
      expect(displayedRound).toMatchObject({
        id: result.blueprint.content.rounds[0].id,
        prompt: result.blueprint.content.rounds[0].prompt,
        answer: result.blueprint.content.rounds[0].answer,
      });
      recordSpeedMathBlueprintResponse(result.blueprint, 0, displayedRound.answer, learnerId);
      recordBlueprintSessionCompletion(result.blueprint, learnerId);

      const updatedLearner = getLearnerModel(learnerId);
      expect(updatedLearner.skillMastery[targetSkillId].totalAttempts).toBe(2);
      expect(updatedLearner.skillMastery[targetSkillId].successfulAttempts).toBe(1);
      expect(updatedLearner.recentEvents.find((event) => event.eventType === "question_answered")).toMatchObject({
        activityId: "primary-lab-speed-math",
        experienceId: "speed-math-blitz-sprint",
        skillId: targetSkillId,
        eventType: "question_answered",
        outcome: "correct",
      });
      expect(updatedLearner.recentEvents.find((event) => event.eventType === "activity_completed")).toMatchObject({
        activityId: "primary-lab-speed-math",
        outcome: "explored",
      });
      expect(updatedLearner.recentEvents.find((event) => event.eventType === "activity_completed")?.skillId).toBeUndefined();
      expect(getActiveLearnerId()).toBe(learnerId);
      expect(getOrCreateDailyLearningRoute(updatedLearner, todayISO()).items.find((item) => item.skillId === targetSkillId)?.completed).toBe(true);

      await pool.markPlayed(learnerId, result.blueprint);
      expect((await pool.getAvailableContent(request, learnerId)).map((blueprint) => blueprint.metadata.fingerprint))
        .not.toContain(result.blueprint.metadata.fingerprint);
      expect(await pool.getAvailableContent(request, compatibleLearnerId)).toHaveLength(1);
    } finally {
      vi.stubGlobal("fetch", originalFetch);
      await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
  });
});
