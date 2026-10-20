import React from "react";
import { ToddlerLetterTrace } from "./ToddlerLetterTrace";
import type { BubbleWord } from "../data/toddler/toddlerWorldPlayThemes";
import { getWorldPlayTheme } from "../data/toddler/toddlerWorldPlayThemes";

const LANE_LETTERS = ["A", "B", "S", "T", "M", "P"];

function laneCatalog(): BubbleWord[] {
  const theme = getWorldPlayTheme("learning-world");
  const picked: BubbleWord[] = [];
  for (const letter of LANE_LETTERS) {
    const hit = theme.bubbles.find((item) => item.letter === letter);
    if (hit) picked.push(hit);
    if (picked.length >= 3) break;
  }
  return picked;
}

export function ToddlerLetterLane({ onDone }: { onDone: () => void }) {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">Letter Lane</p>
        <h2 className="text-2xl font-black text-white">Three letters. About five minutes.</h2>
        <p className="text-white/65 text-sm">No streak. Trace, hear the sound, stop when you like.</p>
      </div>
      <ToddlerLetterTrace catalog={laneCatalog()} onAddStar={onDone} />
    </div>
  );
}
