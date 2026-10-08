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
  Shapes,
  Code,
  Play,
  Square,
  RotateCw,
  Grid,
  Bot,
} from "lucide-react";
import { soundEffects } from "../utils/soundEffects";
import { speakText } from "../utils/speechUtils";
import { awardXP, awardStars, awardGems, triggerCelebrationConfetti } from "../utils/gamification";
import { recordLearningEvent, getActiveLearnerId } from "../utils/learnerBrain";
import { PrimarySolarSystemLab } from "./PrimarySolarSystemLab";
import { FloatingCloudDecoration } from "./landscape/LandscapeDecorations";
import { GeneratedContentPanel } from "./GeneratedContentPanel";
import { markGameBlueprintCompleted } from "../services/gameContentService";
import { adaptSpeedMathRound, adaptTimesMatrixRound, recordBlueprintSessionCompletion, recordSpeedMathBlueprintResponse, recordTimesMatrixBlueprintResponse } from "../contentEngine/gameAdapters";
import type { GameBlueprint, SpeedMathBlueprint, TimesMatrixBlueprint } from "../contentEngine/types";

type PrimaryActivity =
  | "math-blitz"
  | "fraction-lab"
  | "word-forge"
  | "balance-scale"
  | "solar-system"
  | "geometry-builder"
  | "code-runner"
  | "times-matrix";

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export interface PrimaryLearningLabProps {
  onBack?: () => void;
  onAskTutor?: (prompt: string) => void;
  /** Registry launch target ID, not a curriculum skill or content ID. */
  initialActivityId?: string;
  initialBlueprint?: GameBlueprint;
  initialBlueprintLearnerId?: string;
}

const PRIMARY_ACTIVITY_TARGETS: Record<string, PrimaryActivity> = {
  "speed-math-blitz-sprint": "math-blitz",
  "fraction-lab": "fraction-lab",
  "word-forge": "word-forge",
  "balance-scale": "balance-scale",
  "solar-system": "solar-system",
  "solar-system:cosmic-quiz": "solar-system",
  "tangram-geometry": "geometry-builder",
  "cyber-rover-code-runner": "code-runner",
  "times-matrix": "times-matrix",
};

export function PrimaryLearningLab({
  onBack,
  onAskTutor,
  initialActivityId,
  initialBlueprint,
  initialBlueprintLearnerId,
}: PrimaryLearningLabProps) {
  const [activeActivity, setActiveActivity] = useState<PrimaryActivity>(
    () => PRIMARY_ACTIVITY_TARGETS[initialActivityId || ""] || "math-blitz"
  );
  const [generatedBlueprint, setGeneratedBlueprint] = useState<GameBlueprint | null>(() => initialBlueprint ?? null);
  const [generatedBlueprintLearnerId, setGeneratedBlueprintLearnerId] = useState<string | null>(() => initialBlueprintLearnerId ?? null);
  const [isGamePlaying, setIsGamePlaying] = useState(false);
  const activityEffectMounted = useRef(false);

  useEffect(() => {
    if (!activityEffectMounted.current) {
      activityEffectMounted.current = true;
      return;
    }
    setGeneratedBlueprint(null);
    setGeneratedBlueprintLearnerId(null);
    setIsGamePlaying(false);
  }, [activeActivity]);

  useEffect(() => {
    const clearContentOnLearnerSwitch = (event: Event) => {
      const learnerId = (event as CustomEvent<{ learnerId?: string }>).detail?.learnerId;
      if (learnerId && generatedBlueprintLearnerId && learnerId !== generatedBlueprintLearnerId) {
        setGeneratedBlueprint(null);
        setGeneratedBlueprintLearnerId(null);
        setIsGamePlaying(false);
      }
    };
    window.addEventListener("learner_model_updated", clearContentOnLearnerSwitch);
    return () => window.removeEventListener("learner_model_updated", clearContentOnLearnerSwitch);
  }, [generatedBlueprintLearnerId]);

  const activeLearnerId = getActiveLearnerId();

  useEffect(() => {
    const targetedActivity = PRIMARY_ACTIVITY_TARGETS[initialActivityId || ""];
    if (targetedActivity) setActiveActivity(targetedActivity);
  }, [initialActivityId]);

  // Welcome speech for each activity on start
  useEffect(() => {
    const speechPrompts: Record<PrimaryActivity, string> = {
      "math-blitz": "Welcome to Speed Math Sprint! Solve rapid arithmetic problems before the timer expires!",
      "fraction-lab": "Welcome to the Fraction Lab! Slice and match visual pizza pies to master fractions!",
      "word-forge": "Welcome to Word Forge! Unscramble the letters to forge essential STEM and science words!",
      "balance-scale": "Welcome to the Logic Balance Scale! Place weights on the scale to find balance and solve equations!",
      "solar-system": "Welcome to Cosmic Astronomy! Tap any planet to explore its orbit, atmosphere, and space secrets!",
      "geometry-builder": "Welcome to Tangram Geometry! Combine shapes and rotate polygons to architect geometric creations!",
      "code-runner": "Welcome to Cyber Rover Code Runner! Program your Mars Rover with directional commands to reach the rocket launchpad!",
      "times-matrix": "Welcome to Times Table Matrix Battles! Test your multiplication speed, find factors, and build combos!",
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

          <button
            onClick={() => {
              setActiveActivity("geometry-builder");
              soundEffects.playPop();
            }}
            className={`p-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 border-b-4 transition-all cursor-pointer shadow-md select-none ${
              activeActivity === "geometry-builder"
                ? "bg-gradient-to-b from-rose-500 to-pink-600 border-pink-800 text-white shadow-pink-500/30 active:translate-y-1"
                : "bg-white hover:bg-pink-50 border-slate-200 text-slate-700 hover:text-slate-900"
            }`}
          >
            <Shapes size={16} className={activeActivity === "geometry-builder" ? "text-pink-200" : "text-rose-500"} />
            <span>Tangram Geometry</span>
          </button>

          <button
            onClick={() => {
              setActiveActivity("code-runner");
              soundEffects.playPop();
            }}
            className={`p-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 border-b-4 transition-all cursor-pointer shadow-md select-none ${
              activeActivity === "code-runner"
                ? "bg-gradient-to-b from-emerald-500 to-teal-700 border-teal-900 text-white shadow-teal-500/30 active:translate-y-1"
                : "bg-white hover:bg-teal-50 border-slate-200 text-slate-700 hover:text-slate-900"
            }`}
          >
            <Bot size={16} className={activeActivity === "code-runner" ? "text-teal-200" : "text-teal-600"} />
            <span>Cyber Rover Code</span>
          </button>

          <button
            onClick={() => {
              setActiveActivity("times-matrix");
              soundEffects.playPop();
            }}
            className={`p-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 border-b-4 transition-all cursor-pointer shadow-md select-none ${
              activeActivity === "times-matrix"
                ? "bg-gradient-to-b from-amber-500 to-yellow-600 border-yellow-800 text-white shadow-yellow-500/30 active:translate-y-1"
                : "bg-white hover:bg-amber-50 border-slate-200 text-slate-700 hover:text-slate-900"
            }`}
          >
            <Grid size={16} className={activeActivity === "times-matrix" ? "text-amber-200" : "text-amber-500"} />
            <span>Times Matrix</span>
          </button>
        </div>
      </div>

      {/* Main Content Areas */}
      <div className="max-w-6xl mx-auto relative z-10">
        {activeActivity === "math-blitz" && (
          <>
            <GeneratedContentPanel
              gameType="speed-math"
              skillId="math-23-multiplication"
              onBlueprint={(blueprint, learnerId) => {
                setGeneratedBlueprint(blueprint);
                setGeneratedBlueprintLearnerId(learnerId);
              }}
              disabled={isGamePlaying}
            />
            <SpeedMathBlitzGame
              key={`${activeLearnerId}:${generatedBlueprintLearnerId ?? "curated"}`}
              blueprint={generatedBlueprint?.gameType === "speed-math" && generatedBlueprintLearnerId === activeLearnerId ? generatedBlueprint : undefined}
              onPlayingChange={setIsGamePlaying}
              blueprintLearnerId={generatedBlueprintLearnerId ?? undefined}
            />
          </>
        )}
        {activeActivity === "fraction-lab" && <TactileFractionLab />}
        {activeActivity === "word-forge" && <WordForgeGame />}
        {activeActivity === "balance-scale" && <PhysicsBalanceScaleGame />}
        {activeActivity === "solar-system" && (
          <PrimarySolarSystemLab initialTab={initialActivityId === "solar-system:cosmic-quiz" ? "cosmic-quiz" : "explorer"} />
        )}
        {activeActivity === "geometry-builder" && <GeometryTangramArchitectGame />}
        {activeActivity === "code-runner" && <CyberRoverCodeRunnerGame />}
        {activeActivity === "times-matrix" && (
          <>
            <GeneratedContentPanel
              gameType="times-matrix"
              skillId="math-23-multiplication"
              onBlueprint={(blueprint, learnerId) => {
                setGeneratedBlueprint(blueprint);
                setGeneratedBlueprintLearnerId(learnerId);
              }}
              disabled={isGamePlaying}
            />
            <MultiplicationMatrixGame
              key={`${activeLearnerId}:${generatedBlueprintLearnerId ?? "curated"}`}
              blueprint={generatedBlueprint?.gameType === "times-matrix" && generatedBlueprintLearnerId === activeLearnerId ? generatedBlueprint : undefined}
              onPlayingChange={setIsGamePlaying}
              blueprintLearnerId={generatedBlueprintLearnerId ?? undefined}
            />
          </>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 1. SPEED MATH BLITZ SPRINT (60-sec rapid fire arithmetic)
// -------------------------------------------------------------
function SpeedMathBlitzGame({ blueprint, onPlayingChange, blueprintLearnerId }: { blueprint?: SpeedMathBlueprint; onPlayingChange?: (isPlaying: boolean) => void; blueprintLearnerId?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [problem, setProblem] = useState<{ id: string; text: string; answer: number; choices: number[] }>({ id: "", text: "", answer: 0, choices: [] });
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [isHintVisible, setIsHintVisible] = useState(false);
  const scoreRef = useRef(0);
  const answeredThisProblem = useRef(false);
  const questionCounter = useRef(0);

  useEffect(() => onPlayingChange?.(isPlaying), [isPlaying, onPlayingChange]);

  const completeGeneratedSession = () => {
    if (!blueprint) return;
    const learnerId = blueprintLearnerId ?? getActiveLearnerId();
    recordBlueprintSessionCompletion(blueprint, learnerId);
    markGameBlueprintCompleted(blueprint, learnerId);
  };

  const generateProblem = () => {
    setIsHintVisible(false);
    if (blueprint) {
      const generatedRound = adaptSpeedMathRound(blueprint, questionCounter.current);
      if (!generatedRound) return;
      questionCounter.current += 1;
      setProblem({
        id: `${blueprint.id}:${generatedRound.id}`,
        text: generatedRound.prompt,
        answer: generatedRound.answer,
        choices: shuffle(generatedRound.choices),
      });
      return;
    }

    const ops = ["+", "-", "×"];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a = 0, b = 0, ans = 0;

    if (op === "+") {
      a = Math.floor(Math.random() * 25) + 5;
      b = Math.floor(Math.random() * 25) + 5;
      ans = a + b;
    } else if (op === "-") {
      a = Math.floor(Math.random() * 30) + 10;
      b = Math.floor(Math.random() * (a - 1)) + 1;
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

    questionCounter.current += 1;
    setProblem({
      id: `question-${questionCounter.current}`,
      text: `${a} ${op} ${b}`,
      answer: ans,
      choices: shuffle(Array.from(set)),
    });
  };

  const startGame = () => {
    setIsPlaying(true);
    setTimeLeft(45);
    scoreRef.current = 0;
    questionCounter.current = 0;
    answeredThisProblem.current = false;
    setScore(0);
    setStreak(0);
    setIsGameOver(false);
    generateProblem();
    if (blueprint) speakText(blueprint.voice.introduction, { pitch: 1.04, rate: 0.94 });
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
          const finalScore = scoreRef.current;
          if (blueprint) {
            completeGeneratedSession();
          } else {
            recordLearningEvent({
              learnerId: getActiveLearnerId(),
              activityId: "speed-math-blitz-sprint",
              experienceId: "speed-math-blitz-sprint",
              contentId: `sprint-${Date.now()}`,
              eventType: "activity_completed",
              activityType: "math-blitz",
              activityTitle: "Speed Math Blitz Sprint Completed",
              domain: "general",
              gradeBand: "2-3",
              result: "explored",
              score: Math.min(100, Math.round((finalScore / 120) * 100)),
              difficulty: "medium",
              attempts: 1,
              hintsUsed: 0,
              metadata: { points: finalScore },
            });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, isGameOver, blueprint]);

  const handleChoice = (val: number) => {
    if (!isPlaying || isGameOver || answeredThisProblem.current) return;
    const isCorrect = val === problem.answer;
    const learnerId = blueprint ? blueprintLearnerId ?? getActiveLearnerId() : getActiveLearnerId();
    if (blueprint) {
      recordSpeedMathBlueprintResponse(blueprint, questionCounter.current - 1, val, learnerId, isHintVisible ? 1 : 0);
    } else {
      const skillId = problem.text.includes("×") ? "math-23-multiplication" : "math-k1-addition-subtraction";
      recordLearningEvent({
        learnerId,
        activityId: "speed-math-blitz-sprint",
        experienceId: "speed-math-blitz-sprint",
        contentId: `${problem.id}:choice-${val}`,
        eventType: "question_answered",
        activityType: "math-blitz",
        activityTitle: `Speed Math: ${problem.text}`,
        skillId,
        domain: "math",
        gradeBand: "2-3",
        result: isCorrect ? "success" : "struggle",
        score: isCorrect ? 100 : 0,
        difficulty: "medium",
        attempts: 1,
        hintsUsed: 0,
        metadata: { expression: problem.text, selectedAnswer: val, correctAnswer: problem.answer },
      });
    }
    if (isCorrect) {
      answeredThisProblem.current = true;
      soundEffects.playSuccessChime();
      const points = 10 * (streak >= 3 ? 2 : 1);
      scoreRef.current += points;
      setScore(scoreRef.current);
      setStreak((st) => st + 1);
      setFeedback("correct");
      awardXP(5);
      setTimeout(() => {
        setFeedback(null);
        if (blueprint && questionCounter.current >= blueprint.content.rounds.length) {
          setIsPlaying(false);
          setIsGameOver(true);
          triggerCelebrationConfetti();
          completeGeneratedSession();
          return;
        }
        answeredThisProblem.current = false;
        generateProblem();
      }, 300);
    } else {
      answeredThisProblem.current = true;
      soundEffects.playGentleBoing();
      setStreak(0);
      setFeedback("wrong");
      setTimeout(() => {
        setFeedback(null);
        answeredThisProblem.current = false;
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
            {blueprint ? `${blueprint.objective} ${blueprint.instructions}` : "Solve as many arithmetic equations as you can before the 45-second timer runs out. Build combo streaks for 2X multipliers!"}
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
              {blueprint ? problem.text : `${problem.text} = ?`}
            </div>
          </motion.div>

          {blueprint && (
            <div className="space-y-2">
              {feedback && (
                <p aria-live="polite" className={`text-sm font-bold ${feedback === "correct" ? "text-emerald-700" : "text-rose-700"}`}>
                  {feedback === "correct" ? blueprint.feedback.correct : blueprint.feedback.incorrect}
                </p>
              )}
              <button type="button" onClick={() => setIsHintVisible(true)} className="rounded-xl bg-indigo-50 px-3 py-2 text-xs font-black text-indigo-800 hover:bg-indigo-100">
                {isHintVisible ? "Hint shown" : "Show a hint"}
              </button>
              {isHintVisible && (
                <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
                  {blueprint.content.rounds[questionCounter.current - 1]?.hint}
                </p>
              )}
            </div>
          )}

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
          {blueprint && <p className="text-sm font-semibold text-emerald-800">{blueprint.feedback.completion}</p>}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 border-2 border-amber-300 text-amber-900 text-sm font-black shadow-sm">
            <span>{score} points earned during this sprint</span>
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
        learnerId: getActiveLearnerId(),
        activityId: "primary-lab-fraction-slices",
        experienceId: "fraction-lab",
        contentId: `${currentChallenge.targetNum}/${currentChallenge.targetDen}`,
        eventType: "question_answered",
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
    const letters = shuffle(current.word.split(""));
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
          learnerId: getActiveLearnerId(),
          activityId: "primary-lab-word-forge",
          experienceId: "word-forge",
          contentId: current.word.toLowerCase(),
          eventType: "question_answered",
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
        recordLearningEvent({
          learnerId: getActiveLearnerId(),
          activityId: "primary-lab-word-forge",
          experienceId: "word-forge",
          contentId: `${current.word.toLowerCase()}:${newPlaced.join("").toLowerCase()}`,
          eventType: "question_answered",
          activityType: "word-forge",
          activityTitle: `Word Forge: Incorrect attempt for ${current.word}`,
          skillId: "read-23-sight-words",
          domain: "reading",
          gradeBand: "2-3",
          result: "struggle",
          score: 0,
          difficulty: "medium",
          attempts: 1,
          hintsUsed: 0,
          metadata: { answer: newPlaced.join("") },
        });
        speakText("Not quite! Let's reset the letters and try again!", { pitch: 1.1 });
        setTimeout(() => {
          setScrambled(shuffle(current.word.split("")));
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
        learnerId: getActiveLearnerId(),
        activityId: "primary-lab-balance-scale",
        experienceId: "balance-scale",
        contentId: `level-${level}-target-${targetWeight}`,
        eventType: "question_answered",
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

// -------------------------------------------------------------
// 5. TANGRAM GEOMETRY & SHAPE ARCHITECT
// -------------------------------------------------------------
interface TangramShape {
  id: string;
  name: string;
  emoji: string;
  sides: number;
  internalAngles: string;
  color: string;
  borderColor: string;
}

const TANGRAM_SHAPES: TangramShape[] = [
  { id: "tri-eq", name: "Equilateral Triangle", emoji: "▲", sides: 3, internalAngles: "60° each (180° total)", color: "from-amber-400 to-orange-500", borderColor: "#c2410c" },
  { id: "square", name: "Square", emoji: "■", sides: 4, internalAngles: "90° right angles (360° total)", color: "from-blue-400 to-indigo-500", borderColor: "#3730a3" },
  { id: "rhombus", name: "Rhombus Diamond", emoji: "◆", sides: 4, internalAngles: "Equal opposite angles", color: "from-pink-400 to-rose-500", borderColor: "#9f1239" },
  { id: "hexagon", name: "Regular Hexagon", emoji: "⬡", sides: 6, internalAngles: "120° each (720° total)", color: "from-emerald-400 to-teal-500", borderColor: "#115e59" },
  { id: "trapezoid", name: "Isosceles Trapezoid", emoji: "⏢", sides: 4, internalAngles: "One pair of parallel sides", color: "from-purple-400 to-indigo-600", borderColor: "#4338ca" },
];

const BLUEPRINTS = [
  {
    id: "rocket",
    title: "Cosmic Rocket Explorer",
    emoji: "🚀",
    description: "Architect a deep space rocket using triangles, squares, and rhombuses!",
    requiredSlots: [
      { slotId: "tip", targetShape: "tri-eq", label: "Cone Tip (3-sided)" },
      { slotId: "body1", targetShape: "square", label: "Upper Fuselage (Square)" },
      { slotId: "body2", targetShape: "square", label: "Lower Fuselage (Square)" },
      { slotId: "fin-left", targetShape: "rhombus", label: "Left Stabilizer (Rhombus)" },
      { slotId: "fin-right", targetShape: "rhombus", label: "Right Stabilizer (Rhombus)" },
    ],
  },
  {
    id: "sailboat",
    title: "Ocean Breeze Sailboat",
    emoji: "⛵",
    description: "Construct a buoyant sailboat with a hull and triangular sails!",
    requiredSlots: [
      { slotId: "hull", targetShape: "trapezoid", label: "Boat Hull (Trapezoid)" },
      { slotId: "main-sail", targetShape: "tri-eq", label: "Main Sail (Triangle)" },
      { slotId: "jib-sail", targetShape: "tri-eq", label: "Front Jib (Triangle)" },
    ],
  },
  {
    id: "fox",
    title: "Clever Geometric Fox",
    emoji: "🦊",
    description: "Assemble a smart woodland fox using hexagonal and triangular polygons!",
    requiredSlots: [
      { slotId: "face", targetShape: "rhombus", label: "Fox Muzzle (Rhombus)" },
      { slotId: "body", targetShape: "hexagon", label: "Fox Torso (Hexagon)" },
      { slotId: "ear-left", targetShape: "tri-eq", label: "Left Ear (Triangle)" },
      { slotId: "ear-right", targetShape: "tri-eq", label: "Right Ear (Triangle)" },
    ],
  },
  {
    id: "crown",
    title: "Royal Stellar Crown",
    emoji: "👑",
    description: "Fashion a glittering crown with symmetrical geometric peaks!",
    requiredSlots: [
      { slotId: "base", targetShape: "square", label: "Crown Base (Square)" },
      { slotId: "peak-left", targetShape: "tri-eq", label: "Left Peak (Triangle)" },
      { slotId: "peak-mid", targetShape: "tri-eq", label: "Center Peak (Triangle)" },
      { slotId: "peak-right", targetShape: "tri-eq", label: "Right Peak (Triangle)" },
    ],
  },
];

function GeometryTangramArchitectGame() {
  const [blueprintIdx, setBlueprintIdx] = useState(0);
  const currentBlueprint = BLUEPRINTS[blueprintIdx];
  const [selectedShapeId, setSelectedShapeId] = useState<string>("tri-eq");
  const [rotationAngle, setRotationAngle] = useState(0);
  const [placedSlots, setPlacedSlots] = useState<Record<string, { shapeId: string; rotation: number }>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const selectedShape = TANGRAM_SHAPES.find((s) => s.id === selectedShapeId) || TANGRAM_SHAPES[0];

  useEffect(() => {
    setPlacedSlots({});
    setIsCompleted(false);
  }, [blueprintIdx]);

  const handleRotate = () => {
    soundEffects.playPop();
    setRotationAngle((prev) => (prev + 45) % 360);
  };

  const handlePlaceInSlot = (slotId: string, targetShape: string) => {
    if (selectedShapeId !== targetShape) {
      soundEffects.playGentleBoing();
      speakText(`That slot needs a ${TANGRAM_SHAPES.find((s) => s.id === targetShape)?.name}! Try selecting that shape.`, { pitch: 1.1 });
      return;
    }

    soundEffects.playSuccessChime();
    const updated = {
      ...placedSlots,
      [slotId]: { shapeId: selectedShapeId, rotation: rotationAngle },
    };
    setPlacedSlots(updated);

    // Check if blueprint complete
    const allFilled = currentBlueprint.requiredSlots.every((s) => updated[s.slotId]);
    if (allFilled) {
      setIsCompleted(true);
      soundEffects.playFanfare();
      triggerCelebrationConfetti();
      awardStars(2);
      awardXP(45);
      awardGems(5);
      speakText(`Magnificent architecture! You assembled the ${currentBlueprint.title}!`, { pitch: 1.15 });

      recordLearningEvent({
        learnerId: getActiveLearnerId(),
        activityId: "primary-lab-tangram-geometry",
        experienceId: "tangram-geometry",
        contentId: currentBlueprint.id,
        eventType: "activity_completed",
        activityType: "geometry-tangram",
        activityTitle: `Tangram Geometry: ${currentBlueprint.title}`,
        skillId: "math-k1-shapes",
        domain: "math",
        gradeBand: "K-1",
        result: "success",
        score: 100,
        difficulty: "medium",
        attempts: 1,
        hintsUsed: 0,
      });
    }
  };

  const handleNextBlueprint = () => {
    soundEffects.playPop();
    setBlueprintIdx((prev) => (prev + 1) % BLUEPRINTS.length);
  };

  return (
    <div className="bg-white text-slate-900 border-4 border-rose-200 rounded-[2.5rem] p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl p-2.5 bg-rose-100 rounded-2xl border border-rose-300 shadow-sm">{currentBlueprint.emoji}</span>
          <div>
            <h3 className="text-xl font-black text-slate-900 font-display">{currentBlueprint.title}</h3>
            <p className="text-xs text-slate-600 font-semibold">{currentBlueprint.description}</p>
          </div>
        </div>

        <button
          onClick={handleNextBlueprint}
          className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs transition-colors cursor-pointer border border-slate-300 shadow-sm flex items-center gap-1"
        >
          <span>Next Blueprint</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Assembly Blueprint Board */}
      <div className="p-6 rounded-3xl bg-slate-950 text-white border-2 border-slate-800 shadow-inner flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
        <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
          <Shapes size={14} className="text-rose-400" />
          <span>Tap silhouette slots to snap selected shape:</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {currentBlueprint.requiredSlots.map((slot) => {
            const placed = placedSlots[slot.slotId];
            const targetInfo = TANGRAM_SHAPES.find((s) => s.id === slot.targetShape);

            return (
              <motion.button
                key={slot.slotId}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePlaceInSlot(slot.slotId, slot.targetShape)}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center min-w-[100px] min-h-[90px] ${
                  placed
                    ? `bg-gradient-to-tr ${targetInfo?.color} text-white border-white shadow-lg`
                    : "bg-slate-900 border-dashed border-slate-700 hover:border-rose-400 text-slate-400 hover:text-white"
                }`}
              >
                <span
                  className="text-3xl filter drop-shadow transition-transform"
                  style={{ transform: placed ? `rotate(${placed.rotation}deg)` : undefined }}
                >
                  {targetInfo?.emoji}
                </span>
                <span className="text-[10px] font-black mt-1 text-center truncate max-w-[90px]">
                  {placed ? "Snapped!" : slot.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {isCompleted && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-4 p-3 bg-emerald-500/20 border border-emerald-400 text-emerald-300 rounded-2xl text-xs font-black flex items-center gap-2"
          >
            <CheckCircle2 size={16} /> Blueprint Assembled! (+45 XP, +2 ⭐)
          </motion.div>
        )}
      </div>

      {/* Tangram Palette & Rotating Tool */}
      <div className="p-4 rounded-2xl bg-rose-50/80 border-2 border-rose-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-black uppercase tracking-wider text-rose-950 flex items-center gap-1.5">
            <span>Select Polygon to Build:</span>
          </div>

          <button
            onClick={handleRotate}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white hover:bg-rose-100 text-rose-900 font-black text-xs border border-rose-300 shadow-sm cursor-pointer active:translate-y-0.5"
          >
            <RotateCw size={13} />
            <span>Rotate ({rotationAngle}°)</span>
          </button>
        </div>

        {/* Shapes Picker */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {TANGRAM_SHAPES.map((shape) => {
            const isSelected = selectedShapeId === shape.id;
            return (
              <button
                key={shape.id}
                onClick={() => {
                  setSelectedShapeId(shape.id);
                  soundEffects.playPop();
                  speakText(`${shape.name}! ${shape.sides} sides. ${shape.internalAngles}.`, { pitch: 1.1 });
                }}
                className={`p-2.5 rounded-2xl flex flex-col items-center justify-center border-2 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white border-rose-500 shadow-md ring-2 ring-rose-400/40 scale-103"
                    : "bg-white/80 border-slate-200 hover:border-rose-300"
                }`}
              >
                <span
                  className="text-2xl transition-transform"
                  style={{ transform: `rotate(${rotationAngle}deg)` }}
                >
                  {shape.emoji}
                </span>
                <span className="text-[11px] font-black text-slate-800 mt-1 truncate max-w-full">
                  {shape.name}
                </span>
                <span className="text-[9px] font-bold text-slate-500">{shape.sides} sides</span>
              </button>
            );
          })}
        </div>

        {/* Geometric Property Banner */}
        <div className="p-2.5 rounded-xl bg-white border border-rose-200 text-xs text-rose-950 font-bold flex items-center gap-2">
          <span>💡</span>
          <span>
            <strong>{selectedShape.name}</strong>: {selectedShape.sides} edges, {selectedShape.internalAngles}.
          </span>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 6. CYBER ROVER ALGORITHMIC CODE RUNNER
// -------------------------------------------------------------
type RoverDirection = 0 | 90 | 180 | 270; // 0=East, 90=South, 180=West, 270=North
type CodeCommand = "forward" | "turn-left" | "turn-right" | "jump";

function CyberRoverCodeRunnerGame() {
  const GRID_SIZE = 5;
  const [rover, setRover] = useState<{ x: number; y: number; dir: RoverDirection }>({ x: 0, y: 0, dir: 0 });
  const [program, setProgram] = useState<CodeCommand[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [batteriesCollected, setBatteriesCollected] = useState<number>(0);
  const [isWon, setIsWon] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const ROCKET_POS = { x: 4, y: 4 };
  const BATTERIES = [{ x: 1, y: 2 }, { x: 3, y: 1 }];
  const CRATERS = [{ x: 1, y: 1 }, { x: 3, y: 3 }];

  const handleAddCommand = (cmd: CodeCommand) => {
    if (isRunning) return;
    if (program.length >= 14) {
      speakText("Program memory full! Tap execute or clear to reset.", { pitch: 1.1 });
      return;
    }
    soundEffects.playPop();
    setProgram((prev) => [...prev, cmd]);
    setErrorMessage(null);
  };

  const handleClear = () => {
    soundEffects.playGentleBoing();
    setProgram([]);
    setRover({ x: 0, y: 0, dir: 0 });
    setActiveStep(null);
    setIsRunning(false);
    setIsWon(false);
    setBatteriesCollected(0);
    setErrorMessage(null);
  };

  const recordRoverOutcome = (contentId: string, result: "success" | "struggle", title: string) => {
    recordLearningEvent({
      learnerId: getActiveLearnerId(),
      activityId: "code-rover-martian-maze",
      experienceId: "cyber-rover-code-runner",
      contentId,
      eventType: "activity_completed",
      activityType: "code-runner",
      activityTitle: title,
      skillId: "logic-23-algorithms",
      domain: "logic",
      gradeBand: "2-3",
      result,
      score: result === "success" ? 100 : 0,
      difficulty: "medium",
      attempts: 1,
      hintsUsed: 0,
    });
  };

  const handleRunProgram = async () => {
    if (isRunning || program.length === 0) return;
    setIsRunning(true);
    setErrorMessage(null);
    setIsWon(false);

    let current = { x: 0, y: 0, dir: 0 as RoverDirection };
    setRover(current);
    let batteries = 0;
    setBatteriesCollected(0);

    for (let i = 0; i < program.length; i++) {
      setActiveStep(i);
      const cmd = program[i];
      soundEffects.playPop();

      await new Promise((res) => setTimeout(res, 480));

      if (cmd === "turn-left") {
        current.dir = ((current.dir + 270) % 360) as RoverDirection;
      } else if (cmd === "turn-right") {
        current.dir = ((current.dir + 90) % 360) as RoverDirection;
      } else if (cmd === "forward" || cmd === "jump") {
        const stepDist = cmd === "jump" ? 2 : 1;
        let nextX = current.x;
        let nextY = current.y;

        if (current.dir === 0) nextX += stepDist;
        else if (current.dir === 90) nextY += stepDist;
        else if (current.dir === 180) nextX -= stepDist;
        else if (current.dir === 270) nextY -= stepDist;

        // Boundary check
        if (nextX < 0 || nextX >= GRID_SIZE || nextY < 0 || nextY >= GRID_SIZE) {
          recordRoverOutcome(`run-${program.join("-")}-boundary-${i}`, "struggle", "Cyber Rover: Boundary Collision");
          soundEffects.playGentleBoing();
          setErrorMessage("Rover drove off Martian boundary! Check your code!");
          setIsRunning(false);
          setActiveStep(null);
          return;
        }

        // Crater collision check
        const inCrater = CRATERS.some((c) => c.x === nextX && c.y === nextY);
        if (inCrater && cmd !== "jump") {
          recordRoverOutcome(`run-${program.join("-")}-crater-${i}`, "struggle", "Cyber Rover: Crater Collision");
          soundEffects.playGentleBoing();
          setErrorMessage("Rover fell into a crater! Use 'Jump Obstacle' to leap over it!");
          setIsRunning(false);
          setActiveStep(null);
          return;
        }

        current.x = nextX;
        current.y = nextY;

        // Battery check
        if (BATTERIES.some((b) => b.x === current.x && b.y === current.y)) {
          soundEffects.playSuccessChime();
          batteries += 1;
          setBatteriesCollected(batteries);
        }
      }

      setRover({ ...current });
    }

    setIsRunning(false);
    setActiveStep(null);

    // Check victory
    if (current.x === ROCKET_POS.x && current.y === ROCKET_POS.y) {
      setIsWon(true);
      soundEffects.playFanfare();
      triggerCelebrationConfetti();
      awardStars(3);
      awardXP(50);
      speakText("Mission accomplished! Rover reached the rocket launchpad!", { pitch: 1.15 });

      recordRoverOutcome(`run-${program.join("-")}-success`, "success", "Cyber Rover Algorithmic Runner");
    } else {
      recordRoverOutcome(`run-${program.join("-")}-${current.x}-${current.y}`, "struggle", "Cyber Rover: Incomplete Program");
      setErrorMessage("Program finished, but rover hasn't reached the rocket yet. Add more steps!");
    }
  };

  return (
    <div className="bg-white text-slate-900 border-4 border-teal-200 rounded-[2.5rem] p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl p-2.5 bg-teal-100 rounded-2xl border border-teal-300 shadow-sm">🤖</span>
          <div>
            <h3 className="text-xl font-black text-slate-900 font-display">Cyber Rover Code Runner</h3>
            <p className="text-xs text-slate-600 font-semibold">Sequence commands to steer the rover past craters to the rocket!</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-100 border border-amber-300 rounded-xl text-amber-950 font-black text-xs">
            🔋 {batteriesCollected}/{BATTERIES.length} Cells
          </span>
        </div>
      </div>

      {/* 5x5 Martian Terrain Grid */}
      <div className="p-4 rounded-3xl bg-slate-950 border-3 border-teal-300 shadow-inner flex flex-col items-center">
        <div className="grid grid-cols-5 gap-2 max-w-[340px] w-full aspect-square">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
            const x = idx % GRID_SIZE;
            const y = Math.floor(idx / GRID_SIZE);

            const isRover = rover.x === x && rover.y === y;
            const isRocket = ROCKET_POS.x === x && ROCKET_POS.y === y;
            const isCrater = CRATERS.some((c) => c.x === x && c.y === y);
            const isBattery = BATTERIES.some((b) => b.x === x && b.y === y);

            return (
              <div
                key={`${x}-${y}`}
                className={`rounded-2xl border flex items-center justify-center text-xl transition-all relative ${
                  isRover
                    ? "bg-teal-500/40 border-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.6)]"
                    : isRocket
                    ? "bg-rose-500/20 border-rose-400"
                    : isCrater
                    ? "bg-amber-950/80 border-amber-700/60"
                    : isBattery
                    ? "bg-amber-400/20 border-amber-300/40"
                    : "bg-slate-900/80 border-slate-800"
                }`}
              >
                {isRover && (
                  <motion.div
                    animate={{ rotate: rover.dir }}
                    className="text-2xl filter drop-shadow"
                  >
                    🤖
                  </motion.div>
                )}
                {!isRover && isRocket && <span className="text-2xl animate-pulse">🚀</span>}
                {!isRover && isCrater && <span className="text-sm">🕳️</span>}
                {!isRover && isBattery && <span className="text-sm">🔋</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Error / Victory Banner */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-100 border border-rose-300 text-rose-900 font-bold text-xs text-center">
          ⚠️ {errorMessage}
        </div>
      )}
      {isWon && (
        <div className="p-3.5 rounded-2xl bg-emerald-100 border-2 border-emerald-400 text-emerald-950 font-black text-sm text-center flex items-center justify-center gap-2">
          <CheckCircle2 size={18} className="text-emerald-600" /> Mission Complete! Rover docked with Rocket Launchpad! (+50 XP, +3 ⭐)
        </div>
      )}

      {/* Code Sequence Tape */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-2">
        <div className="flex items-center justify-between text-xs font-black text-slate-700 uppercase tracking-wider">
          <span>Program Sequence ({program.length}/14 blocks):</span>
          {program.length > 0 && (
            <button
              onClick={handleClear}
              className="text-rose-600 hover:text-rose-800 text-[11px] font-black cursor-pointer"
            >
              Clear Code
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 min-h-[42px] p-2 bg-white rounded-xl border border-slate-300">
          {program.length === 0 ? (
            <span className="text-slate-400 text-xs italic">Tap commands below to build your code...</span>
          ) : (
            program.map((cmd, i) => (
              <span
                key={i}
                className={`px-2.5 py-1 rounded-lg text-xs font-black border transition-all ${
                  activeStep === i
                    ? "bg-amber-400 text-amber-950 border-amber-600 scale-110 shadow-md"
                    : "bg-teal-100 border-teal-300 text-teal-900"
                }`}
              >
                {cmd === "forward" && "⬆️ Step"}
                {cmd === "turn-left" && "↩️ Left"}
                {cmd === "turn-right" && "↪️ Right"}
                {cmd === "jump" && "⤴️ Jump"}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Command Blocks Palette */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => handleAddCommand("forward")}
            disabled={isRunning}
            className="py-2.5 px-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-black text-xs border-b-3 border-teal-700 shadow-md cursor-pointer flex items-center justify-center gap-1 active:translate-y-0.5 disabled:opacity-50"
          >
            <span>⬆️ Forward</span>
          </button>

          <button
            onClick={() => handleAddCommand("turn-left")}
            disabled={isRunning}
            className="py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-black text-xs border-b-3 border-cyan-700 shadow-md cursor-pointer flex items-center justify-center gap-1 active:translate-y-0.5 disabled:opacity-50"
          >
            <span>↩️ Turn Left</span>
          </button>

          <button
            onClick={() => handleAddCommand("turn-right")}
            disabled={isRunning}
            className="py-2.5 px-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-black text-xs border-b-3 border-blue-700 shadow-md cursor-pointer flex items-center justify-center gap-1 active:translate-y-0.5 disabled:opacity-50"
          >
            <span>↪️ Turn Right</span>
          </button>

          <button
            onClick={() => handleAddCommand("jump")}
            disabled={isRunning}
            className="py-2.5 px-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-black text-xs border-b-3 border-purple-700 shadow-md cursor-pointer flex items-center justify-center gap-1 active:translate-y-0.5 disabled:opacity-50"
          >
            <span>⤴️ Jump (2x)</span>
          </button>
        </div>

        {/* Big Run Button */}
        <button
          onClick={handleRunProgram}
          disabled={isRunning || program.length === 0}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-sm border-b-4 border-emerald-800 shadow-xl cursor-pointer flex items-center justify-center gap-2 active:translate-y-1 disabled:opacity-50"
        >
          <Play size={16} className="fill-white" />
          <span>{isRunning ? "Executing Code Sequence..." : "Execute Program ▶️"}</span>
        </button>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 7. TIMES TABLE MATRIX BATTLES
// -------------------------------------------------------------
function MultiplicationMatrixGame({ blueprint, onPlayingChange, blueprintLearnerId }: { blueprint?: TimesMatrixBlueprint; onPlayingChange?: (isPlaying: boolean) => void; blueprintLearnerId?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [problem, setProblem] = useState<{ id: string; a: number; b: number; answer: number; choices: number[] }>({ id: "", a: 0, b: 0, answer: 0, choices: [] });
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isHintVisible, setIsHintVisible] = useState(false);
  const scoreRef = useRef(0);
  const answeredRef = useRef(false);
  const questionCounter = useRef(0);

  useEffect(() => onPlayingChange?.(isPlaying), [isPlaying, onPlayingChange]);

  const completeGeneratedSession = () => {
    if (!blueprint) return;
    const learnerId = blueprintLearnerId ?? getActiveLearnerId();
    recordBlueprintSessionCompletion(blueprint, learnerId);
    markGameBlueprintCompleted(blueprint, learnerId);
  };

  const generateFact = () => {
    setIsHintVisible(false);
    if (blueprint) {
      const generatedRound = adaptTimesMatrixRound(blueprint, questionCounter.current);
      const sourceRound = blueprint.content.rounds[questionCounter.current];
      if (!generatedRound || !sourceRound) return;
      questionCounter.current += 1;
      setProblem({
        id: generatedRound.id,
        a: sourceRound.leftFactor,
        b: sourceRound.rightFactor,
        answer: generatedRound.answer,
        choices: shuffle(generatedRound.choices),
      });
      return;
    }

    const a = Math.floor(Math.random() * 11) + 2; // 2 to 12
    const b = Math.floor(Math.random() * 11) + 2; // 2 to 12
    const ans = a * b;

    const set = new Set<number>();
    set.add(ans);
    while (set.size < 4) {
      const delta = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 6) + 1);
      const cand = ans + delta * Math.min(a, b);
      if (cand > 0 && cand !== ans) set.add(cand);
      else set.add(ans + (Math.floor(Math.random() * 10) + 1));
    }

    questionCounter.current += 1;
    setProblem({
      id: `fact-${questionCounter.current}`,
      a,
      b,
      answer: ans,
      choices: shuffle(Array.from(set)),
    });
  };

  const startGame = () => {
    setIsPlaying(true);
    setTimeLeft(45);
    scoreRef.current = 0;
    questionCounter.current = 0;
    setScore(0);
    setStreak(0);
    setIsGameOver(false);
    answeredRef.current = false;
    generateFact();
    if (blueprint) speakText(blueprint.voice.introduction, { pitch: 1.04, rate: 0.94 });
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
          const finalScore = scoreRef.current;
          if (blueprint) {
            completeGeneratedSession();
          } else {
            recordLearningEvent({
              learnerId: getActiveLearnerId(),
              activityId: "times-table-matrix-battle",
              experienceId: "times-matrix",
              contentId: `sprint-${Date.now()}`,
              eventType: "activity_completed",
              activityType: "times-matrix",
              activityTitle: "Multiplication Matrix Sprint Completed",
              domain: "general",
              gradeBand: "2-3",
              result: "explored",
              score: Math.min(100, finalScore),
              difficulty: "medium",
              attempts: 1,
              hintsUsed: 0,
              metadata: { points: finalScore },
            });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, isGameOver, blueprint]);

  const handleChoice = (val: number) => {
    if (!isPlaying || isGameOver || answeredRef.current) return;
    const isCorrect = val === problem.answer;
    const learnerId = blueprint ? blueprintLearnerId ?? getActiveLearnerId() : getActiveLearnerId();
    if (blueprint) {
      recordTimesMatrixBlueprintResponse(blueprint, questionCounter.current - 1, val, learnerId, isHintVisible ? 1 : 0);
    } else {
      recordLearningEvent({
        learnerId,
        activityId: "times-table-matrix-battle",
        experienceId: "times-matrix",
        contentId: `${problem.id}:choice-${val}`,
        eventType: "question_answered",
        activityType: "times-matrix",
        activityTitle: `Multiplication Matrix: ${problem.a} times ${problem.b}`,
        skillId: "math-23-multiplication",
        domain: "math",
        gradeBand: "2-3",
        result: isCorrect ? "success" : "struggle",
        score: isCorrect ? 100 : 0,
        difficulty: "medium",
        attempts: 1,
        hintsUsed: 0,
        metadata: { factorA: problem.a, factorB: problem.b, selectedAnswer: val, correctAnswer: problem.answer },
      });
    }
    if (isCorrect) {
      answeredRef.current = true;
      soundEffects.playSuccessChime();
      const mult = streak >= 5 ? 3 : streak >= 3 ? 2 : 1;
      const pts = 10 * mult;
      scoreRef.current += pts;
      setScore(scoreRef.current);
      setStreak((s) => s + 1);
      setFeedback("correct");
      awardXP(6);
      setTimeout(() => {
        setFeedback(null);
        if (blueprint && questionCounter.current >= blueprint.content.rounds.length) {
          setIsPlaying(false);
          setIsGameOver(true);
          triggerCelebrationConfetti();
          completeGeneratedSession();
          return;
        }
        answeredRef.current = false;
        generateFact();
      }, 300);
    } else {
      answeredRef.current = true;
      soundEffects.playGentleBoing();
      setStreak(0);
      setFeedback("wrong");
      setTimeout(() => {
        setFeedback(null);
        answeredRef.current = false;
      }, 400);
    }
  };

  return (
    <div className="bg-white text-slate-900 border-4 border-amber-200 rounded-[2.5rem] p-6 sm:p-8 max-w-xl mx-auto shadow-2xl text-center">
      {/* HUD Bar */}
      <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border-2 border-amber-200 mb-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Timer className="text-amber-600" size={22} />
          <span className="text-lg font-black text-slate-900">{timeLeft}s</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 border border-amber-300 rounded-xl text-amber-900 text-xs font-black">
          <Flame size={15} className="text-orange-500 fill-orange-500" />
          <span>{streak} Streak {streak >= 3 ? "(2x!)" : ""}</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-100 border border-indigo-300 rounded-xl text-indigo-900 text-xs font-black">
          <Trophy size={15} className="text-indigo-600" />
          <span>{score} PTS</span>
        </div>
      </div>

      {!isPlaying && !isGameOver && (
        <div className="py-8 space-y-4">
          <div className="text-6xl animate-bounce">✖️</div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">Times Table Matrix Battle</h3>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold max-w-md mx-auto">
            {blueprint ? `${blueprint.objective} ${blueprint.instructions}` : "Solve rapid multiplication facts across the 1–12 matrix in 45 seconds to unleash combo multipliers!"}
          </p>
          <button
            onClick={startGame}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-b from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-white font-black text-base border-b-4 border-orange-700 active:translate-y-1 shadow-xl transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Zap size={18} /> Start Matrix Sprint
          </button>
        </div>
      )}

      {isPlaying && !isGameOver && (
        <div className="space-y-6">
          {/* Equation Hero */}
          <motion.div
            key={`${problem.a}x${problem.b}`}
            initial={{ scale: 0.85, opacity: 0 }}
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
              {problem.a} × {problem.b} = ?
            </div>

            {/* Visual Array Grid Cue */}
            <div className="mt-3 text-xs font-black text-indigo-900 flex items-center justify-center gap-1.5">
              <span>Array model: {problem.a} rows of {problem.b}</span>
            </div>
          </motion.div>

          {blueprint && (
            <div className="space-y-2">
              {feedback && (
                <p aria-live="polite" className={`text-sm font-bold ${feedback === "correct" ? "text-emerald-700" : "text-rose-700"}`}>
                  {feedback === "correct" ? blueprint.feedback.correct : blueprint.feedback.incorrect}
                </p>
              )}
              <button type="button" onClick={() => setIsHintVisible(true)} className="rounded-xl bg-indigo-50 px-3 py-2 text-xs font-black text-indigo-800 hover:bg-indigo-100">
                {isHintVisible ? "Hint shown" : "Show a hint"}
              </button>
              {isHintVisible && (
                <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
                  {blueprint.content.rounds[questionCounter.current - 1]?.hint}
                </p>
              )}
            </div>
          )}

          {/* 4 Choices Grid */}
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
          <h3 className="text-3xl font-black text-slate-900 font-display">Matrix Battle Complete!</h3>
          <p className="text-base text-amber-900 font-bold">
            Score: <strong className="text-slate-900">{score} Points</strong>
          </p>
          {blueprint && <p className="text-sm font-semibold text-emerald-800">{blueprint.feedback.completion}</p>}
          <button
            onClick={startGame}
            className="px-6 py-3 rounded-2xl bg-gradient-to-b from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-white font-black text-sm border-b-4 border-orange-700 active:translate-y-1 shadow-xl transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <RotateCcw size={16} /> Battle Again
          </button>
        </motion.div>
      )}
    </div>
  );
}

