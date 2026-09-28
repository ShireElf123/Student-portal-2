import React, { useState } from "react";
import {
  BookOpen,
  Users,
  CalendarCheck,
  Target,
  Sparkles,
  Plus,
  CheckCircle2,
  Clock,
  ArrowRight,
  Brain,
  GraduationCap,
} from "lucide-react";
import {
  Notebook,
  StudyPlanItem,
  PracticeSession,
  NavigationTab,
} from "../types";
import { todayISO, formatDateLabel } from "../utils/dateUtils";

interface TutorHubViewProps {
  notebooks: Notebook[];
  studyPlan: StudyPlanItem[];
  practiceSessions: PracticeSession[];
  onNavigate: (tab: NavigationTab) => void;
  onAddTask: (item: StudyPlanItem) => void;
  onOpenSubscriptionModal: () => void;
}

export function TutorHubView({
  notebooks,
  studyPlan,
  practiceSessions,
  onNavigate,
  onAddTask,
  onOpenSubscriptionModal,
}: TutorHubViewProps) {
  const [newSubject, setNewSubject] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDuration, setNewDuration] = useState(30);
  const [newPriority, setNewPriority] = useState<"high" | "medium" | "low">("high");
  const [createdSuccess, setCreatedSuccess] = useState(false);

  const handleCreateModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSubject.trim()) return;

    const task: StudyPlanItem = {
      id: `tutor-task-${Date.now()}`,
      title: newTitle.trim(),
      subject: newSubject.trim(),
      durationMinutes: newDuration,
      priority: newPriority,
      completed: false,
      type: "student_task",
      date: todayISO(),
      reason: "Custom homeschool lesson module assigned by mentor",
    };

    onAddTask(task);
    setNewTitle("");
    setNewSubject("");
    setCreatedSuccess(true);
    setTimeout(() => setCreatedSuccess(false), 3000);
  };

  return (
    <div
      id="tutor-hub-container"
      className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-6xl mx-auto w-full"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm">
              <Brain size={15} />
              Homeschool & Private Tutor Hub
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-slate-400 text-xs sm:text-sm font-medium">{formatDateLabel(todayISO())}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            Curriculum & Lesson Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
            Design personalized study agendas, guide active recall practice, and supervise homeschool mastery.
          </p>
        </div>

        <button
          onClick={onOpenSubscriptionModal}
          className="px-4 py-2.5 text-xs sm:text-sm font-bold text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Sparkles size={16} className="text-indigo-400" />
          <span>Curriculum AI Settings</span>
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-md">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Active Study Topics</span>
          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl sm:text-3xl font-black text-white">{notebooks.length}</span>
            <span className="text-xs sm:text-sm text-indigo-400 font-bold">Notebooks tracked</span>
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-md">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Assigned Study Tasks</span>
          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl sm:text-3xl font-black text-white">{studyPlan.length}</span>
            <span className="text-xs sm:text-sm text-emerald-400 font-bold">
              {studyPlan.filter((s) => s.completed).length} completed
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-md">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Practice Recall Drills</span>
          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl sm:text-3xl font-black text-white">{practiceSessions.length}</span>
            <span className="text-xs sm:text-sm text-purple-400 font-bold">Evaluated quizzes</span>
          </div>
        </div>
      </div>

      {/* Create Custom Lesson Module Form */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Plus size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white">Assign Custom Study Module</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Schedule targeted study items directly into the student's daily dashboard.
            </p>
          </div>
        </div>

        <form onSubmit={handleCreateModule} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Subject
            </label>
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="e.g. Calculus, Physics"
              className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/20 focus:border-indigo-400 shadow-inner"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Module Objective / Topic
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Master Integration by Parts"
              className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/20 focus:border-indigo-400 shadow-inner"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Duration
            </label>
            <select
              value={newDuration}
              onChange={(e) => setNewDuration(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/20 focus:border-indigo-400"
            >
              <option value={15}>15 Minutes</option>
              <option value={30}>30 Minutes</option>
              <option value={45}>45 Minutes</option>
              <option value={60}>60 Minutes</option>
            </select>
          </div>

          <div className="flex items-end gap-2.5">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/20 focus:border-indigo-400"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-5 py-3 text-xs sm:text-sm font-black text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/30 cursor-pointer active:scale-95 whitespace-nowrap"
            >
              Assign
            </button>
          </div>
        </form>

        {createdSuccess && (
          <p className="text-xs sm:text-sm text-emerald-400 flex items-center gap-1.5 font-bold">
            <CheckCircle2 size={16} /> Study module assigned to the student's daily agenda!
          </p>
        )}
      </div>

      {/* Quick Actions & Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div
          onClick={() => onNavigate("practice")}
          className="p-6 rounded-3xl bg-slate-900/90 border border-slate-700/80 hover:border-indigo-500/80 transition-all cursor-pointer group shadow-md"
        >
          <div className="flex items-center justify-between mb-3.5">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <Target size={22} />
            </div>
            <ArrowRight size={18} className="text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
          <h4 className="text-base sm:text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">
            Generate Practice Drill
          </h4>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
            Launch an active recall quiz session for your homeschool scholar with auto-grading.
          </p>
        </div>

        <div
          onClick={() => onNavigate("study-plan")}
          className="p-6 rounded-3xl bg-slate-900/90 border border-slate-700/80 hover:border-emerald-500/80 transition-all cursor-pointer group shadow-md"
        >
          <div className="flex items-center justify-between mb-3.5">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CalendarCheck size={22} />
            </div>
            <ArrowRight size={18} className="text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
          <h4 className="text-base sm:text-lg font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
            Open Full Study Planner
          </h4>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
            Review the master calendar, reorder priority milestones, and evaluate weekly pace.
          </p>
        </div>
      </div>
    </div>
  );
}
