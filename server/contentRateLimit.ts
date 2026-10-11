import { CONTENT_GENERATION_LIMITS } from "../src/contentEngine/policy";

interface UsageBucket {
  minuteStartedAt: number;
  minuteCount: number;
  date: string;
  dailyCount: number;
}

export interface ContentRateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
  reason?: "minute-limit" | "daily-limit" | "capacity-limit";
}

/**
 * Bounded in-process fixed-window limiter used as a supplemental network-abuse guard
 * (and by isolated tests). State resets on restart and is not shared across server instances;
 * it is never authoritative for account or organization entitlements. The shared AI gateway
 * persists those quotas transactionally in Firestore. `clientKey` should be a server-derived
 * network address for production network limiting, not a client-supplied account claim.
 */
export const MAX_TRACKED_CONTENT_RATE_LIMIT_CLIENTS = 10_000;

export class ContentGenerationRateLimiter {
  private readonly buckets = new Map<string, UsageBucket>();
  private prunedThroughDate = "";

  constructor(
    private readonly maxPerMinute: number = CONTENT_GENERATION_LIMITS.maxPerMinute,
    private readonly maxPerDay: number = CONTENT_GENERATION_LIMITS.maxPerDay,
    private readonly now: () => number = Date.now,
    private readonly maxTrackedClients = MAX_TRACKED_CONTENT_RATE_LIMIT_CLIENTS
  ) {}

  consume(clientKey: string): ContentRateLimitResult {
    const key = (clientKey.trim() || "anonymous").slice(0, 256);
    const now = this.now();
    const date = new Date(now).toISOString().slice(0, 10);
    if (this.prunedThroughDate !== date) {
      for (const [bucketKey, value] of this.buckets) {
        if (value.date !== date) this.buckets.delete(bucketKey);
      }
      this.prunedThroughDate = date;
    }

    let bucket = this.buckets.get(key);
    if (!bucket && this.buckets.size >= this.maxTrackedClients) {
      const startOfTodayUtc = Date.UTC(
        new Date(now).getUTCFullYear(),
        new Date(now).getUTCMonth(),
        new Date(now).getUTCDate()
      );
      const nextUtcDay = startOfTodayUtc + 24 * 60 * 60 * 1000;
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil((nextUtcDay - now) / 1000)),
        reason: "capacity-limit",
      };
    }
    if (!bucket) {
      bucket = { minuteStartedAt: now, minuteCount: 0, date, dailyCount: 0 };
    }
    if (bucket.date !== date) {
      bucket.date = date;
      bucket.dailyCount = 0;
    }
    if (now < bucket.minuteStartedAt || now - bucket.minuteStartedAt >= 60_000) {
      bucket.minuteStartedAt = now;
      bucket.minuteCount = 0;
    }

    if (bucket.dailyCount >= this.maxPerDay) {
      this.buckets.set(key, bucket);
      const startOfTodayUtc = Date.UTC(
        new Date(now).getUTCFullYear(),
        new Date(now).getUTCMonth(),
        new Date(now).getUTCDate()
      );
      const nextUtcDay = startOfTodayUtc + 24 * 60 * 60 * 1000;
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil((nextUtcDay - now) / 1000)),
        reason: "daily-limit",
      };
    }
    if (bucket.minuteCount >= this.maxPerMinute) {
      this.buckets.set(key, bucket);
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil((60_000 - (now - bucket.minuteStartedAt)) / 1000)),
        reason: "minute-limit",
      };
    }

    bucket.minuteCount += 1;
    bucket.dailyCount += 1;
    this.buckets.set(key, bucket);
    return { allowed: true, retryAfterSeconds: 0 };
  }
}
