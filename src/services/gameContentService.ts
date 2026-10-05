import { auth } from "../firebaseCore";
import { cacheValidatedGameBlueprint, findReusableGameBlueprint, getKnownBlueprintFingerprints } from "../contentEngine/cache";
import { validateContentGenerationRequest, validateGameBlueprint } from "../contentEngine/validation";
import type {
  BlueprintValidationError,
  ContentGenerationRequest,
  ContentGenerationResult,
  GenerateBlueprintCommand,
} from "../contentEngine/types";

export interface ContentGenerationTransport {
  generate(command: GenerateBlueprintCommand): Promise<unknown>;
}

export interface GetOrGenerateOptions {
  transport?: ContentGenerationTransport;
  beforeGenerate?: () => void | Promise<void>;
}

export class ContentGenerationServiceError extends Error {
  readonly errors: BlueprintValidationError[];

  constructor(message: string, errors: BlueprintValidationError[] = []) {
    super(message);
    this.name = "ContentGenerationServiceError";
    this.errors = errors;
  }
}

/** Firebase ID token for the signed-in account; the server rejects unauthenticated generation. */
async function buildAuthorizationHeader(): Promise<Record<string, string>> {
  const user = auth.currentUser;
  if (!user) {
    throw new ContentGenerationServiceError(
      "Sign in to create new AI practice content. Saved activities remain available without signing in."
    );
  }
  try {
    const token = await user.getIdToken();
    return { Authorization: `Bearer ${token}` };
  } catch {
    throw new ContentGenerationServiceError("Your sign-in could not be verified. Please sign in again to create new content.");
  }
}

const httpContentTransport: ContentGenerationTransport = {
  async generate(command) {
    const response = await fetch("/api/content/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(await buildAuthorizationHeader()) },
      body: JSON.stringify(command),
    });
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

/** Uses learner-safe local cache first, and stores only server-validated content. */
export async function getOrGenerateGameBlueprint(
  requestInput: ContentGenerationRequest,
  learnerId: string,
  options: GetOrGenerateOptions = {}
): Promise<ContentGenerationResult> {
  const requestResult = validateContentGenerationRequest(requestInput);
  if (!requestResult.valid) {
    throw new ContentGenerationServiceError("The content request is invalid.", requestResult.errors);
  }
  const request = requestResult.request;
  const cachedBlueprint = findReusableGameBlueprint(request, learnerId);
  if (cachedBlueprint) {
    return { blueprint: cachedBlueprint, attempts: 0, source: "cache", cached: true };
  }

  await options.beforeGenerate?.();
  const transport = options.transport ?? httpContentTransport;
  const command: GenerateBlueprintCommand = {
    request,
    excludedFingerprints: getKnownBlueprintFingerprints(),
  };
  const response = await transport.generate(command);
  if (!isRecord(response)) {
    throw new ContentGenerationServiceError("The content service response must be a JSON object.");
  }
  const attempts = Number.isInteger(response.attempts) && Number(response.attempts) >= 1 && Number(response.attempts) <= 2
    ? Number(response.attempts)
    : 1;
  const validation = validateGameBlueprint(response.blueprint, { expectedRequest: request });
  if (!validation.valid) {
    throw new ContentGenerationServiceError(
      "Generated content failed client-side validation and was not cached.",
      validation.errors
    );
  }

  const cacheResult = cacheValidatedGameBlueprint(validation.blueprint);
  if (cacheResult.duplicate) {
    throw new ContentGenerationServiceError("The provider returned content already present in the cache; it was not stored again.", [{
      code: "DUPLICATE_CONTENT",
      field: "content",
      message: "Duplicate normalized content was rejected.",
    }]);
  }
  return {
    blueprint: validation.blueprint,
    attempts,
    source: "generated",
    cached: cacheResult.stored,
  };
}
