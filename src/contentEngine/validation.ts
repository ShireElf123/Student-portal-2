import { getActivitiesForSkill, resolveActivityDefinition } from "../data/activitySkillRegistry";
import { CURRICULUM_SKILL_NODES, GradeLevelBand } from "../data/curriculumUniverse";
import { buildContentCacheKey, fingerprintGameBlueprint, gameBlueprintId } from "./fingerprint";
import { getSupportedGameEngine, isSupportedGameType } from "./registry";
import {
  BlueprintValidationError,
  BlueprintValidationResult,
  ContentDifficulty,
  ContentGenerationRequest,
  ContentTheme,
  CURRICULUM_CONTENT_VERSION,
  GameBlueprint,
  GAME_BLUEPRINT_VERSION,
  GAME_CONTENT_VERSION,
  LearnerGenerationContext,
  MasteryBand,
} from "./types";

const SKILL_BY_ID = new Map(CURRICULUM_SKILL_NODES.map((skill) => [skill.id, skill]));
const GRADE_BANDS = new Set<GradeLevelBand>(["K-1", "2-3", "4-5"]);
const DIFFICULTIES = new Set<ContentDifficulty>(["easy", "medium", "hard"]);
const THEMES = new Set<ContentTheme>(["space", "garden", "ocean", "animals", "everyday"]);
const MASTERY_BANDS = new Set<MasteryBand>(["new", "developing", "secure"]);

/**
 * Best-effort denylist for obviously unsafe child-facing text.
 *
 * This is deliberately NOT an allowlist and is not a complete moderation system.
 * Structural constraints elsewhere in this module (exact prompt equality, the
 * `/^[A-Za-z]{2,24}$/` bubble-word rule, numeric answer recomputation) carry most
 * of the safety guarantee for the three supported engines. This filter catches
 * common English profanity/violence/PII patterns, including simple obfuscation
 * such as "k i l l" or "k1ll", but synonyms, non-English text, and novel
 * obfuscation can still pass. Treat it as defence-in-depth, not as sufficient.
 */
const UNSAFE_CHILD_CONTENT = [
  /\b(?:kill|murder|blood|weapon|gun|knife|bomb|violent|violence|fight|porn|sex|nude|drugs|cocaine|heroin|suicide|self[- ]harm|racist|slur|hate speech|fuck|shit|bitch|damn|asshole|bastard)\b/i,
  /\b(?:password|home address|phone number|credit card|secret from (?:your )?parents|meet (?:me|someone) alone)\b/i,
  /<\s*\/?\s*[a-z][^>]*>|\b(?:https?:\/\/|www\.)/i,
  /\b(?:eval|javascript|firebase|typescript|react component|executable code)\b/i,
];

/** Terms that receive the obfuscation-resistant check below (profanity, violence, self-harm, insults). */
const OBFUSCATABLE_UNSAFE_TERMS = [
  "kill", "murder", "blood", "weapon", "knife", "bomb", "violent", "violence",
  "porn", "nude", "cocaine", "heroin", "suicide", "selfharm", "racist",
  "fuck", "shit", "bitch", "damn", "bastard", "stupid", "idiot", "moron",
];

/** Per-letter classes covering common leetspeak substitutions. */
const LEET_LETTER_CLASSES: Record<string, string> = {
  a: "[a@4]", b: "[b8]", c: "[c(<]", d: "[d]", e: "[e3]", f: "[f]", g: "[g96]", h: "[h]",
  i: "[i1!|]", j: "[j]", k: "[k]", l: "[l1|]", m: "[m]", n: "[n]", o: "[o0]", p: "[p]",
  q: "[q9]", r: "[r]", s: "[s5$]", t: "[t7+]", u: "[uv0]", v: "[v]", w: "[w]", x: "[x]",
  y: "[y]", z: "[z2]",
};

function buildObfuscatedUnsafePatterns(): RegExp[] {
  const separator = "[\\s._*@#+-]{0,2}";
  return OBFUSCATABLE_UNSAFE_TERMS.map((term) => {
    const letters = [...term].map((letter, index) => {
      const base = LEET_LETTER_CLASSES[letter] ?? letter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return index === 0 ? base : `${separator}${base}`;
    }).join("");
    return new RegExp(`\\b${letters}(?:s|es|ed|ing)?\\b`, "i");
  });
}

const OBFUSCATED_UNSAFE_PATTERNS = buildObfuscatedUnsafePatterns();

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value: unknown, maxLength = 240): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= maxLength;
}

function isSafeText(value: string): boolean {
  if (UNSAFE_CHILD_CONTENT.some((pattern) => pattern.test(value))) return false;
  const normalized = value.normalize("NFKC").toLocaleLowerCase("en-US");
  return !OBFUSCATED_UNSAFE_PATTERNS.some((pattern) => pattern.test(normalized));
}

function addError(
  errors: BlueprintValidationError[],
  code: BlueprintValidationError["code"],
  field: string,
  message: string
): void {
  errors.push({ code, field, message });
}

function difficultyFactorMax(difficulty: ContentDifficulty): number {
  return difficulty === "easy" ? 5 : difficulty === "medium" ? 9 : 12;
}

function exactKeys(record: Record<string, unknown>, expected: readonly string[]): boolean {
  const keys = Object.keys(record);
  return keys.length === expected.length && keys.every((key) => expected.includes(key));
}

export function validateContentGenerationRequest(input: unknown):
  | { valid: true; request: ContentGenerationRequest; errors: [] }
  | { valid: false; errors: BlueprintValidationError[] } {
  const errors: BlueprintValidationError[] = [];
  if (!isRecord(input)) {
    return { valid: false, errors: [{ code: "INVALID_REQUEST", field: "request", message: "Generation request must be an object." }] };
  }

  if (!isSupportedGameType(input.gameType)) {
    addError(errors, "UNSUPPORTED_GAME_TYPE", "gameType", "Select one of the registered content-compatible game engines.");
  }
  if (typeof input.skillId !== "string" || !SKILL_BY_ID.has(input.skillId)) {
    addError(errors, "UNKNOWN_SKILL", "skillId", "The requested curriculum skill does not exist.");
  }
  if (!GRADE_BANDS.has(input.gradeBand as GradeLevelBand)) {
    addError(errors, "INVALID_REQUEST", "gradeBand", "Grade band must be K-1, 2-3, or 4-5.");
  }
  if (!DIFFICULTIES.has(input.difficulty as ContentDifficulty)) {
    addError(errors, "INVALID_DIFFICULTY", "difficulty", "Difficulty must be easy, medium, or hard.");
  }
  if (!THEMES.has(input.theme as ContentTheme)) {
    addError(errors, "INVALID_REQUEST", "theme", "Choose one of the child-safe supported themes.");
  }
  if (!Number.isInteger(input.roundCount) || Number(input.roundCount) < 3 || Number(input.roundCount) > 5) {
    addError(errors, "INVALID_REQUEST", "roundCount", "Each request must contain between 3 and 5 rounds.");
  }

  const rawContext = input.learnerContext;
  let learnerContext: LearnerGenerationContext | undefined;
  if (!isRecord(rawContext)) {
    addError(errors, "INVALID_REQUEST", "learnerContext", "Learner context must contain only validated learning signals.");
  } else {
    const weakSkillIds = rawContext.weakSkillIds;
    const validWeakSkillIds = Array.isArray(weakSkillIds) && weakSkillIds.length <= 5 && weakSkillIds.every(
      (skillId) => typeof skillId === "string" && SKILL_BY_ID.has(skillId)
    );
    if (!validWeakSkillIds) {
      addError(errors, "INVALID_REQUEST", "learnerContext.weakSkillIds", "Weak-skill context must use at most five canonical curriculum IDs.");
    }
    if (!GRADE_BANDS.has(rawContext.gradeBand as GradeLevelBand)) {
      addError(errors, "INVALID_REQUEST", "learnerContext.gradeBand", "Learner grade band is not supported.");
    }
    if (!MASTERY_BANDS.has(rawContext.masteryBand as MasteryBand)) {
      addError(errors, "INVALID_REQUEST", "learnerContext.masteryBand", "Mastery context is not recognized.");
    }
    if (!Number.isInteger(rawContext.currentDifficultyLevel) || Number(rawContext.currentDifficultyLevel) < 1 || Number(rawContext.currentDifficultyLevel) > 5) {
      addError(errors, "INVALID_REQUEST", "learnerContext.currentDifficultyLevel", "Adaptive difficulty level must be an integer from 1 to 5.");
    }
    if (!Number.isInteger(rawContext.recentIncorrectCount) || Number(rawContext.recentIncorrectCount) < 0 || Number(rawContext.recentIncorrectCount) > 10) {
      addError(errors, "INVALID_REQUEST", "learnerContext.recentIncorrectCount", "Recent incorrect-response count must be between 0 and 10.");
    }
    if (validWeakSkillIds && GRADE_BANDS.has(rawContext.gradeBand as GradeLevelBand) &&
      MASTERY_BANDS.has(rawContext.masteryBand as MasteryBand) &&
      Number.isInteger(rawContext.currentDifficultyLevel) && Number.isInteger(rawContext.recentIncorrectCount)) {
      learnerContext = {
        gradeBand: rawContext.gradeBand as GradeLevelBand,
        masteryBand: rawContext.masteryBand as MasteryBand,
        currentDifficultyLevel: Number(rawContext.currentDifficultyLevel),
        recentIncorrectCount: Number(rawContext.recentIncorrectCount),
        weakSkillIds: [...new Set(weakSkillIds as string[])],
      };
    }
  }

  if (isSupportedGameType(input.gameType) && typeof input.skillId === "string" && SKILL_BY_ID.has(input.skillId)) {
    const engine = getSupportedGameEngine(input.gameType);
    const skill = SKILL_BY_ID.get(input.skillId)!;
    if (!engine.skillIds.includes(input.skillId)) {
      addError(errors, "SKILL_GAME_MISMATCH", "skillId", `${input.gameType} is not registered to generate content for ${input.skillId}.`);
    }
    if (input.gradeBand !== skill.gradeBand) {
      addError(errors, "GRADE_BAND_MISMATCH", "gradeBand", `Skill ${skill.id} belongs to grade band ${skill.gradeBand}.`);
    }
    if (isRecord(rawContext) && rawContext.gradeBand !== skill.gradeBand) {
      addError(errors, "GRADE_BAND_MISMATCH", "learnerContext.gradeBand", `The learner context must use the target skill's ${skill.gradeBand} grade band.`);
    }
    if (!getActivitiesForSkill(input.skillId).some((activity) => activity.id === engine.activityId)) {
      addError(errors, "SKILL_GAME_MISMATCH", "gameType", `The registered activity ${engine.activityId} is not linked to ${input.skillId}.`);
    }
  }

  if (errors.length || !learnerContext || !isSupportedGameType(input.gameType)) {
    return { valid: false, errors };
  }
  return {
    valid: true,
    request: {
      gameType: input.gameType,
      skillId: input.skillId as string,
      gradeBand: input.gradeBand as GradeLevelBand,
      difficulty: input.difficulty as ContentDifficulty,
      theme: input.theme as ContentTheme,
      roundCount: Number(input.roundCount),
      learnerContext,
    },
    errors: [],
  };
}

export function validateExcludedFingerprints(input: unknown):
  | { valid: true; fingerprints: string[]; errors: [] }
  | { valid: false; errors: BlueprintValidationError[] } {
  if (!Array.isArray(input) || input.length > 30 || input.some((value) =>
    typeof value !== "string" || !/^fnv1a64-[0-9a-f]{16}$/.test(value)
  )) {
    return {
      valid: false,
      errors: [{ code: "INVALID_REQUEST", field: "excludedFingerprints", message: "Excluded content fingerprints must be valid and capped at 30." }],
    };
  }
  return { valid: true, fingerprints: [...new Set(input as string[])], errors: [] };
}

function validateTextFields(blueprint: Record<string, unknown>, errors: BlueprintValidationError[]): void {
  const stringFields = ["objective", "instructions"] as const;
  for (const field of stringFields) {
    if (!isNonEmptyString(blueprint[field])) {
      addError(errors, "MISSING_FIELD", field, `${field} must be a non-empty string no longer than 240 characters.`);
    } else if (!isSafeText(blueprint[field] as string)) {
      addError(errors, "UNSAFE_CONTENT", field, `${field} contains content that is not suitable for children.`);
    }
  }

  const feedback = blueprint.feedback;
  const feedbackKeys = ["correct", "incorrect", "completion"] as const;
  if (!isRecord(feedback) || !exactKeys(feedback, feedbackKeys)) {
    addError(errors, "MISSING_FIELD", "feedback", "Feedback must include exactly correct, incorrect, and completion messages.");
  } else {
    for (const field of feedbackKeys) {
      if (!isNonEmptyString(feedback[field], 160)) {
        addError(errors, "MISSING_FIELD", `feedback.${field}`, "Feedback text is required and limited to 160 characters.");
      } else if (!isSafeText(feedback[field] as string)) {
        addError(errors, "UNSAFE_CONTENT", `feedback.${field}`, "Feedback contains content that is not suitable for children.");
      }
    }
  }

  if (!Array.isArray(blueprint.hints) || blueprint.hints.length < 1 || blueprint.hints.length > 4) {
    addError(errors, "INVALID_CONTENT", "hints", "Provide between 1 and 4 short hints.");
  } else {
    blueprint.hints.forEach((hint, index) => {
      if (!isNonEmptyString(hint, 160)) {
        addError(errors, "MISSING_FIELD", `hints[${index}]`, "Hint text is required and limited to 160 characters.");
      } else if (!isSafeText(hint)) {
        addError(errors, "UNSAFE_CONTENT", `hints[${index}]`, "Hint contains content that is not suitable for children.");
      }
    });
  }

  const voice = blueprint.voice;
  if (!isRecord(voice) || !exactKeys(voice, ["introduction"]) || !isNonEmptyString(voice.introduction, 180)) {
    addError(errors, "MISSING_FIELD", "voice.introduction", "A short voice introduction is required.");
  } else if (!isSafeText(voice.introduction as string)) {
    addError(errors, "UNSAFE_CONTENT", "voice.introduction", "Voice text contains content that is not suitable for children.");
  }
}

function validateChoices(
  choices: unknown,
  answer: number,
  maximumAnswer: number,
  field: string,
  errors: BlueprintValidationError[]
): void {
  if (!Array.isArray(choices) || choices.length !== 4 || choices.some((choice) =>
    !Number.isInteger(choice) || Number(choice) < 0 || Number(choice) > maximumAnswer + 36
  )) {
    addError(errors, "INVALID_CONTENT", field, "Each math round needs four non-negative, plausible integer answer choices.");
    return;
  }
  if (new Set(choices).size !== choices.length) {
    addError(errors, "INVALID_CONTENT", field, "Answer choices must be unique.");
  }
  if (choices.filter((choice) => choice === answer).length !== 1) {
    addError(errors, "INVALID_CONTENT", field, "The correct answer must appear exactly once in the choices.");
  }
}

function validateRoundText(round: Record<string, unknown>, field: string, errors: BlueprintValidationError[]): void {
  for (const textField of ["explanation", "hint"] as const) {
    const value = round[textField];
    if (!isNonEmptyString(value, 220)) {
      addError(errors, "MISSING_FIELD", `${field}.${textField}`, `${textField} must be a non-empty string no longer than 220 characters.`);
    } else if (!isSafeText(value)) {
      addError(errors, "UNSAFE_CONTENT", `${field}.${textField}`, `${textField} contains content that is not suitable for children.`);
    }
  }
}

function validateMathRounds(
  rounds: unknown,
  blueprint: Record<string, unknown>,
  gameType: "speed-math" | "times-matrix",
  errors: BlueprintValidationError[]
): void {
  if (!Array.isArray(rounds) || rounds.length < 3 || rounds.length > 5) {
    addError(errors, "INVALID_CONTENT", "content.rounds", "Math content must include between 3 and 5 rounds.");
    return;
  }
  if (typeof blueprint.difficulty !== "string" || !DIFFICULTIES.has(blueprint.difficulty as ContentDifficulty)) return;
  const maxFactor = difficultyFactorMax(blueprint.difficulty as ContentDifficulty);
  const roundKeys = new Set<string>();

  rounds.forEach((candidate, index) => {
    const field = `content.rounds[${index}]`;
    if (!isRecord(candidate)) {
      addError(errors, "INVALID_CONTENT", field, "A round must be an object.");
      return;
    }
    const expectedKeys = gameType === "speed-math"
      ? ["id", "prompt", "leftOperand", "rightOperand", "answer", "choices", "explanation", "hint"]
      : ["id", "prompt", "leftFactor", "rightFactor", "answer", "choices", "explanation", "hint"];
    if (!exactKeys(candidate, expectedKeys)) {
      addError(errors, "INVALID_CONTENT", field, "Round has missing or unsupported fields.");
    }
    if (!isNonEmptyString(candidate.id, 80)) addError(errors, "MISSING_FIELD", `${field}.id`, "Round ID is required.");
    const leftKey = gameType === "speed-math" ? "leftOperand" : "leftFactor";
    const rightKey = gameType === "speed-math" ? "rightOperand" : "rightFactor";
    const left = candidate[leftKey];
    const right = candidate[rightKey];
    const answer = candidate.answer;
    if (!Number.isInteger(left) || !Number.isInteger(right) || Number(left) < 2 || Number(right) < 2 ||
      Number(left) > maxFactor || Number(right) > maxFactor) {
      addError(errors, "INVALID_CONTENT", field, `${blueprint.difficulty} difficulty requires integer factors from 2 to ${maxFactor}.`);
      return;
    }
    const correctAnswer = Number(left) * Number(right);
    if (!Number.isInteger(answer) || answer !== correctAnswer) {
      addError(errors, "INVALID_CONTENT", `${field}.answer`, "The answer must equal the product of the displayed factors.");
    }
    const canonicalPair = [Number(left), Number(right)].sort((a, b) => a - b).join("x");
    if (roundKeys.has(canonicalPair)) addError(errors, "DUPLICATE_CONTENT", field, "A blueprint cannot repeat the same multiplication fact.");
    roundKeys.add(canonicalPair);

    const expectedPrompt = `${left} × ${right} = ?`;
    if (candidate.prompt !== expectedPrompt) {
      addError(errors, "INVALID_CONTENT", `${field}.prompt`, "Math prompt must match its validated operands.");
    }
    validateChoices(candidate.choices, correctAnswer, maxFactor * maxFactor, `${field}.choices`, errors);
    validateRoundText(candidate, field, errors);
  });
}

function validateBubbleRounds(rounds: unknown, blueprint: Record<string, unknown>, errors: BlueprintValidationError[]): void {
  if (!Array.isArray(rounds) || rounds.length < 3 || rounds.length > 5) {
    addError(errors, "INVALID_CONTENT", "content.rounds", "Phonics content must include between 3 and 5 rounds.");
    return;
  }
  const minBubbles = blueprint.difficulty === "easy" ? 3 : blueprint.difficulty === "medium" ? 4 : 5;
  const maxBubbles = blueprint.difficulty === "easy" ? 4 : blueprint.difficulty === "medium" ? 5 : 6;
  const roundKeys = new Set<string>();

  rounds.forEach((candidate, index) => {
    const field = `content.rounds[${index}]`;
    if (!isRecord(candidate)) {
      addError(errors, "INVALID_CONTENT", field, "A phonics round must be an object.");
      return;
    }
    if (!exactKeys(candidate, ["id", "prompt", "targetLetter", "bubbles"])) {
      addError(errors, "INVALID_CONTENT", field, "Phonics round has missing or unsupported fields.");
    }
    if (!isNonEmptyString(candidate.id, 80)) addError(errors, "MISSING_FIELD", `${field}.id`, "Round ID is required.");
    const targetLetter = candidate.targetLetter;
    if (typeof targetLetter !== "string" || !/^[A-Z]$/.test(targetLetter)) {
      addError(errors, "INVALID_CONTENT", `${field}.targetLetter`, "Target must be one uppercase A-Z letter.");
    }
    if (candidate.prompt !== `Tap the letter ${String(targetLetter)}.`) {
      addError(errors, "INVALID_CONTENT", `${field}.prompt`, "Phonics prompt must match its validated target letter.");
    }
    if (!Array.isArray(candidate.bubbles) || candidate.bubbles.length < minBubbles || candidate.bubbles.length > maxBubbles) {
      addError(errors, "INVALID_CONTENT", `${field}.bubbles`, `${blueprint.difficulty} difficulty requires ${minBubbles}-${maxBubbles} bubbles per round.`);
      return;
    }
    const letters = new Set<string>();
    let targetCount = 0;
    const pairs: string[] = [];
    candidate.bubbles.forEach((bubble, bubbleIndex) => {
      const bubbleField = `${field}.bubbles[${bubbleIndex}]`;
      if (!isRecord(bubble) || !exactKeys(bubble, ["id", "letter", "word"])) {
        addError(errors, "INVALID_CONTENT", bubbleField, "Bubble must contain only an ID, letter, and word.");
        return;
      }
      if (!isNonEmptyString(bubble.id, 80)) addError(errors, "MISSING_FIELD", `${bubbleField}.id`, "Bubble ID is required.");
      if (typeof bubble.letter !== "string" || !/^[A-Z]$/.test(bubble.letter)) {
        addError(errors, "INVALID_CONTENT", `${bubbleField}.letter`, "Bubble letter must be one uppercase A-Z letter.");
        return;
      }
      if (letters.has(bubble.letter)) addError(errors, "INVALID_CONTENT", `${bubbleField}.letter`, "Bubble letters must be unique within a round.");
      letters.add(bubble.letter);
      if (bubble.letter === targetLetter) targetCount += 1;
      if (typeof bubble.word !== "string" || !/^[A-Za-z]{2,24}$/.test(bubble.word)) {
        addError(errors, "INVALID_CONTENT", `${bubbleField}.word`, "Bubble word must be a simple 2-24 letter child-friendly word.");
        return;
      }
      if (bubble.word[0].toUpperCase() !== bubble.letter) {
        addError(errors, "INVALID_CONTENT", `${bubbleField}.word`, "Bubble word must begin with its displayed letter.");
      }
      if (!isSafeText(bubble.word)) addError(errors, "UNSAFE_CONTENT", `${bubbleField}.word`, "Bubble word is not suitable for children.");
      pairs.push(`${bubble.letter}:${bubble.word.trim().toLowerCase()}`);
    });
    if (targetCount !== 1) addError(errors, "INVALID_CONTENT", `${field}.targetLetter`, "Exactly one bubble must match the target letter.");
    const roundKey = `${String(targetLetter)}:${pairs.sort().join("|")}`;
    if (roundKeys.has(roundKey)) addError(errors, "DUPLICATE_CONTENT", field, "A blueprint cannot repeat an identical phonics round.");
    roundKeys.add(roundKey);
  });
}

function validateBlueprintMetadata(blueprint: Record<string, unknown>, errors: BlueprintValidationError[]): void {
  const metadata = blueprint.metadata;
  if (!isRecord(metadata) || !exactKeys(metadata, [
    "generatedAt", "validatedAt", "provider", "curriculumVersion", "contentVersion", "validationStatus", "fingerprint", "cacheKey",
  ])) {
    addError(errors, "INVALID_METADATA", "metadata", "Blueprint metadata is missing required fields or contains unsupported fields.");
    return;
  }
  if (!Number.isFinite(metadata.generatedAt) || Number(metadata.generatedAt) <= 0 ||
    !Number.isFinite(metadata.validatedAt) || Number(metadata.validatedAt) <= 0) {
    addError(errors, "INVALID_METADATA", "metadata.generatedAt", "Generation and validation timestamps must be positive numbers.");
  }
  if (!isNonEmptyString(metadata.provider, 40)) addError(errors, "INVALID_METADATA", "metadata.provider", "Provider name is required.");
  if (metadata.curriculumVersion !== CURRICULUM_CONTENT_VERSION || metadata.contentVersion !== GAME_CONTENT_VERSION ||
    metadata.validationStatus !== "valid") {
    addError(errors, "INVALID_METADATA", "metadata", "Blueprint content, curriculum, or validation version is unsupported.");
  }
  if (typeof metadata.fingerprint !== "string" || !/^fnv1a64-[0-9a-f]{16}$/.test(metadata.fingerprint)) {
    addError(errors, "INVALID_METADATA", "metadata.fingerprint", "Blueprint fingerprint is malformed.");
  }
  if (typeof metadata.cacheKey !== "string" || !/^content-cache-v1:fnv1a64-[0-9a-f]{16}$/.test(metadata.cacheKey)) {
    addError(errors, "INVALID_METADATA", "metadata.cacheKey", "Blueprint cache key is malformed.");
  }
}

export function validateGameBlueprint(
  input: unknown,
  options: { expectedRequest?: ContentGenerationRequest } = {}
): BlueprintValidationResult {
  const errors: BlueprintValidationError[] = [];
  if (!isRecord(input)) {
    return { valid: false, errors: [{ code: "INVALID_OBJECT", field: "blueprint", message: "Game blueprint must be an object." }] };
  }
  const blueprint = input;
  if (!exactKeys(blueprint, [
    "id", "version", "gameType", "skillId", "ageBand", "gradeBand", "difficulty", "theme",
    "objective", "instructions", "feedback", "hints", "voice", "metadata", "content",
  ])) {
    addError(errors, "INVALID_CONTENT", "blueprint", "Blueprint contains missing or unsupported top-level fields.");
  }

  if (!isNonEmptyString(blueprint.id, 120)) addError(errors, "MISSING_FIELD", "id", "Blueprint ID is required.");
  if (blueprint.version !== GAME_BLUEPRINT_VERSION) addError(errors, "UNSUPPORTED_VERSION", "version", `Blueprint version must be ${GAME_BLUEPRINT_VERSION}.`);
  if (!isSupportedGameType(blueprint.gameType)) {
    addError(errors, "UNSUPPORTED_GAME_TYPE", "gameType", "Blueprint game type is not supported by a registered renderer.");
  }
  if (typeof blueprint.skillId !== "string" || !SKILL_BY_ID.has(blueprint.skillId)) {
    addError(errors, "UNKNOWN_SKILL", "skillId", "Blueprint skill ID does not exist in the Curriculum Universe.");
  }
  if (!DIFFICULTIES.has(blueprint.difficulty as ContentDifficulty)) {
    addError(errors, "INVALID_DIFFICULTY", "difficulty", "Blueprint difficulty must be easy, medium, or hard.");
  }
  if (!THEMES.has(blueprint.theme as ContentTheme)) addError(errors, "INVALID_CONTENT", "theme", "Blueprint theme is not in the supported child-safe theme list.");
  if (!GRADE_BANDS.has(blueprint.gradeBand as GradeLevelBand)) addError(errors, "INVALID_CONTENT", "gradeBand", "Blueprint grade band is unsupported.");
  if (typeof blueprint.ageBand !== "string" || !["2-4", "5-7", "7-9", "9-11"].includes(blueprint.ageBand)) {
    addError(errors, "INVALID_CONTENT", "ageBand", "Blueprint age band is unsupported.");
  }
  validateTextFields(blueprint, errors);
  validateBlueprintMetadata(blueprint, errors);

  if (isSupportedGameType(blueprint.gameType) && typeof blueprint.skillId === "string" && SKILL_BY_ID.has(blueprint.skillId)) {
    const engine = getSupportedGameEngine(blueprint.gameType);
    const skill = SKILL_BY_ID.get(blueprint.skillId)!;
    if (!engine.skillIds.includes(skill.id)) {
      addError(errors, "SKILL_GAME_MISMATCH", "skillId", `${blueprint.gameType} cannot render content for ${skill.id}.`);
    }
    if (blueprint.gradeBand !== skill.gradeBand) {
      addError(errors, "GRADE_BAND_MISMATCH", "gradeBand", `Skill ${skill.id} belongs to grade band ${skill.gradeBand}.`);
    }
    if (blueprint.ageBand !== engine.ageBandBySkill[skill.id]) {
      addError(errors, "AGE_BAND_MISMATCH", "ageBand", `${blueprint.gameType} uses age band ${engine.ageBandBySkill[skill.id] ?? "unsupported"} for ${skill.id}.`);
    }
    const activity = resolveActivityDefinition(engine.activityId);
    if (activity.experienceId !== engine.experienceId ||
      !activity.skillIds.includes(skill.id) ||
      !getActivitiesForSkill(skill.id).some((candidate) => candidate.id === activity.id)) {
      addError(errors, "SKILL_GAME_MISMATCH", "gameType", `Registered activity ${engine.activityId} is not valid for ${skill.id}.`);
    }
    if (activity.launch.route !== engine.launchRoute || activity.launch.targetId !== engine.launchTargetId) {
      addError(errors, "INVALID_CONTENT", "gameType", `${blueprint.gameType} launch target is not registered.`);
    }

    const content = blueprint.content;
    if (!isRecord(content) || !exactKeys(content, ["rounds"])) {
      addError(errors, "INVALID_CONTENT", "content", "Blueprint content must contain only its supported rounds.");
    } else if (blueprint.gameType === "speed-math" || blueprint.gameType === "times-matrix") {
      validateMathRounds(content.rounds, blueprint, blueprint.gameType, errors);
    } else {
      validateBubbleRounds(content.rounds, blueprint, errors);
    }
  }

  if (options.expectedRequest) {
    const request = options.expectedRequest;
    for (const field of ["gameType", "skillId", "gradeBand", "difficulty", "theme"] as const) {
      if (blueprint[field] !== request[field]) {
        addError(errors, "REQUEST_MISMATCH", field, `Blueprint ${field} must match the generation request.`);
      }
    }
    const rounds = isRecord(blueprint.content) && Array.isArray(blueprint.content.rounds) ? blueprint.content.rounds : [];
    if (rounds.length !== request.roundCount) {
      addError(errors, "REQUEST_MISMATCH", "content.rounds", `Blueprint must contain exactly ${request.roundCount} rounds.`);
    }
  }

  if (errors.length === 0 && isSupportedGameType(blueprint.gameType)) {
    const typedBlueprint = blueprint as unknown as GameBlueprint;
    const fingerprint = fingerprintGameBlueprint(typedBlueprint);
    if (typedBlueprint.metadata.fingerprint !== fingerprint) {
      addError(errors, "INVALID_METADATA", "metadata.fingerprint", "Blueprint fingerprint does not match normalized content.");
    }
    if (typedBlueprint.id !== gameBlueprintId(fingerprint)) {
      addError(errors, "INVALID_METADATA", "id", "Blueprint ID must be derived from its normalized content fingerprint.");
    }
    if (options.expectedRequest &&
      typedBlueprint.metadata.cacheKey !== buildContentCacheKey(options.expectedRequest)) {
      addError(errors, "INVALID_METADATA", "metadata.cacheKey", "Blueprint cache key does not match the normalized generation request.");
    }
  }

  return errors.length
    ? { valid: false, errors }
    : { valid: true, blueprint: blueprint as unknown as GameBlueprint, errors: [] };
}
