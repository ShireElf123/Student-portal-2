import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Star, Volume2, RotateCcw, Award } from "lucide-react";
import { soundEffects } from "../utils/soundEffects";
import { speakText } from "../utils/speechUtils";
import { awardStars, awardXP, triggerCelebrationConfetti } from "../utils/gamification";
import { recordLearningEvent, getActiveLearnerId } from "../utils/learnerBrain";
import { getDailyCount, recordDailyCount } from "../data/toddler/toddlerDailyAdventure";

interface Balloon {
  id: number;
  label: string;
  type: "letter" | "number";
  color: string;
  borderColor: string;
  x: number; // percentage across screen
  speed: number;
}

const BALLOON_COLORS = [
  { bg: "from-pink-500 to-rose-600", border: "#9f1239", name: "pink" },
  { bg: "from-sky-400 to-blue-600", border: "#1e3a8a", name: "blue" },
  { bg: "from-amber-400 to-orange-500", border: "#9a3412", name: "amber" },
  { bg: "from-emerald-400 to-teal-600", border: "#115e59", name: "green" },
  { bg: "from-purple-500 to-indigo-600", border: "#3730a3", name: "purple" },
];

const LETTERS = ["A", "B", "C", "D", "E", "S", "T", "M"];
const NUMBERS = ["1", "2", "3", "4", "5"];

interface ToddlerBalloonSkyProps {
  onAddStar?: (amount?: number) => void;
}

const DAILY_TARGET_STAR_GOAL = 10;

export function ToddlerBalloonSky({ onAddStar }: ToddlerBalloonSkyProps) {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [targetLabel, setTargetLabel] = useState<string>("A");
  const [poppedCount, setPoppedCount] = useState(0);
  const [targetPopsToday, setTargetPopsToday] = useState<number>(() => getDailyCount("balloon-target"));
  // Ref mirror so the every-10-pops celebration fires exactly on time even
  // when taps land faster than React re-renders.
  const poppedRef = useRef(0);

  // Initialize and spawn balloons
  const spawnBalloon = (forcedLabel?: string) => {
    const isLetter = forcedLabel ? isNaN(Number(forcedLabel)) : Math.random() > 0.4;
    const label = forcedLabel
      ? forcedLabel
      : isLetter
      ? LETTERS[Math.floor(Math.random() * LETTERS.length)]
      : NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
    const colorInfo = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];

    const newBalloon: Balloon = {
      id: Date.now() + Math.random(),
      label,
      type: isLetter ? "letter" : "number",
      color: colorInfo.bg,
      borderColor: colorInfo.border,
      x: 10 + Math.random() * 75,
      speed: 12 + Math.random() * 8,
    };

    setBalloons((prev) => [...prev.slice(-12), newBalloon]);
  };

  useEffect(() => {
    // Initial batch of balloons. The first balloon always carries the target
    // so the opening request is immediately answerable.
    const spawnTimers: ReturnType<typeof setTimeout>[] = [];
    spawnTimers.push(setTimeout(() => spawnBalloon("A"), 100));
    for (let i = 1; i < 6; i++) {
      spawnTimers.push(setTimeout(() => spawnBalloon(), i * 300));
    }
    const interval = setInterval(() => spawnBalloon(), 2200);

    const speechTimer = setTimeout(() => {
      speakText(`Welcome to Balloon Sky! Can you find and pop balloon ${targetLabel}?`, {
        pitch: 1.3,
        rate: 0.95,
      });
    }, 150);

    return () => {
      clearInterval(interval);
      clearTimeout(speechTimer);
      spawnTimers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePop = (balloon: Balloon) => {
    soundEffects.playBalloonPop();
    setBalloons((prev) => prev.filter((b) => b.id !== balloon.id));
    poppedRef.current += 1;
    setPoppedCount(poppedRef.current);

    // Speak letter or number
    speakText(balloon.label, { pitch: 1.3, rate: 1.0 });

    if (balloon.label === targetLabel) {
      soundEffects.playSuccessChime();
      // Target pops earn stars up to the daily goal; beyond that, free play.
      const targetTotal = recordDailyCount("balloon-target");
      setTargetPopsToday(targetTotal);
      if (targetTotal <= DAILY_TARGET_STAR_GOAL) {
        if (onAddStar) onAddStar(1);
        else awardStars(1);
      }

      try {
        const isNum = !isNaN(Number(targetLabel));
        recordLearningEvent({
          learnerId: getActiveLearnerId(),
          activityId: "toddler-balloon-sky",
          activityType: isNum ? "toddler-counting" : "toddler-rhyme",
          activityTitle: `Balloon Carnival: Popped Target ${targetLabel}`,
          skillId: isNum ? "math-k1-counting" : "read-k1-phonemic-awareness",
          domain: isNum ? "math" : "reading",
          gradeBand: "toddler",
          result: "success",
          score: 100,
          difficulty: "easy",
          attempts: 1,
          hintsUsed: 0,
        });
      } catch {}

      // pick new target and release a balloon carrying it, so the new
      // request is always answerable instead of hoping random spawns help.
      const nextLetters = [...LETTERS, ...NUMBERS];
      const nextTarget = nextLetters[Math.floor(Math.random() * nextLetters.length)];
      setTargetLabel(nextTarget);
      spawnBalloon(nextTarget);
      speakText(`Great job! Now can you pop ${nextTarget}?`, { pitch: 1.3, rate: 0.95 });
    }

    if (poppedRef.current > 0 && poppedRef.current % 10 === 0) {
      soundEffects.playFanfare();
      triggerCelebrationConfetti();
      // Milestone XP pays out at most 3 times a day; the celebration itself
      // keeps firing so popping marathons still feel festive.
      if (recordDailyCount("balloon-xp-milestone") <= 3) {
        awardXP(30, "Popped 10 Balloons");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-400/20 via-blue-500/20 to-indigo-500/20 border-2 border-sky-400/30 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-400/20 text-sky-300 text-xs font-black uppercase tracking-wider">
          <span>🎈</span> Balloon Sky Carnival
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Pop &amp; Learn Floating Balloons
        </h2>
        <p className="text-white/70 text-xs sm:text-sm max-w-lg mx-auto">
          Tap the floating balloons as they drift through the fluffy clouds. Pop the target to earn golden stars!
        </p>

        {/* Target Goal Pill */}
        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-amber-400 text-amber-950 font-black text-sm border-b-4 border-amber-600 shadow-lg mt-2">
          <span>Target Balloon:</span>
          <span className="w-8 h-8 rounded-full bg-amber-950 text-amber-300 flex items-center justify-center text-lg">
            {targetLabel}
          </span>
        </div>
      </div>

      {/* Sky Play Stage with Fluffy Clouds */}
      <div className="relative h-96 sm:h-[420px] rounded-3xl overflow-hidden bg-gradient-to-b from-sky-400 via-sky-300 to-blue-200 border-4 border-white shadow-2xl">
        {/* Sun in Corner */}
        <div className="absolute top-4 right-4 text-5xl animate-spin-slow drop-shadow-md">
          ☀️
        </div>

        {/* Floating Clouds Background (SVG layered curves) */}
        <div className="absolute top-8 left-6 text-white/80 text-6xl select-none pointer-events-none drop-shadow">
          ☁️
        </div>
        <div className="absolute top-16 right-24 text-white/70 text-7xl select-none pointer-events-none drop-shadow">
          ☁️
        </div>
        <div className="absolute bottom-12 left-1/3 text-white/60 text-5xl select-none pointer-events-none drop-shadow">
          ☁️
        </div>

        {/* Rolling Green Meadow at bottom */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-emerald-600 to-lime-500 rounded-t-[50%] flex items-center justify-center text-white font-black text-xs">
          <span>🌻 🌼 🌸 Grassy Meadow 🌸 🌼 🌻</span>
        </div>

        {/* Floating Balloons */}
        <AnimatePresence>
          {balloons.map((b) => (
            <motion.button
              key={b.id}
              initial={{ y: 440, x: `${b.x}%`, opacity: 0.9, scale: 0.8 }}
              animate={{ y: -80, opacity: 1, scale: 1 }}
              exit={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: b.speed, ease: "linear" }}
              onClick={() => handlePop(b)}
              className={`absolute top-0 w-16 h-20 sm:w-20 sm:h-24 rounded-[50%] bg-gradient-to-br ${b.color} shadow-lg cursor-pointer flex flex-col items-center justify-center border-2 border-white/60 hover:scale-110 active:scale-90 select-none z-10`}
            >
              {/* Balloon Glare */}
              <div className="absolute top-2 left-3 w-4 h-6 rounded-full bg-white/40 -rotate-12" />

              {/* Character inside balloon */}
              <span className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">
                {b.label}
              </span>

              {/* Knot and String */}
              <div className="absolute -bottom-1 w-2 h-2 bg-slate-900/60 rounded-full" />
              <div className="absolute -bottom-6 w-0.5 h-6 bg-white/70" />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Popped Stats Counter */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-bold text-white/80">
        <div className="flex items-center gap-2">
          <span>🎈 Total Popped:</span>
          <span className="text-base font-black text-amber-300">{poppedCount}</span>
        </div>
        <div>
          Target pops today: {Math.min(targetPopsToday, DAILY_TARGET_STAR_GOAL)}/{DAILY_TARGET_STAR_GOAL} ⭐
        </div>
      </div>
    </div>
  );
}
