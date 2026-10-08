export const MISCONCEPTION_TAGS = [
  "multiplication-operation-confusion",
  "factor-as-product",
  "off-by-one-calculation",
  "multiplication-fact-recall",
  "letter-identification-confusion",
] as const;

export type MisconceptionTag = (typeof MISCONCEPTION_TAGS)[number];

export const ADAPTIVE_RECOMMENDATION_CATEGORIES = [
  "recovery",
  "foundation",
  "practice",
  "review",
  "next",
  "challenge",
] as const;

export type AdaptiveRecommendationCategory = (typeof ADAPTIVE_RECOMMENDATION_CATEGORIES)[number];
export type AdaptiveRoutePhase = "warm-up" | "focus" | "growth";
export type ScaffoldLevel = 0 | 1 | 2;
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

/** Stable interaction vocabulary for registered renderers; never names generated code. */
export type LearningInteractionType =
  | "multiple-choice"
  | "timed-response"
  | "visual-grid"
  | "tap-to-select"
  | "letter-recognition";

export function isMisconceptionTag(value: unknown): value is MisconceptionTag {
  return typeof value === "string" && MISCONCEPTION_TAGS.includes(value as MisconceptionTag);
}

export function isAdaptiveRecommendationCategory(value: unknown): value is AdaptiveRecommendationCategory {
  return typeof value === "string" && ADAPTIVE_RECOMMENDATION_CATEGORIES.includes(value as AdaptiveRecommendationCategory);
}
