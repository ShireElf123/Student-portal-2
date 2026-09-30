import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Music, Sparkles, Star, RotateCcw, Volume2, Award, Play } from "lucide-react";
import { soundEffects } from "../utils/soundEffects";
import { speakText } from "../utils/speechUtils";
import { awardXP, triggerCelebrationConfetti } from "../utils/gamification";
import {
  completeActiveMissionIfMatches,
  recordDailyCount,
} from "../data/toddler/toddlerDailyAdventure";

interface KeyConfig {
  note: string;
  solfege: string;
  freq: number;
  colorClass: string;
  borderClass: string;
  shadowColor: string;
}

const XYLOPHONE_KEYS: KeyConfig[] = [
  { note: "C", solfege: "Do", freq: 261.63, colorClass: "from-red-500 to-rose-600", borderClass: "border-red-700", shadowColor: "rgba(239,68,68,0.4)" },
  { note: "D", solfege: "Re", freq: 293.66, colorClass: "from-orange-500 to-amber-600", borderClass: "border-orange-700", shadowColor: "rgba(249,115,22,0.4)" },
  { note: "E", solfege: "Mi", freq: 329.63, colorClass: "from-yellow-400 to-amber-500", borderClass: "border-yellow-600", shadowColor: "rgba(234,179,8,0.4)" },
  { note: "F", solfege: "Fa", freq: 349.23, colorClass: "from-emerald-500 to-teal-600", borderClass: "border-emerald-700", shadowColor: "rgba(16,185,129,0.4)" },
  { note: "G", solfege: "Sol", freq: 392.00, colorClass: "from-cyan-500 to-blue-600", borderClass: "border-cyan-700", shadowColor: "rgba(6,182,212,0.4)" },
  { note: "A", solfege: "La", freq: 440.00, colorClass: "from-indigo-500 to-blue-700", borderClass: "border-indigo-700", shadowColor: "rgba(99,102,241,0.4)" },
  { note: "B", solfege: "Ti", freq: 493.88, colorClass: "from-purple-500 to-pink-600", borderClass: "border-purple-700", shadowColor: "rgba(168,85,247,0.4)" },
  { note: "C+", solfege: "High Do", freq: 523.25, colorClass: "from-pink-500 to-rose-500", borderClass: "border-pink-700", shadowColor: "rgba(236,72,153,0.4)" },
];

interface Song {
  id: string;
  title: string;
  emoji: string;
  notes: string[];
}

const SONGS: Song[] = [
  {
    id: "twinkle",
    title: "Twinkle Twinkle Little Star",
    emoji: "⭐",
    notes: ["C", "C", "G", "G", "A", "A", "G", "F", "F", "E", "E", "D", "D", "C", "G", "G", "F", "F", "E", "E", "D", "G", "G", "F", "F", "E", "E", "D", "C", "C", "G", "G", "A", "A", "G", "F", "F", "E", "E", "D", "D", "C"],
  },
  {
    id: "mary",
    title: "Mary Had a Little Lamb",
    emoji: "🐑",
    notes: ["E", "D", "C", "D", "E", "E", "E"],
  },
  {
    id: "row",
    title: "Row Row Row Your Boat",
    emoji: "🚣",
    notes: ["C", "C", "C", "D", "E", "E", "D", "E", "F", "G", "C+", "C+", "C+", "G", "G", "E", "E", "C", "C", "C"],
  },
  {
    id: "old-mac",
    title: "Old MacDonald Had a Farm",
    emoji: "🚜",
    notes: ["G", "G", "G", "E", "C", "C", "E", "G", "G", "E", "C", "C"],
  },
  {
    id: "wheels",
    title: "The Wheels on the Bus",
    emoji: "🚌",
    notes: ["C", "F", "F", "F", "F", "A", "C+", "A", "F"],
  },
  {
    id: "london",
    title: "London Bridge is Falling Down",
    emoji: "🌉",
    notes: ["G", "A", "G", "F", "E", "F", "G"],
  },
  {
    id: "baa",
    title: "Baa Baa Black Sheep",
    emoji: "🐑",
    notes: ["C", "C", "G", "G", "A", "A", "G", "F", "F", "E", "E", "D", "D", "C", "G", "G", "F", "F", "E", "E", "D", "G", "G", "F", "F", "E", "E", "D", "C", "C", "G", "G", "A", "A", "G", "F", "F", "E", "E", "D", "D", "C"],
  },
  {
    id: "jingle",
    title: "Jingle Bells Melody",
    emoji: "🔔",
    notes: ["E", "E", "E", "E", "E", "E", "E", "G", "C", "D", "E"],
  },
];

interface ToddlerMusicPianoProps {
  onAddStar?: (amount?: number) => void;
}

export function ToddlerMusicPiano({ onAddStar }: ToddlerMusicPianoProps) {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [currentNoteIdx, setCurrentNoteIdx] = useState<number>(0);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [songCompleted, setSongCompleted] = useState<boolean>(false);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const demoTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const stopDemo = () => {
    demoTimers.current.forEach(clearTimeout);
    demoTimers.current = [];
    setIsPlayingDemo(false);
    setActiveKey(null);
  };

  useEffect(() => () => demoTimers.current.forEach(clearTimeout), []);

  const playSongDemo = () => {
    if (!selectedSong || isPlayingDemo) return;
    stopDemo();
    setIsPlayingDemo(true);
    // Start the first note synchronously in the click gesture to unlock Web Audio on iOS/Safari.
    const firstKey = XYLOPHONE_KEYS.find((key) => key.note === selectedSong.notes[0]);
    if (firstKey) {
      soundEffects.playXylophoneKey(firstKey.freq);
      setActiveKey(firstKey.note);
    }
    selectedSong.notes.forEach((note, index) => {
      if (index === 0) return;
      const timer = setTimeout(() => {
        const key = XYLOPHONE_KEYS.find((candidate) => candidate.note === note);
        if (key) { soundEffects.playXylophoneKey(key.freq); setActiveKey(key.note); }
        if (index === selectedSong.notes.length - 1) {
          const endTimer = setTimeout(() => { setActiveKey(null); setIsPlayingDemo(false); }, 450);
          demoTimers.current.push(endTimer);
        } else {
          const offTimer = setTimeout(() => setActiveKey(null), 240);
          demoTimers.current.push(offTimer);
        }
      }, index * 420);
      demoTimers.current.push(timer);
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      speakText("Welcome to the Rainbow Piano! Tap the colorful keys to play sweet musical notes or pick a song to play along!", {
        pitch: 1.25,
        rate: 0.95,
      });
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  const handleKeyPress = (k: KeyConfig) => {
    if (isPlayingDemo) stopDemo();
    setActiveKey(k.note);
    soundEffects.playXylophoneKey(k.freq);

    setTimeout(() => {
      setActiveKey(null);
    }, 200);

    // If practicing a guided song
    if (selectedSong && !songCompleted) {
      const expectedNote = selectedSong.notes[currentNoteIdx];
      if (k.note === expectedNote) {
        if (currentNoteIdx + 1 < selectedSong.notes.length) {
          setCurrentNoteIdx(currentNoteIdx + 1);
        } else {
          // Finished song!
          setSongCompleted(true);
          soundEffects.playFanfare();
          triggerCelebrationConfetti();
          // The first 3 finished songs each day earn rewards; encores after
          // that are free play so replays cannot farm stars and XP.
          if (recordDailyCount("rainbow-piano-song") <= 3) {
            awardXP(35, `Played ${selectedSong.title}`);
            if (onAddStar) onAddStar(2);
          }
          speakText(`Bravo! You played ${selectedSong.title}! What a wonderful musician!`, {
            pitch: 1.3,
            rate: 0.95,
          });
          try {
            completeActiveMissionIfMatches("games", "rainbow-piano");
          } catch {
            // ignore
          }
        }
      }
    }
  };

  const handleSelectSong = (song: Song) => {
    stopDemo();
    setSelectedSong(song);
    setCurrentNoteIdx(0);
    setSongCompleted(false);
    speakText(`Let's play ${song.title}! Tap the glowing rainbow keys!`, {
      pitch: 1.25,
      rate: 0.9,
    });
  };

  const expectedKey = selectedSong && !songCompleted ? selectedSong.notes[currentNoteIdx] : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-indigo-500/15 border-2 border-pink-400/30 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-400/20 text-pink-300 text-xs font-black uppercase tracking-wider">
          <Music size={14} /> Musical Meadow Piano &amp; Xylophone
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Rainbow Music Chimes
        </h2>
        <p className="text-white/70 text-xs sm:text-sm max-w-lg mx-auto">
          Tap the big colorful keys to hear crystal xylophone notes, or choose a nursery rhyme to follow the bouncing star!
        </p>

        {/* Song Selectors */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={() => {
              stopDemo();
              setSelectedSong(null);
              setSongCompleted(false);
              soundEffects.playPop();
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              selectedSong === null
                ? "bg-white text-slate-900 shadow-md scale-105"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            🎨 Free Play Meadow
          </button>

          {SONGS.map((song) => {
            const isSelected = selectedSong?.id === song.id;
            return (
              <button
                key={song.id}
                onClick={() => handleSelectSong(song)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 font-black shadow-md scale-105"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                <span>{song.emoji}</span>
                <span>{song.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Song Guided Notes Display Banner */}
      {selectedSong && (
        <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
          <div className="mb-3 flex flex-wrap justify-center gap-2">
            <button type="button" onClick={playSongDemo} disabled={isPlayingDemo} className="rounded-xl bg-amber-400 px-4 py-2 text-xs font-black text-amber-950 disabled:opacity-50">▶ Hear the tune</button>
            {isPlayingDemo && <button type="button" onClick={stopDemo} className="rounded-xl bg-white/15 px-4 py-2 text-xs font-bold text-white">Stop</button>}
            <span className="self-center text-[11px] text-white/55">Instrumental xylophone notes (not singing)</span>
          </div>
          <div className="text-xs text-white/60 mb-2 font-bold">
            Song Progress: {songCompleted ? "Completed! ⭐⭐⭐" : `Note ${currentNoteIdx + 1} of ${selectedSong.notes.length}`}
          </div>
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-1">
            {selectedSong.notes.map((n, idx) => {
              const isPast = idx < currentNoteIdx;
              const isCurrent = idx === currentNoteIdx && !songCompleted;
              return (
                <div
                  key={idx}
                  className={`w-9 h-11 rounded-xl flex flex-col items-center justify-center font-black text-xs transition-all ${
                    isCurrent
                      ? "bg-amber-400 text-amber-950 scale-110 ring-4 ring-amber-300/40 animate-bounce"
                      : isPast
                      ? "bg-emerald-500/30 text-emerald-300 border border-emerald-400/40"
                      : "bg-white/5 text-white/40"
                  }`}
                >
                  <span>{n}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Chunky Rainbow Xylophone Keys */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border-2 border-white/15 shadow-2xl backdrop-blur-sm">
        <div className="flex items-end justify-center gap-2 sm:gap-3 h-64 sm:h-72">
          {XYLOPHONE_KEYS.map((k, idx) => {
            const isExpected = expectedKey === k.note;
            const heightPercent = 100 - idx * 4; // Graduated lengths like real xylophone
            const isBeingPressed = activeKey === k.note;

            return (
              <motion.button
                key={k.note}
                whileTap={{ scale: 0.95, y: 4 }}
                onClick={() => handleKeyPress(k)}
                style={{ height: `${heightPercent}%` }}
                className={`relative flex-1 rounded-2xl bg-gradient-to-b ${k.colorClass} border-b-6 ${
                  k.borderClass
                } shadow-xl flex flex-col items-center justify-between p-2 sm:p-3 transition-all cursor-pointer select-none ${
                  isBeingPressed ? "brightness-125 translate-y-1" : ""
                } ${
                  isExpected
                    ? "ring-4 ring-white animate-pulse shadow-[0_0_20px_rgba(255,255,255,0.8)]"
                    : ""
                }`}
              >
                {/* Top Mounting Peg */}
                <div className="w-3 h-3 rounded-full bg-slate-900/40 border border-white/30" />

                {/* Expected bouncing star indicator */}
                {isExpected && (
                  <div className="text-xl animate-bounce">
                    ⭐
                  </div>
                )}

                {/* Note and Solfege Labels */}
                <div className="text-center">
                  <div className="text-base sm:text-xl font-black text-white drop-shadow-md">
                    {k.note}
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold text-white/90 uppercase drop-shadow">
                    {k.solfege}
                  </div>
                </div>

                {/* Bottom Mounting Peg */}
                <div className="w-3 h-3 rounded-full bg-slate-900/40 border border-white/30" />
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
