import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Star,
  ChevronRight,
  ChevronLeft,
  Volume2,
  Users,
  User,
  RotateCcw,
  BookOpen,
  Award,
  FileCheck,
  ArrowRight,
} from "lucide-react";
import { GuidedAssessment, AssessmentItem, AssessmentScore, AssessmentResult } from "../types";
import { GUIDED_ASSESSMENTS } from "../data/assessmentTemplates";
import { speakText } from "../utils/speechUtils";
import { todayISO } from "../utils/dateUtils";

interface GuidedAssessmentBridgeProps {
  initialAssessmentId?: string;
  onClose?: () => void;
  onAssessmentCompleted?: (result: AssessmentResult) => void;
}

export function GuidedAssessmentBridge({
  initialAssessmentId,
  onClose,
  onAssessmentCompleted,
}: GuidedAssessmentBridgeProps) {
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>(
    initialAssessmentId || GUIDED_ASSESSMENTS[0].id
  );
  const [adminMode, setAdminMode] = useState<"parent_tutor" | "self_paced">("parent_tutor");
  const [studentName, setStudentName] = useState<string>("Student");
  const [currentItemIndex, setCurrentItemIndex] = useState<number>(0);
  const [scores, setScores] = useState<Record<string, AssessmentScore>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [completedResult, setCompletedResult] = useState<AssessmentResult | null>(null);

  const activeAssessment =
    GUIDED_ASSESSMENTS.find((a) => a.id === selectedAssessmentId) || GUIDED_ASSESSMENTS[0];
  const activeItem: AssessmentItem | undefined = activeAssessment.items[currentItemIndex];

  const handleScoreChange = (itemId: string, score: AssessmentScore) => {
    setScores((prev) => ({ ...prev, [itemId]: score }));
  };

  const handleNotesChange = (itemId: string, noteText: string) => {
    setNotes((prev) => ({ ...prev, [itemId]: noteText }));
  };

  const handleNextItem = () => {
    if (currentItemIndex < activeAssessment.items.length - 1) {
      setCurrentItemIndex((prev) => prev + 1);
    } else {
      finalizeAssessment();
    }
  };

  const handlePrevItem = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex((prev) => prev - 1);
    }
  };

  const finalizeAssessment = () => {
    const total = activeAssessment.items.length;
    let mastered = 0;
    let developing = 0;
    let needsPractice = 0;

    activeAssessment.items.forEach((item) => {
      const s = scores[item.id] || "developing";
      if (s === "mastered") mastered += 1;
      else if (s === "developing") developing += 1;
      else if (s === "needs_practice") needsPractice += 1;
    });

    const percent = Math.round((mastered / total) * 100);
    const stars = Math.max(1, Math.min(5, Math.ceil((percent / 100) * 5)));

    let feedbackSummary = "";
    let nextStep = "";

    if (percent >= 80) {
      feedbackSummary = `Outstanding mastery! ${studentName} demonstrates confident grasp of foundational concepts in ${activeAssessment.category.replace("_", " ")}.`;
      nextStep = "Ready to advance to higher complexity word problems, expanded phonics patterns, and independent reading chapters.";
    } else if (percent >= 50) {
      feedbackSummary = `Steady positive growth. ${studentName} shows good foundational understanding with a few areas developing.`;
      nextStep = "Focus on daily 5-minute targeted drills with picture flashcards and interactive read-aloud check-ins.";
    } else {
      feedbackSummary = `Early developmental stage. ${studentName} benefits from one-on-one scaffolded guidance and hands-on demonstrations.`;
      nextStep = "Use multi-sensory materials (physical counters, finger-tracing letter cards, nursery rhymes) before re-assessing in 2 weeks.";
    }

    const result: AssessmentResult = {
      id: `asmt-res-${Date.now()}`,
      assessmentId: activeAssessment.id,
      assessmentTitle: activeAssessment.title,
      targetStage: activeAssessment.targetStage,
      studentName: studentName.trim() || "Student",
      administeredBy: adminMode === "parent_tutor" ? "parent" : "self",
      date: todayISO(),
      timestamp: Date.now(),
      totalItems: total,
      masteredCount: mastered,
      developingCount: developing,
      needsPracticeCount: needsPractice,
      starsAwarded: stars,
      feedbackSummary,
      nextLearningStep: nextStep,
      itemScores: scores,
    };

    setCompletedResult(result);
    setIsCompleted(true);

    try {
      const savedResults = JSON.parse(localStorage.getItem("my_student_portal_assessments_v1") || "[]");
      savedResults.unshift(result);
      localStorage.setItem("my_student_portal_assessments_v1", JSON.stringify(savedResults.slice(0, 50)));
    } catch {
      // ignore
    }

    if (onAssessmentCompleted) {
      onAssessmentCompleted(result);
    }
  };

  const handleReset = () => {
    setScores({});
    setNotes({});
    setCurrentItemIndex(0);
    setIsCompleted(false);
    setCompletedResult(null);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 w-full">
      {/* Assessment Top Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs sm:text-sm font-bold uppercase tracking-wider mb-2 border border-emerald-500/30 shadow-sm">
            <GraduationCap size={15} /> Assessment Bridge for Parents, Tutors & Kids
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            Guided Milestone & Homework Diagnostic
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 font-medium">
            Administer structured developmental evaluations, record observations, and generate instant learning pathways.
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm font-bold border border-slate-700 transition-all cursor-pointer shadow-sm"
          >
            ✕ Close Assessment
          </button>
        )}
      </div>

      {!isCompleted ? (
        <div className="space-y-6 sm:space-y-8">
          {/* Assessment Configuration Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-xl">
            {/* Assessment Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Evaluation Template
              </label>
              <select
                value={selectedAssessmentId}
                onChange={(e) => {
                  setSelectedAssessmentId(e.target.value);
                  handleReset();
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {GUIDED_ASSESSMENTS.map((asmt) => (
                  <option key={asmt.id} value={asmt.id}>
                    {asmt.targetStage === "toddler" ? "🧸 " : "🎒 "} {asmt.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Administered By Toggle */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Assessment Bridge Mode
              </label>
              <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => setAdminMode("parent_tutor")}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    adminMode === "parent_tutor"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Users size={14} />
                  <span>Parent / Tutor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAdminMode("self_paced")}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    adminMode === "self_paced"
                      ? "bg-amber-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <User size={14} />
                  <span>Kid Self-Use</span>
                </button>
              </div>
            </div>

            {/* Student Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Child / Student Name
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Student name..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          {/* Progress Tracker Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400 font-medium">
              <span>
                Question <strong className="text-white">{currentItemIndex + 1}</strong> of{" "}
                <strong className="text-white">{activeAssessment.items.length}</strong>
              </span>
              <span className="text-emerald-400 font-bold">
                {activeAssessment.targetStage === "toddler" ? "Preschool Milestone" : "Primary School Check"}
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                style={{
                  width: `${((currentItemIndex + 1) / activeAssessment.items.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Active Question Surface Card */}
          {activeItem && (
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-2xl space-y-6"
            >
              {/* Category & Voice Prompt */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <span className="px-3.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs sm:text-sm font-bold border border-indigo-500/30">
                  {activeItem.category}
                </span>
                <button
                  type="button"
                  onClick={() => speakText(activeItem.prompt)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm font-bold cursor-pointer transition-all border border-slate-700 shadow-sm"
                >
                  <Volume2 size={15} />
                  <span>Read Aloud</span>
                </button>
              </div>

              {/* Visual Cue (if available) */}
              {activeItem.visualCue && (
                <div className="py-8 px-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-5xl sm:text-6xl shadow-inner">
                  {activeItem.visualCue}
                </div>
              )}

              {/* Item Prompt */}
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-relaxed">
                  {activeItem.prompt}
                </h3>
              </div>

              {/* Parent/Tutor Coaching Instructions (if in adult mode) */}
              {adminMode === "parent_tutor" && (
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs sm:text-sm">
                    <Sparkles size={16} />
                    <span>Parent / Tutor Facilitator Guide:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                    {activeItem.demonstrationGuide}
                  </p>
                </div>
              )}

              {/* Multi-Option Sample Responses / Self-Use Buttons */}
              {activeItem.options && activeItem.options.length > 0 && (
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    {adminMode === "parent_tutor" ? "Select Student's Observed Response:" : "Tap your answer:"}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {activeItem.options.map((opt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (opt.includes("(correct)") || opt.includes("accurately") || opt.includes("Smooth")) {
                            handleScoreChange(activeItem.id, "mastered");
                          } else if (opt.includes("Needs") || opt.includes("skips") || opt.includes("Developing")) {
                            handleScoreChange(activeItem.id, "developing");
                          } else {
                            handleScoreChange(activeItem.id, "needs_practice");
                          }
                        }}
                        className="p-3.5 text-left rounded-2xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-xs sm:text-sm text-slate-200 hover:text-white font-medium transition-all cursor-pointer shadow-inner"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Scoring Buttons (Mastered / Developing / Needs Practice) */}
              <div className="pt-4 border-t border-slate-800">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Evaluation Level:
                </label>
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => handleScoreChange(activeItem.id, "mastered")}
                    className={`py-3.5 px-3 rounded-2xl font-black text-xs sm:text-sm flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                      scores[activeItem.id] === "mastered"
                        ? "bg-emerald-500/30 border-emerald-400 text-emerald-300 ring-2 ring-emerald-400/40 shadow-lg"
                        : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-emerald-500/10 hover:border-emerald-500/30"
                    }`}
                  >
                    <span>🌟 Mastered</span>
                    <span className="text-[10px] sm:text-xs font-normal opacity-80">Confident & Independent</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleScoreChange(activeItem.id, "developing")}
                    className={`py-3.5 px-3 rounded-2xl font-black text-xs sm:text-sm flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                      scores[activeItem.id] === "developing"
                        ? "bg-amber-500/30 border-amber-400 text-amber-300 ring-2 ring-amber-400/40 shadow-lg"
                        : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-amber-500/10 hover:border-amber-500/30"
                    }`}
                  >
                    <span>🌱 Developing</span>
                    <span className="text-[10px] sm:text-xs font-normal opacity-80">Understands with cues</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleScoreChange(activeItem.id, "needs_practice")}
                    className={`py-3.5 px-3 rounded-2xl font-black text-xs sm:text-sm flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                      scores[activeItem.id] === "needs_practice"
                        ? "bg-rose-500/30 border-rose-400 text-rose-300 ring-2 ring-rose-400/40 shadow-lg"
                        : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-rose-500/10 hover:border-rose-500/30"
                    }`}
                  >
                    <span>🎯 Needs Practice</span>
                    <span className="text-[10px] sm:text-xs font-normal opacity-80">Revisit in upcoming lesson</span>
                  </button>
                </div>
              </div>

              {/* Parent / Tutor Observation Notes */}
              {adminMode === "parent_tutor" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Facilitator Observation Notes (Optional):
                  </label>
                  <input
                    type="text"
                    value={notes[activeItem.id] || ""}
                    onChange={(e) => handleNotesChange(activeItem.id, e.target.value)}
                    placeholder="e.g. Student pronounced /b/ promptly and recognized the sound..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              )}
            </motion.div>
          )}

          {/* Bottom Step Navigation */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handlePrevItem}
              disabled={currentItemIndex === 0}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none font-bold text-xs sm:text-sm text-white transition-all cursor-pointer border border-slate-700"
            >
              <ChevronLeft size={16} />
              <span>Previous Item</span>
            </button>

            <button
              type="button"
              onClick={handleNextItem}
              className="flex items-center gap-2 px-6 sm:px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-black text-xs sm:text-sm text-white shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
            >
              <span>
                {currentItemIndex === activeAssessment.items.length - 1
                  ? "Finish & Generate Report ⭐"
                  : "Next Checkpoint"}
              </span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        /* ASSESSMENT COMPLETED REPORT CARD */
        completedResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 sm:p-8 md:p-10 rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl space-y-6"
          >
            {/* Header Celebration */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-4xl shadow-inner animate-bounce">
                🎉
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Assessment Complete for {completedResult.studentName}!
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto font-medium">
                Official diagnostic evaluated on {completedResult.date} via{" "}
                {completedResult.administeredBy === "parent" ? "Parent/Tutor Bridge" : "Student Self-Evaluation"}.
              </p>

              {/* Stars Display */}
              <div className="flex items-center justify-center gap-1.5 py-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={28}
                    className={`${
                      i < completedResult.starsAwarded
                        ? "text-amber-400 fill-amber-400"
                        : "text-slate-700"
                    } transition-all`}
                  />
                ))}
              </div>
            </div>

            {/* Score Breakdown Tally */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                  {completedResult.masteredCount}
                </div>
                <div className="text-xs font-bold text-slate-300 uppercase mt-1">Mastered</div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center">
                <div className="text-2xl sm:text-3xl font-black text-amber-400">
                  {completedResult.developingCount}
                </div>
                <div className="text-xs font-bold text-slate-300 uppercase mt-1">Developing</div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center">
                <div className="text-2xl sm:text-3xl font-black text-rose-400">
                  {completedResult.needsPracticeCount}
                </div>
                <div className="text-xs font-bold text-slate-300 uppercase mt-1">Needs Practice</div>
              </div>
            </div>

            {/* Pedagogical AI Synthesis & Next Steps */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-inner">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">
                  Pedagogical Summary & Feedback:
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  {completedResult.feedbackSummary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5">
                  Recommended Next Learning Step:
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  {completedResult.nextLearningStep}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer border border-slate-700"
              >
                <RotateCcw size={15} />
                <span>Evaluate Another Student or Retest</span>
              </button>

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  <span>Return to Learning Hub</span>
                  <ArrowRight size={15} />
                </button>
              )}
            </div>
          </motion.div>
        )
      )}
    </div>
  );
}
