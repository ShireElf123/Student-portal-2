import { ALL_TODDLER_WORLDS } from "./toddler/toddlerWorldsArchitecture";
import { CURRICULUM_SKILL_NODES, CurriculumDomain, GradeLevelBand } from "./curriculumUniverse";
import { NavigationTab } from "../types";

export interface ActivitySkillMapping {
  activityId: string;
  skillId: string;
  domain: CurriculumDomain;
  gradeBand: GradeLevelBand | "toddler";
  displayName: string;
}

export interface LearningActivityDefinition {
  /** Stable activity identity. Not an experience, content instance, or event ID. */
  id: string;
  title: string;
  skillIds: string[];
  gradeBand: GradeLevelBand | "toddler";
  experienceId: string;
  experienceType: "primary-lab" | "toddler-game" | "toddler-world" | "picture-book" | "curriculum-quest" | "practice" | "assessment" | "homework" | "engagement";
  /** Minimum world-star gate required by this toddler-world route. */
  minimumWorldStars?: number;
  launch: {
    route: NavigationTab;
    targetId: string;
  };
}

const allSkillIds = CURRICULUM_SKILL_NODES.map((node) => node.id);

const CORE_ACTIVITY_DEFINITIONS: LearningActivityDefinition[] = [
  // Primary learning labs. Experience IDs are the internal target IDs understood by PrimaryLearningLab.
  { id: "primary-lab-speed-math", title: "Speed Math Blitz Sprint", skillIds: ["math-k1-addition-subtraction", "math-23-multiplication"], gradeBand: "2-3", experienceId: "speed-math-blitz-sprint", experienceType: "primary-lab", launch: { route: "primary-lab", targetId: "speed-math-blitz-sprint" } },
  { id: "primary-lab-fraction-slices", title: "Tactile Fraction Lab", skillIds: ["math-23-fractions"], gradeBand: "2-3", experienceId: "fraction-lab", experienceType: "primary-lab", launch: { route: "primary-lab", targetId: "fraction-lab" } },
  { id: "primary-lab-word-forge", title: "Word Forge Spelling Builder", skillIds: ["read-23-sight-words"], gradeBand: "2-3", experienceId: "word-forge", experienceType: "primary-lab", launch: { route: "primary-lab", targetId: "word-forge" } },
  { id: "primary-lab-balance-scale", title: "Physics Balance Scale Equations", skillIds: ["math-45-equations"], gradeBand: "4-5", experienceId: "balance-scale", experienceType: "primary-lab", launch: { route: "primary-lab", targetId: "balance-scale" } },
  { id: "primary-lab-tangram-geometry", title: "Tangram Geometry & Spatial Architect", skillIds: ["math-k1-shapes"], gradeBand: "K-1", experienceId: "tangram-geometry", experienceType: "primary-lab", launch: { route: "primary-lab", targetId: "tangram-geometry" } },
  { id: "code-rover-martian-maze", title: "Cyber Rover Algorithmic Runner", skillIds: ["logic-23-algorithms"], gradeBand: "2-3", experienceId: "cyber-rover-code-runner", experienceType: "primary-lab", launch: { route: "primary-lab", targetId: "cyber-rover-code-runner" } },
  { id: "times-table-matrix-battle", title: "Multiplication Matrix Sprint", skillIds: ["math-23-multiplication"], gradeBand: "2-3", experienceId: "times-matrix", experienceType: "primary-lab", launch: { route: "primary-lab", targetId: "times-matrix" } },
  { id: "primary-solar-explore", title: "Planetary Orbit Exploration", skillIds: ["sci-23-solarsystem"], gradeBand: "2-3", experienceId: "solar-system", experienceType: "primary-lab", launch: { route: "primary-lab", targetId: "solar-system" } },
  { id: "primary-solar-quiz", title: "Cosmic Astronomy Quiz", skillIds: ["sci-23-solarsystem"], gradeBand: "2-3", experienceId: "solar-system", experienceType: "primary-lab", launch: { route: "primary-lab", targetId: "solar-system:cosmic-quiz" } },

  // Integrated toddler games. Engagement-only activities deliberately have no curriculum skill.
  { id: "toddler-bubble-pop-phonics", title: "Bubble Pop Phonics Blast", skillIds: ["read-k1-alphabet-letters"], gradeBand: "toddler", experienceId: "bubble-pop-phonics", experienceType: "toddler-game", launch: { route: "toddler", targetId: "game:bubble-pop-phonics" } },
  { id: "toddler-pasture-sounds", title: "Grassy Pasture Sound Detective", skillIds: ["sci-k1-habitats"], gradeBand: "toddler", experienceId: "animal-safari", experienceType: "toddler-game", launch: { route: "toddler", targetId: "game:animal-safari" } },
  { id: "toddler-pond-counting", title: "Pond Splash Counting", skillIds: ["math-k1-counting"], gradeBand: "toddler", experienceId: "feed-animal", experienceType: "toddler-game", launch: { route: "toddler", targetId: "game:feed-animal" } },
  { id: "toddler-jungle-sounds", title: "Jungle Animal Safari", skillIds: ["sci-k1-habitats"], gradeBand: "toddler", experienceId: "animal-safari", experienceType: "toddler-game", launch: { route: "toddler", targetId: "game:animal-safari" } },
  { id: "toddler-ocean-counting", title: "Ocean Coral Counting", skillIds: ["math-k1-counting"], gradeBand: "toddler", experienceId: "feed-animal", experienceType: "toddler-game", launch: { route: "toddler", targetId: "game:feed-animal" } },
  { id: "toddler-color-magic", title: "Color Mixing Cauldron", skillIds: [], gradeBand: "toddler", experienceId: "color-magic", experienceType: "engagement", launch: { route: "toddler", targetId: "game:color-magic" } },
  { id: "toddler-rhyme-match", title: "Rhyme Time Garden", skillIds: ["read-k1-phonemic-awareness"], gradeBand: "toddler", experienceId: "rhyme-time", experienceType: "toddler-game", launch: { route: "toddler", targetId: "game:rhyme-time" } },
  { id: "toddler-piano-music", title: "Rainbow Xylophone Music Studio", skillIds: [], gradeBand: "toddler", experienceId: "rainbow-piano", experienceType: "engagement", launch: { route: "toddler", targetId: "game:rainbow-piano" } },
  { id: "toddler-balloon-sky", title: "Sky Balloon Alphabet & Numbers", skillIds: ["math-k1-counting", "read-k1-alphabet-letters"], gradeBand: "toddler", experienceId: "balloon-sky", experienceType: "toddler-game", launch: { route: "toddler", targetId: "game:balloon-sky" } },
  { id: "toddler-memory-match", title: "Memory Forest Match", skillIds: [], gradeBand: "toddler", experienceId: "memory-match", experienceType: "engagement", launch: { route: "toddler", targetId: "game:memory-match" } },
  { id: "toddler-safari-explorer", title: "Animal Safari Discovery", skillIds: ["sci-k1-habitats"], gradeBand: "toddler", experienceId: "animal-safari", experienceType: "toddler-game", launch: { route: "toddler", targetId: "game:animal-safari" } },
  { id: "toddler-quizzes-shapes", title: "Toddler Shape Quiz", skillIds: ["math-k1-shapes"], gradeBand: "toddler", experienceId: "shape-quiz", experienceType: "toddler-game", launch: { route: "toddler", targetId: "game:shape-match" } },
  { id: "toddler-animal-quiz", title: "Toddler Animal Detective Quiz", skillIds: ["sci-k1-habitats"], gradeBand: "toddler", experienceId: "animal-quiz", experienceType: "toddler-game", launch: { route: "toddler", targetId: "game:animal-quiz" } },
  { id: "toddler-shape-quiz", title: "Toddler Shape & Color Match Quiz", skillIds: ["math-k1-shapes"], gradeBand: "toddler", experienceId: "shape-quiz", experienceType: "toddler-game", launch: { route: "toddler", targetId: "game:shape-match" } },
  { id: "toddler-feed-animal", title: "Feed Benny Bunny Counting", skillIds: ["math-k1-counting"], gradeBand: "toddler", experienceId: "feed-animal", experienceType: "toddler-game", launch: { route: "toddler", targetId: "game:feed-animal" } },
  { id: "toddler-bubble-pop", title: "Rainbow Bubble Popper", skillIds: [], gradeBand: "toddler", experienceId: "bubble-pop", experienceType: "engagement", launch: { route: "toddler", targetId: "game:bubble-pop" } },
  { id: "toddler-mission-animals", title: "Animal World Safari Mission", skillIds: ["sci-k1-habitats"], gradeBand: "toddler", experienceId: "animal-safari", experienceType: "toddler-game", launch: { route: "toddler", targetId: "game:animal-safari" } },
  { id: "toddler-mission-counting", title: "Counting Grove Mission", skillIds: ["math-k1-counting"], gradeBand: "toddler", experienceId: "feed-animal", experienceType: "toddler-game", launch: { route: "toddler", targetId: "game:feed-animal" } },

  // Generic activities are valid for the linked skill, but recommendations prefer a dedicated lesson/game.
  { id: "curriculum-skill-practice", title: "Curriculum Skill Quest", skillIds: allSkillIds, gradeBand: "2-3", experienceId: "curriculum-skill-tree", experienceType: "curriculum-quest", launch: { route: "odyssey", targetId: "curriculum-quest" } },
  { id: "practice-session", title: "Adaptive Practice Session", skillIds: allSkillIds, gradeBand: "2-3", experienceId: "practice-arena", experienceType: "practice", launch: { route: "practice", targetId: "practice-arena" } },
  { id: "mistake-review", title: "Spaced Mistake Review", skillIds: allSkillIds, gradeBand: "2-3", experienceId: "mistake-review-vault", experienceType: "practice", launch: { route: "practice", targetId: "mistake-review" } },
  { id: "primary-homework", title: "Primary Homework Practice", skillIds: allSkillIds, gradeBand: "2-3", experienceId: "homework-desk", experienceType: "homework", launch: { route: "homework", targetId: "homework-desk" } },
  { id: "teacher-reviewed-assignment", title: "Teacher-Reviewed Assignment", skillIds: allSkillIds, gradeBand: "2-3", experienceId: "homework-desk", experienceType: "homework", launch: { route: "homework", targetId: "homework-desk" } },
  { id: "guided-assessment", title: "Guided Assessment", skillIds: allSkillIds, gradeBand: "2-3", experienceId: "guided-assessment-bridge", experienceType: "assessment", launch: { route: "assessment", targetId: "guided-assessment" } },
  { id: "diagnostic-assessment-summary", title: "Diagnostic Assessment Summary", skillIds: [], gradeBand: "2-3", experienceId: "diagnostic-placement", experienceType: "assessment", launch: { route: "assessment", targetId: "guided-assessment" } },
  { id: "diagnostic-question", title: "Diagnostic Question Response", skillIds: allSkillIds, gradeBand: "2-3", experienceId: "diagnostic-placement", experienceType: "assessment", launch: { route: "assessment", targetId: "guided-assessment" } },
  { id: "picture-book-interaction", title: "Picture Book Question", skillIds: ["read-k1-alphabet-letters", "math-k1-counting", "math-k1-shapes", "read-k1-listening-comprehension"], gradeBand: "toddler", experienceId: "picture-book-reader", experienceType: "picture-book", launch: { route: "toddler", targetId: "books" } },
  { id: "toddler-world-mission-completion", title: "Toddler World Mission Completion", skillIds: [], gradeBand: "toddler", experienceId: "toddler-worlds-navigator", experienceType: "engagement", launch: { route: "toddler", targetId: "worlds" } },
];

const TODDLER_WORLD_ACTIVITY_SKILLS: Record<string, string | undefined> = {
  "act-farm-sound-cow": "sci-k1-habitats",
  "act-farm-kitten-mom": "sci-k1-habitats",
  "act-farm-count-chicks": "math-k1-counting",
  "act-farm-horse-snack": "sci-k1-habitats",
  "act-jungle-sound-monkey": "sci-k1-habitats",
  "act-jungle-tracks-lion": "sci-k1-habitats",
  "act-jungle-habitat-parrot": "sci-k1-habitats",
  "act-jungle-count-bananas": "math-k1-counting",
  "act-ocean-sound-dolphin": "sci-k1-habitats",
  "act-ocean-glowing-jellyfish": "sci-k1-habitats",
  "act-ocean-sorting-land-water": "logic-k1-sorting",
  "act-dino-long-neck": "sci-k1-habitats",
  "act-dino-mighty-roar": "sci-k1-habitats",
  "act-forest-bird-song": "sci-k1-habitats",
  "act-forest-pinecone-count": "math-k1-counting",
  "act-weather-rain-protection": "sci-k1-weather-seasons",
  "act-weather-sun-warmth": "sci-k1-weather-seasons",
  "act-space-countdown-button": "logic-k1-patterns",
  "act-space-count-stars": "math-k1-counting",
  "act-space-moon-story": "read-k1-listening-comprehension",
  "act-treasure-chest-key": "logic-k1-sorting",
  "act-color-mix-orange": undefined,
  "act-color-mix-green": undefined,
  "act-music-high-low": undefined,
  "act-pattern-fruit-chain": "logic-k1-patterns",
  "act-sticker-crown-pick": undefined,
  "act-story-farm-full": "read-k1-listening-comprehension",
  "act-story-space-full": "read-k1-listening-comprehension",
  "act-story-ocean-full": "read-k1-listening-comprehension",
  "act-phonics-letter-b": "read-k1-alphabet-letters",
  "act-phonics-letter-s": "read-k1-alphabet-letters",
  "act-counting-more-stars": "math-k1-counting",
  "act-shapes-circle-round": "math-k1-shapes",
  "act-feelings-happy-smile": undefined,
  "act-habits-toothbrush": undefined,
  "act-habits-listening-ears": undefined,
  "act-family-sweet-baby": undefined,
};

const toddlerWorldDefinitions: LearningActivityDefinition[] = ALL_TODDLER_WORLDS.flatMap((world) =>
  world.areas.flatMap((area) =>
    area.activities.map((activity) => {
      const skillId = TODDLER_WORLD_ACTIVITY_SKILLS[activity.id];
      return {
        id: activity.id,
        title: activity.title,
        skillIds: skillId ? [skillId] : [],
        gradeBand: "toddler" as const,
        experienceId: "toddler-worlds-navigator",
        experienceType: skillId ? "toddler-world" as const : "engagement" as const,
        minimumWorldStars: area.requiredStarsToUnlock,
        launch: { route: "toddler" as const, targetId: `world:${world.id}:${area.id}:${activity.id}` },
      };
    })
  )
);

export const LEARNING_ACTIVITY_DEFINITIONS: LearningActivityDefinition[] = [
  ...CORE_ACTIVITY_DEFINITIONS,
  ...toddlerWorldDefinitions,
];

const activityDefinitionsById = new Map<string, LearningActivityDefinition>();
for (const definition of LEARNING_ACTIVITY_DEFINITIONS) {
  if (activityDefinitionsById.has(definition.id)) {
    throw new Error(`Duplicate learning activity ID: ${definition.id}`);
  }
  activityDefinitionsById.set(definition.id, definition);
}

const ACTIVITY_ALIASES: Record<string, string> = {
  "speed-math-blitz-sprint": "primary-lab-speed-math",
  "toddler-music-piano": "toddler-piano-music",
};

export interface ResolvedSkillResult {
  skillId?: string;
  domain: CurriculumDomain | "general";
  gradeBand: GradeLevelBand | "toddler";
  unmapped?: boolean;
}

const curriculumById = new Map(CURRICULUM_SKILL_NODES.map((node) => [node.id, node]));

/** Resolve a stable activity ID or known legacy activity alias. Unknown IDs fail visibly. */
export function resolveActivityDefinition(activityId: string): LearningActivityDefinition {
  const canonicalId = ACTIVITY_ALIASES[activityId] || activityId;
  const definition = activityDefinitionsById.get(canonicalId);
  if (!definition) {
    throw new Error(`Unknown learning activity ID: ${activityId}`);
  }
  return definition;
}

export function resolveActivityLaunchTarget(activityId: string): LearningActivityDefinition["launch"] {
  return resolveActivityDefinition(activityId).launch;
}

export function getActivitiesForSkill(skillId: string): LearningActivityDefinition[] {
  if (!curriculumById.has(skillId)) {
    throw new Error(`Unknown curriculum skill ID: ${skillId}`);
  }
  return LEARNING_ACTIVITY_DEFINITIONS.filter((definition) => definition.skillIds.includes(skillId));
}

/**
 * Centralized, typed legacy lookup retained for existing integrations.
 * Activities with more than one skill use their first ID as the legacy primary mapping.
 */
export const ACTIVITY_SKILL_REGISTRY: Record<string, ActivitySkillMapping> = Object.fromEntries(
  LEARNING_ACTIVITY_DEFINITIONS.flatMap((definition) => {
    const skillId = definition.skillIds[0];
    const skill = skillId ? curriculumById.get(skillId) : undefined;
    return skill
      ? [[definition.id, {
          activityId: definition.id,
          skillId,
          domain: skill.domain,
          gradeBand: definition.gradeBand,
          displayName: definition.title,
        } satisfies ActivitySkillMapping]]
      : [];
  })
);

/** Topic fallbacks are only used when they resolve to an actual curriculum skill. */
const SUBJECT_TOPIC_SKILL_MAP: Record<string, string> = {
  "reading-sight-words": "read-23-sight-words",
  "reading-comprehension": "read-23-comprehension",
  "reading-phonics": "read-k1-phonemic-awareness",
  "reading-alphabet": "read-k1-alphabet-letters",
  "reading-blends": "read-k1-consonant-blends",
  "reading-informational": "read-45-inference",
  "reading-vocabulary": "read-23-vocabulary-morphology",
  "math-counting": "math-k1-counting",
  "math-place-value": "math-k1-place-value",
  "math-addition": "math-k1-addition-subtraction",
  "math-subtraction": "math-k1-addition-subtraction",
  "math-multiplication": "math-23-multiplication",
  "math-division": "math-23-multiplication",
  "math-fractions": "math-23-fractions",
  "math-time": "math-23-measurement-time",
  "math-decimals": "math-45-decimals",
  "math-geometry": "math-k1-shapes",
  "math-area": "math-45-perimeter-area",
  "math-equations": "math-45-equations",
  "science-weather": "sci-k1-weather-seasons",
  "science-habitats": "sci-k1-habitats",
  "science-solarsystem": "sci-23-solarsystem",
  "science-space": "sci-23-solarsystem",
  "science-matter": "sci-23-matter-water",
  "science-energy": "sci-45-forces-energy",
  "science-ecosystems": "sci-45-ecosystems",
  "logic-sorting": "logic-k1-sorting",
  "logic-patterns": "logic-k1-patterns",
  "logic-algorithms": "logic-23-algorithms",
  "logic-debugging": "logic-23-debugging",
  "logic-deduction": "logic-45-deduction",
};

/**
 * Resolve a real skill reference for known activities or precise subject/topic pairs.
 * An unknown skill-shaped ID throws, and an unmatched general activity returns no skill;
 * no synthetic or unrelated mastery record is ever created.
 */
export function resolveSkillForActivity(
  activityId: string,
  subject?: string,
  topic?: string
): ResolvedSkillResult {
  const canonicalId = ACTIVITY_ALIASES[activityId] || activityId;
  const activity = activityDefinitionsById.get(canonicalId);
  if (activity) {
    if (!activity.skillIds.length) return { domain: "general", gradeBand: activity.gradeBand, unmapped: true };
    const topicResolvedGenericActivities = new Set([
      "practice-session", "mistake-review", "primary-homework", "teacher-reviewed-assignment",
    ]);
    if (!topicResolvedGenericActivities.has(activity.id)) {
      const skillId = activity.skillIds[0];
      const skill = curriculumById.get(skillId);
      if (!skill) throw new Error(`Activity ${canonicalId} references unknown skill ${skillId}`);
      return { skillId, domain: skill.domain, gradeBand: activity.gradeBand };
    }
    // Generic surfaces select the skill from their actual subject and topic below.
  }

  if (/^(math|read|sci|logic)-/.test(activityId)) {
    const skill = curriculumById.get(activityId);
    if (!skill) throw new Error(`Unknown curriculum skill ID: ${activityId}`);
    return { skillId: skill.id, domain: skill.domain, gradeBand: skill.gradeBand };
  }

  const normalizedSubject = (subject || "").toLowerCase().replace(/[^a-z]/g, "");
  const normalizedTopic = (topic || "").toLowerCase().replace(/[^a-z]/g, "");
  const domainPrefix = normalizedSubject.includes("read") || normalizedSubject.includes("ela") || normalizedSubject.includes("english") || normalizedSubject.includes("literacy")
    ? "reading"
    : normalizedSubject.includes("math") || normalizedSubject.includes("calc") || normalizedSubject.includes("arith")
      ? "math"
      : normalizedSubject.includes("sci") || normalizedSubject.includes("astro") || normalizedSubject.includes("physics") || normalizedSubject.includes("bio")
        ? "science"
        : normalizedSubject.includes("logic") || normalizedSubject.includes("comp") || normalizedSubject.includes("code") || normalizedSubject.includes("algo")
          ? "logic"
          : undefined;

  if (domainPrefix && normalizedTopic) {
    const match = Object.entries(SUBJECT_TOPIC_SKILL_MAP).find(([key]) => {
      const [subjectKey, ...topicParts] = key.split("-");
      const keyTopic = topicParts.join("");
      return subjectKey === domainPrefix && normalizedTopic.includes(keyTopic);
    });
    if (match) {
      const skill = curriculumById.get(match[1]);
      if (!skill) throw new Error(`Topic map ${match[0]} references unknown skill ${match[1]}`);
      return { skillId: skill.id, domain: skill.domain, gradeBand: skill.gradeBand };
    }
  }

  // No fallback to an arbitrary default skill: this activity is engagement-only until mapped.
  return { domain: "general", gradeBand: "K-1", unmapped: true };
}

export function validateLearningActivityRegistry(): string[] {
  const issues: string[] = [];
  const seenActivityIds = new Set<string>();
  const seenSkillIds = new Set<string>();
  const validRoutes = new Set<NavigationTab>([
    "home", "toddler", "homework", "assessment", "tutor", "subjects", "study-plan", "notebooks",
    "practice", "progress", "teacher", "parent", "tutor-hub", "odyssey", "primary-lab", "avatar-studio",
  ]);
  const primaryLabTargets = new Set([
    "speed-math-blitz-sprint", "fraction-lab", "word-forge", "balance-scale", "solar-system",
    "solar-system:cosmic-quiz", "tangram-geometry", "cyber-rover-code-runner", "times-matrix",
  ]);
  const toddlerGameTargets = new Set([
    "bubble-pop-phonics", "animal-safari", "feed-animal", "color-magic",
    "rhyme-time", "rainbow-piano", "balloon-sky", "memory-match", "shape-match", "animal-quiz", "bubble-pop",
  ]);

  for (const activity of LEARNING_ACTIVITY_DEFINITIONS) {
    if (seenActivityIds.has(activity.id)) issues.push(`Duplicate activity ID: ${activity.id}`);
    seenActivityIds.add(activity.id);
    if (!activity.id.trim()) issues.push("Activity has an empty ID");
    if (!activity.title.trim()) issues.push(`Activity ${activity.id} has an empty title`);
    if (!activity.experienceId.trim()) issues.push(`Activity ${activity.id} has an empty experience ID`);
    if (!validRoutes.has(activity.launch.route)) issues.push(`Activity ${activity.id} has unknown launch route ${activity.launch.route}`);
    if (!activity.launch.targetId.trim()) issues.push(`Activity ${activity.id} has an empty launch target`);

    for (const skillId of activity.skillIds) {
      if (!curriculumById.has(skillId)) issues.push(`${activity.id} references missing skill ${skillId}`);
    }
    if (activity.experienceType === "engagement" && activity.skillIds.length) {
      issues.push(`Engagement-only activity ${activity.id} must not map curriculum skills`);
    }
    if (!activity.skillIds.length && !["engagement", "assessment"].includes(activity.experienceType)) {
      issues.push(`${activity.id} is mastery-capable but has no curriculum skill or engagement classification`);
    }

    if (activity.experienceType === "primary-lab" &&
      (activity.launch.route !== "primary-lab" || !primaryLabTargets.has(activity.launch.targetId))) {
      issues.push(`Primary-lab activity ${activity.id} has unresolved launch target ${activity.launch.route}:${activity.launch.targetId}`);
    }
    if (activity.experienceType === "toddler-game" &&
      (activity.launch.route !== "toddler" || !activity.launch.targetId.startsWith("game:") ||
        !toddlerGameTargets.has(activity.launch.targetId.slice("game:".length)))) {
      issues.push(`Toddler game activity ${activity.id} has unresolved launch target ${activity.launch.route}:${activity.launch.targetId}`);
    }
    if (activity.experienceType === "toddler-world" || activity.launch.targetId.startsWith("world:")) {
      const [, worldId, areaId, activityId] = activity.launch.targetId.split(":");
      const target = activity.launch.route === "toddler" && activity.launch.targetId.startsWith("world:")
        ? ALL_TODDLER_WORLDS.find((world) => world.id === worldId)?.areas
          .find((area) => area.id === areaId)?.activities.find((item) => item.id === activityId)
        : undefined;
      if (!target || target.id !== activity.id) {
        issues.push(`Toddler world activity ${activity.id} has unresolved or mismatched launch target ${activity.launch.targetId}`);
      } else {
        const targetArea = ALL_TODDLER_WORLDS.find((world) => world.id === worldId)?.areas.find((area) => area.id === areaId);
        if (activity.minimumWorldStars !== targetArea?.requiredStarsToUnlock) {
          issues.push(`Toddler world activity ${activity.id} has an incorrect world-star launch gate`);
        }
      }
    }
    if (activity.launch.route === "toddler" && activity.launch.targetId.startsWith("game:") &&
      !toddlerGameTargets.has(activity.launch.targetId.slice("game:".length))) {
      issues.push(`Toddler activity ${activity.id} has unresolved game target ${activity.launch.targetId}`);
    }
    if (activity.experienceType === "picture-book" &&
      (activity.launch.route !== "toddler" || activity.launch.targetId !== "books")) {
      issues.push(`Picture-book activity ${activity.id} has unresolved launch target ${activity.launch.route}:${activity.launch.targetId}`);
    }
    if (["practice", "homework", "assessment", "curriculum-quest"].includes(activity.experienceType)) {
      const validSurfaceTargets: Record<string, string[]> = {
        practice: ["practice-arena", "mistake-review"],
        homework: ["homework-desk"],
        assessment: ["guided-assessment"],
        "curriculum-quest": ["curriculum-quest"],
      };
      if (!validSurfaceTargets[activity.experienceType].includes(activity.launch.targetId) ||
        (activity.experienceType === "practice" && activity.launch.route !== "practice") ||
        (activity.experienceType === "homework" && activity.launch.route !== "homework") ||
        (activity.experienceType === "assessment" && activity.launch.route !== "assessment") ||
        (activity.experienceType === "curriculum-quest" && activity.launch.route !== "odyssey")) {
        issues.push(`Activity ${activity.id} has unresolved launch target ${activity.launch.route}:${activity.launch.targetId}`);
      }
    }
    if (activity.experienceType === "engagement" && activity.id === "toddler-world-mission-completion" &&
      (activity.launch.route !== "toddler" || activity.launch.targetId !== "worlds")) {
      issues.push(`Engagement activity ${activity.id} has unresolved launch target ${activity.launch.route}:${activity.launch.targetId}`);
    }
  }

  for (const skill of CURRICULUM_SKILL_NODES) {
    if (seenSkillIds.has(skill.id)) issues.push(`Duplicate curriculum skill ID: ${skill.id}`);
    seenSkillIds.add(skill.id);
    if (!skill.id.trim()) issues.push("Curriculum skill has an empty ID");
    if (!skill.title.trim()) issues.push(`Curriculum skill ${skill.id} has an empty title`);
    if (curriculumById.has(skill.id) && !getActivitiesForSkill(skill.id).length) {
      issues.push(`${skill.id} has no activity or curriculum quest`);
    }
    for (const prerequisite of skill.prerequisites) {
      if (!curriculumById.has(prerequisite)) issues.push(`${skill.id} has missing prerequisite ${prerequisite}`);
    }
  }

  const visitedSkills = new Set<string>();
  const activeSkills = new Set<string>();
  const skillPath: string[] = [];
  const reportedCycles = new Set<string>();
  const visitSkillPrerequisites = (skillId: string) => {
    if (activeSkills.has(skillId)) {
      const start = skillPath.indexOf(skillId);
      const cycle = skillPath.slice(start).concat(skillId);
      const signature = cycle.slice(0, -1).sort().join("|");
      if (!reportedCycles.has(signature)) {
        reportedCycles.add(signature);
        issues.push(`Curriculum prerequisite cycle: ${cycle.join(" -> ")}`);
      }
      return;
    }
    if (visitedSkills.has(skillId)) return;
    const skill = curriculumById.get(skillId);
    if (!skill) return;
    activeSkills.add(skillId);
    skillPath.push(skillId);
    skill.prerequisites.forEach(visitSkillPrerequisites);
    skillPath.pop();
    activeSkills.delete(skillId);
    visitedSkills.add(skillId);
  };
  CURRICULUM_SKILL_NODES.forEach((skill) => visitSkillPrerequisites(skill.id));
  for (const [activityId, skillId] of Object.entries(SUBJECT_TOPIC_SKILL_MAP)) {
    if (!curriculumById.has(skillId)) issues.push(`Topic mapping ${activityId} references missing skill ${skillId}`);
  }
  const definedWorldActivityIds = new Set(toddlerWorldDefinitions.map((activity) => activity.id));
  if (definedWorldActivityIds.size !== toddlerWorldDefinitions.length) issues.push("Toddler world activity IDs are not unique");
  const mappedWorldIds = new Set(Object.keys(TODDLER_WORLD_ACTIVITY_SKILLS));
  for (const activityId of mappedWorldIds) {
    if (!definedWorldActivityIds.has(activityId)) issues.push(`World skill mapping has no activity: ${activityId}`);
  }
  for (const activity of toddlerWorldDefinitions) {
    if (!mappedWorldIds.has(activity.id)) issues.push(`World activity has no explicit mastery/engagement classification: ${activity.id}`);
  }
  return issues;
}
