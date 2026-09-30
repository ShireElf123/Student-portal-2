import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  GUEST_LEARNER_ID,
  getActiveAccountId,
  setActiveAccountId,
  scopedKey,
  readScopedJSON,
  writeScopedJSON,
  migrateLegacyAccountData,
  getMigrationOwner,
  subscribeAccountScope,
  __resetAccountScopeForTests,
} from "../accountStorage";

class MemoryStorage implements Storage {
  private data = new Map<string, string>();
  get length(): number {
    return this.data.size;
  }
  clear(): void {
    this.data.clear();
  }
  getItem(key: string): string | null {
    return this.data.has(key) ? this.data.get(key)! : null;
  }
  key(index: number): string | null {
    return Array.from(this.data.keys())[index] ?? null;
  }
  removeItem(key: string): void {
    this.data.delete(key);
  }
  setItem(key: string, value: string): void {
    this.data.set(key, String(value));
  }
}

beforeEach(() => {
  vi.stubGlobal("localStorage", new MemoryStorage());
  __resetAccountScopeForTests();
});

describe("accountStorage", () => {
  it("defaults to the guest learner scope and sanitizes bad ids", () => {
    expect(getActiveAccountId()).toBe(GUEST_LEARNER_ID);
    expect(setActiveAccountId("")).toBe(GUEST_LEARNER_ID);
    expect(setActiveAccountId("  uid-123  ")).toBe("uid-123");
    expect(scopedKey("base", "uid-123")).toBe("base_uid-123");
  });

  it("isolates reads and writes between accounts", () => {
    writeScopedJSON("my_student_portal_notebooks_v3", [{ id: "nb-a" }], "user-a");
    writeScopedJSON("my_student_portal_notebooks_v3", [{ id: "nb-b" }], "user-b");

    expect(readScopedJSON("my_student_portal_notebooks_v3", [], "user-a")).toEqual([{ id: "nb-a" }]);
    expect(readScopedJSON("my_student_portal_notebooks_v3", [], "user-b")).toEqual([{ id: "nb-b" }]);
    // Guest scope sees neither account's data.
    expect(readScopedJSON("my_student_portal_notebooks_v3", [], GUEST_LEARNER_ID)).toEqual([]);
  });

  it("migrates legacy unscoped data only to the first account", () => {
    localStorage.setItem("my_student_portal_notebooks_v3", JSON.stringify([{ id: "legacy" }]));
    localStorage.setItem("edu_gamification_state_v1", JSON.stringify({ xp: 42 }));

    const adopted = migrateLegacyAccountData("first-user");
    expect(adopted).toContain("my_student_portal_notebooks_v3");
    expect(adopted).toContain("edu_gamification_state_v1");
    expect(getMigrationOwner()).toBe("first-user");

    // First account received the data under its scope...
    expect(readScopedJSON("my_student_portal_notebooks_v3", [], "first-user")).toEqual([{ id: "legacy" }]);
    // ...and the unscoped originals are gone so later accounts cannot read them.
    expect(localStorage.getItem("my_student_portal_notebooks_v3")).toBeNull();
    expect(localStorage.getItem("edu_gamification_state_v1")).toBeNull();

    // A second account gets nothing and starts clean.
    expect(migrateLegacyAccountData("second-user")).toEqual([]);
    expect(readScopedJSON("my_student_portal_notebooks_v3", [], "second-user")).toEqual([]);
    expect(getMigrationOwner()).toBe("first-user");
  });

  it("never overwrites an existing scoped value during migration", () => {
    writeScopedJSON("my_student_portal_practice_v3", [{ id: "mine" }], "first-user");
    localStorage.setItem("my_student_portal_practice_v3", JSON.stringify([{ id: "legacy" }]));

    migrateLegacyAccountData("first-user");

    expect(readScopedJSON("my_student_portal_practice_v3", [], "first-user")).toEqual([{ id: "mine" }]);
    // The unscoped copy is still removed to prevent cross-account reads.
    expect(localStorage.getItem("my_student_portal_practice_v3")).toBeNull();
  });

  it("tolerates malformed stored data instead of throwing", () => {
    localStorage.setItem(scopedKey("my_student_portal_study_plan_v3", "user-a"), "{not valid json");
    expect(readScopedJSON("my_student_portal_study_plan_v3", ["fallback"], "user-a")).toEqual(["fallback"]);

    // Malformed legacy payloads are dropped during migration, not copied.
    localStorage.setItem("my_student_portal_homework_v1", "{broken");
    const adopted = migrateLegacyAccountData("first-user");
    expect(adopted).not.toContain("my_student_portal_homework_v1");
    expect(readScopedJSON("my_student_portal_homework_v1", [], "first-user")).toEqual([]);
  });

  it("restores each account's own data when switching back and forth", () => {
    setActiveAccountId("learner-1");
    writeScopedJSON("my_student_portal_study_plan_v3", [{ id: "task-1" }]);

    setActiveAccountId("learner-2");
    expect(readScopedJSON("my_student_portal_study_plan_v3", [])).toEqual([]);
    writeScopedJSON("my_student_portal_study_plan_v3", [{ id: "task-2" }]);

    setActiveAccountId("learner-1");
    expect(readScopedJSON("my_student_portal_study_plan_v3", [])).toEqual([{ id: "task-1" }]);

    setActiveAccountId("learner-2");
    expect(readScopedJSON("my_student_portal_study_plan_v3", [])).toEqual([{ id: "task-2" }]);
  });

  it("notifies subscribers on account switches", () => {
    const seen: string[] = [];
    const unsubscribe = subscribeAccountScope((id) => seen.push(id));
    setActiveAccountId("user-a");
    setActiveAccountId("user-a"); // no-op, no duplicate notification
    setActiveAccountId(GUEST_LEARNER_ID);
    unsubscribe();
    setActiveAccountId("user-b"); // unsubscribed, not observed
    expect(seen).toEqual(["user-a", GUEST_LEARNER_ID]);
  });
});
