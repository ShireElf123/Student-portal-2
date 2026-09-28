import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Volume2,
  Check,
  RefreshCw,
  Award,
  Star,
  Zap,
  ArrowRight,
  Heart,
  Palette,
  Smile,
  Shield,
  Bot,
} from "lucide-react";
import {
  BuddyCompanionConfig,
  BuddyArchetype,
  BuddyColor,
  BuddyEyeStyle,
  BuddyHat,
  BuddyAccessory,
} from "../types";
import { BuddyCompanionBadge } from "./BuddyCompanionBadge";
import {
  getGamificationState,
  saveBuddyCompanion,
  awardXP,
  triggerCelebrationConfetti,
} from "../utils/gamification";
import { soundEffects } from "../utils/soundEffects";
import { speakText, stopSpeaking } from "../utils/speechUtils";

interface BuddyAvatarStudioProps {
  onDone?: () => void;
  onBack?: () => void;
}

const ARCHETYPES: { id: BuddyArchetype; label: string; icon: string; desc: string }[] = [
  { id: "monster", label: "Friendly Monster", icon: "👾", desc: "Fuzzy, joyful, and loves solving puzzles!" },
  { id: "alien", label: "Cosmic Alien", icon: "🛸", desc: "Curious stargazer with a glowing antenna." },
  { id: "robot", label: "Whiz-Kid Robot", icon: "🤖", desc: "Clever inventor powered by math and sparks." },
  { id: "forest-bunny", label: "Explorer Bunny", icon: "🐰", desc: "Swift, cheerful woodland explorer." },
];

const COLORS: { id: BuddyColor; label: string; bgClass: string; borderClass: string }[] = [
  { id: "pink", label: "Bubblegum Pink", bgClass: "bg-pink-500", borderClass: "border-pink-400" },
  { id: "blue", label: "Sky Cyan", bgClass: "bg-sky-400", borderClass: "border-sky-300" },
  { id: "lime", label: "Forest Lime", bgClass: "bg-lime-400", borderClass: "border-lime-300" },
  { id: "amber", label: "Solar Honey", bgClass: "bg-amber-400", borderClass: "border-amber-300" },
  { id: "purple", label: "Galactic Violet", bgClass: "bg-purple-500", borderClass: "border-purple-400" },
  { id: "coral", label: "Sunset Coral", bgClass: "bg-orange-500", borderClass: "border-orange-400" },
];

const EYES: { id: BuddyEyeStyle; label: string; icon: string }[] = [
  { id: "cyclops", label: "Big Hero Eye", icon: "👁️" },
  { id: "happy", label: "Happy Sparkle", icon: "👀" },
  { id: "starry", label: "Starry Wonder", icon: "⭐" },
  { id: "wink", label: "Cheeky Wink", icon: "😉" },
  { id: "goggles", label: "Explorer Goggles", icon: "🥽" },
];

const HATS: { id: BuddyHat; label: string; icon: string }[] = [
  { id: "explorer", label: "Camp Scout Hat", icon: "🏕️" },
  { id: "party", label: "Party Cone", icon: "🎉" },
  { id: "wizard", label: "Wizard Star Hat", icon: "🧙" },
  { id: "astronaut", label: "Space Visor", icon: "🚀" },
  { id: "crown", label: "Golden Crown", icon: "👑" },
  { id: "none", label: "No Hat", icon: "✨" },
];

const ACCESSORIES: { id: BuddyAccessory; label: string; icon: string }[] = [
  { id: "bowtie", label: "Red Bowtie", icon: "🎀" },
  { id: "cape", label: "Hero Cape", icon: "🦸" },
  { id: "medal", label: "Star Medal", icon: "🏅" },
  { id: "balloon", label: "Joy Balloon", icon: "🎈" },
  { id: "none", label: "None", icon: "🌟" },
];

const PRESET_NAMES = ["Pip", "Barnaby", "Sparky", "Bubbles", "Kiko", "Luna", "Ziggy", "Milo"];

export function BuddyAvatarStudio({ onDone, onBack }: BuddyAvatarStudioProps) {
  const currentSaved = getGamificationState().buddy || {
    id: "buddy-1",
    name: "Pip",
    archetype: "monster",
    color: "pink",
    eyeStyle: "cyclops",
    hat: "explorer",
    accessory: "bowtie",
    catchphrase: "Let's explore and discover wonders today!",
  };

  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [buddy, setBuddy] = useState<BuddyCompanionConfig>(currentSaved);
  const [speechBubble, setSpeechBubble] = useState<string>(buddy.catchphrase);
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  // Clean speech on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const handleHearVoice = () => {
    soundEffects.playPop();
    const greetings = [
      `Hi friend! I'm ${buddy.name}! Ready to learn together?`,
      `Yay! You made me look so cool! Let's go earn some golden stars!`,
      `Beep boop! High five! Today is going to be amazing!`,
    ];
    const phrase = greetings[Math.floor(Math.random() * greetings.length)];
    setSpeechBubble(phrase);
    speakText(phrase, {
      pitch: buddy.archetype === "robot" ? 1.0 : buddy.archetype === "forest-bunny" ? 1.4 : 1.25,
      rate: 0.95,
    });
  };

  const handleSaveBuddy = () => {
    saveBuddyCompanion(buddy);
    awardXP(50, "Designed Learning Buddy");
    setIsSavedRecently(true);
    soundEffects.playFanfare();
    triggerCelebrationConfetti();
    speakText(`Hooray! ${buddy.name} is now your learning buddy! Let's conquer the odyssey!`, {
      pitch: 1.3,
      rate: 0.95,
    });
    setTimeout(() => {
      if (onDone) onDone();
    }, 1800);
  };

  const handleRandomize = () => {
    soundEffects.playPop();
    const randomArchetype = ARCHETYPES[Math.floor(Math.random() * ARCHETYPES.length)].id;
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)].id;
    const randomEye = EYES[Math.floor(Math.random() * EYES.length)].id;
    const randomHat = HATS[Math.floor(Math.random() * HATS.length)].id;
    const randomAccessory = ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)].id;
    const randomName = PRESET_NAMES[Math.floor(Math.random() * PRESET_NAMES.length)];

    setBuddy({
      ...buddy,
      archetype: randomArchetype,
      color: randomColor,
      eyeStyle: randomEye,
      hat: randomHat,
      accessory: randomAccessory,
      name: randomName,
    });
  };

  return (
    <div className="min-h-full pb-20 bg-[#070814] text-white p-4 sm:p-8">
      {/* Top Banner (Amumba / Smeshariki Inspired) */}
      <div className="max-w-4xl mx-auto text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/20 via-sky-500/20 to-lime-500/20 border border-white/10 text-pink-300 text-xs font-black uppercase tracking-wider">
          <Sparkles size={14} className="animate-spin text-yellow-300" /> Buddy &amp; Companion Generator
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Create Your Learning Companion
        </h1>
        <p className="text-white/60 text-xs sm:text-sm max-w-xl mx-auto">
          Design your custom buddy! Choose your favorite creature, customize its colors, hats, and eyewear. Your buddy accompanies you on all quizzes and journeys!
        </p>

        {/* Step Tabs Bar */}
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setActiveStep(1)}
            className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer border-b-4 ${
              activeStep === 1
                ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-700 scale-105 shadow-lg shadow-pink-500/30"
                : "bg-white/5 border-white/10 text-white/50 hover:text-white"
            }`}
          >
            1. Character Type
          </button>
          <button
            onClick={() => setActiveStep(2)}
            className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer border-b-4 ${
              activeStep === 2
                ? "bg-gradient-to-r from-sky-500 to-blue-500 text-white border-blue-700 scale-105 shadow-lg shadow-blue-500/30"
                : "bg-white/5 border-white/10 text-white/50 hover:text-white"
            }`}
          >
            2. Colors &amp; Eyes
          </button>
          <button
            onClick={() => setActiveStep(3)}
            className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer border-b-4 ${
              activeStep === 3
                ? "bg-gradient-to-r from-lime-500 to-emerald-500 text-white border-emerald-700 scale-105 shadow-lg shadow-emerald-500/30"
                : "bg-white/5 border-white/10 text-white/50 hover:text-white"
            }`}
          >
            3. Hats &amp; Gear
          </button>
        </div>
      </div>

      {/* Main Studio Interactive Stage */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: LIVE COMPANION PREVIEW CARD (Agency 3D Pedestal) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-sky-500/10 via-white/[0.04] to-purple-500/10 border-2 border-white/20 shadow-2xl overflow-hidden text-center">
            {/* Background Ray Glow */}
            <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent pointer-events-none" />

            {/* Speech Bubble Above Head */}
            <motion.div
              key={speechBubble}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative inline-block max-w-xs mx-auto mb-4 px-4 py-2.5 rounded-2xl bg-white text-slate-900 font-bold text-xs shadow-lg"
            >
              <span>{speechBubble}</span>
              {/* Bubble arrow */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white" />
            </motion.div>

            {/* Main Interactive Mascot Visual */}
            <div className="py-2 flex justify-center">
              <BuddyCompanionBadge
                buddy={buddy}
                size="xl"
                animated={true}
                onClick={handleHearVoice}
              />
            </div>

            {/* Pedestal Base Ring */}
            <div className="w-44 h-6 mx-auto -mt-3 rounded-[100%] bg-gradient-to-r from-indigo-500/40 via-sky-400/60 to-purple-500/40 blur-sm" />

            {/* Mascot Name & Archetype Tag */}
            <div className="mt-4 space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white font-black text-xs uppercase tracking-wider">
                <span>{ARCHETYPES.find((a) => a.id === buddy.archetype)?.icon}</span>
                <span>{ARCHETYPES.find((a) => a.id === buddy.archetype)?.label}</span>
              </div>
              <h2 className="text-2xl font-black text-white">{buddy.name}</h2>
            </div>

            {/* Voice & Randomize Action Bar */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={handleHearVoice}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
              >
                <Volume2 size={16} className="text-cyan-300" />
                <span>Hear Voice</span>
              </button>

              <button
                onClick={handleRandomize}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
              >
                <RefreshCw size={14} className="text-amber-300" />
                <span>Surprise Me!</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CUSTOMIZER CONTROLS */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: ARCHETYPE & NAME */}
          {activeStep === 1 && (
            <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/10 space-y-6">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>1️⃣</span> Choose Your Character Species
                </h3>
                <p className="text-white/60 text-xs mt-1">
                  Pick the creature body archetype for your companion buddy.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ARCHETYPES.map((arch) => {
                  const isSelected = buddy.archetype === arch.id;
                  return (
                    <motion.div
                      key={arch.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        soundEffects.playPop();
                        setBuddy({ ...buddy, archetype: arch.id });
                      }}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3.5 ${
                        isSelected
                          ? "bg-pink-500/15 border-pink-400 ring-2 ring-pink-400/30"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div className="text-3xl">{arch.icon}</div>
                      <div>
                        <div className="text-sm font-black text-white flex items-center gap-1.5">
                          <span>{arch.label}</span>
                          {isSelected && <Check size={14} className="text-pink-400" />}
                        </div>
                        <div className="text-[11px] text-white/60 line-clamp-1">{arch.desc}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Name Picker */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="text-xs font-black text-white/80">Companion's Name</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={buddy.name}
                    onChange={(e) => setBuddy({ ...buddy, name: e.target.value })}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-sm focus:outline-none focus:border-pink-400"
                    placeholder="Enter buddy name..."
                    maxLength={14}
                  />
                  <div className="flex gap-1 overflow-x-auto py-1">
                    {PRESET_NAMES.slice(0, 4).map((name) => (
                      <button
                        key={name}
                        onClick={() => setBuddy({ ...buddy, name })}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[11px] font-bold text-white/80 cursor-pointer"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    soundEffects.playPop();
                    setActiveStep(2);
                  }}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-500 text-white font-black text-xs border-b-4 border-blue-700 shadow-lg cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Next: Colors &amp; Eyes</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: COLORS & EYE STYLES */}
          {activeStep === 2 && (
            <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/10 space-y-6">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>2️⃣</span> Colors &amp; Expressions
                </h3>
                <p className="text-white/60 text-xs mt-1">
                  Pick the body color palette and emotional eye style.
                </p>
              </div>

              {/* Color Swatches */}
              <div className="space-y-2">
                <label className="text-xs font-black text-white/80 flex items-center gap-1.5">
                  <Palette size={14} /> Body Color
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {COLORS.map((col) => {
                    const isSelected = buddy.color === col.id;
                    return (
                      <button
                        key={col.id}
                        onClick={() => {
                          soundEffects.playPop();
                          setBuddy({ ...buddy, color: col.id });
                        }}
                        className={`p-3 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all cursor-pointer ${
                          isSelected
                            ? "border-white ring-2 ring-white/40 bg-white/10 scale-105"
                            : "border-transparent bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full ${col.bgClass} shadow-md`} />
                        <span className="text-[10px] font-bold text-white/80 text-center leading-tight">
                          {col.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Eye Styles */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="text-xs font-black text-white/80 flex items-center gap-1.5">
                  <Smile size={14} /> Eyes &amp; Expression
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {EYES.map((eye) => {
                    const isSelected = buddy.eyeStyle === eye.id;
                    return (
                      <button
                        key={eye.id}
                        onClick={() => {
                          soundEffects.playPop();
                          setBuddy({ ...buddy, eyeStyle: eye.id });
                        }}
                        className={`p-3 rounded-2xl flex items-center gap-2.5 border-2 transition-all cursor-pointer text-left ${
                          isSelected
                            ? "bg-sky-500/15 border-sky-400 ring-2 ring-sky-400/30"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <span className="text-xl">{eye.icon}</span>
                        <span className="text-xs font-black text-white">{eye.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setActiveStep(1)}
                  className="px-4 py-2.5 rounded-2xl bg-white/10 text-white font-bold text-xs cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    soundEffects.playPop();
                    setActiveStep(3);
                  }}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-lime-500 to-emerald-500 text-white font-black text-xs border-b-4 border-emerald-700 shadow-lg cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Next: Hats &amp; Gear</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: HATS & ACCESSORIES */}
          {activeStep === 3 && (
            <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/10 space-y-6">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>3️⃣</span> Headwear &amp; Hero Gear
                </h3>
                <p className="text-white/60 text-xs mt-1">
                  Equip cool camp explorer hats, crowns, capes, or medals!
                </p>
              </div>

              {/* Hats */}
              <div className="space-y-2">
                <label className="text-xs font-black text-white/80">Hats &amp; Headgear</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {HATS.map((hat) => {
                    const isSelected = buddy.hat === hat.id;
                    return (
                      <button
                        key={hat.id}
                        onClick={() => {
                          soundEffects.playPop();
                          setBuddy({ ...buddy, hat: hat.id });
                        }}
                        className={`p-3 rounded-2xl flex items-center gap-2.5 border-2 transition-all cursor-pointer text-left ${
                          isSelected
                            ? "bg-lime-500/15 border-lime-400 ring-2 ring-lime-400/30"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <span className="text-xl">{hat.icon}</span>
                        <span className="text-xs font-black text-white">{hat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Accessories */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="text-xs font-black text-white/80">Chest &amp; Back Accessories</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {ACCESSORIES.map((acc) => {
                    const isSelected = buddy.accessory === acc.id;
                    return (
                      <button
                        key={acc.id}
                        onClick={() => {
                          soundEffects.playPop();
                          setBuddy({ ...buddy, accessory: acc.id });
                        }}
                        className={`p-3 rounded-2xl flex items-center gap-2.5 border-2 transition-all cursor-pointer text-left ${
                          isSelected
                            ? "bg-purple-500/15 border-purple-400 ring-2 ring-purple-400/30"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <span className="text-xl">{acc.icon}</span>
                        <span className="text-xs font-black text-white">{acc.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-4 py-2.5 rounded-2xl bg-white/10 text-white font-bold text-xs cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleSaveBuddy}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 hover:from-amber-300 hover:to-pink-400 text-white font-black text-sm border-b-4 border-rose-800 shadow-xl shadow-orange-500/30 cursor-pointer inline-flex items-center gap-2 active:border-b-0 active:translate-y-1"
                >
                  <Sparkles size={18} />
                  <span>{isSavedRecently ? "Saved! ✨" : "Save & Make My Learning Buddy (+50 XP)"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
