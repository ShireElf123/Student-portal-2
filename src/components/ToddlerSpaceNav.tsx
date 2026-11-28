import React, { useEffect, useRef, useState } from "react";
import { TODDLER_SPACE_TABS, type ToddlerSpaceTabId } from "../data/toddler/toddlerSpaceTabs";
import { DESTINATION_ICON } from "../data/toddler/toddlerArt";
import { speakText } from "../utils/speechUtils";

const NAME_HOLD_MS = 2600;

export function ToddlerSpaceNav({
  activeTab,
  onSelect,
  isMeadow,
}: {
  activeTab: ToddlerSpaceTabId | null;
  onSelect: (tab: ToddlerSpaceTabId) => void;
  isMeadow: boolean;
}) {
  const [namedTab, setNamedTab] = useState<ToddlerSpaceTabId | null>(null);
  const holdRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (holdRef.current !== null) window.clearTimeout(holdRef.current);
    };
  }, []);

  const tapToy = (tab: ToddlerSpaceTabId, label: string) => {
    if (namedTab === tab) {
      if (holdRef.current !== null) window.clearTimeout(holdRef.current);
      setNamedTab(null);
      onSelect(tab);
      return;
    }
    setNamedTab(tab);
    speakText(label, { pitch: 1.18, rate: 0.92 });
    if (holdRef.current !== null) window.clearTimeout(holdRef.current);
    holdRef.current = window.setTimeout(() => setNamedTab(null), NAME_HOLD_MS);
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
          const named = namedTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              data-testid={`toddler-tab-${tab.id}`}
              data-place={tab.id}
              data-named={named ? "true" : "false"}
              onClick={() => tapToy(tab.id, tab.label)}
              className={`wonder-picture-card wonder-launch-tile flex flex-col items-center justify-center gap-1 px-1 py-2 sm:px-1.5 sm:py-2.5 rounded-[1.35rem] font-black text-xs sm:text-sm md:text-base transition-all cursor-pointer select-none ${
                selected ? "is-selected" : ""
              } ${named ? "is-named" : ""}`}
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
