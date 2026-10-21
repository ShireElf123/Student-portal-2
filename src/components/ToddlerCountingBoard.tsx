import React, { useState } from "react";
import { Volume2 } from "lucide-react";
import { COUNTING_CARDS, type CountingCard } from "../data/toddler/countingBoard";
import { speakText } from "../utils/speechUtils";
import { soundEffects } from "../utils/soundEffects";
import { recordCountingCardTapped } from "../data/toddler/toddlerDailyAdventure";
import { CharacterAnchor } from "./landscape/LandscapeDecorations";

function TenFrames({
  filled,
  target,
  onTapNext,
}: {
  filled: number;
  target: number;
  onTapNext: () => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {[0, 10].map((start) => (
        <div key={start} className="grid grid-cols-5 gap-2 max-w-md">
          {Array.from({ length: 10 }, (_, index) => {
            const n = start + index + 1;
            const on = n <= filled && n <= target;
            const next = n === filled + 1 && n <= target;
            return (
              <button
                key={n}
                type="button"
                data-testid={`count-cell-${n}`}
                disabled={n > target}
                onClick={() => {
                  if (next) onTapNext();
                }}
                className={`min-h-14 min-w-14 rounded-2xl border-4 text-xl font-black ${
                  on
                    ? "bg-amber-300 border-amber-700 text-amber-950"
                    : n > target
                      ? "opacity-20 border-slate-300"
                      : next
                        ? "bg-white border-emerald-500 ring-4 ring-emerald-300"
                        : "bg-white/70 border-slate-300"
                }`}
              >
                {on ? n : n > target ? "" : "·"}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function ToddlerCountingBoard({
  isMeadow,
  onAddStar,
  onStartAssessment,
}: {
  isMeadow: boolean;
  onAddStar?: () => void;
  onStartAssessment?: (assessmentId: string) => void;
}) {
  const [card, setCard] = useState<CountingCard | null>(null);
  const [filled, setFilled] = useState(0);
  const [starred, setStarred] = useState<number | null>(null);

  const open = (next: CountingCard) => {
    setCard(next);
    setFilled(0);
    speakText(`${next.word}. ${next.scene} Tap the dots, one by one.`, { pitch: 1.16, rate: 0.9 });
    recordCountingCardTapped(next.num);
    soundEffects.playPop();
  };

  const tapNext = () => {
    if (!card) return;
    const next = filled + 1;
    setFilled(next);
    speakText(String(next), { pitch: 1.2, rate: 1 });
    soundEffects.playPop();
    if (next >= card.num && starred !== card.num) {
      setStarred(card.num);
      onAddStar?.();
      speakText(`${card.word}! ${card.scene}`, { pitch: 1.18, rate: 0.9 });
    }
  };

  return (
    <div className="relative">
      <div className="hidden sm:block">
        <CharacterAnchor emoji="🧸" title="Teddy" subtitle="Count with me!" position="top-right" />
      </div>
      <div className="mb-4">
        <h2 className={`text-xl sm:text-2xl font-black flex items-center gap-2 ${isMeadow ? "text-slate-900" : "text-white"}`}>
          <span>🔢</span> Count to Twenty
        </h2>
        <p className={`text-sm sm:text-base font-semibold ${isMeadow ? "text-slate-800" : "text-white/90"}`}>
          Tap a number. Fill the ten-frames. One tap, one count — all the way to twenty.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {COUNTING_CARDS.map((item) => {
          const on = card?.num === item.num;
          return (
            <button
              key={item.num}
              type="button"
              onClick={() => open(item)}
              className={`min-h-28 rounded-[1.75rem] p-4 text-left border-4 shadow-md ${
                on
                  ? "bg-indigo-200 border-indigo-700 text-slate-900"
                  : isMeadow
                    ? "bg-white border-indigo-200 text-slate-900"
                    : "bg-white/[0.04] border-white/15 text-white"
              }`}
            >
              <p className="text-3xl font-black">{item.num}</p>
              <p className="text-sm font-black uppercase">{item.word}</p>
              <p className="text-2xl mt-1">
                {Array.from({ length: Math.min(item.num, 5) }, () => item.emoji).join("")}
                {item.num > 5 ? "…" : ""}
              </p>
            </button>
          );
        })}
      </div>

      {card && (
        <div className={`mt-5 rounded-[2rem] border-4 p-4 sm:p-6 ${isMeadow ? "bg-white border-indigo-300" : "bg-[#16162a] border-indigo-400/50"}`}>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-6xl font-black text-indigo-600">{card.num}</span>
            <div className="min-w-0">
              <p className={`text-2xl font-black ${isMeadow ? "text-slate-900" : "text-white"}`}>
                {card.word} {card.emoji}
              </p>
              <p className={`text-sm font-semibold ${isMeadow ? "text-slate-700" : "text-white/80"}`}>{card.scene}</p>
            </div>
            <button
              type="button"
              className="ml-auto min-h-14 rounded-full bg-indigo-500 px-5 py-3 text-white font-black"
              onClick={() => speakText(`${card.word}. ${card.scene}`, { pitch: 1.16, rate: 0.9 })}
            >
              <Volume2 className="inline" size={18} /> Hear
            </button>
          </div>
          <p className={`text-sm font-black mb-2 ${isMeadow ? "text-slate-800" : "text-white/90"}`}>
            {filled} of {card.num} · tap the glowing box
          </p>
          <TenFrames filled={filled} target={card.num} onTapNext={tapNext} />
          {filled >= card.num && (
            <p className="mt-4 text-lg font-black text-emerald-700">
              {card.word}! {card.scene}
            </p>
          )}
        </div>
      )}

      {onStartAssessment && (
        <div
          className={`mt-8 p-6 rounded-[2.25rem] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl ${
            isMeadow
              ? "bg-white/95 border-4 border-emerald-300 text-slate-800"
              : "bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-500/30 text-white"
          }`}
        >
          <div>
            <h4 className={`text-base font-black mb-1 ${isMeadow ? "text-slate-900" : "text-white"}`}>
              5-minute math check
            </h4>
            <p className={`text-xs font-semibold ${isMeadow ? "text-slate-600" : "text-white/70"}`}>
              Count three things, name a circle, say which pile has more.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onStartAssessment("toddler-counting-shapes")}
            className="px-5 py-3 rounded-2xl bg-emerald-600 text-white font-black text-sm border-b-4 border-emerald-800"
          >
            Start math check →
          </button>
        </div>
      )}
    </div>
  );
}
