import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../firebaseCore", () => ({ auth: { currentUser: null } }));

import { canConsumeAI, getUsageStats, recordAIConsumption, syncAIQuotaFromResponseHeaders } from "./aiUsageService";

function installLocalStorage(): void {
  const values = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
    clear: () => { values.clear(); },
    key: (index: number) => [...values.keys()][index] ?? null,
    get length() { return values.size; },
  });
}

describe("AI usage display versus server quota enforcement", () => {
  beforeEach(() => installLocalStorage());
  afterEach(() => vi.unstubAllGlobals());

  it("never lets an editable local tier block a server-authorized AI request", () => {
    for (let index = 0; index < 40; index += 1) recordAIConsumption("chat");
    expect(getUsageStats().remaining).toBe(0);
    expect(canConsumeAI("chat")).toMatchObject({ allowed: true, remaining: 0 });
  });

  it("displays the authenticated server quota snapshot instead of a client-selected plan cap", () => {
    syncAIQuotaFromResponseHeaders(new Headers({
      "X-AI-Quota-Scope": "user+organization",
      "X-AI-Quota-Daily-Limit": "100",
      "X-AI-Quota-Daily-Remaining": "73",
      "X-AI-Quota-Reset-At": String(Date.now() + 60_000),
    }));
    expect(getUsageStats()).toMatchObject({ dailyLimit: 100, remaining: 73, usedToday: 27 });
  });

  it("ignores missing, malformed, and already-expired server quota headers", () => {
    syncAIQuotaFromResponseHeaders(new Headers({
      "X-AI-Quota-Daily-Limit": "20",
      "X-AI-Quota-Daily-Remaining": "21",
      "X-AI-Quota-Reset-At": String(Date.now() + 60_000),
    }));
    expect(getUsageStats().dailyLimit).toBe(20);

    syncAIQuotaFromResponseHeaders(new Headers({
      "X-AI-Quota-Daily-Limit": "100",
      "X-AI-Quota-Daily-Remaining": "90",
      "X-AI-Quota-Reset-At": String(Date.now() - 1),
    }));
    expect(getUsageStats().dailyLimit).toBe(20);
  });
});
