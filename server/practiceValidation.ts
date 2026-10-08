import { PracticeQuestion } from "./types";

export type PracticeDifficulty = "easy" | "medium" | "hard";

export interface CleanPracticeRequest {
  subject: string;
  topic: string;
  difficulty: PracticeDifficulty;
  count: number;
}

export type PracticeRequestValidation =
  | { ok: true; request: CleanPracticeRequest }
  | { ok: false; error: string };

export const PRACTICE_DIFFICULTIES: PracticeDifficulty[] = ["easy", "medium", "hard"];
export const PRACTICE_DEFAULT_COUNT = 5;
export const PRACTICE_MIN_COUNT = 1;
export const PRACTICE_MAX_COUNT = 10;

/**
 * Validates an inbound practice-generation request body. Only the returned
 * cleaned values may be used in the AI prompt — never the raw body.
 */
export function validatePracticeRequest(body: unknown): PracticeRequestValidation {
  const payload = body && typeof body === "object" && !Array.isArray(body)
    ? body as Record<string, unknown>
    : {};
  const subject = typeof payload.subject === "string" ? payload.subject.trim() : "";
  const topic = typeof payload.topic === "string" ? payload.topic.trim() : "";

  if (!subject) {
    return { ok: false, error: "Subject is required and cannot be empty." };
  }
  if (!topic) {
    return { ok: false, error: "Topic is required and cannot be empty." };
  }
  if (subject.length > 100 || topic.length > 200) {
    return { ok: false, error: "Subject must be at most 100 characters and topic at most 200 characters." };
  }

  const rawDifficulty =
    typeof payload.difficulty === "string" ? payload.difficulty.trim().toLowerCase() : "";
  if (!(PRACTICE_DIFFICULTIES as string[]).includes(rawDifficulty)) {
    return { ok: false, error: "Difficulty must be one of: 'easy', 'medium', 'hard'." };
  }

  let parsedCount = Number(payload.count);
  if (isNaN(parsedCount) || parsedCount <= 0) {
    parsedCount = PRACTICE_DEFAULT_COUNT;
  }
  const count = Math.max(PRACTICE_MIN_COUNT, Math.min(PRACTICE_MAX_COUNT, Math.floor(parsedCount)));

  return {
    ok: true,
    request: {
      subject,
      topic,
      difficulty: rawDifficulty as PracticeDifficulty,
      count,
    },
  };
}

export interface PracticeQuestionsValidation {
  valid: boolean;
  questions: PracticeQuestion[];
}

const MIN_QUESTION_LEN = 8;
const MAX_QUESTION_LEN = 1400;
const MIN_EXPLANATION_LEN = 8;
const MAX_EXPLANATION_LEN = 2400;
const MIN_HINT_LEN = 3;
const MAX_HINT_LEN = 800;
const MAX_OPTION_LEN = 500;
const REQUIRED_OPTIONS = 4;

/**
 * Treats model output as untrusted input: enforces the full question
 * contract (lengths, exactly 4 unique options, in-range answer index, no
 * duplicate prompts) before questions may reach learners or be scored.
 */
export function validatePracticeQuestions(
  generated: unknown,
  expectedCount: number,
  idFactory: (index: number) => string = (index) =>
    `practice-${index + 1}-${Date.now().toString(36)}`
): PracticeQuestionsValidation {
  const rawQuestions = Array.isArray(generated) ? generated : [];
  const validQuestions: PracticeQuestion[] = [];
  const seenPrompts = new Set<string>();

  for (const candidate of rawQuestions) {
    if (!candidate || typeof candidate !== "object") continue;
    const q = candidate as Record<string, unknown>;
    const question = typeof q.question === "string" ? q.question.trim() : "";
    const explanation = typeof q.explanation === "string" ? q.explanation.trim() : "";
    const hint = typeof q.hint === "string" ? q.hint.trim() : "";
    const options = Array.isArray(q.options)
      ? q.options.map((option) => (typeof option === "string" ? option.trim() : ""))
      : [];
    const answerIndex = Number(q.correctAnswerIndex);
    const promptKey = question.toLocaleLowerCase();
    const optionKeys = options.map((option) => option.toLocaleLowerCase());

    const valid =
      question.length >= MIN_QUESTION_LEN &&
      question.length <= MAX_QUESTION_LEN &&
      explanation.length >= MIN_EXPLANATION_LEN &&
      explanation.length <= MAX_EXPLANATION_LEN &&
      hint.length >= MIN_HINT_LEN &&
      hint.length <= MAX_HINT_LEN &&
      options.length === REQUIRED_OPTIONS &&
      options.every((option) => option.length > 0 && option.length <= MAX_OPTION_LEN) &&
      new Set(optionKeys).size === options.length &&
      Number.isInteger(answerIndex) &&
      answerIndex >= 0 &&
      answerIndex < options.length &&
      !seenPrompts.has(promptKey);

    if (!valid) continue;
    seenPrompts.add(promptKey);
    validQuestions.push({
      id: idFactory(validQuestions.length),
      question,
      options,
      correctAnswerIndex: answerIndex,
      explanation,
      hint,
    });
  }

  return { valid: validQuestions.length === expectedCount, questions: validQuestions };
}
