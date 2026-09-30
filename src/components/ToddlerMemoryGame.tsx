import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, RotateCcw, Volume2, Sparkles, Trophy } from "lucide-react";
import { soundEffects } from "../utils/soundEffects";
import { speakText, stopSpeaking } from "../utils/speechUtils";
import { awardXP, awardStars, triggerCelebrationConfetti } from "../utils/gamification";
import { recordLearningEvent, getActiveLearnerId } from "../utils/learnerBrain";
import {
  completeActiveMissionIfMatches,
  recordDailyCount,
} from "../data/toddler/toddlerDailyAdventure";

interface CardItem {
  id: number;
  pairId: string;
  emoji: string;
  name: string;
  color: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MEMORY_PAIRS = [
  { pairId: "cat", emoji: "🐱", name: "Kitten", color: "from-amber-400 to-orange-400" },
  { pairId: "dog", emoji: "🐶", name: "Puppy", color: "from-blue-400 to-indigo-400" },
  { pairId: "star", emoji: "⭐", name: "Star", color: "from-yellow-300 to-amber-500" },
  { pairId: "apple", emoji: "🍎", name: "Apple", color: "from-rose-400 to-red-500" },
  { pairId: "bear", emoji: "🐻", name: "Teddy", color: "from-emerald-400 to-teal-500" },
  { pairId: "sun", emoji: "☀️", name: "Sunny", color: "from-amber-300 to-yellow-400" },
  { pairId: "fish", emoji: "🐠", name: "Fish", color: "from-cyan-400 to-blue-500" },
  { pairId: "frog", emoji: "🐸", name: "Frog", color: "from-lime-400 to-emerald-500" },
  { pairId: "butterfly", emoji: "🦋", name: "Butterfly", color: "from-violet-400 to-fuchsia-500" },
  { pairId: "rocket", emoji: "🚀", name: "Rocket", color: "from-sky-400 to-indigo-500" },
  { pairId: "flower", emoji: "🌼", name: "Flower", color: "from-pink-400 to-rose-500" },
];

function generateCards(pairCount: number): CardItem[] {
  // Shuffle the pairs first so every game features different friends —
  // previously every game always used the same first pairs.
  const shuffledPairs = [...MEMORY_PAIRS];
  for (let i = shuffledPairs.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledPairs[i], shuffledPairs[j]] = [shuffledPairs[j], shuffledPairs[i]];
  }
  const selected = shuffledPairs.slice(0, pairCount);
  const deck: CardItem[] = [];
  let id = 1;
  selected.forEach((pair) => {
    deck.push({ id: id++, pairId: pair.pairId, emoji: pair.emoji, name: pair.name, color: pair.color, isFlipped: false, isMatched: false });
    deck.push({ id: id++, pairId: pair.pairId, emoji: pair.emoji, name: pair.name, color: pair.color, isFlipped: false, isMatched: false });
  });
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function ToddlerMemoryGame({ onAddStar }: { onAddStar?: (amt?: number) => void }) {
  const [pairCount, setPairCount] = useState(4);
  const [cards, setCards] = useState<CardItem[]>(() => generateCards(4));
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [matchesCount, setMatchesCount] = useState<number>(0);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [moves, setMoves] = useState<number>(0);
  const [winRewards, setWinRewards] = useState<{ stars: number; xp: number }>({ stars: 3, xp: 50 });
  const gameTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const scheduleGameTimer = (callback: () => void, delay: number) => {
    const timer = setTimeout(() => {
      gameTimers.current = gameTimers.current.filter((id) => id !== timer);
      callback();
    }, delay);
    gameTimers.current.push(timer);
  };

  const clearGameTimers = () => {
    gameTimers.current.forEach(clearTimeout);
    gameTimers.current = [];
  };

  const resetGame = (nextPairCount = pairCount) => {
    clearGameTimers();
    setPairCount(nextPairCount);
    setCards(generateCards(nextPairCount));
    setFlippedIds([]);
    setMatchesCount(0);
    setIsWon(false);
    setMoves(0);
    soundEffects.playPop();
    speakText("Find the matching friends! Tap two cards to turn them over!", { pitch: 1.2 });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      speakText("Welcome to Memory Match! Can you find the matching friends? Tap two cards to turn them over!", {
        pitch: 1.2,
        rate: 0.92,
      });
    }, 240);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => () => clearGameTimers(), []);

  const handleCardClick = (card: CardItem) => {
    if (card.isMatched || card.isFlipped || flippedIds.length >= 2) return;

    soundEffects.playPop();
    const newFlipped = [...flippedIds, card.id];
    setFlippedIds(newFlipped);

    setCards((prev) =>
      prev.map((c) => (c.id === card.id ? { ...c, isFlipped: true } : c))
    );

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const firstCard = cards.find((c) => c.id === newFlipped[0])!;
      const secondCard = card;

      if (firstCard.pairId === secondCard.pairId) {
        // MATCH!
        soundEffects.playSuccessChime();
        speakText(`Match! You found the ${secondCard.name}!`, { pitch: 1.3 });
        awardXP(20);
        if (onAddStar) onAddStar(1);
        else awardStars(1);

        const nextMatchCount = matchesCount + 1;
        scheduleGameTimer(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstCard.id || c.id === secondCard.id
                ? { ...c, isMatched: true }
                : c
            )
          );
          setFlippedIds([]);
          setMatchesCount(nextMatchCount);
          if (nextMatchCount >= pairCount) {
            scheduleGameTimer(() => {
              setIsWon(true);
              soundEffects.playFanfare();
              triggerCelebrationConfetti();
              // Full pay on the day's first win, a small encore on replays.
              const isFirstWinToday = recordDailyCount("memory-match-win") === 1;
              const stars = isFirstWinToday ? 3 : 1;
              const xp = isFirstWinToday ? 50 : 10;
              setWinRewards({ stars, xp });
              speakText(
                isFirstWinToday
                  ? "Hooray! You matched all the friends! You are a superstar!"
                  : "Hooray! You matched all the friends again! Great practice!",
                { pitch: 1.2 }
              );
              awardXP(xp);
              if (onAddStar) onAddStar(stars);
              else awardStars(stars);
              try {
                completeActiveMissionIfMatches("games", "memory-match");
              } catch {
                // ignore
              }

              try {
                recordLearningEvent({
                  learnerId: getActiveLearnerId(),
                  activityId: "toddler-memory-match",
                  activityType: "toddler-memory",
                  activityTitle: `Memory Match: Matched ${pairCount} Pairs`,
                  skillId: "logic-k1-patterns",
                  domain: "logic",
                  gradeBand: "toddler",
                  result: "success",
                  score: 100,
                  difficulty: "easy",
                  attempts: moves + 1,
                  hintsUsed: 0,
                });
              } catch {}
            }, 400);
          }
        }, 500);
      } else {
        // NO MATCH
        soundEffects.playGentleBoing();
        scheduleGameTimer(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstCard.id || c.id === secondCard.id
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedIds([]);
        }, 900);
      }
    }
  };

  return (
    <div className="bg-[#121320] border border-white/10 rounded-3xl p-4 sm:p-6 shadow-xl max-w-2xl mx-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-xl shadow-md">
            🧩
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white">Memory Card Match</h3>
            <p className="text-xs text-white/60">Flip two cards to match the cute characters!</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-amber-500/15 border border-amber-400/30 rounded-xl text-amber-300 text-xs font-bold flex items-center gap-1">
            <Star size={14} className="fill-amber-400" />
            <span>{matchesCount}/{pairCount} Pairs</span>
          </div>

          <button
            onClick={() => resetGame()}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white/80 hover:text-white transition-all cursor-pointer"
            title="Shuffle & Play Again"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white/[0.04] border border-white/10 px-3 py-2">
        <div>
          <p className="text-[11px] font-black uppercase tracking-wider text-white/50">Choose your challenge</p>
          <p className="text-xs text-white/70">More pairs make the game trickier</p>
        </div>
        <div className="flex gap-2" role="group" aria-label="Memory game difficulty">
          {[4, 6, 8].map((count) => (
            <button key={count} onClick={() => resetGame(count)} aria-pressed={pairCount === count}
              className={`rounded-xl px-3 py-2 text-xs font-black transition ${pairCount === count ? "bg-violet-500 text-white shadow-lg" : "bg-white/10 text-white/70 hover:bg-white/20"}`}>
              {count === 4 ? "Cozy" : count === 6 ? "Explorer" : "Superstar"} · {count}
            </button>
          ))}
        </div>
      </div>

      {!isWon ? (
        <div className="grid grid-cols-4 gap-2.5 sm:gap-4 my-4">
          {cards.map((card) => {
            const showFace = card.isFlipped || card.isMatched;
            return (
              <motion.button
                key={card.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCardClick(card)}
                disabled={card.isMatched}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 text-center transition-all cursor-pointer border-b-4 select-none relative ${
                  card.isMatched
                    ? "bg-emerald-500/20 border-emerald-400/50 border-b-emerald-600 opacity-90 scale-95"
                    : showFace
                    ? "bg-white/15 border-white/40 border-b-white/20 shadow-lg"
                    : "bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border-indigo-400/40 border-b-indigo-900 shadow-md"
                }`}
              >
                {showFace ? (
                  <motion.div
                    initial={{ rotateY: 90, scale: 0.5 }}
                    animate={{ rotateY: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center justify-center"
                  >
                    <span className="text-3xl sm:text-4xl filter drop-shadow-md">{card.emoji}</span>
                    <span className="text-[10px] sm:text-xs font-black text-white mt-1 leading-none">{card.name}</span>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-white/50">
                    <Sparkles size={22} className="text-amber-300 animate-pulse" />
                    <span className="text-[10px] font-bold text-white/70 mt-1">Tap</span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      ) : (
        /* Victory Screen */
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-8 space-y-4"
        >
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-5xl shadow-xl shadow-amber-500/30 animate-bounce">
            🏆
          </div>
          <h4 className="text-2xl font-black text-white">Super Memory Champion!</h4>
          <p className="text-sm text-amber-200">
            You matched all pairs in <strong className="text-white">{moves} turns</strong>! Earned <strong className="text-white">+{winRewards.stars} Golden Star{winRewards.stars === 1 ? "" : "s"}</strong> &amp; <strong className="text-white">+{winRewards.xp} XP</strong>!
          </p>
          <button
            onClick={() => resetGame()}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black text-sm border-b-4 border-orange-700 active:border-b-0 active:translate-y-1 shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <RotateCcw size={16} /> Play Again
          </button>
        </motion.div>
      )}
    </div>
  );
}
