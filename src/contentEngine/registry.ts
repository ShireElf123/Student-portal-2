import { getActivitiesForSkill, resolveActivityDefinition } from "../data/activitySkillRegistry";
import { CURRICULUM_SKILL_NODES } from "../data/curriculumUniverse";
import type { ContentAgeBand, SupportedGameType } from "./types";

export interface SupportedGameEngine {
  gameType: SupportedGameType;
  activityId: string;
  experienceId: string;
  launchRoute: string;
  launchTargetId: string;
  skillIds: readonly string[];
  ageBandBySkill: Readonly<Record<string, ContentAgeBand>>;
}

const ENGINE_CONFIG: Record<SupportedGameType, {
  activityId: string;
  skillIds: readonly string[];
  ageBandBySkill: Readonly<Record<string, ContentAgeBand>>;
}> = {
  "speed-math": {
    activityId: "primary-lab-speed-math",
    skillIds: ["math-23-multiplication"],
    ageBandBySkill: { "math-23-multiplication": "7-9" },
  },
  "times-matrix": {
    activityId: "times-table-matrix-battle",
    skillIds: ["math-23-multiplication"],
    ageBandBySkill: { "math-23-multiplication": "7-9" },
  },
  "bubble-pop-phonics": {
    activityId: "toddler-bubble-pop-phonics",
    skillIds: ["read-k1-alphabet-letters"],
    ageBandBySkill: { "read-k1-alphabet-letters": "2-4" },
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
    ageBandBySkill: config.ageBandBySkill,
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
    }
  }
  return issues;
}
