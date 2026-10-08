import { CURRICULUM_SKILL_NODES } from "../data/curriculumUniverse";
import { getActivitiesForSkill, resolveActivityDefinition, LearningActivityDefinition } from "../data/activitySkillRegistry";
import { isAdaptiveRecommendationCategory, type AdaptiveRecommendationCategory, type AdaptiveRoutePhase } from "../learning/adaptiveTypes";
import { deriveLearnerSkillState, getAdaptiveRecommendationCandidates } from "./adaptiveLearning";
import type { LearnerModel, LearningEventOutcome } from "./learnerBrain";
import { todayISO } from "./dateUtils";
import { findSupportedGameTypeForActivity, getSupportedGameEngine, isSupportedGameType } from "../contentEngine/registry";
import { getContentDifficultyForLearner } from "../contentEngine/learnerContext";
import type { ContentDifficulty, ContentTheme, SupportedGameType } from "../contentEngine/types";

export type DailyRouteReason = "recent-mistake" | "reinforcement" | "new-skill" | "spaced-review";

export type DailyRouteDelivery =
  | { kind: "registered-activity" }
  | {
      kind: "generated-content";
      gameType: SupportedGameType;
      difficulty: ContentDifficulty;
      theme: ContentTheme;
    };

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
  /** Optional for backwards compatibility with the persisted learning-route-v1 shape. */
  delivery?: DailyRouteDelivery;
  /** Which deterministic recommendation signal selected this step. */
  recommendationCategory?: AdaptiveRecommendationCategory;
  /** Child-friendly route order, derived from the same learner evidence. */
  phase?: AdaptiveRoutePhase;
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

interface DailyRouteStep {
  skillId: string;
  category: AdaptiveRecommendationCategory;
  phase: AdaptiveRoutePhase;
  preferredActivityId?: string;
}

function pickActivity(
  skillId: string,
  gradeBand: LearnerModel["gradeBand"],
  preferredActivityId?: string
): LearningActivityDefinition {
  const candidates = getActivitiesForSkill(skillId).filter((activity) =>
    activity.experienceType !== "engagement" &&
    activity.experienceType !== "assessment" &&
    activity.experienceType !== "homework" &&
    activity.experienceType !== "practice" &&
    activity.experienceType !== "picture-book" &&
    (activity.experienceType !== "toddler-world" || (activity.minimumWorldStars ?? 0) === 0)
  );
  const preferred = preferredActivityId
    ? candidates.find((activity) => activity.id === preferredActivityId)
    : undefined;
  if (preferred) return preferred;
  const selected = [...candidates].sort((a, b) => {
    const gradePreference = (activity: LearningActivityDefinition) => {
      if (gradeBand === "toddler") return activity.gradeBand === "toddler" ? 0 : activity.experienceType === "curriculum-quest" ? 2 : 1;
      if (activity.gradeBand === gradeBand) return 0;
      return activity.experienceType === "curriculum-quest" ? 2 : 1;
    };
    const aGeneric = a.experienceType === "curriculum-quest" ? 1 : 0;
    const bGeneric = b.experienceType === "curriculum-quest" ? 1 : 0;
    return gradePreference(a) - gradePreference(b) || aGeneric - bGeneric || a.id.localeCompare(b.id);
  })[0];
  if (!selected) throw new Error(`Daily route has no launchable activity for skill ${skillId}`);
  return selected;
}

function reasonForCategory(category: AdaptiveRecommendationCategory): DailyRouteReason {
  switch (category) {
    case "recovery": return "recent-mistake";
    case "foundation":
    case "practice": return "reinforcement";
    case "review": return "spaced-review";
    case "next":
    case "challenge": return "new-skill";
  }
}

function descriptionForStep(step: DailyRouteStep): string {
  if (step.phase === "warm-up") return "Start with a quick refresher and build a little momentum.";
  if (step.phase === "growth") {
    return step.category === "challenge"
      ? "You have opened a connected skill—see what new idea you can discover."
      : "Explore a fresh skill that is ready for you.";
  }
  switch (step.category) {
    case "recovery": return "Try a calmer round with a helpful clue and a fresh chance.";
    case "foundation": return "Strengthen an earlier idea that supports your next steps.";
    case "review": return "Bring a familiar skill back for a short refresh.";
    case "practice": return "A few focused rounds can help this skill feel more familiar.";
    case "next": return "Take one small step into a skill that is ready to explore.";
    case "challenge": return "Stretch your thinking with a connected skill.";
  }
}

function createItem(
  model: LearnerModel,
  date: string,
  slot: number,
  step: DailyRouteStep,
  completed: boolean,
  preferredActivityId?: string
): DailyRouteItem {
  const node = CURRICULUM_SKILL_NODES.find((candidate) => candidate.id === step.skillId);
  if (!node) throw new Error(`Daily route references unknown curriculum skill ${step.skillId}`);
  const activity = pickActivity(step.skillId, model.gradeBand, preferredActivityId ?? step.preferredActivityId);
  const supportedGameType = findSupportedGameTypeForActivity(activity.id, step.skillId);
  const delivery: DailyRouteDelivery = supportedGameType
    ? {
        kind: "generated-content",
        gameType: supportedGameType,
        difficulty: getContentDifficultyForLearner(model, step.skillId),
        theme: supportedGameType === "bubble-pop-phonics" ? "garden" : "space",
      }
    : { kind: "registered-activity" };
  return {
    id: `${date}:route-${slot}:${step.skillId}`,
    slot,
    reason: reasonForCategory(step.category),
    title: node.title,
    description: descriptionForStep(step),
    skillId: step.skillId,
    activityId: activity.id,
    experienceId: activity.experienceId,
    targetTab: activity.launch.route,
    targetId: activity.launch.targetId,
    delivery,
    recommendationCategory: step.category,
    phase: step.phase,
    completed,
  };
}

function chooseSkillPlan(
  model: LearnerModel,
  date: string,
  excludedSkillIds: ReadonlySet<string> = new Set()
): DailyRouteStep[] {
  const dateEnd = new Date(`${date}T23:59:59.999`).getTime();
  const candidates = getAdaptiveRecommendationCandidates(model, {
    now: dateEnd,
    limit: CURRICULUM_SKILL_NODES.length,
  });
  const used = new Set(excludedSkillIds);
  const plan: DailyRouteStep[] = [];
  const take = (predicate: (candidate: (typeof candidates)[number]) => boolean) =>
    candidates.find((candidate) => !used.has(candidate.skillId) && predicate(candidate));
  const add = (candidate: (typeof candidates)[number] | undefined, phase: AdaptiveRoutePhase) => {
    if (!candidate || used.has(candidate.skillId)) return false;
    used.add(candidate.skillId);
    plan.push({
      skillId: candidate.skillId,
      category: candidate.category,
      phase,
      ...(candidate.preferredActivityId ? { preferredActivityId: candidate.preferredActivityId } : {}),
    });
    return true;
  };
  const hasRecentRecall = (candidate: (typeof candidates)[number]) => {
    const state = deriveLearnerSkillState(model, candidate.skillId, dateEnd);
    return state.recentAccuracy === null || state.recentAccuracy >= 0.7;
  };

  const warmUp = take((candidate) =>
    candidate.category === "review" || candidate.category === "challenge" ||
    candidate.category === "next" || (candidate.category === "practice" && hasRecentRecall(candidate))
  );
  add(warmUp ?? take(() => true), "warm-up");

  const focus = take((candidate) => ["recovery", "foundation", "practice", "review"].includes(candidate.category));
  add(focus ?? take((candidate) => candidate.category !== "recovery" && candidate.category !== "foundation"), "focus");

  const growth = take((candidate) => candidate.category === "next" || candidate.category === "challenge");
  add(growth ?? take(() => true), "growth");

  const fallbackPhases: AdaptiveRoutePhase[] = ["warm-up", "focus", "growth"];
  while (plan.length < ROUTE_LENGTH) {
    const phase = fallbackPhases[plan.length] ?? "growth";
    const fallback = take(() => true);
    if (!add(fallback, phase)) break;
  }

  if (plan.length < ROUTE_LENGTH) {
    const retrievalCandidates = CURRICULUM_SKILL_NODES
      .filter((node) => !used.has(node.id))
      .map((node) => ({ node, state: deriveLearnerSkillState(model, node.id, dateEnd) }))
      .filter(({ node, state }) => state.isUnlocked && getActivitiesForSkill(node.id).some((activity) =>
        activity.experienceType !== "engagement" && activity.experienceType !== "assessment" &&
        activity.experienceType !== "homework" && activity.experienceType !== "practice" &&
        activity.experienceType !== "picture-book" &&
        (activity.experienceType !== "toddler-world" || (activity.minimumWorldStars ?? 0) === 0)
      ))
      .sort((left, right) =>
        (right.state.daysSinceLastPractice ?? Number.MAX_SAFE_INTEGER) -
        (left.state.daysSinceLastPractice ?? Number.MAX_SAFE_INTEGER) || left.node.id.localeCompare(right.node.id)
      );
    for (const { node, state } of retrievalCandidates) {
      if (plan.length >= ROUTE_LENGTH) break;
      const category: AdaptiveRecommendationCategory = state.totalAttempts === 0
        ? "next"
        : state.tier === "master" || state.tier === "practitioner" ? "review" : "practice";
      const phase = fallbackPhases[plan.length] ?? "growth";
      add({
        skillId: node.id,
        category,
        reasonCode: category === "next" ? "new-skill" : category === "review" ? "needs-practice" : "needs-practice",
        urgency: "low",
        priorityScore: 0,
      }, phase);
    }
  }
  return plan.slice(0, ROUTE_LENGTH);
}

/** Keeps completed route steps, but deterministically replans every unfinished slot when evidence changes. */
export function getOrCreateDailyLearningRoute(model: LearnerModel, date: string = todayISO()): DailyLearningRoute {
  if (!isValidDateKey(date)) throw new Error(`Invalid daily route date: ${String(date)}`);
  const key = routeStorageKey(model.learnerId, date);
  let previousRoute: DailyLearningRoute | undefined;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw) as DailyLearningRoute;
      if (parsed?.learnerId === model.learnerId && parsed.date === date && parsed.version === "learning-route-v1" &&
        validateDailyLearningRoute(parsed).length === 0) {
        if (parsed.generatedFromEventCount === model.totalLearningEventsCount) return parsed;
        previousRoute = parsed;
      }
    }
  } catch {
    // If storage is blocked/corrupt, the same deterministic route is still produced in memory.
  }

  const latestOutcomeByActivitySkill = new Map<string, LearningEventOutcome>();
  const latestActivityBySkill = new Map<string, string>();
  const responsesForDate = [...(model.recentEvents || [])]
    .filter((event) => event.skillId && event.outcome !== "explored" && todayISO(new Date(event.timestamp)) === date)
    .sort((left, right) => right.timestamp - left.timestamp || right.id.localeCompare(left.id));
  for (const event of responsesForDate) {
    const key = `${event.activityId}::${event.skillId}`;
    if (!latestOutcomeByActivitySkill.has(key)) latestOutcomeByActivitySkill.set(key, event.outcome);
    if (event.skillId && !latestActivityBySkill.has(event.skillId)) latestActivityBySkill.set(event.skillId, event.activityId);
  }

  const completedBySlot = new Map<number, DailyRouteItem>();
  for (const item of previousRoute?.items ?? []) {
    const latestOutcome = latestOutcomeByActivitySkill.get(`${item.activityId}::${item.skillId}`);
    const completed = latestOutcome === undefined ? item.completed : latestOutcome === "correct";
    if (completed) completedBySlot.set(item.slot, { ...item, completed: true });
  }
  const completedSkillIds = new Set([...completedBySlot.values()].map((item) => item.skillId));
  const plan = chooseSkillPlan(model, date, completedSkillIds);
  const items: DailyRouteItem[] = [];
  let planIndex = 0;
  for (let slot = 1; slot <= ROUTE_LENGTH; slot += 1) {
    const completedItem = completedBySlot.get(slot);
    if (completedItem) {
      items.push(completedItem);
      continue;
    }
    const step = plan[planIndex++];
    if (!step) throw new Error(`Adaptive route could not fill slot ${slot} for ${model.learnerId}`);
    const preferredActivityId = latestActivityBySkill.get(step.skillId);
    const item = createItem(model, date, slot, step, false, preferredActivityId);
    if (latestOutcomeByActivitySkill.get(`${item.activityId}::${item.skillId}`) === "correct") item.completed = true;
    items.push(item);
  }

  const route: DailyLearningRoute = {
    id: `${model.learnerId}:${date}:learning-route-v1`,
    learnerId: model.learnerId,
    date,
    version: "learning-route-v1",
    generatedFromEventCount: model.totalLearningEventsCount,
    items,
    updatedAt: Date.now(),
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

/** Completes a route step only after a correct response matches both its activity and skill. */
export function markDailyRouteEvidenceComplete(
  learnerId: string,
  activityId: string,
  skillId: string,
  timestamp: number = Date.now(),
  outcome: LearningEventOutcome = "correct"
): void {
  if (outcome !== "correct") return;
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
    if (item.recommendationCategory !== undefined && !isAdaptiveRecommendationCategory(item.recommendationCategory)) {
      issues.push(`Daily route item ${item.id} has an unknown recommendation category`);
    }
    if (item.phase !== undefined && !["warm-up", "focus", "growth"].includes(item.phase)) {
      issues.push(`Daily route item ${item.id} has an unknown adaptive phase`);
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
    if (item.delivery !== undefined) {
      if (!item.delivery || typeof item.delivery !== "object" || Array.isArray(item.delivery)) {
        issues.push(`Daily route item ${item.id} has invalid delivery metadata`);
      } else if (item.delivery.kind === "registered-activity") {
        // The route uses the canonical registered activity without generated content.
      } else if (item.delivery.kind === "generated-content") {
        if (!isSupportedGameType(item.delivery.gameType)) {
          issues.push(`Daily route item ${item.id} references an unsupported generated game`);
        } else {
          const game = getSupportedGameEngine(item.delivery.gameType);
          if (game.activityId !== item.activityId || !game.skillIds.includes(item.skillId)) {
            issues.push(`Daily route item ${item.id} has a generated game incompatible with its registered activity or skill`);
          }
        }
        if (!["easy", "medium", "hard"].includes(item.delivery.difficulty)) {
          issues.push(`Daily route item ${item.id} has an invalid generated-content difficulty`);
        }
        if (!["space", "garden", "ocean", "animals", "everyday"].includes(item.delivery.theme)) {
          issues.push(`Daily route item ${item.id} has an unsupported generated-content theme`);
        }
      } else {
        issues.push(`Daily route item ${item.id} has an unknown delivery mode`);
      }
    }
    if (typeof item.completed !== "boolean") issues.push(`Daily route item ${item.id} has invalid completion state`);
  }
  return issues;
}
