// @vitest-environment jsdom
/**
 * Daily mission engine + daily reward counters.
 *
 * These are the bookkeeping rules every toddler game pays through — the Safari
 * detective stars and the daily missions in particular. Commit da574a3 removed
 * the original suite (and later commits changed the engine's API), so this
 * suite re-establishes the contract that the games rely on:
 *
 * - counters and sets are per learner, per day;
 * - repeats never pay twice;
 * - a mission completes exactly once, only for a matching tab/subactivity.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { setActiveLearnerId } from "../../utils/learnerBrain";
import { getGamificationState } from "../../utils/gamification";
import {
  completeActiveMissionIfMatches,
  getCompletedDailyMissionIds,
  getDailyCount,
  getTodayAdventure,
  markDailyMissionCompleted,
  payDailyMissionIfMatches,
  recordCountingCardTapped,
  recordDailyCount,
  recordDailySetMember,
  recordPhonicsLetterTapped,
} from "./toddlerDailyAdventure";

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

let learnerCounter = 0;
const startAsFreshLearner = () => setActiveLearnerId(`mission-engine-test-${++learnerCounter}`);

beforeEach(() => {
  vi.stubGlobal("localStorage", new MemoryStorage());
  startAsFreshLearner();
});

const yesterday = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().split("T")[0];
};

describe("daily counters", () => {
  it("counts within the day, starting from zero", () => {
    expect(getDailyCount("safari-detective-solve")).toBe(0);
    expect(recordDailyCount("safari-detective-solve")).toBe(1);
    expect(recordDailyCount("safari-detective-solve")).toBe(2);
    expect(getDailyCount("safari-detective-solve")).toBe(2);
  });

  it("keeps counters separate per learner and ignores stale days", () => {
    recordDailyCount("safari-detective-solve");
    recordDailyCount("safari-detective-solve");
    expect(getDailyCount("safari-detective-solve")).toBe(2);

    // A different learner starts from zero — no cross-learner leakage.
    startAsFreshLearner();
    expect(getDailyCount("safari-detective-solve")).toBe(0);

    // A counter stored under an earlier date is not today's counter.
    localStorage.setItem(`toddler_daily_count_safari-detective-solve_${yesterday()}`, "9");
    expect(getDailyCount("safari-detective-solve")).toBe(0);
  });
});

describe("daily sets (one reward per distinct member per day)", () => {
  it("reports new versus repeat members with a running count", () => {
    expect(recordDailySetMember("safari-explore", "lion")).toEqual({ isNew: true, count: 1 });
    expect(recordDailySetMember("safari-explore", "lion")).toEqual({ isNew: false, count: 1 });
    expect(recordDailySetMember("safari-explore", "duck")).toEqual({ isNew: true, count: 2 });
    expect(recordDailySetMember("safari-explore", "duck")).toEqual({ isNew: false, count: 2 });
  });

  it("keeps buckets and learners independent", () => {
    recordDailySetMember("safari-explore", "lion");
    expect(recordDailySetMember("phonics-letters", "A")).toEqual({ isNew: true, count: 1 });

    startAsFreshLearner();
    expect(recordDailySetMember("safari-explore", "lion")).toEqual({ isNew: true, count: 1 });
  });
});

describe("mission completion", () => {
  it("completes a mission exactly once for its own tab and subactivity", () => {
    const mission = getTodayAdventure().missions[0];

    const first = completeActiveMissionIfMatches(mission.targetTab, mission.targetSubactivity);
    expect(first.completed).toBe(true);
    expect(first.mission?.id).toBe(mission.id);
    expect(getCompletedDailyMissionIds()).toContain(mission.id);

    const second = completeActiveMissionIfMatches(mission.targetTab, mission.targetSubactivity);
    expect(second.mission?.id).not.toBe(mission.id);
    expect(getCompletedDailyMissionIds().filter((id) => id === mission.id)).toHaveLength(1);
  });

  it("never completes a mission through the wrong subactivity", () => {
    const withSubactivity = getTodayAdventure().missions.find((mission) => mission.targetSubactivity);
    expect(withSubactivity).toBeTruthy();

    const result = completeActiveMissionIfMatches(
      withSubactivity!.targetTab,
      `not-${withSubactivity!.targetSubactivity}`
    );

    expect(result.mission?.id).not.toBe(withSubactivity!.id);
    expect(getCompletedDailyMissionIds()).not.toContain(withSubactivity!.id);
  });

  it("pays stars only when play matches the mission, not twice", () => {
    const mission = getTodayAdventure().missions.find((item) => item.targetSubactivity) ?? getTodayAdventure().missions[0];
    const before = getGamificationState().starsCount;
    const first = payDailyMissionIfMatches(mission.targetTab, mission.targetSubactivity);
    expect(first.completed).toBe(true);
    expect(getGamificationState().starsCount).toBeGreaterThanOrEqual(before + mission.starsReward);
    const after = getGamificationState().starsCount;
    const second = payDailyMissionIfMatches(mission.targetTab, mission.targetSubactivity);
    expect(second.completed).toBe(false);
    expect(getGamificationState().starsCount).toBe(after);
  });

  it("reports nothing to complete once today's missions are done", () => {
    const missions = getTodayAdventure().missions;
    missions.forEach((mission) => markDailyMissionCompleted(mission.id));

    const result = completeActiveMissionIfMatches(missions[0].targetTab, missions[0].targetSubactivity);
    expect(result.completed).toBe(false);
    expect(getCompletedDailyMissionIds()).toHaveLength(missions.length);
  });

  it("tracks first completion and the all-three bonus boundary", () => {
    const [first, second, third] = getTodayAdventure().missions;

    expect(markDailyMissionCompleted(first.id)).toEqual({ isFirstComplete: true, allCompleted: false });
    expect(markDailyMissionCompleted(first.id)).toEqual({ isFirstComplete: false, allCompleted: false });
    markDailyMissionCompleted(second.id);
    expect(markDailyMissionCompleted(third.id)).toEqual({ isFirstComplete: true, allCompleted: true });
  });

  it("forgets yesterday's completions", () => {
    localStorage.setItem(
      "toddler_daily_missions_completed_v1_" + "mission-engine-test-" + learnerCounter,
      JSON.stringify({ date: yesterday(), ids: ["mon-1", "mon-2"] })
    );
    expect(getCompletedDailyMissionIds()).toEqual([]);
  });
});

describe("discovery helpers that games pay through", () => {
  it("only completes a mission once the discovery target is reached", () => {
    const hasPhonicsMission = getTodayAdventure().missions.some(
      (mission) => mission.targetTab === "phonics"
    );
    const hasCountingMission = getTodayAdventure().missions.some(
      (mission) => mission.targetTab === "counting"
    );

    // Distinct discoveries accumulate; repeats are free play.
    expect(recordDailySetMember("phonics-letters", "A").count).toBe(1);
    recordPhonicsLetterTapped("A");
    recordPhonicsLetterTapped("A");
    expect(recordDailySetMember("phonics-letters", "A").count).toBe(1);
    expect(getCompletedDailyMissionIds().some((id) => id.startsWith("mon-2"))).toBe(hasPhonicsMission && false);

    // Three distinct letters are the phonics mission's threshold.
    recordPhonicsLetterTapped("B");
    recordPhonicsLetterTapped("C");
    const phonicsDone = getCompletedDailyMissionIds().length > 0;
    expect(phonicsDone).toBe(hasPhonicsMission);

    // Counting uses the same distinct-member rule.
    const before = getCompletedDailyMissionIds().length;
    // Same threshold as phonics: three distinct members. Repeats (the extra 1) do not count.
    [1, 1, 2, 3].forEach(recordCountingCardTapped);
    expect(getCompletedDailyMissionIds().length).toBe(
      before + (hasCountingMission ? 1 : 0)
    );
  });
});
