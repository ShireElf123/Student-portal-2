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

    // Fallback for guest or unscoped legacy data if not migrated yet
    if (raw === null && targetId === GUEST_LEARNER_ID) {
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
  const migrationFlagKey = `my_student_portal_migrated_${targetId}`;

  try {
    if (localStorage.getItem(migrationFlagKey) === "true") {
      return;
    }

    for (const legacyKey of KNOWN_LEGACY_KEYS) {
      const unscopedVal = localStorage.getItem(legacyKey);
      if (unscopedVal !== null) {
        const scopedKey = getScopedStorageKey(legacyKey, targetId);
        // Only adopt if the account does not already have partitioned data
        if (localStorage.getItem(scopedKey) === null) {
          localStorage.setItem(scopedKey, unscopedVal);
        }
      }
    }

    localStorage.setItem(migrationFlagKey, "true");
  } catch (err) {
    console.warn("Legacy account data migration warning:", err);
  }
}
