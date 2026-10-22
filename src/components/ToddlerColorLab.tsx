import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, RotateCcw, Volume2, Star } from "lucide-react";
import { soundEffects } from "../utils/soundEffects";
import { speakText } from "../utils/speechUtils";
import { triggerCelebrationConfetti } from "../utils/gamification";
import { recordLearningEvent, getActiveLearnerId } from "../utils/learnerBrain";
import { payDailyMissionIfMatches } from "../data/toddler/toddlerDailyAdventure";
import type { MixFlavor } from "../data/toddler/toddlerWorldPlayThemes";

interface ColorDrop {
  id: "red" | "yellow" | "blue" | "white";
  name: string;
  emoji: string;
  colorClass: string;
  glowColor: string;
}

const PRIMARY_COLORS: ColorDrop[] = [
  { id: "red", name: "Ruby Red", emoji: "🔴", colorClass: "from-red-500 to-rose-600", glowColor: "shadow-red-500/50" },
  { id: "yellow", name: "Sunny Yellow", emoji: "💛", colorClass: "from-yellow-400 to-amber-400", glowColor: "shadow-yellow-500/50" },
  { id: "blue", name: "Ocean Blue", emoji: "🔵", colorClass: "from-blue-500 to-indigo-600", glowColor: "shadow-blue-500/50" },
  { id: "white", name: "Cloud White", emoji: "⚪", colorClass: "from-white to-slate-200", glowColor: "shadow-white/50" },
];

interface MixResult {
  title: string;
  colorName: string;
  bgGradient: string;
  emoji: string;
  phrase: string;
}

const RECIPES: Record<string, MixResult> = {
  "red+yellow": { title: "Magical Orange!", colorName: "Orange", bgGradient: "from-amber-400 to-orange-500", emoji: "🍊", phrase: "Red plus Yellow creates sparkling sweet Orange!" },
  "yellow+red": { title: "Magical Orange!", colorName: "Orange", bgGradient: "from-amber-400 to-orange-500", emoji: "🍊", phrase: "Yellow plus Red creates sparkling sweet Orange!" },
  "blue+yellow": { title: "Emerald Green!", colorName: "Green", bgGradient: "from-emerald-400 to-teal-500", emoji: "🌱", phrase: "Blue plus Yellow magically mixes into fresh Green!" },
  "yellow+blue": { title: "Emerald Green!", colorName: "Green", bgGradient: "from-emerald-400 to-teal-500", emoji: "🌱", phrase: "Yellow plus Blue magically mixes into fresh Green!" },
  "red+blue": { title: "Royal Purple!", colorName: "Purple", bgGradient: "from-purple-500 to-indigo-600", emoji: "🍇", phrase: "Red plus Blue creates deep royal Purple!" },
  "blue+red": { title: "Royal Purple!", colorName: "Purple", bgGradient: "from-purple-500 to-indigo-600", emoji: "🍇", phrase: "Blue plus Red creates deep royal Purple!" },
  "red+white": { title: "Soft Pink!", colorName: "Pink", bgGradient: "from-pink-300 to-rose-400", emoji: "🌸", phrase: "Red plus White makes a soft morning Pink!" },
  "white+red": { title: "Soft Pink!", colorName: "Pink", bgGradient: "from-pink-300 to-rose-400", emoji: "🌸", phrase: "White plus Red makes a soft morning Pink!" },
  "yellow+white": { title: "Warm Cream!", colorName: "Cream", bgGradient: "from-amber-100 to-yellow-200", emoji: "🍦", phrase: "Yellow plus White stirs into Warm Cream!" },
  "white+yellow": { title: "Warm Cream!", colorName: "Cream", bgGradient: "from-amber-100 to-yellow-200", emoji: "🍦", phrase: "White plus Yellow stirs into Warm Cream!" },
  "blue+white": { title: "Sky Blue!", colorName: "Sky", bgGradient: "from-sky-200 to-blue-400", emoji: "🌤️", phrase: "Blue plus White opens into Sky Blue!" },
  "white+blue": { title: "Sky Blue!", colorName: "Sky", bgGradient: "from-sky-200 to-blue-400", emoji: "🌤️", phrase: "White plus Blue opens into Sky Blue!" },
};

const PAINT_COLORS = ["#ef4444", "#f59e0b", "#facc15", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#78350f", "#111827"];

function PaintCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const [color, setColor] = useState(PAINT_COLORS[0]);
  const [brushSize, setBrushSize] = useState(22);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const previous = document.createElement("canvas");
      previous.width = canvas.width;
      previous.height = canvas.height;
      previous.getContext("2d")?.drawImage(canvas, 0, 0);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#fffdf7";
      ctx.fillRect(0, 0, rect.width, rect.height);
      if (previous.width && previous.height) {
        ctx.drawImage(previous, 0, 0, previous.width, previous.height, 0, 0, rect.width, rect.height);
      }
    };
    resizeCanvas();
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  const pointFromEvent = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };
  const startPaint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    lastPoint.current = pointFromEvent(event);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx && lastPoint.current) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(lastPoint.current.x, lastPoint.current.y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  const paint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!lastPoint.current) return;
    const next = pointFromEvent(event);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(next.x, next.y);
    ctx.stroke();
    lastPoint.current = next;
  };
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = "#fffdf7";
    ctx.fillRect(0, 0, rect.width, rect.height);
  };

  return (
    <section className="mt-5 rounded-[1.75rem] border border-pink-300/30 bg-gradient-to-br from-pink-500/10 to-violet-500/10 p-3 sm:p-4 text-left" aria-label="Paint studio">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <h4 className="text-xl font-black text-white">Little Paint Studio</h4>
          <p className="text-sm text-white/75">Pick a colour. Draw on the big paper.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={clearCanvas} className="rounded-xl bg-white/10 px-3 py-2.5 text-sm font-bold text-white hover:bg-white/20">Clear</button>
          <button
            type="button"
            onClick={() => {
              const canvas = canvasRef.current;
              if (!canvas) return;
              const link = document.createElement("a");
              link.download = "my-color-studio-picture.png";
              link.href = canvas.toDataURL("image/png");
              link.click();
            }}
            className="rounded-xl bg-pink-500/25 px-3 py-2.5 text-sm font-bold text-white hover:bg-pink-500/40"
          >
            Save
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2.5 mb-3" role="group" aria-label="Paint colors">
        {PAINT_COLORS.map((paintColor, index) => (
          <button
            key={paintColor}
            type="button"
            aria-label={`Paint color ${index + 1}`}
            aria-pressed={color === paintColor}
            onClick={() => setColor(paintColor)}
            className={`h-11 w-11 sm:h-12 sm:w-12 rounded-full border-2 ${color === paintColor ? "border-white ring-2 ring-white/50 scale-110" : "border-white/40"}`}
            style={{ backgroundColor: paintColor }}
          />
        ))}
        <label className="flex items-center gap-2 text-sm font-bold text-white/80 min-w-[9rem]">
          Brush
          <input
            aria-label="Brush size"
            type="range"
            min="8"
            max="48"
            value={brushSize}
            onChange={(event) => setBrushSize(Number(event.target.value))}
            className="w-28"
          />
        </label>
      </div>
      <canvas
        ref={canvasRef}
        className="block w-full touch-none rounded-[1.5rem] border-[6px] border-amber-100/90 bg-[#fffdf7] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] min-h-[18rem] h-[min(62vh,34rem)]"
        onPointerDown={startPaint}
        onPointerMove={paint}
        onPointerUp={() => { lastPoint.current = null; }}
        onPointerCancel={() => { lastPoint.current = null; }}
        aria-label="Blank paper for drawing"
      />
    </section>
  );
}

/** Worlds Color Magic missions name a colour. Free-play labs omit this. */
export function mixTargetFromActivity(activity: {
  id?: string;
  title?: string;
  learningObjective?: string;
  cluePrompt?: string;
}): string | undefined {
  const blob = `${activity.id ?? ""} ${activity.title ?? ""} ${activity.learningObjective ?? ""} ${activity.cluePrompt ?? ""}`.toLowerCase();
  if (blob.includes("orange") || blob.includes("red and yellow") || blob.includes("red into sunny yellow")) return "Orange";
  if (blob.includes("purple") || blob.includes("red and blue") || blob.includes("red jam plus blue")) return "Purple";
  if (blob.includes("green") || blob.includes("blue and yellow") || blob.includes("yellow and blue") || blob.includes("the leaf")) return "Green";
  return undefined;
}

export function ToddlerColorLab({
  onAddStar,
  mixFlavor,
  targetColor,
  spokenPrompt,
  missionSurface = "games",
}: {
  onAddStar?: (amt?: number) => void;
  mixFlavor?: MixFlavor;
  targetColor?: string;
  spokenPrompt?: string;
  /** Worlds play already pays a worlds mission — do not also pay Games. */
  missionSurface?: "games" | "off";
}) {
  const recipes: Record<string, MixResult> = {
    "red+yellow": { ...RECIPES["red+yellow"], ...(mixFlavor?.orange ?? {}) },
    "yellow+red": { ...RECIPES["yellow+red"], ...(mixFlavor?.orange ?? {}) },
    "blue+yellow": { ...RECIPES["blue+yellow"], ...(mixFlavor?.green ?? {}) },
    "yellow+blue": { ...RECIPES["yellow+blue"], ...(mixFlavor?.green ?? {}) },
    "red+blue": { ...RECIPES["red+blue"], ...(mixFlavor?.purple ?? {}) },
    "blue+red": { ...RECIPES["blue+red"], ...(mixFlavor?.purple ?? {}) },
    "red+white": RECIPES["red+white"],
    "white+red": RECIPES["white+red"],
    "yellow+white": RECIPES["yellow+white"],
    "white+yellow": RECIPES["white+yellow"],
    "blue+white": RECIPES["blue+white"],
    "white+blue": RECIPES["white+blue"],
  };
  const [selectedDrops, setSelectedDrops] = useState<ColorDrop[]>([]);
  const [currentResult, setCurrentResult] = useState<MixResult | null>(null);
  const rewardPaid = useRef(false);
  const resolutionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      speakText(
        spokenPrompt ||
          (targetColor
            ? `Mix two colours until you make ${targetColor}!`
            : "Welcome to Color Magic! Tap two primary color droplets to blend a magical new color!"),
        { pitch: 1.25 },
      );
    }, 150);

    return () => clearTimeout(timer);
  }, [spokenPrompt, targetColor]);

  useEffect(() => () => {
    if (resolutionTimer.current) clearTimeout(resolutionTimer.current);
  }, []);

  const handleSelectColor = (drop: ColorDrop) => {
    if (selectedDrops.length >= 2) return;
    soundEffects.playPop();

    const next = [...selectedDrops, drop];
    setSelectedDrops(next);
    speakText(drop.name, { pitch: 1.3 });

    if (next.length === 2) {
      const key = `${next[0].id}+${next[1].id}`;
      const result = recipes[key];

      if (result) {
        resolutionTimer.current = setTimeout(() => {
          resolutionTimer.current = null;
          setCurrentResult(result);
          const matchesTarget = !targetColor || result.colorName.toLowerCase() === targetColor.toLowerCase();
          if (!matchesTarget) {
            soundEffects.playGentleBoing();
            speakText(`That made ${result.colorName}. We need ${targetColor}. Mix again!`, { pitch: 1.2 });
            return;
          }
          soundEffects.playSuccessChime();
          triggerCelebrationConfetti();
          speakText(result.phrase, { pitch: 1.3 });
          if (!rewardPaid.current) {
            rewardPaid.current = true;
            onAddStar?.(1);
            try {
              if (missionSurface === "games") payDailyMissionIfMatches("games", "color-magic");
            } catch {
              // ignore
            }
          }

          try {
            recordLearningEvent({
              learnerId: getActiveLearnerId(),
              activityId: "toddler-color-magic",
              experienceId: "color-magic",
              contentId: `mixed-${result.colorName.toLowerCase()}`,
              eventType: "creative_interaction",
              activityType: "toddler-color-lab",
              activityTitle: `Color Magic: Mixed ${result.colorName}`,
              domain: "general",
              gradeBand: "toddler",
              result: "explored",
              difficulty: "easy",
              attempts: 1,
              hintsUsed: 0,
            });
          } catch (error) {
            console.error("Failed to record color-mixing engagement:", error);
          }
        }, 500);
      } else {
        // Same color mixed
        speakText(`Two ${next[0].name}s! Pick a different color to mix magic!`, { pitch: 1.2 });
        resolutionTimer.current = setTimeout(() => {
          resolutionTimer.current = null;
          setSelectedDrops([]);
        }, 1200);
      }
    }
  };

  const handleReset = () => {
    if (resolutionTimer.current) {
      clearTimeout(resolutionTimer.current);
      resolutionTimer.current = null;
    }
    setSelectedDrops([]);
    setCurrentResult(null);
    soundEffects.playPop();
  };

  return (
    <div className="bg-[#121422] border border-white/10 rounded-3xl p-4 sm:p-6 shadow-xl max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-400 to-indigo-500 flex items-center justify-center text-xl shadow-md">
            🎨
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white">Color Magic Mixing Lab</h3>
            <p className="text-sm text-white/70">
              {targetColor ? `Mix until you make ${targetColor}.` : "Tap two colours. Watch a new colour appear."}
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white/80 hover:text-white transition-all cursor-pointer"
          title="Clear & Mix Again"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Center Magic Mixing Cauldron */}
      <div className="my-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border-2 border-white/10 flex flex-col items-center justify-center text-center relative overflow-hidden">
        {currentResult ? (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center space-y-3"
          >
            <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${currentResult.bgGradient} flex items-center justify-center text-6xl shadow-2xl animate-pulse ring-8 ring-white/20`}>
              {currentResult.emoji}
            </div>
            <h4 className="text-2xl font-black text-white">{currentResult.title}</h4>
            <p className="text-sm text-amber-200 font-semibold max-w-sm">{currentResult.phrase}</p>
            <button
              onClick={handleReset}
              className="mt-3 px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm border border-white/20 transition-all cursor-pointer"
            >
              Mix Another Color ✨
            </button>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 rounded-3xl bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center text-4xl">
              {selectedDrops.length === 0 && <span className="opacity-40 animate-pulse">⚗️</span>}
              {selectedDrops.length === 1 && (
                <span className="text-5xl animate-bounce">{selectedDrops[0].emoji}</span>
              )}
              {selectedDrops.length === 2 && <span className="text-5xl animate-spin">✨</span>}
            </div>

            <div className="text-sm font-bold text-white/80">
              {selectedDrops.length === 0 && "Tap your first colour below"}
              {selectedDrops.length === 1 && "Now tap a second colour to mix!"}
              {selectedDrops.length === 2 && "Mixing…"}
            </div>

            {selectedDrops.length > 0 && (
              <div className="flex items-center gap-2">
                {selectedDrops.map((d, i) => (
                  <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-white border border-white/10">
                    {d.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Primary Color Palette Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {PRIMARY_COLORS.map((color) => {
          const isSelected = selectedDrops.some((d) => d.id === color.id);
          return (
            <motion.button
              key={color.id}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelectColor(color)}
              className={`p-4 sm:p-5 rounded-2xl flex flex-col items-center justify-center gap-2 border-b-4 transition-all cursor-pointer shadow-lg select-none ${
                isSelected
                  ? "bg-white/25 border-white ring-4 ring-white/30 text-white"
                  : `bg-gradient-to-b ${color.colorClass} border-black/40 border-b-black/60 text-white ${color.glowColor}`
              }`}
            >
              <span className="text-4xl filter drop-shadow">{color.emoji}</span>
              <span className="text-xs sm:text-sm font-black text-white drop-shadow-sm">{color.name}</span>
            </motion.button>
          );
        })}
      </div>
      <PaintCanvas />
    </div>
  );
}
