import { CURRICULUM_SKILL_NODES } from "../data/curriculumUniverse";
import { buildBlueprintCacheKey, fingerprintGameBlueprint, gameBlueprintId } from "./fingerprint";
import { getSupportedGameEngine, isSupportedGameType } from "./registry";
import { validateContentGenerationRequest, validateExcludedFingerprints, validateGameBlueprint } from "./validation";
import {
  BlueprintValidationError,
  BubblePopBlueprint,
  BubblePopPayload,
  ContentGenerationRequest,
  ContentThemeLabel,
  CURRICULUM_CONTENT_VERSION,
  GameBlueprint,
  GAME_BLUEPRINT_VERSION,
  GAME_CONTENT_VERSION,
  GeneratedGamePayload,
  SpeedMathBlueprint,
  SpeedMathPayload,
  TimesMatrixBlueprint,
  TimesMatrixPayload,
} from "./types";

export interface StructuredContentProvider {
  readonly name: string;
  generateStructuredContent(prompt: string, systemInstruction: string): Promise<unknown>;
}

export type BlueprintGenerationOutcome =
  | { valid: true; blueprint: GameBlueprint; attempts: number; errors: [] }
  | { valid: false; attempts: number; errors: BlueprintValidationError[] };

export interface BlueprintGenerationOptions {
  now?: () => number;
  excludedFingerprints?: string[];
  maxAttempts?: number;
  /** Caller timeout for a provider call; a timeout is not retried because upstream work may still be billable. */
  providerTimeoutMs?: number;
  /** Injectable delay between provider-failure retries (tests pass a no-op). */
  sleep?: (milliseconds: number) => Promise<void>;
}

export const MAX_GENERATION_ATTEMPTS = 2;
export const MAX_PROVIDER_RESPONSE_CHARS = 30_000;
export const DEFAULT_PROVIDER_TIMEOUT_MS = 20_000;
const PROVIDER_FAILURE_BACKOFF_MS = [0, 300, 900] as const;

const THEME_LABELS: ContentThemeLabel = {
  space: "friendly outer-space explorers",
  garden: "a bright garden with plants and bugs",
  ocean: "a calm ocean discovery",
  animals: "friendly animals and habitats",
  everyday: "familiar everyday objects",
};

const SYSTEM_INSTRUCTION = [
  "You are a careful, child-safe curriculum content author.",
  "Return ONLY one raw JSON object that matches the exact schema in the user prompt.",
  "Do not write code, executable instructions, markup, HTML, React, TypeScript, Firebase content, or extra fields.",
  "Use the supplied curriculum skill and game type exactly; never invent or alter IDs, standards, or game types.",
  "Write accurate, age-appropriate learning content. Avoid personal questions, private information, adult themes, frightening material, violence, stereotypes, and copyrighted characters.",
  "Never make claims about learner mastery or change learner progress. The application evaluates every response.",
].join(" ");

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function exactKeys(record: Record<string, unknown>, expected: readonly string[]): boolean {
  return Object.keys(record).length === expected.length && Object.keys(record).every((key) => expected.includes(key));
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error("provider-timeout")), timeoutMs);
    }),
  ]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

function defaultSleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function parseProviderOutput(raw: unknown): { value?: unknown; error?: BlueprintValidationError } {
  if (typeof raw !== "string") {
    try {
      if (JSON.stringify(raw).length > MAX_PROVIDER_RESPONSE_CHARS) {
        return {
          error: {
            code: "INVALID_CONTENT",
            field: "providerOutput",
            message: "Provider output exceeds the structured-content response limit.",
          },
        };
      }
    } catch {
      return {
        error: {
          code: "INVALID_CONTENT",
          field: "providerOutput",
          message: "Provider output could not be serialized as structured JSON.",
        },
      };
    }
    return { value: raw };
  }
  if (!raw.trim() || raw.length > MAX_PROVIDER_RESPONSE_CHARS) {
    return {
      error: {
        code: "INVALID_CONTENT",
        field: "providerOutput",
        message: "Provider output is empty or exceeds the structured-content response limit.",
      },
    };
  }
  try {
    return { value: JSON.parse(raw) as unknown };
  } catch {
    return {
      error: {
        code: "INVALID_CONTENT",
        field: "providerOutput",
        message: "Provider output is not valid JSON.",
      },
    };
  }
}

function validatePayloadShape(value: unknown, expectedGameType: ContentGenerationRequest["gameType"]):
  | { valid: true; payload: GeneratedGamePayload; errors: [] }
  | { valid: false; errors: BlueprintValidationError[] } {
  const errors: BlueprintValidationError[] = [];
  if (!isRecord(value)) {
    return { valid: false, errors: [{ code: "INVALID_OBJECT", field: "providerOutput", message: "Provider payload must be a JSON object." }] };
  }
  if (!isSupportedGameType(value.gameType) || value.gameType !== expectedGameType) {
    errors.push({ code: "UNSUPPORTED_GAME_TYPE", field: "gameType", message: "Provider must return the requested registered game type." });
  }
  const topKeys = ["gameType", "objective", "instructions", "feedback", "hints", "voice", "rounds"];
  if (!exactKeys(value, topKeys)) {
    errors.push({ code: "INVALID_CONTENT", field: "providerOutput", message: "Provider payload has missing or unsupported top-level fields." });
  }
  if (!isRecord(value.feedback) || !exactKeys(value.feedback, ["correct", "incorrect", "completion"])) {
    errors.push({ code: "INVALID_CONTENT", field: "feedback", message: "Provider feedback must include correct, incorrect, and completion." });
  }
  if (!isRecord(value.voice) || !exactKeys(value.voice, ["introduction"])) {
    errors.push({ code: "INVALID_CONTENT", field: "voice", message: "Provider voice payload must contain only an introduction." });
  }
  if (!Array.isArray(value.hints)) {
    errors.push({ code: "INVALID_CONTENT", field: "hints", message: "Provider hints must be an array." });
  }
  if (!Array.isArray(value.rounds)) {
    errors.push({ code: "INVALID_CONTENT", field: "rounds", message: "Provider payload rounds must be an array." });
  }

  if (Array.isArray(value.rounds) && isSupportedGameType(value.gameType) && value.gameType === expectedGameType) {
    const expectedRoundKeys = value.gameType === "speed-math"
      ? ["leftOperand", "rightOperand", "answer", "choices", "explanation", "hint"]
      : value.gameType === "times-matrix"
        ? ["leftFactor", "rightFactor", "answer", "choices", "explanation", "hint"]
        : ["targetLetter", "bubbles"];
    value.rounds.forEach((round, index) => {
      if (!isRecord(round) || !exactKeys(round, expectedRoundKeys)) {
        errors.push({ code: "INVALID_CONTENT", field: `rounds[${index}]`, message: "Provider round has missing or unsupported fields." });
        return;
      }
      if (value.gameType === "bubble-pop-phonics") {
        if (!Array.isArray(round.bubbles)) {
          errors.push({ code: "INVALID_CONTENT", field: `rounds[${index}].bubbles`, message: "Phonics round bubbles must be an array." });
          return;
        }
        round.bubbles.forEach((bubble, bubbleIndex) => {
          if (!isRecord(bubble) || !exactKeys(bubble, ["letter", "word"])) {
            errors.push({ code: "INVALID_CONTENT", field: `rounds[${index}].bubbles[${bubbleIndex}]`, message: "Provider bubble has missing or unsupported fields." });
          }
        });
      } else if (!Array.isArray(round.choices)) {
        errors.push({ code: "INVALID_CONTENT", field: `rounds[${index}].choices`, message: "Math answer choices must be an array." });
      }
    });
  }

  if (errors.length) return { valid: false, errors };
  return { valid: true, payload: value as unknown as GeneratedGamePayload, errors: [] };
}

function getAvoidContentSummary(blueprint: GameBlueprint): string[] {
  switch (blueprint.gameType) {
    case "speed-math":
      return blueprint.content.rounds.map((round) => `${round.leftOperand} × ${round.rightOperand}`);
    case "times-matrix":
      return blueprint.content.rounds.map((round) => `${round.leftFactor} × ${round.rightFactor}`);
    case "bubble-pop-phonics":
      return blueprint.content.rounds.map((round) =>
        `${round.targetLetter}: ${round.bubbles.map((bubble) => `${bubble.letter}-${bubble.word}`).join(", ")}`
      );
  }
}

export function buildContentGenerationPrompt(
  request: ContentGenerationRequest,
  avoidContent: string[] = []
): string {
  const skill = CURRICULUM_SKILL_NODES.find((candidate) => candidate.id === request.skillId);
  if (!skill) throw new Error(`Cannot build content prompt for unknown skill ${request.skillId}`);
  const engine = getSupportedGameEngine(request.gameType);
  const context = request.learnerContext;
  const avoidSection = avoidContent.length
    ? `\nDo not repeat these recently rejected or already-used question patterns:\n${avoidContent.slice(0, 20).map((item) => `- ${item}`).join("\n")}`
    : "";
  const common = `Create exactly ${request.roundCount} original rounds for the registered game type "${request.gameType}".\n` +
    `Registered activity: ${engine.activityId}; launch route: ${engine.launchRoute}; target: ${engine.launchTargetId}.\n` +
    `Curriculum skill ID (fixed by the application): ${skill.id}\n` +
    `Curriculum objective: ${skill.title}. ${skill.description}\n` +
    `Standard: ${skill.standardCode}; grade band: ${skill.gradeBand}; age band: ${engine.ageBandBySkill[skill.id]}.\n` +
    `Difficulty: ${request.difficulty}. Theme: ${THEME_LABELS[request.theme]}.\n` +
    `Learner context (anonymous learning signals only): mastery ${context.masteryBand}; adaptive difficulty ${context.currentDifficultyLevel}/5; recent incorrect responses on target skill ${context.recentIncorrectCount}; weak skill IDs ${JSON.stringify(context.weakSkillIds)}.\n` +
    "Use this context only to scaffold or extend the requested skill. Do not include learner names, IDs, personal data, or mastery judgments.\n";

  if (request.gameType === "speed-math") {
    return `${common}${avoidSection}\nReturn exactly this JSON shape, with no extra keys:\n${JSON.stringify({
      gameType: "speed-math",
      objective: "A short child-facing objective.",
      instructions: "A clear one-sentence instruction.",
      feedback: { correct: "Short encouragement.", incorrect: "Supportive retry message.", completion: "Short completion message." },
      hints: ["One short scaffolded hint."],
      voice: { introduction: "A short spoken introduction." },
      rounds: [{ leftOperand: 4, rightOperand: 6, answer: 24, choices: [24, 20, 28, 18], explanation: "Four groups of six make twenty-four.", hint: "Count six four times." }],
    }, null, 2)}\nAll rounds must use multiplication for the supplied multiplication skill. Factors must be 2-${request.difficulty === "easy" ? 5 : request.difficulty === "medium" ? 9 : 12}; compute every answer exactly; provide four unique non-negative integer choices containing the answer once. Do not repeat a fact (order of factors does not create a new fact).`;
  }

  if (request.gameType === "times-matrix") {
    return `${common}${avoidSection}\nReturn exactly this JSON shape, with no extra keys:\n${JSON.stringify({
      gameType: "times-matrix",
      objective: "A short child-facing objective.",
      instructions: "A clear one-sentence instruction.",
      feedback: { correct: "Short encouragement.", incorrect: "Supportive retry message.", completion: "Short completion message." },
      hints: ["One short scaffolded hint."],
      voice: { introduction: "A short spoken introduction." },
      rounds: [{ leftFactor: 4, rightFactor: 6, answer: 24, choices: [24, 20, 28, 18], explanation: "Four groups of six make twenty-four.", hint: "Count six four times." }],
    }, null, 2)}\nAll rounds must be multiplication facts for the supplied skill. Factors must be 2-${request.difficulty === "easy" ? 5 : request.difficulty === "medium" ? 9 : 12}; compute every answer exactly; provide four unique non-negative integer choices containing the answer once. Do not repeat a fact (order of factors does not create a new fact).`;
  }

  return `${common}${avoidSection}\nReturn exactly this JSON shape, with no extra keys:\n${JSON.stringify({
    gameType: "bubble-pop-phonics",
    objective: "A short child-facing objective.",
    instructions: "Tap the bubble that matches the target letter.",
    feedback: { correct: "Short encouragement.", incorrect: "Supportive retry message.", completion: "Short completion message." },
    hints: ["Look at the target letter again."],
    voice: { introduction: "A short spoken introduction." },
    rounds: [{ targetLetter: "B", bubbles: [{ letter: "B", word: "Bear" }, { letter: "C", word: "Cat" }, { letter: "S", word: "Sun" }] }],
  }, null, 2)}\nEach bubble letter must be A-Z and the word must begin with that letter. Use unique letters in a round and exactly one target match. Use ${request.difficulty === "easy" ? "3-4" : request.difficulty === "medium" ? "4-5" : "5-6"} bubbles per round. Use common, friendly words suitable for preschool learners.`;
}

function createBlueprintFromPayload(
  payload: GeneratedGamePayload,
  request: ContentGenerationRequest,
  providerName: string,
  timestamp: number
): GameBlueprint {
  const engine = getSupportedGameEngine(request.gameType);
  const base = {
    version: GAME_BLUEPRINT_VERSION,
    gameType: request.gameType,
    skillId: request.skillId,
    ageBand: engine.ageBandBySkill[request.skillId],
    gradeBand: request.gradeBand,
    difficulty: request.difficulty,
    theme: request.theme,
    objective: payload.objective,
    instructions: payload.instructions,
    feedback: payload.feedback,
    hints: payload.hints,
    voice: payload.voice,
  } as const;

  let content: GameBlueprint["content"];
  if (payload.gameType === "speed-math") {
    content = {
      rounds: payload.rounds.map((round, index) => ({
        ...round,
        id: `round-${index + 1}`,
        prompt: `${round.leftOperand} × ${round.rightOperand} = ?`,
      })),
    };
  } else if (payload.gameType === "times-matrix") {
    content = {
      rounds: payload.rounds.map((round, index) => ({
        ...round,
        id: `round-${index + 1}`,
        prompt: `${round.leftFactor} × ${round.rightFactor} = ?`,
      })),
    };
  } else {
    content = {
      rounds: payload.rounds.map((round, index) => ({
        id: `round-${index + 1}`,
        prompt: `Tap the letter ${round.targetLetter}.`,
        targetLetter: round.targetLetter,
        bubbles: round.bubbles.map((bubble, bubbleIndex) => ({
          id: `bubble-${bubbleIndex + 1}`,
          ...bubble,
        })),
      })),
    };
  }

  const provisional = {
    ...base,
    id: "pending-content-fingerprint",
    content,
    metadata: {
      generatedAt: timestamp,
      validatedAt: timestamp,
      provider: providerName.slice(0, 40),
      curriculumVersion: CURRICULUM_CONTENT_VERSION,
      contentVersion: GAME_CONTENT_VERSION,
      validationStatus: "valid" as const,
      fingerprint: "pending",
      cacheKey: buildBlueprintCacheKey(request),
    },
  } as unknown as GameBlueprint;
  const fingerprint = fingerprintGameBlueprint(provisional);
  const complete = {
    ...provisional,
    id: gameBlueprintId(fingerprint),
    metadata: { ...provisional.metadata, fingerprint },
  } as GameBlueprint;
  return complete;
}

function addRetryInstruction(prompt: string, errors: BlueprintValidationError[], avoidContent: string[]): string {
  const errorSummary = [...new Set(errors.map((error) => `${error.field}: ${error.message}`))].slice(0, 8).join("; ");
  const avoid = avoidContent.length ? `\nDo not repeat these prior patterns: ${avoidContent.slice(0, 20).join("; ")}.` : "";
  return `${prompt}\n\nRETRY REQUIREMENT: The prior response failed deterministic validation (${errorSummary}). Return a corrected, fully original JSON payload only.${avoid}`;
}

/** Provider-independent, bounded generation → parse → validate service. */
export async function generateValidatedGameBlueprint(
  requestInput: unknown,
  provider: StructuredContentProvider,
  options: BlueprintGenerationOptions = {}
): Promise<BlueprintGenerationOutcome> {
  const requestResult = validateContentGenerationRequest(requestInput);
  if (!requestResult.valid) {
    return { valid: false, attempts: 0, errors: requestResult.errors };
  }
  const request = requestResult.request;
  const requestedAttempts = Number.isInteger(options.maxAttempts) ? Number(options.maxAttempts) : MAX_GENERATION_ATTEMPTS;
  const maxAttempts = Math.max(1, Math.min(MAX_GENERATION_ATTEMPTS, requestedAttempts));
  const excludedResult = validateExcludedFingerprints(options.excludedFingerprints ?? []);
  if (!excludedResult.valid) {
    return { valid: false, attempts: 0, errors: excludedResult.errors };
  }
  const rejected = new Set(excludedResult.fingerprints);
  const now = options.now ?? Date.now;
  const providerTimeoutMs = Number.isFinite(options.providerTimeoutMs) && Number(options.providerTimeoutMs) > 0
    ? Number(options.providerTimeoutMs)
    : DEFAULT_PROVIDER_TIMEOUT_MS;
  const sleep = options.sleep ?? defaultSleep;
  let attemptErrors: BlueprintValidationError[] = [];
  let avoidContent: string[] = [];

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const prompt = attempt === 1
      ? buildContentGenerationPrompt(request, avoidContent)
      : addRetryInstruction(buildContentGenerationPrompt(request, avoidContent), attemptErrors, avoidContent);
    let providerOutput: unknown;
    try {
      providerOutput = await withTimeout(provider.generateStructuredContent(prompt, SYSTEM_INSTRUCTION), providerTimeoutMs);
    } catch (error) {
      const timedOut = error instanceof Error && error.message === "provider-timeout";
      attemptErrors = [{
        code: "PROVIDER_ERROR",
        field: "provider",
        message: timedOut
          ? "The content provider timed out before returning a structured response."
          : "The content provider could not complete the structured generation request.",
      }];
      if (timedOut || attempt === maxAttempts) return { valid: false, attempts: attempt, errors: attemptErrors };
      await sleep(PROVIDER_FAILURE_BACKOFF_MS[Math.min(attempt, PROVIDER_FAILURE_BACKOFF_MS.length - 1)]);
      continue;
    }

    const parsed = parseProviderOutput(providerOutput);
    if (parsed.error) {
      attemptErrors = [parsed.error];
      if (attempt === maxAttempts) return { valid: false, attempts: attempt, errors: attemptErrors };
      continue;
    }
    const payloadResult = validatePayloadShape(parsed.value, request.gameType);
    if (!payloadResult.valid) {
      attemptErrors = payloadResult.errors;
      if (attempt === maxAttempts) return { valid: false, attempts: attempt, errors: attemptErrors };
      continue;
    }
    const payload = payloadResult.payload;
    if (payload.rounds.length !== request.roundCount) {
      attemptErrors = [{
        code: "REQUEST_MISMATCH",
        field: "rounds",
        message: `Provider must return exactly ${request.roundCount} rounds.`,
      }];
      if (attempt === maxAttempts) return { valid: false, attempts: attempt, errors: attemptErrors };
      continue;
    }

    const blueprint = createBlueprintFromPayload(payload, request, provider.name, now());
    const validation = validateGameBlueprint(blueprint, { expectedRequest: request });
    if (!validation.valid) {
      attemptErrors = validation.errors;
      if (attempt === maxAttempts) return { valid: false, attempts: attempt, errors: attemptErrors };
      continue;
    }
    if (rejected.has(blueprint.metadata.fingerprint)) {
      attemptErrors = [{
        code: "DUPLICATE_CONTENT",
        field: "content.rounds",
        message: "Generated content duplicates a validated set already in the learner's content cache.",
      }];
      avoidContent = getAvoidContentSummary(blueprint);
      if (attempt === maxAttempts) return { valid: false, attempts: attempt, errors: attemptErrors };
      continue;
    }
    return { valid: true, blueprint: validation.blueprint, attempts: attempt, errors: [] };
  }

  return {
    valid: false,
    attempts: maxAttempts,
    errors: attemptErrors.length ? attemptErrors : [{
      code: "INVALID_CONTENT",
      field: "providerOutput",
      message: "No valid blueprint was produced within the configured retry limit.",
    }],
  };
}

export type { ContentGenerationRequest, GeneratedGamePayload, SpeedMathPayload, TimesMatrixPayload, BubblePopPayload };
