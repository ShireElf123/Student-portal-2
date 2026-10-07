import { Timestamp } from "firebase-admin/firestore";
import { getAdminFirestore } from "./adminFirestore";

export const AI_FEATURES = ["chat", "practice", "study_plan", "content"] as const;
export type AiFeature = typeof AI_FEATURES[number];

export const AI_QUOTA_DEFAULTS = {
  userDailyUnits: 20,
  userPerMinuteUnits: 5,
  organizationDailyUnits: 2_000,
  organizationPerMinuteUnits: 120,
  organizationMemberDailyUnits: 100,
  organizationMemberPerMinuteUnits: 10,
  contentDailyRequests: 12,
  contentPerMinuteRequests: 3,
} as const;

export const AI_QUOTA_MAXIMUMS = {
  userDailyUnits: 100_000,
  userPerMinuteUnits: 10_000,
  organizationDailyUnits: 10_000_000,
  organizationPerMinuteUnits: 1_000_000,
} as const;

export interface AiQuotaRequest {
  uid: string;
  organizationId?: string;
  feature: AiFeature;
  units: number;
  now: number;
}

export interface AiQuotaAllowed {
  allowed: true;
  organizationId: string | null;
  scope: "user" | "organization" | "user+organization";
  dailyLimitUnits: number;
  remainingDailyUnits: number;
  resetAt: number;
}

export interface AiQuotaDenied {
  allowed: false;
  status: 400 | 401 | 403 | 409 | 429 | 503;
  code: string;
  error: string;
  retryAfterSeconds: number;
}

export type AiQuotaDecision = AiQuotaAllowed | AiQuotaDenied;

export interface AiQuotaStore {
  consume(request: AiQuotaRequest): Promise<AiQuotaDecision>;
}

interface UsageWindow {
  totalUnits: number;
  byAction: Record<AiFeature, number>;
}

interface ScopeLimits {
  daily: number;
  perMinute: number;
}

const SAFE_DOCUMENT_ID = /^[A-Za-z0-9_-]{1,128}$/;
const MAX_REQUEST_UNITS = 10;
const MINUTE_MS = 60_000;
const DAY_MS = 24 * 60 * 60 * 1_000;
const MAX_DATE_MILLIS = 8_640_000_000_000_000;
const USAGE_WINDOW_RETENTION_MS = 14 * DAY_MS;

class AiQuotaConfigurationError extends Error {}
class AiQuotaDisabledError extends Error {}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function denied(
  status: AiQuotaDenied["status"],
  code: string,
  error: string,
  retryAfterSeconds = 0
): AiQuotaDenied {
  return { allowed: false, status, code, error, retryAfterSeconds };
}

function isNonNegativeSafeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

function safeLimit(
  settings: Record<string, unknown> | null,
  field: string,
  fallback: number,
  maximum: number
): number {
  if (!settings || !Object.hasOwn(settings, field)) return fallback;
  const configured = settings[field];
  if (!isNonNegativeSafeInteger(configured) || configured > maximum) {
    throw new AiQuotaConfigurationError(`Invalid server-managed AI quota field: ${field}`);
  }
  return configured;
}

function parseWindow(snapshot: { exists: boolean; data: () => Record<string, unknown> | undefined }, windowKey: string): UsageWindow {
  const byAction: Record<AiFeature, number> = { chat: 0, practice: 0, study_plan: 0, content: 0 };
  if (!snapshot.exists) return { totalUnits: 0, byAction };

  const data = snapshot.data();
  if (!data || data.schemaVersion !== 1 || data.windowKey !== windowKey ||
    !isNonNegativeSafeInteger(data.totalUnits) || !isRecord(data.byAction)) {
    throw new AiQuotaConfigurationError("Stored AI quota usage has an invalid shape.");
  }
  for (const key of Object.keys(data.byAction)) {
    if (!(AI_FEATURES as readonly string[]).includes(key)) {
      throw new AiQuotaConfigurationError("Stored AI quota usage contains an unknown feature.");
    }
  }
  for (const feature of AI_FEATURES) {
    const count = data.byAction[feature];
    if (count !== undefined) {
      if (!isNonNegativeSafeInteger(count)) {
        throw new AiQuotaConfigurationError("Stored AI quota usage contains an invalid feature counter.");
      }
      byAction[feature] = count;
    }
  }
  const actionTotal = AI_FEATURES.reduce((total, feature) => total + byAction[feature], 0);
  if (!Number.isSafeInteger(actionTotal) || actionTotal !== data.totalUnits) {
    throw new AiQuotaConfigurationError("Stored AI quota totals do not match their feature counters.");
  }
  return { totalUnits: data.totalUnits, byAction };
}

function nextUtcDay(now: number): number {
  const date = new Date(now);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1);
}

function nextUtcMinute(now: number): number {
  const date = new Date(now);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes() + 1);
}

function secondsUntil(resetAt: number, now: number): number {
  return Math.max(1, Math.ceil((resetAt - now) / 1_000));
}

function validateMembership(data: unknown, organizationId: string): boolean {
  if (!isRecord(data)) return false;
  return data.organizationId === organizationId &&
    data.status === "active" &&
    ["owner", "admin", "educator", "learner", "parent", "member"].includes(String(data.role));
}

function readOrganizationLimits(data: unknown): {
  organization: ScopeLimits;
  member: ScopeLimits;
} | null {
  if (!isRecord(data) || data.status !== "active") return null;
  const aiSettings = isRecord(data.ai) ? data.ai : null;
  if (aiSettings?.enabled !== true) return null;
  return {
    organization: {
      daily: safeLimit(aiSettings, "dailyLimit", AI_QUOTA_DEFAULTS.organizationDailyUnits, AI_QUOTA_MAXIMUMS.organizationDailyUnits),
      perMinute: safeLimit(aiSettings, "perMinuteLimit", AI_QUOTA_DEFAULTS.organizationPerMinuteUnits, AI_QUOTA_MAXIMUMS.organizationPerMinuteUnits),
    },
    member: {
      daily: safeLimit(aiSettings, "memberDailyLimit", AI_QUOTA_DEFAULTS.organizationMemberDailyUnits, AI_QUOTA_MAXIMUMS.userDailyUnits),
      perMinute: safeLimit(aiSettings, "memberPerMinuteLimit", AI_QUOTA_DEFAULTS.organizationMemberPerMinuteUnits, AI_QUOTA_MAXIMUMS.userPerMinuteUnits),
    },
  };
}

function readUserLimits(data: unknown, fallback: ScopeLimits, maximums: ScopeLimits): ScopeLimits {
  if (data === undefined) return fallback;
  if (!isRecord(data)) throw new AiQuotaConfigurationError("Server-managed AI entitlement has an invalid shape.");
  if (Object.hasOwn(data, "enabled") && typeof data.enabled !== "boolean") {
    throw new AiQuotaConfigurationError("Server-managed AI entitlement has an invalid enabled flag.");
  }
  if (data.enabled === false) throw new AiQuotaDisabledError("AI access is disabled for this account.");
  return {
    daily: safeLimit(data, "dailyLimit", fallback.daily, maximums.daily),
    perMinute: safeLimit(data, "perMinuteLimit", fallback.perMinute, maximums.perMinute),
  };
}

function createWindowKey(date: Date, kind: "day" | "minute"): string {
  if (kind === "day") return `day_${date.toISOString().slice(0, 10)}`;
  return `minute_${date.toISOString().slice(0, 16).replace(/[-:T]/g, "")}`;
}

/**
 * Firestore-backed, cross-process quota accounting. Membership, entitlement and all
 * usage windows are read and reserved in one Firestore transaction; a failed store
 * operation is always handled fail-closed by the shared gateway.
 */
export class FirestoreAiQuotaStore implements AiQuotaStore {
  async consume(request: AiQuotaRequest): Promise<AiQuotaDecision> {
    if (!SAFE_DOCUMENT_ID.test(request.uid)) {
      return denied(401, "INVALID_IDENTITY", "Your sign-in could not be verified. Please sign in again.");
    }
    if (request.organizationId !== undefined && !SAFE_DOCUMENT_ID.test(request.organizationId)) {
      return denied(400, "INVALID_ORGANIZATION_SELECTION", "The selected organization is invalid.");
    }
    if (!(AI_FEATURES as readonly string[]).includes(request.feature) ||
      !Number.isSafeInteger(request.units) || request.units < 1 || request.units > MAX_REQUEST_UNITS ||
      !Number.isSafeInteger(request.now) || !Number.isFinite(request.now) || Math.abs(request.now) > MAX_DATE_MILLIS) {
      return denied(400, "INVALID_AI_REQUEST", "The AI request is invalid.");
    }

    const db = getAdminFirestore();
    const currentDate = new Date(request.now);
    const dayKey = createWindowKey(currentDate, "day");
    const minuteKey = createWindowKey(currentDate, "minute");
    const dayResetAt = nextUtcDay(request.now);
    const minuteResetAt = nextUtcMinute(request.now);
    const userRef = db.collection("users").doc(request.uid);
    const userEntitlementRef = userRef.collection("aiEntitlements").doc("current");
    const userWindows = userRef.collection("aiUsageWindows");
    const userDayRef = userWindows.doc(dayKey);
    const userMinuteRef = userWindows.doc(minuteKey);

    try {
      return await db.runTransaction(async (transaction): Promise<AiQuotaDecision> => {
        const [entitlementSnapshot, userDaySnapshot, userMinuteSnapshot] = await transaction.getAll(
          userEntitlementRef,
          userDayRef,
          userMinuteRef
        );
        const membershipCollection = userRef.collection("organizationMemberships");
        let organizationId: string | null = null;

        if (request.organizationId) {
          const membershipSnapshot = await transaction.get(membershipCollection.doc(request.organizationId));
          if (!membershipSnapshot.exists || !validateMembership(membershipSnapshot.data(), request.organizationId)) {
            return denied(403, "ORGANIZATION_ACCESS_DENIED", "You do not have active access to the selected organization.");
          }
          organizationId = request.organizationId;
        } else {
          const membershipsSnapshot = await transaction.get(
            membershipCollection.where("status", "==", "active").limit(2)
          );
          if (membershipsSnapshot.docs.length > 1) {
            return denied(409, "ORGANIZATION_SELECTION_REQUIRED", "Select an organization before using AI features.");
          }
          if (membershipsSnapshot.docs.length === 1) {
            const membership = membershipsSnapshot.docs[0];
            if (!validateMembership(membership.data(), membership.id)) {
              throw new AiQuotaConfigurationError("An active organization membership has an invalid shape.");
            }
            organizationId = membership.id;
          }
        }

        const userEntitlementData: unknown = entitlementSnapshot.exists ? entitlementSnapshot.data() : undefined;
        const userUsageDay = parseWindow(userDaySnapshot, dayKey);
        const userUsageMinute = parseWindow(userMinuteSnapshot, minuteKey);
        let userFallbackLimits: ScopeLimits = {
          daily: AI_QUOTA_DEFAULTS.userDailyUnits,
          perMinute: AI_QUOTA_DEFAULTS.userPerMinuteUnits,
        };
        let organizationLimits: ScopeLimits | null = null;
        let memberLimits: ScopeLimits | null = null;
        let organizationDayRef: ReturnType<typeof db.doc> | null = null;
        let organizationMinuteRef: ReturnType<typeof db.doc> | null = null;
        let organizationDayUsage: UsageWindow | null = null;
        let organizationMinuteUsage: UsageWindow | null = null;

        if (organizationId) {
          const organizationRef = db.collection("organizations").doc(organizationId);
          const organizationDay = db.collection("organizations").doc(organizationId)
            .collection("aiUsageWindows").doc(dayKey);
          const organizationMinute = db.collection("organizations").doc(organizationId)
            .collection("aiUsageWindows").doc(minuteKey);
          const [organizationSnapshot, organizationDaySnapshot, organizationMinuteSnapshot] = await transaction.getAll(
            organizationRef,
            organizationDay,
            organizationMinute
          );
          const parsedOrganizationLimits = readOrganizationLimits(
            organizationSnapshot.exists ? organizationSnapshot.data() : undefined
          );
          if (!parsedOrganizationLimits) {
            return denied(403, "ORGANIZATION_AI_DISABLED", "AI services are not enabled for this organization.");
          }
          organizationLimits = parsedOrganizationLimits.organization;
          memberLimits = parsedOrganizationLimits.member;
          userFallbackLimits = memberLimits;
          organizationDayRef = organizationDay;
          organizationMinuteRef = organizationMinute;
          organizationDayUsage = parseWindow(organizationDaySnapshot, dayKey);
          organizationMinuteUsage = parseWindow(organizationMinuteSnapshot, minuteKey);
        }

        let userLimits: ScopeLimits;
        try {
          userLimits = readUserLimits(
            userEntitlementData,
            userFallbackLimits,
            { daily: AI_QUOTA_MAXIMUMS.userDailyUnits, perMinute: AI_QUOTA_MAXIMUMS.userPerMinuteUnits }
          );
        } catch (error) {
          if (error instanceof AiQuotaDisabledError) {
            return denied(403, "USER_AI_DISABLED", "AI services are not enabled for this account.");
          }
          throw error;
        }
        if (memberLimits) {
          // An individual entitlement may reduce a school's seat limit but cannot raise it.
          userLimits = {
            daily: Math.min(userLimits.daily, memberLimits.daily),
            perMinute: Math.min(userLimits.perMinute, memberLimits.perMinute),
          };
        }

        const userActionDaily = userUsageDay.byAction[request.feature];
        const userActionMinute = userUsageMinute.byAction[request.feature];
        if (userUsageDay.totalUnits + request.units > userLimits.daily) {
          return denied(429, "USER_DAILY_QUOTA_EXCEEDED", "Your daily AI usage limit has been reached.", secondsUntil(dayResetAt, request.now));
        }
        if (userUsageMinute.totalUnits + request.units > userLimits.perMinute) {
          return denied(429, "USER_RATE_LIMIT_EXCEEDED", "You are sending AI requests too quickly. Please wait before trying again.", secondsUntil(minuteResetAt, request.now));
        }
        if (request.feature === "content" && userActionDaily + request.units > AI_QUOTA_DEFAULTS.contentDailyRequests) {
          return denied(429, "CONTENT_DAILY_QUOTA_EXCEEDED", "Today's generated-content limit has been reached. Reusable activities remain available.", secondsUntil(dayResetAt, request.now));
        }
        if (request.feature === "content" && userActionMinute + request.units > AI_QUOTA_DEFAULTS.contentPerMinuteRequests) {
          return denied(429, "CONTENT_RATE_LIMIT_EXCEEDED", "Too many generated-content requests. Please wait before trying again.", secondsUntil(minuteResetAt, request.now));
        }

        if (organizationLimits && organizationDayUsage && organizationMinuteUsage && organizationDayRef && organizationMinuteRef) {
          if (organizationDayUsage.totalUnits + request.units > organizationLimits.daily) {
            return denied(429, "ORGANIZATION_DAILY_QUOTA_EXCEEDED", "This organization's daily AI usage limit has been reached.", secondsUntil(dayResetAt, request.now));
          }
          if (organizationMinuteUsage.totalUnits + request.units > organizationLimits.perMinute) {
            return denied(429, "ORGANIZATION_RATE_LIMIT_EXCEEDED", "This organization's AI request rate is temporarily limited.", secondsUntil(minuteResetAt, request.now));
          }
        }

        const updatedUserDay = updatedWindow(userUsageDay, request.feature, request.units);
        const updatedUserMinute = updatedWindow(userUsageMinute, request.feature, request.units);
        transaction.set(userDayRef, serializeWindow(dayKey, updatedUserDay, request.now));
        transaction.set(userMinuteRef, serializeWindow(minuteKey, updatedUserMinute, request.now));

        if (organizationLimits && organizationDayUsage && organizationMinuteUsage && organizationDayRef && organizationMinuteRef) {
          transaction.set(organizationDayRef, serializeWindow(
            dayKey,
            updatedWindow(organizationDayUsage, request.feature, request.units),
            request.now
          ));
          transaction.set(organizationMinuteRef, serializeWindow(
            minuteKey,
            updatedWindow(organizationMinuteUsage, request.feature, request.units),
            request.now
          ));
        }

        const userRemaining = userLimits.daily - updatedUserDay.totalUnits;
        const organizationRemaining = organizationLimits && organizationDayUsage
          ? organizationLimits.daily - organizationDayUsage.totalUnits - request.units
          : Number.POSITIVE_INFINITY;
        const remainingDailyUnits = Math.max(0, Math.min(userRemaining, organizationRemaining));
        const dailyLimitUnits = Math.min(userLimits.daily, organizationLimits?.daily ?? Number.POSITIVE_INFINITY);

        return {
          allowed: true,
          organizationId,
          scope: organizationId ? "user+organization" : "user",
          dailyLimitUnits,
          remainingDailyUnits,
          resetAt: dayResetAt,
        };
      });
    } catch (error) {
      if (error instanceof AiQuotaConfigurationError) {
        return denied(503, "AI_QUOTA_UNAVAILABLE", "AI quota settings are temporarily unavailable. Please try again later.");
      }
      throw error;
    }
  }
}

function updatedWindow(previous: UsageWindow, feature: AiFeature, units: number): UsageWindow {
  return {
    totalUnits: previous.totalUnits + units,
    byAction: { ...previous.byAction, [feature]: previous.byAction[feature] + units },
  };
}

function serializeWindow(windowKey: string, usage: UsageWindow, now: number): Record<string, unknown> {
  return {
    schemaVersion: 1,
    windowKey,
    totalUnits: usage.totalUnits,
    byAction: usage.byAction,
    updatedAt: now,
    expiresAt: Timestamp.fromMillis(now + USAGE_WINDOW_RETENTION_MS),
  };
}
