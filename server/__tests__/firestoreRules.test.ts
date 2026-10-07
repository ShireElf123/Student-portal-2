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
import firebaseIndexConfig from "../../firestore.indexes.json";
import { getAdminFirestore } from "../adminFirestore";
import { FirestoreAiQuotaStore } from "../aiQuota";
import type { Firestore } from "firebase-admin/firestore";

describe("Firestore rules deployment configuration", () => {
  it("targets the same named database used by the application", () => {
    expect(firebaseCliConfig.firestore.database).toBe(appFirebaseConfig.firestoreDatabaseId);
    expect(firebaseCliConfig.firestore.rules).toBe("firestore.rules");
    expect(firebaseCliConfig.firestore.indexes).toBe("firestore.indexes.json");
    expect(firebaseIndexConfig.fieldOverrides).toContainEqual({
      collectionGroup: "aiUsageWindows",
      fieldPath: "expiresAt",
      ttl: true,
      indexes: [],
    });
  });
});

const runFirestoreRulesTests = process.env.FIRESTORE_RULES_EMULATOR === "1";
const firestoreRulesDescribe = runFirestoreRulesTests ? describe : describe.skip;
const TEST_PROJECT_ID = "demo-student-portal-rules";
const SERVER_VALIDATED_SOURCE = "server-validated-v1";
const SERVER_FINGERPRINT = "fnv1a64-0123456789abcdef";
const PRIVATE_FINGERPRINT = "fnv1a64-fedcba9876543210";

firestoreRulesDescribe("Firestore shared-content, learner-state, and AI quota security rules", () => {
  let testEnvironment: RulesTestEnvironment;
  let adminDatabase: Firestore | null = null;
  const quotaStore = new FirestoreAiQuotaStore();
  const quotaTestTime = Date.UTC(2026, 9, 5, 12, 0, 0);

  beforeAll(async () => {
    const emulatorAddress = process.env.FIRESTORE_EMULATOR_HOST ?? "127.0.0.1:8080";
    const [host, portText] = emulatorAddress.split(":");
    if (!host || !portText || !/^\d+$/.test(portText)) {
      throw new Error(`Invalid FIRESTORE_EMULATOR_HOST: ${emulatorAddress}`);
    }
    process.env.FIREBASE_PROJECT_ID = TEST_PROJECT_ID;
    testEnvironment = await initializeTestEnvironment({
      projectId: TEST_PROJECT_ID,
      firestore: {
        host,
        port: Number(portText),
        rules: readFileSync(new URL("../../firestore.rules", import.meta.url), "utf8"),
      },
    });
    adminDatabase = getAdminFirestore();
  });

  beforeEach(async () => {
    await testEnvironment.clearFirestore();
  });

  afterAll(async () => {
    await adminDatabase?.terminate();
    await testEnvironment?.cleanup();
  });

  let quotaIdSequence = 0;
  function newQuotaId(prefix: string): string {
    quotaIdSequence += 1;
    return `${prefix}-${quotaIdSequence}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function quotaDatabase(): Firestore {
    if (!adminDatabase) throw new Error("Admin Firestore is not available in this test.");
    return adminDatabase;
  }

  async function provisionOrganization(
    organizationId: string,
    limits: { dailyLimit: number; perMinuteLimit: number; memberDailyLimit?: number; memberPerMinuteLimit?: number }
  ): Promise<void> {
    await quotaDatabase().collection("organizations").doc(organizationId).set({
      status: "active",
      ai: {
        enabled: true,
        dailyLimit: limits.dailyLimit,
        perMinuteLimit: limits.perMinuteLimit,
        memberDailyLimit: limits.memberDailyLimit ?? 100,
        memberPerMinuteLimit: limits.memberPerMinuteLimit ?? 10,
      },
    });
  }

  async function provisionMembership(userId: string, organizationId: string, status = "active"): Promise<void> {
    await quotaDatabase().collection("users").doc(userId)
      .collection("organizationMemberships").doc(organizationId).set({
        organizationId,
        status,
        role: "learner",
      });
  }

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

  it("allows users to inspect only their membership while denying client control of memberships and quota data", async () => {
    const userId = newQuotaId("rules-user");
    const organizationId = newQuotaId("rules-org");
    await testEnvironment.withSecurityRulesDisabled(async (adminContext) => {
      const database = adminContext.firestore();
      await setDoc(doc(database, "users", userId, "organizationMemberships", organizationId), {
        organizationId,
        status: "active",
        role: "learner",
      });
      await setDoc(doc(database, "users", userId, "aiEntitlements", "current"), { enabled: true, dailyLimit: 500 });
      await setDoc(doc(database, "users", userId, "aiUsageWindows", "day_2026-10-05"), { totalUnits: 1 });
      await setDoc(doc(database, "organizations", organizationId), { status: "active", ai: { enabled: true } });
      await setDoc(doc(database, "organizations", organizationId, "aiUsageWindows", "day_2026-10-05"), { totalUnits: 1 });
    });

    const ownerDb = testEnvironment.authenticatedContext(userId).firestore();
    const membership = doc(ownerDb, "users", userId, "organizationMemberships", organizationId);
    const entitlement = doc(ownerDb, "users", userId, "aiEntitlements", "current");
    const userUsage = doc(ownerDb, "users", userId, "aiUsageWindows", "day_2026-10-05");
    const organization = doc(ownerDb, "organizations", organizationId);
    const organizationUsage = doc(ownerDb, "organizations", organizationId, "aiUsageWindows", "day_2026-10-05");

    await assertSucceeds(getDoc(membership));
    await assertFails(setDoc(membership, { organizationId, status: "active", role: "owner" }));
    await assertFails(updateDoc(membership, { role: "owner" }));
    await assertFails(getDoc(entitlement));
    await assertFails(setDoc(entitlement, { enabled: true, dailyLimit: 1_000_000 }));
    await assertFails(getDoc(userUsage));
    await assertFails(setDoc(userUsage, { totalUnits: 0 }));
    await assertFails(getDoc(organization));
    await assertFails(setDoc(organization, { status: "active", ai: { enabled: true } }));
    await assertFails(getDoc(organizationUsage));
    await assertFails(setDoc(organizationUsage, { totalUnits: 0 }));
  });

  it("admits users without an organization using server defaults and shares personal quota across features", async () => {
    const userId = newQuotaId("personal-user");
    const first = await quotaStore.consume({ uid: userId, feature: "chat", units: 1, now: quotaTestTime });
    expect(first).toMatchObject({ allowed: true, organizationId: null, scope: "user" });

    await quotaDatabase().collection("users").doc(userId).collection("aiEntitlements").doc("current").set({
      enabled: true,
      dailyLimit: 2,
      perMinuteLimit: 10,
    });
    const second = await quotaStore.consume({ uid: userId, feature: "practice", units: 1, now: quotaTestTime + 1_000 });
    const third = await quotaStore.consume({ uid: userId, feature: "study_plan", units: 1, now: quotaTestTime + 2_000 });
    expect(second.allowed).toBe(true);
    expect(third).toMatchObject({ allowed: false, status: 429, code: "USER_DAILY_QUOTA_EXCEEDED" });
  });

  it("fails closed when stored quota totals do not match their per-feature counters", async () => {
    const userId = newQuotaId("corrupt-quota-user");
    await quotaDatabase().collection("users").doc(userId).collection("aiUsageWindows")
      .doc("day_2026-10-05").set({
        schemaVersion: 1,
        windowKey: "day_2026-10-05",
        totalUnits: 0,
        byAction: { chat: 1, practice: 0, study_plan: 0, content: 0 },
      });

    const decision = await quotaStore.consume({ uid: userId, feature: "chat", units: 1, now: quotaTestTime });
    expect(decision).toMatchObject({ allowed: false, status: 503, code: "AI_QUOTA_UNAVAILABLE" });
  });

  it("enforces one shared organization daily limit across different members under concurrency", async () => {
    const organizationId = newQuotaId("shared-school");
    const userIds = [newQuotaId("member"), newQuotaId("member"), newQuotaId("member")];
    await provisionOrganization(organizationId, { dailyLimit: 2, perMinuteLimit: 100, memberDailyLimit: 10, memberPerMinuteLimit: 10 });
    await Promise.all(userIds.map((userId) => provisionMembership(userId, organizationId)));

    const decisions = await Promise.all(userIds.map((uid) => quotaStore.consume({
      uid,
      organizationId,
      feature: "chat",
      units: 1,
      now: quotaTestTime,
    })));
    expect(decisions.filter((decision) => decision.allowed)).toHaveLength(2);
    expect(decisions.filter((decision) => !decision.allowed).map((decision) => decision.code))
      .toEqual(["ORGANIZATION_DAILY_QUOTA_EXCEEDED"]);

    const usage = await quotaDatabase().collection("organizations").doc(organizationId)
      .collection("aiUsageWindows").doc("day_2026-10-05").get();
    expect(usage.data()?.totalUnits).toBe(2);
    expect(usage.data()?.expiresAt).toBeDefined();
  });

  it("requires an explicit choice for multiple memberships and verifies every requested organization", async () => {
    const userId = newQuotaId("multi-org-user");
    const firstOrganization = newQuotaId("first-org");
    const secondOrganization = newQuotaId("second-org");
    await Promise.all([
      provisionOrganization(firstOrganization, { dailyLimit: 100, perMinuteLimit: 100 }),
      provisionOrganization(secondOrganization, { dailyLimit: 100, perMinuteLimit: 100 }),
      provisionMembership(userId, firstOrganization),
      provisionMembership(userId, secondOrganization),
    ]);

    const unspecified = await quotaStore.consume({ uid: userId, feature: "chat", units: 1, now: quotaTestTime });
    expect(unspecified).toMatchObject({ allowed: false, status: 409, code: "ORGANIZATION_SELECTION_REQUIRED" });
    const selected = await quotaStore.consume({ uid: userId, organizationId: firstOrganization, feature: "chat", units: 1, now: quotaTestTime });
    expect(selected).toMatchObject({ allowed: true, organizationId: firstOrganization, scope: "user+organization" });
    const unjoined = await quotaStore.consume({ uid: userId, organizationId: newQuotaId("not-a-member"), feature: "chat", units: 1, now: quotaTestTime });
    expect(unjoined).toMatchObject({ allowed: false, status: 403, code: "ORGANIZATION_ACCESS_DENIED" });
  });

  it("ignores suspended memberships for automatic selection and enforces the content-specific cap", async () => {
    const userId = newQuotaId("suspended-user");
    const organizationId = newQuotaId("suspended-org");
    await provisionOrganization(organizationId, { dailyLimit: 100, perMinuteLimit: 100 });
    await provisionMembership(userId, organizationId, "suspended");
    const personalAccess = await quotaStore.consume({ uid: userId, feature: "chat", units: 1, now: quotaTestTime });
    expect(personalAccess).toMatchObject({ allowed: true, organizationId: null });

    const contentUser = newQuotaId("content-user");
    const contentDecisions = await Promise.all(Array.from({ length: 3 }, (_, index) => quotaStore.consume({
      uid: contentUser,
      feature: "content",
      units: 1,
      now: quotaTestTime + Math.floor(index / 3) * 60_000,
    })));
    expect(contentDecisions.every((decision) => decision.allowed)).toBe(true);
    const contentRateLimited = await quotaStore.consume({
      uid: contentUser,
      feature: "content",
      units: 1,
      now: quotaTestTime,
    });
    expect(contentRateLimited).toMatchObject({ allowed: false, status: 429, code: "CONTENT_RATE_LIMIT_EXCEEDED" });
  });
});
