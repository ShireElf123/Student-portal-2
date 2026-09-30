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
  getActiveDailyMissionId,
  startDailyMission,
  ALL_MISSIONS_BONUS_STARS,
  DailyMission,
  DailySchedule,
} from "../data/toddler/toddlerDailyAdventure";
import { soundEffects } from "../utils/soundEffects";
import { speakText } from "../utils/speechUtils";

interface ToddlerDailyMissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMissionTab: (tab: "books" | "phonics" | "counting" | "games" | "worlds" | "avatar-studio", subactivity?: string) => void;
  /**
   * @deprecated Rewards are paid by the mission matcher when the linked
   * activity genuinely completes. Kept so existing call sites keep working.
   */
  onAddStar?: (count: number) => void;
}

export function ToddlerDailyMissionsModal({
  isOpen,
  onClose,
  onSelectMissionTab,
}: ToddlerDailyMissionsModalProps) {
  const [schedule, setSchedule] = useState<DailySchedule>(getTodayAdventure());
  const [completedIds, setCompletedIds] = useState<string[]>(getCompletedDailyMissionIds());
  const [activeMissionId, setActiveMissionId] = useState<string | null>(getActiveDailyMissionId());

  useEffect(() => {
    if (isOpen) {
      setSchedule(getTodayAdventure());
      setCompletedIds(getCompletedDailyMissionIds());
      setActiveMissionId(getActiveDailyMissionId());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const allCompleted = schedule.missions.every((m) => completedIds.includes(m.id));

  // Starting a mission only navigates to its activity. Stars and XP are paid
  // later, by the mission matcher, when the activity genuinely completes.
  const handleStartMission = (mission: DailyMission) => {
    const isComplete = completedIds.includes(mission.id);
    soundEffects.playPop();
    if (!isComplete) {
      startDailyMission(mission.id);
      speakText(`Starting daily mission: ${mission.title}! ${mission.tagline}`, { pitch: 1.15 });
    } else {
      speakText(`Let's play ${mission.title} again for fun!`, { pitch: 1.15 });
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
              Theme: <span className="font-bold text-amber-300">{schedule.themeTitle}</span>. Finish all 3 to earn {ALL_MISSIONS_BONUS_STARS} bonus stars! Rewards are paid when each activity is really done.
            </div>

            <div className="space-y-3">
              {schedule.missions.map((mission, idx) => {
                const isComplete = completedIds.includes(mission.id);
                const isActive = !isComplete && activeMissionId === mission.id;
                return (
                  <div
                    key={mission.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isComplete
                        ? "bg-emerald-950/30 border-emerald-500/40"
                        : isActive
                        ? "bg-indigo-950/40 border-indigo-400/50"
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
                          <span className="text-white/50 font-semibold">Reward:</span>
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
                      className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                        isComplete
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/30"
                          : isActive
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-white shadow-md shadow-amber-500/30"
                          : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 text-white shadow-md shadow-indigo-500/30"
                      }`}
                    >
                      {isComplete ? (
                        <>
                          <CheckCircle2 size={14} /> Play Again
                        </>
                      ) : isActive ? (
                        <>
                          Resume <ArrowRight size={14} />
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
