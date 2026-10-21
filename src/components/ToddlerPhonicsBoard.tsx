import React, { useMemo, useState } from "react";
import { Volume2 } from "lucide-react";
import {
  BLEND_WORDS,
  PHONICS_TILES,
  SOUND_HUNTS,
  WORD_FAMILIES,
  type BlendWord,
  type PhonicsTile,
  type WordFamily,
} from "../data/toddler/phonicsBoard";
import { speakText } from "../utils/speechUtils";
import { soundEffects } from "../utils/soundEffects";
import { recordPhonicsLetterTapped } from "../data/toddler/toddlerDailyAdventure";
import { ToddlerLetterTrace } from "./ToddlerLetterTrace";
import { CharacterAnchor } from "./landscape/LandscapeDecorations";

type Mode = "letters" | "hunt" | "blend" | "families";

const MODES: { id: Mode; label: string; emoji: string }[] = [
  { id: "letters", label: "Letters", emoji: "🔤" },
  { id: "hunt", label: "First sound", emoji: "👂" },
  { id: "blend", label: "Blend", emoji: "🧩" },
  { id: "families", label: "Families", emoji: "🐱" },
];

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export function ToddlerPhonicsBoard({
  isMeadow,
  onAddStar,
}: {
  isMeadow: boolean;
  onAddStar?: () => void;
}) {
  const [mode, setMode] = useState<Mode>("letters");
  const [tile, setTile] = useState<PhonicsTile | null>(null);
  const [family, setFamily] = useState<WordFamily | null>(null);
  const [traceOn, setTraceOn] = useState(false);
  const [huntIndex, setHuntIndex] = useState(0);
  const [blendIndex, setBlendIndex] = useState(0);
  const [blendStep, setBlendStep] = useState(0);
  const hunt = SOUND_HUNTS[huntIndex % SOUND_HUNTS.length];
  const blend: BlendWord = BLEND_WORDS[blendIndex % BLEND_WORDS.length];
  const huntChoices = useMemo(() => shuffle([hunt.letter, ...hunt.decoys]), [hunt]);

  const panel = isMeadow ? "bg-white border-pink-300 text-slate-900" : "bg-[#16162a] border-pink-500/40 text-white";
  const ghost = isMeadow ? "bg-white border-pink-200 text-slate-900" : "bg-white/10 border-pink-500 text-white";

  const openTile = (next: PhonicsTile) => {
    setTile(next);
    setTraceOn(false);
    speakText(next.sound, { pitch: 1.18, rate: 0.88 });
    recordPhonicsLetterTapped(next.letter);
    soundEffects.playPop();
  };

  return (
    <div className="relative">
      <div className="hidden sm:block">
        <CharacterAnchor emoji="🧸" title="Teddy" subtitle="Tap a letter!" position="top-right" />
      </div>
      <div className="mb-4">
        <h2 className={`text-xl sm:text-2xl font-black flex items-center gap-2 ${isMeadow ? "text-slate-900" : "text-white"}`}>
          <span>🔤</span> ABC Phonics
        </h2>
        <p className={`text-sm sm:text-base font-semibold ${isMeadow ? "text-slate-800" : "text-white/90"}`}>
          Letters, first sounds, blending, families. Neighborhood words. Trace if you like.
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
              if (item.id === "hunt") speakText(hunt.spoken, { pitch: 1.16, rate: 0.9 });
              if (item.id === "blend") speakText("Tap the letters in order.", { pitch: 1.16, rate: 0.9 });
            }}
            className={`min-h-14 rounded-full px-4 py-2 font-black border-b-4 ${
              mode === item.id ? "bg-pink-400 border-pink-700 text-pink-950" : ghost
            }`}
          >
            {item.emoji} {item.label}
          </button>
        ))}
      </div>

      {mode === "letters" && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
            {PHONICS_TILES.map((item) => {
              const on = tile?.letter === item.letter;
              return (
                <button
                  key={item.letter}
                  type="button"
                  onClick={() => openTile(item)}
                  className={`relative min-h-[5.5rem] p-3 rounded-3xl flex flex-col items-center justify-center ${
                    on ? "bg-pink-100 border-b-4 border-pink-600 ring-4 ring-pink-400/40" : ghost
                  }`}
                >
                  <span className={`text-3xl sm:text-4xl font-black ${isMeadow ? "text-pink-600" : "text-white"}`}>
                    {item.letter}
                    <span className="text-2xl font-bold opacity-70">{item.letter.toLowerCase()}</span>
                  </span>
                  <span className="text-3xl">{item.emoji}</span>
                  <span className="text-sm font-black">{item.word}</span>
                </button>
              );
            })}
          </div>
          {tile && (
            <div className={`mt-5 rounded-[2rem] border-4 p-4 sm:p-6 ${panel}`}>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-6xl font-black text-pink-600">
                  {tile.letter}
                  {tile.letter.toLowerCase()}
                </span>
                <div>
                  <p className="text-2xl font-black">
                    {tile.letter} for {tile.word} {tile.emoji}
                  </p>
                  <p className="text-sm font-semibold opacity-80">{tile.sound}</p>
                </div>
                <button
                  type="button"
                  className="ml-auto min-h-14 rounded-full bg-pink-500 px-5 py-3 text-white font-black"
                  onClick={() => speakText(tile.sound, { pitch: 1.18, rate: 0.88 })}
                >
                  <Volume2 className="inline" size={18} /> Hear sound
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {tile.examples.map((example) => (
                  <button
                    key={example.word}
                    type="button"
                    className={`min-h-20 rounded-3xl p-4 text-left border-b-4 ${isMeadow ? "bg-pink-50 border-pink-300" : "bg-white/10 border-pink-400"}`}
                    onClick={() => speakText(`${tile.letter} in ${example.word}.`, { pitch: 1.16, rate: 0.9 })}
                  >
                    <span className="text-4xl">{example.emoji}</span>
                    <p className="text-xl font-black">{example.word}</p>
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="min-h-14 rounded-full px-6 py-3 font-black border-b-4 bg-amber-300 border-amber-600 text-amber-950"
                onClick={() => {
                  setTraceOn((value) => !value);
                  soundEffects.playPop();
                }}
              >
                {traceOn ? "Hide trace" : `Trace ${tile.letter}`}
              </button>
              {traceOn && (
                <div className="mt-4">
                  <ToddlerLetterTrace
                    prompt={`Trace ${tile.letter} for ${tile.word}`}
                    catalog={[{ letter: tile.letter, word: tile.word, emoji: tile.emoji, sound: tile.sound }]}
                    onAddStar={onAddStar}
                  />
                </div>
              )}
            </div>
          )}
        </>
      )}

      {mode === "hunt" && (
        <div className={`rounded-[2rem] border-4 p-5 ${panel}`}>
          <p className="text-sm font-black uppercase tracking-wide opacity-70">Hear the word. Tap the first letter.</p>
          <p className="text-5xl my-3">{hunt.emoji}</p>
          <p className="text-3xl font-black mb-4">{hunt.word}</p>
          <button
            type="button"
            className="min-h-12 mb-4 rounded-full bg-pink-500 px-5 py-2 text-white font-black"
            onClick={() => speakText(hunt.spoken, { pitch: 1.16, rate: 0.9 })}
          >
            Hear again
          </button>
          <div className="flex flex-wrap gap-3">
            {huntChoices.map((letter) => (
              <button
                key={letter}
                type="button"
                data-testid={`hunt-${letter}`}
                className="min-h-20 min-w-20 rounded-3xl bg-pink-100 text-4xl font-black text-pink-950 border-b-4 border-pink-500"
                onClick={() => {
                  if (letter !== hunt.letter) {
                    speakText("Try another.", { pitch: 1.1 });
                    return;
                  }
                  soundEffects.playPop();
                  onAddStar?.();
                  recordPhonicsLetterTapped(letter);
                  const next = (huntIndex + 1) % SOUND_HUNTS.length;
                  setHuntIndex(next);
                  speakText(`Yes. ${hunt.word} starts with ${hunt.letter}. ${SOUND_HUNTS[next].spoken}`, {
                    pitch: 1.16,
                    rate: 0.9,
                  });
                }}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === "blend" && (
        <div className={`rounded-[2rem] border-4 p-5 ${panel}`}>
          <p className="text-sm font-black uppercase tracking-wide opacity-70">Tap the letters in order. Then the word.</p>
          <p className="text-5xl my-3">{blendStep >= 3 ? blend.emoji : "◻️"}</p>
          <p className="text-3xl font-black mb-4">{blendStep >= 3 ? blend.word : "· · ·"}</p>
          <div className="flex flex-wrap gap-3">
            {blend.letters.map((letter, index) => (
              <button
                key={`${blend.word}-${letter}-${index}`}
                type="button"
                data-testid={`blend-${index}`}
                className={`min-h-20 min-w-20 rounded-3xl text-4xl font-black border-b-4 ${
                  index < blendStep ? "bg-emerald-200 border-emerald-600 text-emerald-950" : "bg-pink-100 border-pink-500 text-pink-950"
                }`}
                onClick={() => {
                  if (index !== blendStep) {
                    speakText(letter, { pitch: 1.1 });
                    return;
                  }
                  soundEffects.playPop();
                  speakText(letter, { pitch: 1.2, rate: 0.85 });
                  const next = blendStep + 1;
                  setBlendStep(next);
                  if (next >= 3) {
                    onAddStar?.();
                    speakText(blend.spoken, { pitch: 1.16, rate: 0.88 });
                  }
                }}
              >
                {letter}
              </button>
            ))}
          </div>
          {blendStep >= 3 && (
            <button
              type="button"
              className="mt-4 min-h-14 rounded-full bg-amber-300 px-6 py-3 font-black text-amber-950 border-b-4 border-amber-600"
              onClick={() => {
                setBlendIndex((value) => (value + 1) % BLEND_WORDS.length);
                setBlendStep(0);
                soundEffects.playPop();
              }}
            >
              Next word
            </button>
          )}
        </div>
      )}

      {mode === "families" && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {WORD_FAMILIES.map((item) => (
              <button
                key={item.rime}
                type="button"
                onClick={() => {
                  setFamily(item);
                  speakText(`${item.sound} ${item.words.map((word) => word.word).join(", ")}.`, { pitch: 1.15, rate: 0.9 });
                }}
                className={`min-h-24 rounded-3xl p-4 text-left border-b-4 ${family?.rime === item.rime ? "bg-pink-200 border-pink-600" : ghost}`}
              >
                <span className="text-3xl">{item.emoji}</span>
                <p className="text-xl font-black">-{item.rime}</p>
                <p className="text-sm font-bold">{item.words.map((word) => word.word).join(" · ")}</p>
              </button>
            ))}
          </div>
          {family && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {family.words.map((word) => (
                <button
                  key={word.word}
                  type="button"
                  className={`min-h-24 rounded-[2rem] p-5 text-left border-4 ${panel}`}
                  onClick={() => speakText(`${word.word}. /${family.rime}/.`, { pitch: 1.16, rate: 0.88 })}
                >
                  <span className="text-5xl">{word.emoji}</span>
                  <p className="text-2xl font-black mt-1">{word.word}</p>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
