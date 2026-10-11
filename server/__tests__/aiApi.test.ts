import express from "express";
import type { Server } from "node:http";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { AIProvider } from "../types";
import { createAiApiRouter } from "../aiApi";
import { createAiGateway } from "../aiGateway";
import type { AiQuotaDecision, AiQuotaRequest, AiQuotaStore } from "../aiQuota";

const VALID_QUESTIONS = [
  {
    question: "What is one plus one in basic arithmetic?",
    options: ["One", "Two", "Three", "Four"],
    correctAnswerIndex: 1,
    explanation: "One plus one equals two because it combines one unit with one more.",
    hint: "Count one item, then count one more.",
  },
  {
    question: "Which fraction is equal to one half?",
    options: ["One quarter", "Two quarters", "Three quarters", "Four quarters"],
    correctAnswerIndex: 1,
    explanation: "Two quarters simplify to one half when both parts are divided by two.",
    hint: "Look for a fraction whose top and bottom can both be divided by two.",
  },
  {
    question: "How many sides does a triangle have?",
    options: ["Two sides", "Three sides", "Four sides", "Five sides"],
    correctAnswerIndex: 1,
    explanation: "A triangle is a polygon with three straight sides and three corners.",
    hint: "The name of this shape hints at its number of sides.",
  },
];

const VALID_STUDY_TASKS = [
  { title: "Review key ideas", subject: "Mathematics", durationMinutes: 25, priority: "high", reason: "A short review strengthens recall." },
  { title: "Practise worked examples", subject: "Science", durationMinutes: 30, priority: "medium", reason: "Examples build confidence with the method." },
  { title: "Summarise the lesson", subject: "Humanities", durationMinutes: 20, priority: "low", reason: "A concise summary helps connect the main ideas." },
];

interface TestServer {
  baseUrl: string;
  close: () => Promise<void>;
}

interface TestHarness extends TestServer {
  provider: AIProvider;
  quotaRequests: AiQuotaRequest[];
  generatedJsonCalls: string[];
}

function makeProvider(generatedJsonCalls: string[]): AIProvider {
  return {
    name: "test-gemini-boundary",
    chat: vi.fn(async () => ({ text: "Let's work through the idea step by step.", interactionId: "interaction-1" })),
    chatStream: vi.fn(async (_options, onChunk) => {
      onChunk("A guided answer.");
      return { interactionId: "stream-interaction-1" };
    }),
    async generateJSON<T>(prompt: string): Promise<T> {
      generatedJsonCalls.push(prompt);
      const requestedCount = Number(/Generate exactly (\d+)/.exec(prompt)?.[1] ?? VALID_QUESTIONS.length);
      const output: unknown = prompt.includes("multiple-choice")
        ? VALID_QUESTIONS.slice(0, requestedCount)
        : VALID_STUDY_TASKS;
      return output as T;
    },
  };
}

async function startTestServer(quotaStoreOverride?: AiQuotaStore): Promise<TestHarness> {
  const app = express();
  app.use(express.json({ limit: "7mb" }));
  const generatedJsonCalls: string[] = [];
  const provider = makeProvider(generatedJsonCalls);
  const quotaRequests: AiQuotaRequest[] = [];
  const quotaStore: AiQuotaStore = quotaStoreOverride ?? {
    async consume(request) {
      quotaRequests.push(request);
      return {
        allowed: true,
        organizationId: request.organizationId ?? null,
        scope: request.organizationId ? "user+organization" : "user",
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
  });
  app.use(createAiApiRouter({ gateway, provider, apiKeyAvailable: () => true }));
  const server: Server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Test server did not bind to a TCP port.");
  return {
    baseUrl: `http://127.0.0.1:${address.port}`,
    close: () => new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())),
    provider,
    quotaRequests,
    generatedJsonCalls,
  };
}

async function post(baseUrl: string, path: string, body: unknown, token?: string, organizationId?: string): Promise<Response> {
  return fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(organizationId ? { "X-Organization-Id": organizationId } : {}),
    },
    body: JSON.stringify(body),
  });
}

describe("shared authenticated AI API routes", () => {
  const servers: TestServer[] = [];

  afterEach(async () => {
    await Promise.all(servers.splice(0).map((server) => server.close()));
    vi.clearAllMocks();
  });

  it("requires a verified Firebase ID token on chat, streaming chat, practice, and study-plan routes", async () => {
    const server = await startTestServer();
    servers.push(server);
    const requests: Array<[string, unknown]> = [
      ["/api/chat", { message: "Explain fractions." }],
      ["/api/chat/stream", { message: "Explain fractions." }],
      ["/api/practice/generate", { subject: "Math", topic: "Fractions", difficulty: "easy", count: 1 }],
      ["/api/study-plan/generate", { subjects: ["Math"] }],
    ];

    for (const [route, body] of requests) {
      const response = await post(server.baseUrl, route, body);
      expect(response.status, route).toBe(401);
    }
    expect(server.quotaRequests).toHaveLength(0);
    expect(server.provider.chat).not.toHaveBeenCalled();
    expect(server.provider.chatStream).not.toHaveBeenCalled();
    expect(server.generatedJsonCalls).toHaveLength(0);
  });

  it("aligns the UI contract with /api/chat/stream and rejects client-supplied entitlement fields", async () => {
    const server = await startTestServer();
    servers.push(server);

    const forgedClaim = await post(server.baseUrl, "/api/chat", {
      message: "Explain fractions.",
      organizationId: "forged-organization",
      subscriptionTier: "educator_plus",
    }, "token-learner-a");
    expect(forgedClaim.status).toBe(400);
    expect(server.quotaRequests).toHaveLength(0);

    const chat = await post(server.baseUrl, "/api/chat", {
      message: "Explain fractions.",
      mode: "socratic",
      previousInteractionId: "prior-interaction",
    }, "token-learner-a", "school-one");
    expect(chat.status).toBe(200);
    expect(chat.headers.get("X-AI-Quota-Scope")).toBe("user+organization");
    expect(server.quotaRequests).toHaveLength(1);
    expect(server.quotaRequests[0]).toMatchObject({ uid: "learner-a", organizationId: "school-one", feature: "chat", units: 1 });
    expect(server.provider.chat).toHaveBeenCalledWith({
      message: "Explain fractions.",
      mode: "socratic",
      previousInteractionId: "prior-interaction",
    });

    const stream = await post(server.baseUrl, "/api/chat/stream", {
      message: "Give me a hint.",
      mode: "socratic",
    }, "token-learner-a");
    expect(stream.status).toBe(200);
    expect(stream.headers.get("content-type")).toContain("text/event-stream");
    expect(await stream.text()).toContain('"type":"chunk"');
    expect(server.quotaRequests[1]).toMatchObject({ feature: "chat", units: 1 });
  });

  it("validates practice and study-plan input and approves only bounded provider output", async () => {
    const server = await startTestServer();
    servers.push(server);

    const invalidPractice = await post(server.baseUrl, "/api/practice/generate", {
      subject: "x".repeat(101), topic: "Fractions", difficulty: "easy", count: 5,
    }, "token-learner-b");
    expect(invalidPractice.status).toBe(400);
    expect(server.quotaRequests).toHaveLength(0);

    const practice = await post(server.baseUrl, "/api/practice/generate", {
      subject: "Mathematics", topic: "Fractions", difficulty: "medium", count: 3,
      organizationId: "forged-org", subscriptionTier: "educator_plus", quota: 1_000_000,
    }, "token-learner-b");
    expect(practice.status).toBe(200);
    const practiceBody = await practice.json() as { count: number; questions: Array<{ correctAnswerIndex: number }> };
    expect(practiceBody.count).toBe(3);
    expect(practiceBody.questions).toHaveLength(3);
    expect(practiceBody.questions[0].correctAnswerIndex).toBe(1);
    expect(server.quotaRequests[0]).toMatchObject({ feature: "practice", units: 1 });
    expect(server.quotaRequests[0].organizationId).toBeUndefined();

    const invalidStudyPlan = await post(server.baseUrl, "/api/study-plan/generate", {
      subjects: Array.from({ length: 9 }, () => "Math"),
    }, "token-learner-b");
    expect(invalidStudyPlan.status).toBe(400);

    const studyPlan = await post(server.baseUrl, "/api/study-plan/generate", {
      subjects: ["Mathematics", "Science"],
    }, "token-learner-b");
    expect(studyPlan.status).toBe(200);
    const studyBody = await studyPlan.json() as { tasks: Array<{ id: string; priority: string }> };
    expect(studyBody.tasks).toHaveLength(3);
    expect(studyBody.tasks[0].id).toBe("study-plan-1");
    expect(studyBody.tasks.every((task) => ["high", "medium", "low"].includes(task.priority))).toBe(true);
    expect(server.quotaRequests[1]).toMatchObject({ feature: "study_plan", units: 1 });
  });

  it("does not call the provider when the shared quota store denies admission", async () => {
    const deniedDecision: AiQuotaDecision = {
      allowed: false,
      status: 403,
      code: "ORGANIZATION_ACCESS_DENIED",
      error: "You do not have active access to the selected organization.",
      retryAfterSeconds: 0,
    };
    const quotaStore: AiQuotaStore = {
      consume: vi.fn(async (): Promise<AiQuotaDecision> => deniedDecision),
    };
    const server = await startTestServer(quotaStore);
    servers.push(server);

    const response = await post(server.baseUrl, "/api/chat", { message: "Help me study." }, "token-learner-c", "school-other");
    expect(response.status).toBe(403);
    expect(server.provider.chat).not.toHaveBeenCalled();
  });
});
