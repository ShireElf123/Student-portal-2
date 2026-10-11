import { describe, expect, it } from "vitest";
import { ContentGenerationRateLimiter } from "../contentRateLimit";

describe("ContentGenerationRateLimiter", () => {
  it("limits a client per minute without blocking another client", () => {
    let now = Date.UTC(2026, 9, 5, 12, 0, 0);
    const limiter = new ContentGenerationRateLimiter(2, 10, () => now);
    expect(limiter.consume("learner-network-A").allowed).toBe(true);
    expect(limiter.consume("learner-network-A").allowed).toBe(true);
    expect(limiter.consume("learner-network-A")).toMatchObject({ allowed: false, reason: "minute-limit" });
    expect(limiter.consume("learner-network-B").allowed).toBe(true);
    now += 60_000;
    expect(limiter.consume("learner-network-A").allowed).toBe(true);
  });

  it("does not evict active quota buckets when tracker capacity is reached", () => {
    let now = Date.UTC(2026, 9, 5, 12, 0, 0);
    const limiter = new ContentGenerationRateLimiter(1, 10, () => now, 2);
    expect(limiter.consume("account-a").allowed).toBe(true);
    expect(limiter.consume("account-b").allowed).toBe(true);

    expect(limiter.consume("account-c")).toMatchObject({ allowed: false, reason: "capacity-limit" });
    expect(limiter.consume("account-a")).toMatchObject({ allowed: false, reason: "minute-limit" });

    now = Date.UTC(2026, 9, 6, 12, 0, 0);
    expect(limiter.consume("account-c").allowed).toBe(true);
  });

  it("caps daily generation and resets at the next UTC day", () => {
    let now = Date.UTC(2026, 9, 5, 23, 59, 0);
    const limiter = new ContentGenerationRateLimiter(10, 2, () => now);
    expect(limiter.consume("shared-egress").allowed).toBe(true);
    expect(limiter.consume("shared-egress").allowed).toBe(true);
    const blocked = limiter.consume("shared-egress");
    expect(blocked).toMatchObject({ allowed: false, reason: "daily-limit" });
    expect(blocked.retryAfterSeconds).toBe(60);
    now += 2 * 60_000;
    expect(limiter.consume("shared-egress").allowed).toBe(true);
  });
});
