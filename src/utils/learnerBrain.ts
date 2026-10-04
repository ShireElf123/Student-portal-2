import { CurriculumDomain, GradeLevelBand, CURRICULUM_SKILL_NODES } from "../data/curriculumUniverse";
import { NavigationTab } from "../types";
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
import { getActivitiesForSkill, resolveActivityDefinition } from "../data/activitySkillRegistry";
import { markDailyRouteEvidenceComplete } from "./dailyLearningRoute";

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

const PENDING_EVENTS_QUEUE_KEY_PREFIX = "my_student_portal_pending_events_queue_v1_";

interface QueuedEvent {
  learnerId: string;
  event: LearningEvent;
  retryCount: number;
  queuedAt: number;
}

function getPendingEventQueue(learnerId: string): QueuedEvent[] {
  try {
    const raw = localStorage.getItem(`${PENDING_EVENTS_QUEUE_KEY_PREFIX}${learnerId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePendingEventQueue(learnerId: string, queue: QueuedEvent[]) {
  try {
    localStorage.setItem(`${PENDING_EVENTS_QUEUE_KEY_PREFIX}${learnerId}`, JSON.stringify(queue));
  } catch {}
}

function enqueuePendingEvent(learnerId: string, event: LearningEvent) {
  const queue = getPendingEventQueue(learnerId);
  if (!queue.some((q) => q.event.id === event.id)) {
    queue.push({
      learnerId,
      event,
      retryCount: 0,
      queuedAt: Date.now(),
    });
    savePendingEventQueue(learnerId, queue);
  }
}

export async function flushPendingEventsQueue(learnerId: string = getActiveLearnerId()): Promise<void> {
  const queue = getPendingEventQueue(learnerId);
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

  savePendingEventQueue(learnerId, remaining);
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
  | "worksheet-practice"
  | "geometry-tangram"
  | "code-runner"
  | "times-matrix"
  | "phonics-pop"
  | "storybook-interaction"
  | "guided-assessment"
  | "world-activity"
  | "world-mission"
  | "engagement";

export type LearningEventType =
  | "question_answered"
  | "learner_response"
  | "activity_completed"
  | "assessment_response"
  | "practice_response"
  | "session_summary"
  | "content_explored"
  | "experience_opened"
  | "story_interaction"
  | "mission_completed"
  | "creative_interaction"
  | "diagnostic_summary";

export type LearningEventOutcome = "correct" | "incorrect" | "partial" | "explored";

/**
 * A persisted learner-evidence event. Event, activity, experience, content, and skill IDs
 * intentionally have separate fields and lifecycles.
 */
export interface LearningEvent {
  id: string;
  learnerId: string;
  activityId: string;
  experienceId: string;
  contentId?: string;
  eventType: LearningEventType;
  activityType: ActivityType;
  activityTitle: string;
  skillId?: string;
  domain: CurriculumDomain | "general";
  gradeBand: GradeLevelBand | "toddler";
  result: "mastered" | "success" | "struggle" | "practice" | "explored";
  outcome: LearningEventOutcome;
  score?: number; // 0 - 100 percentage or raw points
  maxScore?: number;
  difficulty: "beginner" | "easy" | "medium" | "hard" | "expert";
  attempts: number;
  hintsUsed: number;
  timeSpentSeconds?: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

export type LearningEventInput = Omit<LearningEvent, "id" | "timestamp" | "experienceId" | "eventType" | "outcome"> & {
  id?: string;
  timestamp?: number;
  experienceId?: string;
  eventType?: LearningEventType;
  outcome?: LearningEventOutcome;
};

export interface SkillMasteryRecord {
  skillId: string;
  domain: CurriculumDomain;
  gradeBand: GradeLevelBand | "toddler";
  tier: "locked" | "novice" | "practitioner" | "master";
  evidenceScore: number; // 0 - 100 continuous score
  confidence: number; // 0 - 100 confidence derived from meaningful response evidence
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

export type RecommendationReason = "recent-mistake" | "needs-practice" | "near-mastery" | "new-skill";

export interface RecommendedAction {
  id: string;
  type: "mistake-review" | "curriculum-skill" | "mastery-challenge" | "lab-mission" | "toddler-world" | "practice";
  title: string;
  reason: string;
  badge: string;
  reasonCode: RecommendationReason;
  targetTab: NavigationTab;
  skillId: string;
  domain: CurriculumDomain;
  nodeId?: string;
  activityId: string;
  experienceId: string;
  targetId: string;
  urgency: "high" | "medium" | "low";
}

export interface LearnerModel {
  learnerId: string;
  gradeBand: GradeLevelBand | "toddler";
  skillMastery: Record<string, SkillMasteryRecord>;
  recentEvents: LearningEvent[]; // last 50 events
  processedEventIds: string[]; // idempotency window for offline retries
  totalLearningEventsCount: number;
  weakSkills: string[]; // skill IDs needing review or low evidence
  strongSkills: string[]; // skill IDs with practitioner or master tier
  completedMissions: string[];
  activeStreak: number;
  lastActiveTimestamp: number;
  recommendedNext: RecommendedAction[];
}

const DEFAULT_LEARNER_ID = "scholar-primary-1";
const curriculumById = new Map(CURRICULUM_SKILL_NODES.map((node) => [node.id, node]));
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
      confidence: 0,
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
    processedEventIds: [],
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
    // Historical unscoped model data belongs only to the original default learner;
    // a newly active account must never adopt it as its own mastery history.
    if (!raw && targetId === DEFAULT_LEARNER_ID) {
      raw = localStorage.getItem(LEGACY_MODEL_KEY);
      if (raw) {
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
      parsed.skillMastery = Object.fromEntries(
        Object.entries(parsed.skillMastery || {}).filter(([skillId]) => curriculumById.has(skillId))
      );
      parsed.recentEvents = Array.isArray(parsed.recentEvents) ? parsed.recentEvents : [];
      parsed.processedEventIds = Array.isArray(parsed.processedEventIds)
        ? parsed.processedEventIds
        : parsed.recentEvents.map((event) => event.id).filter(Boolean);
      // Reconcile with any new curriculum nodes added to curriculumUniverse
      CURRICULUM_SKILL_NODES.forEach((node) => {
        if (!parsed.skillMastery[node.id]) {
          parsed.skillMastery[node.id] = {
            skillId: node.id,
            domain: node.domain,
            gradeBand: node.gradeBand,
            tier: node.prerequisites.length === 0 ? "novice" : "locked",
            evidenceScore: 0,
            confidence: 0,
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
          parsed.skillMastery[node.id].confidence ??= 0;
        }
      });

      parsed.totalLearningEventsCount = Number.isFinite(parsed.totalLearningEventsCount) ? parsed.totalLearningEventsCount : parsed.recentEvents.length;
      parsed.completedMissions = Array.isArray(parsed.completedMissions) ? parsed.completedMissions : [];
      parsed.weakSkills = Array.isArray(parsed.weakSkills) ? parsed.weakSkills.filter((skillId) => curriculumById.has(skillId)) : [];
      parsed.strongSkills = Array.isArray(parsed.strongSkills) ? parsed.strongSkills.filter((skillId) => curriculumById.has(skillId)) : [];
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
  model.processedEventIds = Array.isArray(model.processedEventIds) ? model.processedEventIds.slice(-500) : [];
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
    processedEventIds: [],
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
        confidence: Math.max(localRec.confidence || 0, cloudRec.confidence || 0),
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
    } else if (localRec && curriculumById.has(skillId)) {
      merged.skillMastery[skillId] = { ...localRec, confidence: localRec.confidence || 0, consecutiveUnassistedSuccesses: localRec.consecutiveUnassistedSuccesses || 0 };
    } else if (cloudRec && curriculumById.has(skillId)) {
      merged.skillMastery[skillId] = { ...cloudRec, confidence: cloudRec.confidence || 0, consecutiveUnassistedSuccesses: cloudRec.consecutiveUnassistedSuccesses || 0 };
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
  merged.processedEventIds = Array.from(new Set([
    ...(localModel.processedEventIds || []),
    ...(cloudModel.processedEventIds || []),
    ...merged.recentEvents.map((event) => event.id),
  ])).slice(-500);

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
      flushPendingEventsQueue(userId).catch(() => {});
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

/** Returns a real, launchable learning activity linked to the requested skill. */
function selectActivityForSkill(skillId: string, gradeBand: LearnerModel["gradeBand"], preferredActivityId?: string) {
  const candidates = getActivitiesForSkill(skillId).filter((activity) =>
    activity.skillIds.includes(skillId) &&
    !["engagement", "assessment", "homework", "picture-book"].includes(activity.experienceType) &&
    (activity.experienceType !== "toddler-world" || (activity.minimumWorldStars ?? 0) === 0)
  );
  const preferred = preferredActivityId
    ? candidates.find((activity) => activity.id === preferredActivityId)
    : undefined;
  if (preferred) return preferred;

  const gradeMatch = (activity: ReturnType<typeof getActivitiesForSkill>[number]) =>
    gradeBand === "toddler"
      ? activity.gradeBand === "toddler" ? 0 : 1
      : activity.gradeBand === gradeBand ? 0 : activity.experienceType === "curriculum-quest" ? 2 : 1;
  const sorted = [...candidates].sort((a, b) => {
    const aGeneric = a.experienceType === "curriculum-quest" ? 1 : 0;
    const bGeneric = b.experienceType === "curriculum-quest" ? 1 : 0;
    return gradeMatch(a) - gradeMatch(b) || aGeneric - bGeneric || a.id.localeCompare(b.id);
  });
  const selected = sorted[0];
  if (!selected) throw new Error(`No launchable activity is registered for skill ${skillId}`);
  return selected;
}

function createRecommendation(
  model: LearnerModel,
  skillId: string,
  reasonCode: RecommendationReason,
  urgency: RecommendedAction["urgency"],
  preferredActivityId?: string
): RecommendedAction {
  const node = curriculumById.get(skillId);
  if (!node) throw new Error(`Recommendation references unknown skill ${skillId}`);
  const activity = selectActivityForSkill(skillId, model.gradeBand, preferredActivityId);
  const labels: Record<RecommendationReason, { type: RecommendedAction["type"]; badge: string; title: string; reason: string }> = {
    "recent-mistake": {
      type: "practice",
      badge: "Recent Challenge",
      title: `Try Again: ${node.title}`,
      reason: "A recent response showed this concept may benefit from another supported practice round.",
    },
    "needs-practice": {
      type: "practice",
      badge: "Needs Practice",
      title: `Reinforce: ${node.title}`,
      reason: "Strengthen this concept with a focused activity before moving to a more advanced standard.",
    },
    "near-mastery": {
      type: "mastery-challenge",
      badge: "Almost There",
      title: `Mastery Challenge: ${node.title}`,
      reason: "Build on demonstrated progress with one more targeted challenge.",
    },
    "new-skill": {
      type: "curriculum-skill",
      badge: "Next Skill",
      title: `Next Standard: ${node.title}`,
      reason: `Start this ${node.gradeBand} curriculum skill, aligned to ${node.standardCode}.`,
    },
  };
  const label = labels[reasonCode];
  return {
    id: `rec-${reasonCode}-${skillId}-${activity.id}`,
    type: label.type,
    title: label.title,
    reason: label.reason,
    badge: label.badge,
    reasonCode,
    targetTab: activity.launch.route,
    skillId,
    domain: node.domain,
    nodeId: skillId,
    activityId: activity.id,
    experienceId: activity.experienceId,
    targetId: activity.launch.targetId,
    urgency,
  };
}

/** Computes deterministic recommendations entirely from the learner's own model. */
export function computeRecommendations(model: LearnerModel): RecommendedAction[] {
  const actions: RecommendedAction[] = [];
  const now = Date.now();
  const recentFailure = (model.recentEvents || []).find((event) =>
    event.result === "struggle" && event.skillId && curriculumById.has(event.skillId) &&
    now - (event.timestamp || 0) <= 30 * 24 * 60 * 60 * 1000
  );
  if (recentFailure?.skillId) {
    actions.push(createRecommendation(model, recentFailure.skillId, "recent-mistake", "high", recentFailure.activityId));
  }

  const weakSkill = Object.values(model.skillMastery || {})
    .filter((record) => curriculumById.has(record.skillId) && record.tier !== "master" && (record.needsReview || record.strugglesCount > 0))
    .sort((a, b) => Number(b.needsReview) - Number(a.needsReview) || b.strugglesCount - a.strugglesCount || b.lastPracticedTimestamp - a.lastPracticedTimestamp || a.skillId.localeCompare(b.skillId))[0];
  if (weakSkill && !actions.some((action) => action.skillId === weakSkill.skillId)) {
    actions.push(createRecommendation(model, weakSkill.skillId, "needs-practice", "high"));
  }

  const nearMastery = Object.values(model.skillMastery || {})
    .filter((record) => record.tier === "practitioner" && record.evidenceScore >= 65 && curriculumById.has(record.skillId))
    .sort((a, b) => b.evidenceScore - a.evidenceScore || a.skillId.localeCompare(b.skillId))[0];
  if (nearMastery && !actions.some((action) => action.skillId === nearMastery.skillId)) {
    actions.push(createRecommendation(model, nearMastery.skillId, "near-mastery", "medium"));
  }

  const nextUnlocked = CURRICULUM_SKILL_NODES.find((node) => {
    const record = model.skillMastery[node.id];
    if (!record || record.tier === "master" || record.totalAttempts > 0) return false;
    return node.prerequisites.every((prerequisiteId) => {
      const prerequisite = model.skillMastery[prerequisiteId];
      return prerequisite?.tier === "practitioner" || prerequisite?.tier === "master";
    });
  });
  if (nextUnlocked && !actions.some((action) => action.skillId === nextUnlocked.id)) {
    actions.push(createRecommendation(model, nextUnlocked.id, "new-skill", "medium"));
  }

  return actions.slice(0, 4);
}

function outcomeForResult(result: LearningEvent["result"]): LearningEventOutcome {
  if (result === "mastered" || result === "success") return "correct";
  if (result === "struggle") return "incorrect";
  if (result === "practice") return "partial";
  return "explored";
}

function eventCanUpdateMastery(event: LearningEvent): boolean {
  return ["question_answered", "learner_response", "activity_completed", "assessment_response", "practice_response", "session_summary"].includes(event.eventType) &&
    event.outcome !== "explored";
}

function calculateConfidence(record: SkillMasteryRecord): number {
  const observedResponses = record.successfulAttempts + record.strugglesCount;
  if (observedResponses === 0) return 0;
  const coverage = observedResponses / (observedResponses + 2);
  const accuracy = (record.successfulAttempts + 1) / (observedResponses + 2);
  return Math.round(coverage * (0.5 + accuracy * 0.5) * 100);
}

function updateLearningStreak(model: LearnerModel, eventTimestamp: number): void {
  if (eventTimestamp <= model.lastActiveTimestamp) return;
  const previousDate = model.lastActiveTimestamp ? new Date(model.lastActiveTimestamp).toISOString().slice(0, 10) : "";
  const currentDate = new Date(eventTimestamp).toISOString().slice(0, 10);
  if (!previousDate) {
    model.activeStreak = 1;
  } else if (previousDate === currentDate) {
    model.activeStreak = Math.max(1, model.activeStreak);
  } else {
    const previousDay = new Date(`${previousDate}T00:00:00.000Z`).getTime();
    const currentDay = new Date(`${currentDate}T00:00:00.000Z`).getTime();
    model.activeStreak = currentDay - previousDay === 24 * 60 * 60 * 1000 ? model.activeStreak + 1 : 1;
  }
  model.lastActiveTimestamp = eventTimestamp;
}

/**
 * Main event gateway. It rejects unknown activities/skills and records mastery only
 * for a scored learner response, never for merely opening or exploring an experience.
 */
export function recordLearningEvent(eventInput: LearningEventInput): LearningEvent {
  const targetLearnerId = eventInput.learnerId || getActiveLearnerId();
  const definition = resolveActivityDefinition(eventInput.activityId);
  const eventType = eventInput.eventType || (eventInput.result === "explored" ? "content_explored" : "learner_response");
  const outcome = eventInput.outcome || outcomeForResult(eventInput.result);
  const experienceId = eventInput.experienceId || definition.experienceId;
  if (experienceId !== definition.experienceId) {
    throw new Error(`Activity ${definition.id} belongs to experience ${definition.experienceId}, not ${experienceId}`);
  }
  const skillId = eventInput.skillId;
  const masteryAffecting = eventCanUpdateMastery({
    ...eventInput,
    id: eventInput.id || "pending-event-validation",
    learnerId: targetLearnerId,
    activityId: definition.id,
    experienceId,
    eventType,
    outcome,
    timestamp: eventInput.timestamp ?? 0,
  } as LearningEvent);

  if (eventInput.outcome && eventInput.outcome !== outcomeForResult(eventInput.result)) {
    throw new Error(`Learning event outcome ${eventInput.outcome} conflicts with result ${eventInput.result}`);
  }
  if (skillId) {
    const skill = curriculumById.get(skillId);
    if (!skill) throw new Error(`Learning event references unknown curriculum skill: ${skillId}`);
    if (!definition.skillIds.includes(skillId)) {
      throw new Error(`Activity ${definition.id} is not mapped to curriculum skill ${skillId}`);
    }
    if (eventInput.domain !== "general" && eventInput.domain !== skill.domain) {
      throw new Error(`Activity ${definition.id} reports ${eventInput.domain} evidence for ${skill.domain} skill ${skillId}`);
    }
  }
  if (masteryAffecting && !skillId) {
    throw new Error(`Mastery-affecting event ${definition.id} must reference a canonical skillId`);
  }
  if (!masteryAffecting && skillId && !definition.skillIds.includes(skillId)) {
    throw new Error(`Engagement event ${definition.id} references unrelated skill ${skillId}`);
  }
  if (masteryAffecting && definition.skillIds.length === 0) {
    throw new Error(`Engagement-only activity ${definition.id} cannot update mastery`);
  }

  const event: LearningEvent = {
    ...eventInput,
    learnerId: targetLearnerId,
    activityId: definition.id,
    experienceId,
    contentId: eventInput.contentId,
    eventType,
    skillId,
    domain: skillId ? curriculumById.get(skillId)!.domain : "general",
    gradeBand: eventInput.gradeBand,
    outcome,
    id: eventInput.id || `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: eventInput.timestamp ?? Date.now(),
    attempts: Math.max(1, Math.min(100, Math.floor(eventInput.attempts || 1))),
    hintsUsed: Math.max(0, Math.floor(eventInput.hintsUsed || 0)),
  };
  const model = getLearnerModel(targetLearnerId);
  if (model.processedEventIds?.includes(event.id) || model.recentEvents.some((previous) => previous.id === event.id)) {
    return model.recentEvents.find((previous) => previous.id === event.id) || event;
  }

  if (masteryAffecting && skillId) {
    const skill = curriculumById.get(skillId)!;
    const record = model.skillMastery[skillId];
    if (!record) throw new Error(`Learner model has no canonical mastery record for ${skillId}`);
    record.totalAttempts += event.attempts;
    record.hintsUsedTotal += event.hintsUsed * event.attempts;
    record.lastPracticedTimestamp = Math.max(record.lastPracticedTimestamp, event.timestamp);

    if (event.outcome === "correct") {
      record.successfulAttempts += event.attempts;
      record.consecutiveSuccesses += 1;
      record.consecutiveUnassistedSuccesses = event.hintsUsed === 0 ? record.consecutiveUnassistedSuccesses + 1 : 0;
      record.consecutiveStruggles = 0;
      record.needsReview = false;
      const hintFactor = event.hintsUsed === 0 ? 1 : event.hintsUsed === 1 ? 0.65 : 0.4;
      const scoreFactor = Math.max(0.35, Math.min(1, (event.score ?? 100) / 100));
      const repetitionFactor = Math.min(1.35, Math.sqrt(event.attempts));
      const evidenceGain = Math.round(24 * hintFactor * scoreFactor * repetitionFactor);
      record.evidenceScore = Math.min(100, record.evidenceScore + evidenceGain);

      if (record.consecutiveUnassistedSuccesses >= 3 && record.currentDifficultyLevel < 5) {
        record.currentDifficultyLevel += 1;
        record.consecutiveUnassistedSuccesses = 0;
      }
    } else if (event.outcome === "incorrect") {
      record.strugglesCount += event.attempts;
      record.consecutiveStruggles += 1;
      record.consecutiveSuccesses = 0;
      record.consecutiveUnassistedSuccesses = 0;
      record.evidenceScore = Math.max(0, record.evidenceScore - Math.min(16, 8 * event.attempts));
      if (record.consecutiveStruggles >= 2 && record.currentDifficultyLevel > 1) {
        record.currentDifficultyLevel -= 1;
      }
      record.needsReview = true;
    } else if (event.outcome === "partial") {
      const scoreFactor = Math.max(0, Math.min(1, (event.score ?? 50) / 100));
      record.evidenceScore = Math.min(100, record.evidenceScore + Math.max(1, Math.round(12 * scoreFactor)));
      record.consecutiveSuccesses = 0;
      record.consecutiveUnassistedSuccesses = 0;
    }

    record.confidence = calculateConfidence(record);
    if (record.evidenceScore >= 80 && record.successfulAttempts >= 2) {
      if (record.tier !== "master") record.masteredTimestamp = event.timestamp;
      record.tier = "master";
    } else if (record.evidenceScore >= 45 && record.tier !== "master") {
      record.tier = "practitioner";
    } else if (record.tier === "locked" && event.outcome !== "explored") {
      record.tier = "novice";
    }
    record.domain = skill.domain;
    record.gradeBand = skill.gradeBand;
  }

  model.recentEvents = [event, ...model.recentEvents.filter((previous) => previous.id !== event.id)].slice(0, 50);
  model.processedEventIds = [...(model.processedEventIds || []).filter((id) => id !== event.id), event.id].slice(-500);
  model.totalLearningEventsCount += 1;
  updateLearningStreak(model, event.timestamp);

  model.strongSkills = Object.values(model.skillMastery)
    .filter((record) => record.tier === "master" || record.tier === "practitioner")
    .map((record) => record.skillId);
  model.weakSkills = Object.values(model.skillMastery)
    .filter((record) => record.needsReview || (record.strugglesCount > 0 && record.tier !== "master"))
    .map((record) => record.skillId);

  // A downstream node unlocks at practitioner level, matching the skill-tree UI.
  CURRICULUM_SKILL_NODES.forEach((node) => {
    const record = model.skillMastery[node.id];
    if (record?.tier === "locked" && node.prerequisites.every((id) => {
      const prerequisite = model.skillMastery[id];
      return prerequisite?.tier === "practitioner" || prerequisite?.tier === "master";
    })) {
      record.tier = "novice";
      record.evidenceScore = 0;
      record.confidence = 0;
    }
  });

  model.recommendedNext = computeRecommendations(model);
  saveLearnerModel(model, targetLearnerId);
  if (masteryAffecting && skillId) {
    markDailyRouteEvidenceComplete(targetLearnerId, event.activityId, skillId, event.timestamp);
  }

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
