import { AssessmentResult, AssessmentScore, GuidedAssessment } from "../types";
import { recordLearningEvent } from "./learnerBrain";

export interface AssessmentEvidenceEntry {
  itemId: string;
  skillId: string;
  score: AssessmentScore;
  result: "success" | "practice" | "struggle";
  numericScore: number;
}

export function buildAssessmentEvidenceEntries(
  assessment: GuidedAssessment,
  result: AssessmentResult
): AssessmentEvidenceEntry[] {
  return assessment.items.flatMap((item) => {
    const score = result.itemScores[item.id] || item.score;
    if (!item.skillId || score === "not_assessed") return [];
    const mapped = {
      mastered: { result: "success" as const, numericScore: 100 },
      developing: { result: "practice" as const, numericScore: 55 },
      needs_practice: { result: "struggle" as const, numericScore: 0 },
      not_assessed: null,
    }[score];
    if (!mapped) return [];
    return [{ itemId: item.id, skillId: item.skillId, score, ...mapped }];
  });
}

/** Turns every scored, explicitly mapped assessment item into its own traceable evidence event. */
export function recordAssessmentResultEvidence(
  assessment: GuidedAssessment,
  result: AssessmentResult,
  learnerId: string
): void {
  for (const entry of buildAssessmentEvidenceEntries(assessment, result)) {
    recordLearningEvent({
      id: `${result.id}:${entry.itemId}`,
      learnerId,
      activityId: "guided-assessment",
      experienceId: "guided-assessment-bridge",
      contentId: `${assessment.id}:${entry.itemId}`,
      eventType: "assessment_response",
      activityType: "guided-assessment",
      activityTitle: `${assessment.title}: ${entry.itemId}`,
      skillId: entry.skillId,
      domain: "general",
      gradeBand: assessment.targetStage === "toddler" ? "toddler" : "2-3",
      result: entry.result,
      score: entry.numericScore,
      difficulty: "easy",
      attempts: 1,
      hintsUsed: entry.score === "developing" ? 1 : 0,
      timestamp: result.timestamp,
      metadata: {
        assessmentId: assessment.id,
        assessmentResultId: result.id,
        itemId: entry.itemId,
        observedScore: entry.score,
        responseOutcome: entry.result,
      },
    });
  }
}
