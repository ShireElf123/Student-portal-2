import React, { useEffect, useRef, useState } from "react";
import { soundEffects } from "../utils/soundEffects";
import { speakText, stopSpeaking } from "../utils/speechUtils";
import { triggerCelebrationConfetti } from "../utils/gamification";
import { TOY_STILL } from "../data/toddler/toddlerWorldArt";

export type OpenPlayId = "stir" | "drive" | "pour" | "scoop" | "pet" | "plant" | "comb";

const COPY: Record<OpenPlayId, { title: string; line: string; emoji: string }> = {
  stir: { title: "Stir the pot", line: "Drag round and round. There is no wrong way.", emoji: "🍲" },
  drive: { title: "Drive the bus", line: "Slide the bus. Beep when you like.", emoji: "🚌" },
  pour: { title: "Pour a cup", line: "Hold to pour. Stop when the cup is happy.", emoji: "🥛" },
  scoop: { title: "Scoop the sand", line: "Dip and pour. There is no wrong way.", emoji: "🪣" },
  pet: { title: "Pet the cub", line: "Stroke slowly. The cub likes kind hands.", emoji: "🐻‍❄️" },
  plant: { title: "Water the plant", line: "Hold to rain. The leaves drink.", emoji: "🪴" },
  comb: { title: "Comb the mane", line: "Stroke the comb. There is no wrong way.", emoji: "🐴" },
};

export function ToddlerOpenPlay({
  playId,
  onAddStar,
}: {
  playId: OpenPlayId;
  onAddStar?: () => void;
}) {
  const [done, setDone] = useState(false);
  const credited = useRef(false);
  const [stir, setStir] = useState(0);
  const [busX, setBusX] = useState(18);
  const travel = useRef(0);
  const [fill, setFill] = useState(8);
  const fillRef = useRef(8);
  const pouring = useRef(false);
  const [scoops, setScoops] = useState(0);
  const [pets, setPets] = useState(0);
  const [rain, setRain] = useState(8);
  const rainRef = useRef(8);
  const raining = useRef(false);
  const [strokes, setStrokes] = useState(0);
  const lastX = useRef<number | null>(null);

  const copy = COPY[playId];
  const still = TOY_STILL[playId];

  useEffect(() => {
    const t = setTimeout(() => speakText(copy.line, { pitch: 1.2, rate: 0.92 }), 200);
    return () => {
      clearTimeout(t);
      stopSpeaking();
    };
  }, [copy.line]);

  const finish = () => {
    if (credited.current) return;
    credited.current = true;
    setDone(true);
    soundEffects.playFanfare();
    triggerCelebrationConfetti();
    onAddStar?.();
    speakText("That was kind play. You did it!", { pitch: 1.2 });
  };

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[2rem] border-4 border-white/20 h-44 sm:h-52">
        {still ? (
          <img src={still} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-amber-200 via-orange-300 to-stone-800 text-8xl">
            {copy.emoji}
          </div>
        )}
      </div>
      <div className="text-center">
        <h3 className="text-2xl font-black text-white">{copy.title}</h3>
        <p className="text-white/70 text-sm">{copy.line}</p>
      </div>

      {playId === "stir" && (
        <div
          className="relative mx-auto h-72 w-72 sm:h-80 sm:w-80 cursor-pointer select-none touch-none"
          onPointerDown={(event) => event.currentTarget.setPointerCapture(event.pointerId)}
          onPointerMove={(event) => {
            if (event.buttons === 0) return;
            setStir((value) => {
              const next = value + 10;
              if (next % 50 < 10) soundEffects.playPop();
              if (next >= 240) finish();
              return next;
            });
          }}
        >
          <div className="absolute inset-6 rounded-full bg-gradient-to-br from-orange-500 to-amber-700 shadow-inner border-8 border-amber-900" />
          <div
            className="absolute left-1/2 top-10 h-48 sm:h-56 w-3 origin-bottom rounded-full bg-amber-200"
            style={{ transform: `translateX(-50%) rotate(${stir}deg)` }}
          />
        </div>
      )}

      {playId === "drive" && (
        <div
          className="relative h-64 sm:h-72 overflow-hidden rounded-[2rem] bg-gradient-to-b from-sky-300 to-amber-200 touch-none"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            soundEffects.playPop();
            speakText("Beep beep!", { pitch: 1.3 });
          }}
          onPointerMove={(event) => {
            if (event.buttons === 0) return;
            const rect = event.currentTarget.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 100;
            const clamped = Math.max(8, Math.min(82, x));
            travel.current += Math.abs(clamped - busX);
            setBusX(clamped);
            if (travel.current >= 80) finish();
          }}
        >
          <div className="absolute inset-x-0 bottom-8 h-10 bg-slate-600" />
          <div className="absolute bottom-10 text-6xl" style={{ left: `${busX}%` }}>
            🚌
          </div>
        </div>
      )}

      {playId === "pour" && (
        <div
          className="flex h-64 sm:h-72 items-end justify-center gap-10 touch-none select-none"
          onPointerDown={(event) => {
            pouring.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerUp={() => {
            pouring.current = false;
            if (fillRef.current >= 55) finish();
          }}
          onPointerMove={() => {
            if (!pouring.current) return;
            const next = Math.min(100, fillRef.current + 3);
            fillRef.current = next;
            setFill(next);
            if (next === 40 || next === 70) soundEffects.playPop();
            if (next >= 85) finish();
          }}
        >
          <div className={`text-7xl ${pouring.current ? "-rotate-45" : "-rotate-12"}`}>🥛</div>
          <div className="relative h-36 w-24 overflow-hidden rounded-b-3xl border-4 border-white/40 bg-white/10">
            <div className="absolute inset-x-0 bottom-0 bg-sky-300/90" style={{ height: `${fill}%` }} />
          </div>
        </div>
      )}

      {playId === "scoop" && (
        <button
          type="button"
          data-testid="scoop-sand"
          className="mx-auto flex h-64 w-full max-w-sm touch-none flex-col items-center justify-center rounded-[2rem] bg-gradient-to-b from-sky-200 to-amber-300 text-7xl"
          onPointerDown={(event) => event.currentTarget.setPointerCapture(event.pointerId)}
          onPointerMove={(event) => {
            if (event.buttons === 0) return;
            setScoops((n) => {
              const next = n + 1;
              if (next % 8 === 0) soundEffects.playPop();
              if (next >= 40) finish();
              return next;
            });
          }}
        >
          {done ? "🏰" : scoops > 20 ? "🪣" : "🏖️"}
        </button>
      )}

      {playId === "pet" && (
        <button
          type="button"
          data-testid="pet-cub"
          className="mx-auto flex h-64 w-full max-w-sm touch-none items-center justify-center rounded-[2rem] bg-gradient-to-b from-slate-100 to-sky-400 text-8xl"
          onPointerDown={(event) => event.currentTarget.setPointerCapture(event.pointerId)}
          onPointerMove={(event) => {
            if (event.buttons === 0) return;
            setPets((n) => {
              const next = n + 1;
              if (next % 10 === 0) soundEffects.playPop();
              if (next >= 50) finish();
              return next;
            });
          }}
        >
          {done ? "😴" : "🐻‍❄️"}
        </button>
      )}

      {playId === "plant" && (
        <div
          className="mx-auto flex h-64 w-full max-w-sm touch-none flex-col items-center justify-end rounded-[2rem] bg-gradient-to-b from-sky-300 to-lime-700 pb-6"
          onPointerDown={(event) => {
            raining.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerUp={() => {
            raining.current = false;
            if (rainRef.current >= 50) finish();
          }}
          onPointerMove={() => {
            if (!raining.current) return;
            const next = Math.min(100, rainRef.current + 3);
            rainRef.current = next;
            setRain(next);
            if (next === 40 || next === 70) soundEffects.playPop();
            if (next >= 80) finish();
          }}
        >
          <div className={`text-6xl ${raining.current ? "translate-y-2" : ""}`}>🌧️</div>
          <div className="text-7xl">{rain > 50 ? "🌿" : "🌱"}</div>
        </div>
      )}

      {playId === "comb" && (
        <button
          type="button"
          data-testid="comb-mane"
          className="mx-auto flex h-64 w-full max-w-sm touch-none items-center justify-center rounded-[2rem] bg-gradient-to-b from-amber-100 to-orange-400 text-8xl"
          onPointerDown={(event) => {
            lastX.current = event.clientX;
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (event.buttons === 0 || lastX.current == null) return;
            const delta = Math.abs(event.clientX - lastX.current);
            lastX.current = event.clientX;
            if (delta < 4) return;
            setStrokes((n) => {
              const next = n + 1;
              if (next % 6 === 0) soundEffects.playPop();
              if (next >= 24) finish();
              return next;
            });
          }}
        >
          {done ? "✨🐴" : "🐴"}
        </button>
      )}

      {done && <p className="text-center text-emerald-300 font-black">No wrong answers. Just play.</p>}
    </div>
  );
}
