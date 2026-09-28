import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain,
  Sparkles,
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  ArrowRight,
  X,
  Award,
  Clock,
  Trash2,
} from "lucide-react";
import {
  MistakeVaultItem,
  getMistakeVault,
  resolveMistakeWithRedemption,
  clearMistake,
} from "../utils/pedagogicalEngine";
import { soundEffects } from "../utils/soundEffects";
import { awardXP, triggerCelebrationConfetti } from "../utils/gamification";

interface MistakeReviewVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MistakeReviewVaultModal({
  isOpen,
  onClose,
}: MistakeReviewVaultModalProps) {
  const [items, setItems] = useState<MistakeVaultItem[]>([]);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [hintLevel, setHintLevel] = useState<number>(0); // 0 = none, 1 = nudge, 2 = scaffold, 3 = worked
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [conqueredToast, setConqueredToast] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const current = getMistakeVault();
      setItems(current);
      setActiveIdx(0);
      setHintLevel(0);
      setSelectedAnswer(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentItem = items[activeIdx];
  const totalDue = items.filter((i) => !i.masteredOnReview).length;

  const handleSelectOption = (optIdx: number) => {
    if (!currentItem || selectedAnswer !== null) return;
    setSelectedAnswer(optIdx);

    if (optIdx === currentItem.correctAnswerIndex) {
      soundEffects.playFanfare();
      triggerCelebrationConfetti();
      awardXP(50);
      resolveMistakeWithRedemption(currentItem.id);
      setConqueredToast("Mistake Conquered! +1 Redemption Crown (+50 XP) 👑");

      // Update state
      const updated = getMistakeVault();
      setItems(updated);
    } else {
      soundEffects.playGentleBoing();
      // Increase hint level automatically to scaffold
      setHintLevel((prev) => Math.min(3, prev + 1));
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setHintLevel(0);
    setConqueredToast(null);
    if (activeIdx < items.length - 1) {
      setActiveIdx((prev) => prev + 1);
    } else {
      setActiveIdx(0);
    }
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    clearMistake(id);
    const updated = getMistakeVault();
    setItems(updated);
    if (activeIdx >= updated.length) {
      setActiveIdx(Math.max(0, updated.length - 1));
    }
    setSelectedAnswer(null);
    setHintLevel(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#0f172a] border border-slate-700/80 rounded-3xl p-5 sm:p-8 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Brain size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white">Smart Mistake Review Vault</h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-black">
                  {totalDue} Due
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Spaced repetition turns past slip-ups into long-term mastery crowns
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-5">
          {items.length === 0 ? (
            <div className="p-8 text-center space-y-4 my-auto">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <Trophy size={32} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Your Review Bag is Pristine!</h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
                  You have conquered all your past practice errors! Keep completing practice quizzes and skill tree nodes to keep sharpening your mind.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                Back to Desk
              </button>
            </div>
          ) : currentItem ? (
            <div className="space-y-4">
              {/* Question Metadata & Navigation */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 font-bold">
                    {currentItem.topic}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400 font-medium">
                    <Clock size={13} /> Missed {currentItem.timesMissed}x
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-300">
                    {activeIdx + 1} of {items.length}
                  </span>
                  <button
                    onClick={(e) => handleDeleteItem(currentItem.id, e)}
                    title="Remove from review bag"
                    className="p-1 hover:text-rose-400 text-slate-500 rounded transition-colors cursor-pointer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Toast */}
              {conqueredToast && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs sm:text-sm font-black flex items-center gap-2 animate-in fade-in">
                  <Award size={18} />
                  <span>{conqueredToast}</span>
                </div>
              )}

              {/* Question Card */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <p className="text-xs font-black uppercase text-amber-400 tracking-wider">
                  Target Challenge
                </p>
                <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
                  {currentItem.question}
                </p>
              </div>

              {/* 3-Step Hint Ladder Controls */}
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/90 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-black text-indigo-300 uppercase tracking-wider">
                    <HelpCircle size={15} />
                    <span>Adaptive Hint Ladder (Step {hintLevel} of 3)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map((lvl) => (
                      <button
                        key={lvl}
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

                {/* Hint Level Displays */}
                {hintLevel === 0 && (
                  <p className="text-xs text-slate-400">
                    Try recalling the solution first! If stuck, tap <strong>Step 1</strong> for a gentle conceptual nudge.
                  </p>
                )}
                {hintLevel === 1 && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs sm:text-sm text-amber-200 animate-in fade-in">
                    <span className="font-bold text-amber-300">💡 Step 1 (Nudge): </span>
                    {currentItem.hintLevel1 || "Focus on the fundamental rules and read the keywords carefully."}
                  </div>
                )}
                {hintLevel === 2 && (
                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-xs sm:text-sm text-blue-200 animate-in fade-in space-y-1">
                    <span className="font-bold text-blue-300">🔍 Step 2 (Visual Scaffold): </span>
                    <p>{currentItem.hintLevel2 || "Cross out distractors that cannot logically work."}</p>
                    <p className="text-xs text-blue-300/80 italic font-medium">Distractor options have been dimmed below.</p>
                  </div>
                )}
                {hintLevel === 3 && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs sm:text-sm text-emerald-200 animate-in fade-in">
                    <span className="font-bold text-emerald-300">📘 Step 3 (Worked Model): </span>
                    {currentItem.hintLevel3 || currentItem.explanation}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentItem.options.map((opt, oIdx) => {
                  const isSelected = selectedAnswer === oIdx;
                  const isCorrect = oIdx === currentItem.correctAnswerIndex;
                  const isDimmed = hintLevel >= 2 && !isCorrect && oIdx !== currentItem.selectedAnswerIndex;

                  let style = "bg-slate-900 border-slate-700/80 text-white hover:border-slate-500";
                  if (selectedAnswer !== null) {
                    if (isCorrect) {
                      style = "bg-emerald-500/20 border-emerald-500 text-emerald-200";
                    } else if (isSelected) {
                      style = "bg-rose-500/20 border-rose-500 text-rose-200";
                    } else {
                      style = "bg-slate-900/40 border-slate-800 text-slate-600";
                    }
                  } else if (isDimmed) {
                    style = "bg-slate-950/40 border-slate-900 text-slate-600 opacity-40 line-through";
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={selectedAnswer !== null}
                      onClick={() => handleSelectOption(oIdx)}
                      className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-bold flex items-center justify-between gap-3 transition-all cursor-pointer ${style}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center text-xs font-black">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {selectedAnswer !== null && isCorrect && (
                        <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                      )}
                      {selectedAnswer !== null && isSelected && !isCorrect && (
                        <XCircle size={18} className="text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation after answer */}
              {selectedAnswer !== null && (
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 text-xs sm:text-sm text-slate-200 space-y-1 animate-in fade-in">
                  <span className="font-bold text-emerald-400 block uppercase tracking-wider text-xs">
                    Pedagogical Explanation
                  </span>
                  <p>{currentItem.explanation}</p>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer Navigation */}
        {items.length > 0 && currentItem && (
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
            <button
              onClick={() => {
                if (activeIdx > 0) {
                  setActiveIdx((p) => p - 1);
                  setSelectedAnswer(null);
                  setHintLevel(0);
                  setConqueredToast(null);
                }
              }}
              disabled={activeIdx === 0}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
            >
              <span>{activeIdx < items.length - 1 ? "Next Review" : "Restart Queue"}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
