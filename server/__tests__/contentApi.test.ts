import express from "express";
import type { Server } from "node:http";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContentGenerationCoordinator, createContentGenerationRouter } from "../contentApi";
import { createAiGateway } from "../aiGateway";
import { ContentGenerationRateLimiter } from "../contentRateLimit";
import type { AiQuotaStore } from "../aiQuota";
import type { StructuredContentProvider } from "../../src/contentEngine/generation";
import type { ContentGenerationRequest, GameBlueprint, SpeedMathPayload } from "../../src/contentEngine/types";

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

function request(theme: ContentGenerationRequest["theme"] = "space"): ContentGenerationRequest {
  return {
    gameType: "speed-math",
    skillId: "math-23-multiplication",
    gradeBand: "2-3",
    difficulty: "easy",
    theme,
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

interface TestServer {
  baseUrl: string;
  close: () => Promise<void>;
}

async function startTestServer(
  provider: StructuredContentProvider,
  accountQuotaBoundary: ContentGenerationRateLimiter,
  networkLimiter?: ContentGenerationRateLimiter,
  persistBlueprint?: (blueprint: GameBlueprint) => Promise<boolean>
): Promise<TestServer> {
  const app = express();
  app.use(express.json());
  const quotaStore: AiQuotaStore = {
    async consume(request) {
      const result = accountQuotaBoundary.consume(request.uid);
      if (!result.allowed) {
        return {
          allowed: false,
          status: 429,
          code: "TEST_ACCOUNT_QUOTA_EXCEEDED",
          error: "This account has reached its test quota.",
          retryAfterSeconds: result.retryAfterSeconds,
        };
      }
      return {
        allowed: true,
        organizationId: null,
        scope: "user",
        dailyLimitUnits: 20,
        remainingDailyUnits: 19,
        resetAt: request.now + 60_000,
      };
    },
  };
  const gateway = createAiGateway({
    verifier: {
      verify: async (token) => token.startsWith("token-") ? { uid: token.slice("token-".length) } : null,
    },
    quotaStore,
    ...(networkLimiter ? { networkLimiter } : {}),
  });
  app.use(createContentGenerationRouter({
    gateway,
    coordinator: new ContentGenerationCoordinator(),
    provider,
    persistBlueprint: persistBlueprint ?? (async () => false),
    apiKeyAvailable: () => true,
  }));
  const server: Server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Test server did not bind to a TCP port.");
  return {
    baseUrl: `http://127.0.0.1:${address.port}`,
    close: () => new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())),
  };
}

async function postContent(baseUrl: string, body: unknown, token?: string, organizationId?: string): Promise<Response> {
  return fetch(`${baseUrl}/api/content/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(organizationId !== undefined ? { "X-Organization-Id": organizationId } : {}),
    },
    body: JSON.stringify(body),
  });
}

describe("authenticated content-generation API", () => {
  const servers: TestServer[] = [];

  afterEach(async () => {
    await Promise.all(servers.splice(0).map((server) => server.close()));
    vi.clearAllMocks();
  });

  it("rejects anonymous and malformed requests before consuming the verified account's quota", async () => {
    const provider: StructuredContentProvider = {
      name: "content-api-gemini-boundary",
      generateStructuredContent: vi.fn(async () => JSON.stringify(SPEED_PAYLOAD)),
    };
    const server = await startTestServer(provider, new ContentGenerationRateLimiter(1, 12));
    servers.push(server);

    const anonymous = await postContent(server.baseUrl, { request: request(), excludedFingerprints: [] });
    expect(anonymous.status).toBe(401);
    expect(provider.generateStructuredContent).not.toHaveBeenCalled();

    const malformed = await postContent(server.baseUrl, { request: { gameType: "speed-math" }, excludedFingerprints: [] }, "token-account-a");
    expect(malformed.status).toBe(400);
    expect(provider.generateStructuredContent).not.toHaveBeenCalled();

    const admitted = await postContent(server.baseUrl, { request: request(), excludedFingerprints: [] }, "token-account-a");
    expect(admitted.status).toBe(200);
    expect(admitted.headers.get("X-Content-Generation-Admitted")).toBe("true");
    expect(provider.generateStructuredContent).toHaveBeenCalledTimes(1);

    const rateLimited = await postContent(server.baseUrl, { request: request("ocean"), excludedFingerprints: [] }, "token-account-a");
    expect(rateLimited.status).toBe(429);
    expect(rateLimited.headers.get("X-Content-Generation-Admitted")).toBeNull();
    expect(Number(rateLimited.headers.get("Retry-After"))).toBeGreaterThan(0);
    expect(provider.generateStructuredContent).toHaveBeenCalledTimes(1);
  });

  it("rejects unsupported game types, malformed exclusion fingerprints, and oversized bodies before quota admission", async () => {
    const provider: StructuredContentProvider = {
      name: "invalid-input-gemini-boundary",
      generateStructuredContent: vi.fn(async () => JSON.stringify(SPEED_PAYLOAD)),
    };
    const server = await startTestServer(provider, new ContentGenerationRateLimiter(1, 12));
    servers.push(server);

    const unsupported = await postContent(server.baseUrl, {
      request: { ...request(), gameType: "unsupported-game" },
      excludedFingerprints: [],
    }, "token-account-validation");
    expect(unsupported.status).toBe(400);

    const invalidExclusions = await postContent(server.baseUrl, {
      request: request(),
      excludedFingerprints: ["not-a-valid-fingerprint"],
    }, "token-account-validation");
    expect(invalidExclusions.status).toBe(400);

    const oversized = await postContent(server.baseUrl, {
      request: request(),
      excludedFingerprints: [],
      extra: "x".repeat(32_000),
    }, "token-account-validation");
    expect(oversized.status).toBe(413);
    expect(provider.generateStructuredContent).not.toHaveBeenCalled();

    const valid = await postContent(server.baseUrl, {
      request: request(),
      excludedFingerprints: [],
    }, "token-account-validation");
    expect(valid.status).toBe(200);
    expect(provider.generateStructuredContent).toHaveBeenCalledTimes(1);
  });

  it("applies a network cap across different authenticated accounts", async () => {
    const provider: StructuredContentProvider = {
      name: "network-limit-gemini-boundary",
      generateStructuredContent: vi.fn(async () => JSON.stringify(SPEED_PAYLOAD)),
    };
    const server = await startTestServer(
      provider,
      new ContentGenerationRateLimiter(3, 12),
      new ContentGenerationRateLimiter(1, 12)
    );
    servers.push(server);

    const first = await postContent(server.baseUrl, { request: request(), excludedFingerprints: [] }, "token-account-a");
    const second = await postContent(server.baseUrl, { request: request("ocean"), excludedFingerprints: [] }, "token-account-b");

    expect(first.status).toBe(200);
    expect(second.status).toBe(429);
    expect((await second.json() as { error: string }).error).toContain("network");
    expect(provider.generateStructuredContent).toHaveBeenCalledTimes(1);
  });

  it("persists only deterministically validated server output and reports persistence failure without losing the candidate", async () => {
    const provider: StructuredContentProvider = {
      name: "server-persistence-gemini-boundary",
      generateStructuredContent: vi.fn(async () => JSON.stringify(SPEED_PAYLOAD)),
    };
    const persistBlueprint = vi.fn(async (_blueprint: GameBlueprint) => false);
    const server = await startTestServer(
      provider,
      new ContentGenerationRateLimiter(2, 12),
      undefined,
      persistBlueprint
    );
    servers.push(server);

    const response = await postContent(server.baseUrl, { request: request(), excludedFingerprints: [] }, "token-persistence-test");
    expect(response.status).toBe(200);
    expect(persistBlueprint).toHaveBeenCalledTimes(1);
    const body = await response.json() as { blueprint: GameBlueprint; sharedPersisted: boolean };
    expect(body.sharedPersisted).toBe(false);
    expect(body.blueprint.metadata.validationStatus).toBe("valid");
    expect(JSON.stringify(body.blueprint)).not.toContain("token-persistence-test");
    expect(JSON.stringify(body.blueprint)).not.toContain("learnerContext");

    const invalidPayload: SpeedMathPayload = {
      ...SPEED_PAYLOAD,
      rounds: SPEED_PAYLOAD.rounds.map((round, index) => index === 0 ? { ...round, answer: round.answer + 1 } : round),
    };
    const invalidProvider: StructuredContentProvider = {
      name: "invalid-server-persistence-gemini-boundary",
      generateStructuredContent: vi.fn(async () => JSON.stringify(invalidPayload)),
    };
    const invalidPersist = vi.fn(async (_blueprint: GameBlueprint) => true);
    const invalidServer = await startTestServer(
      invalidProvider,
      new ContentGenerationRateLimiter(2, 12),
      undefined,
      invalidPersist
    );
    servers.push(invalidServer);

    const rejected = await postContent(invalidServer.baseUrl, { request: request(), excludedFingerprints: [] }, "token-invalid-persistence");
    expect(rejected.status).toBe(502);
    expect(invalidPersist).not.toHaveBeenCalled();
  });

  it("does not coalesce an omitted organization selection with an explicit organization ID", async () => {
    const provider: StructuredContentProvider = {
      name: "organization-selection-gemini-boundary",
      generateStructuredContent: vi.fn(async () => {
        await new Promise((resolve) => setTimeout(resolve, 25));
        return JSON.stringify(SPEED_PAYLOAD);
      }),
    };
    const server = await startTestServer(provider, new ContentGenerationRateLimiter(2, 12));
    servers.push(server);
    const body = { request: request(), excludedFingerprints: [] };

    const [personalRequest, selectedOrganizationRequest] = await Promise.all([
      postContent(server.baseUrl, body, "token-selection-test"),
      postContent(server.baseUrl, body, "token-selection-test", "automatic"),
    ]);

    expect(personalRequest.status).toBe(200);
    expect(selectedOrganizationRequest.status).toBe(200);
    expect(provider.generateStructuredContent).toHaveBeenCalledTimes(2);
  });

  it("keeps identical in-flight requests isolated between different authenticated learners", async () => {
    const provider: StructuredContentProvider = {
      name: "learner-isolation-gemini-boundary",
      generateStructuredContent: vi.fn(async () => {
        await new Promise((resolve) => setTimeout(resolve, 25));
        return JSON.stringify(SPEED_PAYLOAD);
      }),
    };
    const server = await startTestServer(provider, new ContentGenerationRateLimiter(1, 12));
    servers.push(server);
    const body = { request: request(), excludedFingerprints: [] };

    const [learnerA, learnerB] = await Promise.all([
      postContent(server.baseUrl, body, "token-learner-a"),
      postContent(server.baseUrl, body, "token-learner-b"),
    ]);

    expect(learnerA.status).toBe(200);
    expect(learnerB.status).toBe(200);
    expect(learnerA.headers.get("X-Content-Generation-Admitted")).toBe("true");
    expect(learnerB.headers.get("X-Content-Generation-Admitted")).toBe("true");
    expect(provider.generateStructuredContent).toHaveBeenCalledTimes(2);
  });

  it("coalesces concurrent equivalent requests so they spend one server admission and one provider generation", async () => {
    const provider: StructuredContentProvider = {
      name: "singleflight-gemini-boundary",
      generateStructuredContent: vi.fn(async () => {
        await new Promise((resolve) => setTimeout(resolve, 25));
        return JSON.stringify(SPEED_PAYLOAD);
      }),
    };
    const server = await startTestServer(provider, new ContentGenerationRateLimiter(1, 12));
    servers.push(server);
    const body = { request: request(), excludedFingerprints: [] };

    const [first, second] = await Promise.all([
      postContent(server.baseUrl, body, "token-account-concurrent"),
      postContent(server.baseUrl, body, "token-account-concurrent"),
    ]);

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect([first.headers.get("X-Content-Generation-Admitted"), second.headers.get("X-Content-Generation-Admitted")])
      .toContain("true");
    expect([first.headers.get("X-Content-Generation-Admitted"), second.headers.get("X-Content-Generation-Admitted")])
      .toContain(null);
    expect(provider.generateStructuredContent).toHaveBeenCalledTimes(1);
    const firstBody = await first.json() as { blueprint: { id: string } };
    const secondBody = await second.json() as { blueprint: { id: string } };
    expect(firstBody.blueprint.id).toBe(secondBody.blueprint.id);
  });
});
