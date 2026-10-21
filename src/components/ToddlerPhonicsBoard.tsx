import React, { useState } from "react";
import { Volume2 } from "lucide-react";
import { PHONICS_TILES, WORD_FAMILIES, type PhonicsTile, type WordFamily } from "../data/toddler/phonicsBoard";
import { speakText } from "../utils/speechUtils";
import { soundEffects } from "../utils/soundEffects";
import { recordPhonicsLetterTapped } from "../data/toddler/toddlerDailyAdventure";
import { ToddlerLetterTrace } from "./ToddlerLetterTrace";
import { CharacterAnchor } from "./landscape/LandscapeDecorations";

export function ToddlerPhonicsBoard({
  isMeadow,
  onAddStar,
}: {
  isMeadow: boolean;
  onAddStar?: () => void;
}) {
  const [tile, setTile] = useState<PhonicsTile | null>(null);
  const [family, setFamily] = useState<WordFamily | null>(null);
  const [traceOn, setTraceOn] = useState(false);

  const openTile = (next: PhonicsTile) => {
    setTile(next);
    setTraceOn(false);
    setFamily(null);
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
          Tap a letter. Hear the sound. Hear three neighborhood words. Trace the line if you like.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
        {PHONICS_TILES.map((item) => {
          const on = tile?.letter === item.letter;
          return (
            <button
              key={item.letter}
              type="button"
              onClick={() => openTile(item)}
              className={`relative min-h-[5.5rem] p-3 rounded-3xl flex flex-col items-center justify-center cursor-pointer select-none ${
                isMeadow
                  ? on
                    ? "bg-pink-100 border-b-4 border-pink-600 ring-4 ring-pink-400/40 shadow-xl"
                    : "bg-white text-slate-900 border-b-4 border-pink-200 hover:border-pink-400 shadow-md"
                  : on
                    ? "bg-rose-500/30 border-2 border-rose-400 ring-4 ring-rose-400/30 text-white shadow-lg"
                    : "bg-white/[0.03] border-2 border-white/10 hover:border-pink-400/50 text-white shadow-lg"
              }`}
            >
              <span className={`text-4xl sm:text-5xl font-black ${isMeadow ? "text-pink-600" : "text-white"}`}>{item.letter}</span>
              <span className="text-3xl my-0.5">{item.emoji}</span>
              <span className={`text-sm font-black ${isMeadow ? "text-slate-800" : "text-white"}`}>{item.word}</span>
            </button>
          );
        })}
      </div>

      {tile && (
        <div className={`mt-5 rounded-[2rem] border-4 p-4 sm:p-6 ${isMeadow ? "bg-white border-pink-300" : "bg-[#16162a] border-pink-500/40"}`}>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-6xl font-black text-pink-600">{tile.letter}</span>
            <div>
              <p className={`text-2xl font-black ${isMeadow ? "text-slate-900" : "text-white"}`}>
                {tile.letter} for {tile.word} {tile.emoji}
              </p>
              <p className={`text-sm font-semibold ${isMeadow ? "text-slate-700" : "text-white/80"}`}>{tile.sound}</p>
            </div>
            <button
              type="button"
              className="ml-auto min-h-14 rounded-full bg-pink-500 px-5 py-3 text-white font-black shadow-md"
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
                className={`min-h-20 rounded-3xl p-4 text-left border-b-4 ${isMeadow ? "bg-pink-50 border-pink-300 text-slate-900" : "bg-white/10 border-pink-400 text-white"}`}
                onClick={() => speakText(`${tile.letter} in ${example.word}.`, { pitch: 1.16, rate: 0.9 })}
              >
                <span className="text-4xl">{example.emoji}</span>
                <p className="text-xl font-black">{example.word}</p>
              </button>
            ))}
          </div>
          <button
            type="button"
            className={`min-h-14 rounded-full px-6 py-3 font-black border-b-4 ${isMeadow ? "bg-amber-200 border-amber-500 text-amber-950" : "bg-amber-400 border-amber-700 text-amber-950"}`}
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

      <h3 className={`mt-8 mb-3 text-lg sm:text-xl font-black ${isMeadow ? "text-slate-900" : "text-white"}`}>Word families</h3>
      <p className={`text-sm sm:text-base font-semibold mb-3 ${isMeadow ? "text-slate-800" : "text-white/90"}`}>
        Same ending, new beginning. Tap a family. Then tap each word.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {WORD_FAMILIES.map((item) => {
          const on = family?.rime === item.rime;
          return (
            <button
              key={item.rime}
              type="button"
              onClick={() => {
                setFamily(item);
                speakText(`${item.sound} ${item.words.map((word) => word.word).join(", ")}.`, { pitch: 1.15, rate: 0.9 });
              }}
              className={`min-h-24 rounded-3xl p-4 text-left border-b-4 shadow-md ${
                on
                  ? "bg-pink-200 border-pink-600 text-slate-900"
                  : isMeadow
                    ? "bg-white border-pink-300 text-slate-900"
                    : "bg-white/10 border-pink-500 text-white"
              }`}
            >
              <span className="text-3xl">{item.emoji}</span>
              <p className="text-xl font-black">-{item.rime}</p>
              <p className="text-sm font-bold">{item.words.map((word) => word.word).join(" · ")}</p>
            </button>
          );
        })}
      </div>
      {family && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {family.words.map((word) => (
            <button
              key={word.word}
              type="button"
              className={`min-h-24 rounded-[2rem] p-5 text-left border-4 ${isMeadow ? "bg-white border-pink-300 text-slate-900" : "bg-[#16162a] border-pink-400 text-white"}`}
              onClick={() => speakText(`${word.word}. /${family.rime}/.`, { pitch: 1.16, rate: 0.88 })}
            >
              <span className="text-5xl">{word.emoji}</span>
              <p className="text-2xl font-black mt-1">{word.word}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
