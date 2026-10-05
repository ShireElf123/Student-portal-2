import type { GradeLevelBand } from "../data/curriculumUniverse";

export const GAME_BLUEPRINT_VERSION = "game-blueprint-v1" as const;
export const CURRICULUM_CONTENT_VERSION = "curriculum-universe-v1" as const;
export const GAME_CONTENT_VERSION = "game-content-v1" as const;

export type ContentDifficulty = "easy" | "medium" | "hard";
export type ContentAgeBand = "2-4" | "5-7" | "7-9" | "9-11";
export type ContentTheme = "space" | "garden" | "ocean" | "animals" | "everyday";
export type SupportedGameType = "speed-math" | "times-matrix" | "bubble-pop-phonics";
export type MasteryBand = "new" | "developing" | "secure";

export interface LearnerGenerationContext {
  /** Curriculum grade for the requested skill; no learner identity is sent to the provider. */
  gradeBand: GradeLevelBand;
  masteryBand: MasteryBand;
  currentDifficultyLevel: number;
  recentIncorrectCount: number;
  weakSkillIds: string[];
}

export interface ContentGenerationRequest {
  gameType: SupportedGameType;
  skillId: string;
  gradeBand: GradeLevelBand;
  difficulty: ContentDifficulty;
  theme: ContentTheme;
  roundCount: number;
  learnerContext: LearnerGenerationContext;
}

export interface BlueprintFeedback {
  correct: string;
  incorrect: string;
  completion: string;
}

export interface BlueprintVoice {
  introduction: string;
}

export interface GameBlueprintMetadata {
  generatedAt: number;
  validatedAt: number;
  provider: string;
  curriculumVersion: typeof CURRICULUM_CONTENT_VERSION;
  contentVersion: typeof GAME_CONTENT_VERSION;
  validationStatus: "valid";
  fingerprint: string;
  cacheKey: string;
}

export interface GameBlueprintBase {
  id: string;
  version: typeof GAME_BLUEPRINT_VERSION;
  gameType: SupportedGameType;
  skillId: string;
  ageBand: ContentAgeBand;
  gradeBand: GradeLevelBand;
  difficulty: ContentDifficulty;
  theme: ContentTheme;
  objective: string;
  instructions: string;
  feedback: BlueprintFeedback;
  hints: string[];
  voice: BlueprintVoice;
  metadata: GameBlueprintMetadata;
}

export interface SpeedMathRound {
  id: string;
  prompt: string;
  leftOperand: number;
  rightOperand: number;
  answer: number;
  choices: number[];
  explanation: string;
  hint: string;
}

export interface SpeedMathBlueprint extends GameBlueprintBase {
  gameType: "speed-math";
  content: { rounds: SpeedMathRound[] };
}

export interface TimesMatrixRound {
  id: string;
  prompt: string;
  leftFactor: number;
  rightFactor: number;
  answer: number;
  choices: number[];
  explanation: string;
  hint: string;
}

export interface TimesMatrixBlueprint extends GameBlueprintBase {
  gameType: "times-matrix";
  content: { rounds: TimesMatrixRound[] };
}

export interface BubblePopItem {
  id: string;
  letter: string;
  word: string;
}

export interface BubblePopRound {
  id: string;
  prompt: string;
  targetLetter: string;
  bubbles: BubblePopItem[];
}

export interface BubblePopBlueprint extends GameBlueprintBase {
  gameType: "bubble-pop-phonics";
  content: { rounds: BubblePopRound[] };
}

export type GameBlueprint = SpeedMathBlueprint | TimesMatrixBlueprint | BubblePopBlueprint;

export interface ArithmeticRoundDraft {
  leftOperand: number;
  rightOperand: number;
  answer: number;
  choices: number[];
  explanation: string;
  hint: string;
}

export interface TimesMatrixRoundDraft {
  leftFactor: number;
  rightFactor: number;
  answer: number;
  choices: number[];
  explanation: string;
  hint: string;
}

export interface BubblePopItemDraft {
  letter: string;
  word: string;
}

export interface BubblePopRoundDraft {
  targetLetter: string;
  bubbles: BubblePopItemDraft[];
}

interface GeneratedPayloadBase {
  objective: string;
  instructions: string;
  feedback: BlueprintFeedback;
  hints: string[];
  voice: BlueprintVoice;
}

export interface SpeedMathPayload extends GeneratedPayloadBase {
  gameType: "speed-math";
  rounds: ArithmeticRoundDraft[];
}

export interface TimesMatrixPayload extends GeneratedPayloadBase {
  gameType: "times-matrix";
  rounds: TimesMatrixRoundDraft[];
}

export interface BubblePopPayload extends GeneratedPayloadBase {
  gameType: "bubble-pop-phonics";
  rounds: BubblePopRoundDraft[];
}

export type GeneratedGamePayload = SpeedMathPayload | TimesMatrixPayload | BubblePopPayload;

export interface GenerateBlueprintCommand {
  request: ContentGenerationRequest;
  /** Fingerprints already present in this browser's validated cache, capped by the API. */
  excludedFingerprints: string[];
}

export type BlueprintValidationCode =
  | "INVALID_OBJECT"
  | "MISSING_FIELD"
  | "UNSUPPORTED_VERSION"
  | "UNSUPPORTED_GAME_TYPE"
  | "UNKNOWN_SKILL"
  | "SKILL_GAME_MISMATCH"
  | "GRADE_BAND_MISMATCH"
  | "AGE_BAND_MISMATCH"
  | "INVALID_DIFFICULTY"
  | "INVALID_CONTENT"
  | "DUPLICATE_CONTENT"
  | "UNSAFE_CONTENT"
  | "INVALID_METADATA"
  | "REQUEST_MISMATCH"
  | "PROVIDER_ERROR"
  | "INVALID_REQUEST";

export interface BlueprintValidationError {
  code: BlueprintValidationCode;
  field: string;
  message: string;
}

export type BlueprintValidationResult =
  | { valid: true; blueprint: GameBlueprint; errors: [] }
  | { valid: false; errors: BlueprintValidationError[] };

export interface ContentGenerationResult {
  blueprint: GameBlueprint;
  attempts: number;
  source: "cache" | "generated";
  cached: boolean;
}

export type ContentThemeLabel = Record<ContentTheme, string>;
