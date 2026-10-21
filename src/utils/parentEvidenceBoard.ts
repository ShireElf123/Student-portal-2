/**
 * Parent evidence board: K–1 skills that have actual learner evidence.
 * Unpracticed skills are counted, never shown as mastered or failed.
 */
import { CURRICULUM_SKILL_NODES, type CurriculumDomain } from "../data/curriculumUniverse";
import { resolveActivityDefinition } from "../data/activitySkillRegistry";
import { isMasteryEvidenceEventType } from "../learning/eventEvidence";
import type { NavigationTab } from "../types";
import {
  computeRecommendations,
  selectActivityForSkill,
  type LearnerModel,
  type LearningEvent,
  type SkillMasteryRecord,
} from "./learnerBrain";

export const PARENT_EVIDENCE_GRADE_BAND = "K-1" as const;

export interface EvidenceLaunch {
  activityId: string;
  experienceId: string;
  skillId: string;
  targetTab: NavigationTab;
  targetId: string;
  activityTitle: string;
  reason: string;
}

export interface SkillEvidenceRow {
  skillId: string;
  skillTitle: string;
  domain: CurriculumDomain;
  standardCode: string;
  tier: SkillMasteryRecord["tier"];
  evidenceScore: number;
  confidence: number;
  totalAttempts: number;
  successfulAttempts: number;
  lastPracticedTimestamp: number;
  lastEvent: Pick<LearningEvent, "activityId" | "activityTitle" | "result" | "outcome" | "timestamp" | "eventType"> | null;
  next: EvidenceLaunch | null;
}

export interface ParentEvidenceBoardModel {
  gradeBand: typeof PARENT_EVIDENCE_GRADE_BAND;
  skillsInBand: number;
  rows: SkillEvidenceRow[];
  unpracticedCount: number;
  nextLaunch: EvidenceLaunch | null;
}

function lastEventForSkill(model: LearnerModel, skillId: string): LearningEvent | null {
  const matching = model.recentEvents
    .filter((event) => event.skillId === skillId)
    .sort((a, b) => b.timestamp - a.timestamp);
  const scored = matching.find((event) => isMasteryEvidenceEventType(event.eventType) && event.outcome !== "explored");
  return scored ?? matching[0] ?? null;
}

function launchForSkill(model: LearnerModel, skillId: string): EvidenceLaunch | null {
  const recommendation = computeRecommendations(model).find((item) => item.skillId === skillId);
  if (recommendation) {
    try {
      const activity = resolveActivityDefinition(recommendation.activityId);
      return {
        activityId: activity.id,
        experienceId: activity.experienceId,
        skillId,
        targetTab: activity.launch.route,
        targetId: activity.launch.targetId,
        activityTitle: activity.title,
        reason: recommendation.reason,
      };
    } catch {
      // Fall through to the registered activity for this skill.
    }
  }
  try {
    const activity = selectActivityForSkill(skillId, model.gradeBand);
    return {
      activityId: activity.id,
      experienceId: activity.experienceId,
      skillId,
      targetTab: activity.launch.route,
      targetId: activity.launch.targetId,
      activityTitle: activity.title,
      reason: "The next registered activity for this skill.",
    };
  } catch {
    return null;
  }
}

/** K–1 skills with at least one scored attempt. Empty skills stay off the board. */
export function buildParentEvidenceBoard(model: LearnerModel): ParentEvidenceBoardModel {
  const bandSkills = CURRICULUM_SKILL_NODES.filter((node) => node.gradeBand === PARENT_EVIDENCE_GRADE_BAND);
  const rows: SkillEvidenceRow[] = [];

  for (const skill of bandSkills) {
    const record = model.skillMastery[skill.id];
    const lastEvent = lastEventForSkill(model, skill.id);
    const attempts = record?.totalAttempts ?? 0;
    const hasScoredEvidence = Boolean(
      lastEvent && isMasteryEvidenceEventType(lastEvent.eventType) && lastEvent.outcome !== "explored"
    );
    if (attempts <= 0 && !hasScoredEvidence) continue;

    rows.push({
      skillId: skill.id,
      skillTitle: skill.title,
      domain: skill.domain,
      standardCode: skill.standardCode,
      tier: record?.tier ?? "novice",
      evidenceScore: record?.evidenceScore ?? 0,
      confidence: record?.confidence ?? 0,
      totalAttempts: attempts,
      successfulAttempts: record?.successfulAttempts ?? 0,
      lastPracticedTimestamp: record?.lastPracticedTimestamp ?? lastEvent?.timestamp ?? 0,
      lastEvent: lastEvent
        ? {
            activityId: lastEvent.activityId,
            activityTitle: lastEvent.activityTitle,
            result: lastEvent.result,
            outcome: lastEvent.outcome,
            timestamp: lastEvent.timestamp,
            eventType: lastEvent.eventType,
          }
        : null,
      next: launchForSkill(model, skill.id),
    });
  }

  rows.sort((a, b) => {
    const aStruggle = a.lastEvent?.outcome === "incorrect" ? 0 : 1;
    const bStruggle = b.lastEvent?.outcome === "incorrect" ? 0 : 1;
    return aStruggle - bStruggle || b.lastPracticedTimestamp - a.lastPracticedTimestamp || a.skillId.localeCompare(b.skillId);
  });

  const nextLaunch = rows.find((row) => row.lastEvent?.outcome === "incorrect")?.next
    ?? rows[0]?.next
    ?? null;

  return {
    gradeBand: PARENT_EVIDENCE_GRADE_BAND,
    skillsInBand: bandSkills.length,
    rows,
    unpracticedCount: bandSkills.length - rows.length,
    nextLaunch,
  };
}
