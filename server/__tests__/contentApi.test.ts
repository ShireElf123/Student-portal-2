import express from "express";
import type { Server } from "node:http";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContentGenerationCoordinator, createContentGenerationRouter } from "../contentApi";
import { ContentGenerationRateLimiter } from "../contentRateLimit";
import type { StructuredContentProvider } from "../../src/contentEngine/generation";
import type { ContentGenerationRequest, SpeedMathPayload } from "../../src/contentEngine/types";

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
  limiter: ContentGenerationRateLimiter,
  ipLimiter?: ContentGenerationRateLimiter
): Promise<TestServer> {
  const app = express();
  app.use(express.json());
  app.use(createContentGenerationRouter({
    verifier: {
      verify: async (token) => token.startsWith("token-") ? { uid: token.slice("token-".length) } : null,
    },
    limiter,
    ...(ipLimiter ? { ipLimiter } : {}),
    coordinator: new ContentGenerationCoordinator(),
    provider,
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

async function postContent(baseUrl: string, body: unknown, token?: string): Promise<Response> {
  return fetch(`${baseUrl}/api/content/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
