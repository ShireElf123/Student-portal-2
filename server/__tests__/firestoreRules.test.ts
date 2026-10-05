import { readFileSync } from "node:fs";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { afterAll, beforeAll, beforeEach, describe, it, expect } from "vitest";
import appFirebaseConfig from "../../firebase-applet-config.json";
import firebaseCliConfig from "../../firebase.json";

describe("Firestore rules deployment configuration", () => {
  it("targets the same named database used by the application", () => {
    expect(firebaseCliConfig.firestore.database).toBe(appFirebaseConfig.firestoreDatabaseId);
    expect(firebaseCliConfig.firestore.rules).toBe("firestore.rules");
  });
});

const runFirestoreRulesTests = process.env.FIRESTORE_RULES_EMULATOR === "1";
const firestoreRulesDescribe = runFirestoreRulesTests ? describe : describe.skip;
const TEST_PROJECT_ID = "demo-student-portal-rules";
const SERVER_VALIDATED_SOURCE = "server-validated-v1";
const SERVER_FINGERPRINT = "fnv1a64-0123456789abcdef";
const PRIVATE_FINGERPRINT = "fnv1a64-fedcba9876543210";

firestoreRulesDescribe("Firestore shared-content and learner-state security rules", () => {
  let testEnvironment: RulesTestEnvironment;

  beforeAll(async () => {
    const emulatorAddress = process.env.FIRESTORE_EMULATOR_HOST ?? "127.0.0.1:8080";
    const [host, portText] = emulatorAddress.split(":");
    if (!host || !portText || !/^\d+$/.test(portText)) {
      throw new Error(`Invalid FIRESTORE_EMULATOR_HOST: ${emulatorAddress}`);
    }
    testEnvironment = await initializeTestEnvironment({
      projectId: TEST_PROJECT_ID,
      firestore: {
        host,
        port: Number(portText),
        rules: readFileSync(new URL("../../firestore.rules", import.meta.url), "utf8"),
      },
    });
  });

  beforeEach(async () => {
    await testEnvironment.clearFirestore();
  });

  afterAll(async () => {
    await testEnvironment?.cleanup();
  });

  it("blocks unauthenticated, fabricated, malformed, update, and delete writes to shared blueprints", async () => {
    const unauthenticated = testEnvironment.unauthenticatedContext().firestore();
    const client = testEnvironment.authenticatedContext("client-account-a").firestore();
    const fabricatedDocument = {
      source: SERVER_VALIDATED_SOURCE,
      fingerprint: SERVER_FINGERPRINT,
      blueprint: { gameType: "speed-math", learnerId: "private-child-id", learnerContext: { mastery: "secure" } },
    };

    await assertFails(setDoc(doc(unauthenticated, "generatedGameBlueprints", SERVER_FINGERPRINT), fabricatedDocument));
    await assertFails(setDoc(doc(client, "generatedGameBlueprints", SERVER_FINGERPRINT), fabricatedDocument));
    await assertFails(setDoc(doc(client, "generatedGameBlueprints", "malformed-id"), { arbitrary: true }));

    await testEnvironment.withSecurityRulesDisabled(async (adminContext) => {
      await setDoc(doc(adminContext.firestore(), "generatedGameBlueprints", SERVER_FINGERPRINT), {
        ...fabricatedDocument,
        blueprint: { gameType: "speed-math", objective: "Server-approved content." },
      });
    });

    await assertFails(updateDoc(doc(client, "generatedGameBlueprints", SERVER_FINGERPRINT), { theme: "ocean" }));
    await assertFails(deleteDoc(doc(client, "generatedGameBlueprints", SERVER_FINGERPRINT)));
  });

  it("allows signed-in clients to read only server-provenance shared documents", async () => {
    await testEnvironment.withSecurityRulesDisabled(async (adminContext) => {
      const adminDb = adminContext.firestore();
      await setDoc(doc(adminDb, "generatedGameBlueprints", SERVER_FINGERPRINT), {
        source: SERVER_VALIDATED_SOURCE,
        fingerprint: SERVER_FINGERPRINT,
        blueprint: { gameType: "speed-math", objective: "Server-approved content." },
      });
      await setDoc(doc(adminDb, "generatedGameBlueprints", PRIVATE_FINGERPRINT), {
        fingerprint: PRIVATE_FINGERPRINT,
        blueprint: { gameType: "speed-math", objective: "Unproven legacy content." },
      });
    });

    const client = testEnvironment.authenticatedContext("client-account-b").firestore();
    const trustedReference = doc(client, "generatedGameBlueprints", SERVER_FINGERPRINT);
    const unprovenReference = doc(client, "generatedGameBlueprints", PRIVATE_FINGERPRINT);
    await assertSucceeds(getDoc(trustedReference));
    await assertFails(getDoc(unprovenReference));
    await assertFails(getDocs(collection(client, "generatedGameBlueprints")));
    await assertSucceeds(getDocs(query(
      collection(client, "generatedGameBlueprints"),
      where("source", "==", SERVER_VALIDATED_SOURCE)
    )));
    await assertFails(getDoc(doc(testEnvironment.unauthenticatedContext().firestore(), "generatedGameBlueprints", SERVER_FINGERPRINT)));
  });

  it("isolates generated-content learner state to the owning signed-in account", async () => {
    const learnerState = {
      version: "content-pool-learner-state-v1",
      playedFingerprints: [SERVER_FINGERPRINT],
      invalidFingerprints: [],
      reservations: [],
      refillTimes: [],
      updatedAt: 1_790_000_000_000,
    };
    const ownerDb = testEnvironment.authenticatedContext("account-owner").firestore();
    const otherAccountDb = testEnvironment.authenticatedContext("other-account").firestore();
    const ownerReference = doc(ownerDb, "users", "account-owner", "generatedContentState", "learner-one");
    const otherReference = doc(otherAccountDb, "users", "account-owner", "generatedContentState", "learner-one");

    await assertSucceeds(setDoc(ownerReference, learnerState));
    await assertSucceeds(getDoc(ownerReference));
    await assertFails(getDoc(otherReference));
    await assertFails(getDocs(collection(otherAccountDb, "users", "account-owner", "generatedContentState")));
  });
});
