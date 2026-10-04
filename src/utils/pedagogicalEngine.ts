import { recordLearningEvent, getLearnerModel, saveLearnerModel, getActiveLearnerId } from "./learnerBrain";
import { resolveSkillForActivity } from "../data/activitySkillRegistry";
import { CURRICULUM_SKILL_NODES } from "../data/curriculumUniverse";
export * from "./learnerBrain";

export interface MistakeVaultItem {
  id: string;
  questionId: string;
  domain: string;
  topic: string;
  skillId?: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  selectedAnswerIndex: number;
  explanation: string;
  hintLevel1: string;
  hintLevel2: string;
  hintLevel3: string;
  timestamp: number;
  timesMissed: number;
  masteredOnReview: boolean;
  nextReviewTimestamp: number; // For spaced repetition
}

const DEFAULT_MISTAKE_VAULT_KEY = "my_student_portal_mistake_vault_v1";
const DEFAULT_DIAGNOSTIC_PROFILE_KEY = "my_student_portal_diagnostic_profile_v1";

function getMistakeVaultKey(learnerId?: string): string {
  const targetId = learnerId || getActiveLearnerId();
  return `my_student_portal_mistake_vault_v1_${targetId}`;
}

function getDiagnosticProfileKey(learnerId?: string): string {
  const targetId = learnerId || getActiveLearnerId();
  return `my_student_portal_diagnostic_profile_v1_${targetId}`;
}

// ==========================================
// 1. MISTAKE BANK & SPACED REPETITION ENGINE
// ==========================================

export function getMistakeVault(learnerId?: string): MistakeVaultItem[] {
  const targetId = learnerId || getActiveLearnerId();
  const key = getMistakeVaultKey(targetId);
  try {
    let raw = localStorage.getItem(key);
    // Adopt old unscoped data for the historical default learner only.
    if (!raw && targetId === "scholar-primary-1") {
      raw = localStorage.getItem(DEFAULT_MISTAKE_VAULT_KEY);
      if (raw) {
        localStorage.setItem(key, raw);
        localStorage.removeItem(DEFAULT_MISTAKE_VAULT_KEY);
      }
    }
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveMistakeVault(items: MistakeVaultItem[], learnerId?: string): void {
  const targetId = learnerId || getActiveLearnerId();
  const key = getMistakeVaultKey(targetId);
  try {
    localStorage.setItem(key, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("mistake_vault_updated", { detail: items }));
  } catch {
    // ignore
  }
}

export function recordMistake(
  item: Omit<MistakeVaultItem, "id" | "timestamp" | "timesMissed" | "masteredOnReview" | "nextReviewTimestamp">,
  learnerId?: string
): void {
  const targetId = learnerId || getActiveLearnerId();
  const current = getMistakeVault(targetId);
  const existingIdx = current.findIndex(m => m.questionId === item.questionId);

  // Spaced repetition interval: 1 day first time, 3 days second time
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  if (existingIdx >= 0) {
    current[existingIdx].timesMissed += 1;
    current[existingIdx].masteredOnReview = false;
    current[existingIdx].selectedAnswerIndex = item.selectedAnswerIndex;
    current[existingIdx].skillId = item.skillId;
    current[existingIdx].nextReviewTimestamp = Date.now() + ONE_DAY_MS;
    current[existingIdx].timestamp = Date.now();
  } else {
    const newItem: MistakeVaultItem = {
      ...item,
      id: `mistake-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      timesMissed: 1,
      masteredOnReview: false,
      nextReviewTimestamp: Date.now() + ONE_DAY_MS,
    };
    current.unshift(newItem);
  }

  saveMistakeVault(current, targetId);
}

export function resolveMistakeWithRedemption(id: string, learnerId?: string): { success: boolean; crownsAwarded: number } {
  const targetId = learnerId || getActiveLearnerId();
  const current = getMistakeVault(targetId);
  const item = current.find(m => m.id === id);
  if (!item) return { success: false, crownsAwarded: 0 };

  item.masteredOnReview = true;
  // Push next review further out (e.g., 7 days)
  item.nextReviewTimestamp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  saveMistakeVault(current, targetId);

  // Attribute redemption only to the skill captured when the mistake was made.
  try {
    const resolved = item.skillId
      ? resolveSkillForActivity(item.skillId)
      : resolveSkillForActivity("mistake-review", item.domain, item.topic);
    recordLearningEvent({
      learnerId: targetId,
      activityId: "mistake-review",
      experienceId: "mistake-review-vault",
      contentId: item.questionId,
      eventType: resolved.skillId ? "practice_response" : "content_explored",
      activityType: "mistake-review",
      activityTitle: `Redeemed: ${item.topic}`,
      skillId: resolved.skillId,
      domain: resolved.domain,
      gradeBand: resolved.gradeBand,
      result: resolved.skillId ? "success" : "explored",
      score: resolved.skillId ? 100 : undefined,
      difficulty: "medium",
      attempts: 1,
      hintsUsed: 1,
      metadata: { mistakeId: item.id, sourceQuestionId: item.questionId },
    });
  } catch (e) {
    console.error("Could not log mistake redemption evidence:", e);
  }

  return { success: true, crownsAwarded: 1 };
}

export function clearMistake(id: string, learnerId?: string): void {
  const targetId = learnerId || getActiveLearnerId();
  const current = getMistakeVault(targetId).filter(m => m.id !== id);
  saveMistakeVault(current, targetId);
}

export function getDueMistakesCount(learnerId?: string): number {
  const targetId = learnerId || getActiveLearnerId();
  const items = getMistakeVault(targetId);
  const now = Date.now();
  return items.filter((item) => item.nextReviewTimestamp <= now).length;
}

// ==========================================
// 2. DIAGNOSTIC PLACEMENT QUEST ENGINE
// ==========================================

export interface DiagnosticQuestion {
  id: string;
  discipline: "math" | "reading" | "science" | "logic";
  targetGradeBand: "K-1" | "2-3" | "4-5";
  skillId?: string;
  prompt: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export const DIAGNOSTIC_PLACEMENT_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: "diag-1",
    skillId: "math-k1-addition-subtraction",
    discipline: "math",
    targetGradeBand: "K-1",
    prompt: "If you have 10 building blocks and give away 4, how many blocks are left?",
    options: ["6 blocks", "5 blocks", "14 blocks", "4 blocks"],
    correctAnswerIndex: 0,
    explanation: "10 - 4 = 6. Counting back four from 10 leaves 6.",
  },
  {
    id: "diag-2",
    skillId: "read-23-vocabulary-morphology",
    discipline: "reading",
    targetGradeBand: "2-3",
    prompt: "Which prefix can you add to 'happy' to make it mean 'not happy'?",
    options: ["un- (unhappy)", "re- (rehappy)", "pre- (prehappy)", "dis- (dishappy)"],
    correctAnswerIndex: 0,
    explanation: "The prefix 'un-' means 'not'. 'Unhappy' means not happy.",
  },
  {
    id: "diag-3",
    skillId: "math-23-multiplication",
    discipline: "math",
    targetGradeBand: "2-3",
    prompt: "What is 7 multiplied by 8?",
    options: ["56", "54", "48", "64"],
    correctAnswerIndex: 0,
    explanation: "7 × 8 = 56. (7 × 7 = 49, plus 7 more = 56).",
  },
  {
    id: "diag-4",
    skillId: "sci-45-ecosystems",
    discipline: "science",
    targetGradeBand: "4-5",
    prompt: "During photosynthesis, what gas do green leaves absorb from the air to make plant food?",
    options: ["Carbon Dioxide (CO2)", "Oxygen (O2)", "Helium", "Nitrogen"],
    correctAnswerIndex: 0,
    explanation: "Leaves absorb Carbon Dioxide (CO2) from the air along with sunlight and water to produce glucose.",
  },
  {
    id: "diag-5",
    skillId: "logic-45-deduction",
    discipline: "logic",
    targetGradeBand: "4-5",
    prompt: "If all Zips are Zops, and all Zops are Zaps, are all Zips definitely Zaps?",
    options: ["Yes, definitely", "No, impossible", "Only on Tuesdays", "Cannot be determined"],
    correctAnswerIndex: 0,
    explanation: "By transitive deductive logic: A is a subset of B, and B is a subset of C, so A is a subset of C.",
  },
  {
    id: "diag-6",
    skillId: "read-k1-phonemic-awareness", discipline: "reading", targetGradeBand: "K-1",
    prompt: "Which word rhymes with 'cake'?",
    options: ["lake", "cup", "sun", "fish"], correctAnswerIndex: 0,
    explanation: "Lake rhymes with cake because both words end with the same long-a sound and /k/ sound.",
  },
  {
    id: "diag-7",
    skillId: "sci-k1-habitats", discipline: "science", targetGradeBand: "K-1",
    prompt: "Which part of a plant usually takes in water from the soil?",
    options: ["Roots", "Flower petals", "Fruit", "Leaves only"], correctAnswerIndex: 0,
    explanation: "Roots hold a plant in place and take in water and nutrients from the soil.",
  },
  {
    id: "diag-8",
    skillId: "logic-k1-patterns", discipline: "logic", targetGradeBand: "K-1",
    prompt: "What comes next in this pattern: red, blue, red, blue, ...?",
    options: ["Red", "Green", "Yellow", "Purple"], correctAnswerIndex: 0,
    explanation: "The two-color pattern repeats: red, blue, red, blue, then red again.",
  },
  {
    id: "diag-9",
    skillId: "math-45-decimals", discipline: "math", targetGradeBand: "4-5",
    prompt: "A ribbon is 3.5 metres long. You use 1.2 metres. How much ribbon remains?",
    options: ["2.3 metres", "2.7 metres", "4.7 metres", "1.3 metres"], correctAnswerIndex: 0,
    explanation: "Line up the decimal points and subtract: 3.5 − 1.2 = 2.3 metres.",
  },
  {
    id: "diag-10",
    skillId: "read-45-inference", discipline: "reading", targetGradeBand: "4-5",
    prompt: "Mia wore a coat because dark clouds gathered and the wind grew cold. What can you infer?",
    options: ["Rain or colder weather may be coming", "It is definitely summer", "Mia is going swimming", "The wind has stopped"], correctAnswerIndex: 0,
    explanation: "The dark clouds and colder wind are clues that rain or colder weather may be approaching.",
  },
  {
    id: "diag-11",
    skillId: "logic-23-algorithms", discipline: "logic", targetGradeBand: "2-3",
    prompt: "A rule machine adds 3 to every number. What comes out when 5 goes in?",
    options: ["8", "2", "15", "53"], correctAnswerIndex: 0,
    explanation: "Apply the rule once: 5 + 3 = 8.",
  },
  {
    id: "diag-12",
    skillId: "sci-23-matter-water", discipline: "science", targetGradeBand: "2-3",
    prompt: "Which change is most likely to help an ice cube melt faster?",
    options: ["Place it in a warm sunny spot", "Wrap it in more ice", "Put it in a freezer", "Move it into a colder room"], correctAnswerIndex: 0,
    explanation: "A warmer place transfers heat to the ice, so it melts faster.",
  },
];

export interface DiagnosticResult {
  completedAt: number;
  score: number;
  total: number;
  recommendedGradeBand: "K-1" | "2-3" | "4-5";
  recommendedDomainFocus: string;
  recommendedStartingNodeId: string;
  disciplineScores: Record<string, { correct: number; total: number }>;
  gradeBandScores: Record<"K-1" | "2-3" | "4-5", { correct: number; total: number }>;
}

export function evaluateDiagnosticAnswers(answers: Record<string, number>, learnerId?: string): DiagnosticResult {
  let score = 0;
  const disciplineScores: Record<string, { correct: number; total: number }> = {
    math: { correct: 0, total: 0 }, reading: { correct: 0, total: 0 },
    science: { correct: 0, total: 0 }, logic: { correct: 0, total: 0 },
  };
  const gradeBandScores: DiagnosticResult["gradeBandScores"] = {
    "K-1": { correct: 0, total: 0 }, "2-3": { correct: 0, total: 0 }, "4-5": { correct: 0, total: 0 },
  };

  DIAGNOSTIC_PLACEMENT_QUESTIONS.forEach((q) => {
    disciplineScores[q.discipline].total += 1;
    gradeBandScores[q.targetGradeBand].total += 1;
    if (answers[q.id] === q.correctAnswerIndex) {
      score += 1;
      disciplineScores[q.discipline].correct += 1;
      gradeBandScores[q.targetGradeBand].correct += 1;
    }
  });

  // Treat this as a short screening snapshot, not a definitive grade-level label:
  // advance through bands only when the learner shows evidence at each preceding band.
  let recommendedGradeBand: DiagnosticResult["recommendedGradeBand"] = "K-1";
  const meetsBandThreshold = (band: keyof DiagnosticResult["gradeBandScores"]) => {
    const result = gradeBandScores[band];
    return result.total > 0 && result.correct / result.total >= 0.5;
  };
  if (meetsBandThreshold("K-1")) recommendedGradeBand = "2-3";
  if (meetsBandThreshold("K-1") && meetsBandThreshold("2-3")) recommendedGradeBand = "4-5";

  const domainFocus: Record<string, string> = {
    math: "Mathematics & Operations", reading: "Phonics & Reading Comprehension",
    science: "STEM & Natural Discovery", logic: "Logic & Computational Thinking",
  };
  const weakestDomain = Object.entries(disciplineScores)
    .sort(([, a], [, b]) => (a.total ? a.correct / a.total : 1) - (b.total ? b.correct / b.total : 1))[0]?.[0] || "math";
  const recommendedDomainFocus = domainFocus[weakestDomain] || domainFocus.math;
  const recommendedNode = CURRICULUM_SKILL_NODES.find((node) => node.domain === weakestDomain && node.gradeBand === recommendedGradeBand);
  const recommendedStartingNodeId = recommendedNode?.id || (recommendedGradeBand === "K-1" ? "math-k1-place-value" : recommendedGradeBand === "2-3" ? "math-23-multiplication" : "math-45-decimals");

  const result: DiagnosticResult = {
    completedAt: Date.now(),
    score,
    total: DIAGNOSTIC_PLACEMENT_QUESTIONS.length,
    recommendedGradeBand,
    recommendedDomainFocus,
    recommendedStartingNodeId,
    disciplineScores,
    gradeBandScores,
  };

  const targetId = learnerId || getActiveLearnerId();

  try {
    const key = getDiagnosticProfileKey(targetId);
    localStorage.setItem(key, JSON.stringify(result));
    if (targetId === "scholar-primary-1") {
      localStorage.setItem(DEFAULT_DIAGNOSTIC_PROFILE_KEY, JSON.stringify(result));
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("diagnostic_profile_updated", { detail: result }));
    }
    
    // Calibrate the learner's stage, then retain each mapped response as its own evidence event.
    const model = getLearnerModel(targetId);
    model.gradeBand = recommendedGradeBand;
    saveLearnerModel(model, targetId);
    DIAGNOSTIC_PLACEMENT_QUESTIONS.forEach((question) => {
      if (!question.skillId || answers[question.id] === undefined) return;
      const correct = answers[question.id] === question.correctAnswerIndex;
      recordLearningEvent({
        id: `diagnostic-${result.completedAt}-${question.id}`,
        learnerId: targetId,
        activityId: "diagnostic-question",
        experienceId: "diagnostic-placement",
        contentId: question.id,
        eventType: "assessment_response",
        activityType: "diagnostic-placement",
        activityTitle: `Diagnostic: ${question.prompt.slice(0, 64)}`,
        skillId: question.skillId,
        domain: question.discipline,
        gradeBand: question.targetGradeBand,
        result: correct ? "success" : "struggle",
        score: correct ? 100 : 0,
        difficulty: "medium",
        attempts: 1,
        hintsUsed: 0,
        timestamp: result.completedAt,
      });
    });
    recordLearningEvent({
      id: `diagnostic-summary-${result.completedAt}`,
      learnerId: targetId,
      activityId: "diagnostic-assessment-summary",
      experienceId: "diagnostic-placement",
      contentId: `score-${score}-of-${DIAGNOSTIC_PLACEMENT_QUESTIONS.length}`,
      eventType: "diagnostic_summary",
      activityType: "diagnostic-placement",
      activityTitle: `Diagnostic Calibration (${score}/${DIAGNOSTIC_PLACEMENT_QUESTIONS.length})`,
      domain: "general",
      gradeBand: recommendedGradeBand,
      result: "explored",
      score: Math.round((score / DIAGNOSTIC_PLACEMENT_QUESTIONS.length) * 100),
      difficulty: "medium",
      attempts: 1,
      hintsUsed: 0,
      timestamp: result.completedAt,
      metadata: { recommendedStartingNodeId, recommendedGradeBand },
    });
  } catch (error) {
    console.error("Failed to persist diagnostic result or learning evidence:", error);
  }

  return result;
}

export function getSavedDiagnosticResult(learnerId?: string): DiagnosticResult | null {
  const targetId = learnerId || getActiveLearnerId();
  const key = getDiagnosticProfileKey(targetId);
  try {
    let raw = localStorage.getItem(key);
    if (!raw && targetId === "scholar-primary-1") {
      raw = localStorage.getItem(DEFAULT_DIAGNOSTIC_PROFILE_KEY);
    }
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
