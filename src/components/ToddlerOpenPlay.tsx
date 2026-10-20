import React, { useEffect, useRef, useState } from "react";
import { soundEffects } from "../utils/soundEffects";
import { speakText, stopSpeaking } from "../utils/speechUtils";
import { triggerCelebrationConfetti } from "../utils/gamification";
import { TOY_STILL } from "../data/toddler/toddlerWorldArt";

export type OpenPlayId = "stir" | "drive" | "pour";

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

  const copy =
    playId === "stir"
      ? { title: "Stir the pot", line: "Drag round and round. There is no wrong way.", still: TOY_STILL.stir }
      : playId === "drive"
        ? { title: "Drive the bus", line: "Slide the bus. Beep when you like.", still: TOY_STILL.drive }
        : { title: "Pour a cup", line: "Hold to pour. Stop when the cup is happy.", still: TOY_STILL.pour };

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
      <div className="overflow-hidden rounded-[2rem] border-4 border-white/20 h-36">
        <img src={copy.still} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="text-center">
        <h3 className="text-2xl font-black text-white">{copy.title}</h3>
        <p className="text-white/70 text-sm">{copy.line}</p>
      </div>

      {playId === "stir" && (
        <div
          className="relative mx-auto h-64 w-64 cursor-pointer select-none touch-none"
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
            className="absolute left-1/2 top-8 h-40 w-3 origin-bottom rounded-full bg-amber-200"
            style={{ transform: `translateX(-50%) rotate(${stir}deg)` }}
          />
        </div>
      )}

      {playId === "drive" && (
        <div
          className="relative h-48 overflow-hidden rounded-[2rem] bg-gradient-to-b from-sky-300 to-amber-200 touch-none"
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
          className="flex h-56 items-end justify-center gap-10 touch-none select-none"
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

      {done && <p className="text-center text-emerald-300 font-black">No wrong answers. Just play.</p>}
    </div>
  );
}
