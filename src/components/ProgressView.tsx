import React from "react";
import {
  BarChart3,
  Target,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { NavigationTab, Notebook, PracticeSession, StudyPlanItem } from "../types";
import { getNotebookTopicStatus, getTopicStatusBadge } from "../utils/topicStatus";
import { todayISO } from "../utils/dateUtils";

interface ProgressViewProps {
  notebooks: Notebook[];
  practiceSessions: PracticeSession[];
  studyPlan: StudyPlanItem[];
  onNavigate: (tab: NavigationTab) => void;
  onSelectNotebook: (id: string) => void;
  onStartPractice: (subject: string, topic: string) => void;
}

export function ProgressView({
  notebooks,
  practiceSessions,
  studyPlan,
  onNavigate,
  onSelectNotebook,
  onStartPractice,
}: ProgressViewProps) {
  const todayStr = todayISO();
  const todayTasks = studyPlan.filter((t) => t.date === todayStr);
  const completedToday = todayTasks.filter((t) => t.completed).length;
  const totalTasksCompleted = studyPlan.filter((t) => t.completed).length;

  // Real topic status calculation
  let onTrack = 0;
  let needsRevisiting = 0;
  let notStarted = 0;

  notebooks.forEach((nb) => {
    const s = getNotebookTopicStatus(nb, practiceSessions);
    if (s === "on_track") onTrack++;
    else if (s === "needs_revisiting") needsRevisiting++;
    else notStarted++;
  });

  // Real practice stats
  const totalPracticeQuestions = practiceSessions.reduce((acc, s) => acc + s.totalQuestions, 0);
  const totalPracticeCorrect = practiceSessions.reduce((acc, s) => acc + s.correctAnswers, 0);
  const overallAccuracy =
    totalPracticeQuestions > 0 ? Math.round((totalPracticeCorrect / totalPracticeQuestions) * 100) : 0;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="pb-3 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
          <BarChart3 className="text-indigo-400" size={32} />
          Academic Progress & Mastery
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
          Objective evaluation computed purely from your active notes, study tasks, and practice quizzes
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-700/80 space-y-1.5 shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-black uppercase tracking-wider">Active Notebooks</span>
            <BookOpen size={18} />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">{notebooks.length}</p>
          <p className="text-xs text-slate-400 font-medium">Registered courses</p>
        </div>

        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-700/80 space-y-1.5 shadow-md">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-black uppercase tracking-wider">Topics On Track</span>
            <CheckCircle2 size={18} />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400">{onTrack}</p>
          <p className="text-xs text-slate-400 font-medium">Passing accuracy / active</p>
        </div>

        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-700/80 space-y-1.5 shadow-md">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-black uppercase tracking-wider">Needs Revisiting</span>
            <AlertTriangle size={18} />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-400">{needsRevisiting}</p>
          <p className="text-xs text-slate-400 font-medium">Flagged for high-yield review</p>
        </div>

        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-700/80 space-y-1.5 shadow-md">
          <div className="flex items-center justify-between text-indigo-400">
            <span className="text-xs font-black uppercase tracking-wider">Practice Accuracy</span>
            <Target size={18} />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-indigo-400">
            {totalPracticeQuestions > 0 ? `${overallAccuracy}%` : "—"}
          </p>
          <p className="text-xs text-slate-400 font-medium">{practiceSessions.length} total quizzes logged</p>
        </div>
      </div>

      {/* Course Mastery Breakdown */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-700/80 space-y-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-200">Course Topic Status</h2>
            <p className="text-xs text-slate-400 mt-0.5">Evaluation applied across all your active study fields</p>
          </div>
        </div>

        <div className="divide-y divide-slate-800">
          {notebooks.map((nb) => {
            const status = getNotebookTopicStatus(nb, practiceSessions);
            const badge = getTopicStatusBadge(status);
            const relatedPractice = practiceSessions.filter(
              (s) =>
                s.subject.toLowerCase() === nb.subject.toLowerCase() ||
                nb.name.toLowerCase().includes(s.topic.toLowerCase())
            );

            return (
              <div
                key={nb.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-wider">{nb.subject}</span>
                    <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${badge.className}`}>
                      {badge.label}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white truncate">{nb.name}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                    {nb.messages.length} notes logged • {relatedPractice.length} practice attempts
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <button
                    onClick={() => {
                      onStartPractice(nb.subject, nb.name);
                      onNavigate("practice");
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
                  >
                    <Target size={14} className="text-emerald-400" />
                    <span>Practice</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectNotebook(nb.id);
                      onNavigate("tutor");
                    }}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
                  >
                    <span>Open Notes</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real Practice History Log */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-700/80 space-y-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-200">Recent Practice Quizzes</h2>
            <p className="text-xs text-slate-400 mt-0.5">Logged active recall sessions stored in local state</p>
          </div>
          <button
            onClick={() => onNavigate("practice")}
            className="text-xs sm:text-sm text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            Take a Quiz
            <ArrowRight size={14} />
          </button>
        </div>

        {practiceSessions.length === 0 ? (
          <div className="text-center py-10 text-xs sm:text-sm text-slate-400 space-y-3">
            <p>No practice quizzes completed yet.</p>
            <button
              onClick={() => onNavigate("practice")}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-md shadow-emerald-600/30"
            >
              Start First Quiz
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {[...practiceSessions].reverse().map((session) => {
              const accuracy = Math.round((session.correctAnswers / session.totalQuestions) * 100);
              const isPassing = accuracy >= 70;

              return (
                <div
                  key={session.id}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 text-xs sm:text-sm shadow-inner"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white">{session.topic}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400 font-medium">{session.subject}</span>
                      <span className="text-xs uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold border border-slate-700">
                        {session.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 font-medium">
                      {new Date(session.timestamp).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className={`font-black text-sm sm:text-base ${isPassing ? "text-emerald-400" : "text-amber-400"}`}>
                        {session.correctAnswers} / {session.totalQuestions}
                      </span>
                      <span className="text-slate-400 text-xs ml-1.5 font-bold">({accuracy}%)</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
