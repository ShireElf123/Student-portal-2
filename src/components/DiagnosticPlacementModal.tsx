import React, { useState } from "react";
import {
  Compass,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Trophy,
  Award,
  X,
  Target,
  Brain,
  RotateCcw,
} from "lucide-react";
import {
  DIAGNOSTIC_PLACEMENT_QUESTIONS,
  evaluateDiagnosticAnswers,
  DiagnosticResult,
} from "../utils/pedagogicalEngine";
import { soundEffects } from "../utils/soundEffects";
import { awardXP, triggerCelebrationConfetti } from "../utils/gamification";

interface DiagnosticPlacementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRecommendation?: (recommendedNodeId: string) => void;
}

export function DiagnosticPlacementModal({
  isOpen,
  onClose,
  onApplyRecommendation,
}: DiagnosticPlacementModalProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<DiagnosticResult | null>(null);

  if (!isOpen) return null;

  const currentQ = DIAGNOSTIC_PLACEMENT_QUESTIONS[currentIdx];
  const hasAnsweredCurrent = currentQ && answers[currentQ.id] !== undefined;

  const handleSelectOption = (optIdx: number) => {
    if (hasAnsweredCurrent) return;
    const nextAnswers = { ...answers, [currentQ.id]: optIdx };
    setAnswers(nextAnswers);

    if (optIdx === currentQ.correctAnswerIndex) {
      soundEffects.playPop();
    } else {
      soundEffects.playGentleBoing();
    }
  };

  const handleNext = () => {
    if (currentIdx < DIAGNOSTIC_PLACEMENT_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Evaluate!
      const evaluated = evaluateDiagnosticAnswers(answers);
      setResult(evaluated);
      soundEffects.playFanfare();
      triggerCelebrationConfetti();
      awardXP(75);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setAnswers({});
    setResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-xl bg-[#0f172a] border border-slate-700 rounded-3xl p-5 sm:p-8 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Compass size={22} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">Diagnostic Placement Quest</h2>
              <p className="text-xs text-slate-400 font-medium">
                A short skill snapshot to guide your next learning path
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto py-5">
          {!result && currentQ && (
            <div className="space-y-4">
              {/* Progress Tracker */}
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>
                  Question {currentIdx + 1} of {DIAGNOSTIC_PLACEMENT_QUESTIONS.length}
                </span>
                <span className="uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-bold text-[11px]">
                  {currentQ.discipline} • Grade {currentQ.targetGradeBand}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-300"
                  style={{
                    width: `${((currentIdx + 1) / DIAGNOSTIC_PLACEMENT_QUESTIONS.length) * 100}%`,
                  }}
                />
              </div>

              {/* Prompt */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
                  {currentQ.prompt}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = answers[currentQ.id] === oIdx;
                  const isCorrect = oIdx === currentQ.correctAnswerIndex;

                  let style = "bg-slate-900 border-slate-700/80 text-white hover:border-slate-500";
                  if (hasAnsweredCurrent) {
                    if (isCorrect) {
                      style = "bg-emerald-500/20 border-emerald-500 text-emerald-200";
                    } else if (isSelected) {
                      style = "bg-rose-500/20 border-rose-500 text-rose-200";
                    } else {
                      style = "bg-slate-900/40 border-slate-800 text-slate-600";
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={hasAnsweredCurrent}
                      onClick={() => handleSelectOption(oIdx)}
                      className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-bold flex items-center justify-between gap-3 transition-all cursor-pointer ${style}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center text-xs font-black">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {hasAnsweredCurrent && isCorrect && (
                        <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                      )}
                      {hasAnsweredCurrent && isSelected && !isCorrect && (
                        <XCircle size={18} className="text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {hasAnsweredCurrent && (
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 text-xs sm:text-sm text-slate-200 space-y-1 animate-in fade-in">
                  <span className="font-bold text-emerald-400 block uppercase tracking-wider text-xs">
                    Pedagogical Breakdown
                  </span>
                  <p>{currentQ.explanation}</p>
                </div>
              )}
            </div>
          )}

          {/* Result Screen */}
          {result && (
            <div className="space-y-5 text-center my-auto animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-3xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto">
                <Trophy size={34} />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white">Your learning snapshot is ready</h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Overall Accuracy: {result.score} of {result.total} ({Math.round((result.score / result.total) * 100)}%)
                </p>
              </div>

              {/* Grade Band Card */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-indigo-500/40 text-left space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-indigo-400 tracking-wider">
                    Recommended Starting Band
                  </span>
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-black text-xs">
                    Grade {result.recommendedGradeBand}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200">
                  A suggested place to begin: <strong>{result.recommendedDomainFocus}</strong>.
                </p>
                <p className="text-[11px] leading-relaxed text-slate-400">This brief screening is a starting point, not a formal grade-level assessment. Use the suggested band as a guide and adjust it based on how learning feels.</p>
                <div className="grid grid-cols-3 gap-2 pt-1 text-[10px]">
                  {Object.entries(result.gradeBandScores).map(([band, score]) => (
                    <div key={band} className="rounded-lg border border-slate-800 bg-slate-950/60 p-2 text-center">
                      <span className="block font-bold text-slate-400">Band {band}</span>
                      <span className="mt-1 block font-black text-white">{score.correct}/{score.total}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                  {Object.entries(result.disciplineScores).map(([disc, s]) => (
                    <div key={disc} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex justify-between">
                      <span className="capitalize text-slate-400 font-bold">{disc}</span>
                      <span className="font-black text-white">{s.correct} / {s.total}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => {
                    if (onApplyRecommendation) {
                      onApplyRecommendation(result.recommendedStartingNodeId);
                    }
                    onClose();
                  }}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-98"
                >
                  <Sparkles size={18} />
                  <span>Open Recommended Skill Path</span>
                </button>

                <button
                  onClick={handleReset}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw size={15} />
                  <span>Retake Placement Quest</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!result && (
          <div className="pt-4 border-t border-slate-800 flex justify-end shrink-0">
            {hasAnsweredCurrent && (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
              >
                <span>{currentIdx < DIAGNOSTIC_PLACEMENT_QUESTIONS.length - 1 ? "Next Question" : "See Diagnostic Report"}</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
