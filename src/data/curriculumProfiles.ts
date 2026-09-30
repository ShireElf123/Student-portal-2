import {
  CurriculumDomain,
  GradeLevelBand,
  SkillNode,
} from "./curriculumUniverse";

export interface CurriculumProfile {
  id: string;
  label: string;
  region: string;
  authority: string;
  description: string;
  /**
   * True only when this profile's per-skill standards codes have been reviewed
   * against the skill content. Regional codes are displayed ONLY for verified
   * profiles; every other profile shows descriptive global goals instead.
   */
  verifiedMapping: boolean;
}

export const CURRICULUM_PROFILES: CurriculumProfile[] = [
  {
    id: "global-goals",
    label: "Global Learning Goals",
    region: "Worldwide",
    authority: "My Student Portal",
    description:
      "Plain-language learning goals that travel across countries. No regional standards codes are claimed.",
    verifiedMapping: true,
  },
  {
    id: "us-ccss-ngss",
    label: "US Standards (CCSS · NGSS · CSTA)",
    region: "United States",
    authority: "CCSS / NGSS / CSTA",
    description:
      "Reviewed US standards references attached to each skill (math, reading, science, computing).",
    verifiedMapping: true,
  },
  {
    id: "za-caps",
    label: "South Africa (CAPS)",
    region: "South Africa",
    authority: "CAPS",
    description:
      "Curriculum and Assessment Policy Statement alignment is planned but its per-skill mapping has not been verified yet.",
    verifiedMapping: false,
  },
  {
    id: "uk-nc",
    label: "England (National Curriculum)",
    region: "United Kingdom",
    authority: "National Curriculum in England",
    description:
      "National Curriculum alignment is planned but its per-skill mapping has not been verified yet.",
    verifiedMapping: false,
  },
  {
    id: "au-curriculum",
    label: "Australia (Australian Curriculum)",
    region: "Australia",
    authority: "Australian Curriculum (ACARA)",
    description:
      "Australian Curriculum alignment is planned but its per-skill mapping has not been verified yet.",
    verifiedMapping: false,
  },
];

export const DEFAULT_CURRICULUM_PROFILE_ID = "global-goals";

const PROFILE_STORAGE_KEY = "my_student_portal_curriculum_profile";

export function getCurriculumProfile(profileId: string | null | undefined): CurriculumProfile {
  const match = CURRICULUM_PROFILES.find((profile) => profile.id === profileId);
  return match || CURRICULUM_PROFILES[0];
}

/**
 * Descriptive global goals per domain and grade band. These are plain-language
 * learning intentions written for this app — not claimed standards codes.
 */
const GLOBAL_GOALS: Record<CurriculumDomain, Record<GradeLevelBand, string>> = {
  math: {
    "K-1": "Build early number sense: count, compare, and add or subtract within 100.",
    "2-3": "Master multiplication facts, fractions of a whole, telling time, and measurement.",
    "4-5": "Work fluently with decimals, area and perimeter, and multi-step expressions.",
  },
  reading: {
    "K-1": "Hear and blend sounds, decode simple words, and read short sentences with support.",
    "2-3": "Read fluently, grow sight vocabulary, and retell stories with key details.",
    "4-5": "Infer meaning, compare viewpoints, and write organized paragraphs with evidence.",
  },
  science: {
    "K-1": "Observe habitats, weather, and seasons; ask questions and sort by properties.",
    "2-3": "Explore the solar system, matter and water, and how living things grow.",
    "4-5": "Investigate forces and energy, ecosystems, and cause-and-effect explanations.",
  },
  logic: {
    "K-1": "Sort, match, and continue simple patterns using clear rules.",
    "2-3": "Sequence steps, debug simple algorithms, and solve visual puzzles.",
    "4-5": "Use deduction, conditional reasoning, and systematic problem-solving.",
  },
};

export function getGlobalGoal(domain: CurriculumDomain, gradeBand: GradeLevelBand): string {
  return GLOBAL_GOALS[domain]?.[gradeBand] || "Keep practicing this skill with growing independence.";
}

export interface StandardReference {
  /** Regional code, or null when the profile mapping is unverified. */
  code: string | null;
  /** Always-available descriptive goal text. */
  goal: string;
  /** Whether `code` (when present) comes from a verified mapping. */
  verified: boolean;
  profile: CurriculumProfile;
}

/**
 * Resolves what the UI may claim about a skill under a curriculum profile.
 * Unverified regional profiles never yield a code — the UI must show the
 * descriptive goal plus an "alignment unverified" note instead.
 */
export function formatStandardReference(node: SkillNode, profileId: string): StandardReference {
  const profile = getCurriculumProfile(profileId);
  const goal = getGlobalGoal(node.domain, node.gradeBand);
  if (profile.id === "us-ccss-ngss" && profile.verifiedMapping) {
    return { code: node.standardCode, goal, verified: true, profile };
  }
  if (profile.id === "global-goals") {
    return { code: null, goal, verified: true, profile };
  }
  return { code: null, goal, verified: false, profile };
}

// ---- Active profile selection (device display preference) ----

export const CURRICULUM_PROFILE_CHANGED_EVENT = "curriculum_profile_changed";
const profileListeners = new Set<(profileId: string) => void>();

function readStoredProfileId(): string {
  try {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (saved && CURRICULUM_PROFILES.some((profile) => profile.id === saved)) {
      return saved;
    }
  } catch {
    // ignore
  }
  return DEFAULT_CURRICULUM_PROFILE_ID;
}

let activeProfileId: string = readStoredProfileId();

export function getActiveCurriculumProfileId(): string {
  return activeProfileId;
}

export function setActiveCurriculumProfileId(profileId: string): string {
  const resolved = getCurriculumProfile(profileId).id;
  if (resolved === activeProfileId) return activeProfileId;
  activeProfileId = resolved;
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, resolved);
  } catch {
    // ignore
  }
  profileListeners.forEach((fn) => {
    try {
      fn(resolved);
    } catch {
      // ignore
    }
  });
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CURRICULUM_PROFILE_CHANGED_EVENT, { detail: resolved }));
  }
  return activeProfileId;
}

export function subscribeCurriculumProfile(fn: (profileId: string) => void): () => void {
  profileListeners.add(fn);
  fn(activeProfileId);
  return () => {
    profileListeners.delete(fn);
  };
}
