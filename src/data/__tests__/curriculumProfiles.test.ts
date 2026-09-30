import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  CURRICULUM_PROFILES,
  DEFAULT_CURRICULUM_PROFILE_ID,
  formatStandardReference,
  getActiveCurriculumProfileId,
  getCurriculumProfile,
  getGlobalGoal,
  setActiveCurriculumProfileId,
} from "../curriculumProfiles";
import {
  CURRICULUM_SKILL_NODES,
  CurriculumDomain,
  GradeLevelBand,
} from "../curriculumUniverse";

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
  vi.stubGlobal("window", undefined as unknown as Window & typeof globalThis);
  setActiveCurriculumProfileId(DEFAULT_CURRICULUM_PROFILE_ID);
});

describe("curriculumProfiles", () => {
  it("defaults to the global learning goals profile", () => {
    expect(DEFAULT_CURRICULUM_PROFILE_ID).toBe("global-goals");
    expect(getActiveCurriculumProfileId()).toBe("global-goals");
    expect(getCurriculumProfile("nope").id).toBe("global-goals");
  });

  it("exposes a standards code only for the verified US profile", () => {
    const node = CURRICULUM_SKILL_NODES[0];
    const us = formatStandardReference(node, "us-ccss-ngss");
    expect(us.code).toBe(node.standardCode);
    expect(us.verified).toBe(true);

    const global = formatStandardReference(node, "global-goals");
    expect(global.code).toBeNull();
    expect(global.verified).toBe(true);
    expect(global.goal.length).toBeGreaterThan(0);
  });

  it("never exposes a regional code for unverified profiles", () => {
    const unverified = CURRICULUM_PROFILES.filter((p) => !p.verifiedMapping);
    expect(unverified.length).toBeGreaterThan(0);
    for (const profile of unverified) {
      for (const node of CURRICULUM_SKILL_NODES) {
        const ref = formatStandardReference(node, profile.id);
        expect(ref.code).toBeNull();
        expect(ref.verified).toBe(false);
        expect(ref.goal.length).toBeGreaterThan(0);
      }
    }
  });

  it("provides a descriptive global goal for every domain and grade band", () => {
    const domains: CurriculumDomain[] = ["math", "reading", "science", "logic"];
    const bands: GradeLevelBand[] = ["K-1", "2-3", "4-5"];
    for (const domain of domains) {
      for (const band of bands) {
        expect(getGlobalGoal(domain, band).length).toBeGreaterThan(10);
      }
    }
  });

  it("persists the active profile across reads", () => {
    setActiveCurriculumProfileId("uk-nc");
    expect(getActiveCurriculumProfileId()).toBe("uk-nc");
    // Unknown ids resolve back to the default profile.
    setActiveCurriculumProfileId("atlantis");
    expect(getActiveCurriculumProfileId()).toBe("global-goals");
  });
});
