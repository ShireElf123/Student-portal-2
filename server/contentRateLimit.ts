interface UsageBucket {
  minuteStartedAt: number;
  minuteCount: number;
  date: string;
  dailyCount: number;
}

export interface ContentRateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
  reason?: "minute-limit" | "daily-limit";
}

/**
 * Per-client fixed-window limiter for AI generation.
 *
 * State is in-memory and per-process by design for this single-node app: it resets on
 * restart and is not shared across instances or serverless workers. Before scaling
 * horizontally, back it with a shared store (Redis/Firestore) or the daily cap stops
 * bounding cost. `clientKey` should be the verified account ID where available
 * (see server/contentAuth.ts), falling back to a network address for anonymous callers.
 */
export class ContentGenerationRateLimiter {
  private readonly buckets = new Map<string, UsageBucket>();

  constructor(
    private readonly maxPerMinute = 3,
    private readonly maxPerDay = 12,
    private readonly now: () => number = Date.now
  ) {}

  consume(clientKey: string): ContentRateLimitResult {
    const key = clientKey.trim() || "anonymous";
    const now = this.now();
    const date = new Date(now).toISOString().slice(0, 10);
    let bucket = this.buckets.get(key);
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
    if (this.buckets.size > 2000) {
      for (const [bucketKey, value] of this.buckets) {
        if (value.date !== date) this.buckets.delete(bucketKey);
      }
      while (this.buckets.size > 2000) {
        const oldestKey = this.buckets.keys().next().value;
        if (!oldestKey) break;
        this.buckets.delete(oldestKey);
      }
    }
    return { allowed: true, retryAfterSeconds: 0 };
  }
}
