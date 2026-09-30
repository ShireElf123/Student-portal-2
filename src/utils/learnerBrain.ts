import { CurriculumDomain, GradeLevelBand, CURRICULUM_SKILL_NODES } from "../data/curriculumUniverse";
import { NavigationTab } from "../types";
import { getDueMistakesCount } from "./pedagogicalEngine";
import {
  saveLearnerModelToCloud,
  fetchLearnerModelFromCloud,
  recordCloudLearningEvent,
  notifySyncStatus,
} from "../firebaseCore";
import {
  GUEST_LEARNER_ID,
  setActiveAccountId,
} from "./accountStorage";

export type SyncState = "synced" | "syncing" | "offline" | "error";
let currentSyncState: SyncState = "synced";
const syncStateListeners = new Set<(state: SyncState) => void>();

export function getSyncState(): SyncState {
  return currentSyncState;
}

export function subscribeSyncState(fn: (state: SyncState) => void): () => void {
  syncStateListeners.add(fn);
  fn(currentSyncState);
  return () => {
    syncStateListeners.delete(fn);
  };
}

function setSyncState(state: SyncState) {
  if (currentSyncState === state) return;
  currentSyncState = state;
  syncStateListeners.forEach((fn) => fn(state));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("learner_sync_state_changed", { detail: state }));
  }
}

const PENDING_EVENTS_QUEUE_KEY = "my_student_portal_pending_events_queue_v1";

interface QueuedEvent {
  learnerId: string;
  event: LearningEvent;
  retryCount: number;
  queuedAt: number;
}

function getPendingEventQueue(): QueuedEvent[] {
  try {
    const raw = localStorage.getItem(PENDING_EVENTS_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePendingEventQueue(queue: QueuedEvent[]) {
  try {
    localStorage.setItem(PENDING_EVENTS_QUEUE_KEY, JSON.stringify(queue));
  } catch {}
}

function enqueuePendingEvent(learnerId: string, event: LearningEvent) {
  const queue = getPendingEventQueue();
  if (!queue.some((q) => q.event.id === event.id)) {
    queue.push({
      learnerId,
      event,
      retryCount: 0,
      queuedAt: Date.now(),
    });
    savePendingEventQueue(queue);
  }
}

export async function flushPendingEventsQueue(): Promise<void> {
  const queue = getPendingEventQueue();
  if (queue.length === 0) return;

  const remaining: QueuedEvent[] = [];
  setSyncState("syncing");

  for (const item of queue) {
    try {
      await recordCloudLearningEvent(item.learnerId, item.event);
    } catch {
      if (item.retryCount < 3) {
        remaining.push({ ...item, retryCount: item.retryCount + 1 });
      }
    }
  }

  savePendingEventQueue(remaining);
  setSyncState(remaining.length === 0 ? "synced" : "offline");
}

export type ActivityType =
  | "curriculum-quiz"
  | "practice-session"
  | "math-blitz"
  | "fraction-lab"
  | "word-forge"
  | "balance-scale"
  | "solar-system-quiz"
  | "solar-system-explore"
  | "toddler-counting"
  | "toddler-sorting"
  | "toddler-rhyme"
  | "toddler-memory"
  | "toddler-color-lab"
  | "toddler-safari"
  | "toddler-quiz"
  | "diagnostic-placement"
  | "mistake-review"
  | "homework-submission"
  | "worksheet-practice";

export interface LearningEvent {
  id: string;
  learnerId: string;
  activityId: string;
  activityType: ActivityType;
  activityTitle: string;
  skillId: string;
  domain: CurriculumDomain | "general";
  gradeBand: GradeLevelBand | "toddler";
  result: "mastered" | "success" | "struggle" | "practice" | "explored";
  score?: number; // 0 - 100 percentage or raw points
  maxScore?: number;
  difficulty: "beginner" | "easy" | "medium" | "hard" | "expert";
  attempts: number;
  hintsUsed: number;
  timeSpentSeconds?: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface SkillMasteryRecord {
  skillId: string;
  domain: CurriculumDomain;
  gradeBand: GradeLevelBand | "toddler";
  tier: "locked" | "novice" | "practitioner" | "master";
  evidenceScore: number; // 0 - 100 continuous score
  totalAttempts: number;
  successfulAttempts: number;
  strugglesCount: number;
  hintsUsedTotal: number;
  currentDifficultyLevel: number; // 1 (Recognition) to 5 (Transfer)
  consecutiveSuccesses: number;
  consecutiveUnassistedSuccesses: number;
  consecutiveStruggles: number;
  lastPracticedTimestamp: number;
  masteredTimestamp?: number;
  needsReview: boolean;
}

export interface RecommendedAction {
  id: string;
  type: "mistake-review" | "curriculum-skill" | "mastery-challenge" | "lab-mission" | "toddler-world" | "practice";
  title: string;
  reason: string;
  badge: string;
  targetTab: NavigationTab;
  skillId?: string;
  domain?: CurriculumDomain;
  nodeId?: string;
  activityId?: string;
  urgency: "high" | "medium" | "low";
}

export interface LearnerModel {
  learnerId: string;
  gradeBand: GradeLevelBand | "toddler";
  skillMastery: Record<string, SkillMasteryRecord>;
  recentEvents: LearningEvent[]; // last 50 events
  totalLearningEventsCount: number;
  weakSkills: string[]; // skill IDs needing review or low evidence
  strongSkills: string[]; // skill IDs with practitioner or master tier
  completedMissions: string[];
  activeStreak: number;
  lastActiveTimestamp: number;
  recommendedNext: RecommendedAction[];
}

const DEFAULT_LEARNER_ID = "scholar-primary-1";
let activeLearnerId = DEFAULT_LEARNER_ID;

export function getActiveLearnerId(): string {
  return activeLearnerId;
}

export function setActiveLearnerId(learnerId: string): void {
  if (!learnerId || learnerId === activeLearnerId) return;
  activeLearnerId = learnerId;
  // Switching learners also switches the account storage scope, so every
  // scoped partition (notebooks, homework, gamification, ...) follows.
  setActiveAccountId(learnerId || GUEST_LEARNER_ID);
  cachedLearnerModel = null;
  const model = getLearnerModel(learnerId);
  listeners.forEach((fn) => fn(model));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("learner_model_updated", { detail: model }));
  }
}

function getLearnerStorageKey(learnerId: string): string {
  return `my_student_portal_learner_model_v1_${learnerId}`;
}

// Cache in memory
let cachedLearnerModel: LearnerModel | null = null;
const listeners = new Set<(model: LearnerModel) => void>();

/**
 * Initializes baseline skill mastery records from curriculum universe.
 * Every skill starts with zero evidence: mastery tiers are earned only
 * through recorded learning events. Bare "completed node" ID lists from
 * older versions are deliberately NOT converted into mastery — an ID in a
 * list is not evidence of learning.
 */
function createDefaultSkillMastery(): Record<string, SkillMasteryRecord> {
  const mastery: Record<string, SkillMasteryRecord> = {};

  CURRICULUM_SKILL_NODES.forEach((node) => {
    mastery[node.id] = {
      skillId: node.id,
      domain: node.domain,
      gradeBand: node.gradeBand,
      tier: node.prerequisites.length === 0 ? "novice" : "locked",
      evidenceScore: 0,
      totalAttempts: 0,
      successfulAttempts: 0,
      strugglesCount: 0,
      hintsUsedTotal: 0,
      currentDifficultyLevel: 1,
      consecutiveSuccesses: 0,
      consecutiveUnassistedSuccesses: 0,
      consecutiveStruggles: 0,
      lastPracticedTimestamp: 0,
      masteredTimestamp: undefined,
      needsReview: false,
    };
  });

  return mastery;
}

export function getInitialLearnerModel(learnerId: string = DEFAULT_LEARNER_ID): LearnerModel {
  const skillMastery = createDefaultSkillMastery();
  const strong = Object.values(skillMastery)
    .filter((s) => s.tier === "master" || s.tier === "practitioner")
    .map((s) => s.skillId);

  const initialModel: LearnerModel = {
    learnerId,
    gradeBand: learnerId.includes("leo") || learnerId.includes("toddler") ? "K-1" : "2-3",
    skillMastery,
    recentEvents: [],
    totalLearningEventsCount: 0,
    weakSkills: [],
    strongSkills: strong,
    completedMissions: [],
    activeStreak: 0,
    lastActiveTimestamp: 0,
    recommendedNext: [],
  };

  initialModel.recommendedNext = computeRecommendations(initialModel);
  return initialModel;
}

export function getLearnerModel(specificLearnerId?: string): LearnerModel {
  const targetId = specificLearnerId || activeLearnerId;
  if (!specificLearnerId && cachedLearnerModel && cachedLearnerModel.learnerId === targetId) {
    return cachedLearnerModel;
  }

  const storageKey = getLearnerStorageKey(targetId);
  const LEGACY_MODEL_KEY = "my_student_portal_learner_model_v1";
  try {
    let raw = localStorage.getItem(storageKey);
    // One-time legacy adoption for the active learner: pre-partition models
    // move into this account's learner key and the unscoped original is
    // removed, so no later account on this browser can see them.
    if (!raw && (targetId === DEFAULT_LEARNER_ID || !specificLearnerId)) {
      raw = localStorage.getItem(LEGACY_MODEL_KEY);
      if (raw && (!specificLearnerId || specificLearnerId === activeLearnerId)) {
        try {
          localStorage.setItem(storageKey, raw);
          localStorage.removeItem(LEGACY_MODEL_KEY);
        } catch {
          // ignore adoption errors; the in-memory model below still works
        }
      }
    }
    if (raw) {
      const parsed = JSON.parse(raw) as LearnerModel;
      parsed.learnerId = targetId;
      // Reconcile with any new curriculum nodes added to curriculumUniverse
      CURRICULUM_SKILL_NODES.forEach((node) => {
        if (!parsed.skillMastery[node.id]) {
          parsed.skillMastery[node.id] = {
            skillId: node.id,
            domain: node.domain,
            gradeBand: node.gradeBand,
            tier: node.prerequisites.length === 0 ? "novice" : "locked",
            evidenceScore: node.prerequisites.length === 0 ? 20 : 0,
            totalAttempts: 0,
            successfulAttempts: 0,
            strugglesCount: 0,
            hintsUsedTotal: 0,
            currentDifficultyLevel: 1,
            consecutiveSuccesses: 0,
            consecutiveUnassistedSuccesses: 0,
            consecutiveStruggles: 0,
            lastPracticedTimestamp: 0,
            needsReview: false,
          };
        } else {
          // Backfill this field for learner models created before hint-aware adaptation.
          parsed.skillMastery[node.id].consecutiveUnassistedSuccesses ??= 0;
        }
      });

      parsed.recommendedNext = computeRecommendations(parsed);
      if (!specificLearnerId) cachedLearnerModel = parsed;
      return parsed;
    }
  } catch (e) {
    console.warn("Failed to load learner model from storage:", e);
  }

  const initial = getInitialLearnerModel(targetId);
  if (!specificLearnerId) cachedLearnerModel = initial;
  return initial;
}

export function saveLearnerModel(model: LearnerModel, specificLearnerId?: string): void {
  const targetId = specificLearnerId || model.learnerId || activeLearnerId;
  model.learnerId = targetId;
  if (!specificLearnerId || specificLearnerId === activeLearnerId) {
    cachedLearnerModel = model;
  }
  const storageKey = getLearnerStorageKey(targetId);
  try {
    localStorage.setItem(storageKey, JSON.stringify(model));
    // Learner data stays partitioned: legacy unscoped mirrors are no longer
    // written, so one account's model can never leak into another account.
    // (Pre-existing unscoped copies are adopted into the first account's
    // scope on read and then removed; see getLearnerModel above.)
  } catch (e) {
    console.warn("Failed to persist learner model:", e);
  }

  // Cloud sync fire-and-forget with sync status reporting
  try {
    saveLearnerModelToCloud(targetId, model)
      .then(() => {
        setSyncState("synced");
      })
      .catch((err) => {
        console.warn("Learner model cloud persistence deferred (offline):", err);
        setSyncState("offline");
      });
  } catch {
    setSyncState("offline");
  }

  // Notify listeners and window custom event
  if (!specificLearnerId || specificLearnerId === activeLearnerId) {
    listeners.forEach((fn) => fn(model));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("learner_model_updated", { detail: model }));
    }
  }
}

/**
 * Deterministically merges a local and cloud learner model.
 * Preserves the highest mastery achievements, unions completed missions,
 * deduplicates learning events by stable ID, and takes the newest activity timestamps.
 */
export function mergeLearnerModels(localModel: LearnerModel, cloudModel: LearnerModel): LearnerModel {
  const targetId = localModel.learnerId || cloudModel.learnerId || activeLearnerId;
  const merged: LearnerModel = {
    learnerId: targetId,
    gradeBand: localModel.gradeBand || cloudModel.gradeBand || "2-3",
    skillMastery: { ...localModel.skillMastery },
    recentEvents: [],
    totalLearningEventsCount: Math.max(localModel.totalLearningEventsCount || 0, cloudModel.totalLearningEventsCount || 0),
    weakSkills: [],
    strongSkills: [],
    completedMissions: Array.from(
      new Set([...(localModel.completedMissions || []), ...(cloudModel.completedMissions || [])])
    ),
    activeStreak: Math.max(localModel.activeStreak || 0, cloudModel.activeStreak || 0),
    lastActiveTimestamp: Math.max(localModel.lastActiveTimestamp || 0, cloudModel.lastActiveTimestamp || 0),
    recommendedNext: [],
  };

  // Merge skill mastery
  const allSkillIds = new Set([
    ...Object.keys(localModel.skillMastery || {}),
    ...Object.keys(cloudModel.skillMastery || {}),
  ]);

  const tierRank: Record<string, number> = { locked: 0, novice: 1, practitioner: 2, master: 3 };

  allSkillIds.forEach((skillId) => {
    const localRec = localModel.skillMastery?.[skillId];
    const cloudRec = cloudModel.skillMastery?.[skillId];

    if (localRec && cloudRec) {
      const localRank = tierRank[localRec.tier] ?? 0;
      const cloudRank = tierRank[cloudRec.tier] ?? 0;
      const winnerTier = localRank >= cloudRank ? localRec.tier : cloudRec.tier;

      merged.skillMastery[skillId] = {
        skillId,
        domain: localRec.domain || cloudRec.domain,
        gradeBand: localRec.gradeBand || cloudRec.gradeBand,
        tier: winnerTier,
        evidenceScore: Math.max(localRec.evidenceScore || 0, cloudRec.evidenceScore || 0),
        totalAttempts: Math.max(localRec.totalAttempts || 0, cloudRec.totalAttempts || 0),
        successfulAttempts: Math.max(localRec.successfulAttempts || 0, cloudRec.successfulAttempts || 0),
        strugglesCount: Math.max(localRec.strugglesCount || 0, cloudRec.strugglesCount || 0),
        hintsUsedTotal: Math.max(localRec.hintsUsedTotal || 0, cloudRec.hintsUsedTotal || 0),
        currentDifficultyLevel: Math.max(localRec.currentDifficultyLevel || 1, cloudRec.currentDifficultyLevel || 1),
        consecutiveSuccesses: Math.max(localRec.consecutiveSuccesses || 0, cloudRec.consecutiveSuccesses || 0),
        consecutiveUnassistedSuccesses: Math.max(localRec.consecutiveUnassistedSuccesses || 0, cloudRec.consecutiveUnassistedSuccesses || 0),
        consecutiveStruggles: Math.min(localRec.consecutiveStruggles || 0, cloudRec.consecutiveStruggles || 0),
        lastPracticedTimestamp: Math.max(localRec.lastPracticedTimestamp || 0, cloudRec.lastPracticedTimestamp || 0),
        masteredTimestamp: localRec.masteredTimestamp || cloudRec.masteredTimestamp,
        needsReview: localRec.needsReview || cloudRec.needsReview,
      };
    } else if (localRec) {
      merged.skillMastery[skillId] = { ...localRec, consecutiveUnassistedSuccesses: localRec.consecutiveUnassistedSuccesses || 0 };
    } else if (cloudRec) {
      merged.skillMastery[skillId] = { ...cloudRec, consecutiveUnassistedSuccesses: cloudRec.consecutiveUnassistedSuccesses || 0 };
    }
  });

  // Deduplicate recent events by stable ID
  const eventMap = new Map<string, LearningEvent>();
  (localModel.recentEvents || []).forEach((e) => {
    if (e?.id) eventMap.set(e.id, e);
  });
  (cloudModel.recentEvents || []).forEach((e) => {
    if (e?.id && !eventMap.has(e.id)) {
      eventMap.set(e.id, e);
    }
  });

  merged.recentEvents = Array.from(eventMap.values())
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    .slice(0, 50);

  // Recompute strong & weak skill groupings
  merged.strongSkills = Object.values(merged.skillMastery)
    .filter((s) => s.tier === "master" || s.tier === "practitioner")
    .map((s) => s.skillId);

  merged.weakSkills = Object.values(merged.skillMastery)
    .filter((s) => s.needsReview || (s.strugglesCount > 0 && s.tier !== "master"))
    .map((s) => s.skillId);

  merged.recommendedNext = computeRecommendations(merged);
  return merged;
}

/**
 * Synchronizes local learner brain with cloud storage.
 * Fetches cloud model, deterministically merges it with local progress,
 * and saves back without clobbering recent offline work.
 */
export async function syncLearnerBrainWithCloud(userId: string): Promise<LearnerModel> {
  if (!userId) return getLearnerModel();

  setSyncState("syncing");
  notifySyncStatus({ state: "syncing", message: "Syncing learner brain..." });

  try {
    const cloudModel = await fetchLearnerModelFromCloud(userId);
    const localModel = getLearnerModel(userId);

    if (cloudModel) {
      const merged = mergeLearnerModels(localModel, cloudModel);
      saveLearnerModel(merged, userId);
      await saveLearnerModelToCloud(userId, merged);
      setSyncState("synced");
      notifySyncStatus({ state: "synced", message: "Learner brain synchronized" });
      // Flush any queued offline events
      flushPendingEventsQueue().catch(() => {});
      return merged;
    } else {
      // First time cloud creation: upload local model to seed cloud profile
      await saveLearnerModelToCloud(userId, localModel);
      setSyncState("synced");
      notifySyncStatus({ state: "synced", message: "Cloud learner profile created" });
      return localModel;
    }
  } catch (err: any) {
    console.warn("Learner brain cloud sync deferred:", err);
    setSyncState("offline");
    notifySyncStatus({ state: "offline", message: "Offline cache active" });
    return getLearnerModel(userId);
  }
}

export function subscribeLearnerModel(callback: (model: LearnerModel) => void): () => void {
  listeners.add(callback);
  callback(getLearnerModel());
  return () => {
    listeners.delete(callback);
  };
}

/**
 * Computes deterministic, high-value pedagogical recommendations
 */
export function computeRecommendations(model: LearnerModel): RecommendedAction[] {
  const actions: RecommendedAction[] = [];

  // 1. Spaced Repetition Due Mistakes Check
  const dueMistakes = getDueMistakesCount();
  if (dueMistakes > 0) {
    actions.push({
      id: "rec-mistake-recovery",
      type: "mistake-review",
      title: `Review Vault: ${dueMistakes} Concepts Ready for Redemption`,
      reason: "Conquer past misconceptions with hint scaffolding to earn redemption crowns.",
      badge: "Spaced Repetition",
      targetTab: "practice",
      urgency: "high",
    });
  }

  // 2. Weak Skills Needing Reinforcement
  const weakSkillRecord = Object.values(model.skillMastery).find(
    (s) => s.needsReview || (s.strugglesCount > 1 && s.tier !== "master")
  );
  if (weakSkillRecord) {
    const node = CURRICULUM_SKILL_NODES.find((n) => n.id === weakSkillRecord.skillId);
    actions.push({
      id: `rec-weak-${weakSkillRecord.skillId}`,
      type: "practice",
      title: `Reinforce: ${node?.title || "Skill Target"}`,
      reason: "Strengthen this concept with graduated difficulty before moving to advanced standards.",
      badge: "Needs Practice",
      targetTab: "odyssey",
      skillId: weakSkillRecord.skillId,
      domain: weakSkillRecord.domain,
      nodeId: weakSkillRecord.skillId,
      urgency: "high",
    });
  }

  // 3. Practitioner Near-Mastery Challenge
  const nearMastery = Object.values(model.skillMastery).find(
    (s) => s.tier === "practitioner" && s.evidenceScore >= 65
  );
  if (nearMastery) {
    const node = CURRICULUM_SKILL_NODES.find((n) => n.id === nearMastery.skillId);
    actions.push({
      id: `rec-mastery-${nearMastery.skillId}`,
      type: "mastery-challenge",
      title: `Mastery Challenge: ${node?.title || "Target"}`,
      reason: "You are close to full standard mastery! Complete the challenge to unlock the crown.",
      badge: "Mastery Quest",
      targetTab: "odyssey",
      skillId: nearMastery.skillId,
      domain: nearMastery.domain,
      nodeId: nearMastery.skillId,
      urgency: "medium",
    });
  }

  // 4. Next Unlocked Curriculum Standard
  const nextUnlocked = CURRICULUM_SKILL_NODES.find((node) => {
    const record = model.skillMastery[node.id];
    if (record?.tier === "master") return false;
    // Check prerequisites
    const prereqsMet =
      node.prerequisites.length === 0 ||
      node.prerequisites.every((pid) => model.skillMastery[pid]?.tier === "master");
    return prereqsMet;
  });

  if (nextUnlocked) {
    actions.push({
      id: `rec-curriculum-${nextUnlocked.id}`,
      type: "curriculum-skill",
      title: `Next Standard: ${nextUnlocked.title}`,
      reason: `Explore this ${nextUnlocked.gradeBand} curriculum node aligned to ${nextUnlocked.standardCode}.`,
      badge: "Curriculum Journey",
      targetTab: "odyssey",
      skillId: nextUnlocked.id,
      domain: nextUnlocked.domain,
      nodeId: nextUnlocked.id,
      urgency: "medium",
    });
  }

  // 5. Interactive Lab Mission
  actions.push({
    id: "rec-lab-discovery",
    type: "lab-mission",
    title: "Primary STEM Lab: Planetary Exploration & Fractions",
    reason: "Engage in hands-on science experiments, balance scales, and tactile fraction manipulation.",
    badge: "Interactive Lab",
    targetTab: "primary-lab",
    urgency: "low",
  });

  return actions;
}

/**
 * Main Event Gateway: Every meaningful learning activity calls this function
 */
export function recordLearningEvent(
  eventInput: Omit<LearningEvent, "id" | "timestamp"> & { id?: string; timestamp?: number }
): LearningEvent {
  const targetLearnerId = eventInput.learnerId || getActiveLearnerId();
  const model = getLearnerModel(targetLearnerId);
  const event: LearningEvent = {
    ...eventInput,
    learnerId: targetLearnerId,
    id: eventInput.id || `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: eventInput.timestamp || Date.now(),
  };

  const isUnmapped = !event.skillId || event.skillId === "unmapped-activity";

  // Only attribute skill evidence if this activity corresponds to a legitimate curriculum standard
  if (!isUnmapped) {
    let record = model.skillMastery[event.skillId];
    if (!record) {
      record = {
        skillId: event.skillId,
        domain: event.domain === "general" ? "math" : event.domain,
        gradeBand: event.gradeBand,
        tier: "novice",
        evidenceScore: 10,
        totalAttempts: 0,
        successfulAttempts: 0,
        strugglesCount: 0,
        hintsUsedTotal: 0,
        currentDifficultyLevel: 1,
        consecutiveSuccesses: 0,
        consecutiveUnassistedSuccesses: 0,
        consecutiveStruggles: 0,
        lastPracticedTimestamp: Date.now(),
        needsReview: false,
      };
    }

    record.totalAttempts += 1;
    record.hintsUsedTotal += event.hintsUsed;
    record.lastPracticedTimestamp = Date.now();

    // Pedagogical Mastery & Difficulty Update Algorithm
    if (event.result === "mastered" || event.result === "success") {
      record.successfulAttempts += 1;
      record.consecutiveSuccesses += 1;
      record.consecutiveUnassistedSuccesses = event.hintsUsed === 0 ? record.consecutiveUnassistedSuccesses + 1 : 0;
      record.consecutiveStruggles = 0;
      record.needsReview = false;

      // Hints scale evidence: unassisted answers provide stronger evidence
      let evidenceGain = 18;
      if (event.hintsUsed === 0) evidenceGain = 24;
      else if (event.hintsUsed === 1) evidenceGain = 15;
      else if (event.hintsUsed >= 2) evidenceGain = 8;

      record.evidenceScore = Math.min(100, record.evidenceScore + evidenceGain);

      // Increase challenge only after repeated independent success; using hints is
      // productive learning, but should not by itself trigger a harder next round.
      if (record.consecutiveUnassistedSuccesses >= 3 && record.currentDifficultyLevel < 5) {
        record.currentDifficultyLevel += 1;
        record.consecutiveUnassistedSuccesses = 0;
      }
    } else if (event.result === "struggle") {
      record.strugglesCount += 1;
      record.consecutiveStruggles += 1;
      record.consecutiveSuccesses = 0;
      record.consecutiveUnassistedSuccesses = 0;

      // Slight reduction in evidence score to flag need for reinforcement
      record.evidenceScore = Math.max(5, record.evidenceScore - 8);

      // If struggling repeatedly, scaffold by easing difficulty level
      if (record.consecutiveStruggles >= 2 && record.currentDifficultyLevel > 1) {
        record.currentDifficultyLevel -= 1;
      }
      record.needsReview = true;
    } else if (event.result === "explored" || event.result === "practice") {
      // Practice and exploration build familiarity without sudden leaps
      record.evidenceScore = Math.min(100, record.evidenceScore + 4);
    }

    // Update Tier based on evidence
    if (record.evidenceScore >= 80 && record.successfulAttempts >= 2) {
      if (record.tier !== "master") {
        record.tier = "master";
        record.masteredTimestamp = Date.now();
      }
    } else if (record.evidenceScore >= 45) {
      if (record.tier !== "master") {
        record.tier = "practitioner";
      }
    } else if (record.evidenceScore > 0) {
      if (record.tier === "locked") {
        record.tier = "novice";
      }
    }

    model.skillMastery[event.skillId] = record;
  }

  // Deduplicate: avoid appending same event ID twice
  const existingIdx = model.recentEvents.findIndex((e) => e.id === event.id);
  if (existingIdx >= 0) {
    model.recentEvents[existingIdx] = event;
  } else {
    model.recentEvents = [event, ...model.recentEvents.slice(0, 49)];
    model.totalLearningEventsCount += 1;
  }
  model.lastActiveTimestamp = Date.now();

  // Recompute strong & weak skill groupings
  model.strongSkills = Object.values(model.skillMastery)
    .filter((s) => s.tier === "master" || s.tier === "practitioner")
    .map((s) => s.skillId);

  model.weakSkills = Object.values(model.skillMastery)
    .filter((s) => s.needsReview || (s.strugglesCount > 0 && s.tier !== "master"))
    .map((s) => s.skillId);

  // Unlock downstream nodes whose prerequisites are now met
  CURRICULUM_SKILL_NODES.forEach((node) => {
    const existing = model.skillMastery[node.id];
    if (existing && existing.tier === "locked") {
      const allPrereqsMet = node.prerequisites.every(
        (pid) => model.skillMastery[pid]?.tier === "master"
      );
      if (allPrereqsMet) {
        existing.tier = "novice";
        existing.evidenceScore = 15;
      }
    }
  });

  // Recompute recommended actions
  model.recommendedNext = computeRecommendations(model);

  // Persist local and cloud
  saveLearnerModel(model, targetLearnerId);

  // Dispatch cloud telemetry event asynchronously with local retry queue fallback
  recordCloudLearningEvent(event.learnerId, event).catch(() => {
    enqueuePendingEvent(event.learnerId, event);
  });

  return event;
}

/**
 * Returns the adaptive difficulty label appropriate for the student on a given skill
 */
export function getAdaptiveDifficultyForSkill(
  skillId: string,
  specificLearnerId?: string
): "beginner" | "easy" | "medium" | "hard" | "expert" {
  const model = getLearnerModel(specificLearnerId);
  const record = model.skillMastery[skillId];
  const level = record?.currentDifficultyLevel || 1;

  switch (level) {
    case 1:
      return "beginner";
    case 2:
      return "easy";
    case 3:
      return "medium";
    case 4:
      return "hard";
    case 5:
    default:
      return "expert";
  }
}

/**
 * Computes the real percentage of curriculum mastered in a given domain
 */
export function computeDomainMastery(domain: CurriculumDomain, specificLearnerId?: string): number {
  const model = getLearnerModel(specificLearnerId);
  const domainNodes = CURRICULUM_SKILL_NODES.filter((n) => n.domain === domain);
  if (domainNodes.length === 0) return 0;

  let totalEvidence = 0;
  domainNodes.forEach((node) => {
    const record = model.skillMastery[node.id];
    if (record) {
      totalEvidence += record.tier === "master" ? 100 : record.evidenceScore;
    }
  });

  return Math.min(100, Math.round(totalEvidence / domainNodes.length));
}

/**
 * Returns a high-level summary for Parent and Teacher dashboards
 */
export function getLearnerSummary(specificLearnerId?: string) {
  const model = getLearnerModel(specificLearnerId);
  const totalSkills = CURRICULUM_SKILL_NODES.length;
  const masteredCount = Object.values(model.skillMastery).filter((s) => s.tier === "master").length;
  const inProgressCount = Object.values(model.skillMastery).filter((s) => s.tier === "practitioner" || s.tier === "novice").length;

  return {
    learnerId: model.learnerId,
    gradeBand: model.gradeBand,
    totalSkills,
    masteredCount,
    inProgressCount,
    masteryPercentage: Math.round((masteredCount / totalSkills) * 100),
    totalEvents: model.totalLearningEventsCount,
    weakSkillsCount: model.weakSkills.length,
    strongSkillsCount: model.strongSkills.length,
    recentEvents: model.recentEvents.slice(0, 10),
    recommendedNext: model.recommendedNext,
    domainMastery: {
      math: computeDomainMastery("math", specificLearnerId),
      reading: computeDomainMastery("reading", specificLearnerId),
      science: computeDomainMastery("science", specificLearnerId),
      logic: computeDomainMastery("logic", specificLearnerId),
    },
  };
}
