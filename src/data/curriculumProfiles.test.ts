// @vitest-environment jsdom
/**
 * Curriculum profile lens tests.
 *
 * Replaces the deleted suite from before `da574a3`: that version asserted a
 * "global-goals" default profile and a `getGlobalGoal` helper, neither of which
 * exists any more, so it was rewritten against the current API rather than
 * restored verbatim.
 *
 * What matters to families: the app remembers the curriculum a grown-up picked,
 * an unknown pick is ignored instead of silently breaking the lens, and only
 * standards that are actually verified are shown with a standard code.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  CURRICULUM_PROFILES,
  formatStandardReference,
  getActiveCurriculumProfileId,
  setActiveCurriculumProfileId,
  subscribeCurriculumProfile,
} from "./curriculumProfiles";
import type { SkillNode } from "./curriculumUniverse";

const STORAGE_KEY = "my_student_portal_curriculum_profile_v1";

const node = (standardCode = "CCSS.MATH.3.OA.1") =>
  ({
    id: "math-multiplication-1",
    title: "Multiplication as equal groups",
    standardCode,
  }) as SkillNode;

beforeEach(() => {
  // The active profile is module state, so reset it through the public API and
  // drop anything a previous test persisted.
  setActiveCurriculumProfileId("us-ccss");
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
  setActiveCurriculumProfileId("us-ccss");
});

describe("curriculum profiles", () => {
  it("offers the four supported frameworks with unique ids", () => {
    expect(CURRICULUM_PROFILES.map((profile) => profile.id)).toEqual([
      "us-ccss",
      "uk-national",
      "ib-pyp",
      "au-acara",
    ]);
    expect(new Set(CURRICULUM_PROFILES.map((profile) => profile.id)).size).toBe(
      CURRICULUM_PROFILES.length
    );
    for (const profile of CURRICULUM_PROFILES) {
      expect(profile.label.length).toBeGreaterThan(0);
      expect(profile.authority.length).toBeGreaterThan(0);
    }
  });

  it("marks only the framework whose standards are mapped as verified", () => {
    expect(CURRICULUM_PROFILES.filter((profile) => profile.verifiedMapping).map((p) => p.id)).toEqual([
      "us-ccss",
    ]);
  });

  it("defaults to the US Common Core lens", () => {
    expect(getActiveCurriculumProfileId()).toBe("us-ccss");
  });

  it("remembers a chosen profile and tells every listener about it", () => {
    const seen: string[] = [];
    const unsubscribe = subscribeCurriculumProfile((profileId) => seen.push(profileId));
    const changed = vi.fn();
    window.addEventListener("curriculum_profile_changed", changed);

    setActiveCurriculumProfileId("uk-national");

    expect(getActiveCurriculumProfileId()).toBe("uk-national");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("uk-national");
    expect(seen).toEqual(["uk-national"]);
    expect(changed).toHaveBeenCalledTimes(1);
    expect((changed.mock.calls[0][0] as CustomEvent).detail).toEqual({ profileId: "uk-national" });

    unsubscribe();
    window.removeEventListener("curriculum_profile_changed", changed);
  });

  it("stops notifying after unsubscribe and ignores re-selecting the same profile", () => {
    const seen: string[] = [];
    const unsubscribe = subscribeCurriculumProfile((profileId) => seen.push(profileId));

    setActiveCurriculumProfileId("ib-pyp");
    unsubscribe();
    setActiveCurriculumProfileId("au-acara");

    expect(seen).toEqual(["ib-pyp"]);
    expect(getActiveCurriculumProfileId()).toBe("au-acara");

    // Selecting what is already active is a no-op, not a duplicate event.
    const changed = vi.fn();
    window.addEventListener("curriculum_profile_changed", changed);
    setActiveCurriculumProfileId("au-acara");
    expect(changed).not.toHaveBeenCalled();
    window.removeEventListener("curriculum_profile_changed", changed);
  });

  it("ignores an unknown profile instead of breaking the lens", () => {
    setActiveCurriculumProfileId("uk-national");
    setActiveCurriculumProfileId("not-a-curriculum");

    expect(getActiveCurriculumProfileId()).toBe("uk-national");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("uk-national");
  });

  it("restores a saved profile, but not a saved value that is no longer offered", () => {
    localStorage.setItem(STORAGE_KEY, "ib-pyp");
    expect(getActiveCurriculumProfileId()).toBe("ib-pyp");

    localStorage.setItem(STORAGE_KEY, "retired-curriculum");
    expect(getActiveCurriculumProfileId()).toBe("ib-pyp");
  });
});

describe("standard references through the curriculum lens", () => {
  it("shows the real standard code for a verified framework", () => {
    const reference = formatStandardReference(node(), "us-ccss");

    expect(reference.code).toBe("CCSS.MATH.3.OA.1");
    expect(reference.verified).toBe(true);
    expect(reference.profile.id).toBe("us-ccss");
    expect(reference.goal).toBe("Multiplication as equal groups");
  });

  it("never invents a standard code for an unverified framework", () => {
    for (const profileId of ["uk-national", "ib-pyp", "au-acara"]) {
      const reference = formatStandardReference(node(), profileId);

      expect(reference.profile.id).toBe(profileId);
      expect(reference.verified).toBe(false);
      expect(reference.code).toBeUndefined();
      // The learning goal is still shown — only the standard code is withheld.
      expect(reference.goal).toBe("Multiplication as equal groups");
    }
  });

  it("falls back to the default framework when asked for an unknown one", () => {
    const reference = formatStandardReference(node(), "not-a-curriculum");

    expect(reference.profile.id).toBe("us-ccss");
    expect(reference.code).toBe("CCSS.MATH.3.OA.1");
    expect(reference.verified).toBe(true);
  });

  it("follows the active profile when no profile is passed in", () => {
    expect(formatStandardReference(node()).code).toBe("CCSS.MATH.3.OA.1");

    setActiveCurriculumProfileId("uk-national");

    expect(formatStandardReference(node()).code).toBeUndefined();
    expect(formatStandardReference(node()).verified).toBe(false);
  });
});
