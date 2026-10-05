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

export type ContentPoolCompatibility = Pick<
  ContentGenerationRequest,
  "gameType" | "skillId" | "gradeBand" | "difficulty" | "theme" | "roundCount"
>;

/**
 * Shared pool key deliberately excludes learnerContext. That context may scaffold a
 * generation request, but it is not a learner record and must not fragment otherwise
 * compatible validated content into identity-specific caches.
 */
export function buildContentPoolKey(request: ContentPoolCompatibility): string {
  const normalizedRequest = {
    gameType: request.gameType,
    skillId: request.skillId,
    gradeBand: request.gradeBand,
    difficulty: request.difficulty,
    theme: request.theme,
    roundCount: request.roundCount,
  };
  return `content-pool-v1:${stableHash(JSON.stringify(normalizedRequest))}`;
}

export function buildBlueprintContentPoolKey(blueprint: GameBlueprint): string {
  return buildContentPoolKey({
    gameType: blueprint.gameType,
    skillId: blueprint.skillId,
    gradeBand: blueprint.gradeBand,
    difficulty: blueprint.difficulty,
    theme: blueprint.theme,
    roundCount: blueprint.content.rounds.length,
  });
}

/**
 * Stable key for a persisted blueprint. It intentionally contains only public content
 * compatibility fields; learner-specific scaffolding signals must never enter shared
 * Firestore documents, even as a reversible low-entropy hash.
 */
function buildContentCompatibilityIdentity(request: ContentGenerationRequest) {
  return {
    gameType: request.gameType,
    skillId: request.skillId,
    gradeBand: request.gradeBand,
    difficulty: request.difficulty,
    theme: request.theme,
    roundCount: request.roundCount,
  };
}

export function buildBlueprintCacheKey(request: ContentGenerationRequest): string {
  return `content-cache-v1:${stableHash(JSON.stringify(buildContentCompatibilityIdentity(request)))}`;
}

/** Runtime-only identity for coalescing identical personalized provider requests. Never persist this key. */
export function buildContentGenerationFlightKey(request: ContentGenerationRequest): string {
  const normalizedRequest = {
    ...buildContentCompatibilityIdentity(request),
    learnerContext: {
      gradeBand: request.learnerContext.gradeBand,
      masteryBand: request.learnerContext.masteryBand,
      currentDifficultyLevel: request.learnerContext.currentDifficultyLevel,
      recentIncorrectCount: request.learnerContext.recentIncorrectCount,
      weakSkillIds: [...request.learnerContext.weakSkillIds].sort(),
    },
  };
  return `content-flight-v1:${stableHash(JSON.stringify(normalizedRequest))}`;
}
