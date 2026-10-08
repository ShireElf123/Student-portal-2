import express, { type Request, type Response, type Router } from "express";
import { buildContentGenerationFlightKey } from "../src/contentEngine/fingerprint";
import { generateGameBlueprintWithProvider } from "./contentGeneration";
import type { ContentAuthVerifier } from "./contentAuth";
import { ContentGenerationRateLimiter } from "./contentRateLimit";
import { createAiGateway, sendAiQuotaDenial, setAiQuotaHeaders } from "./aiGateway";
import type { AiGateway } from "./aiGateway";
import type { AiQuotaAllowed, AiQuotaDecision, AiQuotaStore } from "./aiQuota";
import { validateContentGenerationRequest, validateExcludedFingerprints } from "../src/contentEngine/validation";
import type { GameBlueprint, GenerateBlueprintCommand } from "../src/contentEngine/types";
import { persistServerValidatedBlueprint } from "./contentPersistence";
import type { BlueprintGenerationOutcome, StructuredContentProvider } from "../src/contentEngine/generation";

interface GenerationFlightResult {
  admitted: boolean;
  admission?: AiQuotaAllowed;
  denial?: AiQuotaDecision;
  outcome?: BlueprintGenerationOutcome;
  providerFailed?: boolean;
  sharedPersisted?: boolean;
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
  gateway?: AiGateway;
  verifier?: ContentAuthVerifier;
  quotaStore?: AiQuotaStore;
  ipLimiter?: ContentGenerationRateLimiter;
  coordinator?: ContentGenerationCoordinator;
  provider?: StructuredContentProvider;
  persistBlueprint?: (blueprint: GameBlueprint) => Promise<boolean>;
  apiKeyAvailable?: () => boolean;
}

interface CoordinatedGenerationResult extends GenerationFlightResult {
  coalesced: boolean;
}

const defaultCoordinator = new ContentGenerationCoordinator();

/** Creates the production /api/content/generate route with injectable external boundaries. */
export function createContentGenerationRouter(options: ContentGenerationRouterOptions = {}): Router {
  const router = express.Router();
  const gateway = options.gateway ?? createAiGateway({
    ...(options.verifier ? { verifier: options.verifier } : {}),
    ...(options.quotaStore ? { quotaStore: options.quotaStore } : {}),
    ...(options.ipLimiter ? { networkLimiter: options.ipLimiter } : {}),
  });
  const coordinator = options.coordinator ?? defaultCoordinator;
  const isProviderConfigured = options.apiKeyAvailable ?? (() =>
    Boolean(process.env.GEMINI_API_KEY || process.env.API_KEY)
  );

  router.post("/api/content/generate", gateway.authenticate, async (req: Request, res: Response) => {
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
    const organizationSelection = req.get("X-Organization-Id") ?? null;
    const flightKey = JSON.stringify([
      identity.uid,
      organizationSelection,
      buildContentGenerationFlightKey(command.request),
      command.excludedFingerprints.slice().sort(),
    ]);

    const flightResult = await coordinator.run(flightKey, async () => {
      const admission = await gateway.admit(req, res, "content", 1);
      if (!admission.allowed) return { admitted: false, denial: admission };
      try {
        const outcome = await generateGameBlueprintWithProvider(command, options.provider);
        if (!outcome.valid) return { admitted: true, admission, outcome, sharedPersisted: false };
        let sharedPersisted = false;
        try {
          sharedPersisted = await (options.persistBlueprint ?? persistServerValidatedBlueprint)(outcome.blueprint);
        } catch (persistenceError) {
          console.warn("Validated content could not be synchronized to the shared pool.", persistenceError);
        }
        return { admitted: true, admission, outcome, sharedPersisted };
      } catch (error) {
        console.error("Structured content generation failed inside the provider boundary:", error);
        return { admitted: true, admission, providerFailed: true };
      }
    });

    if (!flightResult.admitted) {
      return sendAiQuotaDenial(res, flightResult.denial ?? {
        allowed: false,
        status: 503,
        code: "AI_QUOTA_UNAVAILABLE",
        error: "AI services are temporarily unavailable. Please try again later.",
        retryAfterSeconds: 30,
      });
    }
    if (flightResult.admission) setAiQuotaHeaders(res, flightResult.admission);

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
    return res.json({
      blueprint: flightResult.outcome.blueprint,
      attempts: flightResult.outcome.attempts,
      sharedPersisted: flightResult.sharedPersisted === true,
    });
  });

  return router;
}
