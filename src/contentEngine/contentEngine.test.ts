import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getInitialLearnerModel, getLearnerModel, setActiveLearnerId } from "../utils/learnerBrain";
import { buildContentGenerationRequest, buildLearnerGenerationContext } from "./learnerContext";
import { cacheValidatedGameBlueprint, clearGeneratedContentCacheForTests, findReusableGameBlueprint, getContentPoolStatus, getKnownBlueprintFingerprints, markGameBlueprintCompleted } from "./cache";
import { fingerprintGameBlueprint } from "./fingerprint";
import { adaptSpeedMathRound, adaptTimesMatrixRound, recordBlueprintSessionCompletion, recordBubblePopBlueprintResponse, recordSpeedMathBlueprintResponse, recordTimesMatrixBlueprintResponse } from "./gameAdapters";
import { generateValidatedGameBlueprint, StructuredContentProvider } from "./generation";
import { validateContentGenerationRequest, validateGameBlueprint } from "./validation";
import { validateSupportedGameEngineRegistry } from "./registry";
import { getOrGenerateGameBlueprint } from "../services/gameContentService";
import type { ContentGenerationRequest, GameBlueprint, GeneratedGamePayload, SupportedGameType } from "./types";

vi.mock("../firebaseCore", () => ({
  saveLearnerModelToCloud: vi.fn().mockResolvedValue(undefined),
  fetchLearnerModelFromCloud: vi.fn().mockResolvedValue(null),
  recordCloudLearningEvent: vi.fn().mockResolvedValue(undefined),
  notifySyncStatus: vi.fn(),
}));

class MemoryStorage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(String(key)) ?? null; }
  key(index: number) { return Array.from(this.values.keys())[index] ?? null; }
  removeItem(key: string) { this.values.delete(String(key)); }
  setItem(key: string, value: string) { this.values.set(String(key), String(value)); }
}

const SPEED_PAYLOAD: GeneratedGamePayload = {
  gameType: "speed-math",
  objective: "Practice multiplication facts with friendly space explorers.",
  instructions: "Choose the product that matches each multiplication fact.",
  feedback: {
    correct: "Great thinking!",
    incorrect: "Take another look at the groups.",
    completion: "You finished the multiplication mission!",
  },
  hints: ["Count equal groups to find the product."],
  voice: { introduction: "Ready for a multiplication mission?" },
  rounds: [
    { leftOperand: 2, rightOperand: 3, answer: 6, choices: [6, 5, 7, 8], explanation: "Two groups of three make six.", hint: "Count three, then count three more." },
    { leftOperand: 3, rightOperand: 4, answer: 12, choices: [12, 10, 14, 16], explanation: "Three groups of four make twelve.", hint: "Add four three times." },
    { leftOperand: 4, rightOperand: 5, answer: 20, choices: [20, 18, 22, 24], explanation: "Four groups of five make twenty.", hint: "Count by fives four times." },
  ],
};

const MATRIX_PAYLOAD: GeneratedGamePayload = {
  gameType: "times-matrix",
  objective: "Build confidence with multiplication facts.",
  instructions: "Find the product for each pair of factors.",
  feedback: {
    correct: "That product is right!",
    incorrect: "Try grouping the factors again.",
    completion: "Matrix mission complete!",
  },
  hints: ["Use an array or repeated addition."],
  voice: { introduction: "Let's solve the matrix facts together." },
  rounds: [
    { leftFactor: 2, rightFactor: 4, answer: 8, choices: [8, 6, 10, 12], explanation: "Two groups of four make eight.", hint: "Add four twice." },
    { leftFactor: 3, rightFactor: 5, answer: 15, choices: [15, 12, 18, 20], explanation: "Three groups of five make fifteen.", hint: "Count by fives three times." },
    { leftFactor: 4, rightFactor: 5, answer: 20, choices: [20, 16, 24, 25], explanation: "Four groups of five make twenty.", hint: "Count four fives." },
  ],
};

const BUBBLE_PAYLOAD: GeneratedGamePayload = {
  gameType: "bubble-pop-phonics",
  objective: "Match each target letter to a friendly word.",
  instructions: "Tap the bubble that shows the target letter.",
  feedback: {
    correct: "You found the matching letter!",
    incorrect: "Keep looking for the target letter.",
    completion: "You explored every letter round!",
  },
  hints: ["Look carefully at the first letter in each word."],
  voice: { introduction: "Let's find letters hiding in the bubbles." },
  rounds: [
    { targetLetter: "B", bubbles: [{ letter: "B", word: "Bear" }, { letter: "C", word: "Cat" }, { letter: "S", word: "Sun" }] },
    { targetLetter: "M", bubbles: [{ letter: "M", word: "Moon" }, { letter: "A", word: "Apple" }, { letter: "F", word: "Frog" }] },
    { targetLetter: "P", bubbles: [{ letter: "P", word: "Puppy" }, { letter: "R", word: "Rainbow" }, { letter: "T", word: "Tiger" }] },
  ],
};

const PAYLOADS: Record<SupportedGameType, GeneratedGamePayload> = {
  "speed-math": SPEED_PAYLOAD,
  "times-matrix": MATRIX_PAYLOAD,
  "bubble-pop-phonics": BUBBLE_PAYLOAD,
};

function makeRequest(gameType: SupportedGameType = "speed-math"): ContentGenerationRequest {
  const skillId = gameType === "bubble-pop-phonics" ? "read-k1-alphabet-letters" : "math-23-multiplication";
  const gradeBand = gameType === "bubble-pop-phonics" ? "K-1" : "2-3";
  return {
    gameType,
    skillId,
    gradeBand,
    difficulty: "easy",
    theme: gameType === "bubble-pop-phonics" ? "garden" : "space",
    roundCount: 3,
    learnerContext: {
      gradeBand,
      masteryBand: "new",
      currentDifficultyLevel: 1,
      recentIncorrectCount: 0,
      weakSkillIds: [],
    },
  };
}

function providerFor(payload: GeneratedGamePayload): StructuredContentProvider {
  return {
    name: "test-provider",
    generateStructuredContent: vi.fn().mockResolvedValue(JSON.stringify(payload)),
  };
}

async function generateFixture<T extends SupportedGameType = "speed-math">(
  gameType: T = "speed-math" as T
): Promise<Extract<GameBlueprint, { gameType: T }>> {
  const outcome = await generateValidatedGameBlueprint(makeRequest(gameType), providerFor(PAYLOADS[gameType]), {
    now: () => 1_790_000_000_000,
  });
  if (!outcome.valid) throw new Error(outcome.errors.map((error) => error.message).join("; "));
  if (outcome.blueprint.gameType !== gameType) throw new Error("Generated game type did not match its request.");
  return outcome.blueprint as Extract<GameBlueprint, { gameType: T }>;
}

let storage: MemoryStorage;
let learnerCounter = 0;

describe("Content Engine V1", () => {
  beforeEach(() => {
    storage = new MemoryStorage();
    vi.stubGlobal("localStorage", storage);
    vi.stubGlobal("window", new EventTarget());
    clearGeneratedContentCacheForTests();
    const resetId = `content-reset-${learnerCounter++}`;
    setActiveLearnerId(resetId);
    setActiveLearnerId(`content-learner-${learnerCounter}`);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("keeps the three supported renderers bound to real registered activities and skills", () => {
    expect(validateSupportedGameEngineRegistry()).toEqual([]);
  });

  it("parses provider JSON and validates a versioned Speed Math blueprint", async () => {
    const outcome = await generateValidatedGameBlueprint(makeRequest("speed-math"), providerFor(SPEED_PAYLOAD), {
      now: () => 1_790_000_000_000,
    });
    expect(outcome.valid).toBe(true);
    if (!outcome.valid) throw new Error("Expected a valid generated blueprint.");
    expect(outcome.attempts).toBe(1);
    expect(outcome.blueprint).toMatchObject({
      version: "game-blueprint-v1",
      gameType: "speed-math",
      skillId: "math-23-multiplication",
      gradeBand: "2-3",
      ageBand: "7-9",
      difficulty: "easy",
      metadata: { provider: "test-provider", validationStatus: "valid" },
    });
    expect(validateGameBlueprint(outcome.blueprint, { expectedRequest: makeRequest("speed-math") }).valid).toBe(true);
  });

  it("validates every supported discriminated content shape", async () => {
    for (const gameType of ["speed-math", "times-matrix", "bubble-pop-phonics"] as const) {
      const blueprint = await generateFixture(gameType);
      const result = validateGameBlueprint(blueprint, { expectedRequest: makeRequest(gameType) });
      expect(result.valid, gameType).toBe(true);
    }
  });

  it("rejects unknown skills, unsupported game types, invalid difficulty, and incompatible age/grade", async () => {
    const valid = await generateFixture();
    expect(validateGameBlueprint({ ...valid, skillId: "made-up-skill" }).errors.some((error) => error.code === "UNKNOWN_SKILL")).toBe(true);
    expect(validateGameBlueprint({ ...valid, gameType: "new-react-game" }).errors.some((error) => error.code === "UNSUPPORTED_GAME_TYPE")).toBe(true);
    expect(validateGameBlueprint({ ...valid, difficulty: "impossible" }).errors.some((error) => error.code === "INVALID_DIFFICULTY")).toBe(true);
    expect(validateGameBlueprint({ ...valid, ageBand: "2-4" }).errors.some((error) => error.code === "AGE_BAND_MISMATCH")).toBe(true);
    expect(validateGameBlueprint({ ...valid, gradeBand: "K-1" }).errors.some((error) => error.code === "GRADE_BAND_MISMATCH")).toBe(true);
  });

  it("rejects malformed answers, impossible products, duplicate choices, empty text, and unsafe child content", async () => {
    const valid = await generateFixture("speed-math");
    const firstRound = valid.content.rounds[0];
    const duplicateChoices = {
      ...valid,
      content: { rounds: [{ ...firstRound, choices: [6, 6, 7, 8] }, ...valid.content.rounds.slice(1)] },
    };
    expect(validateGameBlueprint(duplicateChoices).errors.some((error) => error.code === "INVALID_CONTENT")).toBe(true);

    const incorrectProduct = {
      ...valid,
      content: { rounds: [{ ...firstRound, answer: 99 }, ...valid.content.rounds.slice(1)] },
    };
    expect(validateGameBlueprint(incorrectProduct).errors.some((error) => error.field.endsWith("answer"))).toBe(true);

    expect(validateGameBlueprint({ ...valid, instructions: "  " }).errors.some((error) => error.code === "MISSING_FIELD")).toBe(true);
    expect(validateGameBlueprint({ ...valid, objective: "A violent game" }).errors.some((error) => error.code === "UNSAFE_CONTENT")).toBe(true);
  });

  it("rejects a model response that changes a curriculum or engine identity", async () => {
    const provider: StructuredContentProvider = {
      name: "mismatched-game",
      generateStructuredContent: vi.fn().mockResolvedValue({ ...SPEED_PAYLOAD, gameType: "times-matrix" }),
    };
    const outcome = await generateValidatedGameBlueprint(makeRequest("speed-math"), provider, { maxAttempts: 1 });
    expect(outcome.valid).toBe(false);
    expect(outcome.errors.some((error) => error.code === "UNSUPPORTED_GAME_TYPE")).toBe(true);
  });

  it("bounds validation retries and returns structured errors instead of persisting invalid output", async () => {
    const provider: StructuredContentProvider = {
      name: "always-invalid",
      generateStructuredContent: vi.fn().mockResolvedValue("not JSON"),
    };
    const outcome = await generateValidatedGameBlueprint(makeRequest(), provider);
    expect(outcome.valid).toBe(false);
    expect(outcome.attempts).toBe(2);
    expect(provider.generateStructuredContent).toHaveBeenCalledTimes(2);
    expect(outcome.errors[0].field).toBe("providerOutput");
  });

  it("rejects a duplicate normalized blueprint and retries no more than once", async () => {
    const existing = await generateFixture("speed-math");
    const provider = providerFor(SPEED_PAYLOAD);
    const outcome = await generateValidatedGameBlueprint(makeRequest(), provider, {
      excludedFingerprints: [existing.metadata.fingerprint],
    });
    expect(outcome.valid).toBe(false);
    expect(outcome.attempts).toBe(2);
    expect(outcome.errors.some((error) => error.code === "DUPLICATE_CONTENT")).toBe(true);
    expect(provider.generateStructuredContent).toHaveBeenCalledTimes(2);
  });

  it("fingerprints normalized math questions independently of ordering, wording, and answer-choice order", async () => {
    const blueprint = await generateFixture("speed-math");
    const variant = {
      ...blueprint,
      objective: "Different child-facing wording.",
      theme: "ocean" as const,
      content: {
        rounds: [...blueprint.content.rounds].reverse().map((round) => ({
          ...round,
          id: `changed-${round.id}`,
          choices: [...round.choices].reverse(),
        })),
      },
    };
    expect(fingerprintGameBlueprint(blueprint)).toBe(fingerprintGameBlueprint(variant));
  });

  it("rejects invalid provider content before it can be written to the persistent cache", async () => {
    const valid = await generateFixture("speed-math");
    const invalid = {
      ...valid,
      content: { rounds: [{ ...valid.content.rounds[0], choices: [6, 6, 6, 6] }, ...valid.content.rounds.slice(1)] },
    };
    await expect(getOrGenerateGameBlueprint(makeRequest(), "cache-test-learner", {
      transport: { generate: async () => ({ blueprint: invalid, attempts: 1 }) },
    })).rejects.toThrow(/failed client-side validation/i);
    expect(storage.getItem("student_portal_generated_game_content_v1")).toBeNull();
  });

  it("persists only validated blueprints, deduplicates them, and retrieves a cached set without another provider call", async () => {
    const blueprint = await generateFixture("speed-math");
    expect(cacheValidatedGameBlueprint(blueprint).stored).toBe(true);
    const duplicate = cacheValidatedGameBlueprint(blueprint);
    expect(duplicate.duplicate).toBe(true);
    expect(cacheValidatedGameBlueprint({ invalid: true }).stored).toBe(false);

    const transport = { generate: vi.fn() };
    const beforeGenerate = vi.fn();
    const result = await getOrGenerateGameBlueprint(makeRequest(), "learner-cache-hit", { transport, beforeGenerate });
    expect(result.source).toBe("cache");
    expect(result.blueprint.id).toBe(blueprint.id);
    expect(transport.generate).not.toHaveBeenCalled();
    expect(beforeGenerate).not.toHaveBeenCalled();
    expect(findReusableGameBlueprint(makeRequest(), "learner-cache-hit")?.id).toBe(blueprint.id);
  });

  it("keeps shared content reusable across learners while isolating per-learner consumption", async () => {
    const blueprint = await generateFixture("speed-math");
    cacheValidatedGameBlueprint(blueprint);
    markGameBlueprintCompleted(blueprint, "learner-A");
    expect(findReusableGameBlueprint(makeRequest(), "learner-A")).toBeNull();
    expect(findReusableGameBlueprint(makeRequest(), "learner-B")?.id).toBe(blueprint.id);
    expect(getContentPoolStatus(makeRequest(), "learner-A").needsRefill).toBe(true);
    expect(getKnownBlueprintFingerprints()).toContain(blueprint.metadata.fingerprint);
  });

  it("does not leak learner A context or identity into learner B's request", () => {
    const learnerA = getInitialLearnerModel("learner-A-private-id");
    learnerA.weakSkills = ["math-23-multiplication"];
    learnerA.skillMastery["math-23-multiplication"].currentDifficultyLevel = 3;
    learnerA.recentEvents = [{
      id: "private-a-event",
      learnerId: "learner-A-private-id",
      activityId: "times-table-matrix-battle",
      experienceId: "times-matrix",
      contentId: "private-a-question",
      eventType: "question_answered",
      activityType: "times-matrix",
      activityTitle: "Private question",
      skillId: "math-23-multiplication",
      domain: "math",
      gradeBand: "2-3",
      result: "struggle",
      outcome: "incorrect",
      difficulty: "medium",
      attempts: 1,
      hintsUsed: 0,
      timestamp: Date.now(),
    }];
    const learnerB = getInitialLearnerModel("learner-B-private-id");
    learnerB.weakSkills = ["math-k1-addition-subtraction"];
    const contextA = buildLearnerGenerationContext(learnerA, "math-23-multiplication");
    const requestB = buildContentGenerationRequest(learnerB, "speed-math", "math-23-multiplication", "space");
    expect(contextA.recentIncorrectCount).toBe(1);
    expect(requestB.learnerContext.weakSkillIds).toEqual(["math-k1-addition-subtraction"]);
    expect(requestB.learnerContext).not.toEqual(contextA);
    expect(JSON.stringify(requestB)).not.toContain("learner-A-private-id");
    expect(JSON.stringify(requestB)).not.toContain("private-a-question");
    expect(validateContentGenerationRequest(requestB).valid).toBe(true);
  });

  it("routes generated Speed Math, Times Matrix, and Bubble Pop answers through existing renderers and learner evidence", async () => {
    const learnerId = `content-evidence-${learnerCounter++}`;
    setActiveLearnerId(`content-reset-${learnerCounter}`);
    setActiveLearnerId(learnerId);

    const speedBlueprint = await generateFixture("speed-math");
    const speedQuestion = adaptSpeedMathRound(speedBlueprint, 0);
    expect(speedQuestion?.prompt).toBe("2 × 3 = ?");
    recordSpeedMathBlueprintResponse(speedBlueprint, 0, 6, learnerId);
    recordSpeedMathBlueprintResponse(speedBlueprint, 1, 10, learnerId);
    recordBlueprintSessionCompletion(speedBlueprint, learnerId);
    expect(getLearnerModel(learnerId).skillMastery["math-23-multiplication"].totalAttempts).toBe(2);

    const matrixBlueprint = await generateFixture("times-matrix");
    expect(adaptTimesMatrixRound(matrixBlueprint, 0)?.answer).toBe(8);
    recordTimesMatrixBlueprintResponse(matrixBlueprint, 0, 8, learnerId);
    expect(getLearnerModel(learnerId).skillMastery["math-23-multiplication"].totalAttempts).toBe(3);

    const bubbleBlueprint = await generateFixture("bubble-pop-phonics");
    recordBubblePopBlueprintResponse(bubbleBlueprint, 0, 0, learnerId);
    expect(getLearnerModel(learnerId).skillMastery["read-k1-alphabet-letters"].totalAttempts).toBe(1);
    expect(getLearnerModel(learnerId).recentEvents[0]).toMatchObject({
      activityId: "toddler-bubble-pop-phonics",
      experienceId: "bubble-pop-phonics",
      contentId: `${bubbleBlueprint.id}:round-1:bubble-1`,
      skillId: "read-k1-alphabet-letters",
      outcome: "correct",
    });
  });
});
