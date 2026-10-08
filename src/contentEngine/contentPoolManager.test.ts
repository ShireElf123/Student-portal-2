import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { generateValidatedGameBlueprint } from "./generation";
import { ContentPoolManager } from "./contentPoolManager";
import { LocalStorageContentPoolRepository } from "./contentPoolRepository";
import { FirestoreContentPoolRepository } from "./firestoreContentPoolRepository";
import type { StructuredContentProvider } from "./generation";
import type { ContentGenerationRequest, SpeedMathPayload } from "./types";
import { clearGeneratedContentCacheForTests } from "./cache";

class MemoryStorage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(String(key)) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(String(key)); }
  setItem(key: string, value: string) { this.values.set(String(key), String(value)); }
}

const PAYLOADS: SpeedMathPayload[] = [
  {
    gameType: "speed-math",
    objective: "Practice multiplication facts with friendly space explorers.",
    instructions: "Choose the product that matches each multiplication fact.",
    feedback: { correct: "Great thinking!", incorrect: "Take another look at the groups.", completion: "You finished the multiplication mission!" },
    hints: ["Count equal groups to find the product."],
    voice: { introduction: "Ready for a multiplication mission?" },
    rounds: [
      { leftOperand: 2, rightOperand: 3, answer: 6, choices: [6, 5, 7, 8], explanation: "Two groups of three make six.", hint: "Count three, then count three more." },
      { leftOperand: 3, rightOperand: 4, answer: 12, choices: [12, 10, 14, 16], explanation: "Three groups of four make twelve.", hint: "Add four three times." },
      { leftOperand: 4, rightOperand: 5, answer: 20, choices: [20, 18, 22, 24], explanation: "Four groups of five make twenty.", hint: "Count by fives four times." },
    ],
  },
  {
    gameType: "speed-math",
    objective: "Build multiplication confidence one fact at a time.",
    instructions: "Find the product for each pair of factors.",
    feedback: { correct: "That product is right!", incorrect: "Try grouping the factors again.", completion: "Multiplication mission complete!" },
    hints: ["Use an array or repeated addition."],
    voice: { introduction: "Let's solve a few multiplication facts." },
    rounds: [
      { leftOperand: 2, rightOperand: 4, answer: 8, choices: [8, 6, 10, 12], explanation: "Two groups of four make eight.", hint: "Add four twice." },
      { leftOperand: 3, rightOperand: 5, answer: 15, choices: [15, 12, 18, 20], explanation: "Three groups of five make fifteen.", hint: "Count by fives three times." },
      { leftOperand: 2, rightOperand: 5, answer: 10, choices: [10, 8, 12, 15], explanation: "Two groups of five make ten.", hint: "Add five twice." },
    ],
  },
];

function makeRequest(): ContentGenerationRequest {
  return {
    gameType: "speed-math",
    skillId: "math-23-multiplication",
    gradeBand: "2-3",
    difficulty: "easy",
    theme: "space",
    roundCount: 3,
    learnerContext: {
      gradeBand: "2-3",
      masteryBand: "new",
      currentDifficultyLevel: 1,
      recentIncorrectCount: 0,
      weakSkillIds: [],
    },
  };
}

async function generateBlueprint(payload: SpeedMathPayload, request = makeRequest(), now = 1_790_000_000_000) {
  const provider: StructuredContentProvider = {
    name: "pool-manager-gemini-boundary",
    generateStructuredContent: async () => JSON.stringify(payload),
  };
  const result = await generateValidatedGameBlueprint(request, provider, { now: () => now });
  if (!result.valid) throw new Error(result.errors.map((error) => error.message).join("; "));
  return result.blueprint;
}

describe("validated content pool manager", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", new MemoryStorage());
    vi.stubGlobal("window", new EventTarget());
    clearGeneratedContentCacheForTests();
  });

  afterEach(() => vi.unstubAllGlobals());

  it("reuses one validated shared blueprint across compatible learner contexts while isolating reservations and played state", async () => {
    const request = makeRequest();
    const anotherContext: ContentGenerationRequest = {
      ...request,
      learnerContext: {
        ...request.learnerContext,
        masteryBand: "developing",
        currentDifficultyLevel: 3,
        recentIncorrectCount: 2,
        weakSkillIds: ["math-23-multiplication"],
      },
    };
    const blueprint = await generateBlueprint(PAYLOADS[0], request);
    const repository = new LocalStorageContentPoolRepository();
    expect((await repository.saveValidatedBlueprint(blueprint, 1_000, 1_000 + 60_000)).stored).toBe(true);
    const pool = new ContentPoolManager(repository);

    const reservation = await pool.reserveContent(request, "learner-pool-A", 2_000);
    expect(reservation?.blueprint.metadata.fingerprint).toBe(blueprint.metadata.fingerprint);
    expect(await pool.reserveContent(request, "learner-pool-A", 2_001)).toBeNull();
    await pool.markPlayed("learner-pool-A", blueprint, 2_002);

    expect(await pool.findCompatibleContent(request, "learner-pool-A", 2_003)).toBeNull();
    expect((await pool.findCompatibleContent(anotherContext, "learner-pool-B", 2_003))?.id).toBe(blueprint.id);
  });

  it("skips expired pool entries and keeps a refill bounded, de-duplicated, and under a cooldown", async () => {
    const request = makeRequest();
    const expiredBlueprint = await generateBlueprint(PAYLOADS[0], request);
    const repository = new LocalStorageContentPoolRepository();
    await repository.saveValidatedBlueprint(expiredBlueprint, 1_000, 2_000);
    const pool = new ContentPoolManager(repository);
    expect(await pool.findCompatibleContent(request, "learner-expiry", 1_999)).not.toBeNull();
    expect(await pool.findCompatibleContent(request, "learner-expiry", 2_000)).toBeNull();

    clearGeneratedContentCacheForTests();
    const duplicateRepository = new LocalStorageContentPoolRepository();
    const duplicatePool = new ContentPoolManager(duplicateRepository);
    let providerCalls = 0;
    const duplicateProvider: StructuredContentProvider = {
      name: "duplicate-gemini-boundary",
      generateStructuredContent: vi.fn(async () => {
        providerCalls += 1;
        return JSON.stringify(PAYLOADS[0]);
      }),
    };
    const refillTime = 1_790_000_000_000;
    const refill = await duplicatePool.replenish(request, "learner-refill", {
      now: () => refillTime,
      generate: async (excludedFingerprints) => {
        const result = await generateValidatedGameBlueprint(request, duplicateProvider, {
          now: () => refillTime,
          sleep: async () => {},
          excludedFingerprints,
        });
        if (!result.valid) throw new Error("The external provider repeated excluded content.");
        return result.blueprint;
      },
    });
    expect(refill.generatedCount).toBe(1);
    expect(refill.attemptedCount).toBe(2);
    expect(refill.error).toBeInstanceOf(Error);
    expect(providerCalls).toBe(3);
    expect((await duplicatePool.getPoolHealth(request, "learner-refill", refillTime)).availableCount).toBe(1);

    const retry = await duplicatePool.replenish(request, "learner-refill", {
      now: () => refillTime + 1,
      generate: async () => { throw new Error("Cooldown must prevent another generation call."); },
    });
    expect(retry).toMatchObject({ generatedCount: 0, attemptedCount: 0 });
    expect(providerCalls).toBe(3);
  });

  it("keeps shared Firestore blueprint writes unavailable to browser clients", async () => {
    const blueprint = await generateBlueprint(PAYLOADS[0]);
    const repository = new FirestoreContentPoolRepository("account-owner");

    await expect(repository.saveValidatedBlueprint(blueprint, 1_000, 61_000)).resolves.toMatchObject({
      stored: false,
      duplicate: false,
      error: "Shared blueprint writes are restricted to the authenticated generation server.",
    });
    await expect(repository.saveValidatedBlueprint({ ...blueprint, objective: "A violent game." }, 1_000, 61_000))
      .resolves.toMatchObject({ stored: false, duplicate: false });
  });

  it("allows only one concurrent reservation of the same blueprint for one learner", async () => {
    const request = makeRequest();
    const blueprint = await generateBlueprint(PAYLOADS[0], request);
    const repository = new LocalStorageContentPoolRepository();
    await repository.saveValidatedBlueprint(blueprint, 1_000, 2_000);
    const pool = new ContentPoolManager(repository);

    const reservations = await Promise.all([
      pool.reserveContent(request, "learner-race", 1_500),
      pool.reserveContent(request, "learner-race", 1_500),
    ]);
    expect(reservations.filter(Boolean)).toHaveLength(1);
  });
});
