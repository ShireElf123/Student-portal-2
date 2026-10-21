import React from "react";
import { ArrowRight, CircleDot } from "lucide-react";
import type { LearnerModel } from "../utils/learnerBrain";
import {
  buildParentEvidenceBoard,
  type EvidenceLaunch,
  type SkillEvidenceRow,
} from "../utils/parentEvidenceBoard";

interface ParentEvidenceBoardProps {
  model: LearnerModel;
  learnerName: string;
  onLaunch?: (launch: EvidenceLaunch) => void;
}

function formatWhen(timestamp: number): string {
  if (!timestamp) return "No time recorded";
  const delta = Date.now() - timestamp;
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (delta < hour) return `${Math.max(1, Math.round(delta / minute))} min ago`;
  if (delta < day) return `${Math.round(delta / hour)} hr ago`;
  if (delta < 7 * day) return `${Math.round(delta / day)} day${delta >= 2 * day ? "s" : ""} ago`;
  return new Date(timestamp).toLocaleDateString();
}

function outcomeLabel(row: SkillEvidenceRow): string {
  if (row.lastEvent?.outcome === "correct") return "Got it";
  if (row.lastEvent?.outcome === "incorrect") return "Needs another try";
  if (row.lastEvent?.outcome === "partial") return "Partly there";
  return "Practiced";
}

export function ParentEvidenceBoard({ model, learnerName, onLaunch }: ParentEvidenceBoardProps) {
  const board = buildParentEvidenceBoard(model);

  return (
    <section className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-wider text-emerald-400">K–1 evidence</p>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            What {learnerName} has actually done
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium max-w-2xl">
            Only skills with a scored response appear here. Unplayed skills are not mastered and not failed — there is simply no evidence yet.
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl font-black text-white">
            {board.rows.length}
            <span className="text-slate-500 text-base font-bold"> / {board.skillsInBand}</span>
          </p>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">skills with evidence</p>
        </div>
      </div>

      {board.unpracticedCount > 0 && (
        <p className="text-xs text-slate-400 bg-slate-950/70 border border-slate-800 rounded-2xl px-4 py-3">
          {board.unpracticedCount} K–1 skill{board.unpracticedCount === 1 ? "" : "s"} not practiced yet.
          They stay off this list on purpose.
        </p>
      )}

      {board.rows.length === 0 ? (
        <p className="text-sm text-slate-300 py-6 text-center">
          No scored K–1 evidence yet. When {learnerName} answers in a counting, phonics, or habitat activity, it will show up here.
        </p>
      ) : (
        <ul className="space-y-3">
          {board.rows.map((row) => (
            <li
              key={row.skillId}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <CircleDot size={14} className="text-emerald-400 shrink-0" />
                  <h3 className="text-sm font-black text-white">{row.skillTitle}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{row.standardCode}</span>
                </div>
                <p className="text-xs text-slate-300">
                  Last: {row.lastEvent ? row.lastEvent.activityTitle : "Recorded attempt"} · {outcomeLabel(row)} · {formatWhen(row.lastPracticedTimestamp)}
                </p>
                <p className="text-[11px] text-slate-500">
                  {row.successfulAttempts}/{row.totalAttempts} scored responses correct
                  {row.confidence > 0 ? ` · confidence ${row.confidence}%` : ""}
                </p>
              </div>
              {row.next && onLaunch && (
                <button
                  type="button"
                  onClick={() => onLaunch(row.next!)}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-200 text-xs font-bold cursor-pointer"
                >
                  Next: {row.next.activityTitle}
                  <ArrowRight size={14} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
