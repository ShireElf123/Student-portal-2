import React, { useMemo, useState } from "react";
import { ToddlerLetterTrace } from "./ToddlerLetterTrace";
import type { BubbleWord } from "../data/toddler/toddlerWorldPlayThemes";
import { PHONICS_TILES } from "../data/toddler/phonicsBoard";

const PACKS = ["ABC", "DEF", "GHI", "JKL", "MNO", "PQR", "STU", "VWX", "YZ"];

function catalogForPack(pack: string): BubbleWord[] {
  return pack.split("").map((letter) => {
    const tile = PHONICS_TILES.find((item) => item.letter === letter);
    return {
      letter,
      word: tile?.word ?? letter,
      emoji: tile?.emoji ?? "✍️",
      sound: tile?.sound ?? `${letter}!`,
    };
  });
}

export function ToddlerLetterLane({ onDone }: { onDone: () => void }) {
  const [pack, setPack] = useState("ABC");
  const catalog = useMemo(() => catalogForPack(pack), [pack]);

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">Letter Lane</p>
        <h2 className="text-2xl font-black text-white">Three letters. About five minutes.</h2>
        <p className="text-white/65 text-sm">Pick a pack. Trace, hear the sound, stop when you like. All twenty-six live here.</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {PACKS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setPack(item)}
            className={`min-h-12 rounded-full px-4 py-2 font-black border-b-4 ${
              pack === item ? "bg-amber-300 border-amber-700 text-amber-950" : "bg-white/10 border-white/20 text-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <ToddlerLetterTrace key={pack} catalog={catalog} onAddStar={onDone} />
    </div>
  );
}
