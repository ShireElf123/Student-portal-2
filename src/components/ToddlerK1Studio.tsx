import React, { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { speakText, stopSpeaking } from "../utils/speechUtils";
import { soundEffects } from "../utils/soundEffects";
import { recordLearningEvent, getActiveLearnerId } from "../utils/learnerBrain";
import { getK1StudioGame, type K1StudioGameId, type K1StudioChoice } from "../data/toddler/k1StudioGames";

interface ToddlerK1StudioProps {
  gameId: K1StudioGameId;
  onAddStar?: (amount?: number) => void;
  /** Worlds trail: fire once when every round is done — not on the first tap. */
  onComplete?: () => void;
}

export function ToddlerK1Studio({ gameId, onAddStar, onComplete }: ToddlerK1StudioProps) {
  const game = getK1StudioGame(gameId);
  const [roundIndex, setRoundIndex] = useState(0);
  const [locked, setLocked] = useState(false);
  const [shakeId, setShakeId] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    setRoundIndex(0);
    setLocked(false);
    setShakeId(null);
    setDone(false);
    setCorrectCount(0);
  }, [gameId]);

  const round = game?.rounds[roundIndex];

  useEffect(() => {
    if (!game || !round || done) return;
    const timer = window.setTimeout(() => {
      speakText(roundIndex === 0 ? `Welcome to ${game.title}. ${round.spoken}` : round.spoken, {
        pitch: 1.18,
        rate: 0.94,
      });
    }, 220);
    return () => {
      window.clearTimeout(timer);
      stopSpeaking();
    };
  }, [gameId, roundIndex, done, game, round]);

  if (!game) {
    return (
      <section className="rounded-[2rem] border-4 border-amber-400/40 bg-slate-950/70 p-6 text-center">
        <p className="text-xl font-black text-white">This studio game is packing up.</p>
        <p className="mt-2 text-sm font-semibold text-white/80">Pick another Play tile on the trail.</p>
      </section>
    );
  }
  if (!round) return null;

  const handleChoice = (choice: K1StudioChoice) => {
    if (locked || done) return;

    try {
      recordLearningEvent({
        learnerId: getActiveLearnerId(),
        activityId: game.activityId,
        experienceId: game.experienceId,
        contentId: `${round.id}:${choice.id}`,
        eventType: "question_answered",
        activityType: "toddler-quiz",
        activityTitle: `${game.title}: ${round.prompt.slice(0, 48)}`,
        skillId: game.skillId,
        domain: game.domain,
        gradeBand: "toddler",
        result: choice.correct ? "success" : "struggle",
        score: choice.correct ? 100 : 0,
        difficulty: "easy",
        attempts: 1,
        hintsUsed: 0,
      });
    } catch (error) {
      console.error("Failed to record skill-studio response:", error);
    }

    if (!choice.correct) {
      soundEffects.playPop();
      setShakeId(choice.id);
      speakText("Try another one.", { pitch: 1.1 });
      window.setTimeout(() => setShakeId(null), 450);
      return;
    }

    setLocked(true);
    soundEffects.playSuccessChime();
    const nextCorrect = correctCount + 1;
    setCorrectCount(nextCorrect);
    speakText("Yes!", { pitch: 1.28 });

    window.setTimeout(() => {
      const nextIndex = roundIndex + 1;
      if (nextIndex >= game.rounds.length) {
        setDone(true);
        soundEffects.playFanfare();
        speakText(`You finished ${game.title}.`, { pitch: 1.2 });
        onAddStar?.(1);
        onComplete?.();
        return;
      }
      setRoundIndex(nextIndex);
      setLocked(false);
    }, 700);
  };

  const restart = () => {
    setRoundIndex(0);
    setLocked(false);
    setShakeId(null);
    setDone(false);
    setCorrectCount(0);
  };

  return (
    <section className="rounded-[2rem] border-4 border-white/15 bg-slate-950/70 p-5 sm:p-7 shadow-2xl">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-white/80">Skill studio</p>
          <h3 className="mt-1 text-2xl font-black text-white sm:text-3xl">
            <span className="mr-2">{game.emoji}</span>
            {game.title}
          </h3>
          <p className="mt-1 max-w-2xl text-sm sm:text-base font-semibold text-white/90">{game.tagline}</p>
        </div>
        <p className="rounded-2xl bg-white/10 px-3 py-1.5 text-xs font-black text-white">
          {done ? `${correctCount}/${game.rounds.length}` : `${roundIndex + 1}/${game.rounds.length}`}
        </p>
      </header>

      {done ? (
        <div className="rounded-3xl bg-emerald-500/15 border border-emerald-400/30 p-8 text-center">
          <p className="text-2xl font-black text-white">You did it!</p>
          <p className="mt-2 text-sm text-emerald-100">
            {correctCount} of {game.rounds.length} in {game.title}.
          </p>
          <button
            type="button"
            onClick={restart}
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-900"
          >
            <RotateCcw size={16} />
            Play {game.title} again
          </button>
        </div>
      ) : (
        <>
          <div className={`mb-5 rounded-3xl bg-gradient-to-br ${game.accent} p-5 text-slate-950 shadow-inner`}>
            <p className="font-mono text-sm sm:text-base font-black tracking-wide opacity-90">{round.scene}</p>
            <p className="mt-3 text-xl font-black leading-snug sm:text-2xl">{round.prompt}</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {round.choices.map((choice) => (
              <button
                key={choice.id}
                type="button"
                disabled={locked}
                onClick={() => handleChoice(choice)}
                className={`rounded-3xl border-b-4 bg-white px-4 py-5 text-center font-black text-slate-900 shadow-md transition active:translate-y-1 disabled:opacity-60 ${
                  shakeId === choice.id ? "animate-pulse border-rose-600" : "border-slate-300 hover:border-slate-500"
                }`}
              >
                <span className="block text-4xl sm:text-5xl">{choice.emoji}</span>
                <span className="mt-2 block text-base sm:text-lg">{choice.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
