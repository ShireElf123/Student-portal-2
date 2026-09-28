import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, X, CheckCircle2, RefreshCw, ShieldAlert, Sparkles } from "lucide-react";
import { soundEffects } from "../utils/soundEffects";

interface ParentalGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

interface MathProblem {
  num1: number;
  num2: number;
  operation: "+" | "-" | "×";
  correctAnswer: number;
  choices: number[];
}

function generateMathProblem(): MathProblem {
  const ops: ("+" | "-" | "×")[] = ["+", "-", "×"];
  const operation = ops[Math.floor(Math.random() * ops.length)];
  let num1 = 0;
  let num2 = 0;
  let correctAnswer = 0;

  if (operation === "+") {
    num1 = Math.floor(Math.random() * 8) + 2;
    num2 = Math.floor(Math.random() * 8) + 2;
    correctAnswer = num1 + num2;
  } else if (operation === "-") {
    num1 = Math.floor(Math.random() * 8) + 6;
    num2 = Math.floor(Math.random() * 5) + 1;
    correctAnswer = num1 - num2;
  } else {
    // Multiplication (simple 2-5)
    num1 = Math.floor(Math.random() * 4) + 2;
    num2 = Math.floor(Math.random() * 4) + 2;
    correctAnswer = num1 * num2;
  }

  // Generate 2 distinct distractors
  const distractors = new Set<number>();
  while (distractors.size < 2) {
    const delta = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);
    const candidate = correctAnswer + delta;
    if (candidate > 0 && candidate !== correctAnswer) {
      distractors.add(candidate);
    }
  }

  const choices = [correctAnswer, ...Array.from(distractors)].sort(() => Math.random() - 0.5);

  return {
    num1,
    num2,
    operation,
    correctAnswer,
    choices,
  };
}

export function ParentalGateModal({
  isOpen,
  onClose,
  onSuccess,
  title = "Grown-Ups Only 🔒",
  description = "Please solve this quick problem to exit the Toddler Wonderland play zone:",
}: ParentalGateModalProps) {
  const [problem, setProblem] = useState<MathProblem>(generateMathProblem);
  const [wrongAnswerId, setWrongAnswerId] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setProblem(generateMathProblem());
      setWrongAnswerId(null);
      setIsSuccess(false);
    }
  }, [isOpen]);

  const handleSelectChoice = (choice: number) => {
    if (choice === problem.correctAnswer) {
      setIsSuccess(true);
      soundEffects.playSuccessChime();
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 500);
    } else {
      soundEffects.playGentleBoing();
      setWrongAnswerId(choice);
      setTimeout(() => {
        setWrongAnswerId(null);
        setProblem(generateMathProblem());
      }, 900);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-[#13141f] border-2 border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden z-10 text-white"
        >
          {/* Top Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="text-center space-y-3 mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 border-2 border-amber-400/40 flex items-center justify-center text-amber-300 shadow-lg">
              <Lock size={28} />
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">{title}</h3>
            <p className="text-xs sm:text-sm text-white/70 max-w-xs mx-auto">
              {description}
            </p>
          </div>

          {/* Math Challenge Box */}
          <div className="bg-white/[0.04] border border-white/15 rounded-2xl p-5 mb-6 text-center space-y-4">
            <div className="text-3xl sm:text-4xl font-black tracking-wider text-amber-300">
              {problem.num1} {problem.operation} {problem.num2} = ?
            </div>

            {/* Answer Choices */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {problem.choices.map((choice, idx) => {
                const isWrong = wrongAnswerId === choice;
                const isChosenCorrect = isSuccess && choice === problem.correctAnswer;

                return (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={
                      isWrong
                        ? { x: [-8, 8, -6, 6, 0] }
                        : isChosenCorrect
                        ? { scale: [1, 1.1, 1] }
                        : {}
                    }
                    transition={{ duration: 0.3 }}
                    onClick={() => handleSelectChoice(choice)}
                    disabled={isSuccess}
                    className={`py-3.5 px-2 rounded-2xl font-black text-xl border-2 transition-all cursor-pointer shadow-md ${
                      isChosenCorrect
                        ? "bg-emerald-500 text-white border-emerald-400 ring-4 ring-emerald-400/40"
                        : isWrong
                        ? "bg-rose-500/30 text-white border-rose-400 ring-4 ring-rose-400/30"
                        : "bg-white/10 hover:bg-amber-500/20 border-white/20 hover:border-amber-400/50 text-white"
                    }`}
                  >
                    {choice}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Footer note */}
          <div className="flex items-center justify-between text-xs text-white/50 pt-2 border-t border-white/10">
            <span className="flex items-center gap-1.5 text-white/60">
              <ShieldAlert size={14} className="text-amber-400" />
              <span>Protects toddlers from accidental exits</span>
            </span>

            <button
              onClick={() => setProblem(generateMathProblem())}
              className="flex items-center gap-1 text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
            >
              <RefreshCw size={12} />
              <span>New problem</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
