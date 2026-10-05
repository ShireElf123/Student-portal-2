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
      return { allowed: false, retryAfterSeconds: 0, reason: "daily-limit" };
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
