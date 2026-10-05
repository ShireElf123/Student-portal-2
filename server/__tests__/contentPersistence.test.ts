import { vi, beforeEach, describe, expect, it } from "vitest";
import { buildBlueprintContentPoolKey } from "../../src/contentEngine/fingerprint";
import { generateValidatedGameBlueprint } from "../../src/contentEngine/generation";
import type { ContentGenerationRequest, GameBlueprint, SpeedMathPayload } from "../../src/contentEngine/types";
import { validateGameBlueprint } from "../../src/contentEngine/validation";
import {
  persistServerValidatedBlueprint,
  SERVER_VALIDATED_BLUEPRINT_SOURCE,
} from "../contentPersistence";

interface MockDocumentReference {
  path: string;
}

interface MockTransaction {
  get(reference: MockDocumentReference): Promise<{ exists: boolean; data: () => unknown }>;
  set(reference: MockDocumentReference, data: unknown): void;
  update(reference: MockDocumentReference, data: Record<string, unknown>): void;
}

type TransactionOperation = (transaction: MockTransaction) => Promise<unknown>;

const persistenceMocks = vi.hoisted(() => {
  const documents = new Map<string, unknown>();
  const runTransaction = vi.fn(async (operation: TransactionOperation) => operation({
    get: async (reference) => ({
      exists: documents.has(reference.path),
      data: () => documents.get(reference.path),
    }),
    set: (reference, data) => documents.set(reference.path, structuredClone(data)),
    update: (reference, updates) => {
      const existing = documents.get(reference.path);
      if (!existing || typeof existing !== "object" || Array.isArray(existing)) {
        throw new Error("Cannot update a missing or invalid test document.");
      }
      documents.set(reference.path, { ...existing, ...updates });
    },
  }));
  const firestore = {
    collection: (collectionName: string) => ({
      doc: (documentId: string) => ({ path: `${collectionName}/${documentId}` }),
    }),
    runTransaction,
  };
  return {
    documents,
    runTransaction,
    getFirestore: vi.fn(() => firestore),
  };
});

vi.mock("firebase-admin/app", () => ({
  applicationDefault: vi.fn(() => ({ kind: "test-application-default" })),
  getApps: vi.fn(() => []),
  initializeApp: vi.fn(() => ({ name: "student-portal-content-pool-writer" })),
}));

vi.mock("firebase-admin/firestore", () => ({
  getFirestore: persistenceMocks.getFirestore,
}));

const REQUEST: ContentGenerationRequest = {
  gameType: "speed-math",
  skillId: "math-23-multiplication",
  gradeBand: "2-3",
  difficulty: "easy",
  theme: "space",
  roundCount: 3,
  learnerContext: {
    gradeBand: "2-3",
    masteryBand: "developing",
    currentDifficultyLevel: 3,
    recentIncorrectCount: 2,
    weakSkillIds: ["math-23-multiplication"],
  },
};

const SPEED_PAYLOAD: SpeedMathPayload = {
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
};

async function makeBlueprint(): Promise<Extract<GameBlueprint, { gameType: "speed-math" }>> {
  const outcome = await generateValidatedGameBlueprint(REQUEST, {
    name: "gemini-server-persistence-test",
    generateStructuredContent: async () => JSON.stringify(SPEED_PAYLOAD),
  }, { now: () => 1_790_000_000_000 });
  if (!outcome.valid || outcome.blueprint.gameType !== "speed-math") {
    throw new Error("The trusted test provider did not produce a valid Speed Math blueprint.");
  }
  return outcome.blueprint;
}

function storedDocumentFor(blueprint: GameBlueprint): Record<string, unknown> {
  const stored: unknown = persistenceMocks.documents.get(`generatedGameBlueprints/${blueprint.metadata.fingerprint}`);
  if (!stored || typeof stored !== "object" || Array.isArray(stored)) {
    throw new Error("The server-validated blueprint was not stored as a document.");
  }
  return stored as Record<string, unknown>;
}

describe("server-authoritative generated blueprint persistence", () => {
  beforeEach(() => {
    persistenceMocks.documents.clear();
    persistenceMocks.runTransaction.mockClear();
    persistenceMocks.getFirestore.mockClear();
  });

  it("persists only server-validated, learner-independent blueprints with provenance", async () => {
    const blueprint = await makeBlueprint();

    await expect(persistServerValidatedBlueprint(blueprint)).resolves.toBe(true);
    const document = storedDocumentFor(blueprint);
    expect(document).toMatchObject({
      source: SERVER_VALIDATED_BLUEPRINT_SOURCE,
      fingerprint: blueprint.metadata.fingerprint,
      poolKey: buildBlueprintContentPoolKey(blueprint),
      gameType: blueprint.gameType,
      skillId: blueprint.skillId,
      gradeBand: blueprint.gradeBand,
      ageBand: blueprint.ageBand,
      difficulty: blueprint.difficulty,
      theme: blueprint.theme,
      blueprint,
    });
    expect(Object.keys(document).sort()).toEqual([
      "source", "fingerprint", "poolKey", "gameType", "skillId", "gradeBand", "ageBand",
      "difficulty", "theme", "roundCount", "blueprintVersion", "createdAt", "expiresAt", "blueprint",
    ].sort());
    expect(typeof document.createdAt).toBe("number");
    expect(typeof document.expiresAt).toBe("number");
    expect(validateGameBlueprint(document.blueprint).valid).toBe(true);

    const serializedDocument = JSON.stringify(document);
    expect(serializedDocument).not.toContain("learnerContext");
    expect(serializedDocument).not.toContain("weakSkillIds");
    expect(serializedDocument).not.toContain("learner-private-id");
    expect(serializedDocument).not.toContain("masteryBand");
  });

  it("rejects malformed candidates before opening a Firestore transaction", async () => {
    const blueprint = await makeBlueprint();
    const invalid = { ...blueprint, objective: "A violent game." };
    expect(validateGameBlueprint(invalid).valid).toBe(false);

    await expect(persistServerValidatedBlueprint(invalid)).resolves.toBe(false);
    expect(persistenceMocks.getFirestore).not.toHaveBeenCalled();
    expect(persistenceMocks.runTransaction).not.toHaveBeenCalled();
    expect(persistenceMocks.documents.size).toBe(0);
  });

  it("keeps an existing fingerprint's server-approved content immutable", async () => {
    const original = await makeBlueprint();
    await expect(persistServerValidatedBlueprint(original)).resolves.toBe(true);
    const originalDocument = storedDocumentFor(original);

    const equivalent: Extract<GameBlueprint, { gameType: "speed-math" }> = {
      ...original,
      objective: "Build multiplication confidence one fact at a time.",
      theme: "ocean",
      content: {
        rounds: [...original.content.rounds].reverse().map((round) => ({
          ...round,
          id: `equivalent-${round.id}`,
          choices: [...round.choices].reverse(),
        })),
      },
    };
    expect(validateGameBlueprint(equivalent).valid).toBe(true);
    expect(equivalent.metadata.fingerprint).toBe(original.metadata.fingerprint);

    await expect(persistServerValidatedBlueprint(equivalent)).resolves.toBe(true);
    expect(storedDocumentFor(original)).toEqual(originalDocument);
    expect(persistenceMocks.runTransaction).toHaveBeenCalledTimes(2);
  });
});
