import { recordLearningEvent } from "../utils/learnerBrain";
import { getSupportedGameEngine } from "./registry";
import type { BubblePopBlueprint, GameBlueprint, SpeedMathBlueprint, TimesMatrixBlueprint } from "./types";

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
  hintsUsed = 0
) {
  const round = blueprint.content.rounds[roundIndex];
  if (!round) throw new Error(`Speed Math blueprint has no round ${roundIndex}`);
  const engine = getSupportedGameEngine("speed-math");
  const correct = selectedAnswer === round.answer;
  return recordLearningEvent({
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
    metadata: {
      blueprintId: blueprint.id,
      roundId: round.id,
      leftOperand: round.leftOperand,
      rightOperand: round.rightOperand,
      selectedAnswer,
      correctAnswer: round.answer,
    },
  });
}

export function recordTimesMatrixBlueprintResponse(
  blueprint: TimesMatrixBlueprint,
  roundIndex: number,
  selectedAnswer: number,
  learnerId: string,
  hintsUsed = 0
) {
  const round = blueprint.content.rounds[roundIndex];
  if (!round) throw new Error(`Times Matrix blueprint has no round ${roundIndex}`);
  const engine = getSupportedGameEngine("times-matrix");
  const correct = selectedAnswer === round.answer;
  return recordLearningEvent({
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
    metadata: {
      blueprintId: blueprint.id,
      roundId: round.id,
      leftFactor: round.leftFactor,
      rightFactor: round.rightFactor,
      selectedAnswer,
      correctAnswer: round.answer,
    },
  });
}

export function recordBubblePopBlueprintResponse(
  blueprint: BubblePopBlueprint,
  roundIndex: number,
  bubbleIndex: number,
  learnerId: string
) {
  const round = blueprint.content.rounds[roundIndex];
  const bubble = round?.bubbles[bubbleIndex];
  if (!round || !bubble) throw new Error(`Bubble Pop blueprint has no bubble ${roundIndex}:${bubbleIndex}`);
  const engine = getSupportedGameEngine("bubble-pop-phonics");
  const correct = bubble.letter === round.targetLetter;
  return recordLearningEvent({
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
    metadata: {
      blueprintId: blueprint.id,
      roundId: round.id,
      selectedLetter: bubble.letter,
      targetLetter: round.targetLetter,
      targetWord: round.bubbles.find((candidate) => candidate.letter === round.targetLetter)?.word,
    },
  });
}

export function recordBlueprintSessionCompletion(blueprint: GameBlueprint, learnerId: string): void {
  const engine = getSupportedGameEngine(blueprint.gameType);
  const activityType = blueprint.gameType === "speed-math"
    ? "math-blitz"
    : blueprint.gameType === "times-matrix"
      ? "times-matrix"
      : "phonics-pop";
  recordLearningEvent({
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
}
