import confetti from "canvas-confetti";
import { GamificationState, BuddyCompanionConfig } from "../types";
import { soundEffects } from "./soundEffects";
import {
  getActiveAccountId,
  readScopedJSON,
  writeScopedJSON,
  subscribeAccountScope,
} from "./accountStorage";

const STORAGE_KEY = "edu_gamification_state_v1";
// One-time cleanup marker for the fictional starter baseline older builds shipped.
const SCHEMA_MARKER_KEY = "edu_gamification_schema_v2";

export const DEFAULT_BUDDY: BuddyCompanionConfig = {
  id: "buddy-pip",
  name: "Pip",
  archetype: "monster",
  color: "pink",
  eyeStyle: "cyclops",
  hat: "explorer",
  accessory: "bowtie",
  catchphrase: "Let's explore and discover wonders today!",
};

const DEFAULT_STATE: GamificationState = {
  xp: 0,
  level: 1,
  streakDays: 0,
  lastActiveDate: "",
  starsCount: 0,
  gemsCount: 0,
  completedNodes: [],
  buddy: DEFAULT_BUDDY,
  wonderlandTheme: "sunny-meadow",
};

type Listener = (state: GamificationState) => void;
const listeners = new Set<Listener>();

function loadState(accountId: string = getActiveAccountId()): GamificationState {
  try {
    const parsed = readScopedJSON<Partial<GamificationState> | null>(STORAGE_KEY, null, accountId);
    if (!parsed) return { ...DEFAULT_STATE };
    if (readScopedJSON<unknown>(SCHEMA_MARKER_KEY, null, accountId) === true) {
      return { ...DEFAULT_STATE, ...parsed };
    }

    // Older builds shipped fictional starter XP, streaks and unlocked nodes.
    // Remove only that known baseline while preserving progress earned beyond it.
    const xp = Math.max(0, (Number(parsed.xp) || 0) - 180);
    const migrated: GamificationState = {
      ...DEFAULT_STATE,
      ...parsed,
      xp,
      level: calculateLevel(xp).level,
      streakDays: 0, // the previous value included an invented four-day streak
      lastActiveDate: "",
      starsCount: Math.max(0, (Number(parsed.starsCount) || 0) - 24),
      gemsCount: Math.max(0, (Number(parsed.gemsCount) || 0) - 65),
      completedNodes: (Array.isArray(parsed.completedNodes) ? parsed.completedNodes : []).filter(
        (id) => !["node-toddler-1", "node-toddler-2", "node-primary-1"].includes(id)
      ),
    };
    writeScopedJSON(STORAGE_KEY, migrated, accountId);
    writeScopedJSON(SCHEMA_MARKER_KEY, true, accountId);
    return migrated;
  } catch {
    return { ...DEFAULT_STATE };
  }
}

let currentState: GamificationState = loadState();

function saveState(state: GamificationState) {
  currentState = state;
  writeScopedJSON(STORAGE_KEY, state);
  listeners.forEach((fn) => fn(currentState));
}

/** Reloads rewards state from the newly active account scope. */
export function reloadGamificationScope(accountId: string = getActiveAccountId()): GamificationState {
  currentState = loadState(accountId);
  listeners.forEach((fn) => fn(currentState));
  return currentState;
}

subscribeAccountScope((accountId) => {
  reloadGamificationScope(accountId);
});

export function subscribeGamification(fn: Listener): () => void {
  listeners.add(fn);
  fn(currentState);
  return () => {
    listeners.delete(fn);
  };
}

export function getGamificationState(): GamificationState {
  return currentState;
}

export function calculateLevel(xp: number): { level: number; currentLevelXp: number; nextLevelXp: number; progressPct: number } {
  const XP_PER_LEVEL = 150;
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const currentLevelXp = xp % XP_PER_LEVEL;
  const nextLevelXp = XP_PER_LEVEL;
  const progressPct = Math.min(100, Math.round((currentLevelXp / nextLevelXp) * 100));
  return { level, currentLevelXp, nextLevelXp, progressPct };
}

export function awardXP(amount: number, reason?: string): { leveledUp: boolean; newLevel: number } {
  const prevLevel = calculateLevel(currentState.xp).level;
  const newXp = currentState.xp + amount;
  const newLevelInfo = calculateLevel(newXp);
  const leveledUp = newLevelInfo.level > prevLevel;

  const nextState: GamificationState = {
    ...currentState,
    xp: newXp,
    level: newLevelInfo.level,
  };

  saveState(nextState);

  if (leveledUp) {
    soundEffects.playFanfare();
    triggerCelebrationConfetti();
  } else {
    soundEffects.playStarSparkle();
  }

  return { leveledUp, newLevel: newLevelInfo.level };
}

export function awardStars(amount = 1) {
  const nextState: GamificationState = {
    ...currentState,
    starsCount: currentState.starsCount + amount,
  };
  saveState(nextState);
  soundEffects.playSuccessChime();
}

export function awardGems(amount = 5) {
  const nextState: GamificationState = {
    ...currentState,
    gemsCount: currentState.gemsCount + amount,
  };
  saveState(nextState);
  soundEffects.playStarSparkle();
}

export function markNodeCompleted(nodeId: string) {
  if (currentState.completedNodes.includes(nodeId)) return;
  const nextState: GamificationState = {
    ...currentState,
    completedNodes: [...currentState.completedNodes, nodeId],
  };
  saveState(nextState);
  awardXP(50, `Completed ${nodeId}`);
  awardGems(10);
  triggerCelebrationConfetti();
}

/**
 * Agency-grade particle explosions using canvas-confetti
 */
export function triggerCelebrationConfetti() {
  try {
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.65 },
      colors: ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#a855f7"],
      disableForReducedMotion: true,
    });
  } catch {
    // ignore in environments without canvas support
  }
}

export function triggerStarBurst() {
  try {
    confetti({
      particleCount: 35,
      spread: 60,
      shapes: ["circle", "star" as any],
      colors: ["#fbbf24", "#f59e0b", "#fde047", "#ffffff"],
      origin: { y: 0.5 },
      disableForReducedMotion: true,
    });
  } catch {
    // ignore
  }
}

export function saveBuddyCompanion(buddy: BuddyCompanionConfig) {
  const nextState: GamificationState = {
    ...currentState,
    buddy,
  };
  saveState(nextState);
  soundEffects.playFanfare();
  triggerCelebrationConfetti();
}

export function setWonderlandTheme(theme: "sunny-meadow" | "night-starlight") {
  const nextState: GamificationState = {
    ...currentState,
    wonderlandTheme: theme,
  };
  saveState(nextState);
}

