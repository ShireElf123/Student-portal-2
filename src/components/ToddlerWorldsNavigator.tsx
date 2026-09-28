import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Star,
  ChevronLeft,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Compass,
  Trophy,
  Heart,
  Lock,
  Unlock,
  MapPin,
  Flame,
  Award,
  BookOpen,
} from "lucide-react";
import {
  ALL_TODDLER_WORLDS,
  ToddlerWorld,
  ToddlerArea,
  ToddlerActivity,
  ToddlerMission,
} from "../data/toddler/toddlerWorldsArchitecture";
import {
  STORY_ADVENTURES,
  StoryAdventure,
  StoryAdventureStep,
} from "../data/toddler/toddlerWorldsData";
import {
  getToddlerProgress,
  recordActivityCompletion,
  recordMissionCompletion,
  subscribeToddlerProgress,
  getWorldProgressStats,
  getAreaProgressStats,
  isAreaUnlocked,
  ToddlerWorldProgressState,
} from "../data/toddler/toddlerProgressManager";
import {
  generateCountingScenario,
  generateSortingChallenge,
  DynamicCountingScenario,
  DynamicSortingChallenge,
} from "../data/toddler/toddlerReplayEngine";
import { soundEffects } from "../utils/soundEffects";
import { speakText, stopSpeaking } from "../utils/speechUtils";
import { awardXP, triggerCelebrationConfetti } from "../utils/gamification";
import { ToddlerColorLab } from "./ToddlerColorLab";
import { ToddlerMusicPiano } from "./ToddlerMusicPiano";

interface ToddlerWorldsNavigatorProps {
  onAddStar: (count: number) => void;
  starsCount: number;
  initialWorldId?: string | null;
  onOpenPictureBooks?: () => void;
  onOpenGames?: () => void;
}

interface SecretZoneDef {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  starsRequired: number;
  bgGradient: string;
  rewardXP: number;
  discoveryDescription: string;
}

const SECRET_ZONES: SecretZoneDef[] = [
  {
    id: "zone-dino-cave",
    title: "Dino Excavation Cave",
    subtitle: "Uncover glowing fossils and ancient golden dino eggs",
    emoji: "🦕",
    starsRequired: 10,
    bgGradient: "from-amber-600 via-orange-600 to-yellow-600",
    rewardXP: 60,
    discoveryDescription: "You stepped into the torch-lit cavern and brushed away sand to find a Golden Triceratops Horn!",
  },
  {
    id: "zone-starlight-observatory",
    title: "Starlight Sky Observatory",
    subtitle: "Map cosmic constellations with the giant brass telescope",
    emoji: "🔭",
    starsRequired: 20,
    bgGradient: "from-indigo-700 via-purple-700 to-pink-700",
    rewardXP: 80,
    discoveryDescription: "You aligned the telescope mirrors and discovered the smiling Little Bear constellation shining brightly!",
  },
  {
    id: "zone-coral-cavern",
    title: "Coral Reef Secret Cavern",
    subtitle: "Dive beneath the waves to find glowing pearls",
    emoji: "🪸",
    starsRequired: 30,
    bgGradient: "from-teal-600 via-emerald-600 to-cyan-600",
    rewardXP: 100,
    discoveryDescription: "Deep among bioluminescent sea anemones, you opened a giant rainbow clam and discovered the Royal Pearl!",
  },
];

export function ToddlerWorldsNavigator({
  onAddStar,
  starsCount,
  initialWorldId,
  onOpenPictureBooks,
  onOpenGames,
}: ToddlerWorldsNavigatorProps) {
  // Navigation hierarchy state
  const [selectedWorldId, setSelectedWorldId] = useState<string | null>(initialWorldId || null);
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [activeActivity, setActiveActivity] = useState<ToddlerActivity | null>(null);
  const [activeMission, setActiveMission] = useState<ToddlerMission | null>(null);
  const [missionStepIdx, setMissionStepIdx] = useState<number>(0);
  const [activeSecretZone, setActiveSecretZone] = useState<SecretZoneDef | null>(null);

  // Persistent world progression state
  const [progress, setProgress] = useState<ToddlerWorldProgressState>(() => getToddlerProgress());

  // Activity execution states
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [unlockedNotice, setUnlockedNotice] = useState<string[]>([]);

  // Integrated Engine states: Story
  const [activeStory, setActiveStory] = useState<StoryAdventure | null>(null);
  const [storyStepIndex, setStoryStepIndex] = useState<number>(0);
  const [storyCompleted, setStoryCompleted] = useState<boolean>(false);
  const [storySelectedOption, setStorySelectedOption] = useState<string | null>(null);

  // Integrated Engine states: Dynamic Replay
  const [dynamicCounting, setDynamicCounting] = useState<DynamicCountingScenario | null>(null);
  const [countingAnswered, setCountingAnswered] = useState<boolean>(false);
  const [tappedCountIndices, setTappedCountIndices] = useState<number[]>([]);
  const [dynamicSorting, setDynamicSorting] = useState<DynamicSortingChallenge | null>(null);
  const [sortedItems, setSortedItems] = useState<Record<string, "A" | "B">>({});

  // Subscribe to progress changes
  useEffect(() => {
    return subscribeToddlerProgress((updated) => {
      setProgress(updated);
    });
  }, []);

  // Sync initialWorldId if changed from parent
  useEffect(() => {
    if (initialWorldId) {
      setSelectedWorldId(initialWorldId);
      setSelectedAreaId(null);
      setActiveActivity(null);
    }
  }, [initialWorldId]);

  // Clean audio on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const selectedWorld = ALL_TODDLER_WORLDS.find((w) => w.id === selectedWorldId) || null;
  const selectedArea = selectedWorld?.areas.find((a) => a.id === selectedAreaId) || null;

  // Speak activity prompt automatically after view renders
  useEffect(() => {
    if (!activeActivity) return;

    const timer = setTimeout(() => {
      if (activeActivity.storyAdventureId) {
        const story = STORY_ADVENTURES.find((s) => s.id === activeActivity.storyAdventureId);
        if (story) {
          speakText(`${story.title}. ${story.steps[0].spokenNarration}`, { pitch: 1.15 });
          return;
        }
      }

      if (activeActivity.type === "counting" && dynamicCounting) {
        speakText(dynamicCounting.spokenPrompt, { pitch: 1.15 });
        return;
      }

      if (activeActivity.type === "sorting" && dynamicSorting) {
        speakText(dynamicSorting.spokenPrompt, { pitch: 1.15 });
        return;
      }

      if (activeActivity.type === "color-lab") {
        speakText("Welcome to the Color Lab! Blend primary color droplets into the bubbling cauldron to make magical new colors!", { pitch: 1.15 });
        return;
      }

      if (activeActivity.type === "piano-melody") {
        speakText("Welcome to the Rainbow Piano! Tap the colorful keys to play sweet musical notes and nursery songs!", { pitch: 1.15 });
        return;
      }

      // Sound Detective (e.g. The Grassy Pasture Sound), Clue Detective & all other activity types
      const textToSpeak =
        activeActivity.spokenPrompt ||
        activeActivity.cluePrompt ||
        `${activeActivity.title}! Let's solve this puzzle together!`;
      speakText(textToSpeak, { pitch: 1.15 });
    }, 320);

    return () => clearTimeout(timer);
  }, [activeActivity?.id, dynamicCounting?.id, dynamicSorting?.id]);

  // ------------------ NAVIGATION HANDLERS ------------------
  const handleSelectWorld = (world: ToddlerWorld) => {
    soundEffects.playPop();
    stopSpeaking();
    setSelectedWorldId(world.id);
    setSelectedAreaId(null);
    setActiveActivity(null);
    setActiveMission(null);
    setActiveStory(null);
    setDynamicCounting(null);
    setDynamicSorting(null);
    setTappedCountIndices([]);
    setSortedItems({});
    setCountingAnswered(false);

    speakText(`Welcome to ${world.title}! ${world.description}`, { pitch: 1.15 });
  };

  const handleSelectArea = (area: ToddlerArea) => {
    if (!isAreaUnlocked(area, progress)) {
      soundEffects.playGentleBoing();
      speakText(`This area is locked! ${area.unlockRequirementText || "Earn more stars to unlock it!"}`, { pitch: 1.15 });
      return;
    }

    soundEffects.playPop();
    stopSpeaking();
    setSelectedAreaId(area.id);
    setActiveActivity(null);
    setActiveMission(null);
    setActiveStory(null);
    setDynamicCounting(null);
    setDynamicSorting(null);
    setTappedCountIndices([]);
    setSortedItems({});
    setCountingAnswered(false);

    speakText(`${area.title}! ${area.tagline}. Let's explore together!`, { pitch: 1.15 });
  };

  const handleBackToWorldsMap = () => {
    soundEffects.playPop();
    stopSpeaking();
    setSelectedWorldId(null);
    setSelectedAreaId(null);
    setActiveActivity(null);
    setActiveMission(null);
    setActiveStory(null);
    setDynamicCounting(null);
    setDynamicSorting(null);
    setTappedCountIndices([]);
    setSortedItems({});
    setCountingAnswered(false);
  };

  const handleBackToWorldHub = () => {
    soundEffects.playPop();
    stopSpeaking();
    setSelectedAreaId(null);
    setActiveActivity(null);
    setActiveMission(null);
    setActiveStory(null);
    setDynamicCounting(null);
    setDynamicSorting(null);
    setTappedCountIndices([]);
    setSortedItems({});
    setCountingAnswered(false);
  };

  const handleBackToAreaHub = () => {
    soundEffects.playPop();
    stopSpeaking();
    setActiveActivity(null);
    setActiveStory(null);
    setDynamicCounting(null);
    setDynamicSorting(null);
    setTappedCountIndices([]);
    setSortedItems({});
    setCountingAnswered(false);
    setShowCelebration(false);
    setSelectedOptionId(null);
    setIsAnswered(false);
  };

  // ------------------ LAUNCH ACTIVITY ------------------
  const handleStartActivity = (activity: ToddlerActivity) => {
    soundEffects.playStarSparkle();
    stopSpeaking();
    setSelectedOptionId(null);
    setIsAnswered(false);
    setShowCelebration(false);
    setUnlockedNotice([]);
    setTappedCountIndices([]);
    setCountingAnswered(false);
    setSortedItems({});

    // Check if activity uses specialized engines
    if (activity.storyAdventureId) {
      const story = STORY_ADVENTURES.find((s) => s.id === activity.storyAdventureId);
      if (story) {
        setActiveStory(story);
        setStoryStepIndex(0);
        setStoryCompleted(false);
        setStorySelectedOption(null);
      }
    } else {
      setActiveStory(null);
    }

    if (activity.type === "counting") {
      const countScenario = generateCountingScenario(activity.difficulty);
      setDynamicCounting(countScenario);
    } else {
      setDynamicCounting(null);
    }

    if (activity.type === "sorting") {
      const sortScenario = generateSortingChallenge();
      setDynamicSorting(sortScenario);
    } else {
      setDynamicSorting(null);
    }

    // Set active activity which triggers our reliable speech useEffect
    setActiveActivity(activity);
  };

  // ------------------ MULTI-STEP MISSION FLOW ------------------
  const handleStartMission = (mission: ToddlerMission) => {
    soundEffects.playStarSparkle();
    stopSpeaking();
    setActiveMission(mission);
    setMissionStepIdx(0);

    const firstStep = mission.steps[0];
    const targetActivity = selectedArea?.activities.find((a) => a.id === firstStep.activityId);

    if (targetActivity) {
      handleStartActivity(targetActivity);
      speakText(`Mission started: ${mission.title}! Step 1: ${firstStep.title}. ${targetActivity.spokenPrompt}`, {
        pitch: 1.15,
      });
    }
  };

  // ------------------ ANSWER SELECTION ------------------
  const handleSelectOption = (optionId: string) => {
    if (isAnswered || !activeActivity) return;
    setSelectedOptionId(optionId);

    const chosen = activeActivity.options.find((o) => o.id === optionId);
    if (!chosen) return;

    if (chosen.isCorrect) {
      setIsAnswered(true);
      soundEffects.playSuccessChime();
      soundEffects.playStarSparkle();

      // Complete activity in persistent progress manager
      const { isFirstCompletion, newlyUnlockedAreas } = recordActivityCompletion(
        activeActivity.worldId,
        activeActivity.areaId,
        activeActivity.id,
        activeActivity.rewardStars
      );

      onAddStar(activeActivity.rewardStars);
      awardXP(activeActivity.rewardXP, `Explored ${activeActivity.title}`);

      if (newlyUnlockedAreas.length > 0) {
        setUnlockedNotice(newlyUnlockedAreas);
      }

      const victoryFeedback = `Hooray! ${chosen.label}! ${chosen.feedback}`;
      speakText(victoryFeedback, {
        pitch: 1.2,
        onEnd: () => {
          setTimeout(() => {
            setShowCelebration(true);
            soundEffects.playFanfare();
            triggerCelebrationConfetti();
          }, 600);
        },
      });
    } else {
      soundEffects.playGentleBoing();
      speakText(`That is ${chosen.label}! ${chosen.feedback} Let's try again!`, { pitch: 1.15 });
      setTimeout(() => setSelectedOptionId(null), 1200);
    }
  };

  // ------------------ DYNAMIC COUNTING HANDLERS ------------------
  const handleTapCountObject = (idx: number) => {
    if (tappedCountIndices.includes(idx)) return;
    const next = [...tappedCountIndices, idx];
    setTappedCountIndices(next);
    soundEffects.playPop();
    speakText(`${next.length}!`, { pitch: 1.25 });
  };

  const handleSelectCountAnswer = (chosenNumber: number) => {
    if (countingAnswered || !dynamicCounting || !activeActivity) return;

    if (chosenNumber === dynamicCounting.targetCount) {
      setCountingAnswered(true);
      soundEffects.playSuccessChime();
      soundEffects.playStarSparkle();

      const { newlyUnlockedAreas } = recordActivityCompletion(
        activeActivity.worldId,
        activeActivity.areaId,
        activeActivity.id,
        activeActivity.rewardStars
      );

      onAddStar(activeActivity.rewardStars);
      awardXP(activeActivity.rewardXP, `Counted ${dynamicCounting.itemName}`);

      if (newlyUnlockedAreas.length > 0) {
        setUnlockedNotice(newlyUnlockedAreas);
      }

      const victoryFeedback = `Hooray! That's right, ${chosenNumber} ${dynamicCounting.itemName}! ${dynamicCounting.soundEffect}`;
      speakText(victoryFeedback, {
        pitch: 1.2,
        onEnd: () => {
          setTimeout(() => {
            setShowCelebration(true);
            soundEffects.playFanfare();
            triggerCelebrationConfetti();
          }, 600);
        },
      });
    } else {
      soundEffects.playGentleBoing();
      const countSequence = Array.from({ length: dynamicCounting.targetCount }, (_, i) => i + 1).join(", ");
      speakText(`That is ${chosenNumber}! Let's count them together: ${countSequence}! Try tapping the right number!`, { pitch: 1.15 });
    }
  };

  const handleRegenerateCounting = () => {
    if (!activeActivity) return;
    const countScenario = generateCountingScenario(activeActivity.difficulty);
    setDynamicCounting(countScenario);
    setCountingAnswered(false);
    setTappedCountIndices([]);
    speakText(countScenario.spokenPrompt, { pitch: 1.15 });
  };

  // ------------------ DYNAMIC SORTING HANDLERS ------------------
  const handleSortItem = (item: DynamicSortingChallenge["items"][0], targetCategory: "A" | "B") => {
    if (!dynamicSorting || !activeActivity || sortedItems[item.id]) return;

    if (targetCategory === item.correctCategory) {
      soundEffects.playSuccessChime();
      const nextSorted = { ...sortedItems, [item.id]: targetCategory };
      setSortedItems(nextSorted);

      speakText(`Yes! ${item.soundFeedback}`, { pitch: 1.2 });

      if (Object.keys(nextSorted).length === dynamicSorting.items.length) {
        soundEffects.playStarSparkle();
        const { newlyUnlockedAreas } = recordActivityCompletion(
          activeActivity.worldId,
          activeActivity.areaId,
          activeActivity.id,
          activeActivity.rewardStars
        );

        onAddStar(activeActivity.rewardStars);
        awardXP(activeActivity.rewardXP, `Sorted ${dynamicSorting.title}`);

        if (newlyUnlockedAreas.length > 0) {
          setUnlockedNotice(newlyUnlockedAreas);
        }

        setTimeout(() => {
          setShowCelebration(true);
          soundEffects.playFanfare();
          triggerCelebrationConfetti();
          speakText(`Hooray! You sorted every friend into their home! You are a brilliant sorting star!`, { pitch: 1.2 });
        }, 900);
      }
    } else {
      soundEffects.playGentleBoing();
      const correctLabel = item.correctCategory === "A" ? dynamicSorting.categoryA.label : dynamicSorting.categoryB.label;
      speakText(`Oops! ${item.label} belongs in ${correctLabel}! Let's try putting it there!`, { pitch: 1.15 });
    }
  };

  const handleRegenerateSorting = () => {
    const sortScenario = generateSortingChallenge();
    setDynamicSorting(sortScenario);
    setSortedItems({});
    setCountingAnswered(false);
    speakText(sortScenario.spokenPrompt, { pitch: 1.15 });
  };

  // Handle continuing to next mission step or returning
  const handleContinueAfterCelebration = () => {
    setShowCelebration(false);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setCountingAnswered(false);
    setTappedCountIndices([]);

    if (activeMission && missionStepIdx < activeMission.steps.length - 1) {
      const nextStepIdx = missionStepIdx + 1;
      setMissionStepIdx(nextStepIdx);
      const nextStep = activeMission.steps[nextStepIdx];
      const nextAct = selectedArea?.activities.find((a) => a.id === nextStep.activityId);

      if (nextAct) {
        handleStartActivity(nextAct);
        speakText(`Next Mission Step: ${nextStep.title}! ${nextAct.spokenPrompt}`, { pitch: 1.15 });
        return;
      }
    } else if (activeMission && missionStepIdx === activeMission.steps.length - 1) {
      // Completed full mission!
      recordMissionCompletion(
        activeMission.worldId,
        activeMission.areaId,
        activeMission.id,
        activeMission.badgeEmoji,
        activeMission.badgeTitle,
        activeMission.rewardStars
      );
      onAddStar(activeMission.rewardStars);
      awardXP(activeMission.rewardXP, `Completed Mission ${activeMission.title}`);
      soundEffects.playFanfare();
      triggerCelebrationConfetti();
      speakText(`Congratulations! You completed the entire mission: ${activeMission.title}! You earned the ${activeMission.badgeTitle} badge!`, { pitch: 1.2 });
      setActiveMission(null);
      handleBackToAreaHub();
      return;
    }

    handleBackToAreaHub();
  };

  // ------------------ STORY ADVENTURE HANDLERS ------------------
  const handleSelectStoryOption = (step: StoryAdventureStep, optionId: string) => {
    if (storySelectedOption || !activeStory) return;
    const option = step.options.find((o) => o.id === optionId);
    if (!option) return;

    setStorySelectedOption(optionId);
    soundEffects.playSuccessChime();
    soundEffects.playStarSparkle();
    onAddStar(1);

    speakText(option.feedback, {
      pitch: 1.2,
      onEnd: () => {
        setTimeout(() => {
          if (storyStepIndex < activeStory.steps.length - 1) {
            const nextIdx = storyStepIndex + 1;
            setStoryStepIndex(nextIdx);
            setStorySelectedOption(null);
            speakText(activeStory.steps[nextIdx].spokenNarration, { pitch: 1.15 });
          } else {
            setStoryCompleted(true);
            soundEffects.playFanfare();
            triggerCelebrationConfetti();
            onAddStar(3);
            awardXP(50, "Completed story tale");

            if (activeActivity) {
              recordActivityCompletion(activeActivity.worldId, activeActivity.areaId, activeActivity.id, 3);
            }

            speakText("Hooray! You finished the entire story adventure! You are a brilliant story champion!", {
              pitch: 1.2,
            });
          }
        }, 800);
      },
    });
  };

  // ==========================================================================
  // VIEW LEVEL 4: ACTIVITY RUNNER / GAMEPLAY
  // ==========================================================================
  if (activeActivity) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackToAreaHub}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer transition-all border border-white/10"
          >
            <ChevronLeft size={16} /> Back to {selectedArea?.title || "Area"}
          </button>

          <div className="flex items-center gap-2">
            {activeMission && (
              <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold flex items-center gap-1">
                <span>🎯</span> Mission Step {missionStepIdx + 1} of {activeMission.steps.length}
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold flex items-center gap-1">
              <Star size={12} className="text-amber-400 fill-amber-400" /> +{activeActivity.rewardStars} Stars
            </span>
          </div>
        </div>

        {/* 1. COLOR LAB ENGINE INTEGRATION */}
        {activeActivity.type === "color-lab" && (
          <div className="p-6 rounded-3xl bg-[#131427] border-2 border-pink-400/30 shadow-2xl text-center space-y-4">
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-pink-400/20 text-pink-300 text-xs font-bold border border-pink-400/30">
                🎨 Creative Color Magic
              </span>
              <h3 className="text-2xl font-black text-white">{activeActivity.title}</h3>
              <p className="text-white/70 text-xs sm:text-sm">{activeActivity.cluePrompt}</p>
            </div>
            <ToddlerColorLab
              onAddStar={() => {
                recordActivityCompletion(activeActivity.worldId, activeActivity.areaId, activeActivity.id, activeActivity.rewardStars);
                onAddStar(activeActivity.rewardStars);
                soundEffects.playFanfare();
                triggerCelebrationConfetti();
                setShowCelebration(true);
              }}
            />
          </div>
        )}

        {/* 2. PIANO ENGINE INTEGRATION */}
        {activeActivity.type === "piano-melody" && (
          <div className="p-6 rounded-3xl bg-[#131427] border-2 border-purple-400/30 shadow-2xl text-center space-y-4">
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-purple-400/20 text-purple-300 text-xs font-bold border border-purple-400/30">
                🎹 Music Garden Piano
              </span>
              <h3 className="text-2xl font-black text-white">{activeActivity.title}</h3>
              <p className="text-white/70 text-xs sm:text-sm">{activeActivity.cluePrompt}</p>
            </div>
            <ToddlerMusicPiano
              onAddStar={() => {
                recordActivityCompletion(activeActivity.worldId, activeActivity.areaId, activeActivity.id, activeActivity.rewardStars);
                onAddStar(activeActivity.rewardStars);
              }}
            />
          </div>
        )}

        {/* 3. STORY ADVENTURE ENGINE */}
        {activeStory && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-white/60 font-bold px-2">
              <span>Step {storyStepIndex + 1} of {activeStory.steps.length}</span>
              <div className="flex gap-1.5">
                {activeStory.steps.map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-1.5 rounded-full transition-all ${
                      i <= storyStepIndex ? "bg-amber-400" : "bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>

            {!storyCompleted ? (
              <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-b ${activeStory.steps[storyStepIndex].bgGradient} shadow-2xl space-y-5 border-2 border-white/20`}>
                <div className="text-center space-y-2">
                  <div className="text-5xl">{activeStory.steps[storyStepIndex].illustration}</div>
                  <h4 className="text-xl sm:text-2xl font-black">
                    {activeStory.steps[storyStepIndex].sceneTitle}
                  </h4>
                  <p className="text-sm font-semibold leading-relaxed max-w-lg mx-auto">
                    {activeStory.steps[storyStepIndex].storyText}
                  </p>
                </div>

                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl border border-white/30 text-center space-y-3">
                  <div className="text-xs font-black uppercase tracking-wider text-amber-900">
                    Your Choice / Mini Challenge:
                  </div>
                  <div className="text-base font-black">
                    {activeStory.steps[storyStepIndex].question}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto pt-2">
                    {activeStory.steps[storyStepIndex].options.map((opt) => (
                      <button
                        key={opt.id}
                        disabled={storySelectedOption !== null}
                        onClick={() => handleSelectStoryOption(activeStory.steps[storyStepIndex], opt.id)}
                        className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-2 font-black text-xs sm:text-sm cursor-pointer transition-all shadow-md active:scale-95 ${
                          storySelectedOption === opt.id
                            ? "bg-emerald-500 border-emerald-300 text-white scale-105 shadow-emerald-500/40"
                            : "bg-white/90 hover:bg-white text-slate-800 border-white/60 hover:border-amber-400"
                        }`}
                      >
                        <span className="text-2xl">{opt.emoji}</span>
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-gradient-to-b from-amber-500/20 via-[#14142b] to-[#14142b] border-2 border-amber-400/40 text-center space-y-5">
                <div className="text-6xl animate-bounce">🌟</div>
                <h3 className="text-3xl font-black text-white">Story Completed!</h3>
                <p className="text-amber-200 text-sm max-w-md mx-auto">
                  You helped the characters through every scene, solved the challenges, and earned 3 Golden Stars!
                </p>
                <button
                  onClick={handleBackToAreaHub}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs cursor-pointer shadow-lg hover:from-amber-400"
                >
                  Return to {selectedArea?.title} 🗺️
                </button>
              </div>
            )}
          </div>
        )}

        {/* 4. DYNAMIC COUNTING REPLAY ENGINE */}
        {dynamicCounting && (
          <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-b ${dynamicCounting.bgGradient} border-2 border-white/20 shadow-2xl text-center space-y-6`}>
            {/* Header & Learning Objective */}
            <div className="flex items-center justify-between text-xs text-white/70 font-bold border-b border-white/10 pb-3">
              <span className="flex items-center gap-1.5">
                <Compass size={14} className="text-amber-300" /> {activeActivity.learningObjective}
              </span>
              <button
                onClick={handleRegenerateCounting}
                className="px-2.5 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
              >
                <RotateCcw size={12} /> New Group 🎲
              </button>
            </div>

            {/* Prompt Box */}
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider inline-block border border-amber-400/30">
                🔢 Counting Quest
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {dynamicCounting.question}
              </h3>
              <p className="text-white/80 text-xs sm:text-sm font-medium">
                Tap each item with your finger to count out loud!
              </p>
              <div>
                <button
                  onClick={() => {
                    soundEffects.playPop();
                    speakText(dynamicCounting.spokenPrompt, { pitch: 1.15 });
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-xs cursor-pointer transition-all active:scale-95"
                >
                  <Volume2 size={14} /> Listen to Question Again 🔊
                </button>
              </div>
            </div>

            {/* Tap-to-Count Visual Item Arena */}
            <div className="p-6 rounded-3xl bg-black/20 backdrop-blur-sm border border-white/20 max-w-xl mx-auto">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 min-h-[120px]">
                {Array.from({ length: dynamicCounting.targetCount }, (_, idx) => {
                  const isTapped = tappedCountIndices.includes(idx);
                  const tappedOrder = tappedCountIndices.indexOf(idx) + 1;

                  return (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleTapCountObject(idx)}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center text-4xl sm:text-5xl cursor-pointer transition-all border-2 select-none shadow-md ${
                        isTapped
                          ? "bg-amber-400/30 border-amber-300 ring-4 ring-amber-400/50 scale-105"
                          : "bg-white/10 hover:bg-white/20 border-white/20"
                      }`}
                    >
                      <span>{dynamicCounting.itemEmoji}</span>
                      {isTapped && (
                        <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                          {tappedOrder}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-3 text-xs text-white/70 font-semibold">
                {tappedCountIndices.length === 0 ? (
                  <span>👉 Tap an item above to start counting!</span>
                ) : (
                  <span>
                    Counted: <strong className="text-amber-300 font-black">{tappedCountIndices.length}</strong> of{" "}
                    <strong className="text-white">{dynamicCounting.targetCount}</strong> items!
                  </span>
                )}
              </div>
            </div>

            {/* Numerical Answer Options */}
            <div className="space-y-3">
              <div className="text-sm font-black text-white/90">
                How many {dynamicCounting.itemName} did you count?
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 max-w-md mx-auto">
                {dynamicCounting.distractorCounts.map((num) => {
                  const isCorrectAnswer = num === dynamicCounting.targetCount;
                  const isSelected = countingAnswered && isCorrectAnswer;

                  return (
                    <button
                      key={num}
                      disabled={countingAnswered}
                      onClick={() => handleSelectCountAnswer(num)}
                      className={`w-24 sm:w-28 py-4 sm:py-5 rounded-2xl sm:rounded-3xl border-3 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all shadow-lg active:scale-95 ${
                        isSelected
                          ? "bg-emerald-500 border-emerald-300 text-white scale-105 shadow-emerald-500/50"
                          : "bg-white/90 hover:bg-white text-slate-900 border-white/70 hover:border-amber-400"
                      }`}
                    >
                      <span className="text-3xl sm:text-4xl font-black">{num}</span>
                      <span className="text-[11px] font-bold text-slate-600 flex items-center gap-0.5">
                        <span>{dynamicCounting.itemEmoji}</span> {dynamicCounting.itemName.split(" ")[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 5. DYNAMIC SORTING REPLAY ENGINE */}
        {dynamicSorting && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#121327] border-2 border-white/20 shadow-2xl text-center space-y-6">
            {/* Header & Objective */}
            <div className="flex items-center justify-between text-xs text-white/70 font-bold border-b border-white/10 pb-3">
              <span className="flex items-center gap-1.5">
                <Compass size={14} className="text-cyan-400" /> {activeActivity.learningObjective}
              </span>
              <button
                onClick={handleRegenerateSorting}
                className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
              >
                <RotateCcw size={12} /> New Challenge 🎲
              </button>
            </div>

            {/* Instruction Banner */}
            <div className="space-y-1.5">
              <span className="px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 text-xs font-black uppercase tracking-wider inline-block border border-cyan-400/30">
                🧩 Smart Sorting Challenge
              </span>
              <h3 className="text-2xl font-black text-white">{dynamicSorting.title}</h3>
              <p className="text-white/80 text-xs sm:text-sm font-medium">{dynamicSorting.instruction}</p>
              <div>
                <button
                  onClick={() => {
                    soundEffects.playPop();
                    speakText(dynamicSorting.spokenPrompt, { pitch: 1.15 });
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/30 font-bold text-xs cursor-pointer transition-all active:scale-95"
                >
                  <Volume2 size={14} /> Listen to Instructions Again 🔊
                </button>
              </div>
            </div>

            {/* Two Category Bins */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {/* Category A Drop Zone */}
              <div className={`p-4 rounded-3xl border-2 transition-all flex flex-col justify-between min-h-[140px] shadow-lg ${dynamicSorting.categoryA.dropZoneColor}`}>
                <div className="flex items-center justify-between border-b border-white/20 pb-2 mb-2">
                  <div className="flex items-center gap-2 font-black text-sm sm:text-base">
                    <span className="text-2xl">{dynamicSorting.categoryA.emoji}</span>
                    <span>{dynamicSorting.categoryA.label}</span>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/20">
                    {Object.values(sortedItems).filter((v) => v === "A").length} Friends
                  </span>
                </div>

                {/* Placed Items List */}
                <div className="flex flex-wrap gap-2 items-center justify-center p-2 min-h-[50px] bg-black/20 rounded-2xl border border-white/10">
                  {dynamicSorting.items
                    .filter((item) => sortedItems[item.id] === "A")
                    .map((item) => (
                      <span
                        key={item.id}
                        className="px-2.5 py-1 rounded-xl bg-white/20 text-white font-bold text-xs flex items-center gap-1 animate-scaleIn"
                      >
                        <span>{item.emoji}</span>
                        <span>{item.label}</span>
                        <CheckCircle2 size={12} className="text-emerald-300" />
                      </span>
                    ))}
                  {Object.values(sortedItems).filter((v) => v === "A").length === 0 && (
                    <span className="text-xs opacity-50 italic">Put matching friends here</span>
                  )}
                </div>
              </div>

              {/* Category B Drop Zone */}
              <div className={`p-4 rounded-3xl border-2 transition-all flex flex-col justify-between min-h-[140px] shadow-lg ${dynamicSorting.categoryB.dropZoneColor}`}>
                <div className="flex items-center justify-between border-b border-white/20 pb-2 mb-2">
                  <div className="flex items-center gap-2 font-black text-sm sm:text-base">
                    <span className="text-2xl">{dynamicSorting.categoryB.emoji}</span>
                    <span>{dynamicSorting.categoryB.label}</span>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/20">
                    {Object.values(sortedItems).filter((v) => v === "B").length} Friends
                  </span>
                </div>

                {/* Placed Items List */}
                <div className="flex flex-wrap gap-2 items-center justify-center p-2 min-h-[50px] bg-black/20 rounded-2xl border border-white/10">
                  {dynamicSorting.items
                    .filter((item) => sortedItems[item.id] === "B")
                    .map((item) => (
                      <span
                        key={item.id}
                        className="px-2.5 py-1 rounded-xl bg-white/20 text-white font-bold text-xs flex items-center gap-1 animate-scaleIn"
                      >
                        <span>{item.emoji}</span>
                        <span>{item.label}</span>
                        <CheckCircle2 size={12} className="text-emerald-300" />
                      </span>
                    ))}
                  {Object.values(sortedItems).filter((v) => v === "B").length === 0 && (
                    <span className="text-xs opacity-50 italic">Put matching friends here</span>
                  )}
                </div>
              </div>
            </div>

            {/* Active Item to Sort */}
            {(() => {
              const unsortedItems = dynamicSorting.items.filter((item) => !sortedItems[item.id]);
              const currentItem = unsortedItems[0];

              if (!currentItem) {
                return (
                  <div className="p-6 rounded-3xl bg-emerald-500/20 border-2 border-emerald-400/40 text-emerald-200 text-center space-y-2 max-w-md mx-auto">
                    <div className="text-4xl">🎉</div>
                    <div className="text-lg font-black text-white">All Friends Sorted!</div>
                    <p className="text-xs text-emerald-200">
                      You placed every single friend into the right home!
                    </p>
                  </div>
                );
              }

              return (
                <div className="p-6 rounded-3xl bg-white/5 border border-white/15 max-w-md mx-auto space-y-4">
                  <div className="text-xs font-black uppercase text-amber-300 tracking-wider">
                    Who needs a home?
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <span className="text-5xl p-3 rounded-2xl bg-white/10 border border-white/20 shadow-inner animate-bounce">
                      {currentItem.emoji}
                    </span>
                    <div className="text-left">
                      <div className="text-xl font-black text-white">{currentItem.label}</div>
                      <div className="text-xs text-white/60">Where does this friend go?</div>
                    </div>
                  </div>

                  {/* Two Action Buttons to Assign Target */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => handleSortItem(currentItem, "A")}
                      className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs cursor-pointer shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 border border-emerald-400/40"
                    >
                      <span>{dynamicSorting.categoryA.emoji}</span>
                      <span>Put in {dynamicSorting.categoryA.label}</span>
                    </button>
                    <button
                      onClick={() => handleSortItem(currentItem, "B")}
                      className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs cursor-pointer shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 border border-cyan-400/40"
                    >
                      <span>{dynamicSorting.categoryB.emoji}</span>
                      <span>Put in {dynamicSorting.categoryB.label}</span>
                    </button>
                  </div>

                  {/* Queue indicator */}
                  <div className="text-[11px] text-white/40 pt-1">
                    {unsortedItems.length} friends waiting to be sorted
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 6. DEFAULT CLUE-DETECTIVE / SOUND-DETECTIVE ACTIVITY (NO ANSWER SPOILERS!) */}
        {!dynamicCounting && !dynamicSorting && activeActivity.type !== "color-lab" && activeActivity.type !== "piano-melody" && !activeStory && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#121327] border-2 border-white/20 shadow-2xl text-center space-y-6">
            {/* Header / Learning Goal */}
            <div className="flex items-center justify-between text-xs text-white/60 font-bold border-b border-white/10 pb-3">
              <span className="flex items-center gap-1.5">
                <Compass size={14} className="text-sky-400" /> {activeActivity.learningObjective}
              </span>
              <span className="text-amber-300 flex items-center gap-1">
                <Star size={12} fill="currentColor" /> {activeActivity.difficulty === 1 ? "Beginner" : activeActivity.difficulty === 2 ? "Intermediate" : "Advanced"}
              </span>
            </div>

            {/* Environmental Clue Box - Crucially: NON-REVEALING ICON */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.03] border border-white/15 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 flex items-center justify-center text-4xl shadow-inner animate-pulse">
                {activeActivity.clueIcon}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {activeActivity.title}
              </h3>
              <p className="text-white/80 text-sm sm:text-base max-w-lg mx-auto font-medium">
                {activeActivity.cluePrompt}
              </p>

              {/* Re-listen Prompt Audio Button */}
              <button
                onClick={() => {
                  soundEffects.playPop();
                  speakText(activeActivity.spokenPrompt, { pitch: 1.15 });
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/30 font-bold text-xs cursor-pointer transition-all active:scale-95"
              >
                <Volume2 size={14} /> Listen to Clue Again 🔊
              </button>
            </div>

            {/* Answer Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
              {activeActivity.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md active:scale-95 ${
                      isSelected && opt.isCorrect
                        ? "bg-emerald-500 border-emerald-300 text-white scale-105 shadow-emerald-500/40"
                        : isSelected && !opt.isCorrect
                        ? "bg-rose-500 border-rose-300 text-white animate-shake"
                        : "bg-white/10 border-white/15 hover:bg-white/20 text-white hover:border-white/30"
                    }`}
                  >
                    <span className="text-4xl filter drop-shadow">{opt.emoji}</span>
                    <span className="font-black text-xs text-center leading-tight">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-white/40">
              💡 Observe the clues and tap your answer to earn stars!
            </div>
          </div>
        )}

        {/* VICTORY / UNLOCK CELEBRATION MODAL */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <div className="max-w-md w-full p-8 rounded-3xl bg-gradient-to-b from-[#1b1c36] to-[#121327] border-2 border-amber-400/50 shadow-2xl text-center space-y-5">
                <div className="text-6xl animate-bounce">🌟</div>
                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider">
                    Discovery Mastered!
                  </span>
                  <h3 className="text-2xl font-black text-white">{activeActivity.title}</h3>
                </div>

                <div className="flex items-center justify-center gap-4 py-2">
                  <div className="px-4 py-2 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 font-black text-sm flex items-center gap-1.5">
                    <Star size={16} fill="currentColor" /> +{activeActivity.rewardStars} Stars
                  </div>
                  <div className="px-4 py-2 rounded-2xl bg-purple-400/20 border border-purple-400/40 text-purple-300 font-black text-sm flex items-center gap-1.5">
                    <Sparkles size={16} /> +{activeActivity.rewardXP} XP
                  </div>
                </div>

                {/* Newly Unlocked Area Alert */}
                {unlockedNotice.length > 0 && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/40 text-emerald-200 text-xs space-y-1">
                    <div className="font-black text-sm flex items-center justify-center gap-1 text-emerald-300">
                      <Unlock size={16} /> NEW AREA UNLOCKED!
                    </div>
                    <div>Your progress unlocked new learning territory in this world!</div>
                  </div>
                )}

                <div className="pt-2 flex flex-col gap-2">
                  {(dynamicCounting || dynamicSorting) && (!activeMission || missionStepIdx >= activeMission.steps.length - 1) && (
                    <button
                      onClick={() => {
                        setShowCelebration(false);
                        if (dynamicCounting) {
                          handleRegenerateCounting();
                        } else if (dynamicSorting) {
                          handleRegenerateSorting();
                        }
                      }}
                      className="w-full py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs cursor-pointer border border-white/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw size={14} /> Play Again with New Items 🎲
                    </button>
                  )}
                  <button
                    onClick={handleContinueAfterCelebration}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black text-sm cursor-pointer shadow-lg transition-all"
                  >
                    {activeMission && missionStepIdx < activeMission.steps.length - 1
                      ? "Next Mission Step ➡️"
                      : "Continue Journey 🗺️"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ==========================================================================
  // VIEW LEVEL 3: INSIDE AN AREA (AREA HUB)
  // ==========================================================================
  if (selectedArea && selectedWorld) {
    const areaStats = getAreaProgressStats(selectedArea, progress);

    return (
      <div className="space-y-6">
        {/* Top Header & Return to World Button */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleBackToWorldHub}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-xs cursor-pointer transition-all border border-white/10"
          >
            <ChevronLeft size={16} /> Back to {selectedWorld.title} Map
          </button>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-2xl bg-white/10 text-white font-bold text-xs border border-white/10">
              {areaStats.completedCount}/{areaStats.totalCount} Discoveries Made
            </span>
          </div>
        </div>

        {/* Environmental Backdrop Card */}
        <div className={`p-6 sm:p-8 rounded-[2.5rem] bg-gradient-to-br ${selectedArea.environment.bgGradient} shadow-xl relative overflow-hidden border-2 border-white/30`}>
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-4xl p-2.5 rounded-2xl bg-white/40 backdrop-blur-sm shadow-sm">
                  {selectedArea.emoji}
                </span>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black">{selectedArea.title}</h2>
                  <p className="text-xs sm:text-sm font-semibold opacity-90">{selectedArea.tagline}</p>
                </div>
              </div>
              <p className="text-xs italic opacity-80 max-w-lg mt-1">
                "{selectedArea.environment.ambientDescription}"
              </p>
            </div>

            {/* Visual Scenery Badge */}
            <div className="flex gap-2 p-3 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/40 shadow-sm text-2xl">
              {selectedArea.environment.sceneryEmojis.map((sc, i) => (
                <span key={i} className="hover:scale-125 transition-transform">{sc}</span>
              ))}
            </div>
          </div>
        </div>

        {/* MULTI-STEP MISSION SECTION (IF PRESENT) */}
        {selectedArea.missions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>🎯</span> Area Expeditions & Missions
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {selectedArea.missions.map((mission) => {
                const isCompleted = progress.completedMissions[mission.id];
                return (
                  <div
                    key={mission.id}
                    className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-[#1a1b35] to-[#1a1b35] border-2 border-amber-400/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-lg shrink-0">
                        {mission.badgeEmoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-black text-white">{mission.title}</h4>
                          {isCompleted && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-black">
                              ✓ Completed
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-amber-200/80 mt-0.5">{mission.description}</p>
                        <div className="text-[11px] text-white/60 font-bold mt-2 flex items-center gap-2">
                          <span>{mission.steps.length} Steps</span>
                          <span>•</span>
                          <span className="text-amber-300">Reward: {mission.badgeTitle} Badge + {mission.rewardStars} Stars ⭐</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartMission(mission)}
                      className={`px-5 py-3 rounded-2xl font-black text-xs cursor-pointer shadow-md transition-all shrink-0 ${
                        isCompleted
                          ? "bg-white/10 hover:bg-white/20 text-white"
                          : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-white"
                      }`}
                    >
                      {isCompleted ? "Replay Mission 🔄" : "Start Mission 🚀"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ACTIVITIES GRID */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>🧭</span> Activities & Discoveries ({selectedArea.activities.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {selectedArea.activities.map((activity) => {
              const record = progress.completedActivities[activity.id];
              const isDone = !!record;

              return (
                <motion.div
                  key={activity.id}
                  whileHover={{ y: -3, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStartActivity(activity)}
                  className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between group shadow-lg ${
                    isDone
                      ? "bg-white/[0.07] border-emerald-400/40 hover:border-emerald-400/70 text-white"
                      : "bg-white/[0.04] border-white/15 hover:border-amber-400/50 text-white"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl p-2.5 rounded-2xl bg-white/10 border border-white/10 group-hover:scale-110 transition-transform">
                        {activity.clueIcon}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {isDone ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black flex items-center gap-1">
                            <CheckCircle2 size={12} /> Mastered
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black flex items-center gap-1">
                            <Star size={10} fill="currentColor" /> New
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-base font-black group-hover:text-amber-300 transition-colors">
                        {activity.title}
                      </h4>
                      <p className="text-xs text-white/60 line-clamp-2 mt-1">
                        {activity.learningObjective}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-amber-300">
                    <span>+{activity.rewardStars} Stars</span>
                    <span className="flex items-center gap-1 text-white/80 group-hover:text-amber-300">
                      {isDone ? "Play Again" : "Explore"} <ArrowRight size={14} />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // VIEW LEVEL 2: INSIDE A WORLD (AREAS MAP)
  // ==========================================================================
  if (selectedWorld) {
    const worldStats = getWorldProgressStats(selectedWorld, progress);

    return (
      <div className="space-y-6">
        {/* Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleBackToWorldsMap}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-xs cursor-pointer transition-all border border-white/10"
          >
            <ChevronLeft size={16} /> World Map
          </button>

          <div className="flex items-center gap-3">
            <div className="text-xs text-white/60 font-bold hidden sm:block">
              {worldStats.completedActivities} of {worldStats.totalActivities} Discoveries
            </div>
            <div className="w-32 h-2.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${worldStats.percentage}%` }}
              />
            </div>
            <span className="text-xs font-black text-amber-300">{worldStats.percentage}%</span>
          </div>
        </div>

        {/* World Header Banner */}
        <div className={`p-6 sm:p-8 rounded-[2.5rem] bg-gradient-to-r ${selectedWorld.gradient} text-white shadow-xl space-y-4 border-2 border-white/30`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl p-3 rounded-2xl bg-white/20 backdrop-blur-sm shadow-md">
                {selectedWorld.emoji}
              </span>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black">{selectedWorld.title}</h2>
                <div className="text-xs sm:text-sm font-bold opacity-90">{selectedWorld.tagline}</div>
              </div>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/20 text-xs font-black flex items-center gap-1.5">
              <Star size={14} className="text-amber-300 fill-amber-300" />
              <span>{worldStats.starsEarned} Stars Earned Here</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm font-medium opacity-90 max-w-2xl leading-relaxed">
            {selectedWorld.description}
          </p>

          {/* Learning Goals Chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {selectedWorld.learningGoals.map((goal, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-bold text-white flex items-center gap-1 border border-white/20"
              >
                <span>✓</span> {goal}
              </span>
            ))}
          </div>
        </div>

        {/* AREAS IN THIS WORLD */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span>🗺️</span> Areas to Explore ({selectedWorld.areas.length})
            </h3>
            <p className="text-xs text-white/60">
              Each area contains unique learning activities, missions, and rewards. Progress through areas to unlock new territory!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {selectedWorld.areas.map((area) => {
              const unlocked = isAreaUnlocked(area, progress);
              const stats = getAreaProgressStats(area, progress);

              return (
                <motion.div
                  key={area.id}
                  whileHover={unlocked ? { y: -4, scale: 1.01 } : {}}
                  whileTap={unlocked ? { scale: 0.98 } : {}}
                  onClick={() => handleSelectArea(area)}
                  className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex flex-col justify-between shadow-xl ${
                    unlocked
                      ? "bg-[#14152a] border-white/20 hover:border-amber-400/50 text-white"
                      : "bg-white/[0.02] border-white/10 opacity-70 text-white/50 cursor-not-allowed"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl p-2 rounded-2xl bg-white/10 border border-white/10">
                          {area.emoji}
                        </span>
                        <div>
                          <h4 className="text-lg font-black text-white">{area.title}</h4>
                          <div className="text-xs text-amber-300 font-bold">{area.tagline}</div>
                        </div>
                      </div>

                      {unlocked ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black flex items-center gap-1">
                          <Unlock size={12} /> Open
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 text-[10px] font-black flex items-center gap-1">
                          <Lock size={12} /> Locked
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-white/60 line-clamp-2">
                      {area.environment.ambientDescription}
                    </p>
                  </div>

                  {/* Footer status / Unlock requirement */}
                  <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold">
                    {unlocked ? (
                      <>
                        <span className="text-white/60">
                          {stats.completedCount} / {stats.totalCount} Discoveries
                        </span>
                        <span className="text-amber-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Enter Area <ArrowRight size={14} />
                        </span>
                      </>
                    ) : (
                      <span className="text-rose-300/80 text-[11px] flex items-center gap-1">
                        <Lock size={12} /> {area.unlockRequirementText || "Earn more stars to unlock"}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // VIEW LEVEL 1: WORLDS OVERVIEW MAP
  // ==========================================================================
  return (
    <div className="space-y-6">
      {/* Worlds Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-[2.5rem] bg-gradient-to-r from-indigo-900/60 via-purple-900/50 to-indigo-900/60 border-2 border-indigo-400/30 backdrop-blur-md shadow-xl">
        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black uppercase tracking-wider inline-flex items-center gap-1">
            <span>🗺️</span> Toddler Wonderland Worlds
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Choose Your Learning World!
          </h2>
          <p className="text-xs sm:text-sm text-white/70 max-w-xl">
            Each world is an explorable environment containing multiple areas, missions, and rewards that remember your progress!
          </p>
        </div>

        {/* Free Play Reminder */}
        {onOpenGames && (
          <button
            onClick={onOpenGames}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer border border-white/10 transition-all flex items-center gap-2 shrink-0"
          >
            <span>🎮</span> Want quick games? Go to Free Play
          </button>
        )}
      </div>

      {/* SECRET MILESTONE ZONES (Dino Excavation, Starlight Observatory, Coral Cavern) */}
      <div className="p-6 rounded-[2.25rem] bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-indigo-950/40 border-2 border-amber-400/40 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl p-2 rounded-xl bg-amber-500/20 text-amber-300">✨</span>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>Secret Explorer Milestone Zones</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {starsCount} ⭐ Collected
                </span>
              </h3>
              <p className="text-xs text-white/70">
                Collect Golden Stars across the worlds to unlock these hidden expedition sanctuaries!
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SECRET_ZONES.map((zone) => {
            const isUnlocked = starsCount >= zone.starsRequired;
            return (
              <motion.div
                key={zone.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (!isUnlocked) {
                    soundEffects.playGentleBoing();
                    speakText(
                      `The ${zone.title} is locked! You need ${zone.starsRequired} stars. Keep exploring to earn ${zone.starsRequired - starsCount} more stars!`,
                      { pitch: 1.15 }
                    );
                  } else {
                    setActiveSecretZone(zone);
                    soundEffects.playFanfare();
                    triggerCelebrationConfetti();
                    awardXP(zone.rewardXP);
                    speakText(`Welcome to ${zone.title}! ${zone.discoveryDescription}`, {
                      pitch: 1.2,
                    });
                  }
                }}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isUnlocked
                    ? `bg-gradient-to-br ${zone.bgGradient} border-white/40 text-white shadow-lg`
                    : "bg-white/[0.04] border-white/10 text-white/50"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                      {zone.emoji}
                    </span>
                    {isUnlocked ? (
                      <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black flex items-center gap-1">
                        <Unlock size={11} /> Unlocked
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-black/40 text-white/70 text-[10px] font-bold flex items-center gap-1">
                        <Lock size={11} /> {zone.starsRequired} ⭐
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">{zone.title}</h4>
                    <p className="text-[11px] opacity-80 mt-0.5 line-clamp-2">
                      {zone.subtitle}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-white/20 text-[11px] font-bold flex items-center justify-between">
                  <span>+{zone.rewardXP} XP Discovery</span>
                  <span>{isUnlocked ? "Enter Room ➡️" : `${Math.max(0, zone.starsRequired - starsCount)} ⭐ left`}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 6 WORLDS MAP GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {ALL_TODDLER_WORLDS.map((world) => {
          const stats = getWorldProgressStats(world, progress);

          return (
            <motion.div
              key={world.id}
              whileHover={{ y: -5, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectWorld(world)}
              className="p-6 rounded-[2.25rem] bg-[#14152a] border-2 border-white/15 hover:border-amber-400/50 transition-all cursor-pointer flex flex-col justify-between group shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${world.gradient} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    {world.emoji}
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-amber-300 font-bold text-xs border border-white/10">
                    <Star size={12} fill="currentColor" /> {stats.starsEarned} Stars
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                    {world.title}
                  </h3>
                  <div className="text-xs text-amber-300 font-bold mt-0.5">{world.tagline}</div>
                  <p className="text-xs text-white/60 mt-2 line-clamp-2 leading-relaxed">
                    {world.description}
                  </p>
                </div>
              </div>

              {/* Progress & Explore CTA */}
              <div className="mt-5 pt-3 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-white/60">
                  <span>{stats.unlockedAreasCount} / {stats.totalAreasCount} Areas Unlocked</span>
                  <span className="text-amber-300">{stats.percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${stats.percentage}%` }}
                  />
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-black text-amber-300 group-hover:text-amber-200">
                  <span>{world.areas.length} Distinct Areas</span>
                  <span className="flex items-center gap-1">
                    Enter World <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Secret Zone Discovery Modal */}
      {activeSecretZone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#131427] border-2 border-amber-400/60 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl text-center space-y-5 animate-in zoom-in-95">
            <div
              className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${activeSecretZone.bgGradient} flex items-center justify-center text-5xl mx-auto shadow-2xl border-2 border-white/40`}
            >
              {activeSecretZone.emoji}
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black uppercase">
                ⭐ Milestone Secret Zone!
              </span>
              <h3 className="text-2xl font-black text-white">{activeSecretZone.title}</h3>
              <p className="text-xs text-amber-200/90 font-semibold">{activeSecretZone.subtitle}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
              "{activeSecretZone.discoveryDescription}"
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-black text-amber-300">
              +{activeSecretZone.rewardXP} Explorer XP Awarded! 🏆
            </div>

            <button
              onClick={() => setActiveSecretZone(null)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-xl transition-all cursor-pointer"
            >
              Continue Exploring Worlds 🗺️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
