import { getActivitiesForSkill, resolveActivityDefinition } from "../data/activitySkillRegistry";
import { CURRICULUM_SKILL_NODES, type CurriculumDomain, type GradeLevelBand } from "../data/curriculumUniverse";
import type { DifficultyLevel, LearningInteractionType } from "../learning/adaptiveTypes";
import type { ContentAgeBand, SupportedGameType } from "./types";

export interface SupportedGameEngine {
  gameType: SupportedGameType;
  activityId: string;
  experienceId: string;
  launchRoute: string;
  launchTargetId: string;
  skillIds: readonly string[];
  subjects: readonly CurriculumDomain[];
  gradeBands: readonly GradeLevelBand[];
  ageBandBySkill: Readonly<Record<string, ContentAgeBand>>;
  difficultyLevels: readonly DifficultyLevel[];
  interactionTypes: readonly LearningInteractionType[];
}

const ENGINE_CONFIG: Record<SupportedGameType, {
  activityId: string;
  skillIds: readonly string[];
  subjects: readonly CurriculumDomain[];
  gradeBands: readonly GradeLevelBand[];
  ageBandBySkill: Readonly<Record<string, ContentAgeBand>>;
  difficultyLevels: readonly DifficultyLevel[];
  interactionTypes: readonly LearningInteractionType[];
}> = {
  "speed-math": {
    activityId: "primary-lab-speed-math",
    skillIds: ["math-23-multiplication"],
    subjects: ["math"],
    gradeBands: ["2-3"],
    ageBandBySkill: { "math-23-multiplication": "7-9" },
    difficultyLevels: [1, 2, 3, 4, 5],
    interactionTypes: ["multiple-choice", "timed-response"],
  },
  "times-matrix": {
    activityId: "times-table-matrix-battle",
    skillIds: ["math-23-multiplication"],
    subjects: ["math"],
    gradeBands: ["2-3"],
    ageBandBySkill: { "math-23-multiplication": "7-9" },
    difficultyLevels: [1, 2, 3, 4, 5],
    interactionTypes: ["multiple-choice", "visual-grid"],
  },
  "bubble-pop-phonics": {
    activityId: "toddler-bubble-pop-phonics",
    skillIds: ["read-k1-alphabet-letters"],
    subjects: ["reading"],
    gradeBands: ["K-1"],
    ageBandBySkill: { "read-k1-alphabet-letters": "2-4" },
    difficultyLevels: [1, 2, 3, 4, 5],
    interactionTypes: ["tap-to-select", "letter-recognition"],
  },
};

function resolveEngine(gameType: SupportedGameType): SupportedGameEngine {
  const config = ENGINE_CONFIG[gameType];
  const activity = resolveActivityDefinition(config.activityId);
  return {
    gameType,
    activityId: activity.id,
    experienceId: activity.experienceId,
    launchRoute: activity.launch.route,
    launchTargetId: activity.launch.targetId,
    skillIds: config.skillIds,
    subjects: config.subjects,
    gradeBands: config.gradeBands,
    ageBandBySkill: config.ageBandBySkill,
    difficultyLevels: config.difficultyLevels,
    interactionTypes: config.interactionTypes,
  };
}

export const SUPPORTED_GAME_ENGINES: Readonly<Record<SupportedGameType, SupportedGameEngine>> = {
  "speed-math": resolveEngine("speed-math"),
  "times-matrix": resolveEngine("times-matrix"),
  "bubble-pop-phonics": resolveEngine("bubble-pop-phonics"),
};

export function isSupportedGameType(value: unknown): value is SupportedGameType {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(SUPPORTED_GAME_ENGINES, value);
}

export function getSupportedGameEngine(gameType: SupportedGameType): SupportedGameEngine {
  return SUPPORTED_GAME_ENGINES[gameType];
}

/** Returns a generated-content renderer only when the canonical activity already supports it. */
export function findSupportedGameTypeForActivity(activityId: string, skillId: string): SupportedGameType | null {
  return Object.values(SUPPORTED_GAME_ENGINES).find((engine) =>
    engine.activityId === activityId && engine.skillIds.includes(skillId)
  )?.gameType ?? null;
}

export function validateSupportedGameEngineRegistry(): string[] {
  const issues: string[] = [];
  const skillsById = new Map(CURRICULUM_SKILL_NODES.map((skill) => [skill.id, skill]));

  for (const engine of Object.values(SUPPORTED_GAME_ENGINES)) {
    const activity = resolveActivityDefinition(engine.activityId);
    if (activity.experienceId !== engine.experienceId) {
      issues.push(`${engine.gameType} experience ID does not match ${activity.id}`);
    }
    if (activity.launch.route !== engine.launchRoute || activity.launch.targetId !== engine.launchTargetId) {
      issues.push(`${engine.gameType} launch target does not match ${activity.id}`);
    }
    if (engine.skillIds.length === 0) issues.push(`${engine.gameType} must expose at least one curriculum skill.`);
    if (engine.subjects.length === 0 || engine.gradeBands.length === 0 || engine.interactionTypes.length === 0) {
      issues.push(`${engine.gameType} is missing subject, grade-band, or interaction capabilities.`);
    }
    if (engine.difficultyLevels.length === 0 || engine.difficultyLevels.some((level) => !Number.isInteger(level) || level < 1 || level > 5)) {
      issues.push(`${engine.gameType} has an invalid deterministic difficulty capability range.`);
    }

    for (const skillId of engine.skillIds) {
      const skill = skillsById.get(skillId);
      if (!skill) {
        issues.push(`${engine.gameType} references unknown skill ${skillId}`);
        continue;
      }
      if (!activity.skillIds.includes(skillId) || !getActivitiesForSkill(skillId).some((candidate) => candidate.id === activity.id)) {
        issues.push(`${engine.gameType} activity ${activity.id} is not registered for ${skillId}`);
      }
      if (!engine.ageBandBySkill[skillId]) {
        issues.push(`${engine.gameType} has no supported age band for ${skillId}`);
      }
      if (!engine.subjects.includes(skill.domain)) {
        issues.push(`${engine.gameType} does not declare the ${skill.domain} subject for ${skillId}`);
      }
      if (!engine.gradeBands.includes(skill.gradeBand)) {
        issues.push(`${engine.gameType} does not declare grade band ${skill.gradeBand} for ${skillId}`);
      }
    }
  }
  return issues;
}
