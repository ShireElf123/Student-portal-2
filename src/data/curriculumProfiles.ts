/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SkillNode } from "./curriculumUniverse";

export interface CurriculumProfile {
  id: string;
  label: string;
  authority: string;
  description: string;
  verifiedMapping: boolean;
}

export const CURRICULUM_PROFILES: CurriculumProfile[] = [
  {
    id: "us-ccss",
    label: "Common Core & NGSS (US)",
    authority: "US State Standards / NGSS",
    description: "US Common Core State Standards for Math & ELA and Next Generation Science Standards.",
    verifiedMapping: true,
  },
  {
    id: "uk-national",
    label: "National Curriculum (England / UK)",
    authority: "UK Dept for Education",
    description: "Key Stages 1 & 2 programmes of study for Mathematics, English reading, and Science.",
    verifiedMapping: false,
  },
  {
    id: "ib-pyp",
    label: "IB Primary Years (Global / PYP)",
    authority: "International Baccalaureate",
    description: "Global transdisciplinary curriculum framework emphasizing conceptual inquiry and foundational competencies.",
    verifiedMapping: false,
  },
  {
    id: "au-acara",
    label: "Australian Curriculum (ACARA)",
    authority: "ACARA",
    description: "Australian Curriculum Foundation to Year 6 across Mathematics, English, and Science learning areas.",
    verifiedMapping: false,
  },
];

const STORAGE_KEY = "my_student_portal_curriculum_profile_v1";
let activeProfileId: string = "us-ccss";
const listeners = new Set<(profileId: string) => void>();

export function getActiveCurriculumProfileId(): string {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && CURRICULUM_PROFILES.some((p) => p.id === saved)) {
        activeProfileId = saved;
      }
    } catch {
      // Ignore localStorage access failures
    }
  }
  return activeProfileId;
}

export function setActiveCurriculumProfileId(profileId: string): void {
  const matched = CURRICULUM_PROFILES.find((p) => p.id === profileId);
  if (!matched || matched.id === activeProfileId) return;

  activeProfileId = matched.id;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, activeProfileId);
    } catch {
      // Ignore
    }
  }

  listeners.forEach((fn) => {
    try {
      fn(activeProfileId);
    } catch (err) {
      console.error("Error in curriculum profile listener:", err);
    }
  });

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("curriculum_profile_changed", { detail: { profileId: activeProfileId } })
    );
  }
}

export function subscribeCurriculumProfile(callback: (profileId: string) => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export interface StandardReference {
  code?: string;
  verified: boolean;
  profile: CurriculumProfile;
  goal: string;
}

/**
 * Returns the authority-aligned standard reference or learning goal
 * according to the selected curriculum profile lens.
 */
export function formatStandardReference(
  node: SkillNode,
  profileId: string = getActiveCurriculumProfileId()
): StandardReference {
  const profile =
    CURRICULUM_PROFILES.find((p) => p.id === profileId) || CURRICULUM_PROFILES[0];

  if (profile.id === "us-ccss" && node.standardCode) {
    return {
      code: node.standardCode,
      verified: true,
      profile,
      goal: node.title,
    };
  }

  return {
    code: profile.verifiedMapping ? node.standardCode : undefined,
    verified: profile.verifiedMapping,
    profile,
    goal: node.title,
  };
}
