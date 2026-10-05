/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Account-scoped local storage partitioning.
 * Ensures data for different accounts/learners (notebooks, homework,
 * study plans, assessments, roles) are cleanly isolated across sign-ins,
 * switches, and guest sessions without cross-contamination.
 */

export const GUEST_LEARNER_ID = "guest-learner";

let currentAccountId: string = GUEST_LEARNER_ID;
const accountListeners = new Set<(accountId: string) => void>();

export function getActiveAccountId(): string {
  return currentAccountId;
}

export function setActiveAccountId(accountId: string): void {
  const normalized = (accountId || GUEST_LEARNER_ID).trim();
  if (normalized === currentAccountId) return;
  currentAccountId = normalized;

  // Notify in-memory subscribers
  accountListeners.forEach((fn) => {
    try {
      fn(currentAccountId);
    } catch (err) {
      console.error("Error in account scope listener:", err);
    }
  });

  // Dispatch window event for cross-component reactivity
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("account_scope_changed", { detail: { accountId: currentAccountId } })
    );
  }
}

export function subscribeAccountScope(listener: (accountId: string) => void): () => void {
  accountListeners.add(listener);
  return () => {
    accountListeners.delete(listener);
  };
}

export function getScopedStorageKey(key: string, accountId?: string): string {
  const targetId = (accountId || currentAccountId || GUEST_LEARNER_ID).trim();
  return `${key}__${targetId}`;
}

export function readScopedJSON<T>(key: string, defaultValue: T, accountId?: string): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const targetId = (accountId || currentAccountId || GUEST_LEARNER_ID).trim();
    const primaryKey = getScopedStorageKey(key, targetId);
    let raw = localStorage.getItem(primaryKey);

    // Fallback check for single underscore format
    if (raw === null) {
      raw = localStorage.getItem(`${key}_${targetId}`);
    }

    // Anonymous use can read legacy keys only until a signed-in account claims
    // that shared source. Once claimed, never expose leftovers to the guest scope.
    if (raw === null && targetId === GUEST_LEARNER_ID && !localStorage.getItem(LEGACY_ACCOUNT_OWNER_KEY)) {
      raw = localStorage.getItem(key);
    }

    if (raw === null || raw === undefined) {
      return defaultValue;
    }

    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Failed reading scoped storage key "${key}":`, err);
    return defaultValue;
  }
}

export function writeScopedJSON<T>(key: string, value: T, accountId?: string): void {
  if (typeof window === "undefined") return;
  try {
    const targetId = (accountId || currentAccountId || GUEST_LEARNER_ID).trim();
    const storageKey = getScopedStorageKey(key, targetId);
    localStorage.setItem(storageKey, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed writing scoped storage key "${key}":`, err);
  }
}

export function removeScopedItem(key: string, accountId?: string): void {
  if (typeof window === "undefined") return;
  try {
    const targetId = (accountId || currentAccountId || GUEST_LEARNER_ID).trim();
    localStorage.removeItem(getScopedStorageKey(key, targetId));
    localStorage.removeItem(`${key}_${targetId}`);
  } catch (err) {
    console.warn(`Failed removing scoped storage key "${key}":`, err);
  }
}

const LEGACY_ACCOUNT_OWNER_KEY = "my_student_portal_legacy_data_owner_v1";

const KNOWN_LEGACY_KEYS = [
  "my_student_portal_notebooks_v3",
  "my_student_portal_study_plan_v3",
  "my_student_portal_practice_v3",
  "my_student_portal_user_role",
  "my_student_portal_homework_v1",
  "my_student_portal_assessments_v1",
];

/**
 * Adopts legacy unscoped browser data into the designated account partition.
 * Safe to call repeatedly; marks migration completed for the target account.
 */
export function migrateLegacyAccountData(accountId: string): void {
  if (typeof window === "undefined") return;
  const targetId = (accountId || GUEST_LEARNER_ID).trim();
  // Anonymous use can continue reading legacy keys in place. Assigning them to
  // a guest here would prevent a later first sign-in from adopting that user's data.
  if (targetId === GUEST_LEARNER_ID) return;

  const migrationFlagKey = `my_student_portal_migrated_${targetId}`;
  try {
    let legacyOwner = localStorage.getItem(LEGACY_ACCOUNT_OWNER_KEY);
    const migrationAlreadyComplete = localStorage.getItem(migrationFlagKey) === "true";

    // Older releases used only per-account flags and left the unscoped source
    // behind. If this account already completed that migration, make it the
    // compatibility owner and clean up any shared leftovers.
    if (migrationAlreadyComplete) {
      if (!legacyOwner) {
        localStorage.setItem(LEGACY_ACCOUNT_OWNER_KEY, targetId);
        legacyOwner = targetId;
      }
      if (legacyOwner === targetId) KNOWN_LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
      return;
    }

    if (legacyOwner && legacyOwner !== targetId) {
      // Legacy browser data is never copied into a second signed-in account.
      localStorage.setItem(migrationFlagKey, "true");
      return;
    }

    // Claim the one-time source before copying any keys. If storage fails midway,
    // the same owner may safely retry, while another signed-in account cannot
    // adopt whatever shared legacy entries remain.
    if (!legacyOwner) localStorage.setItem(LEGACY_ACCOUNT_OWNER_KEY, targetId);

    for (const legacyKey of KNOWN_LEGACY_KEYS) {
      const unscopedVal = localStorage.getItem(legacyKey);
      if (unscopedVal === null) continue;
      const scopedKey = getScopedStorageKey(legacyKey, targetId);
      if (localStorage.getItem(scopedKey) === null) {
        localStorage.setItem(scopedKey, unscopedVal);
      }
      // The one-time owner now has a scoped copy; remove the shared source so
      // a future account cannot adopt it independently.
      localStorage.removeItem(legacyKey);
    }

    localStorage.setItem(migrationFlagKey, "true");
  } catch (err) {
    console.warn("Legacy account data migration warning:", err);
  }
}
