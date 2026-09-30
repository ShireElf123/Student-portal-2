import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("../../firebaseCore", () => ({
  saveLearnerModelToCloud: vi.fn(async () => {}),
  fetchLearnerModelFromCloud: vi.fn(async () => null),
  recordCloudLearningEvent: vi.fn(async () => {}),
  notifySyncStatus: vi.fn(),
}));

class MemoryStorage implements Storage {
  private data = new Map<string, string>();
  get length(): number {
    return this.data.size;
  }
  clear(): void {
    this.data.clear();
  }
  getItem(key: string): string | null {
    return this.data.has(key) ? this.data.get(key)! : null;
  }
  key(index: number): string | null {
    return Array.from(this.data.keys())[index] ?? null;
  }
  removeItem(key: string): void {
    this.data.delete(key);
  }
  setItem(key: string, value: string): void {
    this.data.set(key, String(value));
  }
}

async function freshBrain() {
  vi.resetModules();
  vi.stubGlobal("localStorage", new MemoryStorage());
  return await import("../learnerBrain");
}

function successEvent(skillId: string, learnerId: string, hintsUsed = 0) {
  return {
    learnerId,
    activityId: `test-${skillId}`,
    activityType: "curriculum-quiz" as const,
    activityTitle: "Tier test quest",
    skillId,
    domain: "math" as const,
    gradeBand: "K-1" as const,
    result: "success" as const,
    score: 100,
    difficulty: "medium" as const,
    attempts: 1,
    hintsUsed,
  };
}

beforeEach(() => {
  vi.stubGlobal("localStorage", new MemoryStorage());
});

describe("learnerBrain evidence tiers", () => {
  it("starts every skill with zero evidence and no masters", async () => {
    const brain = await freshBrain();
    const model = brain.getLearnerModel("fresh-learner-1");
    const records = Object.values(model.skillMastery);
    expect(records.length).toBeGreaterThan(0);
    for (const record of records) {
      expect(record.tier === "novice" || record.tier === "locked").toBe(true);
      expect(record.evidenceScore).toBe(0);
      expect(record.successfulAttempts).toBe(0);
    }
    expect(model.strongSkills).toEqual([]);
  });

  it("advances novice -> practitioner -> master on repeated unassisted success", async () => {
    const brain = await freshBrain();
    const learnerId = "tier-learner-1";
    const skillId = "math-k1-addition-subtraction";

    brain.recordLearningEvent(successEvent(skillId, learnerId));
    expect(brain.getLearnerModel(learnerId).skillMastery[skillId].tier).toBe("novice");

    brain.recordLearningEvent(successEvent(skillId, learnerId));
    expect(brain.getLearnerModel(learnerId).skillMastery[skillId].tier).toBe("practitioner");

    brain.recordLearningEvent(successEvent(skillId, learnerId));
    brain.recordLearningEvent(successEvent(skillId, learnerId));
    const record = brain.getLearnerModel(learnerId).skillMastery[skillId];
    expect(record.tier).toBe("master");
    expect(record.masteredTimestamp).toBeGreaterThan(0);
  });

  it("scales evidence by hints and only raises difficulty after unassisted streaks", async () => {
    const brain = await freshBrain();
    const learnerId = "hint-learner-1";
    const skillId = "math-k1-addition-subtraction";

    // Three heavily-assisted successes: evidence grows slowly, difficulty stays.
    brain.recordLearningEvent(successEvent(skillId, learnerId, 3));
    brain.recordLearningEvent(successEvent(skillId, learnerId, 3));
    brain.recordLearningEvent(successEvent(skillId, learnerId, 3));
    let record = brain.getLearnerModel(learnerId).skillMastery[skillId];
    expect(record.evidenceScore).toBe(24);
    expect(record.currentDifficultyLevel).toBe(1);
    expect(record.consecutiveUnassistedSuccesses).toBe(0);

    // Three unassisted successes raise the challenge.
    brain.recordLearningEvent(successEvent(skillId, learnerId, 0));
    brain.recordLearningEvent(successEvent(skillId, learnerId, 0));
    brain.recordLearningEvent(successEvent(skillId, learnerId, 0));
    record = brain.getLearnerModel(learnerId).skillMastery[skillId];
    expect(record.currentDifficultyLevel).toBe(2);
  });

  it("never grants mastery from practice-only or unmapped screening events", async () => {
    const brain = await freshBrain();
    const learnerId = "practice-learner-1";
    const skillId = "math-k1-addition-subtraction";

    for (let i = 0; i < 30; i += 1) {
      brain.recordLearningEvent({
        ...successEvent(skillId, learnerId),
        result: "practice",
        score: 60,
      });
    }
    // A brief diagnostic-style screening event on the unmapped bucket.
    brain.recordLearningEvent({
      ...successEvent(skillId, learnerId),
      activityId: "diagnostic-placement-quest",
      activityType: "diagnostic-placement",
      skillId: "unmapped-activity",
      domain: "general",
      result: "practice",
      score: 90,
    });
    const record = brain.getLearnerModel(learnerId).skillMastery[skillId];
    expect(record.tier).not.toBe("master");
    expect(record.successfulAttempts).toBe(0);
  });

  it("flags struggling skills for review and eases difficulty", async () => {
    const brain = await freshBrain();
    const learnerId = "struggle-learner-1";
    const skillId = "math-k1-addition-subtraction";

    brain.recordLearningEvent(successEvent(skillId, learnerId));
    brain.recordLearningEvent(successEvent(skillId, learnerId));
    const before = brain.getLearnerModel(learnerId).skillMastery[skillId].evidenceScore;
    brain.recordLearningEvent({ ...successEvent(skillId, learnerId), result: "struggle", score: 20 });
    brain.recordLearningEvent({ ...successEvent(skillId, learnerId), result: "struggle", score: 10 });
    const record = brain.getLearnerModel(learnerId).skillMastery[skillId];
    expect(record.evidenceScore).toBeLessThan(before);
    expect(record.needsReview).toBe(true);
    expect(brain.getLearnerModel(learnerId).weakSkills).toContain(skillId);
  });

  it("isolates learner models between accounts", async () => {
    const brain = await freshBrain();
    const skillId = "math-k1-addition-subtraction";
    brain.setActiveLearnerId("learner-a");
    brain.recordLearningEvent(successEvent(skillId, "learner-a"));
    brain.recordLearningEvent(successEvent(skillId, "learner-a"));

    brain.setActiveLearnerId("learner-b");
    const other = brain.getLearnerModel("learner-b").skillMastery[skillId];
    expect(other.evidenceScore).toBe(0);
    expect(other.tier).not.toBe("practitioner");

    const first = brain.getLearnerModel("learner-a").skillMastery[skillId];
    expect(first.tier).toBe("practitioner");
  });

  it("adopts a legacy unscoped model exactly once, then removes it", async () => {
    const brain = await freshBrain();
    brain.setActiveLearnerId("scholar-primary-1");
    const legacyKey = "my_student_portal_learner_model_v1";
    const legacyModel = brain.getInitialLearnerModel("scholar-primary-1");
    legacyModel.skillMastery["math-k1-addition-subtraction"].evidenceScore = 48;
    legacyModel.skillMastery["math-k1-addition-subtraction"].tier = "practitioner";
    localStorage.setItem(legacyKey, JSON.stringify(legacyModel));

    const adopted = brain.getLearnerModel();
    expect(adopted.skillMastery["math-k1-addition-subtraction"].tier).toBe("practitioner");
    expect(localStorage.getItem(legacyKey)).toBeNull();
    expect(localStorage.getItem("my_student_portal_learner_model_v1_scholar-primary-1")).not.toBeNull();
  });
});
