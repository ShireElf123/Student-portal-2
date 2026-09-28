import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Users,
  BookOpen,
  Bot,
  Star,
  Check,
  Zap,
} from "lucide-react";
import { LearningStage, UserRole } from "../types";
import { soundEffects } from "../utils/soundEffects";
import { speakText } from "../utils/speechUtils";

interface AgeStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStage: LearningStage;
  onSelectStage: (stage: LearningStage) => void;
  userRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

interface StageDetail {
  id: LearningStage;
  title: string;
  ageBracket: string;
  badgeText: string;
  emoji: string;
  gradient: string;
  borderHover: string;
  tagline: string;
  keyFeatures: string[];
  cognitiveFocus: string;
  recommendedRole: UserRole;
}

const STAGES: StageDetail[] = [
  {
    id: "toddler",
    title: "Toddler & Preschool Wonderland",
    ageBracket: "Ages 2–5 (Early Years)",
    badgeText: "TOUCH & PLAY",
    emoji: "🧸",
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    borderHover: "hover:border-amber-400/60",
    tagline: "High-contrast picture books, spoken phonics, counting safari & tactile animal games.",
    keyFeatures: [
      "Interactive illustrated picture books with read-aloud voice",
      "Full ABC Phonics soundboard with spoken pronunciation",
      "Tactile games: Animal sound quiz & Rainbow Bubble Popper",
      "1-2-3 Counting Safari & Star Jar motivational rewards",
      "5-minute parent-led early milestone assessments",
    ],
    cognitiveFocus: "Sensory-motor play, phonemic awareness, vocabulary & object recognition",
    recommendedRole: "student",
  },
  {
    id: "primary",
    title: "Primary School Homework Desk",
    ageBracket: "Ages 6–11 (Grades 1–5)",
    badgeText: "HOMEWORK & ACADEMICS",
    emoji: "🎒",
    gradient: "from-indigo-500/20 via-blue-500/10 to-transparent",
    borderHover: "hover:border-indigo-400/60",
    tagline: "Structured homework manager, Socratic AI homework helper & curriculum flashcards.",
    keyFeatures: [
      "Daily homework task tracker with priority & due dates",
      "Socratic AI Homework Helper (guides step-by-step without giving direct answers)",
      "Instant Homework Question Scanner with conceptual breakdown",
      "Interactive flashcards, practice quizzes & recall games",
      "Student learning notebooks with auto-generated summaries",
    ],
    cognitiveFocus: "Independent task execution, conceptual reasoning, math fluency & reading comprehension",
    recommendedRole: "student",
  },
  {
    id: "educator",
    title: "Home Tutor & Parent Hub",
    ageBracket: "Parents, Homeschool Educators & Tutors",
    badgeText: "DIAGNOSTIC & CURRICULUM",
    emoji: "👩‍🏫",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    borderHover: "hover:border-emerald-400/60",
    tagline: "Diagnostic developmental rubrics, curriculum lesson plans & child progress tracking.",
    keyFeatures: [
      "Guided Assessment Bridge with adult-led scoring criteria",
      "Homeschool lesson planner & curriculum schedule manager",
      "Child notebook inspection & practice quiz assignment",
      "Direct teacher-parent communication channel",
      "Comprehensive diagnostic progress reports with AI insights",
    ],
    cognitiveFocus: "Formative assessment, pacing control, developmental intervention & structured tracking",
    recommendedRole: "parent",
  },
];

export function AgeStageModal({
  isOpen,
  onClose,
  currentStage,
  onSelectStage,
  userRole,
  onSelectRole,
}: AgeStageModalProps) {
  if (!isOpen) return null;

  const handleStagePick = (stage: StageDetail) => {
    if (stage.id === "toddler") {
      soundEffects.playStarSparkle();
      speakText("Welcome to Toddler Wonderland! Let's read and play!", { pitch: 1.25 });
    } else if (stage.id === "primary") {
      soundEffects.playSuccessChime();
    } else {
      soundEffects.playPop();
    }

    onSelectStage(stage.id);

    // Auto align role if switching to educator
    if (stage.id === "educator" && userRole === "student") {
      onSelectRole("parent");
    }

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col items-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl my-auto rounded-3xl bg-[#11121d] border-2 border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 bg-black/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-2xl shadow-md">
                🎯
              </div>
              <div>
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                  <Sparkles size={12} /> Adaptive Learning Pathways
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Select Age Stage & Learning Experience
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer text-sm font-bold"
            >
              ✕ Close
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-8 flex-1 overflow-y-auto space-y-6">
            <p className="text-white/70 text-xs sm:text-sm">
              Our interface dynamically reconfigures tools, cognitive pacing, and UI density to match your child's developmental age bracket. Switch anytime!
            </p>

            {/* 3 Interactive Pathway Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {STAGES.map((stage) => {
                const isSelected = currentStage === stage.id;

                return (
                  <motion.div
                    key={stage.id}
                    whileHover={{ y: -4 }}
                    onClick={() => handleStagePick(stage)}
                    className={`relative p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-white/[0.08] border-amber-400 ring-4 ring-amber-400/30 shadow-xl"
                        : `bg-white/[0.03] border-white/10 ${stage.borderHover} hover:bg-white/[0.06]`
                    }`}
                  >
                    {/* Active Ribbon */}
                    {isSelected && (
                      <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-amber-400 text-black font-black text-[10px] uppercase tracking-wider shadow">
                        Active Mode
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl p-2.5 bg-white/10 rounded-2xl">
                          {stage.emoji}
                        </span>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-white/10 text-white/80">
                          {stage.badgeText}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-white leading-tight mb-0.5">
                        {stage.title}
                      </h3>
                      <div className="text-xs font-bold text-amber-300 mb-2">
                        {stage.ageBracket}
                      </div>
                      <p className="text-xs text-white/60 mb-4 leading-relaxed">
                        {stage.tagline}
                      </p>

                      {/* Feature Bullet Points */}
                      <div className="space-y-1.5 pt-3 border-t border-white/10 mb-4">
                        <div className="text-[10px] uppercase font-bold text-white/40 mb-1">
                          Included Experiences:
                        </div>
                        {stage.keyFeatures.map((feat, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-1.5 text-[11px] text-white/80 leading-snug"
                          >
                            <Check size={12} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button at bottom */}
                    <div className="pt-3 border-t border-white/10">
                      <div className="text-[10px] text-white/40 mb-2">
                        <span className="font-semibold text-white/60">Focus: </span>
                        {stage.cognitiveFocus}
                      </div>

                      <button
                        type="button"
                        className={`w-full py-2.5 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? "bg-amber-500 text-white shadow-md shadow-amber-500/30"
                            : "bg-white/10 hover:bg-white/20 text-white"
                        }`}
                      >
                        <span>{isSelected ? "Currently Active" : `Switch to ${stage.title.split(" ")[0]}`}</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Explanatory FAQ for Home Educators */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Zap size={14} className="text-amber-400" />
                Frequently Asked by Home Tutors & Parents:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-white/60 leading-relaxed">
                <div>
                  <strong className="text-white/80">Can a parent observe toddler milestone data?</strong> Yes, the Guided Assessment Bridge provides observational checklists you can evaluate in 5 minutes with developmental tips.
                </div>
                <div>
                  <strong className="text-white/80">Does switching erase student notebooks?</strong> No! All study notebooks, homework items, and quizzes remain securely saved in your workspace.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
