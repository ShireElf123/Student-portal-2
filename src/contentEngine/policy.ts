/** Server-side generation admission limits; browser-side counters are not security controls. */
export const CONTENT_GENERATION_LIMITS = {
  maxPerMinute: 3,
  maxPerDay: 12,
  maxPerIpMinute: 10,
  maxPerIpDay: 60,
} as const;

/**
 * Pool policy is intentionally small: one available item keeps an experience usable,
 * three is the target pool, and one refill generates at most the two-item shortfall.
 * Provider retries remain independently bounded by the content generator.
 */
export const CONTENT_POOL_REFILL_THRESHOLD = 3;

export const CONTENT_POOL_POLICY = {
  minimumAvailable: 1,
  targetPoolSize: CONTENT_POOL_REFILL_THRESHOLD,
  maxGenerationBatch: 2,
  refillCooldownMs: Math.ceil(60_000 / CONTENT_GENERATION_LIMITS.maxPerMinute),
  reservationLeaseMs: 15 * 60_000,
  contentLifetimeMs: 180 * 24 * 60 * 60_000,
} as const;
