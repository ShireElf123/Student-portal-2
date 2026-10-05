import { buildBlueprintContentPoolKey, buildContentPoolKey } from "./fingerprint";
import {
  CONTENT_POOL_LEARNER_STATE_VERSION,
  MAX_INVALID_FINGERPRINTS,
  MAX_REFILL_TIMES,
  MAX_RESERVATIONS,
  MAX_PLAYED_FINGERPRINTS,
  normalizeContentPoolState,
} from "./contentPoolRepository";
import type {
  ContentPoolEntry,
  ContentPoolLearnerState,
  ContentPoolRepository,
  PoolRepositorySaveResult,
} from "./contentPoolRepository";
import { validateGameBlueprint } from "./validation";
import { GAME_BLUEPRINT_VERSION, type ContentGenerationRequest, type GameBlueprint } from "./types";
import { MAX_CACHED_BLUEPRINTS as LOCAL_MAX_CACHED_BLUEPRINTS } from "./cache";

const FINGERPRINT_PATTERN = /^fnv1a64-[0-9a-f]{16}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function emptyFirestoreState(now: number): ContentPoolLearnerState {
  return normalizeContentPoolState({
    version: CONTENT_POOL_LEARNER_STATE_VERSION,
    playedFingerprints: [],
    invalidFingerprints: [],
    reservations: [],
    refillTimes: [],
  }, now);
}

/**
 * Client Firestore implementation for reading server-approved shared blueprints and
 * maintaining owner-scoped learner state. Shared blueprint writes are server-only.
 */
export class FirestoreContentPoolRepository implements ContentPoolRepository {
  constructor(private readonly ownerUid: string) {
    if (!ownerUid.trim() || ownerUid.includes("/")) throw new Error("A valid Firebase owner UID is required.");
  }

  private stateDocumentId(learnerId: string): string {
    if (!learnerId.trim()) throw new Error("A learner ID is required for content state.");
    return encodeURIComponent(learnerId);
  }

  async listBlueprints(request: ContentGenerationRequest): Promise<ContentPoolEntry[]> {
    const [{ db }, firestore] = await Promise.all([import("../firebase"), import("firebase/firestore")]);
    const poolKey = buildContentPoolKey(request);
    const snapshots = await firestore.getDocs(firestore.query(
      firestore.collection(db, "generatedGameBlueprints"),
      firestore.where("source", "==", "server-validated-v1"),
      firestore.where("poolKey", "==", poolKey),
      firestore.limit(LOCAL_MAX_CACHED_BLUEPRINTS)
    ));
    const entries: ContentPoolEntry[] = [];
    for (const snapshot of snapshots.docs) {
      const data: unknown = snapshot.data();
      if (!isRecord(data) || data.source !== "server-validated-v1" || data.poolKey !== poolKey || data.fingerprint !== snapshot.id ||
        !FINGERPRINT_PATTERN.test(snapshot.id) || data.blueprintVersion !== GAME_BLUEPRINT_VERSION ||
        !Number.isFinite(data.createdAt) || !Number.isFinite(data.expiresAt)) continue;
      const validation = validateGameBlueprint(data.blueprint);
      if (!validation.valid || validation.blueprint.metadata.fingerprint !== snapshot.id ||
        buildBlueprintContentPoolKey(validation.blueprint) !== poolKey) continue;
      entries.push({
        blueprint: validation.blueprint,
        createdAt: Number(data.createdAt),
        expiresAt: Number(data.expiresAt),
      });
    }
    return entries.sort((left, right) => right.createdAt - left.createdAt).slice(0, LOCAL_MAX_CACHED_BLUEPRINTS);
  }

  async saveValidatedBlueprint(
    blueprint: GameBlueprint,
    _now: number,
    _expiresAt: number
  ): Promise<PoolRepositorySaveResult> {
    if (!validateGameBlueprint(blueprint).valid) {
      return { stored: false, duplicate: false, error: "Only deterministically validated blueprints can be persisted." };
    }
    return {
      stored: false,
      duplicate: false,
      error: "Shared blueprint writes are restricted to the authenticated generation server.",
    };
  }

  async getLearnerState(learnerId: string, now: number): Promise<ContentPoolLearnerState> {
    const [{ db }, firestore] = await Promise.all([import("../firebase"), import("firebase/firestore")]);
    const reference = firestore.doc(
      db,
      "users",
      this.ownerUid,
      "generatedContentState",
      this.stateDocumentId(learnerId)
    );
    const snapshot = await firestore.getDoc(reference);
    return snapshot.exists() ? normalizeContentPoolState(snapshot.data(), now) : emptyFirestoreState(now);
  }

  async reserve(
    learnerId: string,
    fingerprint: string,
    reservationId: string,
    now: number,
    expiresAt: number
  ): Promise<boolean> {
    return this.updateLearnerState(learnerId, now, (state) => {
      if (state.playedFingerprints.includes(fingerprint) || state.invalidFingerprints.includes(fingerprint) ||
        state.reservations.some((reservation) => reservation.fingerprint === fingerprint && reservation.expiresAt > now)) {
        return { state, result: false, write: false };
      }
      state.reservations = state.reservations.filter((reservation) => reservation.expiresAt > now);
      if (state.reservations.length >= MAX_RESERVATIONS) return { state, result: false, write: false };
      state.reservations.push({ fingerprint, reservationId, reservedAt: now, expiresAt });
      return { state, result: true };
    });
  }

  async releaseReservation(learnerId: string, fingerprint: string, reservationId: string): Promise<void> {
    await this.updateLearnerState(learnerId, Date.now(), (state) => ({
      state: {
        ...state,
        reservations: state.reservations.filter((reservation) =>
          reservation.fingerprint !== fingerprint || reservation.reservationId !== reservationId
        ),
      },
      result: undefined,
    }));
  }

  async markPlayed(learnerId: string, fingerprint: string, now: number): Promise<void> {
    await this.updateLearnerState(learnerId, now, (state) => ({
      state: {
        ...state,
        reservations: state.reservations.filter((reservation) => reservation.fingerprint !== fingerprint),
        playedFingerprints: [...new Set([...state.playedFingerprints, fingerprint])].slice(-MAX_PLAYED_FINGERPRINTS),
      },
      result: undefined,
    }));
  }

  async markInvalid(learnerId: string, fingerprint: string, now: number): Promise<void> {
    await this.updateLearnerState(learnerId, now, (state) => ({
      state: {
        ...state,
        reservations: state.reservations.filter((reservation) => reservation.fingerprint !== fingerprint),
        invalidFingerprints: [...new Set([...state.invalidFingerprints, fingerprint])].slice(-MAX_INVALID_FINGERPRINTS),
      },
      result: undefined,
    }));
  }

  async startRefillCooldown(learnerId: string, key: string, now: number, cooldownMs: number): Promise<boolean> {
    return this.updateLearnerState(learnerId, now, (state) => {
      const previous = state.refillTimes.find((item) => item.key === key)?.startedAt;
      if (previous !== undefined && now >= previous && now - previous < cooldownMs) {
        return { state, result: false, write: false };
      }
      state.refillTimes = state.refillTimes.filter((item) => item.key !== key);
      state.refillTimes.push({ key, startedAt: now });
      state.refillTimes = state.refillTimes.slice(-MAX_REFILL_TIMES);
      return { state, result: true };
    });
  }

  private async updateLearnerState<Result>(
    learnerId: string,
    now: number,
    update: (state: ContentPoolLearnerState) => { state: ContentPoolLearnerState; result: Result; write?: boolean }
  ): Promise<Result> {
    const [{ db }, firestore] = await Promise.all([import("../firebase"), import("firebase/firestore")]);
    const reference = firestore.doc(
      db,
      "users",
      this.ownerUid,
      "generatedContentState",
      this.stateDocumentId(learnerId)
    );
    return firestore.runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(reference);
      const initialState = snapshot.exists() ? normalizeContentPoolState(snapshot.data(), now) : emptyFirestoreState(now);
      const updated = update(initialState);
      if (updated.write !== false) {
        transaction.set(reference, {
          version: CONTENT_POOL_LEARNER_STATE_VERSION,
          playedFingerprints: updated.state.playedFingerprints,
          invalidFingerprints: updated.state.invalidFingerprints,
          reservations: updated.state.reservations,
          refillTimes: updated.state.refillTimes,
          updatedAt: now,
        });
      }
      return updated.result;
    });
  }
}
