import express, { type Request, type Response, type Router } from "express";
import { buildContentGenerationFlightKey } from "../src/contentEngine/fingerprint";
import { generateGameBlueprintWithProvider } from "./contentGeneration";
import { createContentAuthMiddleware, createFirebaseContentAuthVerifier } from "./contentAuth";
import type { ContentAuthVerifier } from "./contentAuth";
import { ContentGenerationRateLimiter } from "./contentRateLimit";
import type { ContentRateLimitResult } from "./contentRateLimit";
import { validateContentGenerationRequest, validateExcludedFingerprints } from "../src/contentEngine/validation";
import type { GenerateBlueprintCommand } from "../src/contentEngine/types";
import type { BlueprintGenerationOutcome, StructuredContentProvider } from "../src/contentEngine/generation";
import { CONTENT_GENERATION_LIMITS } from "../src/contentEngine/policy";

interface GenerationFlightResult {
  admitted: boolean;
  rateLimit?: ContentRateLimitResult;
  rateLimitScope?: "account" | "network";
  outcome?: BlueprintGenerationOutcome;
  providerFailed?: boolean;
}

/** Per-process request coalescing prevents duplicate Gemini calls during a refill race. */
export class ContentGenerationCoordinator {
  private readonly inFlight = new Map<string, Promise<GenerationFlightResult>>();

  run(key: string, operation: () => Promise<GenerationFlightResult>): Promise<CoordinatedGenerationResult> {
    const existing = this.inFlight.get(key);
    if (existing) return existing.then((result) => ({ ...result, coalesced: true }));
    const task = Promise.resolve().then(operation);
    this.inFlight.set(key, task);
    return task.finally(() => {
      if (this.inFlight.get(key) === task) this.inFlight.delete(key);
    }).then((result) => ({ ...result, coalesced: false }));
  }
}

export interface ContentGenerationRouterOptions {
  verifier?: ContentAuthVerifier;
  limiter?: ContentGenerationRateLimiter;
  ipLimiter?: ContentGenerationRateLimiter;
  coordinator?: ContentGenerationCoordinator;
  provider?: StructuredContentProvider;
  apiKeyAvailable?: () => boolean;
}

interface CoordinatedGenerationResult extends GenerationFlightResult {
  coalesced: boolean;
}

const defaultCoordinator = new ContentGenerationCoordinator();

/** Creates the production /api/content/generate route with injectable external boundaries. */
export function createContentGenerationRouter(options: ContentGenerationRouterOptions = {}): Router {
  const router = express.Router();
  const limiter = options.limiter ?? new ContentGenerationRateLimiter(
    CONTENT_GENERATION_LIMITS.maxPerMinute,
    CONTENT_GENERATION_LIMITS.maxPerDay
  );
  const ipLimiter = options.ipLimiter ?? new ContentGenerationRateLimiter(
    CONTENT_GENERATION_LIMITS.maxPerIpMinute,
    CONTENT_GENERATION_LIMITS.maxPerIpDay
  );
  const coordinator = options.coordinator ?? defaultCoordinator;
  const authMiddleware = createContentAuthMiddleware(options.verifier ?? createFirebaseContentAuthVerifier());
  const isProviderConfigured = options.apiKeyAvailable ?? (() =>
    Boolean(process.env.GEMINI_API_KEY || process.env.API_KEY)
  );

  router.post("/api/content/generate", authMiddleware, async (req: Request, res: Response) => {
    const rawBody: unknown = req.body;
    const body = rawBody && typeof rawBody === "object" && !Array.isArray(rawBody)
      ? rawBody as Record<string, unknown>
      : {};
    let requestSize = 0;
    try {
      requestSize = JSON.stringify(body).length;
    } catch {
      requestSize = Number.POSITIVE_INFINITY;
    }
    if (requestSize > 32_000) {
      return res.status(413).json({ error: "Content generation request is too large." });
    }

    const requestResult = validateContentGenerationRequest(body.request);
    if (!requestResult.valid) {
      return res.status(400).json({ error: "Content generation request is invalid.", errors: requestResult.errors });
    }
    const excludedResult = validateExcludedFingerprints(body.excludedFingerprints ?? []);
    if (!excludedResult.valid) {
      return res.status(400).json({ error: "Content de-duplication data is invalid.", errors: excludedResult.errors });
    }
    if (!isProviderConfigured()) {
      return res.status(503).json({ error: "Structured content generation is unavailable because GEMINI_API_KEY is not configured." });
    }

    const identity = res.locals.contentIdentity as { uid: string } | undefined;
    if (!identity?.uid) return res.status(401).json({ error: "Your sign-in could not be verified. Please sign in again." });
    const command: GenerateBlueprintCommand = {
      request: requestResult.request,
      excludedFingerprints: excludedResult.fingerprints,
    };
    const remoteAddress = req.ip || req.socket.remoteAddress || "anonymous";
    const flightKey = `${identity.uid}:${buildContentGenerationFlightKey(command.request)}:${command.excludedFingerprints.slice().sort().join(",")}`;

    const flightResult = await coordinator.run(flightKey, async () => {
      const networkLimit = ipLimiter.consume(`ip:${remoteAddress}`);
      if (!networkLimit.allowed) return { admitted: false, rateLimit: networkLimit, rateLimitScope: "network" };
      const accountLimit = limiter.consume(identity.uid);
      if (!accountLimit.allowed) return { admitted: false, rateLimit: accountLimit, rateLimitScope: "account" };
      try {
        const outcome = await generateGameBlueprintWithProvider(command, options.provider);
        return { admitted: true, outcome };
      } catch (error) {
        console.error("Structured content generation failed inside the provider boundary:", error);
        return { admitted: true, providerFailed: true };
      }
    });

    if (!flightResult.admitted) {
      const rateLimit = flightResult.rateLimit;
      if (rateLimit && rateLimit.retryAfterSeconds > 0) {
        res.setHeader("Retry-After", String(rateLimit.retryAfterSeconds));
      }
      return res.status(429).json({
        error: flightResult.rateLimitScope === "network"
          ? "Too many content-generation requests from this network. Please wait before trying again."
          : rateLimit?.reason === "daily-limit"
            ? "This account has reached today's server content-generation limit. Try cached learning content or come back tomorrow."
            : "Too many content-generation requests. Please wait before trying again.",
      });
    }

    // Only the request that consumed the server admission increments the local UI meter.
    // Coalesced followers reuse its result without spending another model-generation slot.
    if (!flightResult.coalesced) res.setHeader("X-Content-Generation-Admitted", "true");
    if (flightResult.providerFailed || !flightResult.outcome) {
      return res.status(502).json({ error: "Structured content generation failed safely. Curated activities remain available." });
    }
    if (!flightResult.outcome.valid) {
      console.warn(
        `Structured content generation was rejected after ${flightResult.outcome.attempts} attempt(s): ` +
        flightResult.outcome.errors.map((error) => `${error.code}@${error.field}`).join(", ")
      );
      return res.status(502).json({
        error: "The provider did not produce a valid, original game blueprint within the retry limit.",
        attempts: flightResult.outcome.attempts,
        errors: flightResult.outcome.errors,
      });
    }
    return res.json({ blueprint: flightResult.outcome.blueprint, attempts: flightResult.outcome.attempts });
  });

  return router;
}
