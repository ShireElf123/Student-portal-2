import { auth } from "../firebaseCore";
import { buildContentPoolKey } from "./fingerprint";
import { CONTENT_POOL_POLICY } from "./policy";
import {
  HybridContentPoolRepository,
  LocalStorageContentPoolRepository,
} from "./contentPoolRepository";
import type {
  ContentPoolEntry,
  ContentPoolLearnerState,
  ContentPoolRepository,
} from "./contentPoolRepository";
import { validateContentGenerationRequest, validateGameBlueprint } from "./validation";
import type { ContentGenerationRequest, GameBlueprint } from "./types";

export interface ContentReservation {
  blueprint: GameBlueprint;
  reservationId: string;
  reservedAt: number;
  expiresAt: number;
}

export interface ContentPoolHealth {
  availableCount: number;
  reservedCount: number;
  playedCount: number;
  invalidCount: number;
  targetPoolSize: number;
  minimumAvailable: number;
  needsRefill: boolean;
}

export interface ReplenishResult {
  generatedCount: number;
  attemptedCount: number;
  error?: unknown;
}

export interface ReplenishOptions {
  now?: () => number;
  maxGenerationBatch?: number;
  generate: (excludedFingerprints: string[]) => Promise<GameBlueprint>;
}

function validateRequest(request: ContentGenerationRequest): ContentGenerationRequest {
  const result = validateContentGenerationRequest(request);
  if (!result.valid) throw new Error(`Invalid content-pool request: ${result.errors.map((error) => error.message).join(" ")}`);
  return result.request;
}

function newReservationId(now: number): string {
  const randomId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
  return `content-reservation-${now.toString(36)}-${randomId}`;
}

function reservationFor(state: ContentPoolLearnerState, fingerprint: string, now: number) {
  return state.reservations.find((reservation) => reservation.fingerprint === fingerprint && reservation.expiresAt > now);
}

function entryExpired(entry: ContentPoolEntry, now: number): boolean {
  return entry.expiresAt !== undefined && entry.expiresAt <= now;
}

async function availableBlueprintsFromSnapshot(
  repository: ContentPoolRepository,
  entries: ContentPoolEntry[],
  state: ContentPoolLearnerState,
  request: ContentGenerationRequest,
  learnerId: string,
  now: number
): Promise<GameBlueprint[]> {
  const played = new Set(state.playedFingerprints);
  const invalid = new Set(state.invalidFingerprints);
  const usable = new Map<string, { blueprint: GameBlueprint; createdAt: number }>();

  for (const entry of entries) {
    if (!entry || typeof entry !== "object" || !entry.blueprint || entryExpired(entry, now)) continue;
    const baseValidation = validateGameBlueprint(entry.blueprint);
    if (!baseValidation.valid) {
      const fingerprint = entry.blueprint?.metadata?.fingerprint;
      if (typeof fingerprint === "string" && /^fnv1a64-[0-9a-f]{16}$/.test(fingerprint) && !invalid.has(fingerprint)) {
        await repository.markInvalid(learnerId, fingerprint, now);
        invalid.add(fingerprint);
        state.invalidFingerprints.push(fingerprint);
      }
      continue;
    }
    const fingerprint = baseValidation.blueprint.metadata.fingerprint;
    if (played.has(fingerprint) || invalid.has(fingerprint) || reservationFor(state, fingerprint, now)) continue;
    const compatibleValidation = validateGameBlueprint(baseValidation.blueprint, { expectedRequest: request });
    if (!compatibleValidation.valid) continue;
    const previous = usable.get(fingerprint);
    if (!previous || entry.createdAt > previous.createdAt) {
      usable.set(fingerprint, { blueprint: compatibleValidation.blueprint, createdAt: entry.createdAt });
    }
  }

  return [...usable.values()]
    .sort((left, right) => right.createdAt - left.createdAt)
    .map((entry) => entry.blueprint);
}

/** Coordinates deterministic compatibility, reservations, bounded refill, and learner state. */
export class ContentPoolManager {
  constructor(
    private readonly repository: ContentPoolRepository,
    private readonly policy = CONTENT_POOL_POLICY
  ) {}

  async getAvailableContent(
    requestInput: ContentGenerationRequest,
    learnerId: string,
    now = Date.now()
  ): Promise<GameBlueprint[]> {
    if (!learnerId.trim()) throw new Error("A learner ID is required to access generated content.");
    const request = validateRequest(requestInput);
    const [entries, state] = await Promise.all([
      this.repository.listBlueprints(request),
      this.repository.getLearnerState(learnerId, now),
    ]);
    return availableBlueprintsFromSnapshot(this.repository, entries, state, request, learnerId, now);
  }

  async findCompatibleContent(
    request: ContentGenerationRequest,
    learnerId: string,
    now = Date.now()
  ): Promise<GameBlueprint | null> {
    return (await this.getAvailableContent(request, learnerId, now))[0] ?? null;
  }

  async reserveContent(
    requestInput: ContentGenerationRequest,
    learnerId: string,
    now = Date.now()
  ): Promise<ContentReservation | null> {
    const request = validateRequest(requestInput);
    const candidates = await this.getAvailableContent(request, learnerId, now);
    for (const blueprint of candidates) {
      const reservationId = newReservationId(now);
      const expiresAt = now + this.policy.reservationLeaseMs;
      const reserved = await this.repository.reserve(
        learnerId,
        blueprint.metadata.fingerprint,
        reservationId,
        now,
        expiresAt
      );
      if (reserved) return { blueprint, reservationId, reservedAt: now, expiresAt };
    }
    return null;
  }

  async markPlayed(learnerId: string, blueprint: GameBlueprint, now = Date.now()): Promise<void> {
    const validation = validateGameBlueprint(blueprint);
    if (!validation.valid) throw new Error("Cannot mark an invalid game blueprint as played.");
    if (!learnerId.trim()) throw new Error("A learner ID is required to record generated-content use.");
    await this.repository.markPlayed(learnerId, validation.blueprint.metadata.fingerprint, now);
  }

  async markInvalid(learnerId: string, fingerprint: string, now = Date.now()): Promise<void> {
    if (!learnerId.trim() || !/^fnv1a64-[0-9a-f]{16}$/.test(fingerprint)) {
      throw new Error("Learner ID and normalized fingerprint are required to quarantine content.");
    }
    await this.repository.markInvalid(learnerId, fingerprint, now);
  }

  async replenish(
    requestInput: ContentGenerationRequest,
    learnerId: string,
    options: ReplenishOptions
  ): Promise<ReplenishResult> {
    const request = validateRequest(requestInput);
    const now = options.now ?? Date.now;
    const startingAt = now();
    if (!learnerId.trim()) throw new Error("A learner ID is required to refill generated content.");
    const [knownEntries, state] = await Promise.all([
      this.repository.listBlueprints(request),
      this.repository.getLearnerState(learnerId, startingAt),
    ]);
    const available = await availableBlueprintsFromSnapshot(
      this.repository,
      knownEntries,
      state,
      request,
      learnerId,
      startingAt
    );
    if (available.length >= this.policy.minimumAvailable) return { generatedCount: 0, attemptedCount: 0 };

    const poolKey = buildContentPoolKey(request);
    const cooldownStarted = await this.repository.startRefillCooldown(
      learnerId,
      poolKey,
      now(),
      this.policy.refillCooldownMs
    );
    if (!cooldownStarted) return { generatedCount: 0, attemptedCount: 0 };

    const generationBudget = Math.max(0, Math.min(
      this.policy.maxGenerationBatch,
      options.maxGenerationBatch ?? this.policy.maxGenerationBatch,
      this.policy.targetPoolSize - available.length
    ));
    let generatedCount = 0;
    let attemptedCount = 0;
    let error: unknown;
    const excludedFingerprints = [...new Set(knownEntries
      .map((entry) => entry.blueprint?.metadata?.fingerprint)
      .filter((fingerprint): fingerprint is string =>
        typeof fingerprint === "string" && /^fnv1a64-[0-9a-f]{16}$/.test(fingerprint)
      ))]
      .slice(0, 30);

    while (attemptedCount < generationBudget && generatedCount < generationBudget) {
      attemptedCount += 1;
      let blueprint: GameBlueprint;
      try {
        blueprint = await options.generate([...excludedFingerprints]);
      } catch (generationError) {
        error = generationError;
        break;
      }

      const validation = validateGameBlueprint(blueprint, { expectedRequest: request });
      if (!validation.valid) {
        error = new Error(`Generated content failed deterministic validation: ${validation.errors.map((item) => item.message).join(" ")}`);
        break;
      }
      const fingerprint = validation.blueprint.metadata.fingerprint;
      if (excludedFingerprints.includes(fingerprint)) {
        error = new Error("Generation returned a fingerprint already present in the compatible pool.");
        continue;
      }

      const timestamp = now();
      const saved = await this.repository.saveValidatedBlueprint(
        validation.blueprint,
        timestamp,
        timestamp + this.policy.contentLifetimeMs
      );
      if (saved.stored) {
        generatedCount += 1;
        excludedFingerprints.push(fingerprint);
      } else if (saved.duplicate) {
        error = new Error("A duplicate generated blueprint was rejected by the content repository.");
        excludedFingerprints.push(fingerprint);
      } else {
        error = new Error(saved.error || "Validated content could not be persisted.");
        break;
      }
    }

    return error === undefined
      ? { generatedCount, attemptedCount }
      : { generatedCount, attemptedCount, error };
  }

  async getPoolHealth(
    requestInput: ContentGenerationRequest,
    learnerId: string,
    now = Date.now()
  ): Promise<ContentPoolHealth> {
    const request = validateRequest(requestInput);
    if (!learnerId.trim()) throw new Error("A learner ID is required to inspect generated content.");
    const [entries, state] = await Promise.all([
      this.repository.listBlueprints(request),
      this.repository.getLearnerState(learnerId, now),
    ]);
    const available = await availableBlueprintsFromSnapshot(
      this.repository,
      entries,
      state,
      request,
      learnerId,
      now
    );
    const compatibleFingerprints = new Set<string>();
    for (const entry of entries) {
      if (!entry || typeof entry !== "object" || !entry.blueprint || entryExpired(entry, now)) continue;
      const validation = validateGameBlueprint(entry.blueprint, { expectedRequest: request });
      if (validation.valid) compatibleFingerprints.add(validation.blueprint.metadata.fingerprint);
    }
    const reservations = new Set(state.reservations
      .filter((reservation) => reservation.expiresAt > now && compatibleFingerprints.has(reservation.fingerprint))
      .map((reservation) => reservation.fingerprint));
    const played = new Set(state.playedFingerprints.filter((fingerprint) => compatibleFingerprints.has(fingerprint)));
    const invalid = new Set(state.invalidFingerprints.filter((fingerprint) => compatibleFingerprints.has(fingerprint)));
    return {
      availableCount: available.length,
      reservedCount: reservations.size,
      playedCount: played.size,
      invalidCount: invalid.size,
      targetPoolSize: this.policy.targetPoolSize,
      minimumAvailable: this.policy.minimumAvailable,
      needsRefill: available.length < this.policy.minimumAvailable,
    };
  }
}

let cachedManager: ContentPoolManager | null = null;
let cachedOwnerUid: string | null | undefined;

/** Selects a per-account Firestore repository when signed in, with a local-only fallback. */
export async function getDefaultContentPoolManager(): Promise<ContentPoolManager> {
  const ownerUid = auth.currentUser?.uid ?? null;
  if (cachedManager && cachedOwnerUid === ownerUid) return cachedManager;
  const localRepository = new LocalStorageContentPoolRepository();
  let repository: ContentPoolRepository = localRepository;
  if (ownerUid) {
    try {
      const { FirestoreContentPoolRepository } = await import("./firestoreContentPoolRepository");
      repository = new HybridContentPoolRepository(localRepository, new FirestoreContentPoolRepository(ownerUid));
    } catch (error) {
      console.warn("Firebase content persistence could not be initialized; validated local caching remains available.", error);
    }
  }
  cachedOwnerUid = ownerUid;
  cachedManager = new ContentPoolManager(repository);
  return cachedManager;
}

export function clearDefaultContentPoolManagerForTests(): void {
  cachedOwnerUid = undefined;
  cachedManager = null;
}
