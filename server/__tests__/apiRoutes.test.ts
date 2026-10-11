/**
 * Integration tests for the HTTP API contract.
 *
 * These boot the real Express app (createApiApp from server.ts) with the
 * Gemini provider replaced by a deterministic mock, so routes, body budgets,
 * auth tiers, rate limiting, and the SSE protocol are exercised for real.
 *
 * What they CANNOT verify: live Gemini model calls and real Firebase token
 * verification — those require credentials this environment does not have.
 */
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

// Deterministic stand-in for the Gemini provider (hoisted above imports).
vi.mock("../providers/gemini", () => {
  class GeminiProvider {
    name = "gemini";
    async chat(options: { message: string; previousInteractionId?: string }) {
      return {
        text: `echo:${options.message}:prev=${options.previousInteractionId ?? "none"}`,
        interactionId: "int-chat-1",
      };
    }
    async chatStream(
      options: { message: string; previousInteractionId?: string },
      onChunk: (chunk: string) => void
    ) {
      onChunk("stream-");
      onChunk(`chunk:${options.message}:prev=${options.previousInteractionId ?? "none"}`);
      return { interactionId: "int-stream-1" };
    }
    async generateJSON<T>(): Promise<T> {
      return [] as unknown as T;
    }
  }
  return {
    GeminiProvider,
    SYSTEM_INSTRUCTIONS: { general: "test" },
    RESILIENT_MODELS: ["test-model"],
    STRUCTURED_CONTENT_MODELS: ["test-model"],
    extractAndParseJSON: <T>(raw: string): T => JSON.parse(raw) as T,
  };
});

import type { Server } from "http";
import { createApiApp, DEFAULT_RATE_BUDGETS, type ApiAppOptions } from "../../server";
import { TieredRateLimiter } from "../tieredRateLimit";

let server: Server;
let baseUrl = "";
const savedKey = process.env.GEMINI_API_KEY;

/** App with generous anonymous budgets so functional tests never trip limits. */
async function startApp(limiters?: ApiAppOptions["limiters"]) {
  const app = await createApiApp({
    withVite: false,
    limiters:
      limiters ??
      ({
        chat: new TieredRateLimiter(
          { maxPerMinute: 1000, maxPerDay: 1000 },
          { maxPerMinute: 1000, maxPerDay: 1000 }
        ),
        practice: new TieredRateLimiter(
          { maxPerMinute: 1000, maxPerDay: 1000 },
          { maxPerMinute: 1000, maxPerDay: 1000 }
        ),
        studyPlan: new TieredRateLimiter(
          { maxPerMinute: 1000, maxPerDay: 1000 },
          { maxPerMinute: 1000, maxPerDay: 1000 }
        ),
      } satisfies NonNullable<ApiAppOptions["limiters"]>),
  });
  return new Promise<Server>((resolve) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });
}

beforeAll(async () => {
  process.env.GEMINI_API_KEY = "test-key-not-real";
  server = await startApp();
  const address = server.address();
  if (address && typeof address === "object") {
    baseUrl = `http://127.0.0.1:${address.port}`;
  }
});

afterAll(async () => {
  if (savedKey === undefined) delete process.env.GEMINI_API_KEY;
  else process.env.GEMINI_API_KEY = savedKey;
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

describe("route contract (regression: /api/study-stream & /api/study mismatch)", () => {
  it("serves /api/health", async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
  });

  it("the legacy wrong URLs are not registered", async () => {
    const stream = await fetch(`${baseUrl}/api/study-stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "x" }),
    });
    const plain = await fetch(`${baseUrl}/api/study`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "x" }),
    });
    expect(stream.status).toBe(404);
    expect(plain.status).toBe(404);
  });

  it("registers the endpoints the frontend now calls", async () => {
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "ping" }),
    });
    expect(res.status).toBe(200);
  });
});

describe("text chat against the real registered routes", () => {
  it("POST /api/chat returns { text, interactionId } and maps previousInteractionId", async () => {
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "help with fractions", previousInteractionId: "prev-9", mode: "socratic" }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    // The mock echoes the mapped field back — proves the handler reads `previousInteractionId`.
    expect(data.text).toBe("echo:help with fractions:prev=prev-9");
    expect(data.interactionId).toBe("int-chat-1");
  });

  it("rejects an empty chat request with a friendly 400", async () => {
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "   " }),
    });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBeTruthy();
  });

  it("fails closed when the Gemini key is missing", async () => {
    delete process.env.GEMINI_API_KEY;
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "hello" }),
    });
    process.env.GEMINI_API_KEY = "test-key-not-real";
    expect(res.status).toBe(500);
    expect((await res.json()).error).toMatch(/GEMINI_API_KEY/);
  });
});

describe("streaming chat (SSE protocol)", () => {
  it("POST /api/chat/stream emits chunk events, then done with an interactionId", async () => {
    const res = await fetch(`${baseUrl}/api/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "photosynthesis", previousInteractionId: "prev-1" }),
    });
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toMatch(/text\/event-stream/);

    const raw = await res.text();
    const events = raw
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("data:"))
      .map((line) => JSON.parse(line.replace(/^data:\s*/, "")));

    const chunks = events.filter((e) => e.type === "chunk");
    const done = events.find((e) => e.type === "done");
    expect(chunks.length).toBeGreaterThanOrEqual(2);
    expect(chunks.map((c) => c.text).join("")).toBe("stream-chunk:photosynthesis:prev=prev-1");
    expect(done).toBeDefined();
    expect(done.interactionId).toBe("int-stream-1");
  });
});

describe("homework image uploads (body budgets)", () => {
  it("accepts a realistic compressed homework photo (~1.5 MB of base64)", async () => {
    const base64 = "A".repeat(1_500_000);
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "solve this",
        attachment: { mimeType: "image/jpeg", data: base64 },
      }),
    });
    expect(res.status).toBe(200);
  });

  it("rejects an oversized (> 2 MB) chat body with 413", async () => {
    const base64 = "A".repeat(3_000_000);
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "solve this",
        attachment: { mimeType: "image/jpeg", data: base64 },
      }),
    });
    expect(res.status).toBe(413);
  });

  it("keeps the strict 100 KB budget on non-chat routes", async () => {
    const res = await fetch(`${baseUrl}/api/practice/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject: "x".repeat(150_000), topic: "t", difficulty: "easy", count: 3 }),
    });
    expect(res.status).toBe(413);
  });
});

describe("authentication behaviour", () => {
  it("signed-out guests can still chat (no Authorization header required)", async () => {
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "guest question" }),
    });
    expect(res.status).toBe(200);
  });

  it("an invalid Bearer token is not rejected (falls to the guest tier)", async () => {
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer not-a-real-token" },
      body: JSON.stringify({ message: "bad token" }),
    });
    expect(res.status).not.toBe(401);
    expect(res.status).toBe(200);
  });

  it("/api/content/generate still requires sign-in (hard auth regression check)", async () => {
    const res = await fetch(`${baseUrl}/api/content/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request: {} }),
    });
    expect(res.status).toBe(401);
  });
});

describe("rate limiting on the real routes", () => {
  it("anonymous study-plan traffic is bounded (default budget: 2/min) and returns 429 + Retry-After", async () => {
    // Separate app instance => fresh default limiters, isolated budget state.
    const tightServer = await startApp({
      chat: new TieredRateLimiter(
        { maxPerMinute: 1000, maxPerDay: 1000 },
        { maxPerMinute: 1000, maxPerDay: 1000 }
      ),
      practice: new TieredRateLimiter(
        { maxPerMinute: 1000, maxPerDay: 1000 },
        { maxPerMinute: 1000, maxPerDay: 1000 }
      ),
      studyPlan: new TieredRateLimiter(
        DEFAULT_RATE_BUDGETS.studyPlan.authenticated,
        DEFAULT_RATE_BUDGETS.studyPlan.anonymous
      ),
    });
    try {
      const address = tightServer.address();
      const tightUrl = address && typeof address === "object" ? `http://127.0.0.1:${address.port}` : "";
      const call = () =>
        fetch(`${tightUrl}/api/study-plan/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subjects: ["Mathematics"] }),
        });
      expect((await call()).status).toBe(200);
      expect((await call()).status).toBe(200);
      const blocked = await call();
      expect(blocked.status).toBe(429);
      expect(blocked.headers.get("retry-after")).toBeTruthy();
      expect((await blocked.json()).error).toMatch(/too fast|usage limit/i);
    } finally {
      await new Promise<void>((resolve) => tightServer.close(() => resolve()));
    }
  });
});
