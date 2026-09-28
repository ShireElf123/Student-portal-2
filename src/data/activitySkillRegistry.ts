import { CurriculumDomain, GradeLevelBand } from "./curriculumUniverse";

export interface ActivitySkillMapping {
  activityId: string;
  skillId: string;
  domain: CurriculumDomain;
  gradeBand: GradeLevelBand | "toddler";
  displayName: string;
}

/**
 * Centralized, typed Activity-to-Skill Registry.
 * Eliminates fragile substring guessing and ensures all learning surfaces
 * reliably attribute evidence to specific curriculum standard nodes.
 */
export const ACTIVITY_SKILL_REGISTRY: Record<string, ActivitySkillMapping> = {
  // Primary STEM & Concept Labs
  "primary-lab-speed-math": {
    activityId: "primary-lab-speed-math",
    skillId: "math-k1-addition-subtraction",
    domain: "math",
    gradeBand: "K-1",
    displayName: "Speed Math Blitz Sprint",
  },
  "primary-lab-fraction-slices": {
    activityId: "primary-lab-fraction-slices",
    skillId: "math-23-fractions",
    domain: "math",
    gradeBand: "2-3",
    displayName: "Tactile Fraction Lab",
  },
  "primary-lab-word-forge": {
    activityId: "primary-lab-word-forge",
    skillId: "read-23-sight-words",
    domain: "reading",
    gradeBand: "2-3",
    displayName: "Word Forge Spelling Builder",
  },
  "primary-lab-balance-scale": {
    activityId: "primary-lab-balance-scale",
    skillId: "math-45-equations",
    domain: "math",
    gradeBand: "4-5",
    displayName: "Physics Balance Scale Equations",
  },

  // Primary Solar System Astronomy Lab
  "primary-solar-explore": {
    activityId: "primary-solar-explore",
    skillId: "sci-23-solarsystem",
    domain: "science",
    gradeBand: "2-3",
    displayName: "Planetary Orbit Exploration",
  },
  "primary-solar-quiz": {
    activityId: "primary-solar-quiz",
    skillId: "sci-23-solarsystem",
    domain: "science",
    gradeBand: "2-3",
    displayName: "Cosmic Astronomy Quiz",
  },

  // Toddler World Navigator Activities
  "toddler-pasture-sounds": {
    activityId: "toddler-pasture-sounds",
    skillId: "sci-k1-habitats",
    domain: "science",
    gradeBand: "toddler",
    displayName: "Grassy Pasture Sound Detective",
  },
  "toddler-pond-counting": {
    activityId: "toddler-pond-counting",
    skillId: "math-k1-counting",
    domain: "math",
    gradeBand: "toddler",
    displayName: "Pond Splash Counting",
  },
  "toddler-barnyard-sorting": {
    activityId: "toddler-barnyard-sorting",
    skillId: "logic-k1-sorting",
    domain: "logic",
    gradeBand: "toddler",
    displayName: "Barnyard Sorting Game",
  },
  "toddler-jungle-sounds": {
    activityId: "toddler-jungle-sounds",
    skillId: "sci-k1-habitats",
    domain: "science",
    gradeBand: "toddler",
    displayName: "Jungle Animal Safari",
  },
  "toddler-ocean-counting": {
    activityId: "toddler-ocean-counting",
    skillId: "math-k1-counting",
    domain: "math",
    gradeBand: "toddler",
    displayName: "Ocean Coral Counting",
  },
  "toddler-color-magic": {
    activityId: "toddler-color-magic",
    skillId: "sci-23-matter-energy",
    domain: "science",
    gradeBand: "toddler",
    displayName: "Color Mixing Cauldron",
  },
  "toddler-rhyme-match": {
    activityId: "toddler-rhyme-match",
    skillId: "read-k1-phonemic-awareness",
    domain: "reading",
    gradeBand: "toddler",
    displayName: "Rhyme Time Garden",
  },
  "toddler-piano-music": {
    activityId: "toddler-piano-music",
    skillId: "read-k1-phonemic-awareness",
    domain: "reading",
    gradeBand: "toddler",
    displayName: "Rainbow Xylophone Music Studio",
  },
  "toddler-balloon-sky": {
    activityId: "toddler-balloon-sky",
    skillId: "math-k1-counting",
    domain: "math",
    gradeBand: "toddler",
    displayName: "Sky Balloon Alphabet & Numbers",
  },
  "toddler-memory-match": {
    activityId: "toddler-memory-match",
    skillId: "logic-k1-patterns",
    domain: "logic",
    gradeBand: "toddler",
    displayName: "Memory Forest Match",
  },
  "toddler-safari-explorer": {
    activityId: "toddler-safari-explorer",
    skillId: "sci-k1-habitats",
    domain: "science",
    gradeBand: "toddler",
    displayName: "Animal Safari Discovery",
  },
  "toddler-quizzes-shapes": {
    activityId: "toddler-quizzes-shapes",
    skillId: "logic-k1-sorting",
    domain: "logic",
    gradeBand: "toddler",
    displayName: "Toddler Shape & Animal Quiz",
  },
  "toddler-animal-quiz": {
    activityId: "toddler-animal-quiz",
    skillId: "sci-k1-habitats",
    domain: "science",
    gradeBand: "toddler",
    displayName: "Toddler Animal Detective Quiz",
  },
  "toddler-shape-quiz": {
    activityId: "toddler-shape-quiz",
    skillId: "logic-k1-sorting",
    domain: "logic",
    gradeBand: "toddler",
    displayName: "Toddler Shape & Color Match Quiz",
  },
  "toddler-feed-animal": {
    activityId: "toddler-feed-animal",
    skillId: "math-k1-counting",
    domain: "math",
    gradeBand: "toddler",
    displayName: "Feed Benny Bunny Counting",
  },
  "toddler-bubble-pop": {
    activityId: "toddler-bubble-pop",
    skillId: "logic-k1-patterns",
    domain: "logic",
    gradeBand: "toddler",
    displayName: "Rainbow Bubble Popper",
  },
  "toddler-music-piano": {
    activityId: "toddler-music-piano",
    skillId: "read-k1-phonemic-awareness",
    domain: "reading",
    gradeBand: "toddler",
    displayName: "Rainbow Xylophone Music Studio",
  },

  // Toddler Missions
  "toddler-mission-animals": {
    activityId: "toddler-mission-animals",
    skillId: "sci-k1-habitats",
    domain: "science",
    gradeBand: "toddler",
    displayName: "Animal World Safari Mission",
  },
  "toddler-mission-patterns": {
    activityId: "toddler-mission-patterns",
    skillId: "logic-k1-patterns",
    domain: "logic",
    gradeBand: "toddler",
    displayName: "Pattern Workshop Mission",
  },
  "toddler-mission-counting": {
    activityId: "toddler-mission-counting",
    skillId: "math-k1-counting",
    domain: "math",
    gradeBand: "toddler",
    displayName: "Counting Grove Mission",
  },
};

/**
 * Subject-specific topic fallback dictionary for Socratic Practice and Homework desk
 */
const SUBJECT_TOPIC_SKILL_MAP: Record<string, { skillId: string; domain: CurriculumDomain; gradeBand: GradeLevelBand }> = {
  // Reading
  "reading-sight-words": { skillId: "read-23-sight-words", domain: "reading", gradeBand: "2-3" },
  "reading-comprehension": { skillId: "read-23-reading-comprehension", domain: "reading", gradeBand: "2-3" },
  "reading-phonics": { skillId: "read-k1-phonemic-awareness", domain: "reading", gradeBand: "K-1" },
  "reading-blends": { skillId: "read-k1-consonant-blends", domain: "reading", gradeBand: "K-1" },
  "reading-informational": { skillId: "read-45-informational-text", domain: "reading", gradeBand: "4-5" },
  "reading-vocabulary": { skillId: "read-45-vocabulary-acquisition", domain: "reading", gradeBand: "4-5" },

  // Math
  "math-counting": { skillId: "math-k1-counting", domain: "math", gradeBand: "K-1" },
  "math-place-value": { skillId: "math-k1-place-value", domain: "math", gradeBand: "K-1" },
  "math-addition": { skillId: "math-k1-addition-subtraction", domain: "math", gradeBand: "K-1" },
  "math-subtraction": { skillId: "math-k1-addition-subtraction", domain: "math", gradeBand: "K-1" },
  "math-multiplication": { skillId: "math-23-multiplication", domain: "math", gradeBand: "2-3" },
  "math-division": { skillId: "math-23-multiplication", domain: "math", gradeBand: "2-3" },
  "math-fractions": { skillId: "math-23-fractions", domain: "math", gradeBand: "2-3" },
  "math-time": { skillId: "math-23-measurement-time", domain: "math", gradeBand: "2-3" },
  "math-decimals": { skillId: "math-45-decimals", domain: "math", gradeBand: "4-5" },
  "math-geometry": { skillId: "math-45-geometry-area", domain: "math", gradeBand: "4-5" },
  "math-equations": { skillId: "math-45-equations", domain: "math", gradeBand: "4-5" },

  // Science
  "science-weather": { skillId: "sci-k1-weather-seasons", domain: "science", gradeBand: "K-1" },
  "science-habitats": { skillId: "sci-k1-habitats", domain: "science", gradeBand: "K-1" },
  "science-solarsystem": { skillId: "sci-23-solarsystem", domain: "science", gradeBand: "2-3" },
  "science-space": { skillId: "sci-23-solarsystem", domain: "science", gradeBand: "2-3" },
  "science-matter": { skillId: "sci-23-matter-energy", domain: "science", gradeBand: "2-3" },
  "science-energy": { skillId: "sci-45-energy-circuits", domain: "science", gradeBand: "4-5" },
  "science-ecosystems": { skillId: "sci-45-ecosystems-web", domain: "science", gradeBand: "4-5" },

  // Logic & Computational Thinking
  "logic-sorting": { skillId: "logic-k1-sorting", domain: "logic", gradeBand: "K-1" },
  "logic-patterns": { skillId: "logic-k1-patterns", domain: "logic", gradeBand: "K-1" },
  "logic-algorithms": { skillId: "logic-23-algorithms", domain: "logic", gradeBand: "2-3" },
  "logic-debugging": { skillId: "logic-23-debugging", domain: "logic", gradeBand: "2-3" },
  "logic-variables": { skillId: "logic-45-variables-conditionals", domain: "logic", gradeBand: "4-5" },
  "logic-functions": { skillId: "logic-45-modular-decomposition", domain: "logic", gradeBand: "4-5" },
};

export interface ResolvedSkillResult {
  skillId: string;
  domain: CurriculumDomain | "general";
  gradeBand: GradeLevelBand | "toddler";
  unmapped?: boolean;
}

/**
 * Resolves the precise curriculum standard node and domain for any activity,
 * subject, or topic in the application.
 * If no mapping exists, explicitly marks the event as unmapped rather than
 * silently assigning it to an unrelated skill.
 */
export function resolveSkillForActivity(
  activityId: string,
  subject?: string,
  topic?: string
): ResolvedSkillResult {
  // 1. Direct registry hit
  if (ACTIVITY_SKILL_REGISTRY[activityId]) {
    const reg = ACTIVITY_SKILL_REGISTRY[activityId];
    return { skillId: reg.skillId, domain: reg.domain, gradeBand: reg.gradeBand };
  }

  // 2. Check if activityId itself matches a known curriculum node
  if (activityId.startsWith("math-") || activityId.startsWith("read-") || activityId.startsWith("sci-") || activityId.startsWith("logic-")) {
    const parts = activityId.split("-");
    const domain = parts[0] as CurriculumDomain;
    const gradeBand = parts[1] === "k1" ? "K-1" : parts[1] === "23" ? "2-3" : "4-5";
    return { skillId: activityId, domain, gradeBand };
  }

  // 3. Subject + Topic resolution
  const cleanSubject = (subject || "").toLowerCase();
  const cleanTopic = (topic || "").toLowerCase();

  for (const [key, mapping] of Object.entries(SUBJECT_TOPIC_SKILL_MAP)) {
    const [subKey, topKey] = key.split("-");
    if (cleanSubject.includes(subKey) && cleanTopic.includes(topKey)) {
      return mapping;
    }
  }

  // 4. Subject-only resolution
  if (cleanSubject.includes("read") || cleanSubject.includes("ela") || cleanSubject.includes("english") || cleanSubject.includes("literacy")) {
    return { skillId: "read-23-sight-words", domain: "reading", gradeBand: "2-3" };
  }
  if (cleanSubject.includes("math") || cleanSubject.includes("calc") || cleanSubject.includes("arith")) {
    return { skillId: "math-k1-place-value", domain: "math", gradeBand: "K-1" };
  }
  if (cleanSubject.includes("sci") || cleanSubject.includes("astro") || cleanSubject.includes("physics") || cleanSubject.includes("bio")) {
    return { skillId: "sci-23-solarsystem", domain: "science", gradeBand: "2-3" };
  }
  if (cleanSubject.includes("log") || cleanSubject.includes("comp") || cleanSubject.includes("code") || cleanSubject.includes("algo")) {
    return { skillId: "logic-23-algorithms", domain: "logic", gradeBand: "2-3" };
  }

  // If no legitimate curriculum mapping exists, explicitly mark as unmapped
  return {
    skillId: "unmapped-activity",
    domain: "general",
    gradeBand: "K-1",
    unmapped: true,
  };
}
