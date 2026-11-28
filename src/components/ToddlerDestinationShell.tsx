import React from "react";
import { ChevronLeft, Volume2, VolumeX } from "lucide-react";
import {
  TODDLER_DESTINATION_SHELL,
  TODDLER_SPACE_TABS,
  type ToddlerSpaceTabId,
} from "../data/toddler/toddlerSpaceTabs";
import { DESTINATION_ICON } from "../data/toddler/toddlerArt";

export function ToddlerDestinationShell({
  tab,
  isMeadow,
  isMuted,
  onToggleMute,
  onHome,
  children,
}: {
  tab: ToddlerSpaceTabId;
  isMeadow: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onHome: () => void;
  children: React.ReactNode;
}) {
  const meta = TODDLER_SPACE_TABS.find((item) => item.id === tab);
  const shell = TODDLER_DESTINATION_SHELL[tab];

  return (
    <div
      data-testid={`wonder-destination-${tab}`}
      className={`wonder-place flex flex-col min-h-full ${isMeadow ? shell.placeClass : "wonder-place-night"}`}
    >
      <header
        className={`wonder-place-bar sticky top-0 z-30 px-3 sm:px-4 py-2.5 bg-gradient-to-r ${shell.barClass} border-b-4 ${
          isMeadow ? "border-white/85" : "border-slate-900/40"
        } shadow-lg`}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-3 relative z-10">
          <button
            type="button"
            data-testid="wonder-home-back"
            onClick={onHome}
            className="inline-flex items-center gap-1 min-h-12 min-w-12 px-3 rounded-2xl bg-white text-slate-900 font-black text-sm border-b-4 border-emerald-400 shadow-md active:translate-y-0.5"
          >
            <ChevronLeft size={18} />
            Home
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-700">
              {shell.kicker}
            </p>
            <h1 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight flex items-center gap-2">
              {meta && DESTINATION_ICON[meta.id] ? (
                <img src={DESTINATION_ICON[meta.id]} alt="" width={36} height={36} className="wonder-launch-icon" decoding="async" />
              ) : (
                <span aria-hidden>{meta?.emoji}</span>
              )}
              {meta?.label}
            </h1>
          </div>
          <button
            type="button"
            onClick={onToggleMute}
            className={`inline-flex items-center justify-center gap-1 min-h-12 min-w-12 px-3 rounded-2xl font-black text-sm border-b-4 shadow-md ${
              isMuted
                ? "bg-rose-500 text-white border-rose-700"
                : "bg-white text-slate-800 border-slate-300"
            }`}
            title={isMuted ? "Sound is muted" : "Sound is on"}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            <span className="hidden sm:inline">{isMuted ? "Muted" : "Voice"}</span>
          </button>
        </div>
      </header>
      <div className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-6">{children}</div>
    </div>
  );
}
