import React, { useState, useEffect } from "react";
import {
  Bot,
  Target,
  BookOpen,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  Send,
  CalendarCheck,
  Sparkles,
  Brain,
  Zap,
} from "lucide-react";
import { NavigationTab, Notebook, PracticeSession, StudyPlanItem } from "../types";
import { todayISO, formatDateLabel } from "../utils/dateUtils";
import { getNotebookTopicStatus } from "../utils/topicStatus";
import { getLearnerModel, subscribeLearnerModel, LearnerModel } from "../utils/pedagogicalEngine";

interface HomeDashboardProps {
  notebooks: Notebook[];
  studyPlan: StudyPlanItem[];
  practiceSessions: PracticeSession[];
  onNavigate: (tab: NavigationTab) => void;
  onSelectNotebook: (id: string) => void;
  onAskTutor: (query: string) => void;
  onToggleTask: (taskId: string) => void;
}

export function HomeDashboard({
  notebooks,
  studyPlan,
  practiceSessions,
  onNavigate,
  onSelectNotebook,
  onAskTutor,
  onToggleTask,
}: HomeDashboardProps) {
  const [quickQuery, setQuickQuery] = useState("");
  const [learnerModel, setLearnerModel] = useState<LearnerModel>(getLearnerModel);

  useEffect(() => {
    return subscribeLearnerModel((model) => setLearnerModel(model));
  }, []);

  const topRec = learnerModel.recommendedNext[0];

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    onAskTutor(quickQuery.trim());
    setQuickQuery("");
  };

  const todayStr = todayISO();
  const todayTasks = studyPlan.filter((task) => task.date === todayStr);
  const completedTodayCount = todayTasks.filter((t) => t.completed).length;
  const nextPendingTask = todayTasks.find((t) => !t.completed);

  const recentNotebooks = [...notebooks].sort((a, b) => {
    const aTime = a.messages[a.messages.length - 1]?.timestamp || a.createdAt;
    const bTime = b.messages[b.messages.length - 1]?.timestamp || b.createdAt;
    return bTime - aTime;
  });

  let onTrackCount = 0;
  let needsRevisitingCount = 0;
  notebooks.forEach((nb) => {
    const status = getNotebookTopicStatus(nb, practiceSessions);
    if (status === "on_track") onTrackCount++;
    else if (status === "needs_revisiting") needsRevisitingCount++;
  });

  const completionPercent = todayTasks.length > 0 
    ? Math.round((completedTodayCount / todayTasks.length) * 100) 
    : 0;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full text-slate-100">
      {/* Top Greeting & Desk Baseline */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {greeting}, Scholar
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Academic Study Desk <span className="text-slate-600">·</span> {formatDateLabel(todayStr)}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Socratic AI Coach Online</span>
        </div>
      </div>

      {/* SINGLE VISUAL BOLDNESS HERO: Today's Desk Progress Bar */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-blue-400">
              Today's Focus
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
              {nextPendingTask
                ? nextPendingTask.title
                : todayTasks.length > 0
                ? "All assignments completed for today!"
                : "Your daily study queue is ready"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {nextPendingTask
                ? `${nextPendingTask.subject} · Estimated ${nextPendingTask.durationMinutes} minutes`
                : "Check your homework desk or start a practice session to reinforce concepts."}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {nextPendingTask ? (
              <button
                type="button"
                onClick={() => onToggleTask(nextPendingTask.id)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none cursor-pointer"
              >
                <CheckCircle2 size={15} />
                <span>Mark Completed</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate("homework")}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none cursor-pointer"
              >
                <span>View Homework Desk</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar with Singular Amber/Blue Energy */}
        {todayTasks.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{completedTodayCount} of {todayTasks.length} tasks finished</span>
              <span className="font-semibold text-amber-400">{completionPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* UNIFIED LEARNING BRAIN: Adaptive Pedagogical Recommendation */}
      {topRec && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/40 border border-indigo-800/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
              <Brain size={20} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {topRec.badge}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  Unified Learning Brain · Recommended Step
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mt-1 leading-snug">
                {topRec.title}
              </h3>
              <p className="text-xs text-slate-300/80 mt-0.5 leading-relaxed">
                {topRec.reason}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={() => onNavigate(topRec.targetTab)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
            >
              <span>Start Quest</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Quick Socratic Ask Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
        <label htmlFor="home-quick-ask" className="block text-xs font-semibold text-slate-300">
          Ask Socratic Tutor for a Hint or Explanation
        </label>
        <form onSubmit={handleQuickSubmit} className="relative flex items-center">
          <input
            id="home-quick-ask"
            type="text"
            value={quickQuery}
            onChange={(e) => setQuickQuery(e.target.value)}
            placeholder="e.g. How do I solve two-step word problems or find the main idea?"
            className="w-full pl-4 pr-12 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          <button
            type="submit"
            disabled={!quickQuery.trim()}
            className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white rounded-lg transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
            title="Ask Tutor"
            aria-label="Send question to AI tutor"
          >
            <Send size={15} />
          </button>
        </form>
      </div>

      {/* Main Grid: Homework & Notebooks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Subject Notebooks */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight">Active Subject Notebooks</h3>
            <button
              type="button"
              onClick={() => onNavigate("notebooks")}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded cursor-pointer"
            >
              <span>View all ({notebooks.length})</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentNotebooks.slice(0, 3).map((nb) => {
              const lastMsg = nb.messages[nb.messages.length - 1];
              return (
                <div
                  key={nb.id}
                  onClick={() => {
                    onSelectNotebook(nb.id);
                    onNavigate("tutor");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectNotebook(nb.id);
                      onNavigate("tutor");
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                      <span>{nb.subject}</span>
                      <span className="text-slate-600">·</span>
                      <span>{nb.messages.length} notes</span>
                    </div>
                    <h4 className="text-sm font-bold text-white tracking-tight mt-0.5 truncate">
                      {nb.name}
                    </h4>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {lastMsg?.content
                        ? lastMsg.content.replace(/[*_#`]/g, "").slice(0, 110)
                        : "Ready for your notes and tutor queries."}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-blue-400 font-semibold group-hover:underline flex items-center gap-1">
                      <span>Open Notes</span>
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Quick Links & Summary */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight">Today's Study Plan</h3>
            <button
              type="button"
              onClick={() => onNavigate("study-plan")}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded cursor-pointer"
            >
              Full Schedule
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            {todayTasks.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 space-y-2">
                <p>No study tasks scheduled for today.</p>
                <button
                  type="button"
                  onClick={() => onNavigate("study-plan")}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                >
                  Generate Study Schedule
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {todayTasks.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onToggleTask(task.id)}
                    className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <button
                      type="button"
                      className="mt-0.5 text-slate-400 hover:text-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded"
                      aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                    >
                      {task.completed ? (
                        <CheckCircle2 size={16} className="text-emerald-400" />
                      ) : (
                        <Circle size={16} />
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-xs font-medium leading-snug ${
                          task.completed ? "line-through text-slate-500" : "text-slate-200"
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                        <span>{task.subject}</span>
                        <span className="text-slate-600">·</span>
                        <span className="flex items-center gap-0.5">
                          <Clock size={11} />
                          {task.durationMinutes}m
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
