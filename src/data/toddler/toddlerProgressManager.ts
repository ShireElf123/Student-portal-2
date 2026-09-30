import { ALL_TODDLER_WORLDS, ToddlerWorld, ToddlerArea } from "./toddlerWorldsArchitecture";
import { completeActiveMissionIfMatches } from "./toddlerDailyAdventure";
import { recordLearningEvent, getActiveLearnerId } from "../../utils/learnerBrain";
import { resolveSkillForActivity } from "../activitySkillRegistry";
import {
  getActiveAccountId,
  readScopedJSON,
  writeScopedJSON,
  subscribeAccountScope,
} from "../../utils/accountStorage";

export interface CompletedActivityRecord {
  completedAt: number;
  starsAwarded: number;
  playCount: number;
}

export interface CompletedMissionRecord {
  completedAt: number;
  badgeEmoji: string;
  badgeTitle: string;
}

export interface ToddlerWorldProgressState {
  completedActivities: Record<string, CompletedActivityRecord>;
  completedMissions: Record<string, CompletedMissionRecord>;
  unlockedAreas: Record<string, boolean>;
  worldStars: Record<string, number>;
  lastVisitedWorldId?: string;
  lastVisitedAreaId?: string;
}

const STORAGE_KEY = "toddler_world_exploration_progress_v2";

const DEFAULT_STARTER_AREAS = [
  "farm-valley",
  "forest-trail",
  "color-studio",
  "barnyard-tales",
  "phonics-meadow",
  "feelings-emotions",
];

export function getInitialToddlerProgress(): ToddlerWorldProgressState {
  const initialUnlocked: Record<string, boolean> = {};
  DEFAULT_STARTER_AREAS.forEach((id) => {
    initialUnlocked[id] = true;
  });

  return {
    completedActivities: {},
    completedMissions: {},
    unlockedAreas: initialUnlocked,
    worldStars: {},
  };
}

let cachedProgress: ToddlerWorldProgressState | null = null;
let cachedAccountId: string | null = null;
const listeners = new Set<(state: ToddlerWorldProgressState) => void>();

function parseProgressState(parsed: unknown): ToddlerWorldProgressState | null {
  if (!parsed || typeof parsed !== "object") return null;
  const candidate = parsed as Partial<ToddlerWorldProgressState>;
  if (
    (candidate.completedActivities !== undefined && typeof candidate.completedActivities !== "object") ||
    (candidate.completedMissions !== undefined && typeof candidate.completedMissions !== "object") ||
    (candidate.unlockedAreas !== undefined && typeof candidate.unlockedAreas !== "object") ||
    (candidate.worldStars !== undefined && typeof candidate.worldStars !== "object")
  ) {
    return null;
  }
  // Ensure starter areas are unlocked
  const unlocked = { ...(candidate.unlockedAreas || {}) };
  DEFAULT_STARTER_AREAS.forEach((id) => {
    unlocked[id] = true;
  });
  return {
    completedActivities: candidate.completedActivities || {},
    completedMissions: candidate.completedMissions || {},
    unlockedAreas: unlocked,
    worldStars: candidate.worldStars || {},
    lastVisitedWorldId: candidate.lastVisitedWorldId,
    lastVisitedAreaId: candidate.lastVisitedAreaId,
  };
}

export function getToddlerProgress(accountId: string = getActiveAccountId()): ToddlerWorldProgressState {
  if (cachedProgress && cachedAccountId === accountId) return cachedProgress;

  const stored = readScopedJSON<unknown>(STORAGE_KEY, null, accountId);
  cachedAccountId = accountId;
  cachedProgress = parseProgressState(stored) || getInitialToddlerProgress();
  return cachedProgress;
}

/** Reloads cached progress from the newly active account scope. */
export function reloadToddlerProgressScope(accountId: string = getActiveAccountId()): ToddlerWorldProgressState {
  cachedProgress = null;
  const next = getToddlerProgress(accountId);
  listeners.forEach((fn) => fn(next));
  return next;
}

subscribeAccountScope((accountId) => {
  reloadToddlerProgressScope(accountId);
});

export function saveToddlerProgress(nextState: ToddlerWorldProgressState) {
  cachedAccountId = getActiveAccountId();
  cachedProgress = nextState;
  writeScopedJSON(STORAGE_KEY, nextState);
  listeners.forEach((fn) => fn(nextState));
}

export function subscribeToddlerProgress(callback: (state: ToddlerWorldProgressState) => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

/**
 * Checks which areas in a given world now qualify for unlocking based on total world stars.
 */
export function checkAreaUnlocks(
  world: ToddlerWorld,
  currentWorldStars: number,
  unlockedAreasMap: Record<string, boolean>
): string[] {
  const newlyUnlocked: string[] = [];

  world.areas.forEach((area) => {
    if (!unlockedAreasMap[area.id] && currentWorldStars >= area.requiredStarsToUnlock) {
      newlyUnlocked.push(area.id);
    }
  });

  return newlyUnlocked;
}

export function recordActivityCompletion(
  worldId: string,
  areaId: string,
  activityId: string,
  stars: number
): { isFirstCompletion: boolean; newlyUnlockedAreas: string[]; updatedState: ToddlerWorldProgressState } {
  const current = getToddlerProgress();
  const existing = current.completedActivities[activityId];
  const isFirstCompletion = !existing;

  const playCount = existing ? existing.playCount + 1 : 1;
  const starsAwarded = isFirstCompletion ? stars : Math.max(1, Math.floor(stars / 2));

  const nextCompletedActivities = {
    ...current.completedActivities,
    [activityId]: {
      completedAt: Date.now(),
      starsAwarded: (existing?.starsAwarded || 0) + starsAwarded,
      playCount,
    },
  };

  const nextWorldStars = {
    ...current.worldStars,
    [worldId]: (current.worldStars[worldId] || 0) + starsAwarded,
  };

  // Find target world to calculate area unlocks
  const targetWorld = ALL_TODDLER_WORLDS.find((w) => w.id === worldId);
  const newlyUnlocked = targetWorld
    ? checkAreaUnlocks(targetWorld, nextWorldStars[worldId], current.unlockedAreas)
    : [];

  const nextUnlockedAreas = { ...current.unlockedAreas };
  newlyUnlocked.forEach((id) => {
    nextUnlockedAreas[id] = true;
  });

  const nextState: ToddlerWorldProgressState = {
    ...current,
    completedActivities: nextCompletedActivities,
    worldStars: nextWorldStars,
    unlockedAreas: nextUnlockedAreas,
    lastVisitedWorldId: worldId,
    lastVisitedAreaId: areaId,
  };

  saveToddlerProgress(nextState);

  // A genuine world-activity completion can finish the active daily mission.
  try {
    completeActiveMissionIfMatches("worlds", worldId);
  } catch {
    // Mission matching must never break progress saving.
  }

  // Emit structured learning event into unified learner brain via registry
  try {
    const resolved = resolveSkillForActivity(activityId);

    recordLearningEvent({
      learnerId: getActiveLearnerId(),
      activityId: `toddler-${activityId}`,
      activityType: "toddler-quiz",
      activityTitle: `Toddler Adventure: ${activityId.replace(/-/g, " ")}`,
      skillId: resolved.skillId,
      domain: resolved.domain,
      gradeBand: resolved.gradeBand,
      result: "success",
      score: 100,
      difficulty: "easy",
      attempts: 1,
      hintsUsed: 0,
    });
  } catch {
    // ignore
  }

  return {
    isFirstCompletion,
    newlyUnlockedAreas: newlyUnlocked,
    updatedState: nextState,
  };
}

export function recordMissionCompletion(
  worldId: string,
  areaId: string,
  missionId: string,
  badgeEmoji: string,
  badgeTitle: string,
  bonusStars: number
): { isFirstCompletion: boolean; newlyUnlockedAreas: string[]; updatedState: ToddlerWorldProgressState } {
  const current = getToddlerProgress();
  const isFirstCompletion = !current.completedMissions[missionId];

  const nextCompletedMissions = {
    ...current.completedMissions,
    [missionId]: {
      completedAt: Date.now(),
      badgeEmoji,
      badgeTitle,
    },
  };

  const nextWorldStars = {
    ...current.worldStars,
    [worldId]: (current.worldStars[worldId] || 0) + bonusStars,
  };

  const targetWorld = ALL_TODDLER_WORLDS.find((w) => w.id === worldId);
  const newlyUnlocked = targetWorld
    ? checkAreaUnlocks(targetWorld, nextWorldStars[worldId], current.unlockedAreas)
    : [];

  const nextUnlockedAreas = { ...current.unlockedAreas };
  newlyUnlocked.forEach((id) => {
    nextUnlockedAreas[id] = true;
  });

  const nextState: ToddlerWorldProgressState = {
    ...current,
    completedMissions: nextCompletedMissions,
    worldStars: nextWorldStars,
    unlockedAreas: nextUnlockedAreas,
    lastVisitedWorldId: worldId,
    lastVisitedAreaId: areaId,
  };

  saveToddlerProgress(nextState);

  // A genuine world-mission completion can finish the active daily mission.
  try {
    completeActiveMissionIfMatches("worlds", worldId);
  } catch {
    // Mission matching must never break progress saving.
  }

  try {
    const resolvedMission = resolveSkillForActivity(missionId);
    recordLearningEvent({
      learnerId: getActiveLearnerId(),
      activityId: `mission-${missionId}`,
      activityType: "toddler-quiz",
      activityTitle: `World Mission: ${badgeTitle}`,
      skillId: resolvedMission.skillId,
      domain: resolvedMission.domain,
      gradeBand: resolvedMission.gradeBand,
      result: "success",
      score: 100,
      difficulty: "medium",
      attempts: 1,
      hintsUsed: 0,
    });
  } catch {
    // ignore
  }

  return {
    isFirstCompletion,
    newlyUnlockedAreas: newlyUnlocked,
    updatedState: nextState,
  };
}

export function isAreaUnlocked(area: ToddlerArea, state?: ToddlerWorldProgressState): boolean {
  const progress = state || getToddlerProgress();
  if (area.requiredStarsToUnlock === 0) return true;
  if (progress.unlockedAreas[area.id]) return true;

  const currentWorldStars = progress.worldStars[area.worldId] || 0;
  return currentWorldStars >= area.requiredStarsToUnlock;
}

export function getWorldProgressStats(
  world: ToddlerWorld,
  state?: ToddlerWorldProgressState
) {
  const progress = state || getToddlerProgress();

  let totalActivities = 0;
  let completedActivities = 0;
  let totalMissions = 0;
  let completedMissions = 0;
  let unlockedAreasCount = 0;

  world.areas.forEach((area) => {
    if (isAreaUnlocked(area, progress)) {
      unlockedAreasCount++;
    }
    totalActivities += area.activities.length;
    area.activities.forEach((act) => {
      if (progress.completedActivities[act.id]) {
        completedActivities++;
      }
    });

    totalMissions += area.missions.length;
    area.missions.forEach((m) => {
      if (progress.completedMissions[m.id]) {
        completedMissions++;
      }
    });
  });

  const percentage = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;
  const starsEarned = progress.worldStars[world.id] || 0;

  return {
    totalActivities,
    completedActivities,
    totalMissions,
    completedMissions,
    unlockedAreasCount,
    totalAreasCount: world.areas.length,
    percentage,
    starsEarned,
    isMastered: percentage === 100 && (totalMissions === 0 || completedMissions === totalMissions),
  };
}

export function getAreaProgressStats(
  area: ToddlerArea,
  state?: ToddlerWorldProgressState
) {
  const progress = state || getToddlerProgress();

  let completedCount = 0;
  area.activities.forEach((act) => {
    if (progress.completedActivities[act.id]) {
      completedCount++;
    }
  });

  let completedMissionsCount = 0;
  area.missions.forEach((m) => {
    if (progress.completedMissions[m.id]) {
      completedMissionsCount++;
    }
  });

  const total = area.activities.length;
  const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return {
    completedCount,
    totalCount: total,
    percentage,
    completedMissionsCount,
    totalMissionsCount: area.missions.length,
    isMastered: completedCount === total && (area.missions.length === 0 || completedMissionsCount === area.missions.length),
  };
}
