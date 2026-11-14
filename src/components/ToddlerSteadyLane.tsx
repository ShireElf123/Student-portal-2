import React, { useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import {
  pathToD,
  resamplePath,
  stepSteadyLane,
  type Point,
  type SteadyTrack,
} from "../data/toddler/focusSteady";
import { soundEffects } from "../utils/soundEffects";
import { speakText } from "../utils/speechUtils";

const LOOKAHEAD = 10;

export function ToddlerSteadyLane({
  track,
  isMeadow,
  onWin,
}: {
  track: SteadyTrack;
  isMeadow: boolean;
  onWin: () => void;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const samples = useMemo(() => resamplePath(track.points), [track.id, track.points]);
  const along = useRef(0);
  const started = useRef(false);
  const drawing = useRef(false);
  const lastFinger = useRef<Point | null>(null);
  const lastTime = useRef(0);
  const won = useRef(false);
  const [ink, setInk] = useState<Point[]>([]);
  const [buzz, setBuzz] = useState<"off" | "fast" | null>(null);
  const [fill, setFill] = useState(0);
  const d = pathToD(track.points);
  const start = track.points[0];
  const end = track.points[track.points.length - 1];

  const reset = () => {
    along.current = 0;
    started.current = false;
    drawing.current = false;
    lastFinger.current = null;
    lastTime.current = 0;
    won.current = false;
    setInk([]);
    setBuzz(null);
    setFill(0);
  };

  useEffect(() => {
    reset();
    speakText(track.spoken, { pitch: 1.1, rate: 0.88 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track.id]);

  const toPoint = (event: React.PointerEvent<SVGSVGElement>): Point | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    return {
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    };
  };

  const fail = (why: "off" | "fast") => {
    drawing.current = false;
    started.current = false;
    along.current = 0;
    lastFinger.current = null;
    setInk([]);
    setFill(0);
    setBuzz(why);
    soundEffects.playBuzz();
    speakText(why === "fast" ? "Too fast. Slow." : "Buzz. Stay in the gold.", { pitch: 1.05, rate: 0.9 });
  };

  const move = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!drawing.current || won.current) return;
    const finger = toPoint(event);
    if (!finger) return;
    const now = performance.now();
    const dt = lastTime.current ? now - lastTime.current : 16;
    const step = stepSteadyLane({
      samples,
      along: along.current,
      finger,
      started: started.current,
      lane: track.lane,
      lookahead: LOOKAHEAD,
      lastFinger: lastFinger.current,
      dtMs: Math.max(8, dt),
      maxSpeed: track.maxSpeed,
    });
    lastTime.current = now;
    lastFinger.current = finger;
    if (step.result === "need-start") return;
    if (step.result === "off" || step.result === "skip") {
      fail("off");
      return;
    }
    if (step.result === "fast") {
      fail("fast");
      return;
    }
    started.current = true;
    along.current = step.along;
    setInk((prev) => {
      const next = [...prev, finger];
      return next.length > 240 ? next.slice(-240) : next;
    });
    setFill(along.current / Math.max(samples.length - 1, 1));
    setBuzz(null);
    if (step.result === "win") {
      won.current = true;
      drawing.current = false;
      soundEffects.playSuccessChime();
      speakText("Yes. Slow and steady.", { pitch: 1.12, rate: 0.9 });
      onWin();
    }
  };

  return (
    <div>
      <p className="text-5xl mb-1">{track.emoji}</p>
      <p className="text-2xl font-black">{track.title}</p>
      <p className="text-base font-black mb-2">{track.spoken}</p>
      <p className="text-sm font-black opacity-80 mb-2">
        Green start → gold path → star. Hit the red edge and it buzzes. Slow.
      </p>
      <div className={`relative rounded-[1.75rem] overflow-hidden border-4 ${buzz ? "border-rose-500 animate-pulse" : isMeadow ? "border-teal-400" : "border-teal-300"}`}>
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          className="w-full aspect-square touch-none bg-teal-50 cursor-crosshair"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            drawing.current = true;
            lastTime.current = performance.now();
            const finger = toPoint(event);
            if (finger) {
              lastFinger.current = finger;
              const step = stepSteadyLane({
                samples,
                along: 0,
                finger,
                started: false,
                lane: track.lane,
                lookahead: LOOKAHEAD,
                lastFinger: null,
                dtMs: 16,
                maxSpeed: track.maxSpeed,
              });
              if (step.result === "ok") {
                started.current = true;
                setBuzz(null);
              } else {
                speakText("Start on the green dot.", { pitch: 1.1, rate: 0.9 });
              }
            }
          }}
          onPointerMove={move}
          onPointerUp={() => {
            drawing.current = false;
            started.current = false;
            along.current = 0;
            lastFinger.current = null;
            if (!won.current) {
              setInk([]);
              setFill(0);
            }
          }}
          onPointerCancel={() => {
            drawing.current = false;
          }}
        >
          <path d={d} fill="none" stroke="#fb7185" strokeWidth={track.lane * 2 + 6} strokeLinecap="round" strokeLinejoin="round" />
          <path d={d} fill="none" stroke="#facc15" strokeWidth={track.lane * 2 - 2} strokeLinecap="round" strokeLinejoin="round" />
          <path d={d} fill="none" stroke="#0f766e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 3" />
          {ink.length > 1 && (
            <polyline
              points={ink.map((point) => `${point.x},${point.y}`).join(" ")}
              fill="none"
              stroke="#0f172a"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          <circle cx={start.x} cy={start.y} r="5.2" fill="#22c55e" stroke="#14532d" strokeWidth="1.2" />
          <text x={start.x} y={start.y + 1.6} textAnchor="middle" fontSize="4" fontWeight="800" fill="#052e16">
            go
          </text>
          <circle cx={end.x} cy={end.y} r="5.6" fill="#fbbf24" stroke="#92400e" strokeWidth="1.2" />
          <text x={end.x} y={end.y + 1.8} textAnchor="middle" fontSize="5">
            ★
          </text>
        </svg>
        {buzz && (
          <p className="absolute inset-x-0 bottom-3 text-center text-lg font-black text-rose-700">
            {buzz === "fast" ? "Too fast — slow" : "Buzz! Stay in the gold"}
          </p>
        )}
      </div>
      <div className="h-3 mt-3 rounded-full bg-teal-100 overflow-hidden border border-teal-400">
        <div className="h-full bg-teal-500" style={{ width: `${Math.round(fill * 100)}%` }} />
      </div>
      <button
        type="button"
        className="mt-3 min-h-12 rounded-full bg-white px-5 py-2 font-black text-teal-950 border-b-4 border-teal-600 inline-flex items-center gap-2"
        onClick={() => {
          reset();
          speakText("Again. Green dot. Slow.", { pitch: 1.1, rate: 0.9 });
        }}
      >
        <RotateCcw size={16} /> Try again
      </button>
    </div>
  );
}
