import type { NextFunction, Request, RequestHandler, Response } from "express";
import { ContentGenerationRateLimiter, ContentRateLimitResult } from "./contentRateLimit";
import { getContentIdentity } from "./contentAuth";

export interface TierBudget {
  readonly maxPerMinute: number;
  readonly maxPerDay: number;
}

/**
 * Two-tier abuse control for AI routes that intentionally support guests.
 *
 * - Signed-in callers (identity verified by server/contentAuth.ts and stored
 *   in res.locals by the optional-identity middleware) are keyed `uid:<uid>`
 *   and receive the generous authenticated budget.
 * - Everyone else is keyed by the request's network address (`ip:<addr>`).
 *   The key is derived server-side only; client-supplied user identifiers are
 *   never trusted, so an anonymous caller cannot claim someone else's budget
 *   or fabricate an unlimited one.
 *
 * Same in-memory caveat as ContentGenerationRateLimiter: per-process state.
 */
export class TieredRateLimiter {
  private readonly authenticated: ContentGenerationRateLimiter;
  private readonly anonymous: ContentGenerationRateLimiter;

  constructor(
    authenticatedBudget: TierBudget,
    anonymousBudget: TierBudget,
    now: () => number = Date.now
  ) {
    this.authenticated = new ContentGenerationRateLimiter(
      authenticatedBudget.maxPerMinute,
      authenticatedBudget.maxPerDay,
      now
    );
    this.anonymous = new ContentGenerationRateLimiter(
      anonymousBudget.maxPerMinute,
      anonymousBudget.maxPerDay,
      now
    );
  }

  consume(req: Request): ContentRateLimitResult & { tier: "authenticated" | "anonymous" } {
    const identity = getContentIdentityFromRequest(req);
    if (identity) {
      const result = this.authenticated.consume(`uid:${identity.uid}`);
      return { ...result, tier: "authenticated" };
    }
    const address = req.ip || req.socket.remoteAddress || "anonymous";
    const result = this.anonymous.consume(`ip:${address}`);
    return { ...result, tier: "anonymous" };
  }
}

function getContentIdentityFromRequest(req: Request): { uid: string } | null {
  const identity = req.res ? getContentIdentity(req.res) : null;
  return identity;
}

/**
 * Express middleware applying a TieredRateLimiter. The optional-identity
 * middleware must run first so verified callers get the authenticated tier.
 */
export function createTieredRateLimitMiddleware(limiter: TieredRateLimiter): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = limiter.consume(req);
    if (result.allowed) {
      next();
      return;
    }
    if (result.retryAfterSeconds > 0) {
      res.setHeader("Retry-After", String(result.retryAfterSeconds));
    }
    const message =
      result.reason === "daily-limit"
        ? "You have reached today's AI usage limit. Try again tomorrow, or use your saved notes and activities meanwhile."
        : "You are sending requests a little too fast. Please wait a moment before asking again.";
    res.status(429).json({ error: message });
  };
}
