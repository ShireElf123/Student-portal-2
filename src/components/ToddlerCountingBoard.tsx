import React, { useEffect, useState } from "react";
import { Volume2 } from "lucide-react";
import {
  COUNTING_CARDS,
  MAKE_TEN_ROUNDS,
  MORE_LESS_ROUNDS,
  PATTERN_ROUNDS,
  SHAPE_ROUNDS,
  SUBITIZE_ROUNDS,
  type CountingCard,
} from "../data/toddler/countingBoard";
import { speakText } from "../utils/speechUtils";
import { soundEffects } from "../utils/soundEffects";
import { recordCountingCardTapped } from "../data/toddler/toddlerDailyAdventure";
import { CharacterAnchor } from "./landscape/LandscapeDecorations";

type Mode = "frames" | "more" | "ten" | "peek" | "shapes" | "pattern";

const MODES: { id: Mode; label: string; emoji: string }[] = [
  { id: "frames", label: "1–20", emoji: "🔟" },
  { id: "more", label: "More", emoji: "⚖️" },
  { id: "ten", label: "Make 10", emoji: "🥚" },
  { id: "peek", label: "Quick look", emoji: "👀" },
  { id: "shapes", label: "Shapes", emoji: "⬛" },
  { id: "pattern", label: "Next?", emoji: "🔁" },
];

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
  const [mode, setMode] = useState<Mode>("frames");
  const [card, setCard] = useState<CountingCard | null>(null);
  const [filled, setFilled] = useState(0);
  const [starred, setStarred] = useState<number | null>(null);
  const [moreIndex, setMoreIndex] = useState(0);
  const [tenIndex, setTenIndex] = useState(0);
  const [tenFilled, setTenFilled] = useState(MAKE_TEN_ROUNDS[0].have);
  const [peekIndex, setPeekIndex] = useState(0);
  const [peekHidden, setPeekHidden] = useState(false);
  const [shapeIndex, setShapeIndex] = useState(0);
  const [patternIndex, setPatternIndex] = useState(0);

  const more = MORE_LESS_ROUNDS[moreIndex % MORE_LESS_ROUNDS.length];
  const ten = MAKE_TEN_ROUNDS[tenIndex % MAKE_TEN_ROUNDS.length];
  const peek = SUBITIZE_ROUNDS[peekIndex % SUBITIZE_ROUNDS.length];
  const shape = SHAPE_ROUNDS[shapeIndex % SHAPE_ROUNDS.length];
  const pattern = PATTERN_ROUNDS[patternIndex % PATTERN_ROUNDS.length];
  const moreAnswer = more.left === more.right ? "same" : more.left > more.right ? "left" : "right";

  const panel = isMeadow ? "bg-white border-indigo-300 text-slate-900" : "bg-[#16162a] border-indigo-400/50 text-white";
  const ghost = isMeadow ? "bg-white border-indigo-200 text-slate-900" : "bg-white/[0.04] border-white/15 text-white";

  useEffect(() => {
    if (mode !== "peek") return;
    setPeekHidden(false);
    const hide = window.setTimeout(() => setPeekHidden(true), 1400);
    return () => window.clearTimeout(hide);
  }, [mode, peekIndex]);

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
          Ten-frames, more and less, make ten, a quick look, stoop shapes, and what comes next.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {MODES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setMode(item.id);
              soundEffects.playPop();
            }}
            className={`min-h-14 rounded-full px-4 py-2 font-black border-b-4 ${
              mode === item.id ? "bg-indigo-400 border-indigo-700 text-indigo-950" : ghost
            }`}
          >
            {item.emoji} {item.label}
          </button>
        ))}
      </div>

      {mode === "frames" && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            {COUNTING_CARDS.map((item) => (
              <button
                key={item.num}
                type="button"
                onClick={() => open(item)}
                className={`min-h-28 rounded-[1.75rem] p-4 text-left border-4 ${card?.num === item.num ? "bg-indigo-200 border-indigo-700" : ghost}`}
              >
                <p className="text-3xl font-black">{item.num}</p>
                <p className="text-sm font-black uppercase">{item.word}</p>
                <p className="text-2xl mt-1">
                  {Array.from({ length: Math.min(item.num, 5) }, () => item.emoji).join("")}
                  {item.num > 5 ? "…" : ""}
                </p>
              </button>
            ))}
          </div>
          {card && (
            <div className={`mt-5 rounded-[2rem] border-4 p-4 sm:p-6 ${panel}`}>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-6xl font-black text-indigo-600">{card.num}</span>
                <div className="min-w-0">
                  <p className="text-2xl font-black">
                    {card.word} {card.emoji}
                  </p>
                  <p className="text-sm font-semibold opacity-80">{card.scene}</p>
                </div>
                <button
                  type="button"
                  className="ml-auto min-h-14 rounded-full bg-indigo-500 px-5 py-3 text-white font-black"
                  onClick={() => speakText(`${card.word}. ${card.scene}`, { pitch: 1.16, rate: 0.9 })}
                >
                  <Volume2 className="inline" size={18} /> Hear
                </button>
              </div>
              <p className="text-sm font-black mb-2">
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
        </>
      )}

      {mode === "more" && (
        <div className={`rounded-[2rem] border-4 p-5 ${panel}`}>
          <p className="text-lg font-black mb-4">{more.spoken}</p>
          <div className="grid grid-cols-2 gap-4">
            {(["left", "right"] as const).map((side) => {
              const n = side === "left" ? more.left : more.right;
              return (
                <button
                  key={side}
                  type="button"
                  data-testid={`more-${side}`}
                  className="min-h-36 rounded-3xl border-4 border-indigo-300 bg-indigo-50 p-4 text-3xl"
                  onClick={() => {
                    if (moreAnswer !== side) {
                      speakText("Look again.", { pitch: 1.1 });
                      return;
                    }
                    onAddStar?.();
                    const next = (moreIndex + 1) % MORE_LESS_ROUNDS.length;
                    setMoreIndex(next);
                    speakText(`Yes. ${MORE_LESS_ROUNDS[next].spoken}`, { pitch: 1.16, rate: 0.9 });
                    soundEffects.playPop();
                  }}
                >
                  {Array.from({ length: n }, () => more.emoji).join("")}
                  <p className="text-xl font-black mt-2">{n}</p>
                </button>
              );
            })}
          </div>
          {more.left === more.right && (
            <button
              type="button"
              className="mt-4 min-h-14 rounded-full bg-amber-300 px-6 font-black text-amber-950"
              onClick={() => {
                onAddStar?.();
                setMoreIndex((value) => (value + 1) % MORE_LESS_ROUNDS.length);
                soundEffects.playPop();
              }}
            >
              Same
            </button>
          )}
        </div>
      )}

      {mode === "ten" && (
        <div className={`rounded-[2rem] border-4 p-5 ${panel}`}>
          <p className="text-lg font-black mb-3">{ten.spoken}</p>
          <p className="text-sm font-black mb-2">
            {tenFilled} of 10 {ten.emoji}
          </p>
          <TenFrames
            filled={tenFilled}
            target={10}
            onTapNext={() => {
              const next = tenFilled + 1;
              setTenFilled(next);
              speakText(String(next), { pitch: 1.2 });
              soundEffects.playPop();
              if (next >= 10) {
                onAddStar?.();
                speakText("Ten. A full frame.", { pitch: 1.16 });
              }
            }}
          />
          {tenFilled >= 10 && (
            <button
              type="button"
              className="mt-4 min-h-14 rounded-full bg-amber-300 px-6 font-black text-amber-950"
              onClick={() => {
                const next = (tenIndex + 1) % MAKE_TEN_ROUNDS.length;
                setTenIndex(next);
                setTenFilled(MAKE_TEN_ROUNDS[next].have);
                speakText(MAKE_TEN_ROUNDS[next].spoken, { pitch: 1.16, rate: 0.9 });
              }}
            >
              Next ten
            </button>
          )}
        </div>
      )}

      {mode === "peek" && (
        <div className={`rounded-[2rem] border-4 p-5 ${panel}`}>
          <p className="text-lg font-black mb-3">Look. Then tap how many.</p>
          <p className={`text-5xl min-h-16 mb-4 ${peekHidden ? "opacity-0" : ""}`}>
            {Array.from({ length: peek.n }, () => peek.emoji).join(" ")}
          </p>
          <div className="flex flex-wrap gap-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                data-testid={`peek-${n}`}
                className="min-h-16 min-w-16 rounded-3xl bg-indigo-100 text-2xl font-black text-indigo-950 border-b-4 border-indigo-500"
                onClick={() => {
                  if (n !== peek.n) {
                    speakText("Look again.", { pitch: 1.1 });
                    setPeekHidden(false);
                    window.setTimeout(() => setPeekHidden(true), 1400);
                    return;
                  }
                  onAddStar?.();
                  soundEffects.playPop();
                  const next = (peekIndex + 1) % SUBITIZE_ROUNDS.length;
                  setPeekIndex(next);
                  speakText(`${n}.`, { pitch: 1.2 });
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === "shapes" && (
        <div className={`rounded-[2rem] border-4 p-5 ${panel}`}>
          <p className="text-5xl mb-2">{shape.emoji}</p>
          <p className="text-lg font-black mb-4">{shape.spoken}</p>
          <div className="flex flex-wrap gap-3">
            {shape.options.map((option) => (
              <button
                key={option}
                type="button"
                className="min-h-16 rounded-full bg-indigo-100 px-6 py-3 text-xl font-black text-indigo-950 border-b-4 border-indigo-500"
                onClick={() => {
                  if (option !== shape.name) {
                    speakText("Try another shape.", { pitch: 1.1 });
                    return;
                  }
                  onAddStar?.();
                  soundEffects.playPop();
                  const next = (shapeIndex + 1) % SHAPE_ROUNDS.length;
                  setShapeIndex(next);
                  speakText(`${option}. ${SHAPE_ROUNDS[next].spoken}`, { pitch: 1.16, rate: 0.9 });
                }}
              >
              {option}
                </button>
              ))}
          </div>
        </div>
      )}

      {mode === "pattern" && (
        <div className={`rounded-[2rem] border-4 p-5 ${panel}`}>
          <p className="text-lg font-black mb-4">{pattern.spoken}</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {pattern.shown.map((item, index) => (
              <span
                key={`${pattern.id}-${index}`}
                className="min-h-16 min-w-16 rounded-2xl bg-indigo-50 border-4 border-indigo-200 flex items-center justify-center text-4xl"
              >
                {item}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {pattern.options.map((option) => (
              <button
                key={option}
                type="button"
                className="min-h-16 min-w-20 rounded-full bg-indigo-100 px-6 py-3 text-4xl border-b-4 border-indigo-500"
                onClick={() => {
                  if (option !== pattern.answer) {
                    speakText("Try the other one.", { pitch: 1.1 });
                    return;
                  }
                  onAddStar?.();
                  soundEffects.playPop();
                  const next = (patternIndex + 1) % PATTERN_ROUNDS.length;
                  setPatternIndex(next);
                  speakText(`Yes. ${PATTERN_ROUNDS[next].spoken}`, { pitch: 1.16, rate: 0.9 });
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {onStartAssessment && (
        <div
          className={`mt-8 p-6 rounded-[2.25rem] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl ${
            isMeadow ? "bg-white/95 border-4 border-emerald-300 text-slate-800" : "bg-emerald-950/40 border border-emerald-500/30 text-white"
          }`}
        >
          <div>
            <h4 className="text-base font-black mb-1">5-minute math check</h4>
            <p className="text-xs font-semibold opacity-80">Count three things, name a circle, say which pile has more.</p>
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
