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
    subtitle: "Brush the sand. Fossils hide underneath.",
    emoji: "🦕",
    starsRequired: 10,
    bgGradient: "from-amber-700 via-orange-700 to-yellow-700",
    rewardXP: 60,
    rewardStars: 3,
    discoveryDescription: "You brushed the cave floor and found a Golden Triceratops Horn!",
  },
  {
    id: "zone-starlight-observatory",
    activityId: "act-secret-starlight",
    title: "Starlight Sky Observatory",
    subtitle: "Tap the seven stars that make Little Bear.",
    emoji: "🔭",
    starsRequired: 20,
    bgGradient: "from-indigo-800 via-violet-800 to-slate-900",
    rewardXP: 80,
    rewardStars: 3,
    discoveryDescription: "You lit Little Bear. The telescope found a smiling sky family!",
  },
  {
    id: "zone-coral-cavern",
    activityId: "act-secret-coral",
    title: "Coral Reef Secret Cavern",
    subtitle: "Open the clams. One hides the royal pearl.",
    emoji: "🪸",
    starsRequired: 30,
    bgGradient: "from-teal-700 via-emerald-800 to-cyan-800",
    rewardXP: 100,
    rewardStars: 3,
    discoveryDescription: "You opened the rainbow clam and found the Royal Pearl!",
  },
];

const FINDS_KEY = "toddler-secret-zone-finds";

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

const DINO_PATCHES: { id: string; find?: { emoji: string; name: string; speak: string } }[] = [
  { id: "d1", find: { emoji: "🦴", name: "Rib bone", speak: "A long rib bone!" } },
  { id: "d2" },
  { id: "d3", find: { emoji: "🦕", name: "Long-neck print", speak: "A long-neck footprint!" } },
  { id: "d4" },
  { id: "d5", find: { emoji: "🦖", name: "Roar tooth", speak: "A mighty roar tooth!" } },
  { id: "d6" },
  { id: "d7" },
  { id: "d8", find: { emoji: "🥚", name: "Dino egg", speak: "A round dino egg!" } },
  { id: "d9" },
  { id: "d10", find: { emoji: "👑", name: "Golden horn", speak: "The golden Triceratops horn!" } },
  { id: "d11" },
  { id: "d12" },
];

const BEAR_STAR_IDS = ["s1", "s2", "s3", "s4", "s5", "s6", "s7"];
const SKY_STARS: { id: string; x: number; y: number; bear?: boolean }[] = [
  { id: "s1", x: 22, y: 28, bear: true },
  { id: "s2", x: 34, y: 22, bear: true },
  { id: "s3", x: 46, y: 30, bear: true },
  { id: "s4", x: 52, y: 44, bear: true },
  { id: "s5", x: 64, y: 48, bear: true },
  { id: "s6", x: 72, y: 38, bear: true },
  { id: "s7", x: 78, y: 58, bear: true },
  { id: "n1", x: 12, y: 62 },
  { id: "n2", x: 40, y: 70 },
  { id: "n3", x: 88, y: 24 },
  { id: "n4", x: 18, y: 48 },
  { id: "n5", x: 58, y: 16 },
];

const CLAMS: { id: string; inside: { emoji: string; name: string; pearl?: boolean; royal?: boolean; speak: string } }[] = [
  { id: "c1", inside: { emoji: "🐚", name: "Pink shell", speak: "A pretty shell. Keep looking!" } },
  { id: "c2", inside: { emoji: "🤍", name: "Moon pearl", pearl: true, speak: "A moon-white pearl!" } },
  { id: "c3", inside: { emoji: "🦀", name: "Shy crab", speak: "A shy crab says hello!" } },
  { id: "c4", inside: { emoji: "💗", name: "Rose pearl", pearl: true, speak: "A rose pearl!" } },
  { id: "c5", inside: { emoji: "🌈", name: "Royal pearl", pearl: true, royal: true, speak: "The royal rainbow pearl!" } },
  { id: "c6", inside: { emoji: "🪸", name: "Coral sprig", speak: "A tiny coral sprig." } },
];

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

function DinoCave({ onFoundAll }: { onFoundAll: () => void }) {
  const [brushed, setBrushed] = useState<string[]>([]);
  const fossils = DINO_PATCHES.filter((patch) => patch.find);
  const found = fossils.filter((patch) => brushed.includes(patch.id)).length;
  const done = useRef(false);

  useEffect(() => {
    if (found >= fossils.length && !done.current) {
      done.current = true;
      onFoundAll();
    }
  }, [found, fossils.length, onFoundAll]);

  return (
    <div className="space-y-3">
      <p className="text-center text-sm font-bold text-amber-100">
        Fossils {found} of {fossils.length} · brush every sandy patch
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {DINO_PATCHES.map((patch) => {
          const open = brushed.includes(patch.id);
          return (
            <button
              key={patch.id}
              type="button"
              onClick={() => {
                if (open) return;
                soundEffects.unlock();
                soundEffects.playPop();
                setBrushed((list) => [...list, patch.id]);
                speakText(patch.find?.speak ?? "Just warm sand. Keep brushing!", { pitch: 1.2 });
              }}
              className={`min-h-[5.5rem] sm:min-h-[6.5rem] rounded-[1.6rem] border-4 text-4xl sm:text-5xl font-black shadow-inner ${
                open
                  ? "bg-amber-100 border-amber-300 text-amber-900"
                  : "bg-gradient-to-b from-yellow-700 to-amber-900 border-amber-950 text-amber-200"
              }`}
              aria-label={open ? patch.find?.name ?? "Sand" : "Brush this sand"}
            >
              {open ? patch.find?.emoji ?? "🪨" : "🏜️"}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Observatory({ onFoundAll }: { onFoundAll: () => void }) {
  const [lit, setLit] = useState<string[]>([]);
  const bearLit = BEAR_STAR_IDS.filter((id) => lit.includes(id)).length;
  const done = useRef(false);

  useEffect(() => {
    if (bearLit >= BEAR_STAR_IDS.length && !done.current) {
      done.current = true;
      onFoundAll();
    }
  }, [bearLit, onFoundAll]);

  return (
    <div className="space-y-3">
      <p className="text-center text-sm font-bold text-indigo-100">
        Little Bear {bearLit} of {BEAR_STAR_IDS.length} · skip the spare twinkles
      </p>
      <div className="relative min-h-[22rem] h-[min(58vh,32rem)] overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#07061a] via-[#12104a] to-[#1b1658] border-4 border-indigo-300/40">
        {SKY_STARS.map((star) => {
          const on = lit.includes(star.id);
          return (
            <button
              key={star.id}
              type="button"
              onClick={() => {
                soundEffects.unlock();
                if (star.bear) {
                  if (!on) {
                    soundEffects.playSuccessChime();
                    setLit((list) => [...list, star.id]);
                    speakText("That star belongs to Little Bear!", { pitch: 1.25 });
                  }
                } else {
                  soundEffects.playGentleBoing();
                  speakText("A spare twinkle. Look for the dipper shape!", { pitch: 1.15 });
                }
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full ${
                on ? "text-5xl" : "text-3xl opacity-70"
              }`}
              style={{ left: `${star.x}%`, top: `${star.y}%` }}
              aria-label={star.bear ? "Bear star" : "Spare star"}
            >
              {on ? "🌟" : "✨"}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CoralCavern({ onFoundAll }: { onFoundAll: () => void }) {
  const [open, setOpen] = useState<string[]>([]);
  const pearls = CLAMS.filter((clam) => clam.inside.pearl);
  const found = pearls.filter((clam) => open.includes(clam.id)).length;
  const done = useRef(false);

  useEffect(() => {
    if (found >= pearls.length && !done.current) {
      done.current = true;
      onFoundAll();
    }
  }, [found, pearls.length, onFoundAll]);

  return (
    <div className="space-y-3">
      <p className="text-center text-sm font-bold text-cyan-100">
        Pearls {found} of {pearls.length} · open every clam
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CLAMS.map((clam) => {
          const shown = open.includes(clam.id);
          return (
            <button
              key={clam.id}
              type="button"
              onClick={() => {
                if (shown) return;
                soundEffects.unlock();
                soundEffects.playPop();
                setOpen((list) => [...list, clam.id]);
                speakText(clam.inside.speak, { pitch: 1.2 });
              }}
              className={`min-h-[7rem] rounded-[1.8rem] border-4 text-5xl shadow-lg ${
                shown
                  ? clam.inside.royal
                    ? "bg-fuchsia-200 border-amber-300"
                    : "bg-cyan-100 border-cyan-300"
                  : "bg-gradient-to-b from-teal-500 to-emerald-800 border-emerald-950"
              }`}
              aria-label={shown ? clam.inside.name : "Closed clam"}
            >
              {shown ? clam.inside.emoji : "🦪"}
            </button>
          );
        })}
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
    const line = done
      ? zone.discoveryDescription
      : `${zone.title}. ${zone.subtitle}`;
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

      {done && (
        <p className="text-center text-base font-black text-amber-100">{zone.discoveryDescription}</p>
      )}

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
