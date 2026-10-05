import { CURRICULUM_SKILL_NODES } from "../data/curriculumUniverse";
import type { LearnerModel } from "../utils/learnerBrain";
import { getSupportedGameEngine } from "./registry";
import type {
  ContentDifficulty,
  ContentGenerationRequest,
  ContentTheme,
  LearnerGenerationContext,
  MasteryBand,
  SupportedGameType,
} from "./types";

const SKILL_BY_ID = new Map(CURRICULUM_SKILL_NODES.map((skill) => [skill.id, skill]));

export function getContentDifficultyForLearner(model: LearnerModel, skillId: string): ContentDifficulty {
  const level = model.skillMastery[skillId]?.currentDifficultyLevel ?? 1;
  if (level <= 2) return "easy";
  if (level <= 4) return "medium";
  return "hard";
}

/** Builds a small anonymous prompt context from one explicitly supplied learner model. */
export function buildLearnerGenerationContext(model: LearnerModel, skillId: string): LearnerGenerationContext {
  const skill = SKILL_BY_ID.get(skillId);
  if (!skill) throw new Error(`Cannot build learner context for unknown skill ${skillId}`);
  const record = model.skillMastery[skillId];
  const masteryBand: MasteryBand = !record || record.totalAttempts === 0 || record.tier === "locked"
    ? "new"
    : record.tier === "master" || record.evidenceScore >= 70
      ? "secure"
      : "developing";
  const recentIncorrectCount = Math.min(10, (model.recentEvents || []).filter((event) =>
    event.skillId === skillId && (event.outcome === "incorrect" || event.result === "struggle")
  ).length);
  const weakSkillIds = [...new Set((model.weakSkills || []).filter((weakSkillId) => {
    const weakSkill = SKILL_BY_ID.get(weakSkillId);
    return weakSkill?.domain === skill.domain;
  }))].slice(0, 5);

  return {
    gradeBand: skill.gradeBand,
    masteryBand,
    currentDifficultyLevel: Math.max(1, Math.min(5, Math.floor(record?.currentDifficultyLevel ?? 1))),
    recentIncorrectCount,
    weakSkillIds,
  };
}

export function buildContentGenerationRequest(
  model: LearnerModel,
  gameType: SupportedGameType,
  skillId: string,
  theme: ContentTheme,
  roundCount = 5
): ContentGenerationRequest {
  const engine = getSupportedGameEngine(gameType);
  const skill = SKILL_BY_ID.get(skillId);
  if (!skill) throw new Error(`Cannot generate content for unknown skill ${skillId}`);
  if (!engine.skillIds.includes(skillId)) {
    throw new Error(`${gameType} is not registered to generate content for ${skillId}`);
  }
  return {
    gameType,
    skillId,
    gradeBand: skill.gradeBand,
    difficulty: getContentDifficultyForLearner(model, skillId),
    theme,
    roundCount,
    learnerContext: buildLearnerGenerationContext(model, skillId),
  };
}
