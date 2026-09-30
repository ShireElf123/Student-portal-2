import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  Target,
  Send,
  Plus,
  Trash2,
  GraduationCap,
  CheckSquare,
  Square,
  Zap,
  Award,
  Check,
  Flame,
  ChevronRight,
  HelpCircle,
  FileText,
  MessageSquare,
  X,
  ExternalLink,
  CalendarCheck,
  ArrowRight,
} from "lucide-react";
import {
  HomeworkTask,
  Notebook,
  ClassAssignment,
  AssignmentSubmission,
  Classroom,
  NavigationTab,
} from "../types";
import { todayISO, formatDateLabel } from "../utils/dateUtils";
import { soundEffects } from "../utils/soundEffects";
import { speakText } from "../utils/speechUtils";
import { awardXP, awardStars, triggerCelebrationConfetti } from "../utils/gamification";
import { recordLearningEvent, getActiveLearnerId } from "../utils/learnerBrain";
import { resolveSkillForActivity } from "../data/activitySkillRegistry";
import {
  readScopedJSON,
  writeScopedJSON,
  subscribeAccountScope,
} from "../utils/accountStorage";

interface PrimaryHomeworkViewProps {
  onAskTutor: (prompt: string, attachment?: any) => void;
  onNavigateToPractice?: () => void;
  onStartAssessment?: (assessmentId: string) => void;
  onOpenSTEMArcade?: () => void;
  onNavigate?: (tab: NavigationTab) => void;
  notebooks?: Notebook[];
  classAssignments?: ClassAssignment[];
  submissions?: Record<string, AssignmentSubmission>;
  onSubmitAssignment?: (
    assignmentId: string,
    answerText: string,
    studentNotes?: string
  ) => Promise<boolean>;
  activeClass?: Classroom | null;
  currentUserId?: string;
}

const HOMEWORK_KEY = "my_student_portal_homework_v1";

/**
 * Loads this account's homework desk. The desk starts empty: demo tasks
 * are never seeded, so a learner only ever sees their own real tasks.
 */
export function loadScopedHomeworkTasks(): HomeworkTask[] {
  const saved = readScopedJSON<unknown>(HOMEWORK_KEY, null);
  if (Array.isArray(saved)) {
    return (saved as HomeworkTask[]).filter(
      (task) => task && typeof task.id === "string"
    );
  }
  return [];
}

export function PrimaryHomeworkView({
  onAskTutor,
  onNavigateToPractice,
  onStartAssessment,
  onOpenSTEMArcade,
  onNavigate,
  notebooks = [],
  classAssignments = [],
  submissions = {},
  onSubmitAssignment,
  activeClass,
  currentUserId,
}: PrimaryHomeworkViewProps) {
  const [tasks, setTasks] = useState<HomeworkTask[]>(() => loadScopedHomeworkTasks());

  // Reload this account's desk whenever sign-in/out/switch changes the scope.
  useEffect(() => {
    return subscribeAccountScope(() => {
      setTasks(loadScopedHomeworkTasks());
    });
  }, []);

  const [homeworkQuestion, setHomeworkQuestion] = useState("");
  const [homeworkSubject, setHomeworkSubject] = useState("Mathematics");
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("Mathematics");
  const [newMins, setNewMins] = useState(15);
  const [showAddForm, setShowAddForm] = useState(false);

  // Active Assignment Solver Workspace State
  const [activeAssignmentToSolve, setActiveAssignmentToSolve] = useState<ClassAssignment | null>(null);
  const [studentAnswerText, setStudentAnswerText] = useState("");
  const [studentNotesText, setStudentNotesText] = useState("");
  const [isSubmittingAssignment, setIsSubmittingAssignment] = useState(false);
  const [submissionSuccessCelebration, setSubmissionSuccessCelebration] = useState(false);

  const saveTasks = (updated: HomeworkTask[]) => {
    setTasks(updated);
    writeScopedJSON(HOMEWORK_KEY, updated);
  };

  const handleToggleCompleted = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    const willBeCompleted = !task?.completed;

    if (willBeCompleted) {
      soundEffects.playSuccessChime();
      awardStars(1);
      awardXP(25, "Completed Homework Assignment");
      triggerCelebrationConfetti();
      speakText("Awesome work! One more task completed!", { pitch: 1.15, rate: 1.0 });

      try {
        const resolved = resolveSkillForActivity("primary-homework", task?.subject, task?.title);
        recordLearningEvent({
          learnerId: currentUserId || getActiveLearnerId(),
          activityId: `hw-${id}-${Date.now()}`,
          activityType: "homework-submission",
          activityTitle: `Homework: ${task?.title || "Daily Task"}`,
          skillId: resolved.skillId,
          domain: resolved.domain,
          gradeBand: resolved.gradeBand,
          result: "practice",
          score: 80,
          difficulty: "medium",
          attempts: 1,
          hintsUsed: 0,
          metadata: { taskCompleted: true },
        });
      } catch {}
    } else {
      soundEffects.playPop();
    }

    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: willBeCompleted } : t
    );
    saveTasks(updated);
  };

  const handleToggleParentSigned = (id: string) => {
    soundEffects.playFanfare();
    const updated = tasks.map((t) => {
      if (t.id === id) {
        const nextSigned = !t.parentSigned;
        if (nextSigned) {
          awardXP(30, "Parent Verified Homework");
          triggerCelebrationConfetti();
          speakText("Parent signature verified! Excellent responsibility!", { pitch: 1.1, rate: 0.95 });
        }
        return { ...t, parentSigned: nextSigned };
      }
      return t;
    });
    saveTasks(updated);
  };

  const handleDeleteTask = (id: string) => {
    soundEffects.playGentleBoing();
    const updated = tasks.filter((t) => t.id !== id);
    saveTasks(updated);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    soundEffects.playSuccessChime();
    const newTask: HomeworkTask = {
      id: `hw-${Date.now()}`,
      subject: newSubject,
      title: newTitle.trim(),
      instructions: "Assigned by teacher or parent. Complete and verify steps.",
      dueDate: todayISO(),
      completed: false,
      stage: "primary",
      estimatedMinutes: newMins || 15,
      parentSigned: false,
    };

    saveTasks([newTask, ...tasks]);
    setNewTitle("");
    setShowAddForm(false);
  };

  const handleSubmitHomeworkQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeworkQuestion.trim()) return;

    soundEffects.playCosmicChime();
    const promptText = `I am a primary school student needing step-by-step homework help in ${homeworkSubject}. Please explain simply without giving the raw answer immediately, guide me through each step with friendly encouragement: "${homeworkQuestion.trim()}"`;
    onAskTutor(promptText);
  };

  const handleOpenAssignmentSolver = (asgn: ClassAssignment) => {
    soundEffects.playPop();
    const existingSub = submissions[asgn.id];
    setStudentAnswerText(existingSub?.studentSubmission || "");
    setStudentNotesText(existingSub?.studentNote || "");
    setActiveAssignmentToSolve(asgn);
  };

  const handleTurnInAssignment = async () => {
    if (!activeAssignmentToSolve || !studentAnswerText.trim() || !onSubmitAssignment) return;
    setIsSubmittingAssignment(true);
    try {
      const ok = await onSubmitAssignment(
        activeAssignmentToSolve.id,
        studentAnswerText.trim(),
        studentNotesText.trim()
      );
      if (ok) {
        soundEffects.playFanfare();
        awardStars(2);
        awardXP(50, "Turned In Classroom Homework");
        triggerCelebrationConfetti();
        speakText("Great job! Your assignment has been turned in to your teacher!", { pitch: 1.15, rate: 1.0 });

        try {
          const resolved = resolveSkillForActivity("class-assignment", activeAssignmentToSolve.subject, activeAssignmentToSolve.title);
          recordLearningEvent({
            learnerId: currentUserId || getActiveLearnerId(),
            activityId: `asgn-sub-${activeAssignmentToSolve.id}-${Date.now()}`,
            activityType: "homework-submission",
            activityTitle: `Class Assignment Submitted: ${activeAssignmentToSolve.title}`,
            skillId: resolved.skillId,
            domain: resolved.domain,
            gradeBand: resolved.gradeBand,
            result: "practice",
            score: 75,
            difficulty: "medium",
            attempts: 1,
            hintsUsed: 0,
            metadata: {
              status: "submitted",
              answerLength: studentAnswerText.length,
            },
          });
        } catch {}

        setSubmissionSuccessCelebration(true);
        setTimeout(() => {
          setSubmissionSuccessCelebration(false);
          setActiveAssignmentToSolve(null);
        }, 1800);
      }
    } catch {
      soundEffects.playGentleBoing();
    } finally {
      setIsSubmittingAssignment(false);
    }
  };

  const handleAskAssignmentHint = () => {
    if (!activeAssignmentToSolve) return;
    soundEffects.playCosmicChime();
    const hintQuery = `I am working on my school assignment "${activeAssignmentToSolve.title}" for ${activeAssignmentToSolve.subject}. The instructions are: "${activeAssignmentToSolve.description}". Can you give me a step-by-step clue or question to guide me without telling me the exact final answer?`;
    onAskTutor(hintQuery);
  };

  const pendingAssignments = classAssignments.filter((a) => !submissions[a.id]);
  const pendingTasks = tasks.filter((t) => !t.completed);
  const totalPending = pendingAssignments.length + pendingTasks.length;
  const nextItem = pendingAssignments[0] || pendingTasks[0];

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / Math.max(1, tasks.length)) * 100);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full text-slate-100">
      {/* Desk Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-0.5">
            <span>Primary Workspace</span>
            <span className="text-slate-600">·</span>
            <span>Ages 6–11 · Grades 1–5</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Homework Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Structured daily assignments, teacher turn-ins, and step-by-step Socratic guidance.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {onOpenSTEMArcade && (
            <button
              type="button"
              onClick={onOpenSTEMArcade}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
            >
              <Zap size={13} className="text-amber-400" />
              <span>STEM Arcade</span>
            </button>
          )}

          {onStartAssessment && (
            <button
              type="button"
              onClick={() => onStartAssessment("primary-homework-comprehension")}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
            >
              <GraduationCap size={13} className="text-blue-400" />
              <span>Reading Check</span>
            </button>
          )}
        </div>
      </div>

      {/* SINGLE VISUAL BOLDNESS HERO: Daily Homework Progress Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-blue-400">
              {totalPending > 0
                ? `${totalPending} Pending Item${totalPending === 1 ? "" : "s"} Remaining`
                : "All Goals Met"}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
              {nextItem
                ? `Next Up: ${nextItem.title}`
                : "All assignments and study goals completed for today!"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {nextItem
                ? `${nextItem.subject} · Finish your tasks to earn stars and level up your study streak.`
                : "Excellent work! Reinforce your skills with active recall practice or STEM lab experiments."}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {pendingAssignments.length > 0 ? (
              <button
                type="button"
                onClick={() => handleOpenAssignmentSolver(pendingAssignments[0])}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
              >
                <span>Solve Assignment</span>
                <ArrowRight size={14} />
              </button>
            ) : pendingTasks.length > 0 ? (
              <button
                type="button"
                onClick={() => handleToggleCompleted(pendingTasks[0].id)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
              >
                <CheckCircle2 size={14} />
                <span>Mark Next Task Done</span>
              </button>
            ) : (
              onNavigateToPractice && (
                <button
                  type="button"
                  onClick={onNavigateToPractice}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                >
                  <span>Practice Quizzes</span>
                  <ArrowRight size={14} />
                </button>
              )
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{completedCount} of {tasks.length} tasks completed</span>
            <span className="font-semibold text-amber-400">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Homework Tasks & Socratic Problem Solver */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Checklist & Class Assignments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Teacher Assignments (if present) */}
          {classAssignments.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                    <GraduationCap size={16} className="text-blue-400" />
                    <span>Classroom Assignments</span>
                    <span className="text-xs text-slate-400 font-normal">({activeClass?.name || "Connected Class"})</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Assigned by {activeClass?.teacherName || "Ms. Henderson"}
                  </p>
                </div>

                <span className="text-xs text-slate-400 font-medium">
                  {classAssignments.filter((a) => submissions[a.id]).length} / {classAssignments.length} Turned In
                </span>
              </div>

              <div className="space-y-2.5">
                {classAssignments.map((asgn) => {
                  const sub = submissions[asgn.id];
                  const isSubmitted = !!sub;
                  const isGraded = sub?.status === "reviewed" && !!sub?.grade;

                  return (
                    <div
                      key={asgn.id}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                          <span>{asgn.subject}</span>
                          <span className="text-slate-600">·</span>
                          <span>Due {asgn.dueDate}</span>
                          {isGraded && (
                            <>
                              <span className="text-slate-600">·</span>
                              <span className="text-emerald-400 font-semibold">Grade: {sub.grade}</span>
                            </>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-white tracking-tight mt-0.5 truncate">
                          {asgn.title}
                        </h4>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {asgn.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isSubmitted ? (
                          <button
                            type="button"
                            onClick={() => handleOpenAssignmentSolver(asgn)}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                          >
                            <span>View Submission</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenAssignmentSolver(asgn)}
                            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                          >
                            <span>Solve & Turn In</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Daily Homework Checklist */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Daily Homework Tasks
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {completedCount} of {tasks.length} finished ({progressPercent}%)
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm flex items-center gap-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
              >
                <Plus size={13} />
                <span>Add Task</span>
              </button>
            </div>

            {/* Add Task Inline Form */}
            {showAddForm && (
              <form
                onSubmit={handleAddTask}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
              >
                <label htmlFor="new-task-title" className="block text-xs font-semibold text-slate-300">
                  New Task Description
                </label>
                <input
                  id="new-task-title"
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Math Workbook page 45 #1-8 or Reading Chapter 4"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Reading & English">Reading & English</option>
                    <option value="Science">Science</option>
                    <option value="Spelling">Spelling</option>
                    <option value="Social Studies">Social Studies</option>
                  </select>

                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <input
                      type="number"
                      value={newMins}
                      onChange={(e) => setNewMins(parseInt(e.target.value, 10))}
                      className="w-14 bg-slate-900 border border-slate-800 text-white text-xs rounded-lg px-2 py-1.5 text-center focus:outline-none focus:border-blue-500"
                      min={5}
                      max={120}
                    />
                    <span>mins</span>
                  </div>

                  <div className="flex-1" />

                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white font-medium cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer shadow-sm"
                  >
                    Save Task
                  </button>
                </div>
              </form>
            )}

            {/* Task Items */}
            <div className="space-y-2.5">
              {tasks.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 bg-slate-950 rounded-xl border border-slate-800">
                  No homework tasks remaining for today.
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3.5 rounded-xl border transition-colors flex items-start gap-3 ${
                      task.completed
                        ? "bg-slate-950/60 border-slate-800/80 text-slate-400"
                        : "bg-slate-950 border-slate-800 text-slate-100"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleCompleted(task.id)}
                      className="mt-0.5 text-slate-400 hover:text-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded cursor-pointer flex-shrink-0"
                      aria-label={task.completed ? "Mark task incomplete" : "Mark task complete"}
                    >
                      {task.completed ? (
                        <CheckCircle2 size={18} className="text-emerald-400" />
                      ) : (
                        <Square size={18} className="text-slate-500" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>{task.subject}</span>
                        <span className="text-slate-600">·</span>
                        <span className="flex items-center gap-0.5">
                          <Clock size={11} />
                          ~{task.estimatedMinutes} min
                        </span>
                      </div>

                      <p
                        className={`text-xs sm:text-sm font-semibold mt-0.5 leading-snug ${
                          task.completed ? "line-through text-slate-500" : "text-white"
                        }`}
                      >
                        {task.title}
                      </p>

                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                        {task.instructions}
                      </p>

                      <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-800/60 text-xs">
                        <button
                          type="button"
                          onClick={() => handleToggleParentSigned(task.id)}
                          className={`text-[11px] font-medium flex items-center gap-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded ${
                            task.parentSigned
                              ? "text-emerald-400 font-semibold"
                              : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <Award size={12} />
                          <span>{task.parentSigned ? "Parent Verified" : "Verify Parent Sign-Off"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors cursor-pointer"
                          title="Delete task"
                          aria-label="Delete task"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Socratic Problem Solver & Quick Study Launchers */}
        <div className="space-y-6">
          {/* Ask Socratic Tutor Form */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                <BookOpen size={16} className="text-blue-400" />
                <span>Ask Socratic Tutor</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Stuck on a homework step? Get hints without spoiling the final answer.
              </p>
            </div>

            <form onSubmit={handleSubmitHomeworkQuery} className="space-y-2.5">
              <select
                value={homeworkSubject}
                onChange={(e) => setHomeworkSubject(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Reading & English">Reading & English</option>
                <option value="Science">Science</option>
                <option value="Spelling">Spelling</option>
                <option value="Social Studies">Social Studies</option>
              </select>

              <textarea
                rows={3}
                value={homeworkQuestion}
                onChange={(e) => setHomeworkQuestion(e.target.value)}
                placeholder="Type your homework problem or question..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />

              <button
                type="submit"
                disabled={!homeworkQuestion.trim()}
                className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
              >
                <Send size={13} />
                <span>Ask Tutor for a Hint</span>
              </button>
            </form>
          </div>

          {/* Quick Practice Rounds */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white tracking-tight">Reinforce Key Skills</h3>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playCosmicChime();
                  onAskTutor("Give me a 3rd-grade reading comprehension story about a friendly astronaut with 3 fun multiple-choice questions.");
                }}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
              >
                <div className="text-xs font-bold text-white">Reading Comprehension Story</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Short story with 3 recall questions</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playCosmicChime();
                  if (onNavigateToPractice) onNavigateToPractice();
                }}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
              >
                <div className="text-xs font-bold text-white">Fast Facts Math Practice</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Multiplication, fractions, and mental arithmetic</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Class Assignment Solver Modal */}
      <AnimatePresence>
        {activeAssignmentToSolve && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full max-w-2xl bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-800 flex items-start justify-between gap-3 bg-slate-900">
                <div>
                  <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold mb-0.5">
                    <span>{activeAssignmentToSolve.subject}</span>
                    <span className="text-slate-600">·</span>
                    <span>Due: {activeAssignmentToSolve.dueDate}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {activeAssignmentToSolve.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Assigned by {activeClass?.teacherName || "Ms. Henderson"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveAssignmentToSolve(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                  aria-label="Close solver"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 overflow-y-auto space-y-4 flex-1 bg-slate-950/40">
                {/* Instructions */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-xs font-semibold text-slate-300">Assignment Instructions:</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {activeAssignmentToSolve.description}
                  </p>
                </div>

                {/* Socratic Helper Button */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-300">Need help understanding this problem?</div>
                  <button
                    type="button"
                    onClick={handleAskAssignmentHint}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    Ask Socratic Tutor for a Hint
                  </button>
                </div>

                {/* Answer Input */}
                <div className="space-y-1.5">
                  <label htmlFor="student-answer-input" className="block text-xs font-semibold text-slate-300">
                    Your Solution / Response
                  </label>
                  <textarea
                    id="student-answer-input"
                    rows={4}
                    value={studentAnswerText}
                    onChange={(e) => setStudentAnswerText(e.target.value)}
                    placeholder="Write your explanation, answers, and steps here..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Optional Student Note */}
                <div className="space-y-1.5">
                  <label htmlFor="student-note-input" className="block text-xs font-semibold text-slate-400">
                    Note for Teacher (Optional)
                  </label>
                  <input
                    id="student-note-input"
                    type="text"
                    value={studentNotesText}
                    onChange={(e) => setStudentNotesText(e.target.value)}
                    placeholder="e.g. I double checked problem 3 with the Socratic diagram."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setActiveAssignmentToSolve(null)}
                  className="px-3.5 py-2 rounded-lg text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={!studentAnswerText.trim() || isSubmittingAssignment}
                  onClick={handleTurnInAssignment}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                >
                  <CheckCircle2 size={14} />
                  <span>{isSubmittingAssignment ? "Submitting..." : "Turn In to Teacher"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
