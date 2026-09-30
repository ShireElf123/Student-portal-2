import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, RotateCcw, Volume2, Star } from "lucide-react";
import { soundEffects } from "../utils/soundEffects";
import { speakText } from "../utils/speechUtils";
import { triggerCelebrationConfetti } from "../utils/gamification";
import { recordLearningEvent, getActiveLearnerId } from "../utils/learnerBrain";
import {
  completeActiveMissionIfMatches,
  recordDailyCount,
} from "../data/toddler/toddlerDailyAdventure";

interface ColorDrop {
  id: "red" | "yellow" | "blue";
  name: string;
  emoji: string;
  colorClass: string;
  glowColor: string;
}

const PRIMARY_COLORS: ColorDrop[] = [
  { id: "red", name: "Ruby Red", emoji: "🔴", colorClass: "from-red-500 to-rose-600", glowColor: "shadow-red-500/50" },
  { id: "yellow", name: "Sunny Yellow", emoji: "🟡", colorClass: "from-yellow-400 to-amber-400", glowColor: "shadow-yellow-500/50" },
  { id: "blue", name: "Ocean Blue", emoji: "🔵", colorClass: "from-blue-500 to-indigo-600", glowColor: "shadow-blue-500/50" },
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
};

const PAINT_COLORS = ["#ef4444", "#f59e0b", "#facc15", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#78350f", "#111827"];

function PaintCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const [color, setColor] = useState(PAINT_COLORS[0]);
  const [brushSize, setBrushSize] = useState(12);

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
    <section className="mt-6 rounded-3xl border border-pink-300/30 bg-gradient-to-br from-pink-500/10 to-violet-500/10 p-4 sm:p-5 text-left" aria-label="Paint studio">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div><h4 className="text-lg font-black text-white">🖌️ Little Paint Studio</h4><p className="text-xs text-white/65">Choose a color, then draw with your finger or mouse. Your picture stays on this device.</p></div>
        <div className="flex gap-2">
          <button type="button" onClick={clearCanvas} className="rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/20">Clear paper</button>
          <button type="button" onClick={() => { const canvas = canvasRef.current; if (!canvas) return; const link = document.createElement("a"); link.download = "my-color-studio-picture.png"; link.href = canvas.toDataURL("image/png"); link.click(); }} className="rounded-xl bg-pink-500/25 px-3 py-2 text-xs font-bold text-white hover:bg-pink-500/40">Save picture</button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 mb-3" role="group" aria-label="Paint colors">
        {PAINT_COLORS.map((paintColor, index) => <button key={paintColor} type="button" aria-label={`Paint color ${index + 1}`} aria-pressed={color === paintColor} onClick={() => setColor(paintColor)} className={`h-9 w-9 rounded-full border-2 ${color === paintColor ? "border-white ring-2 ring-white/50 scale-110" : "border-white/40"}`} style={{ backgroundColor: paintColor }} />)}
        <label className="flex items-center gap-2 text-xs font-bold text-white/80">Brush <input aria-label="Brush size" type="range" min="4" max="32" value={brushSize} onChange={(event) => setBrushSize(Number(event.target.value))} /></label>
      </div>
      <canvas ref={canvasRef} className="block h-56 w-full touch-none rounded-2xl border-2 border-white/30 shadow-inner sm:h-72" onPointerDown={startPaint} onPointerMove={paint} onPointerUp={() => { lastPoint.current = null; }} onPointerCancel={() => { lastPoint.current = null; }} aria-label="Blank paper for drawing" />
    </section>
  );
}

export function ToddlerColorLab({ onAddStar }: { onAddStar?: (amt?: number) => void }) {
  const [selectedDrops, setSelectedDrops] = useState<ColorDrop[]>([]);
  const [currentResult, setCurrentResult] = useState<MixResult | null>(null);
  const resolutionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      speakText("Welcome to Color Magic! Tap two primary color droplets to blend a magical new color!", {
        pitch: 1.25,
      });
    }, 150);

    return () => clearTimeout(timer);
  }, []);

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
      const result = RECIPES[key];

      if (result) {
        resolutionTimer.current = setTimeout(() => {
          resolutionTimer.current = null;
          setCurrentResult(result);
          soundEffects.playSuccessChime();
          triggerCelebrationConfetti();
          speakText(result.phrase, { pitch: 1.3 });
          // The day's first successful mix earns a star; further mixes are
          // free play so leaving and re-entering cannot farm stars.
          if (recordDailyCount("color-magic-mix") === 1) {
            onAddStar?.(1);
          }
          try {
            completeActiveMissionIfMatches("games", "color-magic");
          } catch {
            // ignore
          }

          try {
            recordLearningEvent({
              learnerId: getActiveLearnerId(),
              activityId: "toddler-color-magic",
              activityType: "toddler-color-lab",
              activityTitle: `Color Magic: Mixed ${result.colorName}`,
              skillId: "sci-23-matter-water",
              domain: "science",
              gradeBand: "toddler",
              result: "success",
              score: 100,
              difficulty: "easy",
              attempts: 1,
              hintsUsed: 0,
            });
          } catch {}
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
    <div className="bg-[#121422] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-xl max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-400 to-indigo-500 flex items-center justify-center text-xl shadow-md">
            🎨
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white">Color Magic Mixing Lab</h3>
            <p className="text-xs text-white/60">Tap any two primary colors to mix and reveal new colors!</p>
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
      <div className="my-6 p-8 rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border-2 border-white/10 flex flex-col items-center justify-center text-center relative overflow-hidden">
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
            <p className="text-xs sm:text-sm text-amber-200 font-semibold max-w-xs">{currentResult.phrase}</p>
            <button
              onClick={handleReset}
              className="mt-3 px-5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer"
            >
              Mix Another Color 🪄
            </button>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 rounded-3xl bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center text-4xl">
              {selectedDrops.length === 0 && <span className="opacity-40 animate-pulse">🧪</span>}
              {selectedDrops.length === 1 && (
                <span className="text-5xl animate-bounce">{selectedDrops[0].emoji}</span>
              )}
              {selectedDrops.length === 2 && <span className="text-5xl animate-spin">✨</span>}
            </div>

            <div className="text-xs font-bold text-white/70">
              {selectedDrops.length === 0 && "Step 1: Tap your first color drop below"}
              {selectedDrops.length === 1 && "Step 2: Now tap a second color to mix!"}
              {selectedDrops.length === 2 && "Mixing magic potion..."}
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
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
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
