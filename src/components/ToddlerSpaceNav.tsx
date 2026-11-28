import React from "react";
import { TODDLER_SPACE_TABS, type ToddlerSpaceTabId } from "../data/toddler/toddlerSpaceTabs";

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
    <div
      role="tablist"
      aria-label="Toddler destinations"
      data-testid="toddler-space-nav"
      className={`wonder-launcher grid grid-cols-4 lg:grid-cols-8 gap-1.5 sm:gap-2.5 p-1.5 sm:p-2.5 max-w-6xl mx-auto mb-4 lg:mb-6 ${
        isMeadow
          ? "bg-white/95 border-4 border-white"
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
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2.5 sm:py-3.5 px-1.5 sm:px-2 rounded-[1.15rem] font-black text-[11px] sm:text-sm md:text-base transition-all cursor-pointer select-none min-h-12 ${
              selected
                ? tab.activeClass
                : isMeadow
                ? "text-slate-700 hover:text-slate-900 hover:bg-emerald-50 border-b-4 border-emerald-100/80"
                : "text-white hover:bg-white/15 border-b-4 border-transparent"
            }`}
          >
            <span className="text-2xl sm:text-3xl leading-none" aria-hidden>
              {tab.emoji}
            </span>
            <span className="leading-tight">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
