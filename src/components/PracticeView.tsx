import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Target,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Loader2,
  AlertCircle,
  Bot,
  Brain,
  Award,
  Printer,
} from "lucide-react";
import { NavigationTab, Notebook, PracticeQuestion, PracticeSession } from "../types";
import { canConsumeAI, recordAIConsumption } from "../services/aiUsageService";
import {
  recordMistake,
  getDueMistakesCount,
  recordLearningEvent,
} from "../utils/pedagogicalEngine";
import { getActiveLearnerId, getAdaptiveDifficultyForSkill, subscribeLearnerModel } from "../utils/learnerBrain";
import { resolveSkillForActivity } from "../data/activitySkillRegistry";
import { MistakeReviewVaultModal } from "./MistakeReviewVaultModal";
import { PrintableWorksheetGenerator } from "./PrintableWorksheetGenerator";

interface PracticeViewProps {
  notebooks: Notebook[];
  prefilledSubject?: string;
  prefilledTopic?: string;
  currentUserId?: string;
  onSaveSession: (session: PracticeSession) => void;
  onNavigate: (tab: NavigationTab) => void;
  onAskTutor: (prompt: string) => void;
  onOpenSubscriptionModal?: () => void;
  initialActivityId?: string;
  initialSkillId?: string;
}

export function PracticeView({
  notebooks,
  prefilledSubject = "",
  prefilledTopic = "",
  currentUserId,
  onSaveSession,
  onNavigate,
  onAskTutor,
  onOpenSubscriptionModal,
  initialActivityId,
  initialSkillId,
}: PracticeViewProps) {
  // Setup Form
  const [subject, setSubject] = useState(prefilledSubject || notebooks[0]?.subject || "Mathematics");
  const [topic, setTopic] = useState(prefilledTopic || notebooks[0]?.name || "Core Principles");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [count, setCount] = useState<number>(5);

  const [learnerRevision, setLearnerRevision] = useState(0);
  const [pinnedSkillId, setPinnedSkillId] = useState<string | undefined>(initialSkillId);
  useEffect(() => subscribeLearnerModel(() => setLearnerRevision((revision) => revision + 1)), []);
  useEffect(() => setPinnedSkillId(initialSkillId), [initialSkillId]);

  // A route may pin one exact curriculum target; free-form practice resolves only
  // from its actual subject/topic and never falls back to an unrelated skill.
  const targetSkillInfo = useMemo(() => {
    return pinnedSkillId
      ? resolveSkillForActivity(pinnedSkillId)
      : resolveSkillForActivity("practice-session", subject, topic);
  }, [pinnedSkillId, subject, topic]);

  // Query real adaptive difficulty calibration from the Learner Brain
  const brainAdaptiveLevel = useMemo(() => {
    if (!targetSkillInfo.skillId) return "medium" as const;
    const rawDiff = getAdaptiveDifficultyForSkill(targetSkillInfo.skillId, currentUserId);
    if (rawDiff === "beginner" || rawDiff === "easy") return "easy" as const;
    if (rawDiff === "hard" || rawDiff === "expert") return "hard" as const;
    return "medium" as const;
  }, [targetSkillInfo.skillId, currentUserId, learnerRevision]);

  // Session State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [hintLevel, setHintLevel] = useState<number>(0); // 0 = none, 1 = nudge, 2 = eliminate, 3 = worked
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState(() => `prac-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);
  const questionStartedAt = useRef(Date.now());

  // Recalibrate between sessions, never mid-quiz, so each round stays internally consistent.
  useEffect(() => {
    if (prefilledSubject) setSubject(prefilledSubject);
    if (prefilledTopic) setTopic(prefilledTopic);
    if (questions.length === 0) setDifficulty(brainAdaptiveLevel);
  }, [prefilledSubject, prefilledTopic, brainAdaptiveLevel, questions.length]);

  // Modals
  const [isMistakeVaultOpen, setIsMistakeVaultOpen] = useState(false);
  useEffect(() => {
    setIsMistakeVaultOpen(initialActivityId === "mistake-review");
  }, [initialActivityId]);
  const [isWorksheetModalOpen, setIsWorksheetModalOpen] = useState(false);
  const [dueMistakes, setDueMistakes] = useState(getDueMistakesCount());

  useEffect(() => {
    const handleUpdate = () => setDueMistakes(getDueMistakesCount());
    window.addEventListener("mistake_vault_updated", handleUpdate);
    return () => window.removeEventListener("mistake_vault_updated", handleUpdate);
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !topic.trim()) {
      setError("Please specify both a subject and a topic to practice.");
      return;
    }

    const quotaCheck = canConsumeAI("practice");
    if (!quotaCheck.allowed) {
      setError(
        quotaCheck.reason ||
          "Daily practice generation quota reached. Upgrade your subscription plan or check back tomorrow."
      );
      return;
    }

    setLoading(true);
    setError(null);
    setSelectedAnswers({});
    setCurrentIndex(0);
    setHintLevel(0);
    setIsCompleted(false);
    setSessionId(`prac-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);
    questionStartedAt.current = Date.now();

    try {
      const response = await fetch("/api/practice/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject.trim(),
          topic: topic.trim(),
          difficulty,
          count,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to generate practice session.");
      }

      const data = await response.json();
      if (!Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error("No practice questions were generated. Please try again.");
      }

      recordAIConsumption("practice");
      setQuestions(data.questions);
    } catch (err: any) {
      setError(err.message || "An error occurred generating questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    if (selectedAnswers[currentIndex] !== undefined) return; // already answered
    const nextAnswers = { ...selectedAnswers, [currentIndex]: optionIndex };
    setSelectedAnswers(nextAnswers);

    const q = questions[currentIndex];
    const isCorrect = optionIndex === q.correctAnswerIndex;

    if (!isCorrect) {
      // Record mistake into spaced repetition review vault
      recordMistake({
        questionId: `${sessionId}-${q.id || `question-${currentIndex}`}`,
        domain: subject,
        topic: topic,
        question: q.question,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex,
        selectedAnswerIndex: optionIndex,
        explanation: q.explanation,
        hintLevel1: q.hint || "Review key terms and core concept principles.",
        hintLevel2: "Notice which choices can be ruled out by basic estimation.",
        hintLevel3: q.explanation,
        skillId: targetSkillInfo.skillId,
      });
      setDueMistakes(getDueMistakesCount());
    }

    try {
      recordLearningEvent({
        learnerId: getActiveLearnerId(),
        activityId: "practice-session",
        experienceId: "practice-arena",
        contentId: `${sessionId}:question-${currentIndex + 1}`,
        eventType: targetSkillInfo.skillId ? "practice_response" : "content_explored",
        activityType: "practice-session",
        activityTitle: `${topic}: Practice Question ${currentIndex + 1}`,
        skillId: targetSkillInfo.skillId,
        domain: targetSkillInfo.domain,
        gradeBand: targetSkillInfo.gradeBand,
        result: targetSkillInfo.skillId ? (isCorrect ? "success" : "struggle") : "explored",
        score: isCorrect ? 100 : 0,
        difficulty: difficulty === "hard" ? "hard" : difficulty === "easy" ? "easy" : "medium",
        attempts: 1,
        hintsUsed: hintLevel,
        timeSpentSeconds: Math.max(1, Math.round((Date.now() - questionStartedAt.current) / 1000)),
      });
    } catch (error) {
      console.error("Failed to record practice response evidence:", error);
    }

    // If this was the last question, conclude session and save
    if (currentIndex === questions.length - 1) {
      const correctCount = questions.reduce((acc, currQ, idx) => {
        return acc + (nextAnswers[idx] === currQ.correctAnswerIndex ? 1 : 0);
      }, 0);

      const session: PracticeSession = {
        id: sessionId,
        subject: subject.trim(),
        topic: topic.trim(),
        difficulty,
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        timestamp: Date.now(),
      };
      onSaveSession(session);
    }
  };

  const currentQ = questions[currentIndex];
  const isCurrentAnswered = currentQ && selectedAnswers[currentIndex] !== undefined;

  const totalScore = questions.reduce((acc, q, idx) => {
    return acc + (selectedAnswers[idx] === q.correctAnswerIndex ? 1 : 0);
  }, 0);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="pb-3 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <Target className="text-emerald-400" size={32} />
            Active Recall Practice
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
            AI-generated quiz questions with 3-step hint ladders & spaced repetition mistake recovery
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Review Bag quick access */}
          <button
            onClick={() => setIsMistakeVaultOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Brain size={15} />
            <span>Review Bag</span>
            {dueMistakes > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                {dueMistakes}
              </span>
            )}
          </button>

          {/* Offline Worksheet */}
          <button
            onClick={() => setIsWorksheetModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer size={15} />
            <span>Print Worksheet</span>
          </button>

          {questions.length > 0 && !isCompleted && (
            <button
              onClick={() => {
                if (window.confirm("Abandon current practice quiz and start a new one?")) {
                  setQuestions([]);
                  setIsCompleted(false);
                }
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-300 transition-colors"
            >
              Reset Session
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 sm:p-5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs sm:text-sm font-semibold flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3 flex-1">
            <AlertCircle size={20} className="shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
          <div className="flex items-center gap-2">
            {onOpenSubscriptionModal && (
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  onOpenSubscriptionModal();
                }}
                className="text-xs sm:text-sm text-indigo-300 hover:text-white bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 px-3 py-1.5 rounded-xl transition-colors font-bold cursor-pointer"
              >
                Manage AI Quota
              </button>
            )}
            <button onClick={() => setError(null)} className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Setup Form (when no questions loaded or session reset) */}
      {questions.length === 0 && (
        <form
          onSubmit={handleGenerate}
          className="p-6 sm:p-8 md:p-10 rounded-3xl bg-[#0f172a] border border-slate-800 space-y-6 shadow-xl"
        >
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-400">
            <Sparkles size={16} />
            <span>Configure Practice Session</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mathematics, Computer Science, Biology"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-sm sm:text-base text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-300 mb-2">
                Topic or Principle
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Integration by parts, QuickSort complexity"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-sm sm:text-base text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-inner"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-300 mb-2">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {(["easy", "medium", "hard"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficulty(lvl)}
                    className={`py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider border-2 transition-all cursor-pointer ${
                      difficulty === lvl
                        ? "bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30 scale-[1.02]"
                        : "bg-slate-900/70 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                <span className="font-semibold truncate">Target: {targetSkillInfo.skillId}</span>
                <span className="font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 shrink-0">
                  Brain Recommended: {brainAdaptiveLevel}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-300 mb-2">
                Question Count
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[3, 5, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCount(num)}
                    className={`py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black border-2 transition-all cursor-pointer ${
                      count === num
                        ? "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30 scale-[1.02]"
                        : "bg-slate-900/70 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    {num} Questions
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading || !subject.trim() || !topic.trim()}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-2xl text-sm sm:text-base font-black flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer active:scale-98"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Generating Rigorous Questions with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>Start Practice Session</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Active Question Carousel */}
      {questions.length > 0 && !isCompleted && currentQ && (
        <div className="p-6 sm:p-8 md:p-10 rounded-3xl bg-[#0f172a] border border-slate-800 space-y-6 sm:space-y-8 shadow-2xl">
          {/* Top Progress */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm">
              <span className="font-extrabold text-emerald-400 uppercase tracking-wider">{subject}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300 font-bold">{topic}</span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-black uppercase px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                {difficulty}
              </span>
            </div>

            <span className="text-xs sm:text-sm font-bold text-slate-400">
              Question <span className="text-white font-black">{currentIndex + 1}</span> of {questions.length}
            </span>
          </div>

          {/* Question Text */}
          <div className="space-y-3">
            <h2 className="text-lg sm:text-2xl font-black text-white leading-relaxed">
              {currentQ.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentIndex] === optIdx;
              const isCorrect = optIdx === currentQ.correctAnswerIndex;
              const hasAnswered = isCurrentAnswered;

              let btnStyle = "bg-slate-900/80 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 text-slate-200";

              if (hasAnswered) {
                if (isCorrect) {
                  btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-500/10";
                } else if (isSelected) {
                  btnStyle = "bg-rose-500/20 border-rose-500 text-rose-200";
                } else {
                  btnStyle = "bg-slate-900/40 border-slate-800 text-slate-500 opacity-60";
                }
              }

              return (
                <button
                  key={optIdx}
                  disabled={hasAnswered}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full p-4 sm:p-5 rounded-2xl border-2 text-left text-sm sm:text-base font-semibold transition-all flex items-center justify-between gap-4 cursor-pointer ${btnStyle} ${
                    !hasAnswered ? "hover:scale-[1.005] active:scale-[0.995]" : ""
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs sm:text-sm font-black flex-shrink-0 ${
                      hasAnswered && isCorrect 
                        ? "bg-emerald-500 text-white shadow-sm"
                        : hasAnswered && isSelected 
                        ? "bg-rose-500 text-white shadow-sm"
                        : "bg-slate-800 border border-slate-700 text-slate-300"
                    }`}>
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="leading-snug">{opt}</span>
                  </div>

                  {hasAnswered && isCorrect && (
                    <CheckCircle2 size={22} className="text-emerald-400 flex-shrink-0" />
                  )}
                  {hasAnswered && isSelected && !isCorrect && (
                    <XCircle size={22} className="text-rose-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* 3-Step Hint Ladder */}
          {!isCurrentAnswered && (
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-black text-indigo-300 uppercase tracking-wider">
                  <HelpCircle size={15} />
                  <span>3-Step Hint Ladder (Step {hintLevel} of 3)</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setHintLevel(lvl)}
                      className={`w-6 h-6 rounded-lg text-xs font-black transition-all ${
                        hintLevel >= lvl
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {hintLevel === 0 && (
                <p className="text-xs text-slate-400">
                  Try solving with your own memory first. Need assistance? Tap <strong>Step 1</strong> for a conceptual nudge.
                </p>
              )}
              {hintLevel === 1 && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs sm:text-sm text-amber-200 animate-in fade-in">
                  <span className="font-bold text-amber-300">💡 Step 1 (Nudge): </span>
                  {currentQ.hint || "Carefully inspect the problem context and eliminate outliers."}
                </div>
              )}
              {hintLevel === 2 && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-xs sm:text-sm text-blue-200 animate-in fade-in">
                  <span className="font-bold text-blue-300">🔍 Step 2 (Visual Scaffold): </span>
                  Look at the units and question requirements. You can safely rule out answers that do not match the expected scale.
                </div>
              )}
              {hintLevel === 3 && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs sm:text-sm text-emerald-200 animate-in fade-in">
                  <span className="font-bold text-emerald-300">📘 Step 3 (Worked Model): </span>
                  {currentQ.explanation}
                </div>
              )}
            </div>
          )}

          {/* Pedagogical Explanation after answer */}
          {isCurrentAnswered && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-2.5 animate-in fade-in shadow-inner">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-400">
                <Brain size={16} />
                <span>Pedagogical Breakdown</span>
              </div>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Next / Finish Navigation */}
          {isCurrentAnswered && (
            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
              <div className="text-xs sm:text-sm text-slate-400 font-semibold">
                Score: <span className="font-black text-white text-base">{totalScore}</span> / {currentIndex + 1}
              </div>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => {
                    setCurrentIndex((prev) => prev + 1);
                    setHintLevel(0);
                    questionStartedAt.current = Date.now();
                  }}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
                >
                  <span>Next Question</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  onClick={() => setIsCompleted(true)}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer active:scale-95"
                >
                  <span>View Results</span>
                  <Award size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Completion Screen */}
      {isCompleted && (
        <div className="p-6 sm:p-10 rounded-3xl bg-[#0f172a] border border-slate-800 space-y-6 sm:space-y-8 text-center max-w-xl mx-auto shadow-2xl animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/30 flex items-center justify-center mx-auto shadow-xl">
            <Award size={40} />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Practice Complete!</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-semibold">
              Subject: {subject} • Topic: {topic}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-inner">
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-400">Final Score</span>
            <p className="text-5xl font-black text-emerald-400">
              {totalScore} / {questions.length}
            </p>
            <p className="text-xs sm:text-sm text-slate-300 font-bold">
              Accuracy: {Math.round((totalScore / questions.length) * 100)}%
            </p>
          </div>

          <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-left">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-200"><Brain size={15}/> Adaptive next step</div>
            <p className="mt-2 text-sm font-bold text-white">Next round suggestion: {brainAdaptiveLevel}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">Your next round uses the current skill record, including correct answers, retries and the hint level you chose. A hint is a learning tool—not a penalty.</p>
          </div>

          <div className="space-y-3 pt-2">
            {/* Review with AI Tutor button */}
            <button
              onClick={() => {
                const prompt = `I just completed a practice quiz on "${topic}" (${subject}) and scored ${totalScore}/${questions.length}. Could you review the key principles with me, address common misconceptions, and walk me through step-by-step reasoning?`;
                onAskTutor(prompt);
                onNavigate("tutor");
              }}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-98"
            >
              <Bot size={18} />
              <span>Review Concepts with AI Tutor</span>
            </button>

            <button
              onClick={() => {
                setQuestions([]);
                setIsCompleted(false);
                setSelectedAnswers({});
                setCurrentIndex(0);
                setHintLevel(0);
              }}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw size={16} />
              <span>Practice Another Topic</span>
            </button>
          </div>
        </div>
      )}

      {/* Review Bag Modal */}
      <MistakeReviewVaultModal
        isOpen={isMistakeVaultOpen}
        onClose={() => setIsMistakeVaultOpen(false)}
      />

      {/* Offline Worksheet Modal */}
      <PrintableWorksheetGenerator
        isOpen={isWorksheetModalOpen}
        onClose={() => setIsWorksheetModalOpen(false)}
      />
    </div>
  );
}
