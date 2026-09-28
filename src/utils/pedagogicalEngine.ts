import { recordLearningEvent, getLearnerModel, saveLearnerModel, getActiveLearnerId } from "./learnerBrain";
import { resolveSkillForActivity } from "../data/activitySkillRegistry";
export * from "./learnerBrain";

export interface MistakeVaultItem {
  id: string;
  questionId: string;
  domain: string;
  topic: string;
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
  const key = getMistakeVaultKey(learnerId);
  try {
    let raw = localStorage.getItem(key);
    // Legacy fallback for default scholar
    if (!raw && (!learnerId || learnerId === "scholar-primary-1" || learnerId === "child-maya")) {
      raw = localStorage.getItem(DEFAULT_MISTAKE_VAULT_KEY);
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
    if (targetId === "scholar-primary-1") {
      localStorage.setItem(DEFAULT_MISTAKE_VAULT_KEY, JSON.stringify(items));
    }
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

  // Report redemption learning event into unified learner brain using central registry
  try {
    const resolved = resolveSkillForActivity("mistake-review", item.domain, item.topic);
    recordLearningEvent({
      learnerId: targetId,
      activityId: `mistake-${item.id}`,
      activityType: "mistake-review",
      activityTitle: `Redeemed: ${item.topic}`,
      skillId: resolved.skillId,
      domain: resolved.domain,
      gradeBand: resolved.gradeBand,
      result: "success",
      score: 100,
      difficulty: "medium",
      attempts: 1,
      hintsUsed: 1,
    });
  } catch (e) {
    console.warn("Could not log redemption event:", e);
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
  return items.filter(i => !i.masteredOnReview || i.nextReviewTimestamp <= now).length;
}

// ==========================================
// 2. DIAGNOSTIC PLACEMENT QUEST ENGINE
// ==========================================

export interface DiagnosticQuestion {
  id: string;
  discipline: "math" | "reading" | "science" | "logic";
  targetGradeBand: "K-1" | "2-3" | "4-5";
  prompt: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export const DIAGNOSTIC_PLACEMENT_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: "diag-1",
    discipline: "math",
    targetGradeBand: "K-1",
    prompt: "If you have 10 building blocks and give away 4, how many blocks are left?",
    options: ["6 blocks", "5 blocks", "14 blocks", "4 blocks"],
    correctAnswerIndex: 0,
    explanation: "10 - 4 = 6. Counting back four from 10 leaves 6.",
  },
  {
    id: "diag-2",
    discipline: "reading",
    targetGradeBand: "2-3",
    prompt: "Which prefix can you add to 'happy' to make it mean 'not happy'?",
    options: ["un- (unhappy)", "re- (rehappy)", "pre- (prehappy)", "dis- (dishappy)"],
    correctAnswerIndex: 0,
    explanation: "The prefix 'un-' means 'not'. 'Unhappy' means not happy.",
  },
  {
    id: "diag-3",
    discipline: "math",
    targetGradeBand: "2-3",
    prompt: "What is 7 multiplied by 8?",
    options: ["56", "54", "48", "64"],
    correctAnswerIndex: 0,
    explanation: "7 × 8 = 56. (7 × 7 = 49, plus 7 more = 56).",
  },
  {
    id: "diag-4",
    discipline: "science",
    targetGradeBand: "4-5",
    prompt: "During photosynthesis, what gas do green leaves absorb from the air to make plant food?",
    options: ["Carbon Dioxide (CO2)", "Oxygen (O2)", "Helium", "Nitrogen"],
    correctAnswerIndex: 0,
    explanation: "Leaves absorb Carbon Dioxide (CO2) from the air along with sunlight and water to produce glucose.",
  },
  {
    id: "diag-5",
    discipline: "logic",
    targetGradeBand: "4-5",
    prompt: "If all Zips are Zops, and all Zops are Zaps, are all Zips definitely Zaps?",
    options: ["Yes, definitely", "No, impossible", "Only on Tuesdays", "Cannot be determined"],
    correctAnswerIndex: 0,
    explanation: "By transitive deductive logic: A is a subset of B, and B is a subset of C, so A is a subset of C.",
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
}

export function evaluateDiagnosticAnswers(answers: Record<string, number>, learnerId?: string): DiagnosticResult {
  let score = 0;
  const disciplineScores: Record<string, { correct: number; total: number }> = {
    math: { correct: 0, total: 0 },
    reading: { correct: 0, total: 0 },
    science: { correct: 0, total: 0 },
    logic: { correct: 0, total: 0 },
  };

  DIAGNOSTIC_PLACEMENT_QUESTIONS.forEach(q => {
    disciplineScores[q.discipline].total += 1;
    if (answers[q.id] === q.correctAnswerIndex) {
      score += 1;
      disciplineScores[q.discipline].correct += 1;
    }
  });

  let recommendedGradeBand: "K-1" | "2-3" | "4-5" = "2-3";
  let recommendedStartingNodeId = "math-23-multiplication";

  if (score <= 2) {
    recommendedGradeBand = "K-1";
    recommendedStartingNodeId = "math-k1-place-value";
  } else if (score >= 4) {
    recommendedGradeBand = "4-5";
    recommendedStartingNodeId = "math-45-decimals";
  }

  // Find weakest discipline
  let lowestRate = 1.1;
  let recommendedDomainFocus = "Mathematics & Operations";

  Object.entries(disciplineScores).forEach(([disc, s]) => {
    const rate = s.total > 0 ? s.correct / s.total : 1;
    if (rate < lowestRate) {
      lowestRate = rate;
      if (disc === "math") recommendedDomainFocus = "Mathematics & Operations";
      if (disc === "reading") recommendedDomainFocus = "Phonics & Reading Comprehension";
      if (disc === "science") recommendedDomainFocus = "STEM & Natural Discovery";
      if (disc === "logic") recommendedDomainFocus = "Logic & Computational Thinking";
    }
  });

  const result: DiagnosticResult = {
    completedAt: Date.now(),
    score,
    total: DIAGNOSTIC_PLACEMENT_QUESTIONS.length,
    recommendedGradeBand,
    recommendedDomainFocus,
    recommendedStartingNodeId,
    disciplineScores,
  };

  const targetId = learnerId || getActiveLearnerId();

  try {
    const key = getDiagnosticProfileKey(targetId);
    localStorage.setItem(key, JSON.stringify(result));
    if (targetId === "scholar-primary-1") {
      localStorage.setItem(DEFAULT_DIAGNOSTIC_PROFILE_KEY, JSON.stringify(result));
    }
    
    // Calibrate Learner Brain model with diagnostic result
    const model = getLearnerModel(targetId);
    model.gradeBand = recommendedGradeBand;
    recordLearningEvent({
      learnerId: targetId,
      activityId: "diagnostic-placement-quest",
      activityType: "diagnostic-placement",
      activityTitle: `Diagnostic Calibration (${score}/${DIAGNOSTIC_PLACEMENT_QUESTIONS.length})`,
      skillId: recommendedStartingNodeId,
      domain: "math",
      gradeBand: recommendedGradeBand,
      result: score >= 4 ? "mastered" : score >= 2 ? "success" : "practice",
      score: Math.round((score / DIAGNOSTIC_PLACEMENT_QUESTIONS.length) * 100),
      difficulty: score >= 4 ? "hard" : "medium",
      attempts: 1,
      hintsUsed: 0,
    });
  } catch {
    // ignore
  }

  return result;
}

export function getSavedDiagnosticResult(learnerId?: string): DiagnosticResult | null {
  const targetId = learnerId || getActiveLearnerId();
  const key = getDiagnosticProfileKey(targetId);
  try {
    let raw = localStorage.getItem(key);
    if (!raw && (!learnerId || learnerId === "scholar-primary-1" || learnerId === "child-maya")) {
      raw = localStorage.getItem(DEFAULT_DIAGNOSTIC_PROFILE_KEY);
    }
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
