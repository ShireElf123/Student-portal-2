import type { DocumentData, UpdateData } from "firebase/firestore";
import { AIUsageStats, SubscriptionStatus, SubscriptionTier } from "../types";
import { todayISO } from "../utils/dateUtils";
import { auth } from "../firebaseCore";

function syncCloudUserFields(fields: Record<string, unknown>) {
  const user = auth.currentUser;
  if (!user) return;
  void Promise.all([import("../firebase"), import("firebase/firestore")])
    .then(([{ db }, { doc, updateDoc }]) =>
      updateDoc(doc(db, "users", user.uid), fields as unknown as UpdateData<DocumentData>)
    )
    .catch(() => {
      // Local settings remain authoritative when cloud sync is unavailable.
    });
}

const USAGE_STORAGE_KEY = "my_student_portal_ai_usage_v1";
const SUB_STORAGE_KEY = "my_student_portal_subscription_v1";
const SERVER_QUOTA_STORAGE_KEY = "my_student_portal_server_ai_quota_v1";
const AI_SERVER_DEFAULT_DAILY_LIMIT = 20;

interface ServerQuotaSnapshot {
  dailyLimit: number;
  remaining: number;
  resetAt: number;
}

export const TIER_LIMITS: Record<SubscriptionTier, number> = {
  free_trial: 20,
  student_pro: 150,
  family_basic: 200,
  educator_plus: 300,
};

export const TIER_LABELS: Record<SubscriptionTier, string> = {
  free_trial: "Free Academic Trial",
  student_pro: "Student Pro",
  family_basic: "Family & Homeschool",
  educator_plus: "Educator Plus",
};

export type AIUsageAction = "chat" | "practice" | "study_plan" | "content";

type UsageListener = (stats: AIUsageStats) => void;
const listeners: Set<UsageListener> = new Set();

function getStoredSubscription(): {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  trialEndsAt: number;
} {
  try {
    const raw = localStorage.getItem(SUB_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  // Default: 14 days trial from today
  const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;
  const trialEndsAt = Date.now() + fourteenDaysMs;
  const defaultSub = {
    tier: "free_trial" as SubscriptionTier,
    status: "trialing" as SubscriptionStatus,
    trialEndsAt,
  };
  try {
    localStorage.setItem(SUB_STORAGE_KEY, JSON.stringify(defaultSub));
  } catch {
    // ignore
  }
  return defaultSub;
}

function getStoredUsage(): { count: number; date: string } {
  const today = todayISO();
  try {
    const raw = localStorage.getItem(USAGE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.date === today && typeof parsed.count === "number") {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return { count: 0, date: today };
}

function getStoredServerQuota(): ServerQuotaSnapshot | null {
  try {
    const raw = localStorage.getItem(SERVER_QUOTA_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const quota = parsed as Record<string, unknown>;
    if (typeof quota.dailyLimit !== "number" || !Number.isSafeInteger(quota.dailyLimit) || quota.dailyLimit < 0 ||
      typeof quota.remaining !== "number" || !Number.isSafeInteger(quota.remaining) || quota.remaining < 0 || quota.remaining > quota.dailyLimit ||
      typeof quota.resetAt !== "number" || !Number.isSafeInteger(quota.resetAt) || quota.resetAt <= Date.now()) return null;
    return { dailyLimit: quota.dailyLimit, remaining: quota.remaining, resetAt: quota.resetAt };
  } catch {
    return null;
  }
}

export function getUsageStats(): AIUsageStats {
  const sub = getStoredSubscription();
  const usage = getStoredUsage();
  const serverQuota = getStoredServerQuota();
  // A client-selected plan is display-only. Until the gateway returns its current quota,
  // show the same conservative personal default used by the server, never a claimed tier cap.
  const dailyLimit = serverQuota?.dailyLimit ?? AI_SERVER_DEFAULT_DAILY_LIMIT;
  const remaining = serverQuota?.remaining ?? Math.max(0, dailyLimit - usage.count);
  const usedToday = serverQuota ? dailyLimit - remaining : Math.min(dailyLimit, usage.count);

  const msRemaining = Math.max(0, sub.trialEndsAt - Date.now());
  const trialDaysRemaining = Math.ceil(msRemaining / (24 * 60 * 60 * 1000));

  return {
    usedToday,
    dailyLimit,
    remaining,
    tier: sub.tier,
    status: sub.status,
    trialDaysRemaining,
    resetDate: usage.date,
  };
}

function notifyListeners() {
  const stats = getUsageStats();
  listeners.forEach((listener) => {
    try {
      listener(stats);
    } catch (err) {
      console.error("Error in AI usage listener:", err);
    }
  });
}

export function subscribeToAIUsage(listener: UsageListener): () => void {
  listeners.add(listener);
  // Emit current on subscription
  listener(getUsageStats());
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Local experience-meter check only. localStorage and client-written profile fields are
 * user controlled; this is never an authorization or billing decision. Every AI endpoint
 * independently enforces authenticated, transactional server-side user/organization quotas.
 */
export function canConsumeAI(_action: AIUsageAction): {
  allowed: boolean;
  remaining: number;
  reason?: string;
} {
  // This is a UX estimate only. A cached client value can be stale or user-edited, so
  // only the authenticated server gateway may block a request on quota.
  return { allowed: true, remaining: getUsageStats().remaining };
}

/** Updates the display meter from a server-authoritative response; never used to grant access. */
export function syncAIQuotaFromResponseHeaders(headers: Pick<Headers, "get">): void {
  const dailyLimitText = headers.get("X-AI-Quota-Daily-Limit");
  const remainingText = headers.get("X-AI-Quota-Daily-Remaining");
  const resetAtText = headers.get("X-AI-Quota-Reset-At");
  const dailyLimit = dailyLimitText === null ? Number.NaN : Number(dailyLimitText);
  const remaining = remainingText === null ? Number.NaN : Number(remainingText);
  const resetAt = resetAtText === null ? Number.NaN : Number(resetAtText);
  if (!Number.isSafeInteger(dailyLimit) || dailyLimit < 0 ||
    !Number.isSafeInteger(remaining) || remaining < 0 || remaining > dailyLimit ||
    !Number.isSafeInteger(resetAt) || resetAt <= Date.now()) return;
  try {
    localStorage.setItem(SERVER_QUOTA_STORAGE_KEY, JSON.stringify({ dailyLimit, remaining, resetAt }));
  } catch {
    // The server quota remains authoritative if local display persistence is unavailable.
  }
  notifyListeners();
}

export function recordAIConsumption(
  action: AIUsageAction,
  units = 1
): AIUsageStats {
  const today = todayISO();
  const current = getStoredUsage();
  const safeUnits = Number.isFinite(units) ? Math.max(1, Math.min(100, Math.floor(units))) : 1;
  const newCount = (current.date === today ? current.count : 0) + safeUnits;

  const updated = { count: newCount, date: today };
  try {
    localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  // The local count is only a display estimate; the server persists and returns the real quota.
  notifyListeners();
  return getUsageStats();
}

export function setSubscriptionTier(tier: SubscriptionTier): AIUsageStats {
  const sub = getStoredSubscription();
  const updatedSub = {
    ...sub,
    tier,
    status: (tier === "free_trial" ? "trialing" : "active") as SubscriptionStatus,
  };

  try {
    localStorage.setItem(SUB_STORAGE_KEY, JSON.stringify(updatedSub));
  } catch {
    // ignore
  }

  syncCloudUserFields({ subscriptionTier: tier, subscriptionStatus: updatedSub.status });

  notifyListeners();
  return getUsageStats();
}

/**
 * Resets the daily usage count back to 0 immediately
 */
export function resetDailyUsage(): AIUsageStats {
  const today = todayISO();
  const resetData = { count: 0, date: today };
  try {
    localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(resetData));
  } catch {
    // ignore
  }

  // Resetting this local display meter does not reset server-side quota.
  notifyListeners();
  return getUsageStats();
}

/** Restores display-only subscription metadata from the user profile; it does not load AI quotas. */
export async function syncUsageWithCloud(userId: string) {
  try {
    const [{ db }, { doc, getDoc }] = await Promise.all([import("../firebase"), import("firebase/firestore")]);
    const userSnap = await getDoc(doc(db, "users", userId));
    if (userSnap.exists()) {
      const data = userSnap.data();

      if (data.subscriptionTier) {
        const sub = getStoredSubscription();
        const updated = {
          ...sub,
          tier: data.subscriptionTier,
          status: data.subscriptionStatus || "active",
          trialEndsAt: data.trialEndsAt || sub.trialEndsAt,
        };
        localStorage.setItem(SUB_STORAGE_KEY, JSON.stringify(updated));
      }
      notifyListeners();
    }
  } catch (error) {
    console.warn("Could not sync AI usage from cloud:", error);
  }
}
