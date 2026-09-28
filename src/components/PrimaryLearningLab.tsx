import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Zap,
  Flame,
  Timer,
  Trophy,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Volume2,
  Layers,
  Brain,
  Scale,
  ArrowRight,
  Star,
  Award,
} from "lucide-react";
import { soundEffects } from "../utils/soundEffects";
import { speakText } from "../utils/speechUtils";
import { awardXP, awardStars, awardGems, triggerCelebrationConfetti } from "../utils/gamification";
import { recordLearningEvent } from "../utils/learnerBrain";
import { PrimarySolarSystemLab } from "./PrimarySolarSystemLab";
import { FloatingCloudDecoration } from "./landscape/LandscapeDecorations";

type PrimaryActivity = "math-blitz" | "fraction-lab" | "word-forge" | "balance-scale" | "solar-system";

export interface PrimaryLearningLabProps {
  onBack?: () => void;
  onAskTutor?: (prompt: string) => void;
}

export function PrimaryLearningLab({ onBack, onAskTutor }: PrimaryLearningLabProps) {
  const [activeActivity, setActiveActivity] = useState<PrimaryActivity>("math-blitz");

  // Welcome speech for each activity on start
  useEffect(() => {
    const speechPrompts: Record<PrimaryActivity, string> = {
      "math-blitz": "Welcome to Speed Math Sprint! Solve rapid arithmetic problems before the timer expires!",
      "fraction-lab": "Welcome to the Fraction Lab! Slice and match visual pizza pies to master fractions!",
      "word-forge": "Welcome to Word Forge! Unscramble the letters to forge essential STEM and science words!",
      "balance-scale": "Welcome to the Logic Balance Scale! Place weights on the scale to find balance and solve equations!",
      "solar-system": "Welcome to Cosmic Astronomy! Tap any planet to explore its orbit, atmosphere, and space secrets!",
    };

    const text = speechPrompts[activeActivity];
    if (text) {
      const timer = setTimeout(() => {
        speakText(text, { pitch: 1.04, rate: 0.94 });
      }, 240);
      return () => clearTimeout(timer);
    }
  }, [activeActivity]);

  return (
    <div className="min-h-full pb-20 bg-gradient-to-b from-[#38bdf8] via-[#818cf8] to-[#312e81] text-slate-900 p-4 sm:p-6 relative overflow-hidden">
      {/* Floating game clouds */}
      <FloatingCloudDecoration className="absolute top-4 left-6" size="md" />
      <FloatingCloudDecoration className="absolute top-12 right-12" size="lg" />

      {/* Top Banner (Chunky Cloud Card) */}
      <div className="max-w-6xl mx-auto mb-6 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-[2.25rem] bg-white/95 backdrop-blur-md border-4 border-indigo-200 shadow-2xl">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-amber-400 to-orange-500 border-b-4 border-orange-700 flex items-center justify-center text-3xl shadow-lg shadow-orange-500/30">
              ⚡
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-100 text-indigo-900 text-[11px] font-black uppercase tracking-wider mb-1 border border-indigo-200">
                <Sparkles size={12} className="text-indigo-600" /> Primary STEM &amp; Concept Laboratory (Ages 6–11)
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-display">Interactive Learning Arcade</h1>
              <p className="text-slate-600 text-xs sm:text-sm font-semibold">
                Tactile mental math sprints, visual fraction slicers, word builders, and physics balance scales.
              </p>
            </div>
          </div>

          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-black text-xs transition-all cursor-pointer border-b-4 border-slate-300 shadow-md active:translate-y-1 flex-shrink-0"
            >
              ← Back to Desk
            </button>
          )}
        </div>

        {/* Activity Selector Tabs (Tactile 3D Buttons) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-4 p-2 rounded-3xl bg-white/90 backdrop-blur-md border-3 border-indigo-200 shadow-xl">
          <button
            onClick={() => {
              setActiveActivity("math-blitz");
              soundEffects.playPop();
            }}
            className={`p-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 border-b-4 transition-all cursor-pointer shadow-md select-none ${
              activeActivity === "math-blitz"
                ? "bg-gradient-to-b from-amber-400 to-orange-500 border-orange-700 text-white shadow-orange-500/30 active:translate-y-1"
                : "bg-white hover:bg-amber-50 border-slate-200 text-slate-700 hover:text-slate-900"
            }`}
          >
            <Zap size={16} className={activeActivity === "math-blitz" ? "text-yellow-200" : "text-amber-500"} />
            <span>Speed Math</span>
          </button>

          <button
            onClick={() => {
              setActiveActivity("fraction-lab");
              soundEffects.playPop();
            }}
            className={`p-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 border-b-4 transition-all cursor-pointer shadow-md select-none ${
              activeActivity === "fraction-lab"
                ? "bg-gradient-to-b from-emerald-400 to-teal-500 border-teal-700 text-white shadow-emerald-500/30 active:translate-y-1"
                : "bg-white hover:bg-emerald-50 border-slate-200 text-slate-700 hover:text-slate-900"
            }`}
          >
            <span>🍕</span>
            <span>Fraction Lab</span>
          </button>

          <button
            onClick={() => {
              setActiveActivity("word-forge");
              soundEffects.playPop();
            }}
            className={`p-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 border-b-4 transition-all cursor-pointer shadow-md select-none ${
              activeActivity === "word-forge"
                ? "bg-gradient-to-b from-purple-400 to-indigo-500 border-indigo-700 text-white shadow-purple-500/30 active:translate-y-1"
                : "bg-white hover:bg-purple-50 border-slate-200 text-slate-700 hover:text-slate-900"
            }`}
          >
            <span>🔤</span>
            <span>Word Forge</span>
          </button>

          <button
            onClick={() => {
              setActiveActivity("balance-scale");
              soundEffects.playPop();
            }}
            className={`p-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 border-b-4 transition-all cursor-pointer shadow-md select-none ${
              activeActivity === "balance-scale"
                ? "bg-gradient-to-b from-cyan-400 to-blue-500 border-blue-700 text-white shadow-cyan-500/30 active:translate-y-1"
                : "bg-white hover:bg-cyan-50 border-slate-200 text-slate-700 hover:text-slate-900"
            }`}
          >
            <Scale size={16} className={activeActivity === "balance-scale" ? "text-cyan-200" : "text-cyan-600"} />
            <span>Balance Scale</span>
          </button>

          <button
            onClick={() => {
              setActiveActivity("solar-system");
              soundEffects.playPop();
            }}
            className={`p-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 border-b-4 transition-all cursor-pointer shadow-md select-none ${
              activeActivity === "solar-system"
                ? "bg-gradient-to-b from-indigo-500 to-purple-600 border-purple-800 text-white shadow-indigo-500/30 active:translate-y-1"
                : "bg-white hover:bg-indigo-50 border-slate-200 text-slate-700 hover:text-slate-900"
            }`}
          >
            <span>🪐</span>
            <span>Solar System</span>
          </button>
        </div>
      </div>

      {/* Main Content Areas */}
      <div className="max-w-6xl mx-auto relative z-10">
        {activeActivity === "math-blitz" && <SpeedMathBlitzGame />}
        {activeActivity === "fraction-lab" && <TactileFractionLab />}
        {activeActivity === "word-forge" && <WordForgeGame />}
        {activeActivity === "balance-scale" && <PhysicsBalanceScaleGame />}
        {activeActivity === "solar-system" && <PrimarySolarSystemLab />}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 1. SPEED MATH BLITZ SPRINT (60-sec rapid fire arithmetic)
// -------------------------------------------------------------
function SpeedMathBlitzGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [problem, setProblem] = useState<{ text: string; answer: number; choices: number[] }>({ text: "", answer: 0, choices: [] });
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const generateProblem = () => {
    const ops = ["+", "-", "×"];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a = 0, b = 0, ans = 0;

    if (op === "+") {
      a = Math.floor(Math.random() * 25) + 5;
      b = Math.floor(Math.random() * 25) + 5;
      ans = a + b;
    } else if (op === "-") {
      a = Math.floor(Math.random() * 30) + 10;
      b = Math.floor(Math.random() * a) + 2;
      ans = a - b;
    } else {
      a = Math.floor(Math.random() * 9) + 2;
      b = Math.floor(Math.random() * 9) + 2;
      ans = a * b;
    }

    const set = new Set<number>();
    set.add(ans);
    while (set.size < 4) {
      const delta = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 6) + 1);
      const cand = ans + delta;
      if (cand >= 0 && cand !== ans) set.add(cand);
    }

    setProblem({
      text: `${a} ${op} ${b}`,
      answer: ans,
      choices: Array.from(set).sort(() => Math.random() - 0.5),
    });
  };

  const startGame = () => {
    setIsPlaying(true);
    setTimeLeft(45);
    setScore(0);
    setStreak(0);
    setIsGameOver(false);
    generateProblem();
    soundEffects.playPop();
  };

  useEffect(() => {
    if (!isPlaying || isGameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsGameOver(true);
          setIsPlaying(false);
          soundEffects.playFanfare();
          triggerCelebrationConfetti();
          awardXP(100);
          awardGems(15);
          recordLearningEvent({
            learnerId: "scholar-primary-1",
            activityId: "speed-math-blitz-sprint",
            activityType: "math-blitz",
            activityTitle: "Speed Math Blitz Sprint",
            skillId: "math-k1-addition-subtraction",
            domain: "math",
            gradeBand: "2-3",
            result: score >= 100 ? "mastered" : score >= 40 ? "success" : "practice",
            score: Math.min(100, Math.round((score / 120) * 100)),
            difficulty: "medium",
            attempts: 1,
            hintsUsed: 0,
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, isGameOver]);

  const handleChoice = (val: number) => {
    if (val === problem.answer) {
      soundEffects.playSuccessChime();
      setScore((s) => s + 10 * (streak >= 3 ? 2 : 1));
      setStreak((st) => st + 1);
      setFeedback("correct");
      awardXP(5);
      setTimeout(() => {
        setFeedback(null);
        generateProblem();
      }, 300);
    } else {
      soundEffects.playGentleBoing();
      setStreak(0);
      setFeedback("wrong");
      setTimeout(() => {
        setFeedback(null);
      }, 400);
    }
  };

  return (
    <div className="bg-white text-slate-900 border-4 border-amber-200 rounded-[2.5rem] p-6 sm:p-8 max-w-xl mx-auto shadow-2xl text-center">
      {/* HUD Bar */}
      <div className="flex items-center justify-between p-4 bg-amber-50/80 rounded-2xl border-2 border-amber-200 mb-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Timer className="text-amber-500" size={22} />
          <span className="text-lg font-black text-slate-900">{timeLeft}s</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-100 border border-orange-300 rounded-xl text-orange-900 text-xs font-black">
          <Flame size={16} className="fill-orange-500 text-orange-500 animate-pulse" />
          <span>{streak}x Combo</span>
        </div>

        <div className="flex items-center gap-2">
          <Trophy className="text-amber-500" size={20} />
          <span className="text-base font-black text-slate-900">{score} Pts</span>
        </div>
      </div>

      {!isPlaying && !isGameOver && (
        <div className="py-10 space-y-4">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-b from-amber-400 to-orange-500 flex items-center justify-center text-4xl shadow-xl shadow-orange-500/30 border-b-4 border-orange-700 animate-bounce">
            ⚡
          </div>
          <h3 className="text-2xl font-black text-slate-900 font-display">Speed Math Blitz</h3>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold max-w-sm mx-auto">
            Solve as many arithmetic equations as you can before the 45-second timer runs out. Build combo streaks for 2X multipliers!
          </p>
          <button
            onClick={startGame}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-b from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-white font-black text-base border-b-4 border-orange-700 active:translate-y-1 shadow-xl transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Zap size={20} /> Start Blitz Challenge
          </button>
        </div>
      )}

      {isPlaying && (
        <div className="space-y-6">
          {/* Equation Hero */}
          <motion.div
            key={problem.text}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`py-8 px-6 rounded-3xl border-4 transition-all shadow-inner ${
              feedback === "correct"
                ? "bg-emerald-100 border-emerald-400"
                : feedback === "wrong"
                ? "bg-rose-100 border-rose-400"
                : "bg-indigo-50 border-indigo-200"
            }`}
          >
            <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-wider font-display">
              {problem.text} = ?
            </div>
          </motion.div>

          {/* 4 Choices Grid (Tactile 3D Buttons) */}
          <div className="grid grid-cols-2 gap-3.5">
            {problem.choices.map((val) => (
              <motion.button
                key={val}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleChoice(val)}
                className="py-4 px-6 rounded-2xl bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-900 font-black text-2xl border-2 border-slate-200 hover:border-amber-400 border-b-6 border-b-slate-300 hover:border-b-amber-500 active:translate-y-1 transition-all cursor-pointer shadow-md select-none"
              >
                {val}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {isGameOver && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="py-8 space-y-4"
        >
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-b from-amber-400 to-yellow-400 flex items-center justify-center text-5xl shadow-xl shadow-yellow-500/30 border-4 border-white animate-bounce">
            🏆
          </div>
          <h3 className="text-3xl font-black text-slate-900 font-display">Sprint Complete!</h3>
          <p className="text-base text-amber-900 font-bold">
            Final Score: <strong className="text-slate-900">{score} Points</strong>!
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 border-2 border-amber-300 text-amber-900 text-sm font-black shadow-sm">
            <span>+100 XP Earned</span> • <span>+15 Gems 💎</span>
          </div>
          <div>
            <button
              onClick={startGame}
              className="px-6 py-3 rounded-2xl bg-gradient-to-b from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-white font-black text-sm border-b-4 border-orange-700 active:translate-y-1 shadow-xl transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <RotateCcw size={16} /> Play Again
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 2. TACTILE FRACTION & PIZZA LAB (Brilliant.org style)
// -------------------------------------------------------------
function TactileFractionLab() {
  const [slices, setSlices] = useState<number>(4);
  const [selectedSlices, setSelectedSlices] = useState<number>(2);
  const [isChallengeMode, setIsChallengeMode] = useState<boolean>(false);
  const [challengeIdx, setChallengeIdx] = useState<number>(0);
  const [hasCelebrated, setHasCelebrated] = useState<boolean>(false);

  const FRACTION_CHALLENGES = [
    { targetNum: 1, targetDen: 2, label: "One Half (1/2)" },
    { targetNum: 3, targetDen: 4, label: "Three Fourths (3/4)" },
    { targetNum: 2, targetDen: 3, label: "Two Thirds (2/3)" },
    { targetNum: 5, targetDen: 8, label: "Five Eighths (5/8)" },
    { targetNum: 4, targetDen: 6, label: "Four Sixths (4/6)" },
    { targetNum: 7, targetDen: 10, label: "Seven Tenths (7/10)" },
    { targetNum: 3, targetDen: 6, label: "Three Sixths (3/6)" },
    { targetNum: 5, targetDen: 6, label: "Five Sixths (5/6)" },
  ];

  const currentChallenge = FRACTION_CHALLENGES[challengeIdx % FRACTION_CHALLENGES.length];
  const fractionValue = (selectedSlices / slices).toFixed(2);
  const pct = Math.round((selectedSlices / slices) * 100);

  const isTargetMatched =
    isChallengeMode &&
    Math.abs(selectedSlices / slices - currentChallenge.targetNum / currentChallenge.targetDen) < 0.001;

  useEffect(() => {
    if (isTargetMatched && !hasCelebrated) {
      setHasCelebrated(true);
      soundEffects.playSuccessChime();
      triggerCelebrationConfetti();
      awardXP(35);
      awardStars(1);
      speakText(`Hooray! You built ${currentChallenge.label}! Excellent fraction mastery!`, { pitch: 1.1 });
      recordLearningEvent({
        learnerId: "scholar-primary-1",
        activityId: `fraction-challenge-${currentChallenge.targetNum}-${currentChallenge.targetDen}`,
        activityType: "fraction-lab",
        activityTitle: `Fraction Match: ${currentChallenge.label}`,
        skillId: "math-23-fractions",
        domain: "math",
        gradeBand: "2-3",
        result: "success",
        score: 100,
        difficulty: "medium",
        attempts: 1,
        hintsUsed: 0,
      });
    }
  }, [isTargetMatched, hasCelebrated, currentChallenge]);

  const handleNextChallenge = () => {
    soundEffects.playPop();
    setChallengeIdx((prev) => prev + 1);
    setHasCelebrated(false);
    const nextQ = FRACTION_CHALLENGES[(challengeIdx + 1) % FRACTION_CHALLENGES.length];
    speakText(`New Challenge! Can you build ${nextQ.label}? Adjust the slices!`, { pitch: 1.1 });
  };

  const handleToggleSlice = (idx: number) => {
    soundEffects.playPop();
    if (idx < selectedSlices) {
      setSelectedSlices(idx);
    } else {
      setSelectedSlices(idx + 1);
    }
  };

  return (
    <div className="bg-white text-slate-900 border-4 border-emerald-200 rounded-[2.5rem] p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl p-3 bg-emerald-100 rounded-2xl border-2 border-emerald-200 shadow-sm">🍕</span>
          <div>
            <h3 className="text-xl font-black text-slate-900 font-display">Visual Fraction Explorer</h3>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold">Interact with slices to visualize equivalent fractions &amp; percentages</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const nextMode = !isChallengeMode;
              setIsChallengeMode(nextMode);
              setHasCelebrated(false);
              soundEffects.playPop();
              if (nextMode) {
                speakText(`Challenge mode active! Can you build ${currentChallenge.label}?`, { pitch: 1.1 });
              }
            }}
            className={`px-3 py-1.5 rounded-2xl text-xs font-black border-2 transition-all cursor-pointer ${
              isChallengeMode
                ? "bg-amber-400 border-amber-600 text-amber-950 shadow-md"
                : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
            }`}
          >
            🎯 {isChallengeMode ? "Challenge Active" : "Start Challenges"}
          </button>
          <div className="px-3.5 py-1.5 bg-emerald-100 border-2 border-emerald-300 rounded-2xl text-emerald-900 text-xs font-black shadow-sm whitespace-nowrap">
            <span>{pct}% Filled</span>
          </div>
        </div>
      </div>

      {/* Target Mission Alert in Challenge Mode */}
      {isChallengeMode && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-black text-amber-800 tracking-wider">Fraction Mission #{challengeIdx + 1}</span>
            <div className="text-base font-black text-amber-950 flex items-center gap-1.5 justify-center sm:justify-start">
              <span>Goal: Build</span>
              <span className="px-2 py-0.5 rounded-lg bg-amber-200 text-amber-900">{currentChallenge.label}</span>
            </div>
          </div>

          {isTargetMatched ? (
            <button
              onClick={handleNextChallenge}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <span>Next Mission</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <div className="text-xs text-amber-800 font-bold">
              Adjust parts below to match!
            </div>
          )}
        </div>
      )}

      {/* Dynamic Slices Visualizer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center my-6">
        {/* Visual Bar Slices */}
        <div className="space-y-3">
          <div className="text-xs font-black text-slate-700 uppercase tracking-wider">Tap segments to fill or unfill:</div>
          <div className="flex h-16 w-full rounded-2xl overflow-hidden border-3 border-emerald-300 shadow-inner bg-emerald-50 p-1 gap-1.5">
            {Array.from({ length: slices }).map((_, i) => {
              const isFilled = i < selectedSlices;
              return (
                <button
                  key={i}
                  onClick={() => handleToggleSlice(i)}
                  className={`flex-1 rounded-xl transition-all cursor-pointer font-black text-xs sm:text-sm flex items-center justify-center select-none active:scale-95 ${
                    isFilled
                      ? "bg-gradient-to-b from-emerald-400 to-teal-500 text-white shadow-md border-b-3 border-teal-700"
                      : "bg-white hover:bg-emerald-100 text-slate-400 border border-slate-200"
                  }`}
                >
                  1/{slices}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between text-xs text-slate-500 font-bold px-1">
            <span>0</span>
            <span>Fraction Bar</span>
            <span>1 Whole</span>
          </div>
        </div>

        {/* Big Fraction Display Box */}
        <div className={`p-6 rounded-3xl border-3 flex flex-col items-center justify-center text-center shadow-inner transition-colors ${
          isTargetMatched
            ? "bg-gradient-to-b from-emerald-100 to-teal-100 border-emerald-400"
            : "bg-gradient-to-b from-emerald-50 to-teal-50 border-emerald-200"
        }`}>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-black text-emerald-700 font-display">{selectedSlices}</span>
              <div className="w-12 h-1.5 bg-slate-400 my-1 rounded-full" />
              <span className="text-4xl font-black text-slate-900 font-display">{slices}</span>
            </div>
            <span className="text-3xl font-black text-slate-400">=</span>
            <div className="text-3xl font-black text-emerald-800 font-display">{fractionValue}</div>
          </div>

          <p className="text-xs sm:text-sm text-emerald-900 mt-3 font-black">
            {isTargetMatched
              ? "🎯 TARGET MATCHED! Outstanding job!"
              : selectedSlices === slices
              ? "🎉 That equals 1 Whole!"
              : selectedSlices * 2 === slices
              ? "✨ That is exactly One Half (1/2)!"
              : `${selectedSlices} out of ${slices} parts are selected.`}
          </p>
        </div>
      </div>

      {/* Denominator Slider */}
      <div className="pt-4 border-t-2 border-slate-100 space-y-2.5">
        <div className="flex justify-between text-xs font-black text-slate-700">
          <span>Divide into how many slices? (Denominator)</span>
          <span className="text-emerald-700 font-black">{slices} parts</span>
        </div>
        <div className="flex items-center gap-2">
          {[2, 3, 4, 6, 8, 10, 12].map((num) => (
            <button
              key={num}
              onClick={() => {
                setSlices(num);
                setSelectedSlices(Math.min(selectedSlices, num));
                soundEffects.playPop();
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border-b-3 ${
                slices === num
                  ? "bg-gradient-to-b from-emerald-400 to-teal-500 text-white border-teal-700 shadow-md scale-105"
                  : "bg-slate-100 text-slate-700 hover:text-slate-900 border-slate-300 hover:bg-slate-200"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 3. WORD FORGE & SPELLING BUILDER
// -------------------------------------------------------------
function WordForgeGame() {
  const WORDS = [
    { word: "PLANET", hint: "A large celestial body like Earth or Jupiter orbiting the Sun", emoji: "🪐" },
    { word: "ENERGY", hint: "The power to do work or cause physical changes", emoji: "⚡" },
    { word: "GALAXY", hint: "A massive system of billions of stars, gas, and dust", emoji: "🌌" },
    { word: "OXYGEN", hint: "The invisible life-supporting gas that we breathe", emoji: "🌬️" },
    { word: "GRAVITY", hint: "The invisible pulling force that keeps our feet on the ground", emoji: "🍎" },
    { word: "MAGNET", hint: "An object that produces a magnetic field attracting metals", emoji: "🧲" },
    { word: "FOSSIL", hint: "The preserved remains or traces of ancient prehistoric life", emoji: "🦕" },
    { word: "COMET", hint: "An icy cosmic wanderer that releases gas forming a glowing tail", emoji: "☄️" },
    { word: "PRISM", hint: "A transparent optical glass that refracts white light into a rainbow", emoji: "🌈" },
    { word: "NUCLEUS", hint: "The dense central core of an atom containing protons and neutrons", emoji: "⚛️" },
    { word: "VOLCANO", hint: "An opening in Earth's crust that erupts lava, rock, and ash", emoji: "🌋" },
    { word: "CIRCUIT", hint: "A complete closed path through which electric current can flow", emoji: "💡" },
    { word: "CLIMATE", hint: "The long-term weather patterns prevailing in an area over decades", emoji: "🌡️" },
    { word: "HABITAT", hint: "The natural home or environment of an animal, plant, or organism", emoji: "🌿" },
    { word: "CRATER", hint: "A bowl-shaped depression on a moon or planet formed by impact", emoji: "🌑" },
    { word: "NEBULA", hint: "A vast interstellar cloud of dust and gas where new stars are born", emoji: "✨" },
    { word: "ROBOT", hint: "An automated mechanical machine programmed to perform tasks", emoji: "🤖" },
    { word: "SPECIES", hint: "A group of living organisms consisting of similar individuals", emoji: "🐾" },
    { word: "GLACIER", hint: "A slowly moving mass or river of ice formed by snow accumulation", emoji: "🧊" },
    { word: "VELOCITY", hint: "The speed of something moving in a given direction", emoji: "🚀" },
    { word: "AURORA", hint: "Natural shimmering light display in the sky near polar regions", emoji: "🎆" },
    { word: "CRYSTAL", hint: "A solid material whose atoms are arranged in a repeating pattern", emoji: "💎" },
    { word: "TELESCOPE", hint: "An optical instrument designed to observe distant stars and planets", emoji: "🔭" },
    { word: "ECOSYSTEM", hint: "A biological community of interacting organisms and environment", emoji: "🌲" },
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const current = WORDS[currentIdx];
  const [scrambled, setScrambled] = useState<string[]>([]);
  const [placed, setPlaced] = useState<string[]>([]);
  const [isWon, setIsWon] = useState(false);

  useEffect(() => {
    const letters = current.word.split("").sort(() => Math.random() - 0.5);
    setScrambled(letters);
    setPlaced([]);
    setIsWon(false);
  }, [currentIdx]);

  const handlePickLetter = (letter: string, index: number) => {
    soundEffects.playPop();
    const newScrambled = [...scrambled];
    newScrambled.splice(index, 1);
    setScrambled(newScrambled);

    const newPlaced = [...placed, letter];
    setPlaced(newPlaced);

    if (newPlaced.length === current.word.length) {
      if (newPlaced.join("") === current.word) {
        soundEffects.playSuccessChime();
        triggerCelebrationConfetti();
        setIsWon(true);
        awardXP(40);
        awardGems(5);
        speakText(`Correct! ${current.word}!`, { pitch: 1.1 });
        recordLearningEvent({
          learnerId: "scholar-primary-1",
          activityId: `word-forge-${current.word.toLowerCase()}`,
          activityType: "word-forge",
          activityTitle: `Word Forge: ${current.word}`,
          skillId: "read-23-sight-words",
          domain: "reading",
          gradeBand: "2-3",
          result: "success",
          score: 100,
          difficulty: "medium",
          attempts: 1,
          hintsUsed: 0,
        });
      } else {
        soundEffects.playGentleBoing();
        speakText("Not quite! Let's reset the letters and try again!", { pitch: 1.1 });
        setTimeout(() => {
          setScrambled(current.word.split("").sort(() => Math.random() - 0.5));
          setPlaced([]);
        }, 1000);
      }
    }
  };

  const handleNextWord = () => {
    soundEffects.playPop();
    if (currentIdx < WORDS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setCurrentIdx(0);
    }
  };

  return (
    <div className="bg-white text-slate-900 border-4 border-purple-200 rounded-[2.5rem] p-6 sm:p-8 max-w-xl mx-auto shadow-2xl text-center">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl p-2.5 bg-purple-100 rounded-2xl border border-purple-200 shadow-sm">🔤</span>
          <div className="text-left">
            <h3 className="text-base sm:text-lg font-black text-slate-900 font-display">Word Forge &amp; Spelling</h3>
            <p className="text-xs text-slate-600 font-semibold">Word {currentIdx + 1} of {WORDS.length} • Tap tiles to spell</p>
          </div>
        </div>

        <button
          onClick={() => speakText(current.hint)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-black border border-purple-300 shadow-sm cursor-pointer active:translate-y-0.5"
        >
          <Volume2 size={14} /> Spoken Hint
        </button>
      </div>

      {/* Clue Box */}
      <div className="p-5 rounded-3xl bg-purple-50 border-2 border-purple-200 mb-6 space-y-2">
        <span className="text-4xl filter drop-shadow">{current.emoji}</span>
        <p className="text-xs sm:text-sm text-purple-950 font-bold">{current.hint}</p>
      </div>

      {/* Slot targets */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        {Array.from({ length: current.word.length }).map((_, i) => (
          <div
            key={i}
            className={`w-10 h-13 sm:w-12 sm:h-15 rounded-2xl border-3 flex items-center justify-center font-black text-lg sm:text-xl transition-all ${
              placed[i]
                ? "bg-gradient-to-b from-purple-500 to-indigo-600 text-white border-purple-700 shadow-md"
                : "bg-slate-50 border-dashed border-slate-300 text-slate-300"
            }`}
          >
            {placed[i] || "_"}
          </div>
        ))}
      </div>

      {/* Available letter tiles */}
      {!isWon ? (
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {scrambled.map((letter, idx) => (
            <motion.button
              key={`${letter}-${idx}`}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handlePickLetter(letter, idx)}
              className="w-12 h-14 rounded-2xl bg-gradient-to-b from-purple-400 to-indigo-500 hover:from-purple-300 hover:to-indigo-400 text-white font-black text-xl border-b-4 border-indigo-700 shadow-lg cursor-pointer flex items-center justify-center select-none active:translate-y-1"
            >
              {letter}
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-emerald-700 font-black text-lg flex items-center justify-center gap-2">
            <CheckCircle2 size={22} className="text-emerald-500" /> Word Forged Successfully! (+40 XP)
          </div>
          <button
            onClick={handleNextWord}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-b from-purple-400 to-indigo-500 hover:from-purple-300 hover:to-indigo-400 text-white font-black text-sm border-b-4 border-indigo-700 shadow-lg cursor-pointer inline-flex items-center gap-2 active:translate-y-1"
          >
            <span>Next Word Challenge ({currentIdx + 2 <= WORDS.length ? currentIdx + 2 : 1}/{WORDS.length})</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 4. PHYSICS BALANCE SCALE (Algebra & Logic Thinking)
// -------------------------------------------------------------
function PhysicsBalanceScaleGame() {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [leftWeight, setLeftWeight] = useState(12);
  const [rightWeights, setRightWeights] = useState<number[]>([4]);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  const targetWeight = leftWeight;
  const currentRightWeight = rightWeights.reduce((acc, w) => acc + w, 0);
  const isBalanced = targetWeight === currentRightWeight;

  const handleAddWeight = (val: number) => {
    soundEffects.playPop();
    setRightWeights([...rightWeights, val]);
  };

  const handleReset = () => {
    soundEffects.playPop();
    setRightWeights([]);
  };

  const handleNextLevel = () => {
    soundEffects.playPop();
    const newTarget = Math.floor(Math.random() * 15) + 10; // 10 to 24
    const initialPiece = Math.floor(Math.random() * 5) + 1;
    setLeftWeight(newTarget);
    setRightWeights([initialPiece]);
    setLevel((prev) => prev + 1);
    setHasCelebrated(false);
  };

  useEffect(() => {
    if (isBalanced && !hasCelebrated) {
      setHasCelebrated(true);
      soundEffects.playSuccessChime();
      triggerCelebrationConfetti();
      awardXP(35);
      awardStars(1);
      setScore((s) => s + 1);
      speakText(`Balanced! Target ${targetWeight} kilograms achieved! Great algebraic logic!`, { pitch: 1.1 });
      recordLearningEvent({
        learnerId: "scholar-primary-1",
        activityId: `balance-scale-level-${level}`,
        activityType: "balance-scale",
        activityTitle: `Balance Scale: ${targetWeight} KG Algebraic Balance`,
        skillId: "math-45-equations",
        domain: "math",
        gradeBand: "4-5",
        result: "success",
        score: 100,
        difficulty: level >= 3 ? "hard" : "medium",
        attempts: 1,
        hintsUsed: 0,
      });
    }
  }, [isBalanced, hasCelebrated, targetWeight]);

  return (
    <div className="bg-white text-slate-900 border-4 border-cyan-200 rounded-[2.5rem] p-6 sm:p-8 max-w-xl mx-auto shadow-2xl text-center">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <Scale className="text-cyan-600" size={24} />
          <div className="text-left">
            <h3 className="text-base sm:text-lg font-black text-slate-900 font-display">Logic Balance Scale</h3>
            <p className="text-xs text-slate-600 font-semibold">Level {level} • Solved: {score} • Balance the left pan</p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 hover:text-slate-900 transition-all cursor-pointer border border-slate-300"
          title="Clear right pan"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Visual Balance Scale Graphic */}
      <div className="p-8 rounded-3xl bg-cyan-50/60 border-2 border-cyan-200 mb-6 relative">
        <div className="flex items-center justify-around mb-8">
          {/* Left Pan */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-b from-blue-500 to-indigo-600 border-b-4 border-indigo-800 flex flex-col items-center justify-center shadow-lg">
              <span className="text-3xl font-black text-white font-display">{leftWeight}</span>
              <span className="text-[10px] font-bold text-blue-100">KG Block</span>
            </div>
            <div className="w-20 h-2 bg-slate-300 rounded-full mt-2" />
          </div>

          {/* Center Fulcrum Indicator */}
          <div className="flex flex-col items-center">
            <div className={`text-xl font-black transition-colors ${isBalanced ? "text-emerald-600 animate-bounce" : "text-amber-600"}`}>
              {isBalanced ? "⚖️ BALANCED!" : currentRightWeight > targetWeight ? "⬇️ Too Heavy" : "⬆️ Too Light"}
            </div>
            <div className="w-1.5 h-12 bg-slate-400 my-1 rounded-full" />
            <div className="w-8 h-8 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-cyan-600" />
          </div>

          {/* Right Pan */}
          <div className="flex flex-col items-center">
            <div className={`w-24 h-24 rounded-3xl border-3 flex flex-col items-center justify-center shadow-lg transition-all ${
              isBalanced
                ? "bg-gradient-to-b from-emerald-400 to-teal-500 border-b-4 border-teal-700 text-white"
                : "bg-white border-slate-200 text-slate-800"
            }`}>
              <span className="text-3xl font-black font-display">{currentRightWeight}</span>
              <span className="text-[10px] font-bold text-slate-500">KG Current</span>
            </div>
            <div className="w-20 h-2 bg-slate-300 rounded-full mt-2" />
          </div>
        </div>

        {/* Target equality equation */}
        <div className="text-sm font-black text-slate-800">
          Target: <span className="text-cyan-700 font-black">{leftWeight} KG</span> = Current: <span className="text-slate-900 font-black">{currentRightWeight} KG</span>
        </div>
      </div>

      {/* Available Weight Blocks or Next Level */}
      {!isBalanced ? (
        <div className="space-y-3">
          <div className="text-xs font-black text-slate-700 uppercase tracking-wider">Tap weights below to add to the right pan:</div>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {[1, 2, 3, 5, 8].map((w) => (
              <motion.button
                key={w}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAddWeight(w)}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-b from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white font-black text-sm border-b-4 border-blue-700 shadow-md cursor-pointer flex items-center gap-1.5 active:translate-y-1"
              >
                <span>+{w} KG</span>
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3 pt-2">
          <div className="text-emerald-700 font-black text-base flex items-center justify-center gap-2">
            <CheckCircle2 size={20} className="text-emerald-500" /> Perfect Balance! (+35 XP)
          </div>
          <button
            onClick={handleNextLevel}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm border-b-4 border-teal-800 shadow-lg cursor-pointer inline-flex items-center gap-2 active:translate-y-1"
          >
            <span>Next Balance Puzzle (Level {level + 1})</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
