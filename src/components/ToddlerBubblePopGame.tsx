import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Star, RotateCcw, Volume2, ArrowRight } from "lucide-react";
import { soundEffects } from "../utils/soundEffects";
import { speakText } from "../utils/speechUtils";
import { awardStars, awardXP, triggerCelebrationConfetti } from "../utils/gamification";
import { recordLearningEvent, getActiveLearnerId } from "../utils/learnerBrain";
import { markGameBlueprintCompleted } from "../services/gameContentService";
import { recordBlueprintSessionCompletion, recordBubblePopBlueprintResponse } from "../contentEngine/gameAdapters";
import type { BubblePopBlueprint } from "../contentEngine/types";

interface Bubble {
  id: string;
  letter: string;
  word: string;
  emoji: string;
  xPercent: number; // 5 to 85%
  yPercent: number; // 0 to 90%
  size: number; // 70 to 105 px
  colorGradient: string;
  borderColor: string;
  speed: number;
}

const BUBBLE_CATALOG = [
  { letter: "A", word: "Apple", emoji: "🍎", sound: "A says /æ/! Apple!" },
  { letter: "B", word: "Bear", emoji: "🐻", sound: "B says /b/! Bear!" },
  { letter: "C", word: "Cat", emoji: "🐱", sound: "C says /k/! Cat!" },
  { letter: "D", word: "Dolphin", emoji: "🐬", sound: "D says /d/! Dolphin!" },
  { letter: "E", word: "Elephant", emoji: "🐘", sound: "E says /e/! Elephant!" },
  { letter: "F", word: "Frog", emoji: "🐸", sound: "F says /f/! Frog!" },
  { letter: "G", word: "Giraffe", emoji: "🦒", sound: "G says /g/! Giraffe!" },
  { letter: "H", word: "Heart", emoji: "💖", sound: "H says /h/! Heart!" },
  { letter: "M", word: "Moon", emoji: "🌙", sound: "M says /m/! Moon!" },
  { letter: "P", word: "Puppy", emoji: "🐶", sound: "P says /p/! Puppy!" },
  { letter: "R", word: "Rainbow", emoji: "🌈", sound: "R says /r/! Rainbow!" },
  { letter: "S", word: "Sun", emoji: "☀️", sound: "S says /s/! Sun!" },
  { letter: "T", word: "Tiger", emoji: "🐯", sound: "T says /t/! Tiger!" },
  { letter: "Z", word: "Zebra", emoji: "🦓", sound: "Z says /z/! Zebra!" },
];

const GRADIENTS = [
  { grad: "from-sky-300/80 via-blue-400/80 to-indigo-400/80", border: "#38bdf8" },
  { grad: "from-pink-300/80 via-rose-400/80 to-purple-400/80", border: "#f472b6" },
  { grad: "from-amber-300/80 via-orange-400/80 to-yellow-400/80", border: "#fbbf24" },
  { grad: "from-emerald-300/80 via-teal-400/80 to-cyan-400/80", border: "#34d399" },
  { grad: "from-violet-300/80 via-purple-400/80 to-pink-400/80", border: "#c084fc" },
];

export interface ToddlerBubblePopGameProps {
  onAddStar?: (amount?: number) => void;
  onBack?: () => void;
  blueprint?: BubblePopBlueprint;
  blueprintLearnerId?: string;
  onPlayingChange?: (isPlaying: boolean) => void;
}

export function ToddlerBubblePopGame({ onAddStar, onBack, blueprint, blueprintLearnerId, onPlayingChange }: ToddlerBubblePopGameProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const [targetLetter, setTargetLetter] = useState("A");
  const [poppedParticles, setPoppedParticles] = useState<{ id: string; x: number; y: number; text: string }[]>([]);
  const [isWon, setIsWon] = useState(false);
  const [responseFeedback, setResponseFeedback] = useState<string | null>(null);
  const bubbleIdCounter = useRef(0);
  const blueprintRoundIndex = useRef(0);

  // Spawn the first authored or generated round without changing the game engine.
  useEffect(() => {
    blueprintRoundIndex.current = 0;
    setPoppedCount(0);
    setIsWon(false);
    speakText(blueprint?.voice.introduction ?? "Welcome to Bubble Pop Phonics! Tap the floating bubbles to hear their letter sounds!", {
      pitch: 1.2,
      rate: 0.95,
    });
    spawnWave();
  }, [blueprint?.id]);

  const finishGeneratedSession = () => {
    if (!blueprint) return;
    const learnerId = blueprintLearnerId ?? getActiveLearnerId();
    recordBlueprintSessionCompletion(blueprint, learnerId);
    markGameBlueprintCompleted(blueprint, learnerId);
    onPlayingChange?.(false);
  };

  const spawnWave = () => {
    setResponseFeedback(null);
    if (blueprint) {
      const round = blueprint.content.rounds[blueprintRoundIndex.current];
      if (!round) return;
      const generatedBubbles = round.bubbles.map((item, index): Bubble => {
        const style = GRADIENTS[index % GRADIENTS.length];
        const curated = BUBBLE_CATALOG.find((entry) => entry.letter === item.letter);
        return {
          id: item.id,
          letter: item.letter,
          word: item.word,
          emoji: curated?.emoji ?? "🔤",
          xPercent: 8 + (index % 3) * 28 + (Math.random() * 8 - 4),
          yPercent: 12 + Math.floor(index / 3) * 42 + (Math.random() * 8 - 4),
          size: 78 + Math.floor(Math.random() * 16),
          colorGradient: style.grad,
          borderColor: style.border,
          speed: 2 + Math.random() * 2,
        };
      });
      setTargetLetter(round.targetLetter);
      setBubbles(generatedBubbles);
      setIsWon(false);
      return;
    }

    const newBubbles: Bubble[] = [];
    const usedLetters: string[] = [];

    for (let i = 0; i < 6; i++) {
      const item = BUBBLE_CATALOG[Math.floor(Math.random() * BUBBLE_CATALOG.length)];
      usedLetters.push(item.letter);
      const style = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];

      newBubbles.push({
        id: `bub-${++bubbleIdCounter.current}`,
        letter: item.letter,
        word: item.word,
        emoji: item.emoji,
        xPercent: 8 + (i % 3) * 28 + (Math.random() * 8 - 4),
        yPercent: 12 + Math.floor(i / 3) * 42 + (Math.random() * 8 - 4),
        size: 78 + Math.floor(Math.random() * 16),
        colorGradient: style.grad,
        borderColor: style.border,
        speed: 2 + Math.random() * 2,
      });
    }

    setBubbles(newBubbles);
    const chosen = usedLetters[Math.floor(Math.random() * usedLetters.length)];
    setTargetLetter(chosen);
  };

  const handleRefreshBubbles = () => {
    if (blueprint && isWon) {
      blueprintRoundIndex.current = 0;
      setPoppedCount(0);
      setIsWon(false);
      onPlayingChange?.(true);
    }
    spawnWave();
  };

  const handlePop = (bubble: Bubble) => {
    soundEffects.playPop();
    const item = BUBBLE_CATALOG.find((b) => b.letter === bubble.letter);
    if (blueprint) {
      speakText(`${bubble.letter} begins ${bubble.word}.`, { pitch: 1.25, rate: 0.92 });
    } else if (item) {
      speakText(item.sound, { pitch: 1.25, rate: 0.92 });
    }

    // Add sparkle particle
    const partId = `part-${Date.now()}-${Math.random()}`;
    setPoppedParticles((prev) => [
      ...prev,
      { id: partId, x: bubble.xPercent, y: bubble.yPercent, text: `${bubble.emoji} ${bubble.letter}!` },
    ]);

    setTimeout(() => {
      setPoppedParticles((prev) => prev.filter((p) => p.id !== partId));
    }, 900);

    // Remove popped bubble
    setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));
    const nextCount = poppedCount + 1;
    setPoppedCount(nextCount);
    awardXP(5);

    // Every deliberate bubble choice is a phonics response, including a missed target.
    const isTargetMatch = bubble.letter === targetLetter;
    if (blueprint) {
      setResponseFeedback(isTargetMatch ? blueprint.feedback.correct : blueprint.feedback.incorrect);
    }
    try {
      const learnerId = blueprint ? blueprintLearnerId ?? getActiveLearnerId() : getActiveLearnerId();
      if (blueprint) {
        const round = blueprint.content.rounds[blueprintRoundIndex.current];
        const bubbleIndex = round?.bubbles.findIndex((item) => item.id === bubble.id) ?? -1;
        if (bubbleIndex >= 0) {
          recordBubblePopBlueprintResponse(blueprint, blueprintRoundIndex.current, bubbleIndex, learnerId);
        }
      } else {
        recordLearningEvent({
          learnerId,
          activityId: "toddler-bubble-pop-phonics",
          experienceId: "bubble-pop-phonics",
          contentId: `${targetLetter}:${bubble.id}`,
          eventType: "question_answered",
          activityType: "phonics-pop",
          activityTitle: `Bubble Pop Phonics: ${isTargetMatch ? "Found" : "Missed"} ${targetLetter}`,
          skillId: "read-k1-alphabet-letters",
          domain: "reading",
          gradeBand: "toddler",
          result: isTargetMatch ? "success" : "struggle",
          score: isTargetMatch ? 100 : 0,
          difficulty: "easy",
          attempts: 1,
          hintsUsed: 0,
          metadata: { selectedLetter: bubble.letter, targetLetter },
        });
      }
    } catch (error) {
      console.error("Failed to record bubble phonics response:", error);
    }

    // Check if target letter matched
    if (isTargetMatch) {
      soundEffects.playSuccessChime();
      awardStars(1);
      onAddStar?.(1);
    }

    // Check completion milestone
    if (nextCount % 10 === 0) {
      soundEffects.playFanfare();
      triggerCelebrationConfetti();
      awardStars(2);
      onAddStar?.(2);
    }

    // A generated blueprint is a finite set of validated rounds; curated play remains endless.
    if (bubbles.length <= 1) {
      if (blueprint) {
        blueprintRoundIndex.current += 1;
        setTimeout(() => {
          if (blueprintRoundIndex.current >= blueprint.content.rounds.length) {
            setBubbles([]);
            setIsWon(true);
            speakText(blueprint.feedback.completion, { pitch: 1.1, rate: 0.95 });
            finishGeneratedSession();
            triggerCelebrationConfetti();
          } else {
            spawnWave();
          }
        }, 350);
      } else {
        setTimeout(() => {
          spawnWave();
        }, 350);
      }
    }
  };

  return (
    <div className="relative w-full rounded-[2.5rem] bg-gradient-to-b from-[#38bdf8] via-[#818cf8] to-[#4f46e5] border-4 border-amber-300 p-4 sm:p-6 shadow-2xl overflow-hidden min-h-[460px] flex flex-col justify-between select-none">
      {/* Top HUD */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-md p-4 rounded-3xl border-3 border-indigo-200 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="text-3xl p-2.5 bg-amber-100 border border-amber-300 rounded-2xl shadow-sm">🫧</span>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 font-display">Bubble Pop Phonics</h3>
            <p className="text-xs text-indigo-900 font-semibold">
              {blueprint ? `${blueprint.objective} ${blueprint.instructions}` : "Tap floating soap bubbles to hear letters and animal words!"}
            </p>
            {blueprint && (
              <p className="mt-1 text-[10px] font-black text-indigo-700">
                Generated round {Math.min(blueprintRoundIndex.current + 1, blueprint.content.rounds.length)} of {blueprint.content.rounds.length}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Target Mission */}
          <div className="px-3.5 py-1.5 rounded-2xl bg-amber-100 border-2 border-amber-400 text-amber-950 font-black text-xs flex items-center gap-1.5 shadow-sm">
            <span>Goal: Find</span>
            <span className="w-6 h-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-black text-sm">
              {targetLetter}
            </span>
          </div>

          <div className="px-3.5 py-1.5 rounded-2xl bg-indigo-100 border-2 border-indigo-300 text-indigo-950 font-black text-xs flex items-center gap-1 shadow-sm">
            <span>Popped:</span>
            <span className="text-indigo-600 font-black text-sm">{poppedCount}</span>
            <span>🫧</span>
          </div>

          {onBack && (
            <button
              onClick={onBack}
              className="px-3 py-1.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-black text-xs border-2 border-slate-300 cursor-pointer shadow-sm"
            >
              ← Back
            </button>
          )}
        </div>
      </div>

      {(responseFeedback || isWon) && (
        <p aria-live="polite" className="relative z-10 mt-3 rounded-2xl bg-white/95 px-4 py-2 text-center text-sm font-black text-indigo-900 shadow">
          {isWon ? blueprint?.feedback.completion : responseFeedback}
        </p>
      )}
      {blueprint?.hints[0] && !isWon && (
        <p className="relative z-10 mt-2 text-center text-xs font-semibold text-white/90">Hint: {blueprint.hints[0]}</p>
      )}

      {/* Floating Bubble Aquarium Arena */}
      <div className="relative flex-1 my-4 min-h-[300px] overflow-hidden rounded-3xl border-2 border-white/20 bg-white/10 backdrop-blur-xs">
        {/* Floating animated bubbles */}
        <AnimatePresence>
          {bubbles.map((b) => (
            <motion.button
              key={b.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: [0, -14, 0],
                x: [0, 8, -6, 0],
              }}
              exit={{ scale: 1.4, opacity: 0 }}
              transition={{
                y: { repeat: Infinity, duration: 3.2, ease: "easeInOut" },
                x: { repeat: Infinity, duration: 4.5, ease: "easeInOut" },
                scale: { duration: 0.25 },
              }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              onClick={() => handlePop(b)}
              style={{
                position: "absolute",
                left: `${b.xPercent}%`,
                top: `${b.yPercent}%`,
                width: `${b.size}px`,
                height: `${b.size}px`,
                borderColor: b.borderColor,
              }}
              className={`rounded-full bg-gradient-to-tr ${b.colorGradient} backdrop-blur-md border-3 flex flex-col items-center justify-center shadow-[0_12px_24px_-4px_rgba(0,0,0,0.25)] cursor-pointer text-white transition-shadow hover:shadow-[0_16px_32px_rgba(255,255,255,0.4)]`}
            >
              {/* Shimmer reflection highlight */}
              <div className="absolute top-1.5 left-2.5 w-4 h-2.5 bg-white/70 rounded-full rotate-[-30deg] blur-[0.5px]" />
              <span className="text-2xl sm:text-3xl font-black drop-shadow filter drop-shadow-md">
                {b.letter}
              </span>
              <span className="text-lg filter drop-shadow">{b.emoji}</span>
            </motion.button>
          ))}
        </AnimatePresence>

        {/* Popped Particles Overlay */}
        {poppedParticles.map((part) => (
          <motion.div
            key={part.id}
            initial={{ scale: 0.6, opacity: 1, y: 0 }}
            animate={{ scale: 1.4, opacity: 0, y: -40 }}
            transition={{ duration: 0.8 }}
            style={{
              position: "absolute",
              left: `${part.x}%`,
              top: `${part.y}%`,
            }}
            className="pointer-events-none px-3 py-1 bg-white rounded-full font-black text-base text-indigo-950 border-2 border-amber-400 shadow-xl"
          >
            {part.text}
          </motion.div>
        ))}
      </div>

      {/* Bottom Action Footer */}
      <div className="relative z-10 flex items-center justify-between text-xs font-black text-white/90 px-2">
        <span>{blueprint ? "Tap a bubble to match the target letter." : "Tap any bubble to hear its phonics sound!"}</span>
        <button
          onClick={handleRefreshBubbles}
          className="px-3.5 py-1.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white border border-white/30 cursor-pointer shadow-sm flex items-center gap-1.5"
        >
          <RotateCcw size={13} />
          <span>{blueprint ? (isWon ? "Replay Generated Set" : "Refresh Round") : "New Bubbles"}</span>
        </button>
      </div>
    </div>
  );
}
