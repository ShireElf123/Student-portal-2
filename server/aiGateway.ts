import type { Request, RequestHandler, Response } from "express";
import { createContentAuthMiddleware, createFirebaseContentAuthVerifier, getContentIdentity } from "./contentAuth";
import type { ContentAuthVerifier } from "./contentAuth";
import { ContentGenerationRateLimiter } from "./contentRateLimit";
import { FirestoreAiQuotaStore } from "./aiQuota";
import type { AiFeature, AiQuotaDecision, AiQuotaStore } from "./aiQuota";

export interface AiGatewayOptions {
  verifier?: ContentAuthVerifier;
  quotaStore?: AiQuotaStore;
  networkLimiter?: ContentGenerationRateLimiter;
  now?: () => number;
}

const NETWORK_LIMITS = {
  perMinute: 600,
  perDay: 20_000,
} as const;

/** Shared verified-identity, abuse-control, and durable quota admission for all AI routes. */
export class AiGateway {
  readonly authenticate: RequestHandler;
  private readonly quotaStore: AiQuotaStore;
  private readonly networkLimiter: ContentGenerationRateLimiter;
  private readonly now: () => number;

  constructor(options: AiGatewayOptions = {}) {
    this.authenticate = createContentAuthMiddleware(
      options.verifier ?? createFirebaseContentAuthVerifier()
    );
    this.quotaStore = options.quotaStore ?? new FirestoreAiQuotaStore();
    this.networkLimiter = options.networkLimiter ?? new ContentGenerationRateLimiter(
      NETWORK_LIMITS.perMinute,
      NETWORK_LIMITS.perDay
    );
    this.now = options.now ?? Date.now;
  }

  async admit(
    req: Request,
    res: Response,
    feature: AiFeature,
    units = 1
  ): Promise<AiQuotaDecision> {
    const identity = getContentIdentity(res);
    if (!identity) {
      return {
        allowed: false,
        status: 401,
        code: "IDENTITY_REQUIRED",
        error: "Sign in is required to use AI features.",
        retryAfterSeconds: 0,
      };
    }

    const remoteAddress = req.ip || req.socket.remoteAddress || "anonymous";
    const networkDecision = this.networkLimiter.consume(`ip:${remoteAddress}`);
    if (!networkDecision.allowed) {
      return {
        allowed: false,
        status: 429,
        code: "NETWORK_RATE_LIMITED",
        error: "Too many AI requests from this network. Please wait before trying again.",
        retryAfterSeconds: networkDecision.retryAfterSeconds,
      };
    }

    const headerOrganizationId = req.get("X-Organization-Id");
    try {
      return await this.quotaStore.consume({
        uid: identity.uid,
        ...(headerOrganizationId === undefined ? {} : { organizationId: headerOrganizationId }),
        feature,
        units,
        now: this.now(),
      });
    } catch (error) {
      console.error("AI quota service failed closed.", error);
      return {
        allowed: false,
        status: 503,
        code: "AI_QUOTA_UNAVAILABLE",
        error: "AI services are temporarily unavailable. Please try again later.",
        retryAfterSeconds: 30,
      };
    }
  }
}

export function createAiGateway(options: AiGatewayOptions = {}): AiGateway {
  return new AiGateway(options);
}

export function sendAiQuotaDenial(res: Response, decision: AiQuotaDecision): Response | void {
  if (decision.allowed) return;
  res.setHeader("Cache-Control", "no-store");
  if (decision.retryAfterSeconds > 0) {
    res.setHeader("Retry-After", String(decision.retryAfterSeconds));
  }
  return res.status(decision.status).json({
    error: decision.error,
    code: decision.code,
    ...(decision.retryAfterSeconds > 0 ? { retryAfterSeconds: decision.retryAfterSeconds } : {}),
  });
}

export function setAiQuotaHeaders(res: Response, decision: AiQuotaDecision): void {
  if (!decision.allowed) return;
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-AI-Quota-Scope", decision.scope);
  res.setHeader("X-AI-Quota-Daily-Limit", String(decision.dailyLimitUnits));
  res.setHeader("X-AI-Quota-Daily-Remaining", String(decision.remainingDailyUnits));
  res.setHeader("X-AI-Quota-Reset-At", String(decision.resetAt));
}
