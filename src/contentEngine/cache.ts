import { readScopedJSON, writeScopedJSON } from "../utils/accountStorage";
import { CONTENT_POOL_POLICY, CONTENT_POOL_REFILL_THRESHOLD } from "./policy";
import { fingerprintGameBlueprint } from "./fingerprint";
import { validateGameBlueprint } from "./validation";
import type { ContentGenerationRequest, GameBlueprint } from "./types";

const CACHE_STORAGE_KEY = "student_portal_generated_game_content_v1";
export const GENERATED_CONTENT_PLAYED_STORAGE_KEY = "student_portal_generated_game_content_played_v1";
const PLAYED_STORAGE_KEY = GENERATED_CONTENT_PLAYED_STORAGE_KEY;
const CACHE_DOCUMENT_VERSION = "generated-content-cache-v1" as const;
export const MAX_CACHED_BLUEPRINTS = 40;
export { CONTENT_POOL_REFILL_THRESHOLD } from "./policy";

export interface CachedBlueprintEntry {
  cacheKey: string;
  blueprint: GameBlueprint;
  storedAt: number;
  expiresAt?: number;
}

interface CachedBlueprintDocument {
  version: typeof CACHE_DOCUMENT_VERSION;
  entries: CachedBlueprintEntry[];
}

export interface ContentPoolStatus {
  usableBlueprintCount: number;
  refillThreshold: number;
  needsRefill: boolean;
}

export interface CacheWriteResult {
  stored: boolean;
  duplicate: boolean;
  blueprint?: GameBlueprint;
  error?: string;
}

function emptyDocument(): CachedBlueprintDocument {
  return { version: CACHE_DOCUMENT_VERSION, entries: [] };
}

function readDocument(): CachedBlueprintDocument {
  if (typeof window === "undefined") return emptyDocument();
  try {
    const raw = localStorage.getItem(CACHE_STORAGE_KEY);
    if (!raw) return emptyDocument();
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return emptyDocument();
    const value = parsed as Partial<CachedBlueprintDocument>;
    if (value.version !== CACHE_DOCUMENT_VERSION || !Array.isArray(value.entries)) return emptyDocument();
    const entries: CachedBlueprintEntry[] = [];
    for (const candidate of value.entries) {
      if (!candidate || typeof candidate !== "object" || !candidate.blueprint) continue;
      const validation = validateGameBlueprint(candidate.blueprint);
      if (!validation.valid || candidate.cacheKey !== validation.blueprint.metadata.cacheKey ||
        !Number.isFinite(candidate.storedAt)) continue;
      const storedAt = Number(candidate.storedAt);
      const expiresAt = Number.isFinite(candidate.expiresAt)
        ? Number(candidate.expiresAt)
        : storedAt + CONTENT_POOL_POLICY.contentLifetimeMs;
      entries.push({
        cacheKey: candidate.cacheKey,
        blueprint: validation.blueprint,
        storedAt,
        expiresAt,
      });
    }
    return { version: CACHE_DOCUMENT_VERSION, entries: entries.slice(0, MAX_CACHED_BLUEPRINTS) };
  } catch {
    return emptyDocument();
  }
}

function writeDocument(document: CachedBlueprintDocument): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify({
      version: CACHE_DOCUMENT_VERSION,
      entries: document.entries.slice(0, MAX_CACHED_BLUEPRINTS),
    }));
    return true;
  } catch {
    return false;
  }
}

function getPlayedFingerprints(learnerId: string): string[] {
  const played = readScopedJSON<unknown>(PLAYED_STORAGE_KEY, [], learnerId);
  if (!Array.isArray(played)) return [];
  return [...new Set(played.filter((item): item is string => typeof item === "string"))].slice(-200);
}

export function getCachedGameBlueprintEntries(): CachedBlueprintEntry[] {
  return readDocument().entries;
}

export function getCachedGameBlueprints(): GameBlueprint[] {
  return getCachedGameBlueprintEntries().map((entry) => entry.blueprint);
}

export function getKnownBlueprintFingerprints(): string[] {
  return [...new Set(getCachedGameBlueprints().map((blueprint) => fingerprintGameBlueprint(blueprint)))].slice(0, 30);
}

export function findReusableGameBlueprint(
  request: ContentGenerationRequest,
  learnerId: string
): GameBlueprint | null {
  const played = new Set(getPlayedFingerprints(learnerId));
  const entries = getCachedGameBlueprintEntries()
    .filter((entry) => entry.expiresAt === undefined || entry.expiresAt > Date.now())
    .sort((left, right) => left.storedAt - right.storedAt);

  for (const entry of entries) {
    const validation = validateGameBlueprint(entry.blueprint, { expectedRequest: request });
    if (validation.valid && !played.has(validation.blueprint.metadata.fingerprint)) return validation.blueprint;
  }
  return null;
}

export function getContentPoolStatus(
  request: ContentGenerationRequest,
  learnerId: string,
  refillThreshold = CONTENT_POOL_REFILL_THRESHOLD
): ContentPoolStatus {
  const played = new Set(getPlayedFingerprints(learnerId));
  const usableBlueprintCount = getCachedGameBlueprintEntries().filter((entry) => {
    if ((entry.expiresAt !== undefined && entry.expiresAt <= Date.now()) ||
      played.has(entry.blueprint.metadata.fingerprint)) return false;
    return validateGameBlueprint(entry.blueprint, { expectedRequest: request }).valid;
  }).length;
  return {
    usableBlueprintCount,
    refillThreshold,
    needsRefill: usableBlueprintCount < refillThreshold,
  };
}

/** Persists only a fully validated blueprint; semantic duplicates are never written twice. */
export function cacheValidatedGameBlueprint(
  input: unknown,
  options: { now?: number; expiresAt?: number } = {}
): CacheWriteResult {
  const validation = validateGameBlueprint(input);
  if (!validation.valid) {
    return { stored: false, duplicate: false, error: validation.errors.map((error) => error.message).join(" ") };
  }
  const blueprint = validation.blueprint;
  const fingerprint = fingerprintGameBlueprint(blueprint);
  const document = readDocument();
  const duplicate = document.entries.find((entry) =>
    fingerprintGameBlueprint(entry.blueprint) === fingerprint
  );
  if (duplicate) {
    return { stored: false, duplicate: true, blueprint: duplicate.blueprint };
  }

  const storedAt = Number.isFinite(options.now) ? Number(options.now) : Date.now();
  const expiresAt = Number.isFinite(options.expiresAt)
    ? Number(options.expiresAt)
    : storedAt + CONTENT_POOL_POLICY.contentLifetimeMs;
  const next: CachedBlueprintDocument = {
    version: CACHE_DOCUMENT_VERSION,
    entries: [{ cacheKey: blueprint.metadata.cacheKey, blueprint, storedAt, expiresAt }, ...document.entries]
      .slice(0, MAX_CACHED_BLUEPRINTS),
  };
  const stored = writeDocument(next);
  return stored
    ? { stored: true, duplicate: false, blueprint }
    : { stored: false, duplicate: false, blueprint, error: "Validated content is ready but local storage is unavailable." };
}

export function markGameBlueprintCompleted(blueprint: GameBlueprint, learnerId: string): void {
  const validation = validateGameBlueprint(blueprint);
  if (!validation.valid || !learnerId.trim()) return;
  const fingerprint = fingerprintGameBlueprint(validation.blueprint);
  const played = getPlayedFingerprints(learnerId);
  if (!played.includes(fingerprint)) {
    writeScopedJSON(PLAYED_STORAGE_KEY, [...played, fingerprint].slice(-200), learnerId);
  }
}

export function clearGeneratedContentCacheForTests(): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(CACHE_STORAGE_KEY);
    } catch {
      // Test utility is best-effort; production callers never need to clear the cache.
    }
  }
}
