import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  Star,
  ChevronLeft,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
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
import { payDailyMissionIfMatches } from "../data/toddler/toddlerDailyAdventure";
import {
  countingLevelForPlace,
  generateCountingScenario,
  generateSortingChallenge,
  DynamicCountingScenario,
  DynamicSortingChallenge,
} from "../data/toddler/toddlerReplayEngine";
import { soundEffects } from "../utils/soundEffects";
import { speakText, stopSpeaking } from "../utils/speechUtils";
import { awardXP, triggerCelebrationConfetti } from "../utils/gamification";
import { recordLearningEvent, getActiveLearnerId } from "../utils/learnerBrain";
import { resolveSkillForActivity } from "../data/activitySkillRegistry";
import { mixTargetFromActivity, ToddlerColorLab } from "./ToddlerColorLab";
import { ToddlerMusicPiano } from "./ToddlerMusicPiano";
import { ToddlerMemoryGame } from "./ToddlerMemoryGame";
import { ToddlerBalloonSky } from "./ToddlerBalloonSky";
import { ToddlerAnimalSafari } from "./ToddlerAnimalSafari";
import { ToddlerRhymeGame } from "./ToddlerRhymeGame";
import { ToddlerBubblePopGame } from "./ToddlerBubblePopGame";
import { ToddlerK1Studio } from "./ToddlerK1Studio";
import { ToddlerLetterTrace } from "./ToddlerLetterTrace";
import { ToddlerLetterLane } from "./ToddlerLetterLane";
import { ToddlerOpenPlay } from "./ToddlerOpenPlay";
import { ToddlerLandRooms } from "./ToddlerLandRooms";
import { SECRET_ZONES, ToddlerSecretZonePlay, secretZoneIsFound } from "./ToddlerSecretZones";
import type { K1StudioGameId } from "../data/toddler/k1StudioGames";
import { ToddlerWorldTrail } from "./ToddlerWorldTrail";
import { ATLAS_CONTINENTS, TOY_ACTIVITY_TYPES } from "../data/toddler/toddlerWorldAtlasLayout";
import { getWorldPlayTheme } from "../data/toddler/toddlerWorldPlayThemes";
import { quizTapHint } from "../data/toddler/activityQuality";
import { SECRET_COVER, WORLD_COVER } from "../data/toddler/toddlerWorldArt";

interface ToddlerWorldsNavigatorProps {
  onAddStar: (count: number) => void;
  starsCount: number;
  initialWorldId?: string | null;
  onOpenPictureBooks?: () => void;
  onOpenGames?: () => void;
  onOpenFocus?: () => void;
}

function countingLevelForActivity(activity: ToddlerActivity) {
  const world = ALL_TODDLER_WORLDS.find((item) => item.id === activity.worldId);
  const areaIndex = world?.areas.findIndex((area) => area.id === activity.areaId) ?? 0;
  return countingLevelForPlace(areaIndex, activity.difficulty);
}

function worldRouteParts(route?: string | null) {
  if (!route) return { worldId: null as string | null, areaId: null as string | null };
  if (route.startsWith("world:")) {
    const [, worldId, areaId] = route.split(":");
    return { worldId: worldId || null, areaId: areaId || null };
  }
  return { worldId: route, areaId: null };
}

export function ToddlerWorldsNavigator({
  onAddStar,
  starsCount,
  initialWorldId,
  onOpenPictureBooks,
  onOpenGames,
  onOpenFocus,
}: ToddlerWorldsNavigatorProps) {
  const openingRoute = worldRouteParts(initialWorldId);
  // Navigation hierarchy state
  const [selectedWorldId, setSelectedWorldId] = useState<string | null>(openingRoute.worldId);
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(openingRoute.areaId);
  const [activeActivity, setActiveActivity] = useState<ToddlerActivity | null>(null);
  const [activeMission, setActiveMission] = useState<ToddlerMission | null>(null);
  const [missionStepIdx, setMissionStepIdx] = useState<number>(0);
  const [activeSecretZone, setActiveSecretZone] = useState<(typeof SECRET_ZONES)[number] | null>(null);

  // Persistent world progression state
  const [progress, setProgress] = useState<ToddlerWorldProgressState>(() => getToddlerProgress());
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const toyCreditedRef = useRef<string | null>(null);
  const [tapsMuted, setTapsMuted] = useState(() => soundEffects.isMuted());
  const [letterLaneOpen, setLetterLaneOpen] = useState(false);
  const toggleTapSounds = () => {
    const next = !soundEffects.isMuted();
    soundEffects.setMuted(next);
    setTapsMuted(next);
  };

  const completeWorldToy = (activity: ToddlerActivity) => {
    if (toyCreditedRef.current === activity.id) return;
    toyCreditedRef.current = activity.id;
    recordActivityCompletion(activity.worldId, activity.areaId, activity.id, activity.rewardStars);
    onAddStar(activity.rewardStars);
    try {
      payDailyMissionIfMatches("worlds", activity.worldId);
    } catch {
      // ignore
    }
    if (
      activity.type === "color-lab" ||
      activity.type === "letter-trace" ||
      activity.type === "balloon-sky" ||
      activity.type === "animal-safari" ||
      activity.type === "bubble-pop" ||
      activity.type === "piano-melody"
    ) {
      setStayPlayDone(true);
      return;
    }
    setShowCelebration(true);
  };

  /** Finite toys auto-roll after a beat. Endless / mix labs stay. Quizzes wait for a tap. */
  const AUTO_TRAIL_TYPES = new Set([
    "land-play",
    "open-play",
    "memory-match",
    "rhyme-garden",
    "k1-studio",
  ]);

  // Activity execution states
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [stayPlayDone, setStayPlayDone] = useState(false);
  const [unlockedNotice, setUnlockedNotice] = useState<string[]>([]);

  // A correct answer (and a story choice) reveals its celebration once the
  // spoken feedback ends. Speech is best-effort: a muted voice, a stalled
  // utterance or a superseded line never reports an end, so each reveal is
  // also armed on a timer. Without this the activity stayed on screen with its
  // answer cards disabled — the child had to leave and re-enter the activity.
  const advanceTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const advancePendingRef = useRef(false);

  const clearAdvanceTimers = () => {
    advanceTimersRef.current.forEach((timer) => clearTimeout(timer));
    advanceTimersRef.current = [];
  };

  /** Speaks `feedback`, then runs `onSpokenEnd` — always exactly once. */
  const speakThenRun = (feedback: string, pauseMs: number, onSpokenEnd: () => void) => {
    advancePendingRef.current = true;
    clearAdvanceTimers();

    const run = () => {
      if (!advancePendingRef.current) return;
      advancePendingRef.current = false;
      clearAdvanceTimers();
      onSpokenEnd();
    };

    speakText(feedback, {
      pitch: 1.2,
      onEnd: () => {
        if (!advancePendingRef.current) return;
        clearAdvanceTimers();
        advanceTimersRef.current.push(setTimeout(run, pauseMs));
      },
    });

    advanceTimersRef.current.push(
      setTimeout(run, Math.max(7000, Math.ceil(feedback.length / 10) * 1000 + 2500))
    );
  };

  useEffect(() => clearAdvanceTimers, []);

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

  // Sync a world choice or a full registry route from the parent. Full routes
  // select the actual activity and initialize its specialized counting/sorting state.
  useEffect(() => {
    if (!initialWorldId) return;
    if (initialWorldId.startsWith("world:")) {
      const [, worldId, areaId, activityId] = initialWorldId.split(":");
      const targetWorld = ALL_TODDLER_WORLDS.find((world) => world.id === worldId);
      const targetArea = targetWorld?.areas.find((area) => area.id === areaId);
      const targetActivity = targetArea?.activities.find((activity) => activity.id === activityId);
      if (!targetWorld || !targetArea || !targetActivity) {
        console.error(`Cannot launch unresolved toddler world route: ${initialWorldId}`);
        return;
      }
      setSelectedWorldId(worldId);
      setActiveMission(null);
      if (!isAreaUnlocked(targetArea, progressRef.current)) {
        setSelectedAreaId(null);
        setActiveActivity(null);
        speakText("Play one game in the last place first, then this door opens!", { pitch: 1.15 });
        return;
      }
      setSelectedAreaId(areaId);
      handleStartActivity(targetActivity);
      return;
    }

    setSelectedWorldId(initialWorldId);
    setSelectedAreaId(null);
    setActiveActivity(null);
    setActiveMission(null);
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
        return;
      }

      // Safari owns its closed voice kit (station welcome + bios + mouth-calls).
      if (activeActivity.type === "animal-safari") {
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
      speakText("Play one game in the last place first, then this door opens!", { pitch: 1.15 });
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
    // Leaving the activity cancels any pending celebration reveal.
    advancePendingRef.current = false;
    clearAdvanceTimers();
    setActiveActivity(null);
    setActiveStory(null);
    setDynamicCounting(null);
    setDynamicSorting(null);
    setTappedCountIndices([]);
    setSortedItems({});
    setCountingAnswered(false);
    setShowCelebration(false);
    setStayPlayDone(false);
    setSelectedOptionId(null);
    setIsAnswered(false);
  };

  // ------------------ LAUNCH ACTIVITY ------------------
  const handleStartActivity = (activity: ToddlerActivity) => {
    soundEffects.playStarSparkle();
    stopSpeaking();
    toyCreditedRef.current = null;
    advancePendingRef.current = false;
    clearAdvanceTimers();
    setSelectedOptionId(null);
    setIsAnswered(false);
    setShowCelebration(false);
    setStayPlayDone(false);
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

    const playTheme = getWorldPlayTheme(activity.worldId, activity.areaId);

    if (activity.type === "counting") {
      const countScenario = generateCountingScenario(countingLevelForActivity(activity), playTheme.counting);
      setDynamicCounting(countScenario);
    } else {
      setDynamicCounting(null);
    }

    if (activity.type === "sorting") {
      const sortScenario = generateSortingChallenge(playTheme.sorting);
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
    const targetActivity =
      selectedArea?.activities.find((a) => a.id === firstStep.activityId) ||
      selectedWorld?.areas.flatMap((area) => area.activities).find((a) => a.id === firstStep.activityId);

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
      speakThenRun(victoryFeedback, 600, () => {
        setShowCelebration(true);
        soundEffects.playFanfare();
        triggerCelebrationConfetti();
      });
    } else {
      soundEffects.playGentleBoing();
      const resolved = resolveSkillForActivity(activeActivity.id);
      if (resolved.skillId) {
        try {
          recordLearningEvent({
            learnerId: getActiveLearnerId(),
            activityId: activeActivity.id,
            experienceId: "toddler-worlds-navigator",
            contentId: `${activeActivity.id}:${optionId}`,
            eventType: "question_answered",
            activityType: "world-activity",
            activityTitle: `${activeActivity.title}: Incorrect Choice`,
            skillId: resolved.skillId,
            domain: resolved.domain,
            gradeBand: "toddler",
            result: "struggle",
            score: 0,
            difficulty: "easy",
            attempts: 1,
            hintsUsed: 0,
            metadata: { selectedOptionId: optionId },
          });
        } catch (error) {
          console.error("Failed to record toddler-world response:", error);
        }
      }
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
      speakThenRun(victoryFeedback, 600, () => {
        setShowCelebration(true);
        soundEffects.playFanfare();
        triggerCelebrationConfetti();
      });
    } else {
      soundEffects.playGentleBoing();
      const countSequence = Array.from({ length: dynamicCounting.targetCount }, (_, i) => i + 1).join(", ");
      speakText(`That is ${chosenNumber}! Let's count them together: ${countSequence}! Try tapping the right number!`, { pitch: 1.15 });
    }
  };

  const handleRegenerateCounting = () => {
    if (!activeActivity) return;
    const countScenario = generateCountingScenario(
      countingLevelForActivity(activeActivity),
      getWorldPlayTheme(activeActivity.worldId, activeActivity.areaId).counting,
    );
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
    if (!activeActivity) return;
    const sortScenario = generateSortingChallenge(
      getWorldPlayTheme(activeActivity.worldId, activeActivity.areaId).sorting,
    );
    setDynamicSorting(sortScenario);
    setSortedItems({});
    setCountingAnswered(false);
    speakText(sortScenario.spokenPrompt, { pitch: 1.15 });
  };

  const nextTrailActivity = (): ToddlerActivity | null => {
    if (!selectedWorld || !selectedArea || !activeActivity) return null;
    const index = selectedArea.activities.findIndex((item) => item.id === activeActivity.id);
    if (index >= 0 && index < selectedArea.activities.length - 1) {
      return selectedArea.activities[index + 1];
    }
    const areaIndex = selectedWorld.areas.findIndex((area) => area.id === selectedArea.id);
    for (let i = areaIndex + 1; i < selectedWorld.areas.length; i += 1) {
      const area = selectedWorld.areas[i];
      if (!isAreaUnlocked(area, progress)) continue;
      if (area.activities[0]) return area.activities[0];
    }
    return null;
  };

  const continueAfterRef = useRef<() => void>(() => {});

  // Handle continuing to next mission step or the next trail stop
  const handleContinueAfterCelebration = () => {
    setShowCelebration(false);
    setStayPlayDone(false);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setCountingAnswered(false);
    setTappedCountIndices([]);

    if (activeMission && missionStepIdx < activeMission.steps.length - 1) {
      const nextStepIdx = missionStepIdx + 1;
      setMissionStepIdx(nextStepIdx);
      const nextStep = activeMission.steps[nextStepIdx];
      const nextAct =
        selectedArea?.activities.find((a) => a.id === nextStep.activityId) ||
        selectedWorld?.areas.flatMap((area) => area.activities).find((a) => a.id === nextStep.activityId);

      if (nextAct) {
        handleStartActivity(nextAct);
        speakText(`Next Mission Step: ${nextStep.title}! ${nextAct.spokenPrompt}`, { pitch: 1.15 });
        return;
      }
    } else if (activeMission && missionStepIdx === activeMission.steps.length - 1) {
      // Completed full mission!
      const { isFirstCompletion } = recordMissionCompletion(
        activeMission.worldId,
        activeMission.areaId,
        activeMission.id,
        activeMission.badgeEmoji,
        activeMission.badgeTitle,
        activeMission.rewardStars
      );
      if (isFirstCompletion) {
        onAddStar(activeMission.rewardStars);
        awardXP(activeMission.rewardXP, `Completed Mission ${activeMission.title}`);
      }
      soundEffects.playFanfare();
      triggerCelebrationConfetti();
      speakText(`Congratulations! You completed the entire mission: ${activeMission.title}! You earned the ${activeMission.badgeTitle} badge!`, { pitch: 1.2 });
      setActiveMission(null);
      handleBackToAreaHub();
      return;
    }

    const next = nextTrailActivity();
    if (next) {
      if (next.areaId !== selectedAreaId) setSelectedAreaId(next.areaId);
      handleStartActivity(next);
      return;
    }

    handleBackToAreaHub();
  };
  continueAfterRef.current = handleContinueAfterCelebration;

  useEffect(() => {
    if (!showCelebration || !activeActivity) return;
    if (activeMission) return;
    if (!AUTO_TRAIL_TYPES.has(activeActivity.type)) return;
    if (!nextTrailActivity()) return;
    const timer = window.setTimeout(() => continueAfterRef.current(), 3800);
    return () => window.clearTimeout(timer);
  }, [showCelebration, activeActivity?.id, activeMission, selectedArea, selectedWorld, progress]);


  // ------------------ STORY ADVENTURE HANDLERS ------------------
  const handleSelectStoryOption = (step: StoryAdventureStep, optionId: string) => {
    if (storySelectedOption || !activeStory) return;
    const option = step.options.find((o) => o.id === optionId);
    if (!option) return;

    setStorySelectedOption(optionId);
    soundEffects.playSuccessChime();
    soundEffects.playStarSparkle();
    onAddStar(1);

    speakThenRun(option.feedback, 800, () => {
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
    });
  };

  // ==========================================================================
  // VIEW LEVEL 4: ACTIVITY RUNNER / GAMEPLAY
  // ==========================================================================
  if (activeActivity) {
    const playTheme = getWorldPlayTheme(activeActivity.worldId, activeActivity.areaId);
    const drawingPlay = activeActivity.type === "color-lab" || activeActivity.type === "letter-trace";
    const trailNext = nextTrailActivity();
    return (
      <div className={`${drawingPlay ? "max-w-5xl" : "max-w-3xl"} mx-auto space-y-4`}>
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackToAreaHub}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm min-h-12 cursor-pointer transition-all border border-white/10"
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
            <button
              type="button"
              onClick={toggleTapSounds}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10"
              title={tapsMuted ? "Tap sounds are off" : "Quiet tap sounds"}
            >
              {tapsMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
        </div>

        {/* 1. COLOR LAB ENGINE INTEGRATION */}
        {activeActivity.type === "color-lab" && (
          <div className="p-3 sm:p-4 rounded-3xl bg-[#131427] border-2 border-pink-400/30 shadow-2xl space-y-3">
            <h3 className="text-xl sm:text-2xl font-black text-white text-center">{activeActivity.title}</h3>
            <ToddlerColorLab
              mixFlavor={playTheme.mix}
              targetColor={mixTargetFromActivity(activeActivity)}
              spokenPrompt={activeActivity.spokenPrompt}
              missionSurface="off"
              onAddStar={() => completeWorldToy(activeActivity)}
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
              songIds={playTheme.songIds}
              missionSurface="off"
              onAddStar={() => {
                completeWorldToy(activeActivity);
              }}
            />
          </div>
        )}

        {activeActivity.type === "memory-match" && (
          <div className="p-4 rounded-3xl bg-[#131427] border-2 border-emerald-400/30 shadow-2xl space-y-3">
            <h3 className="text-xl font-black text-white text-center">{activeActivity.title}</h3>
            <ToddlerMemoryGame
              pairs={playTheme.memory}
              onAddStar={(amount) => onAddStar(amount ?? 1)}
              onComplete={() => completeWorldToy(activeActivity)}
            />
          </div>
        )}
        {activeActivity.type === "balloon-sky" && (
          <div className="p-4 rounded-3xl bg-[#131427] border-2 border-sky-400/30 shadow-2xl space-y-3">
            <h3 className="text-xl font-black text-white text-center">{activeActivity.title}</h3>
            <ToddlerBalloonSky
              letters={playTheme.balloonLetters}
              onAddStar={(amount) => onAddStar(amount ?? 1)}
              onComplete={() => completeWorldToy(activeActivity)}
            />
          </div>
        )}
        {activeActivity.type === "animal-safari" && (
          <div className="p-4 rounded-3xl bg-[#131427] border-2 border-lime-400/30 shadow-2xl space-y-3">
            <h3 className="text-xl font-black text-white text-center">{activeActivity.title}</h3>
            <ToddlerAnimalSafari
              animals={playTheme.safari}
              sceneTitle={playTheme.safariTitle}
              exploreWelcome={activeActivity.spokenPrompt}
              missionSurface="off"
              onAddStar={(amount) => onAddStar(amount ?? 1)}
              onComplete={() => completeWorldToy(activeActivity)}
            />
          </div>
        )}
        {activeActivity.type === "rhyme-garden" && (
          <div className="p-4 rounded-3xl bg-[#131427] border-2 border-fuchsia-400/30 shadow-2xl space-y-3">
            <h3 className="text-xl font-black text-white text-center">{activeActivity.title}</h3>
            <ToddlerRhymeGame
              questions={playTheme.rhymes}
              missionSurface="off"
              onAddStar={(amount) => onAddStar(amount ?? 1)}
              onComplete={() => completeWorldToy(activeActivity)}
            />
          </div>
        )}
        {activeActivity.type === "bubble-pop" && (
          <div className="p-4 rounded-3xl bg-[#131427] border-2 border-cyan-400/30 shadow-2xl space-y-3">
            <h3 className="text-xl font-black text-white text-center">{activeActivity.title}</h3>
            <ToddlerBubblePopGame
              catalog={playTheme.bubbles}
              onAddStar={(amount) => onAddStar(amount ?? 1)}
              onComplete={() => completeWorldToy(activeActivity)}
            />
          </div>
        )}
        {activeActivity.type === "letter-trace" && (
          <div className="p-3 sm:p-4 rounded-3xl bg-[#131427] border-2 border-amber-400/30 shadow-2xl space-y-3">
            <h3 className="text-xl sm:text-2xl font-black text-white text-center">{activeActivity.title}</h3>
            <ToddlerLetterTrace
              key={activeActivity.id}
              catalog={playTheme.bubbles}
              prompt={`${activeActivity.title}. ${activeActivity.cluePrompt}`}
              onAddStar={() => completeWorldToy(activeActivity)}
            />
          </div>
        )}
        {activeActivity.type === "open-play" && activeActivity.openPlayId && (
          <div className="p-4 rounded-3xl bg-[#131427] border-2 border-orange-400/30 shadow-2xl space-y-3">
            <ToddlerOpenPlay
              playId={activeActivity.openPlayId}
              onAddStar={() => completeWorldToy(activeActivity)}
            />
          </div>
        )}
        {activeActivity.type === "land-play" && activeActivity.landPlayId && (
          <div className="p-2 sm:p-3 rounded-3xl bg-[#131427] border-2 border-lime-400/30 shadow-2xl">
            <ToddlerLandRooms
              playId={activeActivity.landPlayId}
              onAddStar={() => completeWorldToy(activeActivity)}
            />
          </div>
        )}
        {activeActivity.type === "k1-studio" && activeActivity.studioGameId && (
          <div className="p-4 rounded-3xl bg-[#131427] border-2 border-amber-400/30 shadow-2xl space-y-3">
            <h3 className="text-xl font-black text-white text-center">{activeActivity.title}</h3>
            <ToddlerK1Studio
              gameId={activeActivity.studioGameId as K1StudioGameId}
              onComplete={() => completeWorldToy(activeActivity)}
            />
          </div>
        )}
        {((activeActivity.type === "open-play" && !activeActivity.openPlayId) ||
          (activeActivity.type === "land-play" && !activeActivity.landPlayId) ||
          (activeActivity.type === "k1-studio" && !activeActivity.studioGameId)) && (
          <div className="rounded-[2rem] border-4 border-amber-400/40 bg-slate-950/70 p-6 text-center">
            <p className="text-xl font-black text-white">This toy is packing up.</p>
            <p className="mt-2 text-sm font-semibold text-white/80">Pick another Play tile on the trail.</p>
          </div>
        )}

        {stayPlayDone && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-amber-400/15 border border-amber-300/40 px-4 py-3">
            <p className="text-amber-200 font-black text-sm">Star! Keep drawing, or go on.</p>
            <button
              type="button"
              data-testid="trail-next"
              onClick={handleContinueAfterCelebration}
              className="min-h-12 rounded-xl bg-amber-400 px-5 py-2 text-sm font-black text-amber-950"
            >
              {trailNext ? `Next: ${trailNext.title}` : "Back to the trail"}
            </button>
          </div>
        )}

        {/* 3. STORY ADVENTURE ENGINE */}
        {activeStory && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-white/90 font-bold px-2">
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
                  <div className="text-6xl sm:text-7xl">{activeStory.steps[storyStepIndex].illustration}</div>
                  <h4 className="text-2xl sm:text-3xl font-black">
                    {activeStory.steps[storyStepIndex].sceneTitle}
                  </h4>
                  <p className="text-base sm:text-lg font-semibold leading-relaxed max-w-lg mx-auto">
                    {activeStory.steps[storyStepIndex].storyText}
                  </p>
                </div>

                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl border border-white/30 text-center space-y-3">
                  <div className="text-sm font-black uppercase tracking-wider text-amber-900">
                    Your turn
                  </div>
                  <div className="text-lg font-black">
                    {activeStory.steps[storyStepIndex].question}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto pt-2">
                    {activeStory.steps[storyStepIndex].options.map((opt) => (
                      <button
                        key={opt.id}
                        disabled={storySelectedOption !== null}
                        onClick={() => handleSelectStoryOption(activeStory.steps[storyStepIndex], opt.id)}
                        className={`min-h-14 p-4 rounded-2xl border-2 flex items-center justify-center gap-2 font-black text-sm sm:text-base cursor-pointer transition-all shadow-md active:scale-95 ${
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
                  type="button"
                  onClick={handleContinueAfterCelebration}
                  className="min-h-16 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-lg cursor-pointer shadow-lg hover:from-amber-400"
                >
                  {trailNext ? `Next: ${trailNext.clueIcon} ${trailNext.title}` : "Back to the trail"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 4. DYNAMIC COUNTING REPLAY ENGINE */}
        {dynamicCounting && (
          <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-b ${dynamicCounting.bgGradient} border-2 border-white/20 shadow-2xl text-center space-y-6`}>
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={handleRegenerateCounting}
                className="min-h-12 px-4 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm font-black flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw size={16} /> New friends
              </button>
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider inline-block border border-amber-400/30">
                🔢 Count {dynamicCounting.targetCount > 10 ? "11 to 20" : dynamicCounting.targetCount > 5 ? "6 to 10" : "1 to 5"}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {dynamicCounting.question}
              </h3>
              <p className="text-white text-base font-bold">
                Tap each one
              </p>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playPop();
                    speakText(dynamicCounting.spokenPrompt, { pitch: 1.15 });
                  }}
                  className="inline-flex min-h-14 items-center gap-2 px-6 py-3 rounded-full bg-white text-slate-900 font-black text-base cursor-pointer active:scale-95"
                >
                  <Volume2 size={18} /> Hear it again
                </button>
              </div>
            </div>

            {/* Tap-to-Count Visual Item Arena */}
            <div className="p-6 rounded-3xl bg-black/20 backdrop-blur-sm border border-white/20 max-w-xl mx-auto">
              <div className={`flex flex-wrap items-center justify-center min-h-[120px] ${dynamicCounting.targetCount > 10 ? "gap-2" : "gap-4 sm:gap-6"}`}>
                {Array.from({ length: dynamicCounting.targetCount }, (_, idx) => {
                  const isTapped = tappedCountIndices.includes(idx);
                  const tappedOrder = tappedCountIndices.indexOf(idx) + 1;
                  const compact = dynamicCounting.targetCount > 10;

                  return (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleTapCountObject(idx)}
                      className={`relative flex items-center justify-center cursor-pointer transition-all border-2 select-none shadow-md ${
                        compact
                          ? "w-11 h-11 rounded-xl text-2xl"
                          : "w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl text-4xl sm:text-5xl"
                      } ${
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
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={handleRegenerateSorting}
                className="min-h-12 px-4 rounded-full bg-white/15 hover:bg-white/25 text-white text-sm font-black flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw size={16} /> New friends
              </button>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-2xl sm:text-3xl font-black text-white">{dynamicSorting.title}</h3>
              <p className="text-white text-base font-bold">{dynamicSorting.instruction}</p>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playPop();
                    speakText(dynamicSorting.spokenPrompt, { pitch: 1.15 });
                  }}
                  className="inline-flex min-h-14 items-center gap-2 px-6 py-3 rounded-full bg-white text-slate-900 font-black text-base cursor-pointer active:scale-95"
                >
                  <Volume2 size={18} /> Hear it again
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
                    <span className="text-xs opacity-50 italic">Tap a home for this friend</span>
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
                    <span className="text-xs opacity-50 italic">Tap a home for this friend</span>
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
                      type="button"
                      onClick={() => handleSortItem(currentItem, "A")}
                      className="min-h-16 p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-base cursor-pointer shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 border border-emerald-400/40"
                    >
                      <span>{dynamicSorting.categoryA.emoji}</span>
                      <span>Put in {dynamicSorting.categoryA.label}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSortItem(currentItem, "B")}
                      className="min-h-16 p-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-base cursor-pointer shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 border border-cyan-400/40"
                    >
                      <span>{dynamicSorting.categoryB.emoji}</span>
                      <span>Put in {dynamicSorting.categoryB.label}</span>
                    </button>
                  </div>

                  {/* Queue indicator */}
                  <div className="text-sm text-white/85 pt-1">
                    {unsortedItems.length} friends waiting to be sorted
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 6. DEFAULT CLUE-DETECTIVE / SOUND-DETECTIVE ACTIVITY (NO ANSWER SPOILERS!) */}
        {!dynamicCounting &&
          !dynamicSorting &&
          !activeStory &&
          !TOY_ACTIVITY_TYPES.has(activeActivity.type) && (
          <div className={`relative overflow-hidden p-5 sm:p-8 rounded-[2rem] bg-gradient-to-b ${selectedArea?.environment.bgGradient ?? "from-sky-300 to-emerald-400"} border-4 border-white/40 shadow-2xl text-center space-y-5 min-h-[28rem]`}>
            <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-between px-6 text-3xl opacity-70" aria-hidden>
              {(selectedArea?.environment.sceneryEmojis ?? ["☁️", "☀️"]).slice(0, 4).map((emoji, index) => (
                <span key={`${emoji}-${index}`}>{emoji}</span>
              ))}
            </div>
            <div className="relative z-10 space-y-4">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.6rem] bg-white/80 text-5xl shadow-inner">
                {activeActivity.clueIcon}
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 drop-shadow-sm">
                {activeActivity.title}
              </h3>
              <p className="text-slate-800 text-base sm:text-lg max-w-lg mx-auto font-bold">
                {activeActivity.cluePrompt}
              </p>
              {activeActivity.type === "pattern-match" && (
                <p className="text-xs font-black uppercase tracking-wider text-slate-700">Pattern puzzle — look at the rhythm, then pick what comes next.</p>
              )}
              <button
                type="button"
                onClick={() => {
                  soundEffects.playPop();
                  speakText(activeActivity.spokenPrompt, { pitch: 1.15 });
                }}
                className="inline-flex min-h-14 items-center gap-2 px-6 py-3 rounded-full bg-white text-slate-900 font-black text-base shadow-lg cursor-pointer transition-all active:scale-95"
              >
                <Volume2 size={18} /> Hear it again
              </button>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl mx-auto">
                {activeActivity.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`min-h-[7rem] p-4 rounded-[1.6rem] border-4 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
                        isSelected && opt.isCorrect
                          ? "bg-emerald-400 border-emerald-200 text-white scale-105"
                          : isSelected && !opt.isCorrect
                          ? "bg-rose-400 border-rose-200 text-white animate-shake"
                          : "bg-white/90 border-white text-slate-900 hover:bg-white"
                      }`}
                    >
                      <span className="text-5xl filter drop-shadow">{opt.emoji}</span>
                      <span className="font-black text-sm text-center leading-tight">
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-slate-800/80 text-sm font-black">{quizTapHint(activeActivity.type)}</p>
            </div>
          </div>
        )}

        {/* VICTORY / UNLOCK CELEBRATION MODAL */}
        {showCelebration && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="max-w-md w-full p-8 rounded-3xl bg-gradient-to-b from-[#1b1c36] to-[#121327] border-2 border-amber-400/50 shadow-2xl text-center space-y-5">
                <div className="text-6xl animate-bounce">🌟</div>
                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider">
                    You did it!
                  </span>
                  <h3 className="text-2xl font-black text-white">{activeActivity.title}</h3>
                </div>

                <div className="flex items-center justify-center gap-4 py-2">
                  <div className="px-4 py-2 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 font-black text-sm flex items-center gap-1.5">
                    <Star size={16} fill="currentColor" /> +{activeActivity.rewardStars} Stars
                  </div>
                  {activeActivity.rewardXP > 0 && (
                    <div className="sr-only">+{activeActivity.rewardXP} XP</div>
                  )}
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
                  {(!activeMission || missionStepIdx >= activeMission.steps.length - 1) && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowCelebration(false);
                        if (dynamicCounting) {
                          handleRegenerateCounting();
                          return;
                        }
                        if (dynamicSorting) {
                          handleRegenerateSorting();
                          return;
                        }
                        handleStartActivity(activeActivity);
                      }}
                      className="w-full min-h-14 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-black text-base cursor-pointer border border-white/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw size={18} /> Play again
                    </button>
                  )}
                  <button
                    type="button"
                    data-testid="trail-next"
                    onClick={handleContinueAfterCelebration}
                    className="w-full min-h-16 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black text-lg cursor-pointer shadow-lg transition-all"
                  >
                    {activeMission && missionStepIdx < activeMission.steps.length - 1
                      ? "Next Mission Step ➡️"
                      : trailNext
                        ? `Next: ${trailNext.clueIcon} ${trailNext.title}`
                        : "Back to the trail"}
                  </button>
                </div>
              </div>
            </div>
          )}
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
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-sm min-h-12 cursor-pointer transition-all border border-white/10"
          >
            <ChevronLeft size={16} /> Back to {selectedWorld.title} Map
          </button>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-2xl bg-white/10 text-white font-bold text-sm border border-white/10">
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
                  <p className="text-sm sm:text-base font-semibold opacity-95">{selectedArea.tagline}</p>
                </div>
              </div>
              <p className="text-sm italic opacity-90 max-w-lg mt-1">
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

        {/* STATION ROAD first — kids maps put the path in the scene, extras below */}
        <div className="space-y-3">
          {(() => {
            const firstOpen = selectedArea.activities.find((activity) => !progress.completedActivities[activity.id]);
            const currentId = firstOpen?.id ?? selectedArea.activities.at(-1)?.id;
            return (
              <ToddlerWorldTrail
                label={`${selectedArea.title} · ${selectedArea.activities.length} stations`}
                buddyEmoji="👧"
                coverSrc={WORLD_COVER[selectedWorld.id]}
                sceneryEmojis={selectedArea.environment.sceneryEmojis}
                onSelect={(id) => {
                  const activity = selectedArea.activities.find((item) => item.id === id);
                  if (activity) handleStartActivity(activity);
                }}
                nodes={selectedArea.activities.map((activity) => ({
                  id: activity.id,
                  emoji: activity.clueIcon,
                  title: activity.title,
                  done: !!progress.completedActivities[activity.id],
                  locked: false,
                  current: activity.id === currentId,
                  toy: TOY_ACTIVITY_TYPES.has(activity.type),
                }))}
              />
            );
          })()}
        </div>

        {selectedArea.missions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedArea.missions.map((mission) => {
              const isCompleted = progress.completedMissions[mission.id];
              return (
                <button
                  key={mission.id}
                  type="button"
                  onClick={() => handleStartMission(mission)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-black min-h-11 cursor-pointer border ${
                    isCompleted
                      ? "bg-white/10 border-white/15 text-white"
                      : "bg-amber-400/20 border-amber-300 text-amber-100"
                  }`}
                >
                  <span>{mission.badgeEmoji}</span>
                  {isCompleted ? `Replay ${mission.title}` : mission.title}
                </button>
              );
            })}
          </div>
        )}
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
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-sm min-h-12 cursor-pointer transition-all border border-white/10"
          >
            <ChevronLeft size={16} /> All lands
          </button>

          <div className="flex items-center gap-3">
            <div className="text-xs text-white/60 font-bold hidden sm:block">
              {worldStats.completedActivities} of {worldStats.totalActivities} stops
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
        <div className={`relative overflow-hidden p-6 sm:p-8 rounded-[2.5rem] bg-gradient-to-r ${selectedWorld.gradient} text-white shadow-xl space-y-4 border-2 border-white/30`}>
          {WORLD_COVER[selectedWorld.id] && (
            <img
              src={WORLD_COVER[selectedWorld.id]}
              alt=""
              decoding="async"
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-slate-950/28" />
          <div className="relative z-10 space-y-4">
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
          </div>
        </div>

        {/* AREAS IN THIS WORLD */}
        <div className="space-y-4">
          {(() => {
            const currentId =
              progress.lastVisitedAreaId && selectedWorld.areas.some((item) => item.id === progress.lastVisitedAreaId)
                ? progress.lastVisitedAreaId
                : selectedWorld.areas.find((item) => {
                    if (!isAreaUnlocked(item, progress)) return false;
                    const stats = getAreaProgressStats(item, progress);
                    return stats.completedCount < stats.totalCount;
                  })?.id ?? selectedWorld.areas[0]?.id;
            return (
              <ToddlerWorldTrail
                label={`${selectedWorld.title} · ${selectedWorld.areas.length} areas`}
                buddyEmoji={selectedWorld.emoji}
                coverSrc={WORLD_COVER[selectedWorld.id]}
                sceneryEmojis={selectedWorld.areas[0]?.environment.sceneryEmojis}
                onSelect={(id) => {
                  const area = selectedWorld.areas.find((item) => item.id === id);
                  if (area) handleSelectArea(area);
                }}
                nodes={selectedWorld.areas.map((area) => {
                  const unlocked = isAreaUnlocked(area, progress);
                  const stats = getAreaProgressStats(area, progress);
                  return {
                    id: area.id,
                    emoji: area.emoji,
                    title: area.title,
                    subtitle: area.tagline,
                    done: stats.completedCount >= stats.totalCount && stats.totalCount > 0,
                    locked: !unlocked,
                    current: area.id === currentId,
                  };
                })}
              />
            );
          })()}
        </div>
      </div>
    );
  }

  // ==========================================================================
  // VIEW LEVEL 1: WORLDS OVERVIEW MAP
  // ==========================================================================
  if (activeSecretZone) {
    return (
      <div className="max-w-6xl mx-auto space-y-4">
        <button
          type="button"
          onClick={() => setActiveSecretZone(null)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm min-h-12 cursor-pointer border border-white/10"
        >
          <ChevronLeft size={16} /> Back to atlas
        </button>
        <ToddlerSecretZonePlay
          zone={activeSecretZone}
          onAddStar={onAddStar}
          onLeave={() => setActiveSecretZone(null)}
        />
      </div>
    );
  }

  if (letterLaneOpen) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <button
          type="button"
          onClick={() => setLetterLaneOpen(false)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm min-h-12 cursor-pointer border border-white/10"
        >
          <ChevronLeft size={16} /> Back to atlas
        </button>
        <div className="p-4 rounded-3xl bg-[#131427] border-2 border-amber-400/30 shadow-2xl">
          <ToddlerLetterLane onDone={() => onAddStar(1)} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-600">Wonderland Atlas</p>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight">Pick a land</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={toggleTapSounds}
            className="px-4 py-2.5 rounded-2xl bg-white text-slate-900 font-bold text-base min-h-12 cursor-pointer border border-white/60 shadow-sm inline-flex items-center gap-1.5"
            title={tapsMuted ? "Tap sounds are off" : "Quiet tap sounds"}
          >
            {tapsMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            {tapsMuted ? "Taps off" : "Taps on"}
          </button>
          <button
            type="button"
            onClick={() => {
              setLetterLaneOpen(true);
              speakText("Letter Lane. Three letters. About five minutes. No streak.", { pitch: 1.15 });
            }}
            className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base min-h-12 cursor-pointer shadow-sm"
          >
            Letter Lane
          </button>
          {onOpenFocus && (
            <button
              type="button"
              onClick={() => {
                onOpenFocus();
                speakText("Focus body. Check how you feel. Move or push. Then quiet.", { pitch: 1.12 });
              }}
              className="px-4 py-2.5 rounded-2xl bg-teal-400 hover:bg-teal-300 text-teal-950 font-black text-base min-h-12 cursor-pointer shadow-sm"
            >
              Busy body
            </button>
          )}
          {onOpenGames && (
            <button
              onClick={onOpenGames}
              className="px-4 py-2.5 rounded-2xl bg-white text-slate-900 font-bold text-base min-h-12 cursor-pointer border border-white/60 shadow-sm"
            >
              Free Play
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {ATLAS_CONTINENTS.map((continent) => {
          const lands = continent.worldIds
            .map((id) => ALL_TODDLER_WORLDS.find((world) => world.id === id))
            .filter((world): world is ToddlerWorld => Boolean(world));
          return (
            <section
              key={continent.id}
              className={`rounded-[2rem] bg-gradient-to-br ${continent.band} p-4 sm:p-6 shadow-xl border border-white/40`}
            >
              <div className="mb-5 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {continent.emoji} {continent.title}
                </h3>
                <p className="text-sm font-bold text-slate-700">{continent.blurb}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {lands.map((world, landIndex) => {
                  const stats = getWorldProgressStats(world, progress);
                  const stations = world.areas.reduce((sum, area) => sum + area.activities.length, 0);
                  const here = progress.lastVisitedWorldId === world.id;
                  const eagerLand = continent.id === ATLAS_CONTINENTS[0]?.id && landIndex < 3;
                  return (
                    <motion.button
                      key={world.id}
                      type="button"
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSelectWorld(world)}
                      className={`overflow-hidden rounded-3xl bg-white text-left shadow-md cursor-pointer border-4 ${
                        here ? "border-amber-400" : "border-white"
                      }`}
                    >
                      <span className="relative mb-0 block h-44 sm:h-48 md:h-56 w-full overflow-hidden">
                        {WORLD_COVER[world.id] ? (
                          <img
                            src={WORLD_COVER[world.id]}
                            alt=""
                            width={800}
                            height={437}
                            loading={eagerLand ? "eager" : "lazy"}
                            decoding="async"
                            fetchPriority={eagerLand ? "high" : "low"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${world.gradient} text-5xl`}>
                            {world.emoji}
                          </span>
                        )}
                        <span className="absolute left-2 top-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 text-2xl shadow">
                          {world.emoji}
                        </span>
                      </span>
                      <span className="block p-4 sm:p-5">
                      <h4 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">{world.title}</h4>
                      <p className="mt-1 text-base font-bold text-slate-700">
                        {world.areas.length} areas · {stations} games
                      </p>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-amber-400"
                          style={{ width: `${stats.percentage}%` }}
                        />
                      </div>
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <section className="rounded-[2rem] bg-gradient-to-br from-indigo-300 via-violet-200 to-amber-200 p-4 sm:p-6 shadow-xl border border-white/40">
        <div className="mb-5 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">Hidden doors</h3>
          <p className="text-sm font-bold text-slate-700">Secret rooms · earn stars, then step in</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SECRET_ZONES.map((zone) => {
            const isUnlocked = starsCount >= zone.starsRequired;
            const found = secretZoneIsFound(zone.id);
            return (
              <motion.button
                key={zone.id}
                type="button"
                whileHover={{ y: isUnlocked ? -4 : 0 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (!isUnlocked) {
                    soundEffects.playGentleBoing();
                    speakText(
                      `The ${zone.title} is locked! You need ${zone.starsRequired} stars.`,
                      { pitch: 1.15 }
                    );
                    return;
                  }
                  setActiveSecretZone(zone);
                  soundEffects.playPop();
                  speakText(`Welcome to ${zone.title}. ${zone.subtitle}`, { pitch: 1.18 });
                }}
                className={`overflow-hidden rounded-3xl bg-white text-left shadow-md cursor-pointer border-4 ${
                  found ? "border-amber-400" : "border-white"
                }`}
              >
                <span className="relative mb-0 block h-44 sm:h-48 md:h-56 w-full overflow-hidden">
                  {SECRET_COVER[zone.id] ? (
                    <img
                      src={SECRET_COVER[zone.id]}
                      alt=""
                      width={800}
                      height={447}
                      loading="lazy"
                      decoding="async"
                      className={`h-full w-full object-cover ${isUnlocked ? "" : "grayscale"}`}
                    />
                  ) : (
                    <span className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${zone.bgGradient} text-5xl`}>
                      {zone.emoji}
                    </span>
                  )}
                  <span className="absolute left-2 top-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 text-2xl shadow">
                    {found ? "✅" : zone.emoji}
                  </span>
                  {!isUnlocked && (
                    <span className="absolute inset-0 flex items-end justify-center bg-slate-950/35 p-3">
                      <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-black text-slate-800">
                        Need {zone.starsRequired}★
                      </span>
                    </span>
                  )}
                </span>
                <span className="block p-4 sm:p-5">
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">{zone.title}</h4>
                  <p className="mt-1 text-base font-bold text-slate-700">{zone.subtitle}</p>
                </span>
              </motion.button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
