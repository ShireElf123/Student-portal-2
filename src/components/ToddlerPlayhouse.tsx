import React, { useState } from "react";
import { PLAYHOUSE_SHOWS, type PlayhouseShow } from "../data/toddler/playhouseShows";
import { speakText, stopSpeaking } from "../utils/speechUtils";
import { soundEffects } from "../utils/soundEffects";

export function ToddlerPlayhouse({
  isMeadow,
  onAddStar,
}: {
  isMeadow: boolean;
  onAddStar: (amount?: number) => void;
}) {
  const [show, setShow] = useState<PlayhouseShow | null>(null);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [heard, setHeard] = useState<Record<string, boolean>>({});

  const scene = show?.scenes[sceneIndex];

  const openShow = (next: PlayhouseShow) => {
    stopSpeaking();
    soundEffects.playPop();
    setShow(next);
    setSceneIndex(0);
    setDone(false);
    setHeard({});
    const first = next.scenes[0];
    if (first?.lines[0]) speakText(`${first.lines[0].speaker} says: ${first.lines[0].line}`, { pitch: 1.12 });
  };

  const closeShow = () => {
    stopSpeaking();
    setShow(null);
    setDone(false);
  };

  const speakLine = (key: string, speaker: string, line: string) => {
    soundEffects.playPop();
    setHeard((prev) => ({ ...prev, [key]: true }));
    speakText(`${speaker} says: ${line}`, { pitch: speaker === "Nana" || speaker === "Owl" ? 0.95 : 1.15 });
  };

  const nextScene = () => {
    if (!show) return;
    stopSpeaking();
    if (sceneIndex < show.scenes.length - 1) {
      const next = sceneIndex + 1;
      setSceneIndex(next);
      setHeard({});
      const line = show.scenes[next]?.lines[0];
      if (line) speakText(`${line.speaker} says: ${line.line}`, { pitch: 1.12 });
      return;
    }
    if (!done) {
      setDone(true);
      soundEffects.playFanfare();
      onAddStar(3);
      speakText("The curtain closes. You watched the whole play!", { pitch: 1.15 });
    }
  };

  if (!show) {
    return (
      <div className="relative">
        <div className="mb-4">
          <h2 className={`text-xl sm:text-2xl font-black flex items-center gap-2 ${isMeadow ? "text-slate-900" : "text-white"}`}>
            <span>🎭</span> Playhouse
          </h2>
          <p className={`text-sm sm:text-base font-semibold ${isMeadow ? "text-slate-800" : "text-white/90"}`}>
            Short plays with Teddy, Nana, Rosie, Dot, and friends. Tap a line. Hear the voice. No songs — just talking.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLAYHOUSE_SHOWS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => openShow(item)}
              className={`text-left min-h-40 rounded-[2rem] p-5 border-4 shadow-xl bg-gradient-to-br ${item.coverGradient} text-white`}
            >
              <span className="text-5xl drop-shadow">{item.coverEmoji}</span>
              <p className="mt-3 text-xs font-black uppercase tracking-wider text-white/90">
                {item.scenes.length} scenes · {item.minutes} min
              </p>
              <h3 className="text-xl font-black leading-tight">{item.title}</h3>
              <p className="text-sm font-semibold text-white/95 line-clamp-2">{item.tagline}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-[2rem] border-4 overflow-hidden shadow-2xl ${isMeadow ? "border-amber-300 bg-amber-50" : "border-white/20 bg-[#16162a]"}`}>
      <div className={`flex items-center justify-between gap-3 p-4 ${isMeadow ? "bg-amber-100" : "bg-white/5"}`}>
        <div className="min-w-0">
          <p className={`text-xs font-black uppercase ${isMeadow ? "text-amber-800" : "text-amber-300"}`}>
            Scene {Math.min(sceneIndex + 1, show.scenes.length)} of {show.scenes.length}
          </p>
          <h3 className={`text-lg sm:text-xl font-black truncate ${isMeadow ? "text-slate-900" : "text-white"}`}>{show.title}</h3>
        </div>
        <button
          type="button"
          onClick={closeShow}
          className="min-h-12 px-4 rounded-2xl bg-white text-slate-900 font-black text-sm border-b-4 border-slate-300"
        >
          All plays
        </button>
      </div>

      {done || !scene ? (
        <div className="p-8 text-center space-y-4">
          <div className="text-6xl">🎭</div>
          <h4 className={`text-2xl font-black ${isMeadow ? "text-slate-900" : "text-white"}`}>Curtain.</h4>
          <p className={isMeadow ? "text-slate-800 font-semibold" : "text-white/90 font-semibold"}>
            You watched every scene of {show.title}. +3 stars.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              className="min-h-12 px-5 rounded-2xl bg-amber-400 text-amber-950 font-black border-b-4 border-amber-700"
              onClick={() => openShow(show)}
            >
              Watch again
            </button>
            <button
              type="button"
              className="min-h-12 px-5 rounded-2xl bg-white text-slate-900 font-black border-b-4 border-slate-300"
              onClick={closeShow}
            >
              Another play
            </button>
          </div>
        </div>
      ) : (
        <div className={`p-5 sm:p-8 space-y-4 bg-gradient-to-b ${scene.bgGradient}`}>
          <div className="text-center">
            <div className="text-6xl sm:text-8xl mb-2">{scene.illustration}</div>
            <p className="text-xs font-black uppercase tracking-wider opacity-80">{scene.setting}</p>
            <h4 className="text-2xl font-black">{scene.title}</h4>
          </div>
          <div className="space-y-3 max-w-xl mx-auto">
            {scene.lines.map((line, index) => {
              const key = `${scene.id}-${index}`;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => speakLine(key, line.speaker, line.line)}
                  className={`w-full text-left min-h-16 rounded-3xl p-4 border-4 flex gap-3 items-start ${
                    heard[key] ? "bg-white border-emerald-400" : "bg-white/90 border-white"
                  }`}
                >
                  <span className="text-3xl">{line.emoji}</span>
                  <span>
                    <span className="block text-xs font-black uppercase text-amber-800">{line.speaker}</span>
                    <span className="block text-base sm:text-lg font-black text-slate-900 leading-snug">{line.line}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex justify-between gap-3 pt-2">
            <button
              type="button"
              disabled={sceneIndex === 0}
              onClick={() => {
                stopSpeaking();
                setSceneIndex((i) => Math.max(0, i - 1));
                setHeard({});
              }}
              className="min-h-12 px-4 rounded-2xl bg-white font-black text-sm border-b-4 border-slate-300 disabled:opacity-30"
            >
              Back
            </button>
            <button
              type="button"
              onClick={nextScene}
              className="min-h-12 px-6 rounded-2xl bg-amber-400 text-amber-950 font-black text-sm border-b-4 border-amber-700"
            >
              {sceneIndex === show.scenes.length - 1 ? "Curtain ⭐" : "Next scene"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
