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

export function getUsageStats(): AIUsageStats {
  const sub = getStoredSubscription();
  const usage = getStoredUsage();
  const dailyLimit = TIER_LIMITS[sub.tier] || 20;
  const remaining = Math.max(0, dailyLimit - usage.count);

  const msRemaining = Math.max(0, sub.trialEndsAt - Date.now());
  const trialDaysRemaining = Math.ceil(msRemaining / (24 * 60 * 60 * 1000));

  return {
    usedToday: usage.count,
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

export function canConsumeAI(action: AIUsageAction): {
  allowed: boolean;
  remaining: number;
  reason?: string;
} {
  const stats = getUsageStats();
  if (stats.remaining <= 0) {
    return {
      allowed: false,
      remaining: 0,
      reason: `You have reached your daily quota of ${stats.dailyLimit} AI operations for the ${TIER_LABELS[stats.tier]} tier. It will reset tomorrow, or you can test upgrading your plan.`,
    };
  }
  return {
    allowed: true,
    remaining: stats.remaining,
  };
}

export function recordAIConsumption(
  action: AIUsageAction,
  units = 1
): AIUsageStats {
  const today = todayISO();
  const current = getStoredUsage();
  const newCount = (current.date === today ? current.count : 0) + units;

  const updated = { count: newCount, date: today };
  try {
    localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  // Cloud sync if signed in
  syncCloudUserFields({ aiUsageToday: newCount, aiUsageResetDate: today });

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

  syncCloudUserFields({ aiUsageToday: 0, aiUsageResetDate: today });

  notifyListeners();
  return getUsageStats();
}

/**
 * Initializes and synchronizes user's cloud subscription & usage if available
 */
export async function syncUsageWithCloud(userId: string) {
  try {
    const [{ db }, { doc, getDoc }] = await Promise.all([import("../firebase"), import("firebase/firestore")]);
    const userSnap = await getDoc(doc(db, "users", userId));
    if (userSnap.exists()) {
      const data = userSnap.data();
      const today = todayISO();

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

      if (data.aiUsageResetDate === today && typeof data.aiUsageToday === "number") {
        const current = getStoredUsage();
        const highest = Math.max(current.count, data.aiUsageToday);
        localStorage.setItem(
          USAGE_STORAGE_KEY,
          JSON.stringify({ count: highest, date: today })
        );
      }
      notifyListeners();
    }
  } catch (error) {
    console.warn("Could not sync AI usage from cloud:", error);
  }
}
