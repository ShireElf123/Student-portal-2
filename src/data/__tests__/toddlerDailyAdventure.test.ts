import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  __resetAccountScopeForTests,
  writeScopedJSON,
} from "../../utils/accountStorage";
import { getGamificationState } from "../../utils/gamification";
import {
  ALL_MISSIONS_BONUS_STARS,
  ALL_MISSIONS_BONUS_XP,
  completeActiveMissionIfMatches,
  getActiveDailyMissionId,
  getCompletedDailyMissionIds,
  getDailyCount,
  getMissionById,
  getTodayAdventure,
  recordCountingCardTapped,
  recordDailyCount,
  recordDailySetMember,
  recordPhonicsLetterTapped,
  startDailyMission,
} from "../toddler/toddlerDailyAdventure";

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

beforeEach(() => {
  vi.stubGlobal("localStorage", new MemoryStorage());
  __resetAccountScopeForTests();
});

function todayKey(): string {
  return new Date().toISOString().split("T")[0];
}

describe("daily mission engine", () => {
  it("starting a mission tracks it as active without paying rewards or completing it", () => {
    const schedule = getTodayAdventure();
    const mission = schedule.missions[0];
    const before = getGamificationState();

    startDailyMission(mission.id);

    expect(getActiveDailyMissionId()).toBe(mission.id);
    expect(getCompletedDailyMissionIds()).not.toContain(mission.id);
    expect(getGamificationState().starsCount).toBe(before.starsCount);
    expect(getGamificationState().xp).toBe(before.xp);
  });

  it("ignores completion signals when no mission is active", () => {
    expect(getActiveDailyMissionId()).toBeNull();
    const result = completeActiveMissionIfMatches("games", "memory-match");
    expect(result).toBeNull();
    expect(getCompletedDailyMissionIds()).toEqual([]);
  });

  it("ignores signals for the wrong tab or subactivity", () => {
    const schedule = getTodayAdventure();
    const mission = schedule.missions[0];
    startDailyMission(mission.id);

    const wrongTab = mission.targetTab === "games" ? "books" : "games";
    expect(completeActiveMissionIfMatches(wrongTab, mission.targetSubactivity)).toBeNull();
    // Active mission survives non-matching signals.
    expect(getActiveDailyMissionId()).toBe(mission.id);

    if (mission.targetSubactivity) {
      expect(completeActiveMissionIfMatches(mission.targetTab, "not-the-target")).toBeNull();
      expect(getActiveDailyMissionId()).toBe(mission.id);
    }
    expect(getCompletedDailyMissionIds()).not.toContain(mission.id);
  });

  it("completes the active mission on a matching signal and pays exactly once", () => {
    const schedule = getTodayAdventure();
    const mission = schedule.missions[0];
    const starsBefore = getGamificationState().starsCount;
    const xpBefore = getGamificationState().xp;

    startDailyMission(mission.id);
    const result = completeActiveMissionIfMatches(mission.targetTab, mission.targetSubactivity || null);

    expect(result === null).toBe(false);
    if (result === null) return;
    expect(result.mission.id).toBe(mission.id);
    expect(result.isFirstComplete).toBe(true);
    expect(getCompletedDailyMissionIds()).toContain(mission.id);
    // Active slot clears so the same signal cannot pay twice.
    expect(getActiveDailyMissionId()).toBeNull();
    expect(getGamificationState().starsCount).toBe(starsBefore + mission.starsReward);
    expect(getGamificationState().xp).toBe(xpBefore + mission.xpReward);

    // Re-starting an already-completed mission and matching again pays nothing.
    startDailyMission(mission.id);
    const again = completeActiveMissionIfMatches(mission.targetTab, mission.targetSubactivity || null);
    expect(again === null).toBe(false);
    if (again === null) return;
    expect(again.isFirstComplete).toBe(false);
    expect(getGamificationState().starsCount).toBe(starsBefore + mission.starsReward);
    expect(getGamificationState().xp).toBe(xpBefore + mission.xpReward);
  });

  it("pays the finish-all-three bonus exactly once", () => {
    const schedule = getTodayAdventure();
    expect(schedule.missions.length).toBe(3);
    const starsBefore = getGamificationState().starsCount;
    const xpBefore = getGamificationState().xp;
    const expectedStars =
      schedule.missions.reduce((sum, m) => sum + m.starsReward, 0) + ALL_MISSIONS_BONUS_STARS;
    const expectedXp =
      schedule.missions.reduce((sum, m) => sum + m.xpReward, 0) + ALL_MISSIONS_BONUS_XP;

    schedule.missions.forEach((mission, idx) => {
      startDailyMission(mission.id);
      const result = completeActiveMissionIfMatches(mission.targetTab, mission.targetSubactivity || null);
      expect(result === null).toBe(false);
      if (result === null) return;
      expect(result.allCompleted).toBe(idx === 2);
      expect(result.bonusPaid).toBe(idx === 2);
    });

    expect(getGamificationState().starsCount).toBe(starsBefore + expectedStars);
    expect(getGamificationState().xp).toBe(xpBefore + expectedXp);
  });

  it("ignores an active mission stamped with a stale date", () => {
    const schedule = getTodayAdventure();
    const mission = schedule.missions[0];
    writeScopedJSON("toddler_daily_mission_active_v1", {
      date: "2000-01-01",
      missionId: mission.id,
    });
    expect(getActiveDailyMissionId()).toBeNull();
    expect(completeActiveMissionIfMatches(mission.targetTab, mission.targetSubactivity || null)).toBeNull();
  });

  it("getMissionById resolves today's missions and rejects unknown ids", () => {
    const schedule = getTodayAdventure();
    expect(getMissionById(schedule.missions[0].id)?.title).toBe(schedule.missions[0].title);
    expect(getMissionById("no-such-mission")).toBeNull();
  });
});

describe("daily counters and sets", () => {
  it("counts events per key per day", () => {
    expect(getDailyCount("k")).toBe(0);
    expect(recordDailyCount("k")).toBe(1);
    expect(recordDailyCount("k", 2)).toBe(3);
    expect(getDailyCount("k")).toBe(3);
    expect(getDailyCount("other")).toBe(0);
  });

  it("tracks distinct set members", () => {
    expect(recordDailySetMember("letters", "A")).toEqual({ isNew: true, size: 1 });
    expect(recordDailySetMember("letters", "A")).toEqual({ isNew: false, size: 1 });
    expect(recordDailySetMember("letters", "B")).toEqual({ isNew: true, size: 2 });
  });

  it("resets counters and sets when the stored date is stale", () => {
    writeScopedJSON("toddler_daily_counts_v1", { date: "2000-01-01", counts: { k: 99 } });
    writeScopedJSON("toddler_daily_sets_v1", { date: "2000-01-01", sets: { s: ["A"] } });
    expect(getDailyCount("k")).toBe(0);
    expect(recordDailySetMember("s", "A").isNew).toBe(true);
  });
});

describe("phonics and counting recorders", () => {
  it("pays one star per distinct phonics letter per day", () => {
    const starsBefore = getGamificationState().starsCount;
    const first = recordPhonicsLetterTapped("A");
    expect(first.earnedStar).toBe(true);
    const repeat = recordPhonicsLetterTapped("a");
    expect(repeat.earnedStar).toBe(false);
    const second = recordPhonicsLetterTapped("B");
    expect(second.earnedStar).toBe(true);
    expect(getGamificationState().starsCount).toBe(starsBefore + 2);
  });

  it("completes the active phonics mission only after A, B and C are all tapped", () => {
    const schedule = getTodayAdventure();
    const phonicsMission = schedule.missions.find((m) => m.targetTab === "phonics");
    if (!phonicsMission) {
      // No phonics mission today: tapping letters must not complete anything.
      recordPhonicsLetterTapped("A");
      recordPhonicsLetterTapped("B");
      const result = recordPhonicsLetterTapped("C");
      expect(result.missionResult).toBeNull();
      return;
    }
    startDailyMission(phonicsMission.id);
    expect(recordPhonicsLetterTapped("A").missionResult).toBeNull();
    expect(recordPhonicsLetterTapped("B").missionResult).toBeNull();
    const done = recordPhonicsLetterTapped("C");
    expect(done.missionResult === null).toBe(false);
    if (done.missionResult === null) return;
    expect(done.missionResult.mission.id).toBe(phonicsMission.id);
    expect(getCompletedDailyMissionIds()).toContain(phonicsMission.id);
  });

  it("pays one star per distinct counting card and needs all five for the mission", () => {
    const starsBefore = getGamificationState().starsCount;
    expect(recordCountingCardTapped(1).earnedStar).toBe(true);
    expect(recordCountingCardTapped(1).earnedStar).toBe(false);
    expect(getGamificationState().starsCount).toBe(starsBefore + 1);

    const schedule = getTodayAdventure();
    const countingMission = schedule.missions.find((m) => m.targetTab === "counting");
    if (!countingMission) return;
    startDailyMission(countingMission.id);
    // Card 1 was already tapped above; finish the set.
    expect(recordCountingCardTapped(2).missionResult).toBeNull();
    expect(recordCountingCardTapped(3).missionResult).toBeNull();
    expect(recordCountingCardTapped(4).missionResult).toBeNull();
    const done = recordCountingCardTapped(5);
    expect(done.missionResult === null).toBe(false);
    if (done.missionResult === null) return;
    expect(done.missionResult.mission.id).toBe(countingMission.id);
  });
});

describe("mission storage hygiene", () => {
  it("scopes the active mission to today", () => {
    const schedule = getTodayAdventure();
    startDailyMission(schedule.missions[0].id);
    expect(getActiveDailyMissionId()).toBe(schedule.missions[0].id);
    expect(todayKey().length).toBe(10);
  });
});
