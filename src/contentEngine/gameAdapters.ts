import { recordLearningEvent } from "../utils/learnerBrain";
import {
  inferLetterIdentificationMisconceptionTags,
  inferMultiplicationMisconceptionTags,
} from "../utils/adaptiveLearning";
import { getSupportedGameEngine } from "./registry";
import type {
  BubblePopBlueprint,
  GameBlueprint,
  SpeedMathBlueprint,
  StorybookComprehensionBlueprint,
  StorybookQuestionType,
  TimesMatrixBlueprint,
} from "./types";

export function createGameResponseSessionId(): string {
  const sessionId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  return `session-${sessionId}`;
}

function responseEventId(blueprint: GameBlueprint, roundId: string, responseId?: string): string | undefined {
  const normalizedResponseId = responseId?.trim();
  if (!normalizedResponseId) return undefined;
  if (normalizedResponseId.length > 100) throw new Error("Generated-game response IDs must be at most 100 characters.");
  return `game-response-v1:${blueprint.metadata.fingerprint}:${encodeURIComponent(roundId)}:${encodeURIComponent(normalizedResponseId)}`;
}

export interface RenderableMathQuestion {
  id: string;
  prompt: string;
  answer: number;
  choices: number[];
  explanation: string;
  hint: string;
}

export function adaptSpeedMathRound(blueprint: SpeedMathBlueprint, roundIndex: number): RenderableMathQuestion | null {
  const round = blueprint.content.rounds[roundIndex];
  if (!round) return null;
  return {
    id: round.id,
    prompt: round.prompt,
    answer: round.answer,
    choices: [...round.choices],
    explanation: round.explanation,
    hint: round.hint,
  };
}

export function adaptTimesMatrixRound(blueprint: TimesMatrixBlueprint, roundIndex: number): RenderableMathQuestion | null {
  const round = blueprint.content.rounds[roundIndex];
  if (!round) return null;
  return {
    id: round.id,
    prompt: round.prompt,
    answer: round.answer,
    choices: [...round.choices],
    explanation: round.explanation,
    hint: round.hint,
  };
}

export function recordSpeedMathBlueprintResponse(
  blueprint: SpeedMathBlueprint,
  roundIndex: number,
  selectedAnswer: number,
  learnerId: string,
  hintsUsed = 0,
  responseId?: string
) {
  const round = blueprint.content.rounds[roundIndex];
  if (!round) throw new Error(`Speed Math blueprint has no round ${roundIndex}`);
  const engine = getSupportedGameEngine("speed-math");
  const eventId = responseEventId(blueprint, round.id, responseId);
  const correct = selectedAnswer === round.answer;
  try {
    return recordLearningEvent({
      ...(eventId ? { id: eventId } : {}),
      learnerId,
      activityId: engine.activityId,
      experienceId: engine.experienceId,
      contentId: `${blueprint.id}:${round.id}`,
      eventType: "question_answered",
      activityType: "math-blitz",
      activityTitle: `Generated Speed Math: ${round.prompt}`,
      skillId: blueprint.skillId,
      domain: "math",
      gradeBand: blueprint.gradeBand,
      result: correct ? "success" : "struggle",
      score: correct ? 100 : 0,
      difficulty: blueprint.difficulty,
      attempts: 1,
      hintsUsed,
      ...(!correct ? { misconceptionTags: inferMultiplicationMisconceptionTags(round.leftOperand, round.rightOperand, selectedAnswer, round.answer) } : {}),
      metadata: {
        blueprintId: blueprint.id,
        roundId: round.id,
        leftOperand: round.leftOperand,
        rightOperand: round.rightOperand,
        selectedAnswer,
        correctAnswer: round.answer,
      },
    });
  } catch (error) {
    console.error("Failed to record generated Speed Math evidence:", error);
    return undefined;
  }
}

export function recordTimesMatrixBlueprintResponse(
  blueprint: TimesMatrixBlueprint,
  roundIndex: number,
  selectedAnswer: number,
  learnerId: string,
  hintsUsed = 0,
  responseId?: string
) {
  const round = blueprint.content.rounds[roundIndex];
  if (!round) throw new Error(`Times Matrix blueprint has no round ${roundIndex}`);
  const engine = getSupportedGameEngine("times-matrix");
  const eventId = responseEventId(blueprint, round.id, responseId);
  const correct = selectedAnswer === round.answer;
  try {
    return recordLearningEvent({
      ...(eventId ? { id: eventId } : {}),
      learnerId,
      activityId: engine.activityId,
      experienceId: engine.experienceId,
      contentId: `${blueprint.id}:${round.id}`,
      eventType: "question_answered",
      activityType: "times-matrix",
      activityTitle: `Generated Times Matrix: ${round.prompt}`,
      skillId: blueprint.skillId,
      domain: "math",
      gradeBand: blueprint.gradeBand,
      result: correct ? "success" : "struggle",
      score: correct ? 100 : 0,
      difficulty: blueprint.difficulty,
      attempts: 1,
      hintsUsed,
      ...(!correct ? { misconceptionTags: inferMultiplicationMisconceptionTags(round.leftFactor, round.rightFactor, selectedAnswer, round.answer) } : {}),
      metadata: {
        blueprintId: blueprint.id,
        roundId: round.id,
        leftFactor: round.leftFactor,
        rightFactor: round.rightFactor,
        selectedAnswer,
        correctAnswer: round.answer,
      },
    });
  } catch (error) {
    console.error("Failed to record generated Times Matrix evidence:", error);
    return undefined;
  }
}

export function recordBubblePopBlueprintResponse(
  blueprint: BubblePopBlueprint,
  roundIndex: number,
  bubbleIndex: number,
  learnerId: string,
  responseId?: string
) {
  const round = blueprint.content.rounds[roundIndex];
  const bubble = round?.bubbles[bubbleIndex];
  if (!round || !bubble) throw new Error(`Bubble Pop blueprint has no bubble ${roundIndex}:${bubbleIndex}`);
  const engine = getSupportedGameEngine("bubble-pop-phonics");
  const eventId = responseEventId(blueprint, round.id, responseId);
  const correct = bubble.letter === round.targetLetter;
  try {
    return recordLearningEvent({
      ...(eventId ? { id: eventId } : {}),
      learnerId,
      activityId: engine.activityId,
      experienceId: engine.experienceId,
      contentId: `${blueprint.id}:${round.id}:${bubble.id}`,
      eventType: "question_answered",
      activityType: "phonics-pop",
      activityTitle: `Generated Phonics Pop: ${round.prompt}`,
      skillId: blueprint.skillId,
      domain: "reading",
      gradeBand: "toddler",
      result: correct ? "success" : "struggle",
      score: correct ? 100 : 0,
      difficulty: blueprint.difficulty,
      attempts: 1,
      hintsUsed: 0,
      ...(!correct ? { misconceptionTags: inferLetterIdentificationMisconceptionTags(bubble.letter, round.targetLetter) } : {}),
      metadata: {
        blueprintId: blueprint.id,
        roundId: round.id,
        selectedLetter: bubble.letter,
        targetLetter: round.targetLetter,
        targetWord: round.bubbles.find((candidate) => candidate.letter === round.targetLetter)?.word,
      },
    });
  } catch (error) {
    console.error("Failed to record generated Bubble Pop evidence:", error);
    return undefined;
  }
}

const STORYBOOK_MISCONCEPTION_TAGS: Readonly<Record<StorybookQuestionType, "story-detail-recall" | "event-order-confusion">> = {
  "key-detail": "story-detail-recall",
  "event-order": "event-order-confusion",
};

/** Records a structured response from the existing narrated picture-book multiple-choice renderer. */
export function recordStorybookComprehensionResponse(
  blueprint: StorybookComprehensionBlueprint,
  pageIndex: number,
  selectedOptionIndex: number,
  learnerId: string,
  hintsUsed = 0,
  responseId?: string
) {
  const round = blueprint.content.rounds[pageIndex];
  if (!round) throw new Error(`Storybook blueprint has no page ${pageIndex}`);
  if (!Number.isInteger(selectedOptionIndex) || selectedOptionIndex < 0 || selectedOptionIndex >= round.options.length) {
    throw new Error(`Storybook page ${round.id} has no answer option ${selectedOptionIndex}`);
  }
  const engine = getSupportedGameEngine("storybook-comprehension");
  const eventId = responseEventId(blueprint, round.id, responseId);
  const correct = selectedOptionIndex === round.correctOptionIndex;
  try {
    return recordLearningEvent({
      ...(eventId ? { id: eventId } : {}),
      learnerId,
      activityId: engine.activityId,
      experienceId: engine.experienceId,
      contentId: `${blueprint.id}:${round.id}:option-${selectedOptionIndex}`,
      eventType: "question_answered",
      activityType: "storybook-interaction",
      activityTitle: `${blueprint.content.storyTitle}: ${round.prompt}`,
      skillId: blueprint.skillId,
      domain: "reading",
      gradeBand: blueprint.gradeBand,
      result: correct ? "success" : "struggle",
      score: correct ? 100 : 0,
      difficulty: blueprint.difficulty,
      attempts: 1,
      hintsUsed,
      ...(!correct ? { misconceptionTags: [STORYBOOK_MISCONCEPTION_TAGS[round.questionType]] } : {}),
      metadata: {
        blueprintId: blueprint.id,
        roundId: round.id,
        questionType: round.questionType,
        selectedAnswer: round.options[selectedOptionIndex],
        correctAnswer: round.options[round.correctOptionIndex],
        evidenceText: round.evidenceText,
      },
    });
  } catch (error) {
    console.error("Failed to record generated storybook evidence:", error);
    return undefined;
  }
}

export function recordBlueprintSessionCompletion(blueprint: GameBlueprint, learnerId: string, sessionId?: string): void {
  const engine = getSupportedGameEngine(blueprint.gameType);
  const activityType = blueprint.gameType === "speed-math"
    ? "math-blitz"
    : blueprint.gameType === "times-matrix"
      ? "times-matrix"
      : blueprint.gameType === "bubble-pop-phonics"
        ? "phonics-pop"
        : "storybook-interaction";
  const eventId = responseEventId(blueprint, "session-completed", sessionId);
  try {
    recordLearningEvent({
      ...(eventId ? { id: eventId } : {}),
      learnerId,
      activityId: engine.activityId,
      experienceId: engine.experienceId,
      contentId: `${blueprint.id}:completed`,
      eventType: "activity_completed",
      activityType,
      activityTitle: `Completed: ${blueprint.objective}`,
      domain: "general",
      gradeBand: blueprint.gameType === "bubble-pop-phonics" ? "toddler" : blueprint.gradeBand,
      result: "explored",
      difficulty: blueprint.difficulty,
      attempts: 1,
      hintsUsed: 0,
      metadata: { blueprintId: blueprint.id, generatedContent: true },
    });
  } catch (error) {
    console.error("Failed to record generated-session evidence:", error);
  }
}
