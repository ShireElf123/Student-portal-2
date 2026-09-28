import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Check,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Users,
  Compass,
} from "lucide-react";
import { LearningStage } from "../types";
import { soundEffects } from "../utils/soundEffects";

interface StartupGatewayProps {
  isOpen: boolean;
  onSelectStage: (stage: LearningStage) => void;
  currentStage?: LearningStage;
  onClose?: () => void;
  isDismissible?: boolean;
}

interface WorkspaceOption {
  id: LearningStage;
  title: string;
  subtitle: string;
  ageScope: string;
  isDefault?: boolean;
  description: string;
  coreHighlights: string[];
  ctaText: string;
}

const WORKSPACES: WorkspaceOption[] = [
  {
    id: "primary",
    title: "Primary Homework Desk",
    subtitle: "Default Student Workspace",
    ageScope: "Ages 6–11 · Grades 1–5",
    isDefault: true,
    description: "Structured daily assignments, Socratic AI homework guidance, practice flashcard drills, and active curriculum quests.",
    coreHighlights: [
      "Daily task checklist with due dates & priority sorting",
      "Socratic AI Tutor guides step-by-step without giving direct answers",
      "Instant problem breakdown and curriculum flashcards",
      "Calm, high-contrast study desk designed for focused homework",
    ],
    ctaText: "Open Homework Desk",
  },
  {
    id: "toddler",
    title: "Toddler Sensory World",
    subtitle: "Early Foundations Mode",
    ageScope: "Ages 2–5 · Early Years",
    description: "A gentle sensory space featuring narrated read-aloud picture books, spoken phonics, tactile 1-2-3 counting, and animal discovery.",
    coreHighlights: [
      "Illustrated picture books with human natural narration",
      "Spoken ABC phonics soundboard with acoustic animal sounds",
      "1-2-3 Counting Safari with tactile star rewards",
      "Distraction-free, oversized tap targets for little hands",
    ],
    ctaText: "Enter Toddler World",
  },
  {
    id: "educator",
    title: "Parent & Tutor Hub",
    subtitle: "Oversight & Diagnostics",
    ageScope: "Adults, Parents & Home Educators",
    description: "Diagnostic assessment bridge, homeschool lesson planner, student notebook reviews, multi-student progress tracking, and teacher notes.",
    coreHighlights: [
      "Guided phonics & numeracy milestone diagnostic checks",
      "Homeschool lesson planning and subject curriculum roadmaps",
      "Assignment review, student feedback, and time tracking",
      "Multi-learner management for family or homeschool cohorts",
    ],
    ctaText: "Open Parent & Tutor Hub",
  },
];

export function StartupGateway({
  isOpen,
  onSelectStage,
  currentStage = "primary",
  onClose,
  isDismissible = true,
}: StartupGatewayProps) {
  const [selectedStage, setSelectedStage] = useState<LearningStage>(currentStage);
  const [savePreference, setSavePreference] = useState(true);

  if (!isOpen) return null;

  const handleConfirm = (stage: LearningStage) => {
    if (savePreference) {
      try {
        localStorage.setItem("my_student_portal_gateway_completed", "true");
        localStorage.setItem("my_student_portal_learning_stage", stage);
      } catch {
        // ignore
      }
    }
    if (stage === "toddler") {
      soundEffects.playStarSparkle();
    } else if (stage === "primary") {
      soundEffects.playSuccessChime();
    } else {
      soundEffects.playPop();
    }
    onSelectStage(stage);
    if (onClose) onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 md:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="workspace-switcher-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 8 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900/60">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
                <Compass size={14} />
                <span>Workspace Switcher</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400">Primary Desk is your home default</span>
              </div>
              <h2 id="workspace-switcher-title" className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Choose Your Active Workspace
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Select the experience tailored to who is using the portal right now. You can return to your Primary Homework Desk anytime from the sidebar.
              </p>
            </div>

            {isDismissible && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none cursor-pointer"
                aria-label="Close workspace switcher"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* 3 Workspaces Grid */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/40">
            {WORKSPACES.map((workspace) => {
              const isSelected = selectedStage === workspace.id;
              const isCurrentActive = currentStage === workspace.id;

              return (
                <div
                  key={workspace.id}
                  onClick={() => setSelectedStage(workspace.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedStage(workspace.id);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isSelected}
                  className={`flex flex-col justify-between p-5 rounded-xl border text-left transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
                    isSelected
                      ? "bg-slate-900 border-blue-500 shadow-sm ring-1 ring-blue-500/50"
                      : "bg-slate-900/60 border-slate-800/90 hover:bg-slate-900/90 hover:border-slate-700"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-slate-400">
                        {workspace.ageScope}
                      </span>
                      {workspace.isDefault && (
                        <span className="text-[10px] font-semibold text-blue-300 bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight flex items-center justify-between">
                        <span>{workspace.title}</span>
                        {isCurrentActive && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400" title="Currently Active" />
                        )}
                      </h3>
                      <p className="text-xs text-blue-400 font-medium mt-0.5">
                        {workspace.subtitle}
                      </p>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {workspace.description}
                    </p>

                    <div className="pt-2 border-t border-slate-800/60 space-y-1.5">
                      {workspace.coreHighlights.map((hl, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300 leading-snug">
                          <Check size={12} className="text-blue-400 flex-shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-800/60">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfirm(workspace.id);
                      }}
                      className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
                        isSelected
                          ? "bg-blue-600 hover:bg-blue-500 text-white shadow-sm"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                      }`}
                    >
                      <span>{workspace.ctaText}</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer with Persistent Preference & Direct Launch */}
          <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={savePreference}
                onChange={(e) => setSavePreference(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span>Remember my active workspace for next session</span>
            </label>

            <div className="flex items-center gap-2">
              {isDismissible && onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors font-medium cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={() => handleConfirm(selectedStage)}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
              >
                <span>Launch Workspace</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
