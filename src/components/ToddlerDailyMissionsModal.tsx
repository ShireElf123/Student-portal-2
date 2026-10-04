import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Sparkles,
  Star,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Trophy,
} from "lucide-react";
import {
  getTodayAdventure,
  getCompletedDailyMissionIds,
  markDailyMissionCompleted,
  DailyMission,
  DailySchedule,
} from "../data/toddler/toddlerDailyAdventure";
import { soundEffects } from "../utils/soundEffects";
import { speakText } from "../utils/speechUtils";
import { awardStars, awardXP, triggerCelebrationConfetti } from "../utils/gamification";

interface ToddlerDailyMissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMissionTab: (tab: "books" | "phonics" | "counting" | "games" | "worlds" | "avatar-studio", subactivity?: string) => void;
  onAddStar: (count: number) => void;
}

export function ToddlerDailyMissionsModal({
  isOpen,
  onClose,
  onSelectMissionTab,
  onAddStar,
}: ToddlerDailyMissionsModalProps) {
  const [schedule, setSchedule] = useState<DailySchedule>(getTodayAdventure());
  const [completedIds, setCompletedIds] = useState<string[]>(getCompletedDailyMissionIds());

  useEffect(() => {
    if (isOpen) {
      setSchedule(getTodayAdventure());
      setCompletedIds(getCompletedDailyMissionIds());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const allCompleted = schedule.missions.every((m) => completedIds.includes(m.id));

  const handleStartMission = (mission: DailyMission) => {
    soundEffects.playPop();
    speakText(`Starting daily mission: ${mission.title}! ${mission.tagline}`, { pitch: 1.15 });

    // Mark completed if not already
    const res = markDailyMissionCompleted(mission.id);
    if (res.isFirstComplete) {
      soundEffects.playSuccessChime();
      soundEffects.playStarSparkle();
      onAddStar(mission.starsReward);
      awardXP(mission.xpReward, `Completed daily mission: ${mission.title}`);
      setCompletedIds(getCompletedDailyMissionIds());

      if (res.allCompleted) {
        soundEffects.playFanfare();
        triggerCelebrationConfetti();
        onAddStar(5);
        awardXP(100, "Completed all daily missions bonus");
        speakText("Hooray! You completed all 3 daily missions for today! You earned 5 extra golden stars!", {
          pitch: 1.2,
        });
      }
    }

    onClose();
    onSelectMissionTab(mission.targetTab, mission.targetSubactivity);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-xl flex flex-col rounded-3xl bg-gradient-to-b from-[#1c1a36] via-[#121324] to-[#0c0d18] border-2 border-indigo-400/40 shadow-2xl shadow-purple-900/50 overflow-hidden text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/30">
                {schedule.themeBannerEmoji}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-300">
                    {schedule.dayName} Expedition
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                    {completedIds.length} / 3 Complete
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Today's 3 Adventures
                </h2>
              </div>
            </div>

            <button
              onClick={() => {
                soundEffects.playPop();
                onClose();
              }}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Missions List */}
          <div className="p-4 sm:p-6 space-y-4">
            <div className="text-xs text-white/70">
              Theme: <span className="font-bold text-amber-300">{schedule.themeTitle}</span>. Finish all 3 to earn bonus stars!
            </div>

            <div className="space-y-3">
              {schedule.missions.map((mission, idx) => {
                const isComplete = completedIds.includes(mission.id);
                return (
                  <div
                    key={mission.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isComplete
                        ? "bg-emerald-950/30 border-emerald-500/40"
                        : "bg-white/[0.04] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl filter drop-shadow">
                        {mission.emoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white/60">
                            Mission #{idx + 1}:
                          </span>
                          <h4 className="font-black text-sm text-white">
                            {mission.title}
                          </h4>
                        </div>
                        <p className="text-xs text-white/60 mt-0.5">
                          {mission.tagline}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-[11px] font-bold text-amber-300">
                          <span className="flex items-center gap-0.5">
                            <Star size={11} fill="currentColor" /> +{mission.starsReward} Stars
                          </span>
                          <span className="text-white/40">•</span>
                          <span className="text-purple-300">+{mission.xpReward} XP</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartMission(mission)}
                      className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                        isComplete
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                          : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 text-white shadow-md shadow-indigo-500/30"
                      }`}
                    >
                      {isComplete ? (
                        <>
                          <CheckCircle2 size={14} /> Completed
                        </>
                      ) : (
                        <>
                          Start <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Celebration footer if all completed */}
            {allCompleted && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-400/40 text-center space-y-1">
                <div className="text-xs font-black text-amber-300 flex items-center justify-center gap-1">
                  <Trophy size={14} /> All Today's Adventures Completed!
                </div>
                <div className="text-[11px] text-white/70">
                  Awesome job explorer! Check your Sticker Album to see your new badges!
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
