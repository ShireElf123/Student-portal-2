import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, Sparkles, Star, RotateCcw, Award, CheckCircle2 } from "lucide-react";
import { soundEffects } from "../utils/soundEffects";
import { speakText, stopSpeaking } from "../utils/speechUtils";
import { awardStars, awardXP, triggerCelebrationConfetti } from "../utils/gamification";
import { recordLearningEvent, getActiveLearnerId } from "../utils/learnerBrain";
import {
  completeActiveMissionIfMatches,
  recordDailyCount,
  recordDailySetMember,
} from "../data/toddler/toddlerDailyAdventure";

interface Animal {
  id: string;
  name: string;
  emoji: string;
  soundText: string;
  call: string;
  funFact: string;
  habitat: string;
  bgGradient: string;
}

const SAFARI_ANIMALS: Animal[] = [
  {
    id: "lion",
    name: "Brave Lion",
    emoji: "🦁",
    soundText: "ROAAAR!",
    call: "Rrrroaaar! Roar! I am the brave golden Lion with a fuzzy mane!",
    funFact: "Lions live in families called prides and love resting under big acacia trees!",
    habitat: "Sunny Savanna",
    bgGradient: "from-amber-400 to-orange-500",
  },
  {
    id: "elephant",
    name: "Gentle Elephant",
    emoji: "🐘",
    soundText: "PAWOOO!",
    call: "Pawoooo! I am the big gentle Elephant! I spray water with my long trunk!",
    funFact: "Elephants have gigantic floppy ears that help keep them cool in the sunshine!",
    habitat: "Waterhole",
    bgGradient: "from-slate-400 to-sky-500",
  },
  {
    id: "monkey",
    name: "Cheeky Monkey",
    emoji: "🐵",
    soundText: "OOH-OOH AAH-AAH!",
    call: "Ooh ooh aah aah! I am a playful Monkey swinging through the green jungle vines!",
    funFact: "Monkeys have long tails that act like an extra hand to hold onto tree branches!",
    habitat: "Tall Treetops",
    bgGradient: "from-emerald-400 to-teal-500",
  },
  {
    id: "duck",
    name: "Happy Duck",
    emoji: "🦆",
    soundText: "QUACK QUACK!",
    call: "Quack quack! Splish splash! I am a cheerful Duck swimming in the blue pond!",
    funFact: "Duck feathers are waterproof, keeping them warm and dry while swimming!",
    habitat: "Lily Pad Pond",
    bgGradient: "from-sky-400 to-cyan-500",
  },
  {
    id: "frog",
    name: "Bouncy Frog",
    emoji: "🐸",
    soundText: "RIBBIT RIBBIT!",
    call: "Ribbit ribbit! Hop hop! I am a green tree frog catching bugs with my long tongue!",
    funFact: "Frogs can breathe through their skin and take giant leaping jumps!",
    habitat: "River Stream",
    bgGradient: "from-lime-400 to-emerald-600",
  },
  {
    id: "cow",
    name: "Friendly Cow",
    emoji: "🐄",
    soundText: "MOOO MOOO!",
    call: "Moooo moooo! I am the spotted dairy Cow munching on delicious green clover!",
    funFact: "Cows have excellent senses of smell and enjoy making friends in grassy pastures!",
    habitat: "Green Meadow",
    bgGradient: "from-rose-400 to-pink-500",
  },
];

interface ToddlerAnimalSafariProps {
  onAddStar?: (amount?: number) => void;
}

export function ToddlerAnimalSafari({ onAddStar }: ToddlerAnimalSafariProps) {
  const [activeMode, setActiveMode] = useState<"explore" | "detective">("detective");
  const [targetAnimal, setTargetAnimal] = useState<Animal>(() => SAFARI_ANIMALS[0]);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // Automatically speak instructions on initial load and mode switch
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeMode === "detective") {
        speakText(`Welcome to Animal Safari! Who makes this sound? ${targetAnimal.soundText}! Tap the right animal!`, {
          pitch: 1.25,
          rate: 0.9,
        });
      } else {
        speakText("Welcome to Animal Safari! Tap any animal friend to hear their call and fun secrets!", {
          pitch: 1.2,
          rate: 0.9,
        });
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [activeMode]);

  const startNewDetectiveRound = () => {
    const choices = SAFARI_ANIMALS.filter((animal) => animal.id !== targetAnimal.id);
    const nextTarget = choices[Math.floor(Math.random() * choices.length)] ?? SAFARI_ANIMALS[0];
    setTargetAnimal(nextTarget);
    setSelectedAnimal(null);
    setShowCelebration(false);
    speakText(`Who makes this sound? ${nextTarget.soundText}! Tap the right animal!`, {
      pitch: 1.25,
      rate: 0.9,
    });
  };

  const handleAnimalClick = (animal: Animal) => {
    soundEffects.playPop();

    if (activeMode === "explore") {
      setSelectedAnimal(animal);
      soundEffects.playSuccessChime();
      speakText(`${animal.call} ${animal.funFact}`, { pitch: 1.2, rate: 0.9 });
      // Discovery stars: the first tap on each animal each day earns a star;
      // repeats are free play so stars cannot be farmed from one animal.
      if (recordDailySetMember("safari-explore", animal.id).isNew) {
        if (onAddStar) onAddStar(1);
        else awardStars(1);
      }
      return;
    }

    // Detective quiz mode: each mystery pays once — solve it, then press Next.
    if (showCelebration) return;
    if (animal.id === targetAnimal.id) {
      setSelectedAnimal(animal);
      setShowCelebration(true);
      soundEffects.playFanfare();
      triggerCelebrationConfetti();
      // The first 5 detective solves each day earn stars and XP; endless
      // rounds after that stay playable as free practice without pay.
      const solvesToday = recordDailyCount("safari-detective-solve");
      if (solvesToday <= 5) {
        if (onAddStar) onAddStar(2);
        else awardStars(2);
        awardXP(25, `Identified ${animal.name}`);
      }
      if (solvesToday === 3) {
        try {
          completeActiveMissionIfMatches("games", "animal-safari");
        } catch {
          // ignore
        }
      }
      setScore((s) => s + 1);

      try {
        recordLearningEvent({
          learnerId: getActiveLearnerId(),
          activityId: "toddler-safari-explorer",
          activityType: "toddler-safari",
          activityTitle: `Animal Safari Detective: Identified ${animal.name}`,
          skillId: "sci-k1-habitats",
          domain: "science",
          gradeBand: "toddler",
          result: "success",
          score: 100,
          difficulty: "easy",
          attempts: 1,
          hintsUsed: 0,
        });
      } catch {}

      speakText(`Yes! Correct! It's the ${animal.name}! ${animal.call}`, {
        pitch: 1.25,
        rate: 0.9,
      });
    } else {
      soundEffects.playGentleBoing();
      speakText(`That's the ${animal.name}! Listen again: ${targetAnimal.soundText}! Try finding the right one!`, {
        pitch: 1.2,
        rate: 0.9,
      });
    }
  };

  const handlePlayTargetSound = () => {
    soundEffects.playPop();
    speakText(`Listen carefully: ${targetAnimal.soundText}! Who says ${targetAnimal.soundText}?`, {
      pitch: 1.25,
      rate: 0.9,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-sky-500/20 border-2 border-emerald-400/30 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-black uppercase tracking-wider">
          <span>🌿</span> Animal Safari &amp; Wildlife Sounds
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Savanna Animal Detective
        </h2>
        <p className="text-white/70 text-xs sm:text-sm max-w-lg mx-auto">
          Hear friendly animal voices, meet cute creatures, and solve safari mystery sounds!
        </p>

        {/* Mode Toggle */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => {
              setActiveMode("detective");
              soundEffects.playPop();
              startNewDetectiveRound();
            }}
            className={`px-4 py-2 rounded-2xl font-black text-xs transition-all cursor-pointer ${
              activeMode === "detective"
                ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 shadow-md scale-105"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            🕵️ Safari Sound Detective
          </button>

          <button
            onClick={() => {
              setActiveMode("explore");
              soundEffects.playPop();
            }}
            className={`px-4 py-2 rounded-2xl font-black text-xs transition-all cursor-pointer ${
              activeMode === "explore"
                ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-md scale-105"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            🔍 Free Safari Explorer
          </button>
        </div>
      </div>

      {/* Detective Prompt Box */}
      {activeMode === "detective" && (
        <div className="p-6 rounded-3xl bg-amber-500/10 border-2 border-amber-400/40 text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="text-xs font-black text-amber-300 uppercase tracking-widest">
              Mystery Animal Call
            </div>
            <div className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-black text-xs">
              🕵️ Solved: {score}
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center gap-3">
            <span>🔊</span>
            <span className="tracking-wide">"{targetAnimal.soundText}"</span>
          </div>
          <div className="flex justify-center gap-3 pt-1">
            <button
              onClick={handlePlayTargetSound}
              className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs border-b-4 border-amber-600 shadow-md cursor-pointer flex items-center gap-2 active:border-b-0 active:translate-y-1"
            >
              <Volume2 size={16} />
              <span>Hear Sound Again</span>
            </button>

            {showCelebration && (
              <button
                onClick={startNewDetectiveRound}
                className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs border-b-4 border-emerald-700 shadow-md cursor-pointer flex items-center gap-2 active:border-b-0 active:translate-y-1"
              >
                <span>Next Mystery Animal →</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Animal Cards Grid (Chunky 3D Buttons) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {SAFARI_ANIMALS.map((animal) => {
          const isCorrectTarget = activeMode === "detective" && showCelebration && animal.id === targetAnimal.id;
          return (
            <motion.button
              key={animal.id}
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleAnimalClick(animal)}
              className={`relative p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col items-center justify-between text-center overflow-hidden select-none ${
                isCorrectTarget
                  ? "bg-emerald-500/20 border-emerald-400 ring-4 ring-emerald-400/40 shadow-xl"
                  : "bg-white/[0.04] border-white/10 hover:border-white/30 hover:bg-white/[0.08]"
              }`}
            >
              {/* Top Habitat Pill */}
              <div className="text-[10px] font-bold text-white/60 bg-white/10 px-2.5 py-0.5 rounded-full mb-2">
                {animal.habitat}
              </div>

              {/* Big Animated Emoji Mascot */}
              <div className="text-5xl sm:text-6xl py-2 filter drop-shadow-lg transition-transform hover:scale-110">
                {animal.emoji}
              </div>

              {/* Name & Sound */}
              <div className="mt-2 space-y-0.5">
                <div className="text-base font-black text-white">{animal.name}</div>
                <div className="text-xs font-bold text-amber-300">{animal.soundText}</div>
              </div>

              {isCorrectTarget && (
                <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full">
                  <CheckCircle2 size={18} />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Info Card when an animal is selected in Explore mode */}
      {activeMode === "explore" && selectedAnimal && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-3xl bg-white/[0.06] border border-white/20 flex items-center gap-4"
        >
          <div className="text-5xl">{selectedAnimal.emoji}</div>
          <div className="space-y-1">
            <h4 className="text-lg font-black text-white flex items-center gap-2">
              <span>{selectedAnimal.name}</span>
              <span className="text-xs text-amber-300 font-bold">"{selectedAnimal.soundText}"</span>
            </h4>
            <p className="text-xs sm:text-sm text-white/80">{selectedAnimal.funFact}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
