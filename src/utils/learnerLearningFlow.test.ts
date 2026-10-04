import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AssessmentResult } from "../types";
import { CURRICULUM_SKILL_NODES } from "../data/curriculumUniverse";
import { resolveActivityDefinition } from "../data/activitySkillRegistry";
import { GUIDED_ASSESSMENTS } from "../data/assessmentTemplates";
import { recordAssessmentResultEvidence } from "./assessmentEvidence";
import { todayISO } from "./dateUtils";
import { getOrCreateDailyLearningRoute, validateDailyLearningRoute } from "./dailyLearningRoute";
import {
  computeRecommendations,
  getInitialLearnerModel,
  getLearnerModel,
  recordLearningEvent,
  setActiveLearnerId,
} from "./learnerBrain";
import { evaluateDiagnosticAnswers, getSavedDiagnosticResult } from "./pedagogicalEngine";
import { ALL_TODDLER_WORLDS } from "../data/toddler/toddlerWorldsArchitecture";
import { recordActivityCompletion } from "../data/toddler/toddlerProgressManager";
import {
  GUEST_LEARNER_ID,
  getScopedStorageKey,
  migrateLegacyAccountData,
  readScopedJSON,
} from "./accountStorage";

vi.mock("../firebaseCore", () => ({
  saveLearnerModelToCloud: vi.fn().mockResolvedValue(undefined),
  fetchLearnerModelFromCloud: vi.fn().mockResolvedValue(null),
  recordCloudLearningEvent: vi.fn().mockResolvedValue(undefined),
  notifySyncStatus: vi.fn(),
}));

class MemoryStorage {
  private values = new Map<string, string>();

  get length(): number {
    return this.values.size;
  }

  clear(): void {
    this.values.clear();
  }

  getItem(key: string): string | null {
    return this.values.get(String(key)) ?? null;
  }

  key(index: number): string | null {
    return Array.from(this.values.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.values.delete(String(key));
  }

  setItem(key: string, value: string): void {
    this.values.set(String(key), String(value));
  }
}

let storage: MemoryStorage;
let activeTestLearnerId = "integration-learner";
let resetId = 0;

describe("learner evidence and persistence integration", () => {
  beforeEach(() => {
    storage = new MemoryStorage();
    vi.stubGlobal("localStorage", storage);
    vi.stubGlobal("window", new EventTarget());
    activeTestLearnerId = `integration-learner-${resetId++}`;
    // Force the module-level cache to reload from this test's empty storage.
    setActiveLearnerId(`reset-learner-${resetId}`);
    setActiveLearnerId(activeTestLearnerId);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("records a scored learning response, persists it, and completes the matching saved daily-route step", () => {
    const date = "2026-10-04";
    const model = getInitialLearnerModel(activeTestLearnerId);
    const route = getOrCreateDailyLearningRoute(model, date);
    expect(route.items).toHaveLength(3);
    expect(validateDailyLearningRoute(route)).toEqual([]);

    const target = route.items[0];
    const skill = CURRICULUM_SKILL_NODES.find((node) => node.id === target.skillId);
    expect(skill).toBeDefined();
    const routeEvents: Event[] = [];
    window.addEventListener("daily_learning_route_updated", (event) => routeEvents.push(event));

    const timestamp = new Date(`${date}T12:00:00`).getTime();
    recordLearningEvent({
      id: "route-step-response-1",
      learnerId: activeTestLearnerId,
      activityId: target.activityId,
      experienceId: target.experienceId,
      contentId: `${target.skillId}:question-1`,
      eventType: "question_answered",
      activityType: "curriculum-quiz",
      activityTitle: `${target.title}: Question 1`,
      skillId: target.skillId,
      domain: skill!.domain,
      gradeBand: skill!.gradeBand,
      result: "success",
      score: 100,
      difficulty: "easy",
      attempts: 1,
      hintsUsed: 0,
      timestamp,
    });

    const persistedModel = getLearnerModel(activeTestLearnerId);
    expect(persistedModel.skillMastery[target.skillId].totalAttempts).toBe(1);
    expect(persistedModel.recentEvents[0]).toMatchObject({
      id: "route-step-response-1",
      learnerId: activeTestLearnerId,
      activityId: target.activityId,
      experienceId: target.experienceId,
      skillId: target.skillId,
      outcome: "correct",
    });

    const updatedRoute = getOrCreateDailyLearningRoute(persistedModel, date);
    expect(updatedRoute.items[0].completed).toBe(true);
    expect(updatedRoute.items.slice(1).every((item) => !item.completed)).toBe(true);
    expect(routeEvents).toHaveLength(1);
    expect((routeEvents[0] as CustomEvent).detail.items[0].completed).toBe(true);
    expect(storage.getItem(`student_portal_daily_learning_route_v1_${activeTestLearnerId}_${date}`))
      .toContain('"completed":true');
  });

  it("rejects impossible daily-route dates instead of persisting a malformed route", () => {
    expect(() => getOrCreateDailyLearningRoute(getInitialLearnerModel(activeTestLearnerId), "2026-02-30"))
      .toThrow(/Invalid daily route date/);
  });

  it("keeps book opening and page views as engagement, while a mapped answer updates mastery", () => {
    const learnerId = activeTestLearnerId;
    const initial = getLearnerModel(learnerId);
    const skillId = "read-k1-alphabet-letters";
    const base = {
      learnerId,
      activityId: "picture-book-interaction",
      experienceId: "picture-book-reader",
      activityType: "storybook-interaction" as const,
      activityTitle: "A Safari Letter Adventure",
      domain: "general" as const,
      gradeBand: "toddler" as const,
      result: "explored" as const,
      difficulty: "easy" as const,
      attempts: 1,
      hintsUsed: 0,
    };

    recordLearningEvent({
      ...base,
      id: "book-opened",
      contentId: "safari-book",
      eventType: "experience_opened",
    });
    recordLearningEvent({
      ...base,
      id: "book-page-viewed",
      contentId: "safari-book:page-2",
      eventType: "content_explored",
    });
    expect(getLearnerModel(learnerId).skillMastery[skillId].totalAttempts).toBe(0);

    recordLearningEvent({
      ...base,
      id: "book-answer-1",
      contentId: "safari-book:page-2:letter-a:option-0",
      eventType: "question_answered",
      skillId,
      domain: "reading",
      result: "success",
      score: 100,
    });
    expect(getLearnerModel(learnerId).skillMastery[skillId].totalAttempts).toBe(1);
    expect(getLearnerModel(learnerId).recentEvents[0].outcome).toBe("correct");
  });

  it("records each scored guided-assessment item as skill-specific evidence", () => {
    const assessment = GUIDED_ASSESSMENTS.find((entry) => entry.id === "toddler-phonics-basics")!;
    const item = assessment.items.find((entry) => entry.skillId)!;
    const result: AssessmentResult = {
      id: "assessment-result-integration-1",
      assessmentId: assessment.id,
      assessmentTitle: assessment.title,
      targetStage: "toddler",
      studentName: "Test Learner",
      administeredBy: "self",
      date: todayISO(),
      timestamp: Date.now(),
      totalItems: assessment.items.length,
      masteredCount: 1,
      developingCount: 0,
      needsPracticeCount: 0,
      starsAwarded: 0,
      feedbackSummary: "Test result",
      nextLearningStep: "Keep exploring",
      itemScores: { [item.id]: "mastered" },
    };

    recordAssessmentResultEvidence(assessment, result, activeTestLearnerId);

    const model = getLearnerModel(activeTestLearnerId);
    expect(model.skillMastery[item.skillId!].totalAttempts).toBe(1);
    expect(model.recentEvents[0]).toMatchObject({
      activityId: "guided-assessment",
      experienceId: "guided-assessment-bridge",
      contentId: `${assessment.id}:${item.id}`,
      skillId: item.skillId,
      eventType: "assessment_response",
      outcome: "correct",
    });
  });

  it("persists diagnostic answers to correctly graded skills without awarding summary mastery", () => {
    const learnerId = activeTestLearnerId;
    const result = evaluateDiagnosticAnswers({ "diag-2": 0, "diag-4": 1 }, learnerId);
    const model = getLearnerModel(learnerId);

    expect(getSavedDiagnosticResult(learnerId)).toEqual(result);
    expect(model.skillMastery["read-23-vocabulary-morphology"].successfulAttempts).toBe(1);
    expect(model.skillMastery["sci-45-ecosystems"].strugglesCount).toBe(1);
    expect(model.recentEvents.some((event) => event.eventType === "diagnostic_summary" && !event.skillId)).toBe(true);
    expect(model.totalLearningEventsCount).toBe(3);
  });

  it("resolves every recommendation to an activity that can be launched for its exact skill", () => {
    const recommendations = computeRecommendations(getInitialLearnerModel(activeTestLearnerId));
    expect(recommendations.length).toBeGreaterThan(0);

    for (const recommendation of recommendations) {
      const activity = resolveActivityDefinition(recommendation.activityId);
      expect(activity.experienceId).toBe(recommendation.experienceId);
      expect(activity.skillIds).toContain(recommendation.skillId);
      expect(activity.launch.route).toBe(recommendation.targetTab);
      expect(activity.launch.targetId).toBe(recommendation.targetId);
      expect(["engagement", "assessment", "homework", "picture-book"]).not.toContain(activity.experienceType);
    }
  });

  it("isolates learner models and adopts unscoped legacy account data only once", () => {
    const firstLearner = "learner-account-a";
    const secondLearner = "learner-account-b";
    setActiveLearnerId(firstLearner);
    recordLearningEvent({
      id: "learner-a-only-evidence",
      learnerId: firstLearner,
      activityId: "primary-solar-quiz",
      experienceId: "solar-system",
      contentId: "question-1",
      eventType: "question_answered",
      activityType: "solar-system-quiz",
      activityTitle: "Cosmic Astronomy Quiz",
      skillId: "sci-23-solarsystem",
      domain: "science",
      gradeBand: "2-3",
      result: "success",
      score: 100,
      difficulty: "medium",
      attempts: 1,
      hintsUsed: 0,
    });
    setActiveLearnerId(secondLearner);

    expect(getLearnerModel(firstLearner).skillMastery["sci-23-solarsystem"].totalAttempts).toBe(1);
    expect(getLearnerModel(secondLearner).skillMastery["sci-23-solarsystem"].totalAttempts).toBe(0);

    const legacyKey = "my_student_portal_notebooks_v3";
    storage.setItem(legacyKey, JSON.stringify([{ id: "legacy-notebook" }]));
    migrateLegacyAccountData(GUEST_LEARNER_ID);
    expect(storage.getItem(legacyKey)).not.toBeNull();

    migrateLegacyAccountData(firstLearner);
    expect(storage.getItem(getScopedStorageKey(legacyKey, firstLearner))).toContain("legacy-notebook");
    expect(storage.getItem(legacyKey)).toBeNull();

    migrateLegacyAccountData(secondLearner);
    expect(storage.getItem(getScopedStorageKey(legacyKey, secondLearner))).toBeNull();
  });

  it("records all 37 toddler-world completions as mapped mastery evidence or explicit engagement", () => {
    for (const world of ALL_TODDLER_WORLDS) {
      for (const area of world.areas) {
        for (const activity of area.activities) {
          recordActivityCompletion(world.id, area.id, activity.id, 1);
        }
      }
    }

    const model = getLearnerModel(activeTestLearnerId);
    const eventsByActivity = new Map(model.recentEvents.map((event) => [event.activityId, event]));
    let mappedCount = 0;
    let engagementCount = 0;
    for (const world of ALL_TODDLER_WORLDS) {
      for (const area of world.areas) {
        for (const activity of area.activities) {
          const definition = resolveActivityDefinition(activity.id);
          const event = eventsByActivity.get(activity.id);
          expect(event, `${activity.id} did not create learner evidence`).toBeDefined();
          expect(event?.experienceId).toBe("toddler-worlds-navigator");
          if (definition.skillIds.length) {
            mappedCount += 1;
            expect(event?.skillId).toBe(definition.skillIds[0]);
            expect(event?.outcome).toBe("correct");
          } else {
            engagementCount += 1;
            expect(event?.skillId).toBeUndefined();
            expect(event?.outcome).toBe("explored");
          }
        }
      }
    }
    expect(mappedCount + engagementCount).toBe(37);
    expect(mappedCount).toBeGreaterThan(0);
    expect(engagementCount).toBeGreaterThan(0);
  });

  it("claims and cleans up stale unscoped keys after a prior per-account migration", () => {
    const legacyKey = "my_student_portal_notebooks_v3";
    storage.setItem(legacyKey, JSON.stringify([{ id: "old-shared-notebook" }]));
    storage.setItem("my_student_portal_migrated_historical-owner", "true");

    migrateLegacyAccountData("historical-owner");

    expect(storage.getItem(legacyKey)).toBeNull();
    expect(readScopedJSON(legacyKey, null, GUEST_LEARNER_ID)).toBeNull();
  });

  it("does not let learner-specific diagnostic history fall back to the default learner's legacy key", () => {
    const legacyResult = {
      completedAt: 123,
      score: 4,
      total: 12,
      recommendedGradeBand: "K-1",
      recommendedDomainFocus: "Mathematics & Operations",
      recommendedStartingNodeId: "math-k1-counting",
      disciplineScores: {},
      gradeBandScores: {},
    };
    storage.setItem("my_student_portal_diagnostic_profile_v1", JSON.stringify(legacyResult));

    expect(getSavedDiagnosticResult("child-maya")).toBeNull();
    expect(getSavedDiagnosticResult("scholar-primary-1")).toEqual(legacyResult);
  });

  it("does not let a play-only toddler activity award curriculum mastery", () => {
    recordLearningEvent({
      id: "creative-play-only",
      learnerId: activeTestLearnerId,
      activityId: "toddler-color-magic",
      experienceId: "color-magic",
      contentId: "mixed-purple",
      eventType: "creative_interaction",
      activityType: "toddler-color-lab",
      activityTitle: "Mixed a new color",
      domain: "general",
      gradeBand: "toddler",
      result: "explored",
      difficulty: "easy",
      attempts: 1,
      hintsUsed: 0,
    });
    expect(getLearnerModel(activeTestLearnerId).totalLearningEventsCount).toBe(1);
    expect(Object.values(getLearnerModel(activeTestLearnerId).skillMastery)
      .every((record) => record.totalAttempts === 0)).toBe(true);

    expect(() => recordLearningEvent({
      id: "invalid-creative-mastery",
      learnerId: activeTestLearnerId,
      activityId: "toddler-color-magic",
      experienceId: "color-magic",
      contentId: "mixed-purple",
      eventType: "question_answered",
      activityType: "toddler-color-lab",
      activityTitle: "Mixed a new color",
      skillId: "math-k1-shapes",
      domain: "math",
      gradeBand: "toddler",
      result: "success",
      score: 100,
      difficulty: "easy",
      attempts: 1,
      hintsUsed: 0,
    })).toThrow(/not mapped to curriculum skill/);
  });
});
