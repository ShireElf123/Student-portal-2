import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getSkillGraphNode, validateSkillGraph } from "../data/skillGraph";
import { CURRICULUM_SKILL_NODES } from "../data/curriculumUniverse";
import { resolveActivityDefinition } from "../data/activitySkillRegistry";
import { getSupportedGameEngine } from "../contentEngine/registry";
import { todayISO } from "./dateUtils";
import {
  deriveLearnerSkillState,
  getAdaptiveRecommendationCandidates,
  getScaffoldLevel,
  getSpacedReviewIntervalDays,
} from "./adaptiveLearning";
import { getOrCreateDailyLearningRoute, validateDailyLearningRoute } from "./dailyLearningRoute";
import {
  computeRecommendations,
  getInitialLearnerModel,
  getLearnerModel,
  recordLearningEvent,
  saveLearnerModel,
  setActiveLearnerId,
} from "./learnerBrain";

vi.mock("../firebaseCore", () => ({
  saveLearnerModelToCloud: vi.fn().mockResolvedValue(undefined),
  fetchLearnerModelFromCloud: vi.fn().mockResolvedValue(null),
  recordCloudLearningEvent: vi.fn().mockResolvedValue(undefined),
  notifySyncStatus: vi.fn(),
}));

class MemoryStorage {
  private values = new Map<string, string>();

  clear(): void { this.values.clear(); }
  getItem(key: string): string | null { return this.values.get(String(key)) ?? null; }
  setItem(key: string, value: string): void { this.values.set(String(key), String(value)); }
  removeItem(key: string): void { this.values.delete(String(key)); }
  key(index: number): string | null { return [...this.values.keys()][index] ?? null; }
  get length(): number { return this.values.size; }
}

let storage: MemoryStorage;
let learnerId = "adaptive-test-learner";
let learnerCount = 0;
const MULTIPLICATION_SKILL_ID = "math-23-multiplication";

function unlockMultiplicationPrerequisites(targetLearnerId: string): void {
  const learner = getLearnerModel(targetLearnerId);
  const skill = CURRICULUM_SKILL_NODES.find((node) => node.id === MULTIPLICATION_SKILL_ID)!;
  for (const prerequisiteId of skill.prerequisites) learner.skillMastery[prerequisiteId].tier = "practitioner";
  saveLearnerModel(learner, targetLearnerId);
}

function recordMultiplicationResponse(
  id: string,
  result: "success" | "struggle" | "practice",
  timestamp: number,
  hintsUsed = 0
): void {
  recordLearningEvent({
    id,
    learnerId,
    activityId: "primary-lab-speed-math",
    experienceId: "speed-math-blitz-sprint",
    contentId: `${id}:content`,
    eventType: "question_answered",
    activityType: "math-blitz",
    activityTitle: "Adaptive test multiplication response",
    skillId: MULTIPLICATION_SKILL_ID,
    domain: "math",
    gradeBand: "2-3",
    result,
    score: result === "success" ? 100 : result === "practice" ? 50 : 0,
    difficulty: "medium",
    attempts: 1,
    hintsUsed,
    timestamp,
  });
}

describe("evidence-driven adaptive learning", () => {
  beforeEach(() => {
    storage = new MemoryStorage();
    vi.stubGlobal("localStorage", storage);
    vi.stubGlobal("window", new EventTarget());
    learnerId = `adaptive-test-learner-${learnerCount++}`;
    setActiveLearnerId(`adaptive-reset-${learnerCount}`);
    setActiveLearnerId(learnerId);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("builds a validated typed skill graph with prerequisites, extensions, assessments, and renderer capabilities", () => {
    expect(validateSkillGraph()).toEqual([]);
    const multiplication = getSkillGraphNode("math-23-multiplication");
    expect(multiplication).toBeDefined();
    expect(multiplication?.prerequisiteSkillIds.length).toBeGreaterThan(0);
    expect(multiplication?.foundationalSkillIds).toEqual(multiplication?.prerequisiteSkillIds);
    expect(multiplication?.extensionSkillIds.length).toBeGreaterThan(0);
    expect(multiplication?.compatibleGameTypes).toEqual(["speed-math", "times-matrix"]);
    expect(multiplication?.assessmentCapabilities).toContain("guided-assessment");
    expect(multiplication?.difficultyRange).toEqual({ min: 1, max: 5 });

    for (const gameType of multiplication?.compatibleGameTypes ?? []) {
      const engine = getSupportedGameEngine(gameType);
      expect(engine.subjects).toContain("math");
      expect(engine.gradeBands).toContain("2-3");
      expect(engine.difficultyLevels).toEqual([1, 2, 3, 4, 5]);
      expect(engine.interactionTypes).toEqual(["multiple-choice", "timed-response"]);
      expect(engine.interactionTypes).not.toContain("visual-grid");
      expect(engine.skillIds).toContain(multiplication?.id);
    }
    expect(getSupportedGameEngine("bubble-pop-phonics").interactionTypes).toEqual(["tap-to-select", "letter-recognition"]);
  });

  it("routes an incorrect response through learner state, recovery recommendation, and a refreshed compatible route", () => {
    const date = todayISO();
    const learner = getInitialLearnerModel(learnerId);
    const firstRoute = getOrCreateDailyLearningRoute(learner, date);
    expect(firstRoute.items).toHaveLength(3);
    expect(validateDailyLearningRoute(firstRoute)).toEqual([]);
    const target = firstRoute.items[0];
    const skill = CURRICULUM_SKILL_NODES.find((node) => node.id === target.skillId);
    if (!skill) throw new Error(`Route skill ${target.skillId} is not in the canonical curriculum.`);

    recordLearningEvent({
      id: "adaptive-route-incorrect-response",
      learnerId,
      activityId: target.activityId,
      experienceId: target.experienceId,
      contentId: `${target.skillId}:adaptive-question-1`,
      eventType: "question_answered",
      activityType: "curriculum-quiz",
      activityTitle: `${target.title}: a practice question`,
      skillId: target.skillId,
      domain: skill.domain,
      gradeBand: skill.gradeBand,
      result: "struggle",
      score: 0,
      difficulty: "easy",
      attempts: 1,
      hintsUsed: 0,
      timestamp: Date.now(),
    });

    const updatedModel = getLearnerModel(learnerId);
    const skillState = deriveLearnerSkillState(updatedModel, target.skillId);
    expect(skillState).toMatchObject({
      totalAttempts: 1,
      recentAccuracy: 0,
      recentIncorrectCount: 1,
      needsReview: true,
    });
    expect(updatedModel.recentEvents[0]).toMatchObject({
      id: "adaptive-route-incorrect-response",
      outcome: "incorrect",
      skillId: target.skillId,
    });

    const recommendation = computeRecommendations(updatedModel).find((action) => action.skillId === target.skillId);
    expect(recommendation).toMatchObject({ category: "recovery", reasonCode: "recent-mistake", urgency: "high" });

    const refreshedRoute = getOrCreateDailyLearningRoute(updatedModel, date);
    expect(refreshedRoute.generatedFromEventCount).toBe(updatedModel.totalLearningEventsCount);
    expect(refreshedRoute.items.map((item) => item.skillId)).not.toEqual(firstRoute.items.map((item) => item.skillId));
    expect(refreshedRoute.items).toContainEqual(expect.objectContaining({
      skillId: target.skillId,
      recommendationCategory: "recovery",
      phase: "focus",
      completed: false,
    }));
    expect(validateDailyLearningRoute(refreshedRoute)).toEqual([]);

    for (const item of refreshedRoute.items) {
      const activity = resolveActivityDefinition(item.activityId);
      expect(activity.experienceId).toBe(item.experienceId);
      expect(activity.skillIds).toContain(item.skillId);
      expect(activity.launch.route).toBe(item.targetTab);
      expect(activity.launch.targetId).toBe(item.targetId);
      if (item.delivery?.kind === "generated-content") {
        const engine = getSupportedGameEngine(item.delivery.gameType);
        expect(engine.activityId).toBe(item.activityId);
        expect(engine.skillIds).toContain(item.skillId);
      }
    }
  });

  it("emits prerequisite-foundation candidates and keeps recommendation order deterministic", () => {
    const model = getInitialLearnerModel(learnerId);
    const targetSkillId = "math-23-multiplication";
    const target = CURRICULUM_SKILL_NODES.find((node) => node.id === targetSkillId);
    if (!target) throw new Error("Multiplication fixture skill is missing.");
    const unlockAncestors = (skillId: string, visited = new Set<string>()) => {
      if (visited.has(skillId)) return;
      visited.add(skillId);
      const node = CURRICULUM_SKILL_NODES.find((candidate) => candidate.id === skillId);
      for (const prerequisiteId of node?.prerequisites ?? []) {
        unlockAncestors(prerequisiteId, visited);
        model.skillMastery[prerequisiteId].tier = "practitioner";
      }
    };
    for (const prerequisiteId of target.prerequisites) {
      unlockAncestors(prerequisiteId);
      model.skillMastery[prerequisiteId].tier = "novice";
    }
    const targetRecord = model.skillMastery[targetSkillId];
    targetRecord.tier = "novice";
    targetRecord.totalAttempts = 2;
    targetRecord.strugglesCount = 1;
    targetRecord.needsReview = true;
    targetRecord.lastPracticedTimestamp = 1_790_000_000_000;

    const now = 1_790_000_000_000 + 60_000;
    const first = getAdaptiveRecommendationCandidates(model, { now, limit: 20 });
    const second = getAdaptiveRecommendationCandidates(model, { now, limit: 20 });
    expect(first).toEqual(second);
    const foundations = first.filter((candidate) => candidate.category === "foundation");
    expect(foundations.length).toBeGreaterThan(0);
    expect(foundations.every((candidate) => target.prerequisites.includes(candidate.skillId))).toBe(true);
  });

  it("uses explicit misconception evidence and keeps difficulty within graph bounds", () => {
    const model = getInitialLearnerModel(learnerId);
    const skillId = "math-23-multiplication";
    const graph = getSkillGraphNode(skillId)!;
    const skill = CURRICULUM_SKILL_NODES.find((node) => node.id === skillId)!;
    for (const prerequisiteId of skill.prerequisites) model.skillMastery[prerequisiteId].tier = "practitioner";
    model.skillMastery[skillId].currentDifficultyLevel = graph.difficultyRange.max;
    saveLearnerModel(model, learnerId);

    recordLearningEvent({
      id: "adaptive-misconception-signal",
      learnerId,
      activityId: "primary-lab-speed-math",
      experienceId: "speed-math-blitz-sprint",
      eventType: "question_answered",
      activityType: "math-blitz",
      activityTitle: "Generated multiplication response",
      skillId,
      domain: "math",
      gradeBand: "2-3",
      result: "struggle",
      score: 0,
      difficulty: "hard",
      attempts: 1,
      hintsUsed: 0,
      misconceptionTags: ["off-by-one-calculation"],
      timestamp: Date.now(),
    });

    const updated = getLearnerModel(learnerId);
    const state = deriveLearnerSkillState(updated, skillId);
    expect(state.misconceptionSignals).toEqual([
      expect.objectContaining({ tag: "off-by-one-calculation", occurrences: 1 }),
    ]);
    expect(state.difficultyLevel).toBe(graph.difficultyRange.max);
    expect(updated.skillMastery[skillId].currentDifficultyLevel).toBe(graph.difficultyRange.max);
  });

  it("keeps prerequisite readiness explicit and prefers NEXT skills aligned to the learner's grade band", () => {
    const model = getInitialLearnerModel(learnerId);
    const skill = CURRICULUM_SKILL_NODES.find((node) => node.id === MULTIPLICATION_SKILL_ID)!;
    expect(deriveLearnerSkillState(model, skill.id).isUnlocked).toBe(false);
    expect(deriveLearnerSkillState(model, skill.id).prerequisiteReadiness).toBe(0);

    for (const prerequisiteId of skill.prerequisites) model.skillMastery[prerequisiteId].tier = "practitioner";
    expect(deriveLearnerSkillState(model, skill.id).isUnlocked).toBe(true);
    expect(deriveLearnerSkillState(model, skill.id).prerequisiteReadiness).toBe(100);

    const earlyPrimary = getInitialLearnerModel(`${learnerId}-grade-k1`);
    earlyPrimary.gradeBand = "K-1";
    saveLearnerModel(earlyPrimary, earlyPrimary.learnerId);
    const nextCandidates = getAdaptiveRecommendationCandidates(earlyPrimary, { limit: 100 })
      .filter((candidate) => candidate.category === "next");
    expect(nextCandidates.length).toBeGreaterThan(0);
    expect(getSkillGraphNode(nextCandidates[0].skillId)?.gradeBand).toBe("K-1");
  });

  it("requires multiple successful responses before mastery can open a challenge", () => {
    unlockMultiplicationPrerequisites(learnerId);
    const start = Date.now() - 1_000;
    recordMultiplicationResponse("mastery-evidence-1", "success", start);
    let model = getLearnerModel(learnerId);
    expect(model.skillMastery[MULTIPLICATION_SKILL_ID].tier).not.toBe("master");
    expect(getAdaptiveRecommendationCandidates(model).some((candidate) => candidate.category === "challenge")).toBe(false);

    for (let index = 2; index <= 4; index += 1) {
      recordMultiplicationResponse(`mastery-evidence-${index}`, "success", start + index);
    }
    model = getLearnerModel(learnerId);
    expect(model.skillMastery[MULTIPLICATION_SKILL_ID]).toMatchObject({
      tier: "master",
      successfulAttempts: 4,
      evidenceScore: 96,
    });
    expect(model.skillMastery[MULTIPLICATION_SKILL_ID].confidence).toBeGreaterThanOrEqual(55);
    const challenge = getAdaptiveRecommendationCandidates(model).find((candidate) => candidate.category === "challenge");
    expect(challenge).toBeDefined();
    expect(getSkillGraphNode(challenge!.skillId)?.prerequisiteSkillIds).toContain(MULTIPLICATION_SKILL_ID);
  });

  it("raises difficulty after sustained unassisted success, holds mixed evidence, and lowers after repeated struggle", () => {
    unlockMultiplicationPrerequisites(learnerId);
    const start = Date.now() - 10_000;
    recordMultiplicationResponse("difficulty-success-1", "success", start);
    recordMultiplicationResponse("difficulty-success-2", "success", start + 1);
    expect(getLearnerModel(learnerId).skillMastery[MULTIPLICATION_SKILL_ID].currentDifficultyLevel).toBe(1);
    recordMultiplicationResponse("difficulty-success-3", "success", start + 2);
    expect(getLearnerModel(learnerId).skillMastery[MULTIPLICATION_SKILL_ID].currentDifficultyLevel).toBe(2);

    recordMultiplicationResponse("difficulty-mixed-success", "success", start + 3);
    recordMultiplicationResponse("difficulty-mixed-error", "struggle", start + 4);
    expect(getLearnerModel(learnerId).skillMastery[MULTIPLICATION_SKILL_ID].currentDifficultyLevel).toBe(2);
    recordMultiplicationResponse("difficulty-partial", "practice", start + 5);
    recordMultiplicationResponse("difficulty-error-1", "struggle", start + 6);
    expect(getLearnerModel(learnerId).skillMastery[MULTIPLICATION_SKILL_ID].currentDifficultyLevel).toBe(2);
    recordMultiplicationResponse("difficulty-error-2", "struggle", start + 7);

    const model = getLearnerModel(learnerId);
    const state = deriveLearnerSkillState(model, MULTIPLICATION_SKILL_ID);
    expect(model.skillMastery[MULTIPLICATION_SKILL_ID].currentDifficultyLevel).toBe(1);
    expect(state.difficultyLevel).toBeGreaterThanOrEqual(getSkillGraphNode(MULTIPLICATION_SKILL_ID)!.difficultyRange.min);
    expect(state.difficultyLevel).toBeLessThanOrEqual(getSkillGraphNode(MULTIPLICATION_SKILL_ID)!.difficultyRange.max);
    expect(getScaffoldLevel(state)).toBe(2);
  });

  it("marks evidence freshness and recommends spaced REVIEW at a confidence-adjusted interval", () => {
    const model = getInitialLearnerModel(learnerId);
    const initialState = deriveLearnerSkillState(model, MULTIPLICATION_SKILL_ID);
    expect(initialState).toMatchObject({ evidenceFreshness: "unseen", reviewIntervalDays: 3 });
    expect(getSpacedReviewIntervalDays({
      tier: "novice",
      totalAttempts: 1,
      confidence: 10,
      recentAccuracy: 0,
      consistency: 0,
      struggleScore: 0.8,
    })).toBe(2);

    unlockMultiplicationPrerequisites(learnerId);
    const practicedAt = 1_790_000_000_000;
    recordMultiplicationResponse("review-success-1", "success", practicedAt);
    recordMultiplicationResponse("review-success-2", "success", practicedAt + 1);
    const practicedModel = getLearnerModel(learnerId);
    const practicedState = deriveLearnerSkillState(practicedModel, MULTIPLICATION_SKILL_ID, practicedAt + 1);
    expect(practicedState).toMatchObject({ tier: "practitioner", reviewIntervalDays: 7, evidenceFreshness: "fresh" });

    const agingNow = practicedAt + 6 * 24 * 60 * 60 * 1000;
    expect(deriveLearnerSkillState(practicedModel, MULTIPLICATION_SKILL_ID, agingNow).evidenceFreshness).toBe("aging");
    const dueNow = practicedAt + 8 * 24 * 60 * 60 * 1000;
    const dueState = deriveLearnerSkillState(practicedModel, MULTIPLICATION_SKILL_ID, dueNow);
    expect(dueState.evidenceFreshness).toBe("due");
    expect(getAdaptiveRecommendationCandidates(practicedModel, { now: dueNow })
      .find((candidate) => candidate.skillId === MULTIPLICATION_SKILL_ID)?.category).toBe("review");
    const reviewRoute = getOrCreateDailyLearningRoute(practicedModel, todayISO(new Date(dueNow)));
    expect(reviewRoute.items.some((item) => item.skillId === MULTIPLICATION_SKILL_ID &&
      item.recommendationCategory === "review")).toBe(true);
    expect(validateDailyLearningRoute(reviewRoute)).toEqual([]);
    expect(getSpacedReviewIntervalDays({
      tier: "master",
      totalAttempts: 4,
      confidence: 60,
      recentAccuracy: 1,
      consistency: 1,
      struggleScore: 0,
    })).toBe(14);
  });
});
