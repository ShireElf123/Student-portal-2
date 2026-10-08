import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getSkillGraphNode, validateSkillGraph } from "../data/skillGraph";
import { CURRICULUM_SKILL_NODES } from "../data/curriculumUniverse";
import { resolveActivityDefinition } from "../data/activitySkillRegistry";
import { getSupportedGameEngine } from "../contentEngine/registry";
import { todayISO } from "./dateUtils";
import {
  deriveLearnerSkillState,
  getAdaptiveRecommendationCandidates,
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
      expect(engine.interactionTypes.length).toBeGreaterThan(0);
      expect(engine.skillIds).toContain(multiplication?.id);
    }
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
});
