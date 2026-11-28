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
        className={`wonder-launcher ${isMeadow ? "wonder-launcher--playroom" : "wonder-launcher--night"}`}
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
              data-place={tab.id}
              onClick={() => onSelect(tab.id)}
              className={`wonder-picture-card wonder-launch-tile flex flex-col items-center justify-center gap-1 px-1 py-2 sm:px-1.5 sm:py-2.5 rounded-[1.35rem] font-black text-xs sm:text-sm md:text-base transition-all cursor-pointer select-none ${
                selected ? "is-selected" : ""
              }`}
            >
              {DESTINATION_ICON[tab.id] ? (
                <img
                  src={DESTINATION_ICON[tab.id]}
                  alt=""
                  width={128}
                  height={128}
                  decoding="async"
                  className="wonder-launch-icon wonder-launch-icon--hero"
                />
              ) : (
                <span className="text-4xl sm:text-5xl leading-none drop-shadow-sm" aria-hidden>
                  {tab.emoji}
                </span>
              )}
              <span className="wonder-picture-label leading-tight text-center">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
