/**
 * Account-scoped browser storage.
 *
 * All account-owned data (notebooks, study plan, practice sessions, homework,
 * AI usage/subscription state, learner models, mistakes, diagnostics,
 * gamification/rewards, toddler progress) is partitioned by the authenticated
 * UID, or by the shared guest learner id when nobody is signed in.
 *
 * Migration rule: pre-existing *unscoped* keys are copied only to the FIRST
 * account that opens this browser after the upgrade. They are then removed so
 * a later account can never read another account's data.
 */

/** Learner id used for local-only (signed-out) learning. */
export const GUEST_LEARNER_ID = "scholar-primary-1";

/** Marker recording which account received the one-time legacy migration. */
const MIGRATION_MARKER_KEY = "account_storage_v1_migrated_to";

/** Broadcast when the active account scope changes (sign-in/out/switch). */
export const ACCOUNT_SCOPE_CHANGED_EVENT = "account_scope_changed";

let activeAccountId: string = GUEST_LEARNER_ID;
const scopeListeners = new Set<(accountId: string) => void>();

export function getActiveAccountId(): string {
  return activeAccountId;
}

function sanitizeAccountId(raw: unknown): string {
  if (typeof raw === "string" && raw.trim().length > 0 && raw.length <= 256) {
    return raw.trim();
  }
  return GUEST_LEARNER_ID;
}

/**
 * Switches the active account scope. Callers (App, services) reload their
 * cached state from the newly scoped keys when this changes.
 */
export function setActiveAccountId(accountId: unknown): string {
  const next = sanitizeAccountId(accountId);
  if (next === activeAccountId) return activeAccountId;
  activeAccountId = next;
  scopeListeners.forEach((fn) => {
    try {
      fn(next);
    } catch {
      // A scope observer must not break account switching.
    }
  });
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(ACCOUNT_SCOPE_CHANGED_EVENT, { detail: next }));
  }
  return activeAccountId;
}

export function subscribeAccountScope(fn: (accountId: string) => void): () => void {
  scopeListeners.add(fn);
  return () => {
    scopeListeners.delete(fn);
  };
}

function storage(): Storage | null {
  try {
    if (typeof localStorage !== "undefined") return localStorage;
  } catch {
    // Storage unavailable (private mode, SSR, tests without a stub).
  }
  return null;
}

/** Scoped key for an account-owned base key, e.g. `my_student_portal_notebooks_v3_<uid>`. */
export function scopedKey(baseKey: string, accountId: string = activeAccountId): string {
  return `${baseKey}_${sanitizeAccountId(accountId)}`;
}

function safeParse(raw: string | null): unknown {
  if (raw === null || raw === undefined) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function readRaw(key: string): string | null {
  const store = storage();
  if (!store) return null;
  try {
    return store.getItem(key);
  } catch {
    return null;
  }
}

function writeRaw(key: string, value: string): void {
  const store = storage();
  if (!store) return;
  try {
    store.setItem(key, value);
  } catch {
    // Quota or access errors must not crash learning flows.
  }
}

function removeRaw(key: string): void {
  const store = storage();
  if (!store) return;
  try {
    store.removeItem(key);
  } catch {
    // ignore
  }
}

/**
 * Reads account-scoped JSON. Malformed payloads resolve to `fallback` instead
 * of throwing, so one corrupt entry cannot break sign-in or navigation.
 */
export function readScopedJSON<T>(baseKey: string, fallback: T, accountId: string = activeAccountId): T {
  const parsed = safeParse(readRaw(scopedKey(baseKey, accountId)));
  return (parsed === undefined ? fallback : parsed) as T;
}

export function writeScopedJSON(baseKey: string, value: unknown, accountId: string = activeAccountId): void {
  try {
    writeRaw(scopedKey(baseKey, accountId), JSON.stringify(value));
  } catch {
    // ignore (circular structures, quota)
  }
}

export function removeScoped(baseKey: string, accountId: string = activeAccountId): void {
  removeRaw(scopedKey(baseKey, accountId));
}

/** Reads an unscoped (legacy/global) JSON value with malformed-data tolerance. */
export function readUnscopedJSON<T>(key: string, fallback: T): T {
  const parsed = safeParse(readRaw(key));
  return (parsed === undefined ? fallback : parsed) as T;
}

/**
 * Base keys whose legacy unscoped values may be migrated to the first account.
 * Keys that are already per-learner (learner model, mastered nodes, mistake
 * vault, diagnostic profile) are included so their legacy unscoped copies are
 * adopted once and then removed.
 */
export const LEGACY_UNSCOPED_BASES: string[] = [
  "my_student_portal_notebooks_v3",
  "my_student_portal_study_plan_v3",
  "my_student_portal_practice_v3",
  "my_student_portal_homework_v1",
  "my_student_portal_assessments_v1",
  "my_student_portal_ai_usage_v1",
  "my_student_portal_subscription_v1",
  "my_student_portal_learner_model_v1",
  "my_student_portal_mastered_nodes_v1",
  "my_student_portal_mistake_vault_v1",
  "my_student_portal_diagnostic_profile_v1",
  "my_student_portal_user_role",
  "edu_gamification_state_v1",
  "toddler_world_exploration_progress_v2",
  "toddler_daily_missions_completed_v1",
];

export function getMigrationOwner(): string | null {
  const raw = readRaw(MIGRATION_MARKER_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { accountId?: unknown };
    return typeof parsed?.accountId === "string" && parsed.accountId ? parsed.accountId : null;
  } catch {
    return null;
  }
}

/**
 * One-time adoption of legacy unscoped data into `accountId`'s scope.
 *
 * - Runs at most once per browser (guarded by the migration marker).
 * - Only the first account receives the data; every other account starts clean.
 * - Never overwrites an existing scoped value.
 * - Removes the unscoped originals afterwards so they cannot leak across accounts.
 *
 * Returns the list of base keys that were adopted.
 */
export function migrateLegacyAccountData(accountId: string = activeAccountId): string[] {
  const owner = sanitizeAccountId(accountId);
  if (getMigrationOwner() !== null) return [];
  const adopted: string[] = [];
  for (const base of LEGACY_UNSCOPED_BASES) {
    const legacyRaw = readRaw(base);
    if (legacyRaw === null) continue;
    // Validate before adopting: malformed payloads are dropped, never copied.
    const parsed = safeParse(legacyRaw);
    const target = scopedKey(base, owner);
    if (parsed !== undefined && readRaw(target) === null) {
      writeRaw(target, legacyRaw);
      adopted.push(base);
    }
    // Always remove the unscoped original so no later account can read it.
    removeRaw(base);
  }
  writeRaw(MIGRATION_MARKER_KEY, JSON.stringify({ accountId: owner, migratedAt: Date.now() }));
  return adopted;
}

/** Test/support helper: clears the in-memory scope without touching storage. */
export function __resetAccountScopeForTests(): void {
  activeAccountId = GUEST_LEARNER_ID;
  scopeListeners.clear();
}
