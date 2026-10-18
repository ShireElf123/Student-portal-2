import React, { useEffect, useState } from "react";
import { ArrowRight, Volume2 } from "lucide-react";
import { getLearnerModel, subscribeLearnerModel, type LearnerModel } from "../utils/learnerBrain";
import { buildParentEvidenceBoard, type EvidenceLaunch } from "../utils/parentEvidenceBoard";
import { getActiveVoiceInfo, subscribeVoiceChange } from "../utils/speechUtils";

interface GamificationHeaderProps {
  onOpenOdyssey: () => void;
  onOpenVoiceSettings?: () => void;
  onLaunchNext?: (launch: EvidenceLaunch) => void;
  activeTab: string;
  isLight?: boolean;
}

export function GamificationHeader({
  onOpenVoiceSettings,
  onLaunchNext,
  isLight = false,
}: GamificationHeaderProps) {
  const [model, setModel] = useState<LearnerModel>(() => getLearnerModel());
  const [voiceInfo, setVoiceInfo] = useState(getActiveVoiceInfo());

  useEffect(() => {
    setModel(getLearnerModel());
    const unsubModel = subscribeLearnerModel(setModel);
    const unsubVoice = subscribeVoiceChange(() => setVoiceInfo(getActiveVoiceInfo()));
    return () => {
      unsubModel();
      unsubVoice();
    };
  }, []);

  const board = buildParentEvidenceBoard(model);
  const next = board.nextLaunch;
  const chip = isLight
    ? "bg-emerald-50 border-2 border-emerald-200 text-emerald-950"
    : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-200";
  const nextChip = isLight
    ? "bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-800"
    : "bg-white/5 hover:bg-white/10 text-white border-white/10";
  const voiceChip = isLight
    ? "bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 text-indigo-950"
    : "bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300";

  const launchNext = () => {
    if (!next || !onLaunchNext) return;
    try {
      onLaunchNext(next);
    } catch {
      // Registry mismatch should not take down the chrome.
    }
  };

  return (
    <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
      <div className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black shadow-sm border ${chip}`}>
        <span>
          {board.rows.length}/{board.skillsInBand}
        </span>
        <span className="hidden sm:inline font-bold opacity-80">K–1 skills with evidence</span>
      </div>

      {next && onLaunchNext ? (
        <button
          type="button"
          onClick={launchNext}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm border ${nextChip}`}
          title={next.reason}
        >
          <span className="hidden sm:inline max-w-[14rem] truncate">Next: {next.activityTitle}</span>
          <span className="sm:hidden">Next</span>
          <ArrowRight size={14} />
        </button>
      ) : (
        <span className={`hidden sm:inline px-2.5 py-1.5 rounded-xl text-[11px] font-bold border ${chip}`}>
          No scored K–1 evidence yet
        </span>
      )}

      {onOpenVoiceSettings && (
        <button
          onClick={onOpenVoiceSettings}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black shadow-sm transition-all cursor-pointer border ${voiceChip}`}
          title={`Active Voice: ${voiceInfo.name}. Click to test or change.`}
        >
          <Volume2 size={14} />
          <span className="hidden sm:inline">{voiceInfo.isGuy ? "Guy Voice" : "AI Voice"}</span>
        </button>
      )}
    </div>
  );
}
