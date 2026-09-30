import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, Star, RotateCcw, CheckCircle2, Music, Sparkles } from "lucide-react";
import { soundEffects } from "../utils/soundEffects";
import { speakText, stopSpeaking } from "../utils/speechUtils";
import { awardXP, awardStars, triggerCelebrationConfetti } from "../utils/gamification";
import { recordLearningEvent, getActiveLearnerId } from "../utils/learnerBrain";
import {
  completeActiveMissionIfMatches,
  getDailyCount,
  recordDailyCount,
} from "../data/toddler/toddlerDailyAdventure";

interface RhymeQuestion {
  id: string;
  targetWord: string;
  targetEmoji: string;
  spokenPrompt: string;
  correctWord: string;
  options: {
    word: string;
    emoji: string;
    isCorrect: boolean;
  }[];
}

const RHYME_QUESTIONS: RhymeQuestion[] = [
  {
    id: "r1",
    targetWord: "Cat",
    targetEmoji: "🐱",
    spokenPrompt: "What rhymes with Cat? Listen for the at sound! Can you tap the word that rhymes with Cat?",
    correctWord: "Hat",
    options: [
      { word: "Hat", emoji: "🎩", isCorrect: true },
      { word: "Dog", emoji: "🐶", isCorrect: false },
      { word: "Sun", emoji: "☀️", isCorrect: false },
    ],
  },
  {
    id: "r2",
    targetWord: "Frog",
    targetEmoji: "🐸",
    spokenPrompt: "What rhymes with Frog? Ribbit ribbit! Listen for the og sound! Which friend rhymes with Frog?",
    correctWord: "Dog",
    options: [
      { word: "Fish", emoji: "🐠", isCorrect: false },
      { word: "Dog", emoji: "🐶", isCorrect: true },
      { word: "Star", emoji: "⭐", isCorrect: false },
    ],
  },
  {
    id: "r3",
    targetWord: "Star",
    targetEmoji: "⭐",
    spokenPrompt: "Twinkle twinkle little Star! Listen for the ar sound! Which friend rhymes with Star?",
    correctWord: "Car",
    options: [
      { word: "Moon", emoji: "🌙", isCorrect: false },
      { word: "Car", emoji: "🚗", isCorrect: true },
      { word: "Ball", emoji: "⚽", isCorrect: false },
    ],
  },
  {
    id: "r4",
    targetWord: "Bear",
    targetEmoji: "🐻",
    spokenPrompt: "Fuzzy brown Bear! Listen for the air sound! Can you find what rhymes with Bear?",
    correctWord: "Pear",
    options: [
      { word: "Pear", emoji: "🍐", isCorrect: true },
      { word: "Apple", emoji: "🍎", isCorrect: false },
      { word: "Duck", emoji: "🦆", isCorrect: false },
    ],
  },
  {
    id: "r5",
    targetWord: "Bee",
    targetEmoji: "🐝",
    spokenPrompt: "Buzzy little Bee! Buzz buzz! Listen for the ee sound! What rhymes with Bee?",
    correctWord: "Tree",
    options: [
      { word: "Tree", emoji: "🌳", isCorrect: true },
      { word: "Rock", emoji: "🪨", isCorrect: false },
      { word: "Car", emoji: "🚗", isCorrect: false },
    ],
  },
  {
    id: "r6",
    targetWord: "Sun",
    targetEmoji: "☀️",
    spokenPrompt: "Bright warm Sun! Listen for the un sound! Which one rhymes with Sun?",
    correctWord: "Bun",
    options: [
      { word: "Bun", emoji: "🍞", isCorrect: true },
      { word: "Cloud", emoji: "☁️", isCorrect: false },
      { word: "Cup", emoji: "🥤", isCorrect: false },
    ],
  },
  {
    id: "r7",
    targetWord: "Fox",
    targetEmoji: "🦊",
    spokenPrompt: "Clever orange Fox! Listen for the ox sound! What rhymes with Fox?",
    correctWord: "Box",
    options: [
      { word: "Box", emoji: "📦", isCorrect: true },
      { word: "Tree", emoji: "🌲", isCorrect: false },
      { word: "Bird", emoji: "🐦", isCorrect: false },
    ],
  },
  {
    id: "r8",
    targetWord: "Fish",
    targetEmoji: "🐟",
    spokenPrompt: "Little swimming Fish! Swish swish! Listen for the ish sound! What rhymes with Fish?",
    correctWord: "Dish",
    options: [
      { word: "Dish", emoji: "🍽️", isCorrect: true },
      { word: "Boat", emoji: "⛵", isCorrect: false },
      { word: "Shoe", emoji: "👟", isCorrect: false },
    ],
  },
  {
    id: "r9",
    targetWord: "Duck",
    targetEmoji: "🦆",
    spokenPrompt: "Quack quack goes Duck! Listen for the uck sound! What rhymes with Duck?",
    correctWord: "Truck",
    options: [
      { word: "Truck", emoji: "🚚", isCorrect: true },
      { word: "Water", emoji: "💧", isCorrect: false },
      { word: "Pond", emoji: "🌊", isCorrect: false },
    ],
  },
  {
    id: "r10",
    targetWord: "Mouse",
    targetEmoji: "🐭",
    spokenPrompt: "Tiny quiet Mouse! Squeak squeak! Listen for the ouse sound! What rhymes with Mouse?",
    correctWord: "House",
    options: [
      { word: "House", emoji: "🏡", isCorrect: true },
      { word: "Cheese", emoji: "🧀", isCorrect: false },
      { word: "Cat", emoji: "🐱", isCorrect: false },
    ],
  },
  {
    id: "r11",
    targetWord: "Moon",
    targetEmoji: "🌙",
    spokenPrompt: "Glowing night Moon! Listen for the oon sound! What rhymes with Moon?",
    correctWord: "Spoon",
    options: [
      { word: "Spoon", emoji: "🥄", isCorrect: true },
      { word: "Sun", emoji: "☀️", isCorrect: false },
      { word: "Star", emoji: "⭐", isCorrect: false },
    ],
  },
  {
    id: "r12",
    targetWord: "Goat",
    targetEmoji: "🐐",
    spokenPrompt: "Friendly furry Goat! Baaa! Listen for the oat sound! What rhymes with Goat?",
    correctWord: "Boat",
    options: [
      { word: "Boat", emoji: "⛵", isCorrect: true },
      { word: "Barn", emoji: "🚜", isCorrect: false },
      { word: "Grass", emoji: "🌱", isCorrect: false },
    ],
  },
  {
    id: "r13",
    targetWord: "Cake",
    targetEmoji: "🎂",
    spokenPrompt: "Sweet birthday Cake! Yum yum! Listen for the ake sound! What rhymes with Cake?",
    correctWord: "Snake",
    options: [
      { word: "Snake", emoji: "🐍", isCorrect: true },
      { word: "Candy", emoji: "🍬", isCorrect: false },
      { word: "Fork", emoji: "🍴", isCorrect: false },
    ],
  },
  {
    id: "r14",
    targetWord: "Ring",
    targetEmoji: "💍",
    spokenPrompt: "Shiny golden Ring! Sparkle sparkle! Listen for the ing sound! What rhymes with Ring?",
    correctWord: "King",
    options: [
      { word: "King", emoji: "👑", isCorrect: true },
      { word: "Crown", emoji: "💎", isCorrect: false },
      { word: "Hand", emoji: "✋", isCorrect: false },
    ],
  },
  {
    id: "r15",
    targetWord: "Bell",
    targetEmoji: "🔔",
    spokenPrompt: "Ding dong goes the Bell! Listen for the ell sound! What rhymes with Bell?",
    correctWord: "Shell",
    options: [
      { word: "Shell", emoji: "🐚", isCorrect: true },
      { word: "Clock", emoji: "⏰", isCorrect: false },
      { word: "Door", emoji: "🚪", isCorrect: false },
    ],
  },
  {
    id: "r16",
    targetWord: "Pig",
    targetEmoji: "🐷",
    spokenPrompt: "Oink oink goes little Pig! Listen for the ig sound! What rhymes with Pig?",
    correctWord: "Wig",
    options: [
      { word: "Wig", emoji: "🦱", isCorrect: true },
      { word: "Mud", emoji: "🪵", isCorrect: false },
      { word: "Farm", emoji: "🌾", isCorrect: false },
    ],
  },
];

function shuffleArray<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

// Every round uses a fresh order with shuffled answer positions, so the
// correct rhyme is not always the first button and replays feel new.
function buildShuffledDeck(): RhymeQuestion[] {
  return shuffleArray(RHYME_QUESTIONS).map((q) => ({
    ...q,
    options: shuffleArray(q.options),
  }));
}

export function ToddlerRhymeGame({ onAddStar }: { onAddStar?: (amt?: number) => void }) {
  const [deck, setDeck] = useState<RhymeQuestion[]>(buildShuffledDeck);
  const [index, setIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [wrongShake, setWrongShake] = useState<string | null>(null);
  const [completionRewards, setCompletionRewards] = useState<{ stars: number; xp: number }>({ stars: 3, xp: 50 });
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = deck[index] || deck[0];

  // AI Voice speaks welcome prompt on initial mount and questions smoothly
  useEffect(() => {
    const timer = setTimeout(() => {
      speakText(
        index === 0
          ? `Welcome to Rhyme Time! ${current.spokenPrompt}`
          : current.spokenPrompt,
        { pitch: 1.25, rate: 0.92 }
      );
    }, 240);

    return () => clearTimeout(timer);
  }, [index, deck]);

  useEffect(() => () => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
  }, []);

  const handleSelect = (option: { word: string; emoji: string; isCorrect: boolean }) => {
    if (isAnswered) return;
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    advanceTimerRef.current = null;

    setSelectedWord(option.word);

    if (option.isCorrect) {
      setIsAnswered(true);
      soundEffects.playSuccessChime();
      speakText(`Yes! ${current.targetWord} rhymes with ${option.word}! They sound like music!`, { pitch: 1.3 });
      // Per-answer rewards only while working toward the day's first completion.
      if (getDailyCount("rhyme-time-complete") === 0) {
        awardXP(25);
        if (onAddStar) onAddStar(1);
        else awardStars(1);
      }

      try {
        recordLearningEvent({
          learnerId: getActiveLearnerId(),
          activityId: `toddler-rhyme-${current.id}`,
          activityType: "toddler-rhyme",
          activityTitle: `Rhyme Match: ${current.targetWord} & ${option.word}`,
          skillId: "read-k1-phonemic-awareness",
          domain: "reading",
          gradeBand: "toddler",
          result: "success",
          score: 100,
          difficulty: "easy",
          attempts: 1,
          hintsUsed: 0,
        });
      } catch {}

      advanceTimerRef.current = setTimeout(() => {
        advanceTimerRef.current = null;
        if (index < deck.length - 1) {
          setIndex(index + 1);
          setIsAnswered(false);
          setSelectedWord(null);
        } else {
          setIsCompleted(true);
          soundEffects.playFanfare();
          triggerCelebrationConfetti();
          // Full pay on the day's first completion, a small encore on replays.
          const isFirstToday = recordDailyCount("rhyme-time-complete") === 1;
          const stars = isFirstToday ? 3 : 1;
          const xp = isFirstToday ? 50 : 10;
          setCompletionRewards({ stars, xp });
          speakText(
            isFirstToday
              ? "Hooray! You are a master rhymer! Fantastic job!"
              : "Hooray! You finished all the rhymes again! Great practice!",
            { pitch: 1.25 }
          );
          awardXP(xp);
          if (onAddStar) onAddStar(stars);
          else awardStars(stars);
          try {
            completeActiveMissionIfMatches("games", "rhyme-time");
          } catch {
            // ignore
          }
        }
      }, 1500);
    } else {
      soundEffects.playGentleBoing();
      speakText(`Oops! Try again! Listen: ${current.targetWord}... what sounds like ${current.targetWord}?`, { pitch: 1.2 });
      setWrongShake(option.word);
      advanceTimerRef.current = setTimeout(() => {
        advanceTimerRef.current = null;
        setWrongShake(null);
        setSelectedWord(null);
      }, 800);
    }
  };

  const handleRestart = () => {
    stopSpeaking();
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    advanceTimerRef.current = null;
    setDeck(buildShuffledDeck());
    setIndex(0);
    setIsAnswered(false);
    setIsCompleted(false);
    setSelectedWord(null);
    soundEffects.playPop();
  };

  return (
    <div className="bg-[#131322] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-xl max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-xl shadow-md">
            🎵
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white">Rhyme Time Playground</h3>
            <p className="text-xs text-white/60">Find words that have matching sounds!</p>
          </div>
        </div>

        <button
          onClick={() => speakText(current.spokenPrompt, { pitch: 1.25 })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 text-xs font-bold border border-pink-400/30 transition-all cursor-pointer"
        >
          <Volume2 size={14} /> Listen
        </button>
      </div>

      {!isCompleted ? (
        <div className="space-y-6">
          {/* Target Word Hero Display */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border-2 border-white/10 flex flex-col items-center justify-center text-center shadow-inner relative">
            <span className="text-6xl mb-2 filter drop-shadow-md animate-bounce">{current.targetEmoji}</span>
            <h4 className="text-2xl font-black text-amber-300 tracking-wide">
              {current.targetWord}
            </h4>
            <p className="text-xs text-white/60 mt-1">Which friend below rhymes with {current.targetWord}?</p>
          </div>

          {/* Option Choices */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {current.options.map((opt) => {
              const isSelected = selectedWord === opt.word;
              const isWrong = wrongShake === opt.word;

              return (
                <motion.button
                  key={opt.word}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  animate={isWrong ? { x: [-8, 8, -6, 6, 0] } : {}}
                  onClick={() => handleSelect(opt)}
                  disabled={isAnswered}
                  className={`p-4 sm:p-5 rounded-2xl flex flex-col items-center justify-center gap-2 border-b-4 transition-all cursor-pointer select-none shadow-md ${
                    isSelected && opt.isCorrect
                      ? "bg-emerald-500 text-white border-emerald-400 border-b-emerald-700 ring-4 ring-emerald-400/40"
                      : isWrong
                      ? "bg-rose-500/30 text-white border-rose-400 border-b-rose-700 ring-4 ring-rose-400/30"
                      : "bg-white/10 hover:bg-white/15 border-white/20 border-b-white/10 text-white"
                  }`}
                >
                  <span className="text-4xl sm:text-5xl filter drop-shadow">{opt.emoji}</span>
                  <span className="text-sm sm:text-base font-black text-white">{opt.word}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {deck.map((_, i) => (
              <div
                key={i}
                className={`h-2.5 rounded-full transition-all ${
                  i === index ? "w-7 bg-pink-400" : i < index ? "w-2.5 bg-emerald-400" : "w-2.5 bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Victory Celebration */
        <div className="text-center py-8 space-y-4">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-5xl shadow-xl shadow-pink-500/30 animate-bounce">
            🎉
          </div>
          <h4 className="text-2xl font-black text-white">Rhyme Master!</h4>
          <p className="text-sm text-pink-200">
            You completed all rhyming challenges! Earned <strong className="text-white">+{completionRewards.stars} Star{completionRewards.stars === 1 ? "" : "s"}</strong> &amp; <strong className="text-white">+{completionRewards.xp} XP</strong>!
          </p>
          <button
            onClick={handleRestart}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-black text-sm border-b-4 border-rose-700 active:border-b-0 active:translate-y-1 shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <RotateCcw size={16} /> Play Again
          </button>
        </div>
      )}
    </div>
  );
}
