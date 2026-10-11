import { describe, expect, it } from "vitest";
import type { Request, Response } from "express";
import { TieredRateLimiter, createTieredRateLimitMiddleware } from "../tieredRateLimit";

/** Build a minimal fake Request carrying a fake Response (for res.locals). */
function fakeRequest(options: { uid?: string; ip?: string } = {}): Request {
  const res = { locals: {} } as unknown as Response;
  if (options.uid) {
    (res.locals as Record<string, unknown>).contentIdentity = { uid: options.uid };
  }
  const req = { ip: options.ip ?? "10.0.0.1", res, socket: { remoteAddress: options.ip ?? "10.0.0.1" } } as unknown as Request;
  return req;
}

interface FakeResponse {
  statusCode: number | undefined;
  body: unknown;
  headersSet: Record<string, string>;
  setHeader(name: string, value: string): FakeResponse;
  status(code: number): FakeResponse;
  json(payload: unknown): FakeResponse;
}

function fakeResponse(): FakeResponse {
  const res: FakeResponse = {
    statusCode: undefined,
    body: undefined,
    headersSet: {},
    setHeader(name, value) {
      this.headersSet[name] = value;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
  return res;
}

describe("TieredRateLimiter", () => {
  it("applies the anonymous budget to callers without a verified identity", () => {
    const limiter = new TieredRateLimiter(
      { maxPerMinute: 100, maxPerDay: 100 },
      { maxPerMinute: 2, maxPerDay: 3 }
    );
    const req = fakeRequest({ ip: "203.0.113.7" });
    expect(limiter.consume(req).allowed).toBe(true);
    expect(limiter.consume(req).allowed).toBe(true);
    const third = limiter.consume(req);
    expect(third.allowed).toBe(false);
    expect(third.reason).toBe("minute-limit");
    expect(third.tier).toBe("anonymous");
  });

  it("applies the authenticated budget to verified identities and keys them separately from IPs", () => {
    const limiter = new TieredRateLimiter(
      { maxPerMinute: 2, maxPerDay: 100 },
      { maxPerMinute: 0, maxPerDay: 0 }
    );
    const signedIn = fakeRequest({ uid: "learner-1", ip: "203.0.113.7" });
    expect(limiter.consume(signedIn).allowed).toBe(true);
    expect(limiter.consume(signedIn).allowed).toBe(true);
    expect(limiter.consume(signedIn).allowed).toBe(false);

    // Same IP, no verified identity -> anonymous tier (budget 0), not the uid budget.
    const sameIpAnonymous = fakeRequest({ ip: "203.0.113.7" });
    const result = limiter.consume(sameIpAnonymous);
    expect(result.allowed).toBe(false);
    expect(result.tier).toBe("anonymous");
  });

  it("enforces the daily budget for authenticated users even under the minute budget", () => {
    const limiter = new TieredRateLimiter(
      { maxPerMinute: 10, maxPerDay: 2 },
      { maxPerMinute: 10, maxPerDay: 10 }
    );
    const req = fakeRequest({ uid: "learner-2" });
    expect(limiter.consume(req).allowed).toBe(true);
    expect(limiter.consume(req).allowed).toBe(true);
    const blocked = limiter.consume(req);
    expect(blocked.allowed).toBe(false);
    expect(blocked.reason).toBe("daily-limit");
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("does not let one caller's identity or address consume another's budget", () => {
    const limiter = new TieredRateLimiter(
      { maxPerMinute: 1, maxPerDay: 10 },
      { maxPerMinute: 1, maxPerDay: 10 }
    );
    expect(limiter.consume(fakeRequest({ uid: "a" })).allowed).toBe(true);
    expect(limiter.consume(fakeRequest({ uid: "a" })).allowed).toBe(false);
    expect(limiter.consume(fakeRequest({ uid: "b" })).allowed).toBe(true);
    expect(limiter.consume(fakeRequest({ ip: "198.51.100.9" })).allowed).toBe(true);
    expect(limiter.consume(fakeRequest({ ip: "198.51.100.10" })).allowed).toBe(true);
  });

  it("never trusts client-supplied user identifiers (keys derive from verified locals only)", () => {
    const limiter = new TieredRateLimiter(
      { maxPerMinute: 5, maxPerDay: 5 },
      { maxPerMinute: 2, maxPerDay: 2 }
    );
    // A request object with no verified identity in res.locals stays anonymous
    // no matter what other properties a client might try to attach — it gets
    // the anonymous budget (2), never the authenticated one (5).
    const spoofed = fakeRequest({ ip: "203.0.113.50" });
    (spoofed as unknown as Record<string, unknown>).userId = "victim-uid";
    (spoofed as unknown as Record<string, unknown>).headers = { "x-user-id": "victim-uid" };
    const first = limiter.consume(spoofed);
    expect(first.tier).toBe("anonymous");
    expect(first.allowed).toBe(true);
    expect(limiter.consume(spoofed).allowed).toBe(true);
    expect(limiter.consume(spoofed).allowed).toBe(false);
  });
});

describe("createTieredRateLimitMiddleware", () => {
  it("passes allowed requests through and answers 429 + Retry-After when the budget is exhausted", () => {
    const limiter = new TieredRateLimiter(
      { maxPerMinute: 10, maxPerDay: 10 },
      { maxPerMinute: 1, maxPerDay: 10 }
    );
    const middleware = createTieredRateLimitMiddleware(limiter);
    const next = (() => {}) as unknown as () => void;

    const okReq = fakeRequest({ ip: "192.0.2.1" });
    const okRes = fakeResponse();
    middleware(okReq, okRes as unknown as Response, next);
    expect(okRes.statusCode).toBeUndefined();

    const blockedReq = fakeRequest({ ip: "192.0.2.1" });
    const blockedRes = fakeResponse();
    middleware(blockedReq, blockedRes as unknown as Response, next);
    expect(blockedRes.statusCode).toBe(429);
    expect(blockedRes.headersSet["Retry-After"]).toBeDefined();
    expect((blockedRes.body as { error: string }).error).toMatch(/too fast|usage limit/i);
  });
});
