import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, Sparkles, Star, RotateCcw, Award, CheckCircle2 } from "lucide-react";
import { soundEffects } from "../utils/soundEffects";
import { stopSpeaking } from "../utils/speechUtils";
import { playSafariAnimalSfx, playSafariDetectiveMystery, playSafariVoiceLine } from "../utils/toddlerAudio";
import {
  SAFARI_EXPLORE_WELCOME_PROMPT,
  safariFriendBioText,
} from "../data/toddler/audioRegistry";
import { awardStars, awardXP, triggerCelebrationConfetti } from "../utils/gamification";
import { recordLearningEvent, getActiveLearnerId } from "../utils/learnerBrain";
import {
  payDailyMissionIfMatches,
  recordDailyCount,
  recordDailySetMember,
} from "../data/toddler/toddlerDailyAdventure";
import { DEFAULT_SAFARI_FRIENDS, type SafariFriend } from "../data/toddler/toddlerWorldPlayThemes";

type Animal = SafariFriend;

interface ToddlerAnimalSafariProps {
  onAddStar?: (amount?: number) => void;
  onComplete?: () => void;
  animals?: SafariFriend[];
  sceneTitle?: string;
  /** Worlds station spokenPrompt — her clip, not the generic Games welcome. */
  exploreWelcome?: string;
  /** Worlds play already pays a worlds mission — do not also pay Games. */
  missionSurface?: "games" | "off";
}

const STATION_HIT_GOAL = 3;

export function ToddlerAnimalSafari({
  onAddStar,
  onComplete,
  animals,
  sceneTitle = "Savanna Animal Detective",
  exploreWelcome,
  missionSurface = "games",
}: ToddlerAnimalSafariProps) {
  const roster = animals && animals.length >= 3 ? animals : DEFAULT_SAFARI_FRIENDS;
  // Worlds stations (Pasture Safari, etc.) are a walk. Games hub stays detective.
  const [activeMode, setActiveMode] = useState<"explore" | "detective">(
    exploreWelcome ? "explore" : "detective",
  );
  // Opening mystery is drawn at random so the game does not always start on
  // the same animal (it used to be the lion every single time).
  const [targetAnimal, setTargetAnimal] = useState<Animal>(
    () => roster[Math.floor(Math.random() * roster.length)] ?? roster[0]
  );
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const stationHits = useRef(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const noteStationHit = () => {
    stationHits.current += 1;
    if (stationHits.current === STATION_HIT_GOAL) onCompleteRef.current?.();
  };

  // Closed Safari kit: narrator MP3s only. Missing clips stay quiet — no Web Speech.
  useEffect(() => {
    const timer = setTimeout(() => {
      stopSpeaking();
      if (activeMode === "detective") {
        playSafariDetectiveMystery(targetAnimal.id);
      } else {
        playSafariVoiceLine(exploreWelcome || SAFARI_EXPLORE_WELCOME_PROMPT);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [activeMode, exploreWelcome]);

  const startNewDetectiveRound = () => {
    const choices = roster.filter((animal) => animal.id !== targetAnimal.id);
    const nextTarget = choices[Math.floor(Math.random() * choices.length)] ?? roster[0];
    setTargetAnimal(nextTarget);
    setSelectedAnimal(null);
    setShowCelebration(false);
    stopSpeaking();
    playSafariDetectiveMystery(nextTarget.id);
  };

  /** Praise the correct animal and wait. Next Mystery Animal starts the next round. */
  const celebrateCorrectAnimal = (animal: Animal) => {
    stopSpeaking();
    playSafariAnimalSfx(animal.id);
  };


  const handleAnimalClick = (animal: Animal) => {
    soundEffects.playPop();

    if (activeMode === "explore") {
      setSelectedAnimal(animal);
      soundEffects.playSuccessChime();
      const bio = safariFriendBioText(animal);
      if (!playSafariVoiceLine(bio)) playSafariAnimalSfx(animal.id);
      // Discovery stars: the first tap on each animal each day earns a star;
      // repeats are free play so stars cannot be farmed from one animal.
      if (recordDailySetMember("safari-explore", animal.id).isNew) {
        if (onAddStar) onAddStar(1);
        else awardStars(1);
        noteStationHit();
      }
      return;
    }

    // Detective quiz mode: each mystery pays once. Stay on the celebration
    // until Next Mystery Animal — do not auto-loop the next call.
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
      if (solvesToday === 3 && missionSurface === "games") {
        try {
          payDailyMissionIfMatches("games", "animal-safari");
        } catch {
          // ignore
        }
      }
      setScore((s) => s + 1);
      noteStationHit();

      try {
        recordLearningEvent({
          learnerId: getActiveLearnerId(),
          activityId: "toddler-safari-explorer",
          experienceId: "animal-safari",
          contentId: targetAnimal.id,
          eventType: "question_answered",
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
      } catch (error) {
        console.error("Failed to record safari response:", error);
      }

      celebrateCorrectAnimal(animal);
    } else {
      soundEffects.playGentleBoing();
      try {
        recordLearningEvent({
          learnerId: getActiveLearnerId(),
          activityId: "toddler-safari-explorer",
          experienceId: "animal-safari",
          contentId: `${targetAnimal.id}:${animal.id}`,
          eventType: "question_answered",
          activityType: "toddler-safari",
          activityTitle: `Animal Safari Detective: Tried ${animal.name}`,
          skillId: "sci-k1-habitats",
          domain: "science",
          gradeBand: "toddler",
          result: "struggle",
          score: 0,
          difficulty: "easy",
          attempts: 1,
          hintsUsed: 0,
        });
      } catch (error) {
        console.error("Failed to record safari response:", error);
      }
      playSafariAnimalSfx(targetAnimal.id);
    }
  };

  const handlePlayTargetSound = () => {
    soundEffects.playPop();
    playSafariAnimalSfx(targetAnimal.id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-sky-500/20 border-2 border-emerald-400/30 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-black uppercase tracking-wider">
          <span>🌿</span> {sceneTitle}
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          {sceneTitle}
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
        {roster.map((animal) => {
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
