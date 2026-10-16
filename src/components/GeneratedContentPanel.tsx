import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { getActiveLearnerId, getLearnerModel } from "../utils/learnerBrain";
import { canConsumeAI, recordAIConsumption } from "../services/aiUsageService";
import { buildContentGenerationRequest } from "../contentEngine/learnerContext";
import { getDefaultContentPoolManager } from "../contentEngine/contentPoolManager";
import { getOrGenerateGameBlueprint } from "../services/gameContentService";
import type { ContentTheme, GameBlueprint, SupportedGameType } from "../contentEngine/types";

interface GeneratedContentPanelProps {
  gameType: SupportedGameType;
  skillId: string;
  onBlueprint: (blueprint: GameBlueprint, learnerId: string) => void;
  disabled?: boolean;
}

const THEME_LABELS: Record<ContentTheme, string> = {
  space: "Space explorers",
  garden: "Garden discovery",
  ocean: "Ocean discovery",
  animals: "Friendly animals",
  everyday: "Everyday objects",
};

export function GeneratedContentPanel({ gameType, skillId, onBlueprint, disabled = false }: GeneratedContentPanelProps) {
  const [theme, setTheme] = useState<ContentTheme>(gameType === "bubble-pop-phonics" ? "garden" : "space");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [poolSummary, setPoolSummary] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const prepareContent = async () => {
    if (isLoading || disabled) return;
    setIsLoading(true);
    setStatus("");
    setErrorMessage("");
    const learnerId = getActiveLearnerId();
    try {
      const learner = getLearnerModel(learnerId);
      const request = buildContentGenerationRequest(learner, gameType, skillId, theme);
      const pool = await getDefaultContentPoolManager();
      const poolBefore = await pool.getPoolHealth(request, learnerId);
      setPoolSummary(`${poolBefore.availableCount} saved set${poolBefore.availableCount === 1 ? "" : "s"} available; target pool ${poolBefore.targetPoolSize}.`);
      const result = await getOrGenerateGameBlueprint(request, learnerId, {
        beforeRequest: () => {
          const quota = canConsumeAI("content");
          if (!quota.allowed) throw new Error(quota.reason || "The daily AI generation limit has been reached.");
        },
        onGenerationAdmitted: () => { recordAIConsumption("content"); },
      });
      if (getActiveLearnerId() !== learnerId) {
        throw new Error("The selected learner changed while content was preparing. Please request content again.");
      }
      onBlueprint(result.blueprint, learnerId);
      const poolAfter = await pool.getPoolHealth(request, learnerId);
      setPoolSummary(`${poolAfter.availableCount} saved set${poolAfter.availableCount === 1 ? "" : "s"} available; target pool ${poolAfter.targetPoolSize}.`);
      setStatus(result.source === "cache"
        ? "Loaded a saved, validated activity. No AI request was used."
        : "New activity generated, validated, and saved for reuse.");
    } catch (error) {
      setErrorMessage(error instanceof Error
        ? error.message
        : "Could not prepare generated content. The curated activity is still available.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mb-4 rounded-3xl border-2 border-indigo-200 bg-white/95 p-4 shadow-lg" aria-label="Generated learning content">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="rounded-xl bg-indigo-100 p-2 text-indigo-700"><Sparkles size={18} /></span>
          <div>
            <h2 className="text-sm font-black text-slate-900">AI-created practice content</h2>
            <p className="mt-0.5 max-w-2xl text-xs font-medium text-slate-600">
              Structured questions are checked against the selected curriculum skill before this game renders them. Curated content remains available if generation is offline.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor={`content-theme-${gameType}`}>Activity theme</label>
          <select
            id={`content-theme-${gameType}`}
            value={theme}
            onChange={(event) => setTheme(event.target.value as ContentTheme)}
            className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700"
            disabled={isLoading || disabled}
          >
            {Object.entries(THEME_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={prepareContent}
            disabled={isLoading || disabled}
            className="rounded-xl border-b-4 border-indigo-800 bg-indigo-600 px-4 py-2.5 text-xs font-black text-white shadow-md transition hover:bg-indigo-500 active:translate-y-0.5 disabled:cursor-wait disabled:opacity-60"
          >
            {isLoading ? "Checking / preparing…" : disabled ? "Finish current game to change content" : "Load saved or create activity"}
          </button>
        </div>
      </div>
      {poolSummary && (
        <p className="mt-2 text-[11px] font-semibold text-slate-500" role="status">{poolSummary} Content is refilled only after an explicit learner request.</p>
      )}
      {(status || errorMessage) && (
        <p role={errorMessage ? "alert" : "status"}
          className={`mt-3 rounded-xl px-3 py-2 text-xs font-semibold ${errorMessage ? "bg-amber-50 text-amber-900" : "bg-emerald-50 text-emerald-900"}`}>
          {errorMessage || status}
        </p>
      )}
    </section>
  );
}
