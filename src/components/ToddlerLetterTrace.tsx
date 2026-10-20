import React, { useEffect, useRef, useState } from "react";
import { RotateCcw, Star } from "lucide-react";
import { soundEffects } from "../utils/soundEffects";
import { speakText, stopSpeaking } from "../utils/speechUtils";
import { triggerCelebrationConfetti } from "../utils/gamification";
import { recordLearningEvent, getActiveLearnerId } from "../utils/learnerBrain";
import type { BubbleWord } from "../data/toddler/toddlerWorldPlayThemes";
import { strokesForLetter, type TracePoint } from "../data/toddler/toddlerLetterStrokes";

const FALLBACK: BubbleWord[] = [
  { letter: "A", word: "Apple", emoji: "🍎", sound: "A says /æ/! Apple!" },
  { letter: "B", word: "Bus", emoji: "🚌", sound: "B says /b/! Bus!" },
  { letter: "S", word: "Sun", emoji: "☀️", sound: "S says /s/! Sun!" },
  { letter: "M", word: "Moon", emoji: "🌙", sound: "M says /m/! Moon!" },
];

/** Finish only when the finger is at the end of this writing line. */
export const STROKE_HIT_RADIUS = 16;
export const STROKE_START_RADIUS = 22;
export const STROKE_INK_RADIUS = 20;
export const STROKE_END = 0.93;
export const STROKE_END_RADIUS = 14;
export const STROKE_TRAVEL = 0.4;
export const STROKE_SAMPLE = 2.4;
export const STROKE_LOOKAHEAD = 5;

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

export function pathLength(points: TracePoint[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    total += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  }
  return total;
}

export function resampleStroke(points: TracePoint[], spacing = STROKE_SAMPLE): TracePoint[] {
  if (points.length === 0) return [];
  if (points.length === 1) return [points[0]];
  const out: TracePoint[] = [{ ...points[0] }];
  let carry = 0;
  for (let i = 1; i < points.length; i += 1) {
    let x0 = points[i - 1].x;
    let y0 = points[i - 1].y;
    const x1 = points[i].x;
    const y1 = points[i].y;
    let remaining = Math.hypot(x1 - x0, y1 - y0);
    if (remaining === 0) continue;
    while (carry + remaining >= spacing) {
      const t = (spacing - carry) / remaining;
      x0 += (x1 - x0) * t;
      y0 += (y1 - y0) * t;
      out.push({ x: x0, y: y0 });
      remaining = Math.hypot(x1 - x0, y1 - y0);
      carry = 0;
    }
    carry += remaining;
  }
  const last = points[points.length - 1];
  const tail = out[out.length - 1];
  if (!tail || Math.hypot(tail.x - last.x, tail.y - last.y) > 0.4) out.push({ ...last });
  return out;
}

export function distanceToStroke(point: TracePoint, samples: TracePoint[]): number {
  let best = Number.POSITIVE_INFINITY;
  for (const sample of samples) {
    const next = Math.hypot(sample.x - point.x, sample.y - point.y);
    if (next < best) best = next;
  }
  return best;
}

export function advanceAlongStroke(
  samples: TracePoint[],
  along: number,
  finger: TracePoint,
  radius = STROKE_HIT_RADIUS,
  lookahead = STROKE_LOOKAHEAD,
): number {
  let next = along;
  const from = Math.max(0, along - 2);
  const to = Math.min(samples.length - 1, along + lookahead);
  for (let i = from; i <= to; i += 1) {
    if (Math.hypot(samples[i].x - finger.x, samples[i].y - finger.y) <= radius) {
      next = Math.max(next, i);
    }
  }
  return next;
}

export function strokeProgress(along: number, total: number): number {
  if (total <= 1) return along > 0 ? 1 : 0;
  return Math.min(1, along / (total - 1));
}

export function isStrokePathComplete(sample: {
  along: number;
  total: number;
  travel: number;
  pathLength: number;
  startedAtStart: boolean;
  endDistance: number;
}): boolean {
  return (
    sample.startedAtStart &&
    strokeProgress(sample.along, sample.total) >= STROKE_END &&
    sample.travel >= sample.pathLength * STROKE_TRAVEL &&
    sample.endDistance <= STROKE_END_RADIUS
  );
}

function polyline(points: TracePoint[]): string {
  return points.map((point) => `${point.x},${point.y}`).join(" ");
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
  const [strokeIndex, setStrokeIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [stars, setStars] = useState(0);
  const [fill, setFill] = useState(0);
  const [missStart, setMissStart] = useState(false);
  const [box, setBox] = useState({ size: 0, left: 0, top: 0 });
  const padRef = useRef<HTMLDivElement>(null);
  const inkRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<TracePoint | null>(null);
  const lastCanvas = useRef<{ x: number; y: number } | null>(null);
  const samples = useRef<TracePoint[]>([]);
  const along = useRef(0);
  const startedAtStart = useRef(false);
  const travel = useRef(0);
  const finishedRound = useRef(false);
  const current = deck[index] ?? deck[0];
  const strokes = strokesForLetter(current.letter);
  const activeStroke = strokes[Math.min(strokeIndex, strokes.length - 1)] ?? strokes[0];

  const toCanvas = (point: TracePoint, rect: DOMRect) => ({
    x: (point.x / 100) * rect.width,
    y: (point.y / 100) * rect.height,
  });

  const toNorm = (event: React.PointerEvent<HTMLCanvasElement>): TracePoint => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    };
  };

  const measurePad = () => {
    const pad = padRef.current;
    if (!pad) return;
    const rect = pad.getBoundingClientRect();
    const inset = 16;
    const size = Math.max(96, Math.min(rect.width, rect.height) - inset * 2);
    const left = (rect.width - size) / 2;
    const top = (rect.height - size) / 2;
    setBox((prev) =>
      prev.size === size && prev.left === left && prev.top === top ? prev : { size, left, top },
    );
  };

  const sizeCanvas = () => {
    const canvas = inkRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const nextWidth = Math.round(rect.width * dpr);
    const nextHeight = Math.round(rect.height * dpr);
    if (canvas.width === nextWidth && canvas.height === nextHeight) return;
    canvas.width = nextWidth;
    canvas.height = nextHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const resetStroke = (nextIndex = strokeIndex) => {
    const stroke = strokes[nextIndex] ?? strokes[0];
    samples.current = resampleStroke(stroke);
    along.current = 0;
    startedAtStart.current = false;
    travel.current = 0;
    drawing.current = false;
    last.current = null;
    lastCanvas.current = null;
    setFill(strokes.length ? nextIndex / strokes.length : 0);
  };

  const clearInk = () => {
    const canvas = inkRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
  };

  useEffect(() => {
    measurePad();
    const pad = padRef.current;
    const observer = pad ? new ResizeObserver(() => measurePad()) : null;
    if (pad) observer?.observe(pad);
    window.addEventListener("resize", measurePad);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measurePad);
    };
  }, []);

  useEffect(() => {
    sizeCanvas();
  }, [box.size]);

  useEffect(() => {
    sizeCanvas();
    clearInk();
    setStrokeIndex(0);
    finishedRound.current = false;
    setMissStart(false);
    samples.current = resampleStroke(strokes[0] ?? []);
    along.current = 0;
    startedAtStart.current = false;
    travel.current = 0;
    setFill(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current.letter]);

  useEffect(() => {
    const line = strokeIndex + 1;
    const total = strokes.length;
    const timer = setTimeout(() => {
      if (strokeIndex === 0) {
        speakText(`Trace the letter ${current.letter}. Start on the blue dot. One line. ${current.sound}`, {
          pitch: 1.2,
          rate: 0.92,
        });
      } else {
        speakText(`Line ${line} of ${total}. Start on the blue dot.`, { pitch: 1.2, rate: 0.95 });
      }
    }, 180);
    return () => {
      clearTimeout(timer);
      stopSpeaking();
    };
  }, [current.letter, current.sound, strokeIndex, strokes.length]);

  const paint = (from: { x: number; y: number }, to: { x: number; y: number }, rect: DOMRect) => {
    const canvas = inkRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const width = Math.max(16, Math.min(rect.width, rect.height) * 0.08);
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  };

  const reportFill = () => {
    const progress = strokeProgress(along.current, samples.current.length);
    setFill((strokeIndex + progress) / Math.max(strokes.length, 1));
  };

  const commitLetter = () => {
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

  const beginStrokeAt = (finger: TracePoint, canvasPoint: { x: number; y: number }) => {
    drawing.current = true;
    startedAtStart.current = true;
    setMissStart(false);
    last.current = finger;
    lastCanvas.current = canvasPoint;
    along.current = advanceAlongStroke(samples.current, along.current, finger);
    reportFill();
  };

  const completeStroke = (hold?: { finger: TracePoint; canvas: { x: number; y: number } }) => {
    drawing.current = false;
    last.current = null;
    lastCanvas.current = null;
    soundEffects.playPop();
    if (strokeIndex >= strokes.length - 1) {
      setFill(1);
      commitLetter();
      return;
    }
    const next = strokeIndex + 1;
    setStrokeIndex(next);
    resetStroke(next);
    if (hold) {
      const startPoint = samples.current[0];
      if (
        startPoint &&
        Math.hypot(hold.finger.x - startPoint.x, hold.finger.y - startPoint.y) <= STROKE_START_RADIUS
      ) {
        beginStrokeAt(hold.finger, hold.canvas);
      }
    }
  };

  const maybeFinishStroke = (hold?: { finger: TracePoint; canvas: { x: number; y: number } }) => {
    if (finishedRound.current || done) return;
    const end = samples.current[samples.current.length - 1];
    const finger = hold?.finger;
    const endDistance =
      finger && end ? Math.hypot(finger.x - end.x, finger.y - end.y) : Number.POSITIVE_INFINITY;
    if (
      isStrokePathComplete({
        along: along.current,
        total: samples.current.length,
        travel: travel.current,
        pathLength: pathLength(samples.current),
        startedAtStart: startedAtStart.current,
        endDistance,
      })
    ) {
      completeStroke(hold);
    }
  };

  const start = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (finishedRound.current || done) return;
    const finger = toNorm(event);
    const startPoint = samples.current[0];
    if (!startPoint) return;
    const head = samples.current[along.current] ?? startPoint;
    const nearStart = Math.hypot(finger.x - startPoint.x, finger.y - startPoint.y) <= STROKE_START_RADIUS;
    const nearHead = Math.hypot(finger.x - head.x, finger.y - head.y) <= STROKE_START_RADIUS;
    if (!nearStart && !(startedAtStart.current && nearHead)) {
      setMissStart(true);
      soundEffects.unlock();
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    const rect = event.currentTarget.getBoundingClientRect();
    beginStrokeAt(finger, toCanvas(finger, rect));
    soundEffects.unlock();
  };

  const move = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !last.current) return;
    const finger = toNorm(event);
    const prev = last.current;
    const step = Math.hypot(finger.x - prev.x, finger.y - prev.y);
    const slices = Math.max(1, Math.ceil(step / 2));
    const rect = event.currentTarget.getBoundingClientRect();
    let painted = lastCanvas.current;
    for (let i = 1; i <= slices; i += 1) {
      const t = i / slices;
      const point = { x: prev.x + (finger.x - prev.x) * t, y: prev.y + (finger.y - prev.y) * t };
      if (distanceToStroke(point, samples.current) > STROKE_INK_RADIUS) {
        painted = null;
        continue;
      }
      travel.current += step / slices;
      along.current = advanceAlongStroke(samples.current, along.current, point);
      const canvasPoint = toCanvas(point, rect);
      if (painted) paint(painted, canvasPoint, rect);
      painted = canvasPoint;
    }
    last.current = finger;
    lastCanvas.current = painted;
    reportFill();
    maybeFinishStroke({ finger, canvas: painted ?? toCanvas(finger, rect) });
  };

  const endStroke = () => {
    const hold = last.current
      ? { finger: last.current, canvas: lastCanvas.current ?? { x: 0, y: 0 } }
      : undefined;
    drawing.current = false;
    last.current = null;
    lastCanvas.current = null;
    maybeFinishStroke(hold);
  };

  const startDot = activeStroke[0];
  const endDot = activeStroke[activeStroke.length - 1];

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <p className="text-xs font-black uppercase tracking-widest text-amber-300">Finger trace</p>
        <h3 className="text-2xl font-black text-white">
          {current.emoji} {current.letter} is for {current.word}
        </h3>
        <p className="text-white/75 text-base">
          Line {Math.min(strokeIndex + 1, strokes.length)} of {strokes.length}. Start on the blue dot. Go all
          the way to the end.
        </p>
      </div>

      <div
        ref={padRef}
        className="relative min-h-[20rem] h-[min(62vh,34rem)] rounded-[2rem] bg-white overflow-hidden border-[6px] border-amber-300 shadow-inner"
      >
        <div
          className="absolute"
          style={{ left: box.left, top: box.top, width: box.size, height: box.size }}
        >
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
            {strokes.map((stroke, i) => (
              <polyline
                key={`${current.letter}-ghost-${i}`}
                points={polyline(stroke)}
                fill="none"
                stroke={i < strokeIndex ? "#f59e0b" : "#fde68a"}
                strokeWidth={i < strokeIndex ? 5.2 : 4.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={i < strokeIndex ? 0.95 : 0.5}
              />
            ))}
            <polyline
              points={polyline(activeStroke)}
              fill="none"
              stroke="#f59e0b"
              strokeWidth={5.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="3.4 3.8"
              opacity={0.95}
            />
            {endDot && (
              <circle cx={endDot.x} cy={endDot.y} r="5.4" fill="#fff" stroke="#16a34a" strokeWidth="1.8" />
            )}
            {startDot && (
              <circle cx={startDot.x} cy={startDot.y} r="6.2" fill="#2563eb" stroke="#fff" strokeWidth="1.6" />
            )}
          </svg>
          <canvas
            ref={inkRef}
            className="absolute inset-0 h-full w-full touch-none"
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={endStroke}
            onPointerCancel={endStroke}
            aria-label={`Trace the letter ${current.letter}, line ${strokeIndex + 1} of ${strokes.length}`}
          />
        </div>
      </div>

      <div className="h-2 rounded-full bg-white/15 overflow-hidden">
        <div
          className="h-full rounded-full bg-amber-400 transition-all"
          style={{ width: `${Math.round(Math.min(1, fill) * 100)}%` }}
        />
      </div>
      <p className="text-center text-white/60 text-sm font-bold">
        {missStart
          ? "Start on the blue dot, then slide one line."
          : fill < 1
            ? "Keep going until you touch the green end."
            : "Letter done!"}
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
              clearInk();
              sizeCanvas();
              setStrokeIndex(0);
              resetStroke(0);
              finishedRound.current = false;
              setMissStart(false);
              soundEffects.playPop();
            }}
            className="inline-flex items-center gap-1 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/20"
          >
            <RotateCcw size={14} /> Clear
          </button>
        </div>
      </div>

      {done && <p className="text-center text-emerald-300 font-black">All letters traced. You did it!</p>}
    </div>
  );
}
