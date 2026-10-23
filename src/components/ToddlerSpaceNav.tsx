import React from "react";
import { TODDLER_SPACE_TABS, type ToddlerSpaceTabId } from "../data/toddler/toddlerSpaceTabs";

export function ToddlerSpaceNav({
  activeTab,
  onSelect,
  isMeadow,
}: {
  activeTab: ToddlerSpaceTabId;
  onSelect: (tab: ToddlerSpaceTabId) => void;
  isMeadow: boolean;
}) {
  return (
    <div
      role="tablist"
      aria-label="Toddler destinations"
      data-testid="toddler-space-nav"
      className={`grid grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3 p-1.5 sm:p-3 rounded-3xl max-w-6xl mx-auto mb-4 lg:mb-8 shadow-xl ${
        isMeadow
          ? "bg-white/95 backdrop-blur-md border-4 border-emerald-300 ring-4 ring-emerald-500/20"
          : "bg-white/[0.08] border border-white/15"
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
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-4 px-2 sm:px-3 rounded-2xl font-black text-sm sm:text-base md:text-lg transition-all cursor-pointer select-none min-h-12 ${
              selected
                ? tab.activeClass
                : isMeadow
                ? "text-slate-700 hover:text-slate-900 hover:bg-amber-100/60 border-b-4 border-transparent"
                : "text-white hover:bg-white/15 border-b-4 border-transparent"
            }`}
          >
            <span className="text-2xl sm:text-3xl" aria-hidden>
              {tab.emoji}
            </span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
