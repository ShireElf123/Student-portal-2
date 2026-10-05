import { CURRICULUM_SKILL_NODES } from "../data/curriculumUniverse";
import { getActivitiesForSkill, resolveActivityDefinition, LearningActivityDefinition } from "../data/activitySkillRegistry";
import type { LearnerModel } from "./learnerBrain";
import { todayISO } from "./dateUtils";

export type DailyRouteReason = "recent-mistake" | "reinforcement" | "new-skill" | "spaced-review";

export interface DailyRouteItem {
  id: string;
  slot: number;
  reason: DailyRouteReason;
  title: string;
  description: string;
  skillId: string;
  activityId: string;
  experienceId: string;
  targetTab: LearningActivityDefinition["launch"]["route"];
  targetId: string;
  completed: boolean;
}

export interface DailyLearningRoute {
  id: string;
  learnerId: string;
  date: string;
  version: "learning-route-v1";
  generatedFromEventCount: number;
  items: DailyRouteItem[];
  updatedAt: number;
}

const ROUTE_STORAGE_PREFIX = "student_portal_daily_learning_route_v1_";
const ROUTE_LENGTH = 3;

function routeStorageKey(learnerId: string, date: string): string {
  return `${ROUTE_STORAGE_PREFIX}${learnerId}_${date}`;
}

function isValidDateKey(date: unknown): date is string {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  return Number.isFinite(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === date;
}

function hashSeed(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function isUnlocked(model: LearnerModel, skillId: string): boolean {
  const node = CURRICULUM_SKILL_NODES.find((candidate) => candidate.id === skillId);
  return Boolean(node && node.prerequisites.every((id) => {
    const tier = model.skillMastery[id]?.tier;
    return tier === "practitioner" || tier === "master";
  }));
}

function pickActivity(skillId: string, gradeBand: LearnerModel["gradeBand"]): LearningActivityDefinition {
  const candidates = getActivitiesForSkill(skillId).filter((activity) =>
    activity.experienceType !== "engagement" &&
    activity.experienceType !== "assessment" &&
    activity.experienceType !== "homework" &&
    activity.experienceType !== "practice" &&
    activity.experienceType !== "picture-book" &&
    (activity.experienceType !== "toddler-world" || (activity.minimumWorldStars ?? 0) === 0)
  );
  const preferred = [...candidates].sort((a, b) => {
    const gradePreference = (activity: LearningActivityDefinition) => {
      if (gradeBand === "toddler") return activity.gradeBand === "toddler" ? 0 : activity.experienceType === "curriculum-quest" ? 2 : 1;
      if (activity.gradeBand === gradeBand) return 0;
      return activity.experienceType === "curriculum-quest" ? 2 : 1;
    };
    const aGeneric = a.experienceType === "curriculum-quest" ? 1 : 0;
    const bGeneric = b.experienceType === "curriculum-quest" ? 1 : 0;
    return gradePreference(a) - gradePreference(b) || aGeneric - bGeneric || a.id.localeCompare(b.id);
  })[0];
  if (!preferred) throw new Error(`Daily route has no launchable activity for skill ${skillId}`);
  return preferred;
}

function createItem(
  model: LearnerModel,
  date: string,
  slot: number,
  reason: DailyRouteReason,
  skillId: string,
  completed: boolean
): DailyRouteItem {
  const node = CURRICULUM_SKILL_NODES.find((candidate) => candidate.id === skillId);
  if (!node) throw new Error(`Daily route references unknown curriculum skill ${skillId}`);
  const activity = pickActivity(skillId, model.gradeBand);
  const descriptions: Record<DailyRouteReason, string> = {
    "recent-mistake": "Revisit a skill after a recent challenging response.",
    reinforcement: "Strengthen a skill that has needed extra support.",
    "new-skill": "Explore an unlocked curriculum skill you have not practiced yet.",
    "spaced-review": "Refresh a previously practiced skill after a short break.",
  };
  return {
    id: `${date}:route-${slot}:${skillId}`,
    slot,
    reason,
    title: node.title,
    description: descriptions[reason],
    skillId,
    activityId: activity.id,
    experienceId: activity.experienceId,
    targetTab: activity.launch.route,
    targetId: activity.launch.targetId,
    completed,
  };
}

function chooseSkillPlan(model: LearnerModel, date: string): Array<{ reason: DailyRouteReason; skillId: string }> {
  const [year, month, day] = date.split("-").map(Number);
  const dateEnd = new Date(year, month - 1, day + 1).getTime() - 1;
  const recentMistakeCutoff = dateEnd - 30 * 24 * 60 * 60 * 1000;
  const plan: Array<{ reason: DailyRouteReason; skillId: string }> = [];
  const used = new Set<string>();
  const add = (reason: DailyRouteReason, skillId?: string) => {
    if (!skillId || used.has(skillId) || !model.skillMastery[skillId] || !isUnlocked(model, skillId)) return;
    if (!CURRICULUM_SKILL_NODES.some((node) => node.id === skillId)) return;
    used.add(skillId);
    plan.push({ reason, skillId });
  };

  const latestMistake = (model.recentEvents || []).find((event) =>
    event.result === "struggle" && event.skillId &&
    event.timestamp >= recentMistakeCutoff && event.timestamp <= dateEnd
  );
  add("recent-mistake", latestMistake?.skillId);

  const weak = Object.values(model.skillMastery || {})
    .filter((record) => record.tier !== "master" && (record.needsReview || record.strugglesCount > 0))
    .sort((a, b) => Number(b.needsReview) - Number(a.needsReview) || b.strugglesCount - a.strugglesCount || a.lastPracticedTimestamp - b.lastPracticedTimestamp || a.skillId.localeCompare(b.skillId));
  for (const record of weak) {
    if (plan.length >= ROUTE_LENGTH) break;
    add("reinforcement", record.skillId);
  }

  const nodes = [...CURRICULUM_SKILL_NODES];
  const offset = nodes.length ? hashSeed(`${model.learnerId}:${date}:new`) % nodes.length : 0;
  const rotatedNodes = [...nodes.slice(offset), ...nodes.slice(0, offset)];
  for (const node of rotatedNodes) {
    if (plan.length >= ROUTE_LENGTH) break;
    const record = model.skillMastery[node.id];
    if (!record || record.totalAttempts > 0 || record.tier === "master") continue;
    add("new-skill", node.id);
  }

  const reviewCandidates = Object.values(model.skillMastery || {})
    .filter((record) => record.totalAttempts > 0 && record.lastPracticedTimestamp > 0 && record.tier !== "locked")
    .sort((a, b) => a.lastPracticedTimestamp - b.lastPracticedTimestamp || a.skillId.localeCompare(b.skillId));
  for (const record of reviewCandidates) {
    if (plan.length >= ROUTE_LENGTH) break;
    add("spaced-review", record.skillId);
  }

  // Keep a useful three-step route when a learner has little history or prerequisites.
  for (const node of rotatedNodes) {
    if (plan.length >= ROUTE_LENGTH) break;
    add("new-skill", node.id);
  }
  return plan.slice(0, ROUTE_LENGTH);
}

/** Creates a route once per learner and date, then reuses its stored item identities offline. */
export function getOrCreateDailyLearningRoute(model: LearnerModel, date: string = todayISO()): DailyLearningRoute {
  if (!isValidDateKey(date)) throw new Error(`Invalid daily route date: ${String(date)}`);
  const key = routeStorageKey(model.learnerId, date);
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw) as DailyLearningRoute;
      if (parsed?.learnerId === model.learnerId && parsed.date === date && parsed.version === "learning-route-v1" &&
        validateDailyLearningRoute(parsed).length === 0) {
        return parsed;
      }
    }
  } catch {
    // If storage is blocked/corrupt, the same deterministic route is still produced in memory.
  }

  const now = Date.now();
  const route: DailyLearningRoute = {
    id: `${model.learnerId}:${date}:learning-route-v1`,
    learnerId: model.learnerId,
    date,
    version: "learning-route-v1",
    generatedFromEventCount: model.totalLearningEventsCount,
    items: chooseSkillPlan(model, date).map((step, index) => createItem(model, date, index + 1, step.reason, step.skillId, false)),
    updatedAt: now,
  };
  persistRoute(route);
  return route;
}

function persistRoute(route: DailyLearningRoute): void {
  try {
    localStorage.setItem(routeStorageKey(route.learnerId, route.date), JSON.stringify(route));
  } catch {
    // The caller still has the in-memory route; offline browsing remains available.
  }
}

/** Marks a route step complete only when a meaningful event matches both its activity and skill. */
export function markDailyRouteEvidenceComplete(
  learnerId: string,
  activityId: string,
  skillId: string,
  timestamp: number = Date.now()
): void {
  const date = todayISO(new Date(timestamp));
  const key = routeStorageKey(learnerId, date);
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return;
    const route = JSON.parse(raw) as DailyLearningRoute;
    if (route.learnerId !== learnerId || route.date !== date || validateDailyLearningRoute(route).length > 0) return;
    let changed = false;
    route.items = route.items.map((item) => {
      if (!item.completed && item.activityId === activityId && item.skillId === skillId) {
        changed = true;
        return { ...item, completed: true };
      }
      return item;
    });
    if (changed) {
      route.updatedAt = Date.now();
      persistRoute(route);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("daily_learning_route_updated", { detail: route }));
      }
    }
  } catch {
    // A malformed/corrupt day route must never block learning evidence.
  }
}

export function validateDailyLearningRoute(route: DailyLearningRoute): string[] {
  const issues: string[] = [];
  if (!route || typeof route !== "object") return ["Daily route is not an object"];
  if (route.version !== "learning-route-v1") issues.push(`Unsupported daily route version: ${String(route.version)}`);
  if (!route.learnerId) issues.push("Daily route is missing a learner ID");
  if (!isValidDateKey(route.date)) issues.push(`Daily route has invalid or impossible date: ${String(route.date)}`);
  if (route.id !== `${route.learnerId}:${route.date}:learning-route-v1`) issues.push("Daily route ID does not match learner/date/version");
  if (!Number.isInteger(route.generatedFromEventCount) || route.generatedFromEventCount < 0) {
    issues.push("Daily route has an invalid source event count");
  }
  if (!Number.isFinite(route.updatedAt) || route.updatedAt < 0) issues.push("Daily route has an invalid update timestamp");
  if (!Array.isArray(route.items)) return [...issues, "Daily route items are not an array"];
  if (route.items.length !== ROUTE_LENGTH) issues.push(`Daily route must have exactly ${ROUTE_LENGTH} items`);

  const ids = new Set<string>();
  const slots = new Set<number>();
  for (const item of route.items) {
    if (!item || typeof item !== "object") {
      issues.push("Daily route contains an invalid item");
      continue;
    }
    if (ids.has(item.id)) issues.push(`Duplicate daily route item ID: ${item.id}`);
    ids.add(item.id);
    if (!Number.isInteger(item.slot) || item.slot < 1 || item.slot > ROUTE_LENGTH) {
      issues.push(`Daily route item ${item.id} has invalid slot ${item.slot}`);
    }
    if (slots.has(item.slot)) issues.push(`Daily route has duplicate slot ${item.slot}`);
    slots.add(item.slot);
    if (item.id !== `${route.date}:route-${item.slot}:${item.skillId}`) {
      issues.push(`Daily route item ${item.id} does not match its date/slot/skill identity`);
    }
    if (!["recent-mistake", "reinforcement", "new-skill", "spaced-review"].includes(item.reason)) {
      issues.push(`Daily route item ${item.id} has unknown reason ${String(item.reason)}`);
    }
    if (typeof item.title !== "string" || typeof item.description !== "string" || !item.title.trim() || !item.description.trim()) {
      issues.push(`Daily route item ${item.id} is missing display text`);
    }
    if (!CURRICULUM_SKILL_NODES.some((node) => node.id === item.skillId)) {
      issues.push(`Daily route item ${item.id} references unknown curriculum skill ${item.skillId}`);
    }
    try {
      const activity = resolveActivityDefinition(item.activityId);
      if (activity.id !== item.activityId) issues.push(`Daily route item ${item.id} uses a non-canonical activity ID ${item.activityId}`);
      if (!activity.skillIds.includes(item.skillId)) issues.push(`${item.activityId} is not mapped to ${item.skillId}`);
      if (activity.experienceId !== item.experienceId) {
        issues.push(`${item.activityId} resolves to experience ${activity.experienceId}, not ${item.experienceId}`);
      }
      if (activity.launch.route !== item.targetTab || activity.launch.targetId !== item.targetId) {
        issues.push(`${item.activityId} launch target ${activity.launch.route}:${activity.launch.targetId} does not match route item ${item.targetTab}:${item.targetId}`);
      }
      if (activity.experienceType === "engagement" || activity.experienceType === "assessment" ||
        activity.experienceType === "homework" || activity.experienceType === "practice" || activity.experienceType === "picture-book") {
        issues.push(`${item.activityId} is not a focused route learning activity`);
      }
      if (activity.experienceType === "toddler-world" && (activity.minimumWorldStars ?? 0) > 0) {
        issues.push(`${item.activityId} is gated behind ${activity.minimumWorldStars} toddler-world stars`);
      }
    } catch (error) {
      issues.push(error instanceof Error ? error.message : `Unknown activity ${item.activityId}`);
    }
    if (typeof item.completed !== "boolean") issues.push(`Daily route item ${item.id} has invalid completion state`);
  }
  return issues;
}
