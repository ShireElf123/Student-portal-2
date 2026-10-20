import React, { useEffect, useRef, useState } from "react";
import { RotateCcw, Star } from "lucide-react";
import { soundEffects } from "../utils/soundEffects";
import { speakText, stopSpeaking } from "../utils/speechUtils";
import { triggerCelebrationConfetti } from "../utils/gamification";
import { recordLearningEvent, getActiveLearnerId } from "../utils/learnerBrain";
import type { BubbleWord } from "../data/toddler/toddlerWorldPlayThemes";

const FALLBACK: BubbleWord[] = [
  { letter: "A", word: "Apple", emoji: "🍎", sound: "A says /æ/! Apple!" },
  { letter: "B", word: "Bus", emoji: "🚌", sound: "B says /b/! Bus!" },
  { letter: "S", word: "Sun", emoji: "☀️", sound: "S says /s/! Sun!" },
  { letter: "M", word: "Moon", emoji: "🌙", sound: "M says /m/! Moon!" },
];

function uniqueLetters(catalog: BubbleWord[]): BubbleWord[] {
  const seen = new Set<string>();
  const next: BubbleWord[] = [];
  for (const item of catalog) {
    const letter = item.letter.toUpperCase().slice(0, 1);
    if (!/[A-Z]/.test(letter) || seen.has(letter)) continue;
    seen.add(letter);
    next.push({ ...item, letter });
    if (next.length >= 6) break;
  }
  return next.length >= 3 ? next : FALLBACK;
}

export function ToddlerLetterTrace({
  catalog,
  onAddStar,
}: {
  catalog?: BubbleWord[];
  onAddStar?: () => void;
}) {
  const deck = uniqueLetters(catalog && catalog.length ? catalog : FALLBACK);
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [stars, setStars] = useState(0);
  const inkRef = useRef<HTMLCanvasElement>(null);
  const maskRef = useRef<Uint8ClampedArray | null>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const inked = useRef(0);
  const finishedRound = useRef(false);
  const current = deck[index] ?? deck[0];

  const sizeCanvas = () => {
    const canvas = inkRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    const mask = document.createElement("canvas");
    mask.width = canvas.width;
    mask.height = canvas.height;
    const mctx = mask.getContext("2d");
    if (!mctx) return;
    mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    mctx.fillStyle = "#000";
    mctx.font = `700 ${Math.floor(rect.height * 0.72)}px system-ui, ui-rounded, Arial`;
    mctx.textAlign = "center";
    mctx.textBaseline = "middle";
    mctx.fillText(current.letter, rect.width / 2, rect.height / 2 + 6);
    maskRef.current = mctx.getImageData(0, 0, mask.width, mask.height).data;
    inked.current = 0;
    finishedRound.current = false;
  };

  useEffect(() => {
    sizeCanvas();
    const onResize = () => sizeCanvas();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current.letter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      speakText(`Trace the letter ${current.letter}. ${current.sound}`, { pitch: 1.2, rate: 0.92 });
    }, 200);
    return () => {
      clearTimeout(timer);
      stopSpeaking();
    };
  }, [current.letter, current.sound]);

  const point = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const paint = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const canvas = inkRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 22;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    inked.current += Math.hypot(to.x - from.x, to.y - from.y);
  };

  const coverage = () => {
    const canvas = inkRef.current;
    const mask = maskRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !mask || !ctx) return 0;
    const ink = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let letterPixels = 0;
    let hit = 0;
    for (let i = 3; i < mask.length; i += 16) {
      if (mask[i] < 80) continue;
      letterPixels += 1;
      if (ink[i] > 40) hit += 1;
    }
    return letterPixels === 0 ? 0 : hit / letterPixels;
  };

  const maybeFinish = () => {
    if (finishedRound.current || done) return;
    if (inked.current < 90) return;
    if (coverage() < 0.32) return;
    finishedRound.current = true;
    soundEffects.playSuccessChime();
    speakText(`Yes! ${current.sound}`, { pitch: 1.25, rate: 0.92 });
    try {
      recordLearningEvent({
        learnerId: getActiveLearnerId(),
        activityId: "toddler-letter-trace",
        experienceId: "letter-trace",
        contentId: `trace-${current.letter}`,
        eventType: "question_answered",
        activityType: "phonics-pop",
        activityTitle: `Trace ${current.letter}`,
        domain: "reading",
        gradeBand: "toddler",
        result: "success",
        score: 100,
        skillId: "read-k1-alphabet-letters",
        difficulty: "easy",
        attempts: 1,
        hintsUsed: 0,
      });
    } catch (error) {
      console.error("Failed to record letter trace:", error);
    }
    if (index >= deck.length - 1) {
      setDone(true);
      setStars(3);
      triggerCelebrationConfetti();
      soundEffects.playFanfare();
      onAddStar?.();
      speakText("Beautiful letters! You traced them all!", { pitch: 1.2 });
    } else {
      setStars((value) => value + 1);
      setTimeout(() => setIndex((value) => value + 1), 900);
    }
  };

  const start = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    drawing.current = true;
    last.current = point(event);
    soundEffects.unlock();
  };

  const move = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !last.current) return;
    const next = point(event);
    paint(last.current, next);
    last.current = next;
  };

  const end = () => {
    drawing.current = false;
    last.current = null;
    maybeFinish();
  };

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <p className="text-xs font-black uppercase tracking-widest text-amber-300">Finger trace</p>
        <h3 className="text-2xl font-black text-white">
          {current.emoji} {current.letter} is for {current.word}
        </h3>
        <p className="text-white/70 text-sm">Draw on the big letter with your finger.</p>
      </div>

      <div className="relative h-72 sm:h-80 rounded-[2rem] bg-white overflow-hidden border-4 border-amber-300 shadow-inner">
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center text-amber-200/80 font-black select-none"
          style={{ fontSize: "14rem", lineHeight: 1 }}
        >
          {current.letter}
        </div>
        <canvas
          ref={inkRef}
          className="absolute inset-0 h-full w-full touch-none"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
          aria-label={`Trace the letter ${current.letter}`}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {deck.map((item, i) => (
            <span
              key={item.letter}
              className={`h-2.5 w-6 rounded-full ${i <= index ? "bg-amber-400" : "bg-white/20"}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-amber-300 text-sm font-black">
            <Star size={14} className="fill-amber-300" /> {stars}
          </span>
          <button
            type="button"
            onClick={() => {
              sizeCanvas();
              soundEffects.playPop();
            }}
            className="inline-flex items-center gap-1 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/20"
          >
            <RotateCcw size={14} /> Clear
          </button>
        </div>
      </div>

      {done && (
        <p className="text-center text-emerald-300 font-black">All letters traced. You did it!</p>
      )}
    </div>
  );
}
