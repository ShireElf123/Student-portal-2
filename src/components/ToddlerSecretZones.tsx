import React, { useEffect, useRef, useState } from "react";
import { soundEffects } from "../utils/soundEffects";
import { speakText, stopSpeaking } from "../utils/speechUtils";
import { awardXP, triggerCelebrationConfetti } from "../utils/gamification";
import { recordLearningEvent, getActiveLearnerId } from "../utils/learnerBrain";

export interface SecretZoneDef {
  id: "zone-dino-cave" | "zone-starlight-observatory" | "zone-coral-cavern";
  activityId: "act-secret-dino-cave" | "act-secret-starlight" | "act-secret-coral";
  title: string;
  subtitle: string;
  emoji: string;
  starsRequired: number;
  bgGradient: string;
  rewardXP: number;
  rewardStars: number;
  discoveryDescription: string;
}

export const SECRET_ZONES: SecretZoneDef[] = [
  {
    id: "zone-dino-cave",
    activityId: "act-secret-dino-cave",
    title: "Dino Excavation Cave",
    subtitle: "Hold and brush. Sand hides five real fossils.",
    emoji: "🦕",
    starsRequired: 10,
    bgGradient: "from-amber-800 via-orange-900 to-stone-900",
    rewardXP: 60,
    rewardStars: 3,
    discoveryDescription: "You brushed the cave floor and found the Golden Triceratops Horn!",
  },
  {
    id: "zone-starlight-observatory",
    activityId: "act-secret-starlight",
    title: "Starlight Sky Observatory",
    subtitle: "Follow the glowing star. Draw Little Bear, then the North Star.",
    emoji: "🔭",
    starsRequired: 20,
    bgGradient: "from-[#07061a] via-indigo-950 to-slate-950",
    rewardXP: 80,
    rewardStars: 3,
    discoveryDescription: "You traced Little Bear. The North Star is the tip of the ladle!",
  },
  {
    id: "zone-coral-cavern",
    activityId: "act-secret-coral",
    title: "Coral Reef Secret Cavern",
    subtitle: "Open the clams on the reef. Three pearls hide among shy sea friends.",
    emoji: "🪸",
    starsRequired: 30,
    bgGradient: "from-cyan-800 via-teal-900 to-emerald-950",
    rewardXP: 100,
    rewardStars: 3,
    discoveryDescription: "You found the Royal Pearl in the rainbow clam!",
  },
];

const FINDS_KEY = "toddler-secret-zone-finds";
const BRUSH_STROKES_TO_REVEAL = 10;

export function secretZoneIsFound(zoneId: string): boolean {
  try {
    const raw = localStorage.getItem(FINDS_KEY);
    const found = raw ? (JSON.parse(raw) as string[]) : [];
    return found.includes(zoneId);
  } catch {
    return false;
  }
}

function markFound(zoneId: string) {
  try {
    const raw = localStorage.getItem(FINDS_KEY);
    const found = raw ? (JSON.parse(raw) as string[]) : [];
    if (!found.includes(zoneId)) {
      localStorage.setItem(FINDS_KEY, JSON.stringify([...found, zoneId]));
    }
  } catch {
    /* ignore quota */
  }
}

function creditZone(zone: SecretZoneDef, onAddStar?: (count: number) => void) {
  if (secretZoneIsFound(zone.id)) return;
  markFound(zone.id);
  onAddStar?.(zone.rewardStars);
  awardXP(zone.rewardXP, zone.title);
  try {
    recordLearningEvent({
      learnerId: getActiveLearnerId(),
      activityId: zone.activityId,
      experienceId: zone.activityId,
      contentId: zone.id,
      eventType: "creative_interaction",
      activityType: "world-activity",
      activityTitle: zone.title,
      domain: "science",
      gradeBand: "toddler",
      result: "explored",
      difficulty: "easy",
      attempts: 1,
      hintsUsed: 0,
    });
  } catch (error) {
    console.error("Failed to record secret zone:", error);
  }
}

const FOSSILS: { id: string; name: string; speak: string; journal: string; prize?: boolean }[] = [
  { id: "rib", name: "Long rib", speak: "A long rib bone. This dino had a huge belly!", journal: "Rib from a long-neck" },
  { id: "print", name: "Three-toe print", speak: "A three-toed footprint. A hunter walked here.", journal: "Hunter footprint" },
  { id: "tooth", name: "Roar tooth", speak: "A roar tooth as long as your hand!", journal: "Hunter tooth" },
  { id: "egg", name: "Speckled egg", speak: "A speckled egg. A baby dino slept inside.", journal: "Baby dino egg" },
  { id: "horn", name: "Golden horn", speak: "The golden Triceratops horn!", journal: "Golden Triceratops horn", prize: true },
];

function FossilArt({ id, className }: { id: string; className?: string }) {
  const common = "w-16 h-16 sm:w-20 sm:h-20";
  if (id === "rib") {
    return (
      <svg viewBox="0 0 64 64" className={className ?? common} aria-hidden>
        <path d="M8 40c8-18 20-28 28-28 4 0 6 6 2 10-8 8-16 14-22 28-2 4-10 2-8-10z" fill="#e7d5b3" stroke="#8a6a3b" strokeWidth="2" />
        <path d="M18 22c8 2 18 2 26-4" fill="none" stroke="#c4a574" strokeWidth="2" />
      </svg>
    );
  }
  if (id === "print") {
    return (
      <svg viewBox="0 0 64 64" className={className ?? common} aria-hidden>
        <ellipse cx="32" cy="42" rx="16" ry="12" fill="#6b4a2b" />
        <ellipse cx="18" cy="22" rx="6" ry="10" fill="#6b4a2b" />
        <ellipse cx="32" cy="16" rx="6" ry="11" fill="#6b4a2b" />
        <ellipse cx="46" cy="22" rx="6" ry="10" fill="#6b4a2b" />
      </svg>
    );
  }
  if (id === "tooth") {
    return (
      <svg viewBox="0 0 64 64" className={className ?? common} aria-hidden>
        <path d="M20 10h24l-6 44c-2 6-10 6-12 0z" fill="#f3efe4" stroke="#b7a078" strokeWidth="2" />
        <path d="M24 18h16" stroke="#d7c4a0" strokeWidth="2" />
      </svg>
    );
  }
  if (id === "egg") {
    return (
      <svg viewBox="0 0 64 64" className={className ?? common} aria-hidden>
        <ellipse cx="32" cy="34" rx="16" ry="22" fill="#f0e2c4" stroke="#c9a56a" strokeWidth="2" />
        <circle cx="26" cy="28" r="3" fill="#c9a56a" />
        <circle cx="36" cy="38" r="2.5" fill="#c9a56a" />
        <circle cx="30" cy="44" r="2" fill="#c9a56a" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" className={className ?? common} aria-hidden>
      <path d="M12 40c4-18 14-28 28-30 8-1 14 8 10 16-6 12-4 20 4 26-16 8-32 4-42-12z" fill="#e8c547" stroke="#b8860b" strokeWidth="2" />
      <path d="M22 28c8-2 16 2 22 10" fill="none" stroke="#f6e27a" strokeWidth="2" />
    </svg>
  );
}

function fillSand(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#e0c07a");
  gradient.addColorStop(0.5, "#c4923c");
  gradient.addColorStop(1, "#8a5a24");
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  for (let i = 0; i < 70; i += 1) {
    ctx.fillStyle = i % 2 === 0 ? "#f0d9a0" : "#6d4420";
    ctx.beginPath();
    ctx.arc((i * 17) % width, (i * 29) % height, 1.2 + (i % 3), 0, Math.PI * 2);
    ctx.fill();
  }
}

function SandPit({
  fossil,
  onRevealed,
}: {
  fossil: (typeof FOSSILS)[number];
  onRevealed: (id: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const strokes = useRef(0);
  const [clear, setClear] = useState(false);

  const sizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || clear) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas.getContext("2d");
    } catch {
      ctx = null;
    }
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fillSand(ctx, rect.width, rect.height);
  };

  useEffect(() => {
    sizeCanvas();
    const onResize = () => sizeCanvas();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [clear]);

  const pointFromEvent = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const brush = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas?.getContext("2d") ?? null;
    } catch {
      ctx = null;
    }
    if (!ctx) return;
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 34;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  };

  const reveal = () => {
    if (clear) return;
    setClear(true);
    soundEffects.playSuccessChime();
    speakText(fossil.speak, { pitch: 1.18 });
    onRevealed(fossil.id);
  };

  const noteStroke = () => {
    strokes.current += 1;
    if (strokes.current >= BRUSH_STROKES_TO_REVEAL) reveal();
  };

  return (
    <div className="space-y-2">
      <div
        className={`relative min-h-[9.5rem] sm:min-h-[11rem] rounded-[1.6rem] overflow-hidden border-4 shadow-inner ${
          fossil.prize && clear ? "border-amber-300 bg-amber-50" : "border-amber-950 bg-stone-200"
        }`}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-3">
          <FossilArt id={fossil.id} />
          <p className={`text-xs font-black ${clear ? "text-amber-900" : "text-transparent"}`}>{fossil.name}</p>
        </div>
        {!clear && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
            aria-label={`Brush sand off the ${fossil.name}`}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture?.(event.pointerId);
              soundEffects.unlock();
              drawing.current = true;
              last.current = pointFromEvent(event);
              brush(last.current, last.current);
              noteStroke();
            }}
            onPointerMove={(event) => {
              if (!drawing.current || !last.current) return;
              const next = pointFromEvent(event);
              brush(last.current, next);
              last.current = next;
              noteStroke();
            }}
            onPointerUp={() => {
              drawing.current = false;
              last.current = null;
            }}
            onPointerCancel={() => {
              drawing.current = false;
              last.current = null;
            }}
          />
        )}
      </div>
      <p className="text-center text-[11px] font-bold text-amber-100/80">{clear ? fossil.journal : "Sandy pit"}</p>
    </div>
  );
}

function DinoCave({ onFoundAll }: { onFoundAll: () => void }) {
  const [found, setFound] = useState<string[]>([]);
  const done = useRef(false);

  useEffect(() => {
    if (found.length >= FOSSILS.length && !done.current) {
      done.current = true;
      onFoundAll();
    }
  }, [found, onFoundAll]);

  return (
    <div className="space-y-3">
      <p className="text-center text-sm font-bold text-amber-100">
        Field journal · {found.length} of {FOSSILS.length} fossils
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {FOSSILS.map((fossil) => (
          <SandPit
            key={fossil.id}
            fossil={fossil}
            onRevealed={(id) => setFound((list) => (list.includes(id) ? list : [...list, id]))}
          />
        ))}
      </div>
      <ol className="rounded-2xl bg-black/25 border border-white/10 p-3 text-xs font-bold text-amber-50 space-y-1">
        {FOSSILS.map((fossil) => (
          <li key={fossil.id} className={found.includes(fossil.id) ? "text-amber-100" : "text-white/40"}>
            {found.includes(fossil.id) ? "✔" : "○"} {fossil.journal}
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Little Dipper, bowl then handle to Polaris — toddler-simple ladle. */
const DIPPER: { id: string; x: number; y: number; name: string }[] = [
  { id: "s1", x: 22, y: 58, name: "bowl" },
  { id: "s2", x: 34, y: 44, name: "bowl" },
  { id: "s3", x: 48, y: 42, name: "bowl" },
  { id: "s4", x: 38, y: 68, name: "bowl" },
  { id: "s5", x: 62, y: 36, name: "handle" },
  { id: "s6", x: 74, y: 28, name: "handle" },
  { id: "s7", x: 86, y: 18, name: "North Star" },
];
const SPARE_STARS: { id: string; x: number; y: number }[] = [
  { id: "n1", x: 12, y: 24 },
  { id: "n2", x: 18, y: 78 },
  { id: "n3", x: 56, y: 78 },
  { id: "n4", x: 70, y: 62 },
  { id: "n5", x: 90, y: 48 },
];

function Observatory({ onFoundAll }: { onFoundAll: () => void }) {
  const [lit, setLit] = useState<string[]>([]);
  const done = useRef(false);
  const nextIndex = lit.length;
  const complete = lit.length >= DIPPER.length;

  useEffect(() => {
    if (complete && !done.current) {
      done.current = true;
      onFoundAll();
    }
  }, [complete, onFoundAll]);

  const linePoints = DIPPER.slice(0, Math.max(lit.length, 1))
    .map((star) => `${star.x},${star.y}`)
    .join(" ");

  return (
    <div className="space-y-3">
      <p className="text-center text-sm font-bold text-indigo-100">
        {complete
          ? "Little Bear complete · the North Star holds the ladle"
          : `Star ${Math.min(nextIndex + 1, DIPPER.length)} of ${DIPPER.length} · tap the glowing star`}
      </p>
      <div className="mx-auto w-full max-w-xl">
        <div className="relative aspect-square overflow-hidden rounded-full border-[10px] sm:border-[14px] border-amber-800 shadow-[inset_0_0_80px_rgba(0,0,0,0.65)] bg-gradient-to-b from-[#05041a] via-[#14105a] to-[#1a1040]">
          <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_50%_40%,transparent_42%,#000_78%)]" />
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
            {lit.length > 1 && (
              <polyline
                points={linePoints}
                fill="none"
                stroke="#f5d76e"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            {DIPPER.map((star, index) => {
              const on = lit.includes(star.id);
              const isNext = index === nextIndex && !complete;
              const size = star.id === "s7" ? 3.6 : 2.4;
              return (
                <g key={star.id}>
                  {isNext && (
                    <circle cx={star.x} cy={star.y} r="6.5" fill="none" stroke="#fff4b0" strokeWidth="0.7" opacity="0.9">
                      <animate attributeName="r" values="5;7.5;5" dur="1.4s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle
                    cx={star.x}
                    cy={star.y}
                    r={on ? size + 1.2 : size}
                    fill={on ? "#ffe566" : isNext ? "#fff7d1" : "#cfd6ff"}
                    className="cursor-pointer"
                    role="button"
                    aria-label={isNext ? `Next Little Bear star, ${star.name}` : on ? `Lit ${star.name}` : "Quiet star"}
                    onClick={() => {
                      soundEffects.unlock();
                      if (on || complete) return;
                      if (index === nextIndex) {
                        soundEffects.playSuccessChime();
                        const nextLit = [...lit, star.id];
                        setLit(nextLit);
                        if (star.id === "s7") {
                          speakText("The North Star! Little Bear's ladle is complete.", { pitch: 1.2 });
                        } else {
                          speakText(`Yes. That is star ${index + 1} of Little Bear.`, { pitch: 1.22 });
                        }
                      } else {
                        soundEffects.playGentleBoing();
                        speakText("Follow the glowing ring. Little Bear is a ladle.", { pitch: 1.12 });
                      }
                    }}
                  />
                </g>
              );
            })}
            {SPARE_STARS.map((star) => (
              <circle
                key={star.id}
                cx={star.x}
                cy={star.y}
                r="1.7"
                fill="#9aa4d6"
                className="cursor-pointer opacity-70"
                role="button"
                aria-label="Spare twinkle"
                onClick={() => {
                  soundEffects.unlock();
                  soundEffects.playGentleBoing();
                  speakText("A spare twinkle. Stay on the ladle.", { pitch: 1.12 });
                }}
              />
            ))}
          </svg>
        </div>
        <p className="mt-2 text-center text-[11px] font-bold uppercase tracking-widest text-amber-200/80">Brass telescope</p>
      </div>
    </div>
  );
}

const CLAMS: {
  id: string;
  x: string;
  y: string;
  rotate: string;
  inside: { kind: "pearl" | "friend"; name: string; speak: string; royal?: boolean; glyph: string };
}[] = [
  { id: "c1", x: "8%", y: "58%", rotate: "-8deg", inside: { kind: "friend", name: "Pink shell", speak: "Only a pink shell. Keep looking!", glyph: "🐚" } },
  { id: "c2", x: "38%", y: "62%", rotate: "6deg", inside: { kind: "pearl", name: "Moon pearl", speak: "A moon-white pearl!", glyph: "🤍" } },
  { id: "c3", x: "68%", y: "52%", rotate: "-4deg", inside: { kind: "friend", name: "Shy crab", speak: "A shy crab says hello!", glyph: "🦀" } },
  { id: "c4", x: "18%", y: "78%", rotate: "10deg", inside: { kind: "pearl", name: "Rose pearl", speak: "A rose pearl from the reef!", glyph: "💗" } },
  { id: "c5", x: "52%", y: "78%", rotate: "-12deg", inside: { kind: "pearl", name: "Royal pearl", speak: "The royal rainbow pearl!", glyph: "🌈", royal: true } },
  { id: "c6", x: "78%", y: "72%", rotate: "8deg", inside: { kind: "friend", name: "Coral sprig", speak: "A tiny coral sprig.", glyph: "🪸" } },
];

function ClamShell({
  clam,
  open,
  onOpen,
}: {
  clam: (typeof CLAMS)[number];
  open: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (open) return;
        soundEffects.unlock();
        soundEffects.playPop();
        onOpen();
        speakText(clam.inside.speak, { pitch: 1.18 });
      }}
      className="absolute w-[30%] sm:w-[26%]"
      style={{ left: clam.x, top: clam.y, transform: `translate(-50%, -50%) rotate(${clam.rotate})` }}
      aria-label={open ? clam.inside.name : "Closed clam"}
    >
      <svg viewBox="0 0 120 90" className="w-full drop-shadow-lg">
        <ellipse cx="60" cy="62" rx="46" ry="22" fill="#0f766e" stroke="#042f2e" strokeWidth="3" />
        <ellipse cx="60" cy="62" rx="32" ry="12" fill="#134e4a" />
        <g style={{ transformOrigin: "60px 58px", transform: open ? "rotate(-58deg)" : "rotate(0deg)", transition: "transform 280ms ease" }}>
          <ellipse cx="60" cy="40" rx="46" ry="24" fill="#2dd4bf" stroke="#042f2e" strokeWidth="3" />
          <ellipse cx="60" cy="36" rx="28" ry="10" fill="#5eead4" opacity="0.7" />
        </g>
        {open && (
          <text x="60" y="64" textAnchor="middle" fontSize="22">
            {clam.inside.glyph}
          </text>
        )}
      </svg>
    </button>
  );
}

function CoralCavern({ onFoundAll }: { onFoundAll: () => void }) {
  const [open, setOpen] = useState<string[]>([]);
  const pearls = CLAMS.filter((clam) => clam.inside.kind === "pearl");
  const found = pearls.filter((clam) => open.includes(clam.id));
  const done = useRef(false);

  useEffect(() => {
    if (found.length >= pearls.length && !done.current) {
      done.current = true;
      onFoundAll();
    }
  }, [found.length, pearls.length, onFoundAll]);

  return (
    <div className="space-y-3">
      <div className="flex justify-center gap-3">
        {pearls.map((clam) => (
          <div
            key={clam.id}
            className={`h-12 w-12 rounded-full border-2 flex items-center justify-center text-2xl ${
              open.includes(clam.id) ? "bg-white border-amber-300" : "bg-white/10 border-white/20"
            }`}
            aria-label={open.includes(clam.id) ? clam.inside.name : "Empty pearl pouch"}
          >
            {open.includes(clam.id) ? clam.inside.glyph : "·"}
          </div>
        ))}
      </div>
      <p className="text-center text-sm font-bold text-cyan-100">
        Pearl pouch · {found.length} of {pearls.length}
      </p>
      <div className="relative min-h-[22rem] h-[min(58vh,32rem)] overflow-hidden rounded-[2rem] border-4 border-cyan-300/30 bg-gradient-to-b from-sky-700 via-teal-800 to-emerald-950">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        <svg className="absolute bottom-0 w-full h-2/3 pointer-events-none" viewBox="0 0 400 200" preserveAspectRatio="none">
          <path d="M0 200 V110 C40 80 50 140 90 120 C120 100 130 160 170 130 C210 100 220 170 270 140 C320 110 340 160 400 120 V200 Z" fill="#064e3b" />
          <path d="M30 200 V90 C38 70 48 70 50 90 V200" fill="#0f766e" />
          <path d="M310 200 V80 C318 55 332 55 336 80 V200" fill="#115e59" />
        </svg>
        {CLAMS.map((clam) => (
          <ClamShell
            key={clam.id}
            clam={clam}
            open={open.includes(clam.id)}
            onOpen={() => setOpen((list) => (list.includes(clam.id) ? list : [...list, clam.id]))}
          />
        ))}
      </div>
    </div>
  );
}

export function ToddlerSecretZonePlay({
  zone,
  onAddStar,
  onLeave,
}: {
  zone: SecretZoneDef;
  onAddStar?: (count: number) => void;
  onLeave: () => void;
}) {
  const [done, setDone] = useState(() => secretZoneIsFound(zone.id));
  const credited = useRef(secretZoneIsFound(zone.id));

  useEffect(() => {
    const line = done ? zone.discoveryDescription : `${zone.title}. ${zone.subtitle}`;
    const timer = setTimeout(() => speakText(line, { pitch: 1.18 }), 180);
    return () => {
      clearTimeout(timer);
      stopSpeaking();
    };
  }, [zone, done]);

  const finish = () => {
    if (!credited.current) {
      credited.current = true;
      creditZone(zone, onAddStar);
      soundEffects.playFanfare();
      triggerCelebrationConfetti();
      speakText(zone.discoveryDescription, { pitch: 1.2 });
    }
    setDone(true);
  };

  return (
    <div className={`rounded-[2rem] border-2 border-white/20 bg-gradient-to-br ${zone.bgGradient} p-4 sm:p-6 space-y-4 shadow-2xl`}>
      <div className="text-center space-y-1">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/80">Secret room</p>
        <h3 className="text-2xl sm:text-3xl font-black text-white">
          {zone.emoji} {zone.title}
        </h3>
        <p className="text-sm sm:text-base font-semibold text-white/85">{zone.subtitle}</p>
      </div>

      {zone.id === "zone-dino-cave" && <DinoCave onFoundAll={finish} />}
      {zone.id === "zone-starlight-observatory" && <Observatory onFoundAll={finish} />}
      {zone.id === "zone-coral-cavern" && <CoralCavern onFoundAll={finish} />}

      {done && <p className="text-center text-base font-black text-amber-100">{zone.discoveryDescription}</p>}

      <button
        type="button"
        onClick={onLeave}
        className="w-full py-3.5 rounded-2xl bg-white text-slate-900 font-black text-sm shadow-xl"
      >
        {done ? "Back to the atlas" : "Leave for now"}
      </button>
    </div>
  );
}
