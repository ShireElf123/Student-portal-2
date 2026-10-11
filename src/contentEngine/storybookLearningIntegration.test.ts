import express from "express";
import type { Server } from "node:http";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContentGenerationCoordinator, createContentGenerationRouter } from "../../server/contentApi";
import type { StructuredContentProvider } from "./generation";
import { ContentPoolManager } from "./contentPoolManager";
import { LocalStorageContentPoolRepository } from "./contentPoolRepository";
import { buildContentGenerationRequest } from "./learnerContext";
import {
  recordBlueprintSessionCompletion,
  recordStorybookComprehensionResponse,
} from "./gameAdapters";
import { getOrGenerateGameBlueprint } from "../services/gameContentService";
import {
  getActiveLearnerId,
  getInitialLearnerModel,
  getLearnerModel,
  recordLearningEvent,
  setActiveLearnerId,
} from "../utils/learnerBrain";
import { getOrCreateDailyLearningRoute, validateDailyLearningRoute } from "../utils/dailyLearningRoute";
import { findStaticPictureBookForSkill, adaptStorybookBlueprintToPictureBook } from "./storybookAdapter";
import { getSupportedGameEngine } from "./registry";
import { todayISO } from "../utils/dateUtils";
import { deriveLearnerSkillState, getAdaptiveRecommendationCandidates } from "../utils/adaptiveLearning";
import { clearGeneratedContentCacheForTests } from "./cache";
import type { StorybookComprehensionPayload } from "./types";

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

const feedback = {
  correct: "You remembered a useful story detail!",
  incorrect: "Good try. Look back at the story for a clue.",
  completion: "You finished the story trail!",
};

const STORYBOOK_VARIANTS: StorybookComprehensionPayload[] = [
  {
    gameType: "storybook-comprehension",
    objective: "Listen carefully and remember details from a story.",
    instructions: "Listen to each page, then choose the answer from the story.",
    feedback,
    hints: ["Listen for the details that help answer the question."],
    voice: { introduction: "Let's follow Mila's story and remember what happens." },
    storyTitle: "Mila and the Golden Acorn",
    storySummary: "Mila follows a golden acorn through the garden and shares it with a friend.",
    rounds: [
      { title: "A Small Treasure", text: "Mila the squirrel finds a golden acorn beside the old oak tree.", prompt: "What does Mila find beside the oak tree?", questionType: "key-detail", options: ["A golden acorn", "A blue shell", "A red scarf"], correctOptionIndex: 0, evidenceText: "a golden acorn", explanation: "The page says Mila finds a golden acorn beside the tree.", hint: "Listen for the small treasure Mila found." },
      { title: "Along the Path", text: "Mila follows a bright leaf along the path before the rain begins to fall.", prompt: "What happens before the rain begins?", questionType: "event-order", options: ["Mila follows a bright leaf", "The stars come out", "Mila eats breakfast"], correctOptionIndex: 0, evidenceText: "Mila follows a bright leaf along the path", explanation: "First, Mila follows the leaf. Then the rain begins.", hint: "Think about what Mila does first on the path." },
      { title: "A Friendly Face", text: "At the garden gate, Mila sees her friend Pip carrying a little blue basket.", prompt: "Who does Mila meet at the garden gate?", questionType: "key-detail", options: ["Pip", "A sleepy owl", "A little fish"], correctOptionIndex: 0, evidenceText: "her friend Pip", explanation: "Mila sees her friend Pip at the gate.", hint: "Listen for the name of Mila's friend." },
      { title: "Planting Together", text: "Mila and Pip place the acorn in soft soil after they find a sunny garden spot.", prompt: "What do Mila and Pip do after finding a sunny spot?", questionType: "event-order", options: ["Mila and Pip place the acorn", "They build a snow fort", "They sail a boat"], correctOptionIndex: 0, evidenceText: "Mila and Pip place the acorn", explanation: "After they find a sunny place, Mila and Pip plant the acorn.", hint: "What do they do with the acorn next?" },
      { title: "A New Sprout", text: "Weeks later, a green sprout grows, and Mila and Pip smile at their little tree.", prompt: "What grows weeks later?", questionType: "key-detail", options: ["A green sprout", "A tall tower", "A paper kite"], correctOptionIndex: 0, evidenceText: "a green sprout grows", explanation: "The page tells us that a green sprout grows.", hint: "Look for the new green thing in the garden." },
    ],
  },
  {
    gameType: "storybook-comprehension",
    objective: "Listen to a story and notice what happens first and next.",
    instructions: "Listen to each page, then choose the answer supported by the story.",
    feedback,
    hints: ["Listen for the details that help answer the question."],
    voice: { introduction: "Let's follow Pip and Mina on a kite-day adventure." },
    storyTitle: "Pip and the Blue Kite",
    storySummary: "Pip and Mina find a kite, follow its trail, and fly it together.",
    rounds: [
      { title: "By the Pond", text: "Pip the rabbit spots a blue kite beside the quiet pond.", prompt: "What does Pip spot beside the pond?", questionType: "key-detail", options: ["A blue kite", "A red apple", "A tiny drum"], correctOptionIndex: 0, evidenceText: "a blue kite", explanation: "Pip spots a blue kite beside the pond.", hint: "Listen for the colorful thing Pip finds." },
      { title: "Following the Ribbon", text: "Pip follows the kite's yellow ribbon from the pond to a sunny meadow.", prompt: "Where does Pip go after the pond?", questionType: "event-order", options: ["To a sunny meadow", "To a tall mountain", "To a busy city"], correctOptionIndex: 0, evidenceText: "from the pond to a sunny meadow", explanation: "Pip follows the ribbon from the pond to the meadow.", hint: "Think about where the ribbon leads Pip next." },
      { title: "Mina Helps", text: "In the meadow, Pip's friend Mina holds the ribbon while Pip lifts the kite.", prompt: "Who holds the ribbon?", questionType: "key-detail", options: ["Mina", "A brown bear", "A green frog"], correctOptionIndex: 0, evidenceText: "Mina holds the ribbon", explanation: "Mina holds the ribbon while Pip lifts the kite.", hint: "Listen for Pip's friend's name." },
      { title: "Up It Goes", text: "After Mina counts to three, Pip lets go and the blue kite rises into the breeze.", prompt: "What happens after Mina counts to three?", questionType: "event-order", options: ["Pip lets go and the blue kite rises", "The pond turns to ice", "Mina picks a flower"], correctOptionIndex: 0, evidenceText: "Pip lets go and the blue kite rises", explanation: "Mina counts, then Pip lets go and the kite rises.", hint: "What does Pip do next?" },
      { title: "A Shared Snack", text: "When the kite lands, Pip and Mina share apple slices under a shady tree.", prompt: "What snack do Pip and Mina share?", questionType: "key-detail", options: ["Apple slices", "Warm soup", "Blueberries"], correctOptionIndex: 0, evidenceText: "share apple slices", explanation: "The story says Pip and Mina share apple slices.", hint: "Listen for the snack they share together." },
    ],
  },
];

describe("storybook comprehension vertical learning slice", () => {
  afterEach(() => {
    authState.currentUser = null;
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("routes a canonical skill through generated content, the picture-book adapter, scored evidence, and a deterministic recovery route", async () => {
    const storage = new MemoryStorage();
    vi.stubGlobal("localStorage", storage);
    vi.stubGlobal("window", new EventTarget());
    clearGeneratedContentCacheForTests();

    const learnerId = `storybook-route-${Date.now()}`;
    const secondLearnerId = `${learnerId}-second`;
    setActiveLearnerId(`storybook-route-reset-${learnerId}`);
    setActiveLearnerId(learnerId);
    authState.currentUser = { uid: "firebase-storybook-test", getIdToken: async () => "storybook-test-token" };

    const skillId = "read-k1-listening-comprehension";
    const date = todayISO();
    const previousDay = Date.now() - 24 * 60 * 60 * 1000;
    recordLearningEvent({
      id: "storybook-practice-seed",
      learnerId,
      activityId: "picture-book-interaction",
      experienceId: "picture-book-reader",
      contentId: "curated-story:practice-seed",
      eventType: "question_answered",
      activityType: "storybook-interaction",
      activityTitle: "Story detail practice",
      skillId,
      domain: "reading",
      gradeBand: "K-1",
      result: "success",
      score: 100,
      difficulty: "easy",
      attempts: 1,
      hintsUsed: 0,
      timestamp: previousDay,
    });

    const initialRoute = getOrCreateDailyLearningRoute(getLearnerModel(learnerId), date);
    expect(validateDailyLearningRoute(initialRoute)).toEqual([]);
    const routeItem = initialRoute.items.find((item) => item.skillId === skillId);
    expect(routeItem).toMatchObject({
      activityId: "picture-book-interaction",
      targetTab: "toddler",
      targetId: "books",
      recommendationCategory: "practice",
      delivery: { kind: "generated-content", gameType: "storybook-comprehension" },
    });
    if (!routeItem || routeItem.delivery?.kind !== "generated-content") throw new Error("Expected a generated storybook route item.");
    expect(getSupportedGameEngine(routeItem.delivery.gameType)).toMatchObject({
      skillIds: [skillId],
      activityId: routeItem.activityId,
      experienceId: routeItem.experienceId,
    });

    const request = buildContentGenerationRequest(
      getLearnerModel(learnerId),
      routeItem.delivery.gameType,
      skillId,
      routeItem.delivery.theme,
      5,
      routeItem.delivery.difficulty
    );
    let providerCalls = 0;
    let failGeneration = false;
    const provider: StructuredContentProvider = {
      name: "storybook-test-structured-provider",
      generateStructuredContent: vi.fn(async () => {
        if (failGeneration) return "not JSON";
        const payload = STORYBOOK_VARIANTS[Math.min(providerCalls++, STORYBOOK_VARIANTS.length - 1)];
        return JSON.stringify(payload);
      }),
    };
    const verifiedTokens: string[] = [];
    const quotaCalls: string[] = [];
    const app = express();
    app.use(express.json());
    app.use(createContentGenerationRouter({
      verifier: {
        verify: async (token) => {
          verifiedTokens.push(token);
          return token === "storybook-test-token" ? { uid: "firebase-storybook-test" } : null;
        },
      },
      quotaStore: {
        consume: async (quotaRequest) => {
          quotaCalls.push(quotaRequest.uid);
          return {
            allowed: true,
            organizationId: quotaRequest.organizationId ?? null,
            scope: quotaRequest.organizationId ? "user+organization" : "user",
            dailyLimitUnits: 20,
            remainingDailyUnits: 19,
            resetAt: quotaRequest.now + 60_000,
          };
        },
      },
      coordinator: new ContentGenerationCoordinator(),
      provider,
      persistBlueprint: async () => true,
      apiKeyAvailable: () => true,
    }));
    const server: Server = app.listen(0, "127.0.0.1");
    await new Promise<void>((resolve) => server.once("listening", resolve));
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("Storybook integration server did not bind to a TCP port.");
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
      const generated = await getOrGenerateGameBlueprint(request, learnerId, {
        poolManager: pool,
        beforeRequest,
        onGenerationAdmitted: admittedGeneration,
      });
      expect(generated.source).toBe("generated");
      expect(generated.blueprint.gameType).toBe("storybook-comprehension");
      expect(providerCalls).toBe(2);
      expect(verifiedTokens).toEqual(["storybook-test-token", "storybook-test-token"]);
      expect(quotaCalls).toEqual(["firebase-storybook-test", "firebase-storybook-test"]);
      expect(beforeRequest).toHaveBeenCalledTimes(2);
      expect(admittedGeneration).toHaveBeenCalledTimes(2);

      if (generated.blueprint.gameType !== "storybook-comprehension") throw new Error("The route did not receive a Storybook blueprint.");
      const renderedBook = adaptStorybookBlueprintToPictureBook(generated.blueprint);
      expect(renderedBook.pages).toHaveLength(5);
      expect(renderedBook.pages[0]).toMatchObject({
        title: generated.blueprint.content.rounds[0].title,
        text: generated.blueprint.content.rounds[0].text,
        narration: generated.blueprint.content.rounds[0].narration,
        illustration: expect.any(String),
        learningInteraction: {
          id: generated.blueprint.content.rounds[0].id,
          questionType: "key-detail",
          skillId,
        },
      });
      expect(renderedBook.pages[1].learningInteraction?.questionType).toBe("event-order");

      const firstResponseId = "storybook-session-a:page-1:first";
      const wrongResponse = recordStorybookComprehensionResponse(generated.blueprint, 0, 1, learnerId, 1, firstResponseId);
      const duplicateResponse = recordStorybookComprehensionResponse(generated.blueprint, 0, 1, learnerId, 1, firstResponseId);
      expect(duplicateResponse.id).toBe(wrongResponse.id);
      recordStorybookComprehensionResponse(generated.blueprint, 1, 1, learnerId, 0, "storybook-session-a:page-2:first");
      recordBlueprintSessionCompletion(generated.blueprint, learnerId, "storybook-session-a");
      recordBlueprintSessionCompletion(generated.blueprint, learnerId, "storybook-session-a");

      const learnerAfterResponses = getLearnerModel(learnerId);
      expect(learnerAfterResponses.skillMastery[skillId].totalAttempts).toBe(3);
      expect(learnerAfterResponses.recentEvents.filter((event) => event.eventType === "question_answered")).toHaveLength(3);
      expect(learnerAfterResponses.recentEvents.filter((event) => event.eventType === "activity_completed")).toHaveLength(1);
      expect(learnerAfterResponses.recentEvents.find((event) => event.id === wrongResponse.id)).toMatchObject({
        learnerId,
        activityId: "picture-book-interaction",
        experienceId: "picture-book-reader",
        skillId,
        outcome: "incorrect",
        misconceptionTags: ["story-detail-recall"],
        hintsUsed: 1,
        metadata: { questionType: "key-detail", evidenceText: generated.blueprint.content.rounds[0].evidenceText },
      });
      const skillState = deriveLearnerSkillState(learnerAfterResponses, skillId);
      expect(skillState.misconceptionTags).toEqual(expect.arrayContaining(["story-detail-recall", "event-order-confusion"]));
      expect(getAdaptiveRecommendationCandidates(learnerAfterResponses).find((candidate) => candidate.skillId === skillId))
        .toMatchObject({ category: "recovery", reasonCode: "recent-mistake" });

      const updatedRoute = getOrCreateDailyLearningRoute(learnerAfterResponses, date);
      expect(updatedRoute.generatedFromEventCount).toBeGreaterThan(initialRoute.generatedFromEventCount);
      expect(updatedRoute.items.find((item) => item.skillId === skillId)).toMatchObject({
        recommendationCategory: "recovery",
        activityId: "picture-book-interaction",
        delivery: { kind: "generated-content", gameType: "storybook-comprehension" },
        completed: false,
      });
      expect(validateDailyLearningRoute(updatedRoute)).toEqual([]);

      await pool.markPlayed(learnerId, generated.blueprint);
      const varied = await getOrGenerateGameBlueprint(request, learnerId, { poolManager: pool });
      expect(varied.source).toBe("cache");
      expect(varied.blueprint.metadata.fingerprint).not.toBe(generated.blueprint.metadata.fingerprint);
      expect(providerCalls).toBe(2);

      setActiveLearnerId(secondLearnerId);
      const secondLearner = getInitialLearnerModel(secondLearnerId);
      const secondRequest = buildContentGenerationRequest(
        secondLearner,
        "storybook-comprehension",
        skillId,
        request.theme,
        5,
        request.difficulty
      );
      const sharedContent = await getOrGenerateGameBlueprint(secondRequest, secondLearnerId, { poolManager: pool });
      expect(sharedContent.source).toBe("cache");
      expect(sharedContent.blueprint.gameType).toBe("storybook-comprehension");
      if (sharedContent.blueprint.gameType !== "storybook-comprehension") throw new Error("The shared pool returned a different renderer type.");
      recordStorybookComprehensionResponse(
        sharedContent.blueprint,
        0,
        sharedContent.blueprint.content.rounds[0].correctOptionIndex,
        secondLearnerId,
        0,
        "storybook-session-b:page-1:first"
      );
      expect(getActiveLearnerId()).toBe(secondLearnerId);
      expect(getLearnerModel(secondLearnerId).skillMastery[skillId].totalAttempts).toBe(1);
      expect(getLearnerModel(secondLearnerId).recentEvents[0]).toMatchObject({ learnerId: secondLearnerId, outcome: "correct" });
      expect(getLearnerModel(learnerId).skillMastery[skillId].totalAttempts).toBe(3);
      expect(getLearnerModel(learnerId).recentEvents.every((event) => event.learnerId === learnerId)).toBe(true);

      failGeneration = true;
      const fallbackTheme = request.theme === "ocean" ? "garden" : "ocean";
      const fallbackRequest = buildContentGenerationRequest(
        getLearnerModel(learnerId),
        "storybook-comprehension",
        skillId,
        fallbackTheme,
        5,
        request.difficulty
      );
      await expect(getOrGenerateGameBlueprint(fallbackRequest, learnerId, { poolManager: pool })).rejects.toThrow();
      expect(await pool.getAvailableContent(fallbackRequest, learnerId)).toHaveLength(0);
      const fallback = findStaticPictureBookForSkill(skillId);
      expect(fallback).not.toBeNull();
      expect(fallback?.book.pages[fallback.pageIndex].learningInteraction?.skillId).toBe(skillId);
      expect(providerCalls).toBe(2);
      expect(verifiedTokens[verifiedTokens.length - 1]).toBe("storybook-test-token");
    } finally {
      vi.stubGlobal("fetch", originalFetch);
      await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
  });
});
