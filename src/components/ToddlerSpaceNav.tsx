import React from "react";
import { TODDLER_SPACE_TABS, type ToddlerSpaceTabId } from "../data/toddler/toddlerSpaceTabs";
import { DESTINATION_ICON } from "../data/toddler/toddlerArt";

export function ToddlerSpaceNav({
  activeTab,
  onSelect,
  isMeadow,
}: {
  activeTab: ToddlerSpaceTabId | null;
  onSelect: (tab: ToddlerSpaceTabId) => void;
  isMeadow: boolean;
}) {
  return (
    <div className="wonder-launcher-wrap">
      <p className="wonder-turn-hint" role="note">
        Tip: turn the tablet sideways for a bigger playroom
      </p>
      <div
        role="tablist"
        aria-label="Toddler destinations"
        data-testid="toddler-space-nav"
        className={`wonder-launcher ${
          isMeadow
            ? "bg-white/80 backdrop-blur-md border-4 border-emerald-300 ring-4 ring-emerald-500/20"
            : "bg-white/[0.08] border border-white/15 shadow-xl"
        }`}
      >
        {TODDLER_SPACE_TABS.map((tab) => {
          const selected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              data-testid={`toddler-tab-${tab.id}`}
              onClick={() => onSelect(tab.id)}
              className={`wonder-clay-tile wonder-launch-tile flex flex-col items-center justify-center gap-1 px-1.5 py-2 sm:px-2 sm:py-3 rounded-2xl font-black text-xs sm:text-sm md:text-base transition-all cursor-pointer select-none ${
                selected
                  ? tab.activeClass
                  : isMeadow
                  ? "bg-white/95 text-slate-800 hover:text-slate-900 hover:bg-amber-50 border-b-4 border-emerald-200"
                  : "text-white hover:bg-white/15 border-b-4 border-transparent"
              }`}
            >
              {DESTINATION_ICON[tab.id] ? (
                <img
                  src={DESTINATION_ICON[tab.id]}
                  alt=""
                  width={112}
                  height={112}
                  decoding="async"
                  className="wonder-launch-icon wonder-launch-icon--hero"
                />
              ) : (
                <span className="text-4xl sm:text-5xl leading-none drop-shadow-sm" aria-hidden>
                  {tab.emoji}
                </span>
              )}
              <span className="leading-tight text-center">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
