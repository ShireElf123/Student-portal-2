import React, { useEffect, useState } from "react";
import { Volume2 } from "lucide-react";
import {
  BODY_CHECKS,
  BREATH_ROUNDS,
  HEAVY_ROUNDS,
  LOOK_ROUNDS,
  MOVE_ROUNDS,
  QUIET_ROUNDS,
  type BodyKind,
  type BreathRound,
  type HeavyRound,
  type LookRound,
  type MoveRound,
  type QuietRound,
} from "../data/toddler/focusBoard";
import { speakText } from "../utils/speechUtils";
import { soundEffects } from "../utils/soundEffects";
import { recordFocusRoundDone } from "../data/toddler/toddlerDailyAdventure";
import { CharacterAnchor } from "./landscape/LandscapeDecorations";

type Mode = "check" | "move" | "push" | "breathe" | "look" | "quiet";

const MODES: { id: Mode; label: string; emoji: string }[] = [
  { id: "check", label: "Body", emoji: "🫀" },
  { id: "move", label: "Move", emoji: "🦶" },
  { id: "push", label: "Push", emoji: "🧱" },
  { id: "breathe", label: "Breathe", emoji: "🌸" },
  { id: "look", label: "Look", emoji: "👀" },
  { id: "quiet", label: "Quiet", emoji: "🫙" },
];

function TimerBar({ seconds, running, onDone }: { seconds: number; running: boolean; onDone: () => void }) {
  const [left, setLeft] = useState(seconds);
  const fired = React.useRef(false);

  useEffect(() => {
    fired.current = false;
    setLeft(seconds);
  }, [seconds, running]);

  useEffect(() => {
    if (!running || fired.current) return;
    if (left <= 0) {
      fired.current = true;
      onDone();
      return;
    }
    const id = window.setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => window.clearTimeout(id);
  }, [running, left, onDone]);

  const pct = Math.max(0, Math.min(100, (left / seconds) * 100));
  return (
    <div className="mt-4">
      <p className="text-4xl font-black tabular-nums mb-2">{left}s</p>
      <div className="h-5 rounded-full bg-teal-100 border-2 border-teal-400 overflow-hidden">
        <div className="h-full bg-teal-500 transition-all duration-1000 linear" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function ToddlerFocusBoard({
  isMeadow,
  onAddStar,
  onReadyLearn,
}: {
  isMeadow: boolean;
  onAddStar?: () => void;
  onReadyLearn?: () => void;
}) {
  const [mode, setMode] = useState<Mode>("check");
  const [body, setBody] = useState<BodyKind | null>(null);
  const [moveIndex, setMoveIndex] = useState(0);
  const [pushIndex, setPushIndex] = useState(0);
  const [breathIndex, setBreathIndex] = useState(0);
  const [lookIndex, setLookIndex] = useState(0);
  const [quietIndex, setQuietIndex] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
  const [breathStep, setBreathStep] = useState(0);

  const movePool =
    body === "floppy"
      ? MOVE_ROUNDS.filter((round) => round.kind === "cardio")
      : body === "wiggles"
        ? MOVE_ROUNDS.filter((round) => round.kind === "stretch")
        : MOVE_ROUNDS;
  const move: MoveRound = movePool[moveIndex % movePool.length];
  const push: HeavyRound = HEAVY_ROUNDS[pushIndex % HEAVY_ROUNDS.length];
  const breath: BreathRound = BREATH_ROUNDS[breathIndex % BREATH_ROUNDS.length];
  const look: LookRound = LOOK_ROUNDS[lookIndex % LOOK_ROUNDS.length];
  const quiet: QuietRound = QUIET_ROUNDS[quietIndex % QUIET_ROUNDS.length];

  const panel = isMeadow ? "bg-white border-teal-300 text-slate-900" : "bg-[#16162a] border-teal-400/50 text-white";
  const ghost = isMeadow ? "bg-white border-teal-200 text-slate-900" : "bg-white/[0.04] border-white/15 text-white";

  useEffect(() => {
    setTimerOn(false);
    setBreathStep(0);
  }, [mode, moveIndex, pushIndex, quietIndex, breathIndex]);

  const finishRound = () => {
    onAddStar?.();
    recordFocusRoundDone();
    soundEffects.playPop();
  };

  const goSuggested = (next: Mode, spoken: string) => {
    setMode(next);
    speakText(spoken, { pitch: 1.12, rate: 0.9 });
    soundEffects.playPop();
  };

  return (
    <div className="relative">
      <div className="hidden sm:block">
        <CharacterAnchor emoji="🧸" title="Teddy" subtitle="Move, then settle." position="top-right" />
      </div>
      <div className="mb-4">
        <h2 className={`text-xl sm:text-2xl font-black flex items-center gap-2 ${isMeadow ? "text-slate-900" : "text-white"}`}>
          <span>🫀</span> Focus Body
        </h2>
        <p className={`text-sm sm:text-base font-semibold ${isMeadow ? "text-slate-800" : "text-white/90"}`}>
          Check the body. Move or push. Breathe. Quiet. Then learn. Short and done — even for zoomies.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {MODES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setMode(item.id);
              soundEffects.playPop();
              if (item.id === "move") speakText(move.spoken, { pitch: 1.12, rate: 0.9 });
              if (item.id === "push") speakText(push.spoken, { pitch: 1.12, rate: 0.9 });
              if (item.id === "breathe") speakText(breath.spoken, { pitch: 1.1, rate: 0.88 });
              if (item.id === "look") speakText(look.spoken, { pitch: 1.12, rate: 0.9 });
              if (item.id === "quiet") speakText(quiet.spoken, { pitch: 1.05, rate: 0.86 });
              if (item.id === "check") speakText("How does the body feel right now?", { pitch: 1.12, rate: 0.9 });
            }}
            className={`min-h-14 rounded-full px-4 py-2 font-black border-b-4 ${
              mode === item.id ? "bg-teal-400 border-teal-700 text-teal-950" : ghost
            }`}
          >
            {item.emoji} {item.label}
          </button>
        ))}
      </div>

      {mode === "check" && (
        <div className={`rounded-[2rem] border-4 p-5 ${panel}`}>
          <p className="text-lg font-black mb-4">How does the body feel?</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {BODY_CHECKS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setBody(item.id);
                  goSuggested(item.suggest, item.spoken);
                }}
                className={`min-h-28 rounded-[1.75rem] p-4 text-left border-4 ${
                  body === item.id ? "bg-teal-200 border-teal-700" : ghost
                }`}
              >
                <p className="text-4xl">{item.emoji}</p>
                <p className="text-base font-black mt-1">{item.label}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === "move" && (
        <div className={`rounded-[2rem] border-4 p-5 ${panel}`}>
          <p className="text-5xl mb-2">{move.emoji}</p>
          <p className="text-2xl font-black">{move.title}</p>
          <p className="text-lg font-black mb-3">{move.spoken}</p>
          <button
            type="button"
            className="min-h-12 rounded-full bg-white/80 px-4 py-2 font-black text-teal-950 border-b-4 border-teal-600 mb-2 inline-flex items-center gap-2"
            onClick={() => speakText(move.spoken, { pitch: 1.12, rate: 0.9 })}
          >
            <Volume2 size={18} /> Hear it
          </button>
          {!timerOn ? (
            <button
              type="button"
              className="block min-h-16 rounded-full bg-teal-400 px-8 py-3 text-xl font-black text-teal-950 border-b-4 border-teal-700"
              onClick={() => {
                setTimerOn(true);
                speakText(move.spoken, { pitch: 1.12, rate: 0.9 });
              }}
            >
              Start
            </button>
          ) : (
            <TimerBar
              seconds={move.seconds}
              running={timerOn}
              onDone={() => {
                setTimerOn(false);
                finishRound();
                const next = (moveIndex + 1) % movePool.length;
                setMoveIndex(next);
                speakText(`Done. ${movePool[next].spoken}`, { pitch: 1.12, rate: 0.9 });
              }}
            />
          )}
        </div>
      )}

      {mode === "push" && (
        <div className={`rounded-[2rem] border-4 p-5 ${panel}`}>
          <p className="text-5xl mb-2">{push.emoji}</p>
          <p className="text-2xl font-black">{push.title}</p>
          <p className="text-lg font-black mb-3">{push.spoken}</p>
          <button
            type="button"
            className="min-h-12 rounded-full bg-white/80 px-4 py-2 font-black text-teal-950 border-b-4 border-teal-600 mb-2 inline-flex items-center gap-2"
            onClick={() => speakText(push.spoken, { pitch: 1.12, rate: 0.9 })}
          >
            <Volume2 size={18} /> Hear it
          </button>
          {!timerOn ? (
            <button
              type="button"
              className="block min-h-16 rounded-full bg-teal-400 px-8 py-3 text-xl font-black text-teal-950 border-b-4 border-teal-700"
              onClick={() => {
                setTimerOn(true);
                speakText(push.spoken, { pitch: 1.12, rate: 0.9 });
              }}
            >
              Start
            </button>
          ) : (
            <TimerBar
              seconds={push.seconds}
              running={timerOn}
              onDone={() => {
                setTimerOn(false);
                finishRound();
                const next = (pushIndex + 1) % HEAVY_ROUNDS.length;
                setPushIndex(next);
                speakText(`Done. ${HEAVY_ROUNDS[next].spoken}`, { pitch: 1.12, rate: 0.9 });
              }}
            />
          )}
        </div>
      )}

      {mode === "breathe" && (
        <div className={`rounded-[2rem] border-4 p-5 ${panel}`}>
          <p className="text-5xl mb-2">{breath.emoji}</p>
          <p className="text-2xl font-black">{breath.title}</p>
          <p className="text-lg font-black mb-4">{breath.spoken}</p>
          <p className="text-sm font-black opacity-80 mb-3">
            In {breath.inCount}. Out {breath.outCount}. Tap each breath.
          </p>
          <button
            type="button"
            className="min-h-20 min-w-40 rounded-full bg-teal-400 px-8 py-4 text-2xl font-black text-teal-950 border-b-4 border-teal-700"
            onClick={() => {
              const next = breathStep + 1;
              setBreathStep(next);
              speakText(next % 2 === 1 ? "In." : "Out.", { pitch: 1.05, rate: 0.85 });
              if (next >= 6) {
                finishRound();
                setBreathStep(0);
                const nxt = (breathIndex + 1) % BREATH_ROUNDS.length;
                setBreathIndex(nxt);
                speakText(`Nice and slow. ${BREATH_ROUNDS[nxt].spoken}`, { pitch: 1.08, rate: 0.88 });
              }
            }}
          >
            {breathStep % 2 === 0 ? "Breathe in" : "Breathe out"} · {breathStep}/6
          </button>
        </div>
      )}

      {mode === "look" && (
        <div className={`rounded-[2rem] border-4 p-5 ${panel}`}>
          <p className="text-5xl mb-2">{look.emoji}</p>
          <p className="text-2xl font-black">{look.title}</p>
          <p className="text-lg font-black mb-4">{look.spoken}</p>
          <button
            type="button"
            className="min-h-16 rounded-full bg-teal-400 px-8 py-3 text-xl font-black text-teal-950 border-b-4 border-teal-700"
            onClick={() => {
              finishRound();
              const next = (lookIndex + 1) % LOOK_ROUNDS.length;
              setLookIndex(next);
              speakText(`${look.prompt}. ${LOOK_ROUNDS[next].spoken}`, { pitch: 1.12, rate: 0.9 });
            }}
          >
            Done
          </button>
        </div>
      )}

      {mode === "quiet" && (
        <div className={`rounded-[2rem] border-4 p-5 ${panel}`}>
          <p className="text-5xl mb-2">{quiet.emoji}</p>
          <p className="text-2xl font-black">{quiet.title}</p>
          <p className="text-lg font-black mb-3">{quiet.spoken}</p>
          {!timerOn ? (
            <button
              type="button"
              className="block min-h-16 rounded-full bg-teal-400 px-8 py-3 text-xl font-black text-teal-950 border-b-4 border-teal-700"
              onClick={() => {
                setTimerOn(true);
                speakText(quiet.spoken, { pitch: 1.05, rate: 0.86 });
              }}
            >
              Start quiet
            </button>
          ) : (
            <TimerBar
              seconds={quiet.seconds}
              running={timerOn}
              onDone={() => {
                setTimerOn(false);
                finishRound();
                const next = (quietIndex + 1) % QUIET_ROUNDS.length;
                setQuietIndex(next);
                speakText("The body is quieter. Ready to learn if you want.", { pitch: 1.08, rate: 0.88 });
              }}
            />
          )}
          {onReadyLearn && (
            <button
              type="button"
              className="mt-4 min-h-12 rounded-full bg-amber-300 px-6 py-2 font-black text-amber-950 border-b-4 border-amber-600"
              onClick={() => {
                speakText("Let's go learn.", { pitch: 1.12 });
                onReadyLearn();
              }}
            >
              Ready — Phonics
            </button>
          )}
        </div>
      )}
    </div>
  );
}
