import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CURRICULUM_SKILL_NODES } from "../data/curriculumUniverse";
import { resolveActivityDefinition } from "../data/activitySkillRegistry";
import {
  getInitialLearnerModel,
  getLearnerModel,
  recordLearningEvent,
  setActiveLearnerId,
} from "./learnerBrain";
import { buildParentEvidenceBoard, PARENT_EVIDENCE_GRADE_BAND } from "./parentEvidenceBoard";

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
let learnerId = "parent-board-learner";
let resetId = 0;

describe("parent evidence board (K–1)", () => {
  beforeEach(() => {
    storage = new MemoryStorage();
    vi.stubGlobal("localStorage", storage);
    vi.stubGlobal("window", new EventTarget());
    learnerId = `parent-board-learner-${resetId++}`;
    setActiveLearnerId(`reset-${resetId}`);
    setActiveLearnerId(learnerId);
    getInitialLearnerModel(learnerId);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("shows no rows and counts every K–1 skill as unpracticed when there is no evidence", () => {
    const board = buildParentEvidenceBoard(getLearnerModel(learnerId));
    const k1Count = CURRICULUM_SKILL_NODES.filter((node) => node.gradeBand === PARENT_EVIDENCE_GRADE_BAND).length;
    expect(k1Count).toBeGreaterThan(0);
    expect(board.skillsInBand).toBe(k1Count);
    expect(board.rows).toEqual([]);
    expect(board.unpracticedCount).toBe(k1Count);
    expect(board.nextLaunch).toBeNull();
    expect(JSON.stringify(board)).not.toMatch(/xp|gems|starsCount/i);
  });

  it("lists only the skill that received a scored response, with last evidence and a real next activity", () => {
    recordLearningEvent({
      id: "counting-correct-1",
      learnerId,
      activityId: "toddler-feed-animal",
      experienceId: "feed-animal",
      contentId: "three-carrots",
      eventType: "question_answered",
      activityType: "toddler-counting",
      activityTitle: "Feed Benny Bunny Counting",
      skillId: "math-k1-counting",
      domain: "math",
      gradeBand: "toddler",
      result: "success",
      score: 100,
      difficulty: "easy",
      attempts: 1,
      hintsUsed: 0,
    });

    const board = buildParentEvidenceBoard(getLearnerModel(learnerId));
    expect(board.rows).toHaveLength(1);
    expect(board.unpracticedCount).toBe(board.skillsInBand - 1);
    const row = board.rows[0];
    expect(row.skillId).toBe("math-k1-counting");
    expect(row.totalAttempts).toBeGreaterThan(0);
    expect(row.lastEvent?.activityId).toBe("toddler-feed-animal");
    expect(row.lastEvent?.outcome).toBe("correct");
    expect(row.next).not.toBeNull();
    const next = resolveActivityDefinition(row.next!.activityId);
    expect(next.id).toBe(row.next!.activityId);
    expect(next.skillIds).toContain("math-k1-counting");
    expect(board.nextLaunch?.skillId).toBe("math-k1-counting");
  });

  it("does not treat opening or exploring an experience as a practiced skill", () => {
    recordLearningEvent({
      id: "safari-open-1",
      learnerId,
      activityId: "toddler-safari-explorer",
      experienceId: "animal-safari",
      contentId: "open",
      eventType: "content_explored",
      activityType: "toddler-safari",
      activityTitle: "Opened Animal Safari",
      domain: "general",
      gradeBand: "toddler",
      result: "explored",
      difficulty: "easy",
      attempts: 1,
      hintsUsed: 0,
    });
    const board = buildParentEvidenceBoard(getLearnerModel(learnerId));
    expect(board.rows).toEqual([]);
    expect(board.unpracticedCount).toBe(board.skillsInBand);
  });
});
