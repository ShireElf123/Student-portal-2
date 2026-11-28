import React, { useEffect, useRef, useState } from "react";
import { TODDLER_SPACE_TABS, type ToddlerSpaceTabId } from "../data/toddler/toddlerSpaceTabs";
import { DESTINATION_ICON } from "../data/toddler/toddlerArt";

const OPEN_SPIN_MS = 280;

function prefersReducedMotion() {
  return Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);
}

export function ToddlerSpaceNav({
  activeTab,
  onSelect,
  isMeadow,
}: {
  activeTab: ToddlerSpaceTabId | null;
  onSelect: (tab: ToddlerSpaceTabId) => void;
  isMeadow: boolean;
}) {
  const [openingTab, setOpeningTab] = useState<ToddlerSpaceTabId | null>(null);
  const openRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (openRef.current !== null) window.clearTimeout(openRef.current);
    };
  }, []);

  const tapToy = (tab: ToddlerSpaceTabId) => {
    if (openingTab) return;
    if (prefersReducedMotion()) {
      onSelect(tab);
      return;
    }
    setOpeningTab(tab);
    openRef.current = window.setTimeout(() => onSelect(tab), OPEN_SPIN_MS);
  };

  return (
    <div className="wonder-launcher-wrap">
      <p className="wonder-turn-hint" role="note">
        Tip: turn the tablet sideways for a bigger playroom
      </p>
      <div
        role="tablist"
        aria-label="Toddler destinations"
        data-testid="toddler-space-nav"
        className={`wonder-launcher wonder-launcher--playroom ${isMeadow ? "" : "wonder-launcher--night"}`}
      >
        {TODDLER_SPACE_TABS.map((tab) => {
          const selected = activeTab === tab.id;
          const opening = openingTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              data-testid={`toddler-tab-${tab.id}`}
              data-place={tab.id}
              data-opening={opening ? "true" : "false"}
              onClick={() => tapToy(tab.id)}
              className={`wonder-picture-card wonder-launch-tile flex flex-col items-center justify-center gap-1 px-1 py-2 sm:px-1.5 sm:py-2.5 rounded-[1.35rem] cursor-pointer select-none ${
                selected ? "is-selected" : ""
              } ${opening ? "is-opening" : ""}`}
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
