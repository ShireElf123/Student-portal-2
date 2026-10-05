import type { ContentGenerationRequest, GameBlueprint } from "./types";

export function normalizeContentText(value: string): string {
  return value.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase("en-US");
}

function stableHash(value: string): string {
  let hash = 14695981039346656037n;
  const prime = 1099511628211n;
  const mask = (1n << 64n) - 1n;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= BigInt(value.charCodeAt(index));
    hash = (hash * prime) & mask;
  }
  return `fnv1a64-${hash.toString(16).padStart(16, "0")}`;
}

function canonicalFactorPair(left: number, right: number): [number, number] {
  return left <= right ? [left, right] : [right, left];
}

/** Fingerprints semantic question content, not model wording, IDs, timestamps, or theme. */
export function fingerprintGameBlueprint(blueprint: GameBlueprint): string {
  let normalizedRounds: string[];
  switch (blueprint.gameType) {
    case "speed-math":
      normalizedRounds = blueprint.content.rounds.map((round) => {
        const [left, right] = canonicalFactorPair(round.leftOperand, round.rightOperand);
        return `${left}x${right}`;
      });
      break;
    case "times-matrix":
      normalizedRounds = blueprint.content.rounds.map((round) => {
        const [left, right] = canonicalFactorPair(round.leftFactor, round.rightFactor);
        return `${left}x${right}`;
      });
      break;
    case "bubble-pop-phonics":
      normalizedRounds = blueprint.content.rounds.map((round) => {
        const pairs = round.bubbles
          .map((bubble) => `${normalizeContentText(bubble.letter)}:${normalizeContentText(bubble.word)}`)
          .sort();
        return `${normalizeContentText(round.targetLetter)}|${pairs.join("|")}`;
      });
      break;
  }

  const semanticContent = JSON.stringify({
    gameType: blueprint.gameType,
    skillId: blueprint.skillId,
    gradeBand: blueprint.gradeBand,
    difficulty: blueprint.difficulty,
    rounds: normalizedRounds.sort(),
  });
  return stableHash(semanticContent);
}

export function gameBlueprintId(fingerprint: string): string {
  return `game-blueprint-${fingerprint.replace(/^fnv1a64-/, "")}`;
}

export function buildContentCacheKey(request: ContentGenerationRequest): string {
  const normalizedRequest = {
    gameType: request.gameType,
    skillId: request.skillId,
    gradeBand: request.gradeBand,
    difficulty: request.difficulty,
    theme: request.theme,
    roundCount: request.roundCount,
    learnerContext: {
      gradeBand: request.learnerContext.gradeBand,
      masteryBand: request.learnerContext.masteryBand,
      currentDifficultyLevel: request.learnerContext.currentDifficultyLevel,
      recentIncorrectCount: request.learnerContext.recentIncorrectCount,
      weakSkillIds: [...request.learnerContext.weakSkillIds].sort(),
    },
  };
  return `content-cache-v1:${stableHash(JSON.stringify(normalizedRequest))}`;
}
