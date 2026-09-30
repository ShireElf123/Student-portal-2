import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  Star,
  Lock,
  CheckCircle2,
  Trophy,
  Zap,
  Play,
  Flame,
  Gift,
  ArrowRight,
} from "lucide-react";
import { NavigationTab, LearningStage } from "../types";
import { soundEffects } from "../utils/soundEffects";
import {
  getGamificationState,
  subscribeGamification,
  awardXP,
  awardGems,
  triggerCelebrationConfetti,
} from "../utils/gamification";
import { BuddyCompanionBadge } from "./BuddyCompanionBadge";
import {
  RollingHillsDivider,
  FloatingCloudDecoration,
  CharacterAnchor,
} from "./landscape/LandscapeDecorations";
import { MasterySkillTreeView } from "./MasterySkillTreeView";

interface OdysseyNode {
  id: string;
  title: string;
  subtitle: string;
  stage: LearningStage;
  targetTab: NavigationTab;
  emoji: string;
  starsRequired: number;
  xpReward: number;
  colorClass: string;
  borderClass: string;
}

const ODYSSEY_NODES: OdysseyNode[] = [
  // Stage 1: Toddler Wonderland
  {
    id: "node-toddler-1",
    title: "Picture Book Meadow",
    subtitle: "Interactive storytelling with read-aloud voice",
    stage: "toddler",
    targetTab: "toddler",
    emoji: "📖",
    starsRequired: 0,
    xpReward: 30,
    colorClass: "from-amber-500 to-orange-500",
    borderClass: "border-amber-400",
  },
  {
    id: "node-toddler-2",
    title: "ABC Phonics Grove",
    subtitle: "26 tactile letter sound tiles with cheerful audio",
    stage: "toddler",
    targetTab: "toddler",
    emoji: "🔤",
    starsRequired: 2,
    xpReward: 35,
    colorClass: "from-rose-500 to-pink-500",
    borderClass: "border-rose-400",
  },
  {
    id: "node-toddler-safari",
    title: "Animal Safari Detective",
    subtitle: "Listen to real animal cries and find the safari creature",
    stage: "toddler",
    targetTab: "toddler",
    emoji: "🦁",
    starsRequired: 4,
    xpReward: 40,
    colorClass: "from-emerald-500 to-teal-500",
    borderClass: "border-emerald-400",
  },
  {
    id: "node-toddler-music",
    title: "Rainbow Xylophone & Music Studio",
    subtitle: "Play pentatonic bell melodies and listen to nursery songs",
    stage: "toddler",
    targetTab: "toddler",
    emoji: "🎹",
    starsRequired: 6,
    xpReward: 45,
    colorClass: "from-pink-500 to-purple-500",
    borderClass: "border-pink-400",
  },
  {
    id: "node-toddler-balloons",
    title: "Sky Balloon Alphabet & Number Pop",
    subtitle: "Pop floating colorful balloons to hear spoken sounds",
    stage: "toddler",
    targetTab: "toddler",
    emoji: "🎈",
    starsRequired: 8,
    xpReward: 45,
    colorClass: "from-sky-500 to-indigo-500",
    borderClass: "border-sky-400",
  },
  {
    id: "node-toddler-5",
    title: "Color Magic Mixing Cauldron",
    subtitle: "Blend primary droplets into glowing secondary colors",
    stage: "toddler",
    targetTab: "toddler",
    emoji: "🎨",
    starsRequired: 10,
    xpReward: 50,
    colorClass: "from-purple-500 to-indigo-500",
    borderClass: "border-purple-400",
  },

  // Stage 2: Primary Explorer
  {
    id: "node-primary-1",
    title: "Primary Homework Desk",
    subtitle: "Parent & tutor assignment portal with AI hint co-pilot",
    stage: "primary",
    targetTab: "homework",
    emoji: "🎒",
    starsRequired: 14,
    xpReward: 50,
    colorClass: "from-indigo-600 to-blue-500",
    borderClass: "border-indigo-400",
  },
  {
    id: "node-primary-2",
    title: "Speed Math Blitz Sprint",
    subtitle: "Rapid-fire mental arithmetic combo sprint",
    stage: "primary",
    targetTab: "primary-lab",
    emoji: "⚡",
    starsRequired: 16,
    xpReward: 60,
    colorClass: "from-amber-500 to-yellow-400",
    borderClass: "border-amber-400",
  },
  {
    id: "node-primary-3",
    title: "Tactile Fraction & Pizza Lab",
    subtitle: "Interactive portion slicers & equivalent fractions",
    stage: "primary",
    targetTab: "primary-lab",
    emoji: "🍕",
    starsRequired: 20,
    xpReward: 65,
    colorClass: "from-emerald-600 to-teal-400",
    borderClass: "border-emerald-400",
  },
  {
    id: "node-primary-4",
    title: "Word Forge & Spelling Scramble",
    subtitle: "Interactive tile puzzles for vocabulary mastery",
    stage: "primary",
    targetTab: "primary-lab",
    emoji: "🔠",
    starsRequired: 24,
    xpReward: 70,
    colorClass: "from-purple-600 to-pink-500",
    borderClass: "border-purple-400",
  },
  {
    id: "node-primary-solar",
    title: "Planetary Orbit & Gravity Lab",
    subtitle: "Explore 8 planets, weight on other worlds, and space physics",
    stage: "primary",
    targetTab: "primary-lab",
    emoji: "🪐",
    starsRequired: 28,
    xpReward: 75,
    colorClass: "from-violet-600 to-fuchsia-500",
    borderClass: "border-violet-400",
  },
  {
    id: "node-primary-5",
    title: "Guided Diagnostic Assessment Bridge",
    subtitle: "Adaptive homework & phonics comprehension analysis",
    stage: "primary",
    targetTab: "assessment",
    emoji: "📋",
    starsRequired: 32,
    xpReward: 80,
    colorClass: "from-teal-600 to-emerald-500",
    borderClass: "border-teal-400",
  },

  // Stage 3: Educator & Mastery Summit
  {
    id: "node-mastery-1",
    title: "Homeschool AI Tutor Co-Pilot",
    subtitle: "Interactive Socratic dialogue for step-by-step guidance",
    stage: "educator",
    targetTab: "tutor",
    emoji: "🤖",
    starsRequired: 36,
    xpReward: 90,
    colorClass: "from-blue-600 to-indigo-600",
    borderClass: "border-blue-400",
  },
  {
    id: "node-mastery-2",
    title: "Parent & Tutor Growth Analytics",
    subtitle: "Comprehensive curriculum milestone oversight",
    stage: "educator",
    targetTab: "parent",
    emoji: "👩‍🏫",
    starsRequired: 40,
    xpReward: 100,
    colorClass: "from-emerald-600 to-green-500",
    borderClass: "border-emerald-400",
  },
];

interface LearningOdysseyMapProps {
  onNavigateTab: (tab: NavigationTab) => void;
  onSelectStage: (stage: LearningStage) => void;
  recommendedNodeId?: string;
  onRecommendationConsumed?: () => void;
}

export function LearningOdysseyMap({
  onNavigateTab,
  onSelectStage,
  recommendedNodeId,
  onRecommendationConsumed,
}: LearningOdysseyMapProps) {
  const [gamification, setGamification] = useState(getGamificationState);
  const [openedChest, setOpenedChest] = useState(false);
  const [viewMode, setViewMode] = useState<"constellation" | "trail">(() => recommendedNodeId ? "trail" : "constellation");

  useEffect(() => {
    return subscribeGamification(setGamification);
  }, []);

  const handleNodeClick = (node: OdysseyNode, isUnlocked: boolean) => {
    if (!isUnlocked) {
      soundEffects.playGentleBoing();
      return;
    }
    soundEffects.playPop();
    onSelectStage(node.stage);
    onNavigateTab(node.targetTab);
  };

  const handleOpenChest = () => {
    if (openedChest) return;
    setOpenedChest(true);
    soundEffects.playFanfare();
    triggerCelebrationConfetti();
    awardXP(120, "Odyssey Treasure Chest");
    awardGems(25);
  };

  if (viewMode === "constellation") {
    return (
      <div className="flex-1 flex flex-col min-h-0 bg-[#0b0f19]">
        {/* View Mode Switcher Header */}
        <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-300">
              Curriculum Navigation Mode
            </span>
          </div>
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setViewMode("constellation")}
              className="px-3 py-1.5 rounded-lg text-xs font-black transition-all bg-indigo-600 text-white shadow-sm cursor-pointer"
            >
              🌌 Skill Tree Constellation
            </button>
            <button
              onClick={() => setViewMode("trail")}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              🗺️ Illustrated Story Trail
            </button>
          </div>
        </div>

        {/* Constellation Core Tree */}
        <MasterySkillTreeView onNavigateTab={onNavigateTab} recommendedNodeId={recommendedNodeId} onRecommendationConsumed={onRecommendationConsumed} />
      </div>
    );
  }

  return (
    <div className="min-h-full pb-24 bg-gradient-to-b from-[#38bdf8] via-[#86efac] to-[#10b981] text-slate-900 p-4 sm:p-8 relative overflow-hidden">
      {/* Top Switcher in Trail view */}
      <div className="max-w-4xl mx-auto flex justify-end mb-4 relative z-20">
        <div className="flex items-center p-1 bg-white/95 border-2 border-emerald-300 rounded-xl shadow-md">
          <button
            onClick={() => setViewMode("constellation")}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-950 transition-all cursor-pointer"
          >
            🌌 Skill Tree Constellation
          </button>
          <button
            onClick={() => setViewMode("trail")}
            className="px-3 py-1.5 rounded-lg text-xs font-black transition-all bg-emerald-600 text-white shadow-sm cursor-pointer"
          >
            🗺️ Illustrated Story Trail
          </button>
        </div>
      </div>
      {/* Playful Floating Atmospheric Clouds */}
      <FloatingCloudDecoration className="absolute top-4 left-6" size="md" />
      <FloatingCloudDecoration className="absolute top-16 right-10" size="lg" />
      <FloatingCloudDecoration className="absolute top-64 left-1/4" size="sm" />
      <FloatingCloudDecoration className="absolute top-96 right-1/4" size="md" />

      {/* Top Odyssey Banner Card */}
      <div className="max-w-4xl mx-auto text-center space-y-3 mb-10 relative z-10">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/95 border-2 border-amber-300 text-amber-900 text-xs font-black uppercase tracking-wider shadow-md">
          <Sparkles size={15} className="text-amber-500 fill-amber-400" /> Learning Odyssey &amp; Skill Path
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-display drop-shadow-sm">
          Your Journey from Toddler Meadow to Primary Camp
        </h1>
        <p className="text-slate-700 text-xs sm:text-base font-bold max-w-xl mx-auto drop-shadow-sm">
          Hop along the illustrated trail! Collect Golden Stars ⭐, level up your Buddy XP, unlock secret games, and crack open treasure chests!
        </p>

        {/* Buddy Companion Progress Card */}
        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/95 border-3 border-emerald-300 shadow-xl mt-2">
          <BuddyCompanionBadge buddy={gamification.buddy} size="sm" animated />
          <div className="text-left text-xs sm:text-sm">
            <span className="text-emerald-800 font-black">{gamification.buddy.name}</span>{" "}
            <span className="text-slate-600 font-bold">is cheering you on! Total Stars:</span>{" "}
            <span className="text-amber-600 font-black">{gamification.starsCount} ⭐</span>
          </div>
        </div>
      </div>

      {/* Odyssey Trail Nodes Container */}
      <div className="max-w-3xl mx-auto relative z-10">
        {/* Central Cobblestone Winding Trail Path */}
        <div className="absolute left-1/2 -translate-x-1/2 top-10 bottom-10 w-6 bg-gradient-to-b from-amber-200 via-amber-300 to-emerald-200 rounded-full border-2 border-amber-400/80 shadow-inner -z-0" />

        <div className="space-y-10 relative z-10">
          {ODYSSEY_NODES.map((node, idx) => {
            const isUnlocked = gamification.starsCount >= node.starsRequired;
            const isCompleted = gamification.completedNodes.includes(node.id);
            const isEven = idx % 2 === 0;

            // Check if this node starts a new biome
            const isToddlerStart = idx === 0;
            const isPrimaryStart = node.id === "node-primary-1";
            const isMasteryStart = node.id === "node-mastery-1";

            return (
              <React.Fragment key={node.id}>
                {/* Biome 1: Toddler Meadow Header */}
                {isToddlerStart && (
                  <div className="pt-2 pb-4 text-center">
                    <RollingHillsDivider variant="meadow" heightClass="h-10 sm:h-12" showFlowers />
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border-3 border-emerald-400 text-emerald-950 text-xs font-black uppercase tracking-wider -mt-5 relative z-10 shadow-lg">
                      <span>🌼</span> Zone 1: Sunny Meadow &amp; Phonics Grove (Ages 2–5)
                    </div>
                  </div>
                )}

                {/* Biome 2: Primary Camp Pine Forest */}
                {isPrimaryStart && (
                  <div className="pt-8 pb-4 text-center">
                    <RollingHillsDivider variant="pine-forest" heightClass="h-12 sm:h-14" />
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border-3 border-indigo-400 text-indigo-950 text-xs font-black uppercase tracking-wider -mt-5 relative z-10 shadow-xl">
                      <span>🏕️</span> Zone 2: Primary Camp &amp; STEM Arcade (Ages 6–11)
                    </div>
                  </div>
                )}

                {/* Biome 3: Golden Mastery & Tutor Summit */}
                {isMasteryStart && (
                  <div className="pt-8 pb-4 text-center">
                    <RollingHillsDivider variant="warm-sun" heightClass="h-12 sm:h-14" />
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border-3 border-amber-400 text-amber-950 text-xs font-black uppercase tracking-wider -mt-5 relative z-10 shadow-xl">
                      <span>🏔️</span> Zone 3: Educator &amp; AI Tutor Summit
                    </div>
                  </div>
                )}

                <div
                  className={`flex items-center gap-4 sm:gap-6 ${
                    isEven ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                {/* Node Card - Chunky Claymorphic Cloud Card */}
                <motion.div
                  whileHover={isUnlocked ? { scale: 1.03, y: -2 } : {}}
                  whileTap={isUnlocked ? { scale: 0.97 } : {}}
                  onClick={() => handleNodeClick(node, isUnlocked)}
                  className={`flex-1 p-5 rounded-[2.25rem] transition-all cursor-pointer shadow-xl ${
                    isCompleted
                      ? "bg-white text-slate-800 border-4 border-emerald-400 ring-4 ring-emerald-400/20 shadow-[0_12px_24px_-6px_rgba(16,185,129,0.2)]"
                      : isUnlocked
                      ? "bg-white text-slate-800 border-4 border-amber-200 hover:border-amber-400 shadow-[0_12px_24px_-6px_rgba(20,83,45,0.15)]"
                      : "bg-white/70 text-slate-500 border-3 border-slate-200 opacity-70 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className={`px-2.5 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider ${
                      node.stage === "toddler" ? "bg-amber-100 text-amber-900 border border-amber-200" : node.stage === "primary" ? "bg-indigo-100 text-indigo-900 border border-indigo-200" : "bg-emerald-100 text-emerald-900 border border-emerald-200"
                    }`}>
                      {node.stage === "toddler" ? "🧸 Toddler (2–5y)" : node.stage === "primary" ? "🎒 Primary (6–11y)" : "👩‍🏫 Tutor Hub"}
                    </span>

                    <div className="flex items-center gap-1.5 text-xs font-black text-amber-700">
                      <Star size={14} className="fill-amber-400 text-amber-500" />
                      <span>{node.starsRequired} Stars Req.</span>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 font-display">
                    <span>{node.title}</span>
                    {isCompleted && (
                      <CheckCircle2 size={18} className="text-emerald-600 fill-emerald-100" />
                    )}
                  </h3>

                  <p className="text-xs text-slate-600 font-semibold line-clamp-2 mt-1 mb-3">
                    {node.subtitle}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <span className="text-indigo-700 font-black">+{node.xpReward} XP</span>

                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-1.5 font-black text-xs text-white bg-gradient-to-b from-amber-400 to-amber-500 border-b-3 border-amber-700 px-3.5 py-1.5 rounded-2xl shadow-md active:translate-y-0.5">
                        <Play size={12} className="fill-white" /> Play Node
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-xl">
                        <Lock size={12} /> Locked
                      </span>
                    )}
                  </div>
                </motion.div>

                {/* Central Tactile 3D Circular Node Orb */}
                <motion.button
                  whileHover={isUnlocked ? { scale: 1.15 } : {}}
                  whileTap={isUnlocked ? { scale: 0.9 } : {}}
                  onClick={() => handleNodeClick(node, isUnlocked)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-3xl sm:text-4xl border-4 shadow-xl select-none transition-all flex-shrink-0 cursor-pointer ${
                    isCompleted
                      ? "bg-gradient-to-b from-emerald-400 to-teal-500 border-b-6 border-emerald-700 text-white ring-4 ring-emerald-300/40"
                      : isUnlocked
                      ? `bg-gradient-to-b ${node.colorClass} border-b-6 border-indigo-700 ring-4 ring-amber-300/60 animate-bounce`
                      : "bg-slate-300 border-b-4 border-slate-400 text-slate-400"
                  }`}
                >
                  {isUnlocked ? node.emoji : <Lock size={22} className="text-slate-500" />}
                </motion.button>
              </div>
            </React.Fragment>
          );
        })}
        </div>

        {/* Milestone Treasure Chest at bottom of map (Chunky Wooden & Gold Card) */}
        <div className="mt-14 p-8 sm:p-10 rounded-[2.5rem] bg-white text-slate-900 border-4 border-amber-300 shadow-2xl text-center space-y-4 relative overflow-hidden">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-b from-amber-400 to-yellow-400 flex items-center justify-center text-5xl shadow-xl shadow-amber-500/30 border-4 border-white animate-bounce">
            🎁
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">Odyssey Grand Treasure Chest</h3>
          <p className="text-xs sm:text-base text-slate-600 font-bold max-w-md mx-auto">
            Collect 15 Golden Stars across your adventures to crack open this prize chest with bonus gems and XP boost!
          </p>

          <button
            onClick={handleOpenChest}
            disabled={gamification.starsCount < 15 || openedChest}
            className={`px-8 py-3.5 rounded-2xl font-black text-sm border-b-4 transition-all shadow-xl inline-flex items-center gap-2 cursor-pointer ${
              openedChest
                ? "bg-emerald-600 border-emerald-800 text-white"
                : gamification.starsCount >= 15
                ? "bg-gradient-to-b from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-amber-950 border-orange-700 active:translate-y-1"
                : "bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Gift size={18} />
            <span>{openedChest ? "Chest Claimed! (+120 XP, +25 Gems)" : "Open Odyssey Treasure Chest"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
