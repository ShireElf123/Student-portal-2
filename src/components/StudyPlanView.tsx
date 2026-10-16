import React, { useState } from "react";
import {
  CalendarCheck,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  User,
  AlertCircle,
  Loader2,
  Calendar,
  X,
} from "lucide-react";
import { Notebook, StudyPlanItem } from "../types";
import { todayISO, formatDateLabel } from "../utils/dateUtils";
import { canConsumeAI, recordAIConsumption, syncAIQuotaFromResponseHeaders } from "../services/aiUsageService";
import { getAiAuthorizationHeader } from "../services/aiAuth";

interface StudyPlanViewProps {
  studyPlan: StudyPlanItem[];
  notebooks: Notebook[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: StudyPlanItem) => void;
  onDeleteTask: (taskId: string) => void;
  onSetTasks: (tasks: StudyPlanItem[]) => void;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeGeneratedTasks(value: unknown, date: string): StudyPlanItem[] | null {
  if (!Array.isArray(value) || value.length < 3 || value.length > 5) return null;
  const tasks: StudyPlanItem[] = [];
  for (const candidate of value) {
    if (!isRecord(candidate)) return null;
    const title = typeof candidate.title === "string" ? candidate.title.trim() : "";
    const subject = typeof candidate.subject === "string" ? candidate.subject.trim() : "";
    const reason = typeof candidate.reason === "string" ? candidate.reason.trim() : "";
    const durationMinutes = candidate.durationMinutes;
    const priority = candidate.priority;
    if (!title || title.length > 160 || !subject || subject.length > 100 || !reason || reason.length > 500 ||
      typeof durationMinutes !== "number" || !Number.isInteger(durationMinutes) || durationMinutes < 5 || durationMinutes > 120 ||
      (priority !== "high" && priority !== "medium" && priority !== "low")) return null;
    tasks.push({
      id: `gen-${Date.now()}-${tasks.length}`,
      title,
      subject,
      durationMinutes,
      priority,
      reason,
      completed: false,
      type: "ai_recommendation",
      date,
    });
  }
  return tasks;
}

export function StudyPlanView({
  studyPlan,
  notebooks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onSetTasks,
}: StudyPlanViewProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(notebooks[0]?.subject || "General");
  const [duration, setDuration] = useState(30);
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");

  const todayStr = todayISO();
  const todayTasks = studyPlan.filter((t) => t.date === todayStr);
  const completedCount = todayTasks.filter((t) => t.completed).length;

  const handleGeneratePlan = async () => {
    const quotaCheck = canConsumeAI("study_plan");
    if (!quotaCheck.allowed) {
      setError(quotaCheck.reason || "Your daily AI usage limit has been reached.");
      return;
    }
    setIsGenerating(true);
    setError(null);

    try {
      const authorization = await getAiAuthorizationHeader();
      const activeSubjects = Array.from(new Set(notebooks.map((nb) => nb.subject)));
      const response = await fetch("/api/study-plan/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: authorization },
        body: JSON.stringify({ subjects: activeSubjects }),
      });
      syncAIQuotaFromResponseHeaders(response.headers);

      if (!response.ok) {
        const errorData: unknown = await response.json().catch(() => ({}));
        throw new Error(isRecord(errorData) && typeof errorData.error === "string"
          ? errorData.error
          : "The study plan engine is currently busy. Please try again in a moment.");
      }

      const responseData: unknown = await response.json();
      const generatedTasks = normalizeGeneratedTasks(
        isRecord(responseData) ? responseData.tasks : undefined,
        todayStr
      );
      if (!generatedTasks) {
        throw new Error("The study-plan service returned incomplete tasks. Please try again.");
      }

      recordAIConsumption("study_plan");
      onSetTasks([...studyPlan.filter((task) => task.date !== todayStr || task.type === "student_task"), ...generatedTasks]);
    } catch (generationError: unknown) {
      setError(generationError instanceof Error
        ? generationError.message
        : "Failed to generate recommended study schedule. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: StudyPlanItem = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      subject: subject.trim() || "General Studies",
      durationMinutes: Number(duration) || 30,
      priority,
      completed: false,
      type: "student_task",
      date: todayStr,
    };

    onAddTask(newTask);
    setTitle("");
    setShowAddModal(false);
  };

  const completionPercent = todayTasks.length > 0 
    ? Math.round((completedCount / todayTasks.length) * 100) 
    : 0;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Daily Study Schedule
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {formatDateLabel(todayStr)} <span className="text-slate-600">·</span> Balanced revision and homework queue
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
          >
            <Plus size={14} />
            <span>Add Custom Task</span>
          </button>

          <button
            type="button"
            onClick={handleGeneratePlan}
            disabled={isGenerating}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-xs font-semibold text-white transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
          >
            {isGenerating ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles size={13} />
                <span>Generate Schedule</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Banner with App Voice */}
      {error && (
        <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle size={15} className="text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-slate-400 hover:text-white text-xs font-medium cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* SINGLE VISUAL BOLDNESS HERO: Today's Completion Target */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3.5 shadow-sm">
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span className="font-semibold text-blue-400">Completion Target</span>
          <span>
            {completedCount} of {todayTasks.length} tasks completed ({completionPercent}%)
          </span>
        </div>

        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Scheduled Tasks for Today ({todayTasks.length})
        </h2>

        {todayTasks.length === 0 ? (
          <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 p-6">
            <Calendar size={28} className="mx-auto text-slate-500" />
            <h3 className="text-sm font-bold text-white">No tasks scheduled for today</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Click "Generate Schedule" to have the academic coach construct a balanced plan across your active subjects, or add your own custom tasks.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {todayTasks.map((task) => {
              const isAI = task.type === "ai_recommendation";

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border transition-colors flex items-start justify-between gap-3 ${
                    task.completed
                      ? "bg-slate-950/60 border-slate-800/80 text-slate-400"
                      : "bg-slate-900 border-slate-800 text-slate-100"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => onToggleTask(task.id)}
                      className="mt-0.5 text-slate-400 hover:text-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded cursor-pointer flex-shrink-0"
                      aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                    >
                      {task.completed ? (
                        <CheckCircle2 size={18} className="text-emerald-400" />
                      ) : (
                        <Circle size={18} />
                      )}
                    </button>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span
                          className={`font-semibold ${
                            task.completed ? "line-through text-slate-500" : "text-white"
                          }`}
                        >
                          {task.title}
                        </span>

                        <span className="text-slate-600">·</span>
                        <span className="text-slate-400 font-medium">
                          {isAI ? "AI Suggested" : "Student Task"}
                        </span>

                        <span className="text-slate-600">·</span>
                        <span
                          className={`font-medium ${
                            task.priority === "high"
                              ? "text-rose-400"
                              : task.priority === "low"
                              ? "text-slate-400"
                              : "text-amber-400"
                          }`}
                        >
                          {task.priority === "high" ? "High Priority" : task.priority === "low" ? "Low Priority" : "Medium Priority"}
                        </span>
                      </div>

                      {task.reason && (
                        <p className="text-xs text-slate-400">{task.reason}</p>
                      )}

                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span>{task.subject}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {task.durationMinutes} mins
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteTask(task.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors cursor-pointer"
                    title="Delete task"
                    aria-label="Delete task"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Custom Task Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add Study Task</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label htmlFor="study-task-title" className="block text-xs font-semibold text-slate-300 mb-1">
                  Task Title
                </label>
                <input
                  id="study-task-title"
                  type="text"
                  required
                  placeholder="e.g. Read Chapter 4 & do problems 1-10"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="study-task-subject" className="block text-xs font-semibold text-slate-300 mb-1">
                    Subject
                  </label>
                  <select
                    id="study-task-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 focus:outline-none"
                  >
                    {notebooks.map((nb) => (
                      <option key={nb.id} value={nb.subject}>
                        {nb.subject}
                      </option>
                    ))}
                    <option value="General Studies">General Studies</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="study-task-duration" className="block text-xs font-semibold text-slate-300 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    id="study-task-duration"
                    type="number"
                    min={5}
                    max={180}
                    step={5}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="study-task-priority" className="block text-xs font-semibold text-slate-300 mb-1">
                  Priority
                </label>
                <select
                  id="study-task-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
