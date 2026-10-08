import { getSkillGraphNode, getSkillGraphNodes } from "../data/skillGraph";
import { getActivitiesForSkill } from "../data/activitySkillRegistry";
import type {
  AdaptiveRecommendationCategory,
  DifficultyLevel,
  MisconceptionTag,
  ScaffoldLevel,
} from "../learning/adaptiveTypes";
import type { LearnerModel, RecommendationReason } from "./learnerBrain";

const RECENT_EVIDENCE_LIMIT = 5;
const MISCONCEPTION_WINDOW = 10;
const DAY_MS = 24 * 60 * 60 * 1000;
const REVIEW_AFTER_DAYS = 7;

export interface MisconceptionSignal {
  tag: MisconceptionTag;
  occurrences: number;
  lastObservedAt: number;
}

export interface LearnerSkillState {
  skillId: string;
  tier: "locked" | "novice" | "practitioner" | "master";
  evidenceScore: number;
  confidence: number;
  totalAttempts: number;
  successfulAttempts: number;
  struggleAttempts: number;
  difficultyLevel: DifficultyLevel;
  recentAccuracy: number | null;
  recentEvidenceCount: number;
  recentIncorrectCount: number;
  consecutiveOutcomeStreak: number;
  consistency: number;
  lastPracticedAt: number | null;
  daysSinceLastPractice: number | null;
  needsReview: boolean;
  isUnlocked: boolean;
  prerequisiteReadiness: number;
  readiness: number;
  struggleScore: number;
  misconceptionSignals: readonly MisconceptionSignal[];
  misconceptionTags: readonly MisconceptionTag[];
}

export interface AdaptiveRecommendationCandidate {
  skillId: string;
  category: AdaptiveRecommendationCategory;
  reasonCode: RecommendationReason;
  urgency: "high" | "medium" | "low";
  priorityScore: number;
  preferredActivityId?: string;
}

export interface AdaptiveRecommendationOptions {
  now?: number;
  limit?: number;
}

function isMasteryReady(model: LearnerModel, skillId: string): boolean {
  const graphNode = getSkillGraphNode(skillId);
  return Boolean(graphNode && graphNode.prerequisiteSkillIds.every((prerequisiteId) => {
    const tier = model.skillMastery[prerequisiteId]?.tier;
    return tier === "practitioner" || tier === "master";
  }));
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function eventValue(outcome: string, score?: number): number {
  if (outcome === "correct") return 1;
  if (outcome === "partial") return clamp((score ?? 50) / 100, 0, 1);
  return 0;
}

function getSkillEvents(model: LearnerModel, skillId: string, now: number) {
  return (model.recentEvents || [])
    .filter((event) => event.skillId === skillId && event.outcome !== "explored" && event.timestamp <= now)
    .sort((left, right) => right.timestamp - left.timestamp || right.id.localeCompare(left.id));
}

/**
 * Derives a deterministic, typed learner-skill view from canonical mastery records
 * and the existing event stream. It adds no parallel progress store.
 */
export function deriveLearnerSkillState(
  model: LearnerModel,
  skillId: string,
  now = Date.now()
): LearnerSkillState {
  const graphNode = getSkillGraphNode(skillId);
  const record = model.skillMastery[skillId];
  if (!graphNode || !record) throw new Error(`Cannot derive learner state for unknown skill ${skillId}`);

  const events = getSkillEvents(model, skillId, now);
  const recentEvents = events.slice(0, RECENT_EVIDENCE_LIMIT);
  const recentAccuracy = recentEvents.length
    ? recentEvents.reduce((total, event) => total + eventValue(event.outcome, event.score), 0) / recentEvents.length
    : null;
  const recentIncorrectCount = recentEvents.filter((event) => event.outcome === "incorrect").length;
  const latestOutcome = recentEvents[0]?.outcome;
  let consecutiveOutcomeStreak = 0;
  for (const event of recentEvents) {
    if (event.outcome !== latestOutcome) break;
    consecutiveOutcomeStreak += 1;
  }
  let matchingAdjacentOutcomes = 0;
  for (let index = 1; index < recentEvents.length; index += 1) {
    if (recentEvents[index].outcome === recentEvents[index - 1].outcome) matchingAdjacentOutcomes += 1;
  }
  const consistency = recentEvents.length < 2 ? 1 : matchingAdjacentOutcomes / (recentEvents.length - 1);

  const tagCounts = new Map<MisconceptionTag, { occurrences: number; lastObservedAt: number }>();
  events.filter((event) => event.outcome === "incorrect").slice(0, MISCONCEPTION_WINDOW).forEach((event) => {
    const allowedTags = new Set(graphNode.misconceptionTags);
    for (const tag of event.misconceptionTags ?? []) {
      if (!allowedTags.has(tag)) continue;
      const previous = tagCounts.get(tag);
      tagCounts.set(tag, {
        occurrences: (previous?.occurrences ?? 0) + 1,
        lastObservedAt: Math.max(previous?.lastObservedAt ?? 0, event.timestamp),
      });
    }
  });
  const misconceptionSignals = [...tagCounts.entries()]
    .map(([tag, value]) => ({ tag, ...value }))
    .sort((left, right) => right.occurrences - left.occurrences || right.lastObservedAt - left.lastObservedAt || left.tag.localeCompare(right.tag));

  const prerequisiteCount = graphNode.prerequisiteSkillIds.length;
  const readyPrerequisites = graphNode.prerequisiteSkillIds.filter((prerequisiteId) => {
    const tier = model.skillMastery[prerequisiteId]?.tier;
    return tier === "practitioner" || tier === "master";
  }).length;
  const prerequisiteReadiness = prerequisiteCount === 0 ? 100 : Math.round((readyPrerequisites / prerequisiteCount) * 100);
  const evidenceScore = clamp(Number(record.evidenceScore) || 0, 0, 100);
  const confidence = clamp(Number(record.confidence) || 0, 0, 100);
  const accuracyForReadiness = recentAccuracy === null ? (record.totalAttempts > 0 ? evidenceScore : 0) : recentAccuracy * 100;
  const readiness = Math.round(
    evidenceScore * 0.4 + confidence * 0.2 + accuracyForReadiness * 0.2 + prerequisiteReadiness * 0.2
  );

  const fallbackFailureRate = record.totalAttempts > 0 ? record.strugglesCount / record.totalAttempts : 0;
  const recentFailureRate = recentEvents.length ? recentIncorrectCount / recentEvents.length : fallbackFailureRate;
  const struggleScore = clamp(
    recentFailureRate * 0.65 + Number(record.needsReview) * 0.2 + Math.min(0.15, record.consecutiveStruggles * 0.05),
    0,
    1
  );
  const rawDifficulty = Math.floor(Number(record.currentDifficultyLevel) || 1);
  const difficultyLevel = clamp(rawDifficulty, graphNode.difficultyRange.min, graphNode.difficultyRange.max) as DifficultyLevel;
  const lastPracticedAt = Math.max(Number(record.lastPracticedTimestamp) || 0, events[0]?.timestamp ?? 0) || null;
  const daysSinceLastPractice = lastPracticedAt === null
    ? null
    : Math.max(0, Math.floor((now - lastPracticedAt) / DAY_MS));

  return {
    skillId,
    tier: record.tier,
    evidenceScore,
    confidence,
    totalAttempts: Math.max(0, Number(record.totalAttempts) || 0),
    successfulAttempts: Math.max(0, Number(record.successfulAttempts) || 0),
    struggleAttempts: Math.max(0, Number(record.strugglesCount) || 0),
    difficultyLevel,
    recentAccuracy,
    recentEvidenceCount: recentEvents.length,
    recentIncorrectCount,
    consecutiveOutcomeStreak,
    consistency,
    lastPracticedAt,
    daysSinceLastPractice,
    needsReview: Boolean(record.needsReview),
    isUnlocked: isMasteryReady(model, skillId),
    prerequisiteReadiness,
    readiness: clamp(readiness, 0, 100),
    struggleScore,
    misconceptionSignals,
    misconceptionTags: misconceptionSignals.map((signal) => signal.tag),
  };
}

export function getScaffoldLevel(state: LearnerSkillState): ScaffoldLevel {
  if (state.recentIncorrectCount >= 2 ||
    (state.consecutiveOutcomeStreak >= 2 && state.recentAccuracy === 0) ||
    state.misconceptionSignals.some((signal) => signal.occurrences >= 2)) return 2;
  if (state.recentIncorrectCount > 0 ||
    (state.recentAccuracy !== null && state.recentAccuracy < 0.65) ||
    (state.needsReview && state.struggleScore >= 0.3)) return 1;
  return 0;
}

function hasLaunchableActivity(skillId: string): boolean {
  return getActivitiesForSkill(skillId).some((activity) =>
    activity.skillIds.includes(skillId) &&
    !["engagement", "assessment", "homework", "picture-book"].includes(activity.experienceType) &&
    (activity.experienceType !== "toddler-world" || (activity.minimumWorldStars ?? 0) === 0)
  );
}

function addCandidate(
  candidates: Map<string, AdaptiveRecommendationCandidate>,
  candidate: AdaptiveRecommendationCandidate
): void {
  const previous = candidates.get(candidate.skillId);
  if (!previous || candidate.priorityScore > previous.priorityScore ||
    (candidate.priorityScore === previous.priorityScore && candidate.category.localeCompare(previous.category) < 0)) {
    candidates.set(candidate.skillId, candidate);
  }
}

function unmasteredAvailableFoundations(model: LearnerModel, skillId: string): Array<{ skillId: string; distance: number }> {
  const results: Array<{ skillId: string; distance: number }> = [];
  const visited = new Set<string>();
  const walk = (currentSkillId: string, distance: number) => {
    const graphNode = getSkillGraphNode(currentSkillId);
    if (!graphNode) return;
    for (const prerequisiteId of graphNode.prerequisiteSkillIds) {
      if (visited.has(prerequisiteId)) continue;
      visited.add(prerequisiteId);
      const record = model.skillMastery[prerequisiteId];
      if (!record) continue;
      if (record.tier === "practitioner" || record.tier === "master") continue;
      if (isMasteryReady(model, prerequisiteId) && hasLaunchableActivity(prerequisiteId)) {
        results.push({ skillId: prerequisiteId, distance: distance + 1 });
      } else {
        walk(prerequisiteId, distance + 1);
      }
    }
  };
  walk(skillId, 0);
  return results.sort((left, right) => left.distance - right.distance || left.skillId.localeCompare(right.skillId));
}

/** Deterministic category-aware recommendations. No LLM/provider is called here. */
export function getAdaptiveRecommendationCandidates(
  model: LearnerModel,
  options: AdaptiveRecommendationOptions = {}
): AdaptiveRecommendationCandidate[] {
  const now = options.now ?? Date.now();
  const candidates = new Map<string, AdaptiveRecommendationCandidate>();
  const states = new Map<string, LearnerSkillState>();
  const graphNodes = getSkillGraphNodes();

  for (const node of graphNodes) {
    const state = deriveLearnerSkillState(model, node.id, now);
    states.set(node.id, state);
    const record = model.skillMastery[node.id];

    if (record.totalAttempts > 0 && record.tier !== "master" &&
      (record.needsReview || record.strugglesCount > 0 || record.evidenceScore < node.practitionerThreshold)) {
      const foundations = unmasteredAvailableFoundations(model, node.id);
      foundations.forEach((foundation, index) => {
        const foundationState = states.get(foundation.skillId) ?? deriveLearnerSkillState(model, foundation.skillId, now);
        addCandidate(candidates, {
          skillId: foundation.skillId,
          category: "foundation",
          reasonCode: "needs-practice",
          urgency: "high",
          priorityScore: 112 - Math.min(12, foundationState.evidenceScore * 0.1) - foundation.distance + Math.max(0, 3 - index),
        });
      });
    }

    if (!state.isUnlocked || !hasLaunchableActivity(node.id)) continue;
    const skillEvents = getSkillEvents(model, node.id, now);
    const mostRecentIncorrect = skillEvents.find((event) => event.outcome === "incorrect");
    const hasRecordedStruggle = record.strugglesCount > 0 || state.recentIncorrectCount > 0;

    if (record.tier !== "master" && record.totalAttempts > 0 && hasRecordedStruggle &&
      (record.needsReview || state.recentAccuracy !== null && state.recentAccuracy <= 0.4 || record.consecutiveStruggles >= 2)) {
      addCandidate(candidates, {
        skillId: node.id,
        category: "recovery",
        reasonCode: "recent-mistake",
        urgency: "high",
        priorityScore: 120 + state.struggleScore * 10 + Math.min(8, state.misconceptionSignals.length * 2),
        ...(mostRecentIncorrect ? { preferredActivityId: mostRecentIncorrect.activityId } : {}),
      });
    } else if (record.tier !== "master" && record.totalAttempts > 0 &&
      (record.evidenceScore < node.masteryThreshold || record.confidence < 70) &&
      (record.needsReview || state.daysSinceLastPractice !== 0 || state.recentAccuracy === null || state.recentAccuracy < 0.8)) {
      addCandidate(candidates, {
        skillId: node.id,
        category: "practice",
        reasonCode: "needs-practice",
        urgency: state.evidenceScore < 35 ? "high" : "medium",
        priorityScore: 72 + (100 - state.evidenceScore) * 0.12 + state.struggleScore * 4,
      });
    }

    const reviewDue = record.totalAttempts > 0 && state.daysSinceLastPractice !== null &&
      state.daysSinceLastPractice >= REVIEW_AFTER_DAYS && record.tier !== "locked";
    if (reviewDue) {
      addCandidate(candidates, {
        skillId: node.id,
        category: "review",
        reasonCode: "needs-practice",
        urgency: "medium",
        priorityScore: 62 + Math.min(20, state.daysSinceLastPractice! - REVIEW_AFTER_DAYS),
      });
    }

    if (record.tier === "master") {
      const extension = node.extensionSkillIds
        .filter((extensionId) => {
          const extensionRecord = model.skillMastery[extensionId];
          return extensionRecord && extensionRecord.totalAttempts === 0 && isMasteryReady(model, extensionId) && hasLaunchableActivity(extensionId);
        })
        .sort((left, right) => left.localeCompare(right))[0];
      if (extension) {
        addCandidate(candidates, {
          skillId: extension,
          category: "challenge",
          reasonCode: "near-mastery",
          urgency: "medium",
          priorityScore: 58,
        });
      }
    }

    if (record.totalAttempts === 0 && record.tier !== "master") {
      addCandidate(candidates, {
        skillId: node.id,
        category: "next",
        reasonCode: "new-skill",
        urgency: "low",
        priorityScore: 50 + node.extensionSkillIds.length * 0.1,
      });
    }
  }

  const categoryRank: Record<AdaptiveRecommendationCategory, number> = {
    recovery: 6,
    foundation: 5,
    practice: 4,
    review: 3,
    challenge: 2,
    next: 1,
  };
  const sorted = [...candidates.values()].sort((left, right) =>
    right.priorityScore - left.priorityScore ||
    categoryRank[right.category] - categoryRank[left.category] ||
    left.skillId.localeCompare(right.skillId)
  );
  return sorted.slice(0, Math.max(0, options.limit ?? 8));
}

/** Finds a skill-compatible deterministic misconception tag from an existing math response. */
export function inferMultiplicationMisconceptionTags(
  leftFactor: number,
  rightFactor: number,
  selectedAnswer: number,
  correctAnswer: number
): MisconceptionTag[] {
  if (selectedAnswer === correctAnswer) return [];
  const tags: MisconceptionTag[] = [];
  if (selectedAnswer === leftFactor + rightFactor && correctAnswer !== leftFactor + rightFactor) {
    tags.push("multiplication-operation-confusion");
  }
  if (selectedAnswer === leftFactor || selectedAnswer === rightFactor) tags.push("factor-as-product");
  if (Math.abs(selectedAnswer - correctAnswer) === 1) tags.push("off-by-one-calculation");
  if (tags.length === 0) tags.push("multiplication-fact-recall");
  return tags;
}

export function inferLetterIdentificationMisconceptionTags(
  selectedLetter: string,
  targetLetter: string
): MisconceptionTag[] {
  return selectedLetter.localeCompare(targetLetter, "en", { sensitivity: "base" }) === 0
    ? []
    : ["letter-identification-confusion"];
}
