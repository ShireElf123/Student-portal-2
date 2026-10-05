import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import firebaseConfig from "../firebase-applet-config.json";
import { buildBlueprintContentPoolKey } from "../src/contentEngine/fingerprint";
import { CONTENT_POOL_POLICY } from "../src/contentEngine/policy";
import { validateGameBlueprint } from "../src/contentEngine/validation";
import { GAME_BLUEPRINT_VERSION, type GameBlueprint } from "../src/contentEngine/types";
import { resolveFirebaseProjectId } from "./contentAuth";

export const SERVER_VALIDATED_BLUEPRINT_SOURCE = "server-validated-v1" as const;
const ADMIN_APP_NAME = "student-portal-content-pool-writer";
const SHARED_BLUEPRINT_DOCUMENT_KEYS = [
  "source", "fingerprint", "poolKey", "gameType", "skillId", "gradeBand", "ageBand",
  "difficulty", "theme", "roundCount", "blueprintVersion", "createdAt", "expiresAt", "blueprint",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isServerValidatedDocument(data: unknown, fingerprint: string): data is Record<string, unknown> {
  if (!isRecord(data) || Object.keys(data).length !== SHARED_BLUEPRINT_DOCUMENT_KEYS.length ||
    !SHARED_BLUEPRINT_DOCUMENT_KEYS.every((key) => Object.hasOwn(data, key))) return false;
  const validation = validateGameBlueprint(data.blueprint);
  if (!validation.valid) return false;
  const blueprint = validation.blueprint;
  return data.source === SERVER_VALIDATED_BLUEPRINT_SOURCE &&
    data.fingerprint === fingerprint &&
    blueprint.metadata.fingerprint === fingerprint &&
    data.poolKey === buildBlueprintContentPoolKey(blueprint) &&
    data.gameType === blueprint.gameType &&
    data.skillId === blueprint.skillId &&
    data.gradeBand === blueprint.gradeBand &&
    data.ageBand === blueprint.ageBand &&
    data.difficulty === blueprint.difficulty &&
    data.theme === blueprint.theme &&
    data.roundCount === blueprint.content.rounds.length &&
    data.blueprintVersion === GAME_BLUEPRINT_VERSION &&
    typeof data.createdAt === "number" && Number.isFinite(data.createdAt) && data.createdAt > 0 &&
    typeof data.expiresAt === "number" && Number.isFinite(data.expiresAt) &&
    data.expiresAt > data.createdAt && data.expiresAt <= data.createdAt + CONTENT_POOL_POLICY.contentLifetimeMs;
}

function getAdminFirestore() {
  const projectId = resolveFirebaseProjectId();
  const databaseId = firebaseConfig.firestoreDatabaseId;
  if (!projectId || !databaseId) throw new Error("Firebase project and Firestore database IDs are required for shared content persistence.");
  const app = getApps().find((candidate) => candidate.name === ADMIN_APP_NAME) ?? initializeApp({
    credential: applicationDefault(),
    projectId,
  }, ADMIN_APP_NAME);
  return getFirestore(app, databaseId);
}

/**
 * Persists only a blueprint already approved by the server validator. Admin credentials
 * stay server-side; Firestore client rules deny all writes to the shared blueprint pool.
 */
export async function persistServerValidatedBlueprint(input: GameBlueprint): Promise<boolean> {
  const validation = validateGameBlueprint(input);
  if (!validation.valid) return false;
  const blueprint = validation.blueprint;
  const fingerprint = blueprint.metadata.fingerprint;
  const poolKey = buildBlueprintContentPoolKey(blueprint);
  const now = Date.now();
  const expiresAt = now + CONTENT_POOL_POLICY.contentLifetimeMs;

  try {
    const db = getAdminFirestore();
    const reference = db.collection("generatedGameBlueprints").doc(fingerprint);
    return await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(reference);
      if (snapshot.exists) {
        const existing: unknown = snapshot.data();
        if (isServerValidatedDocument(existing, fingerprint)) {
          if (typeof existing.expiresAt === "number" && existing.expiresAt > now) return true;
          transaction.update(reference, { expiresAt });
          return true;
        }
      }

      // Repair legacy or client-injected documents only with a newly server-validated value.
      transaction.set(reference, {
        source: SERVER_VALIDATED_BLUEPRINT_SOURCE,
        fingerprint,
        poolKey,
        gameType: blueprint.gameType,
        skillId: blueprint.skillId,
        gradeBand: blueprint.gradeBand,
        ageBand: blueprint.ageBand,
        difficulty: blueprint.difficulty,
        theme: blueprint.theme,
        roundCount: blueprint.content.rounds.length,
        blueprintVersion: GAME_BLUEPRINT_VERSION,
        createdAt: now,
        expiresAt,
        blueprint,
      });
      return true;
    });
  } catch (error) {
    console.warn("Server-validated content could not be synchronized to the shared Firestore pool.", error);
    return false;
  }
}
