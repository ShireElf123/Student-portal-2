import { readScopedJSON, writeScopedJSON } from "../utils/accountStorage";
import { buildContentCacheKey, fingerprintGameBlueprint } from "./fingerprint";
import { validateGameBlueprint } from "./validation";
import type { ContentGenerationRequest, GameBlueprint } from "./types";

const CACHE_STORAGE_KEY = "student_portal_generated_game_content_v1";
const PLAYED_STORAGE_KEY = "student_portal_generated_game_content_played_v1";
const CACHE_DOCUMENT_VERSION = "generated-content-cache-v1" as const;
export const MAX_CACHED_BLUEPRINTS = 40;
export const CONTENT_POOL_REFILL_THRESHOLD = 3;

interface CachedBlueprintEntry {
  cacheKey: string;
  blueprint: GameBlueprint;
  storedAt: number;
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
      entries.push({
        cacheKey: candidate.cacheKey,
        blueprint: validation.blueprint,
        storedAt: Number(candidate.storedAt),
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

export function getCachedGameBlueprints(): GameBlueprint[] {
  return readDocument().entries.map((entry) => entry.blueprint);
}

export function getKnownBlueprintFingerprints(): string[] {
  return [...new Set(getCachedGameBlueprints().map((blueprint) => fingerprintGameBlueprint(blueprint)))].slice(0, 30);
}

export function findReusableGameBlueprint(
  request: ContentGenerationRequest,
  learnerId: string
): GameBlueprint | null {
  const cacheKey = buildContentCacheKey(request);
  const played = new Set(getPlayedFingerprints(learnerId));
  const entries = readDocument().entries
    .filter((entry) => entry.cacheKey === cacheKey)
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
  const cacheKey = buildContentCacheKey(request);
  const played = new Set(getPlayedFingerprints(learnerId));
  const usableBlueprintCount = readDocument().entries.filter((entry) => {
    if (entry.cacheKey !== cacheKey || played.has(entry.blueprint.metadata.fingerprint)) return false;
    return validateGameBlueprint(entry.blueprint, { expectedRequest: request }).valid;
  }).length;
  return {
    usableBlueprintCount,
    refillThreshold,
    needsRefill: usableBlueprintCount < refillThreshold,
  };
}

/** Persists only a fully validated blueprint; semantic duplicates are never written twice. */
export function cacheValidatedGameBlueprint(input: unknown): CacheWriteResult {
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

  const next: CachedBlueprintDocument = {
    version: CACHE_DOCUMENT_VERSION,
    entries: [{ cacheKey: blueprint.metadata.cacheKey, blueprint, storedAt: Date.now() }, ...document.entries]
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
  if (played.includes(fingerprint)) return;
  writeScopedJSON(PLAYED_STORAGE_KEY, [...played, fingerprint].slice(-200), learnerId);
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
