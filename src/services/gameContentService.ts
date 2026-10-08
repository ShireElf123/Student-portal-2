import { getAiAuthorizationHeader } from "./aiAuth";
import { syncAIQuotaFromResponseHeaders } from "./aiUsageService";
import { buildContentPoolKey } from "../contentEngine/fingerprint";
import { markGameBlueprintCompleted as markLocalGameBlueprintCompleted } from "../contentEngine/cache";
import { getDefaultContentPoolManager } from "../contentEngine/contentPoolManager";
import type { ContentPoolManager } from "../contentEngine/contentPoolManager";
import { validateContentGenerationRequest, validateGameBlueprint } from "../contentEngine/validation";
import { MAX_GENERATION_ATTEMPTS } from "../contentEngine/generation";
import type {
  BlueprintValidationError,
  ContentGenerationRequest,
  ContentGenerationResult,
  GameBlueprint,
  GenerateBlueprintCommand,
} from "../contentEngine/types";

export interface GenerationRequestHooks {
  beforeRequest?: () => void | Promise<void>;
  onGenerationAdmitted?: () => void | Promise<void>;
}

export interface ContentGenerationTransport {
  generate(command: GenerateBlueprintCommand, hooks?: GenerationRequestHooks): Promise<unknown>;
}

export interface GetOrGenerateOptions extends GenerationRequestHooks {
  transport?: ContentGenerationTransport;
  poolManager?: ContentPoolManager;
  now?: () => number;
}

export class ContentGenerationServiceError extends Error {
  readonly errors: BlueprintValidationError[];

  constructor(message: string, errors: BlueprintValidationError[] = []) {
    super(message);
    this.name = "ContentGenerationServiceError";
    this.errors = errors;
  }
}

/** Synchronously protects offline reuse, then best-effort syncs the owner-scoped cloud state. */
export async function markGameBlueprintCompleted(blueprint: GameBlueprint, learnerId: string): Promise<void> {
  const validation = validateGameBlueprint(blueprint);
  if (!validation.valid || !learnerId.trim()) return;
  markLocalGameBlueprintCompleted(validation.blueprint, learnerId);
  try {
    const pool = await getDefaultContentPoolManager();
    await pool.markPlayed(learnerId, validation.blueprint);
  } catch (error) {
    console.warn("Generated-content play state could not be synchronized; local learner state was updated.", error);
  }
}

/** Firebase ID token for the signed-in account; the server rejects unauthenticated generation. */
async function buildAuthorizationHeader(): Promise<Record<string, string>> {
  try {
    return { Authorization: await getAiAuthorizationHeader() };
  } catch (error) {
    throw new ContentGenerationServiceError(
      error instanceof Error ? error.message : "Sign in to create new AI practice content."
    );
  }
}

const httpContentTransport: ContentGenerationTransport = {
  async generate(command, hooks = {}) {
    // Authenticate before local metering so a missing/expired session is not counted as an attempt.
    const authorization = await buildAuthorizationHeader();
    await hooks.beforeRequest?.();
    const response = await fetch("/api/content/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authorization },
      body: JSON.stringify(command),
    });
    syncAIQuotaFromResponseHeaders(response.headers);
    if (response.headers.get("X-Content-Generation-Admitted") === "true") {
      await hooks.onGenerationAdmitted?.();
    }

    let body: unknown;
    try {
      body = await response.json() as unknown;
    } catch {
      throw new ContentGenerationServiceError("The content service returned an unreadable response.");
    }
    if (!response.ok) {
      const record = body && typeof body === "object" && !Array.isArray(body)
        ? body as Record<string, unknown>
        : {};
      const errors = Array.isArray(record.errors)
        ? record.errors.filter((item): item is BlueprintValidationError =>
          Boolean(item) && typeof item === "object" && !Array.isArray(item) &&
          typeof (item as Record<string, unknown>).message === "string"
        )
        : [];
      throw new ContentGenerationServiceError(
        typeof record.error === "string" ? record.error : "The content service could not create a validated activity.",
        errors
      );
    }
    return body;
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

const requestLocks = new Map<string, Promise<void>>();

async function withLearnerRequestLock<T>(key: string, task: () => Promise<T>): Promise<T> {
  const previous = requestLocks.get(key) ?? Promise.resolve();
  let release: () => void = () => {};
  const gate = new Promise<void>((resolve) => { release = resolve; });
  const queued = previous.then(() => gate);
  requestLocks.set(key, queued);
  await previous;
  try {
    return await task();
  } finally {
    release();
    if (requestLocks.get(key) === queued) requestLocks.delete(key);
  }
}

/**
 * Reads/reserves reusable validated content first. Refill is bounded by pool policy and
 * every server response is independently validated before the repository can persist it.
 */
export async function getOrGenerateGameBlueprint(
  requestInput: ContentGenerationRequest,
  learnerId: string,
  options: GetOrGenerateOptions = {}
): Promise<ContentGenerationResult> {
  const requestResult = validateContentGenerationRequest(requestInput);
  if (!requestResult.valid) {
    throw new ContentGenerationServiceError("The content request is invalid.", requestResult.errors);
  }
  if (!learnerId.trim()) throw new ContentGenerationServiceError("A learner ID is required to prepare content.");
  const request = requestResult.request;
  const lockKey = `${learnerId}:${buildContentPoolKey(request)}`;

  return withLearnerRequestLock(lockKey, async () => {
    const pool = options.poolManager ?? await getDefaultContentPoolManager();
    const cachedReservation = await pool.reserveContent(request, learnerId, options.now?.() ?? Date.now());
    if (cachedReservation) {
      return {
        blueprint: cachedReservation.blueprint,
        attempts: 0,
        source: "cache",
        cached: true,
      };
    }

    const transport = options.transport ?? httpContentTransport;
    let providerAttempts = 0;
    const refill = await pool.replenish(request, learnerId, {
      now: options.now,
      generate: async (excludedFingerprints) => {
        const command: GenerateBlueprintCommand = {
          request,
          excludedFingerprints: [...new Set(excludedFingerprints)].slice(0, 30),
        };
        const response = await transport.generate(command, {
          beforeRequest: options.beforeRequest,
          onGenerationAdmitted: options.onGenerationAdmitted,
        });
        if (!isRecord(response)) {
          throw new ContentGenerationServiceError("The content service response must be a JSON object.");
        }
        if (Number.isInteger(response.attempts) && Number(response.attempts) >= 1 &&
          Number(response.attempts) <= MAX_GENERATION_ATTEMPTS) {
          providerAttempts += Number(response.attempts);
        } else {
          providerAttempts += 1;
        }
        const validation = validateGameBlueprint(response.blueprint, { expectedRequest: request });
        if (!validation.valid) {
          throw new ContentGenerationServiceError(
            "Generated content failed client-side validation and was not persisted.",
            validation.errors
          );
        }
        return validation.blueprint;
      },
    });

    const generatedReservation = await pool.reserveContent(request, learnerId, options.now?.() ?? Date.now());
    if (generatedReservation) {
      return {
        blueprint: generatedReservation.blueprint,
        attempts: providerAttempts,
        source: refill.generatedCount > 0 ? "generated" : "cache",
        cached: true,
      };
    }
    if (refill.error instanceof ContentGenerationServiceError) throw refill.error;
    if (refill.error instanceof Error) throw new ContentGenerationServiceError(refill.error.message);
    throw new ContentGenerationServiceError(
      "No compatible content could be reserved. Please wait briefly or use the registered curated activity."
    );
  });
}
