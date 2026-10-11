import {
  cacheValidatedGameBlueprint,
  getCachedGameBlueprintEntries,
  GENERATED_CONTENT_PLAYED_STORAGE_KEY,
} from "./cache";
import type { ContentGenerationRequest, GameBlueprint } from "./types";
import { readScopedJSON, writeScopedJSON } from "../utils/accountStorage";

const LOCAL_POOL_STATE_KEY = "student_portal_generated_game_content_state_v2";
export const CONTENT_POOL_LEARNER_STATE_VERSION = "content-pool-learner-state-v1" as const;
export const MAX_PLAYED_FINGERPRINTS = 200;
export const MAX_INVALID_FINGERPRINTS = 100;
export const MAX_RESERVATIONS = 20;
export const MAX_REFILL_TIMES = 40;
const FINGERPRINT_PATTERN = /^fnv1a64-[0-9a-f]{16}$/;

export interface ContentPoolEntry {
  blueprint: GameBlueprint;
  createdAt: number;
  expiresAt?: number;
}

export interface ContentReservationRecord {
  fingerprint: string;
  reservationId: string;
  reservedAt: number;
  expiresAt: number;
}

export interface ContentPoolLearnerState {
  playedFingerprints: string[];
  invalidFingerprints: string[];
  reservations: ContentReservationRecord[];
  refillTimes: Array<{ key: string; startedAt: number }>;
}

export interface PoolRepositorySaveResult {
  stored: boolean;
  duplicate: boolean;
  blueprint?: GameBlueprint;
  error?: string;
}

export interface ContentPoolRepository {
  listBlueprints(request: ContentGenerationRequest): Promise<ContentPoolEntry[]>;
  saveValidatedBlueprint(blueprint: GameBlueprint, now: number, expiresAt: number): Promise<PoolRepositorySaveResult>;
  getLearnerState(learnerId: string, now: number): Promise<ContentPoolLearnerState>;
  reserve(
    learnerId: string,
    fingerprint: string,
    reservationId: string,
    now: number,
    expiresAt: number
  ): Promise<boolean>;
  releaseReservation(learnerId: string, fingerprint: string, reservationId: string): Promise<void>;
  markPlayed(learnerId: string, fingerprint: string, now: number): Promise<void>;
  markInvalid(learnerId: string, fingerprint: string, now: number): Promise<void>;
  startRefillCooldown(learnerId: string, key: string, now: number, cooldownMs: number): Promise<boolean>;
}

function emptyState(): ContentPoolLearnerState {
  return { playedFingerprints: [], invalidFingerprints: [], reservations: [], refillTimes: [] };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function normalizeContentPoolState(value: unknown, now: number): ContentPoolLearnerState {
  if (!isRecord(value) || value.version !== CONTENT_POOL_LEARNER_STATE_VERSION) return emptyState();
  const played = Array.isArray(value.playedFingerprints)
    ? value.playedFingerprints.filter((item): item is string => typeof item === "string" && FINGERPRINT_PATTERN.test(item))
    : [];
  const invalid = Array.isArray(value.invalidFingerprints)
    ? value.invalidFingerprints.filter((item): item is string => typeof item === "string" && FINGERPRINT_PATTERN.test(item))
    : [];
  const reservations = Array.isArray(value.reservations)
    ? value.reservations.flatMap((candidate): ContentReservationRecord[] => {
        if (!isRecord(candidate) ||
          typeof candidate.fingerprint !== "string" || !FINGERPRINT_PATTERN.test(candidate.fingerprint) ||
          typeof candidate.reservationId !== "string" || !candidate.reservationId || candidate.reservationId.length > 128 ||
          !Number.isFinite(candidate.reservedAt) || !Number.isFinite(candidate.expiresAt) ||
          Number(candidate.expiresAt) <= now) return [];
        return [{
          fingerprint: candidate.fingerprint,
          reservationId: candidate.reservationId,
          reservedAt: Number(candidate.reservedAt),
          expiresAt: Number(candidate.expiresAt),
        }];
      })
    : [];
  const refillTimes = Array.isArray(value.refillTimes)
    ? value.refillTimes.flatMap((candidate): Array<{ key: string; startedAt: number }> => {
        if (!isRecord(candidate) || typeof candidate.key !== "string" || !candidate.key || candidate.key.length > 128 ||
          !Number.isFinite(candidate.startedAt)) return [];
        return [{ key: candidate.key, startedAt: Number(candidate.startedAt) }];
      })
    : [];

  return {
    playedFingerprints: [...new Set(played)].slice(-MAX_PLAYED_FINGERPRINTS),
    invalidFingerprints: [...new Set(invalid)].slice(-MAX_INVALID_FINGERPRINTS),
    reservations: reservations.slice(-MAX_RESERVATIONS),
    refillTimes: refillTimes.slice(-MAX_REFILL_TIMES),
  };
}

function mergeStates(...states: ContentPoolLearnerState[]): ContentPoolLearnerState {
  const reservations = new Map<string, ContentReservationRecord>();
  const refillTimes = new Map<string, { key: string; startedAt: number }>();
  for (const state of states) {
    for (const reservation of state.reservations) {
      const existing = reservations.get(reservation.fingerprint);
      if (!existing || reservation.expiresAt > existing.expiresAt) {
        reservations.set(reservation.fingerprint, reservation);
      }
    }
    for (const refill of state.refillTimes) {
      const existing = refillTimes.get(refill.key);
      if (!existing || refill.startedAt > existing.startedAt) refillTimes.set(refill.key, refill);
    }
  }
  return {
    playedFingerprints: [...new Set(states.flatMap((state) => state.playedFingerprints))].slice(-MAX_PLAYED_FINGERPRINTS),
    invalidFingerprints: [...new Set(states.flatMap((state) => state.invalidFingerprints))].slice(-MAX_INVALID_FINGERPRINTS),
    reservations: [...reservations.values()].slice(-MAX_RESERVATIONS),
    refillTimes: [...refillTimes.values()].slice(-MAX_REFILL_TIMES),
  };
}

function withProcessLock<T>(key: string, task: () => Promise<T>): Promise<T> {
  const locks = processStateLocks;
  const previous = locks.get(key) ?? Promise.resolve();
  let release: () => void = () => {};
  const gate = new Promise<void>((resolve) => { release = resolve; });
  const queued = previous.then(() => gate);
  locks.set(key, queued);
  return previous.then(task).finally(() => {
    release();
    if (locks.get(key) === queued) locks.delete(key);
  });
}

const processStateLocks = new Map<string, Promise<void>>();

async function withLearnerLock<T>(learnerId: string, task: () => Promise<T>): Promise<T> {
  const lockName = `student-portal-content-state:${encodeURIComponent(learnerId)}`;
  if (typeof navigator !== "undefined" && navigator.locks) {
    return navigator.locks.request(lockName, () => withProcessLock(lockName, task));
  }
  return withProcessLock(lockName, task);
}

function readLocalState(learnerId: string, now: number): ContentPoolLearnerState {
  const raw = readScopedJSON<unknown>(LOCAL_POOL_STATE_KEY, null, learnerId);
  const state = normalizeContentPoolState(raw, now);
  const legacyPlayed = readScopedJSON<unknown>(GENERATED_CONTENT_PLAYED_STORAGE_KEY, [], learnerId);
  if (!Array.isArray(legacyPlayed)) return state;
  const migrated = legacyPlayed.filter((item): item is string => typeof item === "string" && FINGERPRINT_PATTERN.test(item));
  return mergeStates(state, { ...emptyState(), playedFingerprints: migrated });
}

function writeLocalState(learnerId: string, state: ContentPoolLearnerState): void {
  writeScopedJSON(LOCAL_POOL_STATE_KEY, { version: CONTENT_POOL_LEARNER_STATE_VERSION, ...state }, learnerId);
  writeScopedJSON(GENERATED_CONTENT_PLAYED_STORAGE_KEY, state.playedFingerprints, learnerId);
}

/** Offline-first repository. Shared blueprints are browser-wide; play state is learner-scoped. */
export class LocalStorageContentPoolRepository implements ContentPoolRepository {
  async listBlueprints(_request: ContentGenerationRequest): Promise<ContentPoolEntry[]> {
    return getCachedGameBlueprintEntries().map((entry) => ({
      blueprint: entry.blueprint,
      createdAt: entry.storedAt,
      ...(entry.expiresAt === undefined ? {} : { expiresAt: entry.expiresAt }),
    }));
  }

  async saveValidatedBlueprint(
    blueprint: GameBlueprint,
    now: number,
    expiresAt: number
  ): Promise<PoolRepositorySaveResult> {
    const result = cacheValidatedGameBlueprint(blueprint, { now, expiresAt });
    return {
      stored: result.stored,
      duplicate: result.duplicate,
      ...(result.blueprint ? { blueprint: result.blueprint } : {}),
      ...(result.error ? { error: result.error } : {}),
    };
  }

  async getLearnerState(learnerId: string, now: number): Promise<ContentPoolLearnerState> {
    return readLocalState(learnerId, now);
  }

  async reserve(
    learnerId: string,
    fingerprint: string,
    reservationId: string,
    now: number,
    expiresAt: number
  ): Promise<boolean> {
    return withLearnerLock(learnerId, async () => {
      const state = readLocalState(learnerId, now);
      if (state.playedFingerprints.includes(fingerprint) || state.invalidFingerprints.includes(fingerprint) ||
        state.reservations.some((reservation) => reservation.fingerprint === fingerprint && reservation.expiresAt > now)) {
        return false;
      }
      state.reservations = state.reservations.filter((reservation) => reservation.expiresAt > now);
      if (state.reservations.length >= MAX_RESERVATIONS) return false;
      state.reservations.push({ fingerprint, reservationId, reservedAt: now, expiresAt });
      writeLocalState(learnerId, state);
      return true;
    });
  }

  async releaseReservation(learnerId: string, fingerprint: string, reservationId: string): Promise<void> {
    await withLearnerLock(learnerId, async () => {
      const state = readLocalState(learnerId, Date.now());
      state.reservations = state.reservations.filter((reservation) =>
        reservation.fingerprint !== fingerprint || reservation.reservationId !== reservationId
      );
      writeLocalState(learnerId, state);
    });
  }

  async markPlayed(learnerId: string, fingerprint: string, now: number): Promise<void> {
    await withLearnerLock(learnerId, async () => {
      const state = readLocalState(learnerId, now);
      state.reservations = state.reservations.filter((reservation) => reservation.fingerprint !== fingerprint);
      state.playedFingerprints = [...new Set([...state.playedFingerprints, fingerprint])].slice(-MAX_PLAYED_FINGERPRINTS);
      writeLocalState(learnerId, state);
    });
  }

  async markInvalid(learnerId: string, fingerprint: string, now: number): Promise<void> {
    await withLearnerLock(learnerId, async () => {
      const state = readLocalState(learnerId, now);
      state.reservations = state.reservations.filter((reservation) => reservation.fingerprint !== fingerprint);
      state.invalidFingerprints = [...new Set([...state.invalidFingerprints, fingerprint])].slice(-MAX_INVALID_FINGERPRINTS);
      writeLocalState(learnerId, state);
    });
  }

  async startRefillCooldown(learnerId: string, key: string, now: number, cooldownMs: number): Promise<boolean> {
    return withLearnerLock(learnerId, async () => {
      const state = readLocalState(learnerId, now);
      const previous = state.refillTimes.find((item) => item.key === key)?.startedAt;
      if (previous !== undefined && now >= previous && now - previous < cooldownMs) return false;
      state.refillTimes = state.refillTimes.filter((item) => item.key !== key);
      state.refillTimes.push({ key, startedAt: now });
      state.refillTimes = state.refillTimes.slice(-MAX_REFILL_TIMES);
      writeLocalState(learnerId, state);
      return true;
    });
  }
}

/**
 * Combines the device cache with a shared repository. Learner evidence is never stored in
 * shared blueprint documents; it remains in the per-account state repository.
 */
export class HybridContentPoolRepository implements ContentPoolRepository {
  constructor(
    private readonly local: ContentPoolRepository,
    private readonly shared: ContentPoolRepository
  ) {}

  async listBlueprints(request: ContentGenerationRequest): Promise<ContentPoolEntry[]> {
    const localEntries = await this.local.listBlueprints(request);
    try {
      const sharedEntries = await this.shared.listBlueprints(request);
      const byFingerprint = new Map<string, ContentPoolEntry>();
      for (const entry of [...localEntries, ...sharedEntries]) {
        const fingerprint = entry.blueprint.metadata.fingerprint;
        const current = byFingerprint.get(fingerprint);
        if (!current || entry.createdAt > current.createdAt) byFingerprint.set(fingerprint, entry);
      }
      return [...byFingerprint.values()];
    } catch (error) {
      console.warn("Shared generated-content lookup unavailable; using the validated device cache.", error);
      return localEntries;
    }
  }

  async saveValidatedBlueprint(
    blueprint: GameBlueprint,
    now: number,
    expiresAt: number
  ): Promise<PoolRepositorySaveResult> {
    const localResult = await this.local.saveValidatedBlueprint(blueprint, now, expiresAt);
    try {
      const sharedResult = await this.shared.saveValidatedBlueprint(blueprint, now, expiresAt);
      if (sharedResult.stored || sharedResult.duplicate) return { ...sharedResult, blueprint: sharedResult.blueprint ?? blueprint };
    } catch (error) {
      console.warn("Shared generated-content persistence unavailable; the validated device copy remains usable.", error);
    }
    return localResult;
  }

  async getLearnerState(learnerId: string, now: number): Promise<ContentPoolLearnerState> {
    const localState = await this.local.getLearnerState(learnerId, now);
    try {
      const sharedState = await this.shared.getLearnerState(learnerId, now);
      return mergeStates(localState, sharedState);
    } catch (error) {
      console.warn("Shared learner content state unavailable; using the isolated device state.", error);
      return localState;
    }
  }

  async reserve(
    learnerId: string,
    fingerprint: string,
    reservationId: string,
    now: number,
    expiresAt: number
  ): Promise<boolean> {
    try {
      const sharedReserved = await this.shared.reserve(learnerId, fingerprint, reservationId, now, expiresAt);
      if (!sharedReserved) return false;
    } catch (error) {
      console.warn("Shared content reservation unavailable; using the atomic device reservation.", error);
      return this.local.reserve(learnerId, fingerprint, reservationId, now, expiresAt);
    }

    const localReserved = await this.local.reserve(learnerId, fingerprint, reservationId, now, expiresAt);
    if (!localReserved) {
      await this.shared.releaseReservation(learnerId, fingerprint, reservationId).catch((error: unknown) => {
        console.warn("Could not release a conflicting shared reservation.", error);
      });
      return false;
    }
    return true;
  }

  async releaseReservation(learnerId: string, fingerprint: string, reservationId: string): Promise<void> {
    await this.local.releaseReservation(learnerId, fingerprint, reservationId);
    try {
      await this.shared.releaseReservation(learnerId, fingerprint, reservationId);
    } catch (error) {
      console.warn("Could not release shared content reservation.", error);
    }
  }

  async markPlayed(learnerId: string, fingerprint: string, now: number): Promise<void> {
    await this.local.markPlayed(learnerId, fingerprint, now);
    try {
      await this.shared.markPlayed(learnerId, fingerprint, now);
    } catch (error) {
      console.warn("Could not sync generated-content play state; local learner state was updated.", error);
    }
  }

  async markInvalid(learnerId: string, fingerprint: string, now: number): Promise<void> {
    await this.local.markInvalid(learnerId, fingerprint, now);
    try {
      await this.shared.markInvalid(learnerId, fingerprint, now);
    } catch (error) {
      console.warn("Could not sync invalid-content state; the device has quarantined it locally.", error);
    }
  }

  async startRefillCooldown(learnerId: string, key: string, now: number, cooldownMs: number): Promise<boolean> {
    try {
      const started = await this.shared.startRefillCooldown(learnerId, key, now, cooldownMs);
      if (started) await this.local.startRefillCooldown(learnerId, key, now, cooldownMs);
      return started;
    } catch (error) {
      console.warn("Shared refill coordination unavailable; using the device-local cooldown.", error);
      return this.local.startRefillCooldown(learnerId, key, now, cooldownMs);
    }
  }
}

export function mergeContentPoolLearnerStates(
  localState: ContentPoolLearnerState,
  sharedState: ContentPoolLearnerState
): ContentPoolLearnerState {
  return mergeStates(localState, sharedState);
}

