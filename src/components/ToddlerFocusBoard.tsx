import React, { useEffect, useState } from "react";
import { Volume2 } from "lucide-react";
import {
  BODY_CHECKS,
  BREATH_ROUNDS,
  FREEZE_ROUNDS,
  HEAVY_ROUNDS,
  LOOK_ROUNDS,
  MOVE_ROUNDS,
  QUIET_ROUNDS,
  type BodyKind,
  type BreathRound,
  type FreezeRound,
  type HeavyRound,
  type LookRound,
  type MoveRound,
  type QuietRound,
} from "../data/toddler/focusBoard";
import { STEADY_TRACKS, type SteadyTrack } from "../data/toddler/focusSteady";
import { speakText } from "../utils/speechUtils";
import { soundEffects } from "../utils/soundEffects";
import { recordFocusRoundDone } from "../data/toddler/toddlerDailyAdventure";
import { CharacterAnchor } from "./landscape/LandscapeDecorations";
import { ToddlerSteadyLane } from "./ToddlerSteadyLane";

type Mode = "check" | "slow" | "move" | "push" | "freeze" | "breathe" | "look" | "quiet";

const MODES: { id: Mode; label: string; emoji: string }[] = [
  { id: "check", label: "Body", emoji: "🫀" },
  { id: "slow", label: "Slow", emoji: "🐌" },
  { id: "move", label: "Move", emoji: "🦶" },
  { id: "push", label: "Push", emoji: "🧱" },
  { id: "freeze", label: "Freeze", emoji: "🧊" },
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
  const [track, setTrack] = useState<SteadyTrack | null>(null);
  const [move, setMove] = useState<MoveRound | null>(null);
  const [push, setPush] = useState<HeavyRound | null>(null);
  const [freeze, setFreeze] = useState<FreezeRound | null>(null);
  const [breath, setBreath] = useState<BreathRound>(BREATH_ROUNDS[0]);
  const [look, setLook] = useState<LookRound>(LOOK_ROUNDS[0]);
  const [quiet, setQuiet] = useState<QuietRound>(QUIET_ROUNDS[0]);
  const [taps, setTaps] = useState(0);
  const [holdMs, setHoldMs] = useState(0);
  const [holding, setHolding] = useState(false);
  const [timerOn, setTimerOn] = useState(false);
  const [breathStep, setBreathStep] = useState(0);
  const [lookHits, setLookHits] = useState<number[]>([]);
  const [freezeLeft, setFreezeLeft] = useState(0);
  const [canFreeze, setCanFreeze] = useState(false);

  const panel = isMeadow ? "bg-white border-teal-300 text-slate-900" : "bg-[#16162a] border-teal-400/50 text-white";
  const ghost = isMeadow ? "bg-white border-teal-200 text-slate-900" : "bg-white/[0.04] border-white/15 text-white";
  const movePool = body === "floppy" ? MOVE_ROUNDS.filter((round) => round.kind === "cardio") : MOVE_ROUNDS;

  useEffect(() => {
    if (!holding || !push) return;
    const started = performance.now();
    let done = false;
    const id = window.setInterval(() => {
      if (done) return;
      const elapsed = (performance.now() - started) / 1000;
      setHoldMs(elapsed);
      if (elapsed >= push.hold) {
        done = true;
        setHolding(false);
        setHoldMs(push.hold);
        finishRound();
        speakText("Let go. Soft.", { pitch: 1.08, rate: 0.88 });
        setPush(null);
      }
    }, 80);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holding, push?.id]);

  useEffect(() => {
    if (mode !== "freeze" || !freeze || freezeLeft <= 0) return;
    const id = window.setTimeout(() => setFreezeLeft((n) => n - 1), 1000);
    return () => window.clearTimeout(id);
  }, [mode, freeze, freezeLeft]);

  useEffect(() => {
    if (freeze && freezeLeft === 0 && !canFreeze) {
      setCanFreeze(true);
      speakText("Freeze!", { pitch: 1.05, rate: 0.85 });
    }
  }, [freeze, freezeLeft, canFreeze]);

  const finishRound = () => {
    onAddStar?.();
    recordFocusRoundDone();
    soundEffects.playPop();
  };

  const goSuggested = (next: Mode, spoken: string) => {
    setMode(next);
    setTrack(null);
    setMove(null);
    setPush(null);
    setFreeze(null);
    speakText(spoken, { pitch: 1.12, rate: 0.9 });
    soundEffects.playPop();
  };

  return (
    <div className="relative">
      <div className="hidden sm:block">
        <CharacterAnchor emoji="🧸" title="Teddy" subtitle="Slow, then settle." position="top-right" />
      </div>
      <div className="mb-4">
        <h2 className={`text-xl sm:text-2xl font-black flex items-center gap-2 ${isMeadow ? "text-slate-900" : "text-white"}`}>
          <span>🫀</span> Focus Body
        </h2>
        <p className={`text-sm sm:text-base font-semibold ${isMeadow ? "text-slate-800" : "text-white/90"}`}>
          Check the body. Slow gold paths buzz if you rush. Move, push, freeze, breathe, look, then quiet.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {MODES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setMode(item.id);
              setTrack(null);
              setMove(null);
              setPush(null);
              setFreeze(null);
              setTimerOn(false);
              soundEffects.playPop();
              if (item.id === "slow") speakText("Pick a path. Finger stays in the gold. Red edge buzzes.", { pitch: 1.1, rate: 0.88 });
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

      {mode === "slow" && (
        <div className={`rounded-[2rem] border-4 p-5 ${panel}`}>
          {!track ? (
            <>
              <p className="text-lg font-black mb-3">Pick a slow path. Stay in the gold.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {STEADY_TRACKS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setTrack(item);
                      soundEffects.playPop();
                    }}
                    className={`min-h-28 rounded-[1.75rem] p-4 text-left border-4 ${ghost}`}
                  >
                    <p className="text-4xl">{item.emoji}</p>
                    <p className="text-base font-black mt-1">{item.title}</p>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <ToddlerSteadyLane
                track={track}
                isMeadow={isMeadow}
                onWin={() => {
                  finishRound();
                }}
              />
              <button
                type="button"
                className="mt-4 min-h-12 rounded-full bg-teal-400 px-5 py-2 font-black text-teal-950 border-b-4 border-teal-700"
                onClick={() => setTrack(null)}
              >
                More paths
              </button>
            </>
          )}
        </div>
      )}

      {mode === "move" && (
        <div className={`rounded-[2rem] border-4 p-5 ${panel}`}>
          {!move ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {movePool.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setMove(item);
                    setTaps(0);
                    speakText(item.spoken, { pitch: 1.12, rate: 0.9 });
                    soundEffects.playPop();
                  }}
                  className={`min-h-28 rounded-[1.75rem] p-4 text-left border-4 ${ghost}`}
                >
                  <p className="text-4xl">{item.emoji}</p>
                  <p className="text-base font-black mt-1">{item.title}</p>
                </button>
              ))}
            </div>
          ) : (
            <>
              <p className="text-5xl mb-2">{move.emoji}</p>
              <p className="text-2xl font-black">{move.title}</p>
              <p className="text-lg font-black mb-3">{move.spoken}</p>
              <button
                type="button"
                className="min-h-24 min-w-40 rounded-full bg-teal-400 px-10 py-4 text-3xl font-black text-teal-950 border-b-4 border-teal-700"
                onClick={() => {
                  const next = taps + 1;
                  setTaps(next);
                  speakText(String(next), { pitch: 1.15, rate: 1 });
                  soundEffects.playPop();
                  if (next >= move.taps) {
                    finishRound();
                    speakText("Freeze. Soft knees.", { pitch: 1.08, rate: 0.88 });
                    setMove(null);
                    setTaps(0);
                  }
                }}
              >
                Tap {taps}/{move.taps}
              </button>
              <button type="button" className="block mt-3 font-black underline" onClick={() => setMove(null)}>
                More moves
              </button>
            </>
          )}
        </div>
      )}

      {mode === "push" && (
        <div className={`rounded-[2rem] border-4 p-5 ${panel}`}>
          {!push ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {HEAVY_ROUNDS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setPush(item);
                    setHoldMs(0);
                    speakText(item.spoken, { pitch: 1.1, rate: 0.88 });
                    soundEffects.playPop();
                  }}
                  className={`min-h-28 rounded-[1.75rem] p-4 text-left border-4 ${ghost}`}
                >
                  <p className="text-4xl">{item.emoji}</p>
                  <p className="text-base font-black mt-1">{item.title}</p>
                </button>
              ))}
            </div>
          ) : (
            <>
              <p className="text-5xl mb-2">{push.emoji}</p>
              <p className="text-2xl font-black">{push.title}</p>
              <p className="text-lg font-black mb-3">{push.spoken}</p>
              <button
                type="button"
                className="min-h-28 min-w-48 rounded-full bg-teal-400 px-10 py-4 text-2xl font-black text-teal-950 border-b-4 border-teal-700 select-none touch-none"
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                  setHolding(true);
                  setHoldMs(0);
                }}
                onPointerUp={() => setHolding(false)}
                onPointerCancel={() => setHolding(false)}
              >
                Hold · {Math.min(push.hold, holdMs).toFixed(1)}/{push.hold}s
              </button>
              <div className="h-4 mt-3 rounded-full bg-teal-100 overflow-hidden border border-teal-400">
                <div className="h-full bg-teal-600" style={{ width: `${Math.min(100, (holdMs / push.hold) * 100)}%` }} />
              </div>
              <button type="button" className="block mt-3 font-black underline" onClick={() => setPush(null)}>
                More pushes
              </button>
            </>
          )}
        </div>
      )}

      {mode === "freeze" && (
        <div className={`rounded-[2rem] border-4 p-5 ${panel}`}>
          {!freeze ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {FREEZE_ROUNDS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setFreeze(item);
                    setFreezeLeft(item.wiggle);
                    setCanFreeze(false);
                    speakText(item.spoken, { pitch: 1.12, rate: 0.9 });
                    soundEffects.playPop();
                  }}
                  className={`min-h-28 rounded-[1.75rem] p-4 text-left border-4 ${ghost}`}
                >
                  <p className="text-4xl">{item.emoji}</p>
                  <p className="text-base font-black mt-1">{item.title}</p>
                </button>
              ))}
            </div>
          ) : (
            <>
              <p className="text-5xl mb-2">{freeze.emoji}</p>
              <p className="text-2xl font-black">{freeze.title}</p>
              <p className="text-4xl font-black my-3">{canFreeze ? "FREEZE" : freezeLeft}</p>
              <button
                type="button"
                className="min-h-20 rounded-full bg-teal-400 px-8 py-3 text-2xl font-black text-teal-950 border-b-4 border-teal-700"
                onClick={() => {
                  if (!canFreeze) {
                    soundEffects.playBuzz();
                    speakText("Wait. Not yet.", { pitch: 1.05, rate: 0.9 });
                    return;
                  }
                  finishRound();
                  speakText("Statue. Soft.", { pitch: 1.08, rate: 0.88 });
                  setFreeze(null);
                  setCanFreeze(false);
                }}
              >
                Freeze
              </button>
              <button type="button" className="block mt-3 font-black underline" onClick={() => setFreeze(null)}>
                More freeze
              </button>
            </>
          )}
        </div>
      )}

      {mode === "breathe" && (
        <div className={`rounded-[2rem] border-4 p-5 ${panel}`}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {BREATH_ROUNDS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setBreath(item);
                  setBreathStep(0);
                  speakText(item.spoken, { pitch: 1.08, rate: 0.86 });
                }}
                className={`min-h-16 rounded-2xl px-3 py-2 font-black border-4 ${breath.id === item.id ? "bg-teal-200 border-teal-700" : ghost}`}
              >
                {item.emoji} {item.title}
              </button>
            ))}
          </div>
          <p className="text-5xl mb-2">{breath.emoji}</p>
          <p className="text-lg font-black mb-4">{breath.spoken}</p>
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
                speakText("Nice and slow.", { pitch: 1.08, rate: 0.88 });
              }
            }}
          >
            {breathStep % 2 === 0 ? "Breathe in" : "Breathe out"} · {breathStep}/6
          </button>
        </div>
      )}

      {mode === "look" && (
        <div className={`rounded-[2rem] border-4 p-5 ${panel}`}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {LOOK_ROUNDS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setLook(item);
                  setLookHits([]);
                  speakText(item.spoken, { pitch: 1.12, rate: 0.9 });
                }}
                className={`min-h-16 rounded-2xl px-3 py-2 font-black border-4 ${look.id === item.id ? "bg-teal-200 border-teal-700" : ghost}`}
              >
                {item.emoji} {item.title}
              </button>
            ))}
          </div>
          <p className="text-lg font-black mb-3">{look.spoken}</p>
          <div className="grid grid-cols-3 gap-3 max-w-md">
            {look.field.map((cell, index) => {
              const on = lookHits.includes(index);
              return (
                <button
                  key={`${look.id}-${index}`}
                  type="button"
                  onClick={() => {
                    if (on) return;
                    if (!cell.hit) {
                      soundEffects.playBuzz();
                      speakText("Not that one.", { pitch: 1.05, rate: 0.9 });
                      return;
                    }
                    const next = [...lookHits, index];
                    setLookHits(next);
                    soundEffects.playPop();
                    if (next.length >= look.need) {
                      finishRound();
                      speakText("You found them.", { pitch: 1.12, rate: 0.9 });
                    }
                  }}
                  className={`min-h-20 rounded-2xl text-4xl border-4 ${on ? "bg-teal-200 border-teal-700" : ghost}`}
                >
                  {cell.emoji}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {mode === "quiet" && (
        <div className={`rounded-[2rem] border-4 p-5 ${panel}`}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {QUIET_ROUNDS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setQuiet(item);
                  setTimerOn(false);
                  speakText(item.spoken, { pitch: 1.05, rate: 0.86 });
                }}
                className={`min-h-16 rounded-2xl px-3 py-2 font-black border-4 ${quiet.id === item.id ? "bg-teal-200 border-teal-700" : ghost}`}
              >
                {item.emoji} {item.title}
              </button>
            ))}
          </div>
          <p className="text-5xl mb-2">{quiet.emoji}</p>
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
