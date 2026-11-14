import { AssessmentResult, AssessmentScore, GuidedAssessment } from "../types";
import { recordLearningEvent } from "./learnerBrain";

export function tallyAssessmentScores(
  itemIds: string[],
  scores: Record<string, AssessmentScore | undefined>,
): {
  mastered: number;
  developing: number;
  needsPractice: number;
  unanswered: number;
  scored: number;
  percent: number;
  starsAwarded: number;
  itemScores: Record<string, AssessmentScore>;
} {
  let mastered = 0;
  let developing = 0;
  let needsPractice = 0;
  let unanswered = 0;
  const itemScores: Record<string, AssessmentScore> = {};
  for (const id of itemIds) {
    const score = scores[id];
    if (!score || score === "not_assessed") {
      unanswered += 1;
      itemScores[id] = "not_assessed";
      continue;
    }
    itemScores[id] = score;
    if (score === "mastered") mastered += 1;
    else if (score === "developing") developing += 1;
    else if (score === "needs_practice") needsPractice += 1;
    else {
      unanswered += 1;
      itemScores[id] = "not_assessed";
    }
  }
  const scored = mastered + developing + needsPractice;
  const percent = scored === 0 ? 0 : Math.round((mastered / scored) * 100);
  const starsAwarded = scored === 0 ? 0 : Math.max(1, Math.min(5, Math.ceil((percent / 100) * 5)));
  return { mastered, developing, needsPractice, unanswered, scored, percent, starsAwarded, itemScores };
}

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
    try {
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
    } catch (error) {
      console.error("Failed to record guided-assessment evidence:", error);
    }
  }
}
