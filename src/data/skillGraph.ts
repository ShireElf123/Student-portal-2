import {
  CURRICULUM_SKILL_NODES,
  type CurriculumDomain,
  type GradeLevelBand,
  type SkillNode,
} from "./curriculumUniverse";
import { getActivitiesForSkill } from "./activitySkillRegistry";
import { SUPPORTED_GAME_ENGINES } from "../contentEngine/registry";
import type { ContentAgeBand, SupportedGameType } from "../contentEngine/types";
import type {
  DifficultyLevel,
  LearningInteractionType,
  MisconceptionTag,
} from "../learning/adaptiveTypes";

export type SkillAssessmentCapability =
  | "registered-activity-response"
  | "generated-game-response"
  | "guided-assessment"
  | "diagnostic"
  | "picture-book-response";

export interface SkillGraphNode {
  id: string;
  skill: SkillNode;
  subject: CurriculumDomain;
  gradeBand: GradeLevelBand;
  standardReferences: readonly string[];
  prerequisiteSkillIds: readonly string[];
  foundationalSkillIds: readonly string[];
  relatedSkillIds: readonly string[];
  extensionSkillIds: readonly string[];
  masteryThreshold: number;
  practitionerThreshold: number;
  masteryMinimumSuccessfulAttempts: number;
  difficultyRange: { min: DifficultyLevel; max: DifficultyLevel };
  misconceptionTags: readonly MisconceptionTag[];
  compatibleActivityIds: readonly string[];
  compatibleGameTypes: readonly SupportedGameType[];
  interactionTypes: readonly LearningInteractionType[];
  compatibleAgeBands: readonly ContentAgeBand[];
  assessmentCapabilities: readonly SkillAssessmentCapability[];
}

const MISCONCEPTION_TAGS_BY_SKILL: Readonly<Record<string, readonly MisconceptionTag[]>> = {
  "math-23-multiplication": [
    "multiplication-operation-confusion",
    "factor-as-product",
    "off-by-one-calculation",
    "multiplication-fact-recall",
  ],
  "read-k1-alphabet-letters": ["letter-identification-confusion"],
};

const CURRICULUM_IDS = new Set(CURRICULUM_SKILL_NODES.map((node) => node.id));
const engines = Object.values(SUPPORTED_GAME_ENGINES);
const dependentsBySkill = new Map<string, string[]>();

for (const node of CURRICULUM_SKILL_NODES) {
  for (const prerequisiteId of node.prerequisites) {
    const dependents = dependentsBySkill.get(prerequisiteId) ?? [];
    dependents.push(node.id);
    dependentsBySkill.set(prerequisiteId, dependents);
  }
}

function relatedSkillsFor(skill: SkillNode): string[] {
  const scored = CURRICULUM_SKILL_NODES
    .filter((candidate) => candidate.id !== skill.id && candidate.domain === skill.domain)
    .map((candidate) => {
      const sharedPrerequisites = candidate.prerequisites.filter((id) => skill.prerequisites.includes(id)).length;
      const sameGradeBand = candidate.gradeBand === skill.gradeBand;
      const standardPrefix = skill.standardCode.split(".").slice(0, 3).join(".");
      const candidatePrefix = candidate.standardCode.split(".").slice(0, 3).join(".");
      const sameStandardFamily = standardPrefix === candidatePrefix;
      return {
        id: candidate.id,
        score: sharedPrerequisites * 4 + Number(sameStandardFamily) * 2 + Number(sameGradeBand),
      };
    })
    .sort((left, right) => right.score - left.score || left.id.localeCompare(right.id));
  return scored.slice(0, 5).map((candidate) => candidate.id);
}

function assessmentCapabilitiesFor(skillId: string): SkillAssessmentCapability[] {
  const activities = getActivitiesForSkill(skillId);
  const capabilities = new Set<SkillAssessmentCapability>();
  if (activities.length) capabilities.add("registered-activity-response");
  if (activities.some((activity) => activity.experienceType === "assessment")) {
    capabilities.add("guided-assessment");
    capabilities.add("diagnostic");
  }
  if (activities.some((activity) => activity.experienceType === "picture-book")) {
    capabilities.add("picture-book-response");
  }
  if (engines.some((engine) => engine.skillIds.includes(skillId))) {
    capabilities.add("generated-game-response");
  }
  return [...capabilities].sort();
}

const SKILL_GRAPH_NODES: SkillGraphNode[] = CURRICULUM_SKILL_NODES.map((skill) => {
  const compatibleEngines = engines.filter((engine) => engine.skillIds.includes(skill.id));
  const activities = getActivitiesForSkill(skill.id);
  const interactionTypes = [...new Set(compatibleEngines.flatMap((engine) => engine.interactionTypes))].sort();
  const compatibleAgeBands = [...new Set(compatibleEngines.map((engine) => engine.ageBandBySkill[skill.id]))].sort();
  return {
    id: skill.id,
    skill,
    subject: skill.domain,
    gradeBand: skill.gradeBand,
    standardReferences: [skill.standardCode],
    prerequisiteSkillIds: [...skill.prerequisites],
    foundationalSkillIds: [...skill.prerequisites],
    relatedSkillIds: relatedSkillsFor(skill),
    extensionSkillIds: [...(dependentsBySkill.get(skill.id) ?? [])].sort(),
    masteryThreshold: 80,
    practitionerThreshold: 45,
    masteryMinimumSuccessfulAttempts: 2,
    difficultyRange: { min: 1, max: 5 },
    misconceptionTags: MISCONCEPTION_TAGS_BY_SKILL[skill.id] ?? [],
    compatibleActivityIds: activities.map((activity) => activity.id).sort(),
    compatibleGameTypes: compatibleEngines.map((engine) => engine.gameType).sort(),
    interactionTypes,
    compatibleAgeBands,
    assessmentCapabilities: assessmentCapabilitiesFor(skill.id),
  };
});

const SKILL_GRAPH_BY_ID = new Map(SKILL_GRAPH_NODES.map((node) => [node.id, node]));

export function getSkillGraphNode(skillId: string): SkillGraphNode | undefined {
  return SKILL_GRAPH_BY_ID.get(skillId);
}

export function getSkillGraphNodes(): readonly SkillGraphNode[] {
  return SKILL_GRAPH_NODES;
}

/** Checks graph links and cycles without rewriting the canonical curriculum source. */
export function validateSkillGraph(): string[] {
  const issues: string[] = [];
  const visiting = new Set<string>();
  const visited = new Set<string>();

  for (const node of SKILL_GRAPH_NODES) {
    if (!CURRICULUM_IDS.has(node.id)) issues.push(`Graph node ${node.id} is absent from the curriculum.`);
    for (const prerequisiteId of node.prerequisiteSkillIds) {
      if (!CURRICULUM_IDS.has(prerequisiteId)) issues.push(`${node.id} has unknown prerequisite ${prerequisiteId}.`);
      if (prerequisiteId === node.id) issues.push(`${node.id} cannot be its own prerequisite.`);
    }
    for (const activityId of node.compatibleActivityIds) {
      if (!activitiesContainSkill(activityId, node.id)) {
        issues.push(`${activityId} is not canonically compatible with ${node.id}.`);
      }
    }
    for (const gameType of node.compatibleGameTypes) {
      const engine = SUPPORTED_GAME_ENGINES[gameType];
      if (!engine.skillIds.includes(node.id) || !node.compatibleActivityIds.includes(engine.activityId)) {
        issues.push(`${gameType} is not canonically compatible with ${node.id}.`);
      }
    }
  }

  const visit = (skillId: string, trail: string[]) => {
    if (visiting.has(skillId)) {
      issues.push(`Prerequisite cycle: ${[...trail, skillId].join(" -> ")}.`);
      return;
    }
    if (visited.has(skillId)) return;
    visiting.add(skillId);
    const node = SKILL_GRAPH_BY_ID.get(skillId);
    node?.prerequisiteSkillIds.forEach((prerequisiteId) => {
      if (CURRICULUM_IDS.has(prerequisiteId)) visit(prerequisiteId, [...trail, skillId]);
    });
    visiting.delete(skillId);
    visited.add(skillId);
  };
  SKILL_GRAPH_NODES.forEach((node) => visit(node.id, []));
  return [...new Set(issues)];
}

function activitiesContainSkill(activityId: string, skillId: string): boolean {
  return getActivitiesForSkill(skillId).some((activity) => activity.id === activityId && activity.skillIds.includes(skillId));
}
