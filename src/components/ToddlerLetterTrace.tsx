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

/** A first stroke must not count as a finished letter. */
export const TRACE_MIN_COVERAGE = 0.62;
export const TRACE_MIN_BAND = 0.3;
export const TRACE_SETTLE_MS = 850;
export const TRACE_MIN_INK = 220;

export function letterFromPrompt(prompt: string | undefined): string | null {
  if (!prompt) return null;
  const named =
    prompt.match(/\bTrace(?:\s+the\s+letter)?\s+([A-Za-z])\b/i) ||
    prompt.match(/\b([A-Za-z])\s+for\s+[A-Za-z]/);
  const letter = (named?.[1] ?? "").toUpperCase();
  return /[A-Z]/.test(letter) ? letter : null;
}

export function uniqueLetters(catalog: BubbleWord[], maxLetters = 3): BubbleWord[] {
  const seen = new Set<string>();
  const next: BubbleWord[] = [];
  for (const item of catalog) {
    const letter = item.letter.toUpperCase().slice(0, 1);
    if (!/[A-Z]/.test(letter) || seen.has(letter)) continue;
    seen.add(letter);
    next.push({ ...item, letter });
    if (next.length >= maxLetters) break;
  }
  return next.length >= 1 ? next : FALLBACK.slice(0, maxLetters);
}

export function pickTraceDeck(
  catalog: BubbleWord[] | undefined,
  options?: { prompt?: string; maxLetters?: number },
): BubbleWord[] {
  const pool = catalog && catalog.length ? catalog : FALLBACK;
  const focus = letterFromPrompt(options?.prompt);
  if (focus) {
    const hit =
      pool.find((item) => item.letter.toUpperCase() === focus) ||
      FALLBACK.find((item) => item.letter === focus) ||
      { letter: focus, word: focus, emoji: "✍️", sound: `${focus}!` };
    return [{ ...hit, letter: focus }];
  }
  return uniqueLetters(pool, options?.maxLetters ?? 3);
}

export function sampleLetterCoverage(
  mask: Uint8ClampedArray,
  ink: Uint8ClampedArray,
  width: number,
  height: number,
): { coverage: number; topCoverage: number; bottomCoverage: number } {
  let minY = height;
  let maxY = 0;
  const letter: number[] = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alphaIndex = (y * width + x) * 4 + 3;
      if ((mask[alphaIndex] ?? 0) < 80) continue;
      letter.push(alphaIndex, y);
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  if (!letter.length) return { coverage: 0, topCoverage: 0, bottomCoverage: 0 };
  const split = minY + (maxY - minY) * 0.33;
  const splitBottom = minY + (maxY - minY) * 0.67;
  let hit = 0;
  let top = 0;
  let topHit = 0;
  let bottom = 0;
  let bottomHit = 0;
  for (let i = 0; i < letter.length; i += 2) {
    const alphaIndex = letter[i];
    const y = letter[i + 1];
    const painted = (ink[alphaIndex] ?? 0) > 40;
    hit += painted ? 1 : 0;
    if (y <= split) {
      top += 1;
      topHit += painted ? 1 : 0;
    } else if (y >= splitBottom) {
      bottom += 1;
      bottomHit += painted ? 1 : 0;
    }
  }
  return {
    coverage: hit / (letter.length / 2),
    topCoverage: top === 0 ? 1 : topHit / top,
    bottomCoverage: bottom === 0 ? 1 : bottomHit / bottom,
  };
}

export function isTraceStrokeComplete(sample: {
  coverage: number;
  topCoverage: number;
  bottomCoverage: number;
  inkDistance: number;
  minInk?: number;
}): boolean {
  return (
    sample.coverage >= TRACE_MIN_COVERAGE &&
    sample.topCoverage >= TRACE_MIN_BAND &&
    sample.bottomCoverage >= TRACE_MIN_BAND &&
    sample.inkDistance >= (sample.minInk ?? TRACE_MIN_INK)
  );
}

export function ToddlerLetterTrace({
  catalog,
  prompt,
  onAddStar,
}: {
  catalog?: BubbleWord[];
  prompt?: string;
  onAddStar?: () => void;
}) {
  const deck = pickTraceDeck(catalog, { prompt });
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [stars, setStars] = useState(0);
  const [fill, setFill] = useState(0);
  const [guidePx, setGuidePx] = useState(120);
  const inkRef = useRef<HTMLCanvasElement>(null);
  const maskRef = useRef<Uint8ClampedArray | null>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const inked = useRef(0);
  const finishedRound = useRef(false);
  const settleTimer = useRef<number | null>(null);
  const minInk = useRef(TRACE_MIN_INK);
  const fontPx = useRef(120);
  const current = deck[index] ?? deck[0];

  const clearSettle = () => {
    if (settleTimer.current != null) {
      window.clearTimeout(settleTimer.current);
      settleTimer.current = null;
    }
  };

  const sizeCanvas = () => {
    const canvas = inkRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    fontPx.current = Math.floor(rect.height * 0.72);
    setGuidePx(fontPx.current);
    const mask = document.createElement("canvas");
    mask.width = canvas.width;
    mask.height = canvas.height;
    const mctx = mask.getContext("2d");
    if (!mctx) return;
    mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    mctx.fillStyle = "#000";
    mctx.font = `700 ${fontPx.current}px system-ui, ui-rounded, Arial`;
    mctx.textAlign = "center";
    mctx.textBaseline = "middle";
    mctx.fillText(current.letter, rect.width / 2, rect.height / 2 + 6);
    const maskData = mctx.getImageData(0, 0, mask.width, mask.height);
    maskRef.current = maskData.data;
    let letterPixels = 0;
    for (let i = 3; i < maskData.data.length; i += 16) {
      if (maskData.data[i] >= 80) letterPixels += 1;
    }
    minInk.current = Math.max(TRACE_MIN_INK, Math.sqrt(Math.max(letterPixels, 1)) * 3.2);
    inked.current = 0;
    finishedRound.current = false;
    setFill(0);
    clearSettle();
  };

  useEffect(() => {
    sizeCanvas();
    const onResize = () => sizeCanvas();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearSettle();
    };
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
    ctx.lineWidth = 20;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    inked.current += Math.hypot(to.x - from.x, to.y - from.y);
  };

  const readCoverage = () => {
    const canvas = inkRef.current;
    const mask = maskRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !mask || !ctx) return { coverage: 0, topCoverage: 0, bottomCoverage: 0 };
    const ink = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    return sampleLetterCoverage(mask, ink, canvas.width, canvas.height);
  };

  const commitRound = () => {
    if (finishedRound.current || done) return;
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
      window.setTimeout(() => setIndex((value) => value + 1), 900);
    }
  };

  const maybeFinish = () => {
    if (finishedRound.current || done) return;
    const sample = readCoverage();
    setFill(Math.min(1, sample.coverage / TRACE_MIN_COVERAGE));
    if (
      !isTraceStrokeComplete({
        ...sample,
        inkDistance: inked.current,
        minInk: minInk.current,
      })
    ) {
      clearSettle();
      return;
    }
    if (settleTimer.current != null) return;
    settleTimer.current = window.setTimeout(() => {
      settleTimer.current = null;
      commitRound();
    }, TRACE_SETTLE_MS);
  };

  const start = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    drawing.current = true;
    last.current = point(event);
    soundEffects.unlock();
    clearSettle();
  };

  const move = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !last.current) return;
    const next = point(event);
    paint(last.current, next);
    last.current = next;
  };

  const endStroke = (shouldScore: boolean) => {
    drawing.current = false;
    last.current = null;
    if (shouldScore) maybeFinish();
  };

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <p className="text-xs font-black uppercase tracking-widest text-amber-300">Finger trace</p>
        <h3 className="text-2xl font-black text-white">
          {current.emoji} {current.letter} is for {current.word}
        </h3>
        <p className="text-white/75 text-base">Trace the whole letter. Lift and keep going if you need another stroke.</p>
      </div>

      <div className="relative min-h-[20rem] h-[min(62vh,34rem)] rounded-[2rem] bg-white overflow-hidden border-[6px] border-amber-300 shadow-inner">
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center text-amber-200/80 font-black select-none"
          style={{ fontSize: guidePx, lineHeight: 1 }}
        >
          {current.letter}
        </div>
        <canvas
          ref={inkRef}
          className="absolute inset-0 h-full w-full touch-none"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={() => endStroke(true)}
          onPointerCancel={() => endStroke(false)}
          aria-label={`Trace the letter ${current.letter}`}
        />
      </div>

      <div className="h-2 rounded-full bg-white/15 overflow-hidden">
        <div
          className="h-full rounded-full bg-amber-400 transition-all"
          style={{ width: `${Math.round(Math.min(1, fill) * 100)}%` }}
        />
      </div>
      <p className="text-center text-white/60 text-sm font-bold">
        {fill < 1 ? "Keep tracing the letter." : "Almost… finish the last bits."}
      </p>

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
