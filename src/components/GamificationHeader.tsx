import React, { useState, useEffect } from "react";
import { Star, Flame, Zap, Map, Trophy, Gem, Sparkles, Volume2 } from "lucide-react";
import {
  getGamificationState,
  subscribeGamification,
  calculateLevel,
} from "../utils/gamification";
import { NavigationTab } from "../types";
import { getActiveVoiceInfo, subscribeVoiceChange } from "../utils/speechUtils";

interface GamificationHeaderProps {
  onOpenOdyssey: () => void;
  onOpenVoiceSettings?: () => void;
  activeTab: NavigationTab;
  isLight?: boolean;
}

export function GamificationHeader({
  onOpenOdyssey,
  onOpenVoiceSettings,
  activeTab,
  isLight = false,
}: GamificationHeaderProps) {
  const [state, setState] = useState(getGamificationState);
  const [voiceInfo, setVoiceInfo] = useState(getActiveVoiceInfo());

  useEffect(() => {
    const unsubGami = subscribeGamification(setState);
    const unsubVoice = subscribeVoiceChange(() => {
      setVoiceInfo(getActiveVoiceInfo());
    });
    return () => {
      unsubGami();
      unsubVoice();
    };
  }, []);

  const levelInfo = calculateLevel(state.xp);

  if (isLight) {
    return (
      <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
        {/* XP Level Badge with Progress Bar */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-indigo-50 border-2 border-indigo-200 rounded-xl shadow-sm">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-black text-white shadow-sm">
            {levelInfo.level}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-3 text-[10px] leading-tight font-black">
              <span className="text-indigo-900">Level {levelInfo.level}</span>
              <span className="text-indigo-600 font-bold">{levelInfo.currentLevelXp}/{levelInfo.nextLevelXp} XP</span>
            </div>
            <div className="w-16 h-1.5 bg-indigo-200 rounded-full overflow-hidden mt-0.5">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${levelInfo.progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Daily Streak Flame */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-orange-50 border-2 border-orange-200 text-orange-950 text-xs font-black shadow-sm"
          title={`${state.streakDays} Day Active Streak`}
        >
          <Flame size={15} className="fill-orange-500 text-orange-500 animate-pulse" />
          <span>{state.streakDays}</span>
        </div>

        {/* Star Jar Count */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 border-2 border-amber-200 text-amber-950 text-xs font-black shadow-sm"
          title={`${state.starsCount} Golden Stars`}
        >
          <Star size={15} className="fill-amber-400 text-amber-500" />
          <span>{state.starsCount}</span>
        </div>

        {/* AI Voice Indicator Button */}
        {onOpenVoiceSettings && (
          <button
            onClick={onOpenVoiceSettings}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 text-indigo-950 shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
            title={`Active Voice: ${voiceInfo.name}. Click to test or change.`}
          >
            <Volume2 size={14} className="text-indigo-600" />
            <span className="hidden sm:inline">
              {voiceInfo.isGuy ? "Guy Voice" : "AI Voice"}
            </span>
          </button>
        )}

        {/* Odyssey Map Button */}
        <button
          onClick={onOpenOdyssey}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm border-b-2 active:translate-y-0.5 ${
            activeTab === "odyssey"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-900 ring-2 ring-indigo-400"
              : "bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-800 hover:scale-105"
          }`}
          title="Open Learning Odyssey Quest Path"
        >
          <Map size={14} className="text-cyan-200" />
          <span className="hidden sm:inline">Odyssey Map</span>
          <span className="sm:hidden">Map</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
      {/* XP Level Badge with Progress Bar */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
        <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-black text-white shadow-sm">
          {levelInfo.level}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-3 text-[10px] leading-tight">
            <span className="font-bold text-indigo-300">Level {levelInfo.level}</span>
            <span className="text-white/50">{levelInfo.currentLevelXp}/{levelInfo.nextLevelXp} XP</span>
          </div>
          <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden mt-0.5">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
              style={{ width: `${levelInfo.progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Daily Streak Flame */}
      <div
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs font-black"
        title={`${state.streakDays} Day Active Streak`}
      >
        <Flame size={15} className="fill-orange-400 text-orange-400 animate-pulse" />
        <span>{state.streakDays}</span>
      </div>

      {/* Star Jar Count */}
      <div
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-black"
        title={`${state.starsCount} Golden Stars`}
      >
        <Star size={15} className="fill-amber-400 text-amber-400" />
        <span>{state.starsCount}</span>
      </div>

      {/* AI Voice Indicator Button */}
      {onOpenVoiceSettings && (
        <button
          onClick={onOpenVoiceSettings}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-black transition-all cursor-pointer hover:scale-105 active:scale-95"
          title={`Active Voice: ${voiceInfo.name}. Click to test or configure.`}
        >
          <Volume2 size={14} className="text-indigo-400" />
          <span className="hidden sm:inline">
            {voiceInfo.isGuy ? "Guy Voice" : "AI Voice"}
          </span>
        </button>
      )}

      {/* Odyssey Map Button */}
      <button
        onClick={onOpenOdyssey}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border shadow-sm ${
          activeTab === "odyssey"
            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400 ring-2 ring-indigo-400/40"
            : "bg-white/5 hover:bg-white/10 text-white/90 hover:text-white border-white/10 hover:scale-105"
        }`}
        title="Open Learning Odyssey Quest Path"
      >
        <Map size={14} className="text-cyan-300" />
        <span className="hidden sm:inline">Odyssey Map</span>
        <span className="sm:hidden">Map</span>
      </button>
    </div>
  );
}

