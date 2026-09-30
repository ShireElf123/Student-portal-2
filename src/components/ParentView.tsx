import React, { useState, useMemo, useEffect } from "react";
import {
  Users,
  Sparkles,
  Target,
  CheckCircle2,
  Clock,
  BookOpen,
  CalendarCheck,
  AlertCircle,
  Link as LinkIcon,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Brain,
  MessageSquare,
  Award,
  Plus,
  X,
  ExternalLink,
  Volume2,
  Play,
  Square,
  Settings,
  Printer,
  Compass,
} from "lucide-react";
import {
  Notebook,
  StudyPlanItem,
  PracticeSession,
  Classroom,
  ClassAssignment,
  AssignmentSubmission,
  LinkedStudent,
  NavigationTab,
  AssessmentResult,
} from "../types";
import { getNotebookTopicStatus, getTopicStatusBadge } from "../utils/topicStatus";
import { todayISO, formatDateLabel } from "../utils/dateUtils";
import {
  getActiveVoiceInfo,
  testVoice,
  stopSpeaking,
  isSpeaking,
  subscribeVoiceChange,
  speechCoordinator,
} from "../utils/speechUtils";
import { VoiceSettingsModal } from "./VoiceSettingsModal";
import { PrintableWorksheetGenerator } from "./PrintableWorksheetGenerator";
import { DiagnosticPlacementModal } from "./DiagnosticPlacementModal";
import { MistakeReviewVaultModal } from "./MistakeReviewVaultModal";
import { CURRICULUM_SKILL_NODES, CURRICULUM_DOMAINS } from "../data/curriculumUniverse";
import {
  getDueMistakesCount,
  getLearnerModel,
  subscribeLearnerModel,
  computeDomainMastery,
  getLearnerSummary,
  getSavedDiagnosticResult,
  DiagnosticResult,
  LearnerModel,
} from "../utils/pedagogicalEngine";

interface ParentViewProps {
  notebooks: Notebook[];
  studyPlan: StudyPlanItem[];
  practiceSessions: PracticeSession[];
  classrooms: Classroom[];
  classAssignments: ClassAssignment[];
  assignmentSubmissions: Record<string, AssignmentSubmission>;
  onNavigate: (tab: NavigationTab) => void;
  onOpenSubscriptionModal: () => void;
  onApplyDiagnosticRecommendation?: (nodeId: string) => void;
  assessmentResults?: AssessmentResult[];
  onStartAssessment?: (stage?: "toddler" | "primary") => void;
}

const DEFAULT_CHILDREN: LinkedStudent[] = [];

export function ParentView({
  notebooks,
  studyPlan,
  practiceSessions,
  classrooms,
  classAssignments,
  assignmentSubmissions,
  onNavigate,
  onOpenSubscriptionModal,
  onApplyDiagnosticRecommendation,
  assessmentResults = [],
  onStartAssessment,
}: ParentViewProps) {
  // Only show authenticated, real linked learners here. Placeholder/demo children
  // from older local profiles are intentionally not treated as actual accounts.
  const [children] = useState<LinkedStudent[]>(DEFAULT_CHILDREN);

  const [activeChildId, setActiveChildId] = useState<string>(
    children[0]?.id || "current-learner"
  );
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  // Parental Control States
  const [screenTimeLimit, setScreenTimeLimit] = useState<number>(() => {
    try {
      const val = localStorage.getItem("parent_screentime_limit");
      return val ? parseInt(val, 10) : 60;
    } catch {
      return 60;
    }
  });

  const [bedtimeLockEnabled, setBedtimeLockEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem("parent_bedtime_lock") !== "false";
    } catch {
      return true;
    }
  });

  const [parentActionToast, setParentActionToast] = useState<string | null>(null);

  const handleUpdateScreenTime = (mins: number) => {
    setScreenTimeLimit(mins);
    try {
      localStorage.setItem("parent_screentime_limit", mins.toString());
    } catch {}
    setParentActionToast(`Local screen-time preference saved: ${mins} minutes. App blocking is not enabled.`);
    setTimeout(() => setParentActionToast(null), 2500);
  };

  const handleToggleBedtimeLock = () => {
    const nextVal = !bedtimeLockEnabled;
    setBedtimeLockEnabled(nextVal);
    try {
      localStorage.setItem("parent_bedtime_lock", nextVal.toString());
    } catch {}
    setParentActionToast(nextVal ? "Bedtime preference saved locally; no access block is active." : "Bedtime preference turned off locally.");
    setTimeout(() => setParentActionToast(null), 2500);
  };

  const [voiceInfo, setVoiceInfo] = useState(getActiveVoiceInfo());
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Pro Diagnostic & Offline Tools
  const [isWorksheetModalOpen, setIsWorksheetModalOpen] = useState(false);
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState(false);
  const [isMistakeModalOpen, setIsMistakeModalOpen] = useState(false);
  const [selectedAssessmentStage, setSelectedAssessmentStage] = useState<"toddler" | "primary">("primary");
  const [diagnosticSnapshot, setDiagnosticSnapshot] = useState<DiagnosticResult | null>(getSavedDiagnosticResult);
  const [dueMistakesCount, setDueMistakesCount] = useState(getDueMistakesCount());

  useEffect(() => {
    const handleDiagnosticUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<DiagnosticResult>;
      if (customEvent.detail) setDiagnosticSnapshot(customEvent.detail);
    };
    window.addEventListener("diagnostic_profile_updated", handleDiagnosticUpdate);
    return () => window.removeEventListener("diagnostic_profile_updated", handleDiagnosticUpdate);
  }, []);

  useEffect(() => {
    const handleUpdate = () => setDueMistakesCount(getDueMistakesCount());
    window.addEventListener("mistake_vault_updated", handleUpdate);
    return () => window.removeEventListener("mistake_vault_updated", handleUpdate);
  }, []);
  const [isVoiceTesting, setIsVoiceTesting] = useState(isSpeaking());
  const [learnerModel, setLearnerModel] = useState<LearnerModel>(() => getLearnerModel(activeChildId));

  useEffect(() => {
    setLearnerModel(getLearnerModel(activeChildId));
  }, [activeChildId]);

  useEffect(() => {
    return subscribeLearnerModel((model) => {
      if (model.learnerId === activeChildId) {
        setLearnerModel(model);
      }
    });
  }, [activeChildId]);

  useEffect(() => {
    const unsubSpeech = speechCoordinator.subscribe(setIsVoiceTesting);
    const unsubVoice = subscribeVoiceChange(() => setVoiceInfo(getActiveVoiceInfo()));
    return () => {
      unsubSpeech();
      unsubVoice();
    };
  }, []);

  const handleTestVoiceToggle = () => {
    if (isVoiceTesting) {
      stopSpeaking();
    } else {
      testVoice("Hello! I am your AI learning coach. Ready for today's learning quest?");
    }
  };

  const activeChild = useMemo(
    () => children.find((c) => c.id === activeChildId) || children[0] || { id: "current-learner", name: "Current learner", email: "", gradeLevel: "This device", avatarUrl: "", lastActive: Date.now(), subjects: [] },
    [children, activeChildId]
  );

  // Today's Study Tasks for Child
  const todayStr = todayISO();
  const childTodayTasks = useMemo(
    () => studyPlan.filter((task) => task.date === todayStr),
    [studyPlan, todayStr]
  );
  const completedTasksCount = childTodayTasks.filter((t) => t.completed).length;

  // Real Practice Accuracy & Stats
  const practiceMetrics = useMemo(() => {
    if (practiceSessions.length === 0) {
      return { totalQuestions: 0, correctAnswers: 0, accuracy: 0 };
    }
    const totalQuestions = practiceSessions.reduce(
      (acc, s) => acc + s.totalQuestions,
      0
    );
    const correctAnswers = practiceSessions.reduce(
      (acc, s) => acc + s.correctAnswers,
      0
    );
    const accuracy =
      totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    return { totalQuestions, correctAnswers, accuracy };
  }, [practiceSessions]);

  // Topic Mastery Categorization from Real Notebooks
  const topicBreakdown = useMemo(() => {
    const onTrack: { name: string; subject: string }[] = [];
    const needsReview: { name: string; subject: string }[] = [];
    const inProgress: { name: string; subject: string }[] = [];

    notebooks.forEach((nb) => {
      const status = getNotebookTopicStatus(nb, practiceSessions);
      if (status === "on_track") {
        onTrack.push({ name: nb.name, subject: nb.subject });
      } else if (status === "needs_revisiting") {
        needsReview.push({ name: nb.name, subject: nb.subject });
      } else {
        inProgress.push({ name: nb.name, subject: nb.subject });
      }
    });

    return { onTrack, needsReview, inProgress };
  }, [notebooks, practiceSessions]);

  // AI Discussion Starters dynamically generated from the student's actual notebooks & practice
  const parentConversationStarters = useMemo(() => {
    const starters: {
      topic: string;
      subject: string;
      prompt: string;
      context: string;
    }[] = [];

    notebooks.forEach((nb) => {
      const userQuestions = nb.messages
        .filter((m) => m.role === "user")
        .map((m) => m.content);

      if (userQuestions.length > 0) {
        const lastQuery = userQuestions[userQuestions.length - 1];
        starters.push({
          topic: nb.name,
          subject: nb.subject,
          prompt: `Ask: "How did your study session on ${nb.name} go? What key formula or takeaway surprised you?"`,
          context: `Explored inquiry: "${lastQuery.slice(0, 100)}${
            lastQuery.length > 100 ? "..." : ""
          }"`,
        });
      }
    });

    if (starters.length === 0) {
      starters.push({
        topic: "Daily Check-in",
        subject: "General Academics",
        prompt: `Ask: "What was the most challenging topic you worked through today with your AI Tutor?"`,
        context: "Encourages metacognition and reinforces independent problem solving.",
      });
    }

    return starters.slice(0, 3);
  }, [notebooks]);


  return (
    <div
      id="parent-experience-hub"
      className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-6xl mx-auto w-full"
    >
      {/* Top Header & Child Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm">
              <Users size={15} />
              Parent & Guardian Portal
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-slate-400 text-xs sm:text-sm font-medium">{formatDateLabel(todayStr)}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            Learning Oversight & Insights
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
            Supportive visibility into your child's academic journey, AI tutor inquiries, and daily mastery.
          </p>
        </div>

        {/* Child Switcher Dropdown & Link Button */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <select
              id="parent-child-selector"
              value={activeChildId}
              onChange={(e) => setActiveChildId(e.target.value)}
              className="appearance-none bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-white font-bold text-xs sm:text-sm rounded-xl py-2.5 pl-4 pr-10 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm"
            >
              {children.length ? children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name} • {child.gradeLevel || "Student"}
                </option>
              )) : <option value="current-learner">Current learner · this browser</option>}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>

          <button
            id="open-link-child-modal-btn"
            onClick={() => setIsLinkModalOpen(true)}
            className="p-2.5 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700/80 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            title="About family account linking"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Family accounts</span>
          </button>
        </div>
      </div>

      {/* Child Summary Profile Card */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-950/40">
            {activeChild?.name ? activeChild.name.charAt(0) : "S"}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg sm:text-2xl font-black text-white">
                {activeChild?.name || "Student"}
              </h2>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">This browser</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 font-medium">
              Local learner profile • {notebooks.length} subject {notebooks.length === 1 ? "notebook" : "notebooks"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full md:w-auto">
          <div className="flex-1 md:flex-none p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[110px] shadow-inner">
            <span className="text-xs text-slate-400 block mb-1 font-bold">Today's Tasks</span>
            <span className="text-lg sm:text-xl font-black text-white">
              {completedTasksCount} / {childTodayTasks.length}
            </span>
          </div>

          <div className="flex-1 md:flex-none p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[110px] shadow-inner">
            <span className="text-xs text-slate-400 block mb-1 font-bold">Practice Accuracy</span>
            <span className="text-lg sm:text-xl font-black text-emerald-400">
              {practiceMetrics.totalQuestions > 0 ? `${practiceMetrics.accuracy}%` : "—"}
            </span>
          </div>

          <div className="flex-1 md:flex-none p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[110px] shadow-inner">
            <span className="text-xs text-slate-400 block mb-1 font-bold">Topic status</span>
            <span className="text-lg sm:text-xl font-black text-indigo-400">
              {topicBreakdown.onTrack.length} On track
            </span>
          </div>
        </div>
      </div>

      {/* AI Conversation Starters for Parents */}
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                AI Parent Conversation Starters
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 font-medium">
                {parentConversationStarters.some((starter) => starter.context.startsWith("Explored inquiry:")) ? `Conversation prompts based on this browser profile’s saved tutor questions for ${activeChild.name}.` : "Gentle conversation prompts for reflecting on learning together."}
              </p>
            </div>
          </div>
          <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 shadow-sm">
            Pedagogical Coach
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {parentConversationStarters.map((starter, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3.5 shadow-sm"
            >
              <div>
                <span className="px-2.5 py-0.5 rounded text-xs font-black uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                  {starter.subject}
                </span>
                <p className="text-xs sm:text-sm font-bold text-white mt-2.5 leading-relaxed">
                  {starter.prompt}
                </p>
              </div>
              <p className="text-xs text-slate-400 italic font-medium">
                {starter.context}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence-based next action */}
      {learnerModel.recommendedNext[0] && (() => {
        const nextAction = learnerModel.recommendedNext[0];
        return (
          <div className="flex flex-col justify-between gap-5 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/70 via-teal-950/50 to-slate-900 p-6 shadow-xl sm:p-7 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-3xl">🌱</div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-emerald-300">Suggested next step · {nextAction.badge}</p>
                <h3 className="mt-1 text-base font-black text-white sm:text-lg">{nextAction.title}</h3>
                <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-300">{nextAction.reason}</p>
              </div>
            </div>
            <button onClick={() => nextAction.nodeId && onApplyDiagnosticRecommendation ? onApplyDiagnosticRecommendation(nextAction.nodeId) : onNavigate(nextAction.targetTab)} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border-b-2 border-emerald-700 bg-emerald-500 px-5 py-3 text-xs font-black text-slate-950 shadow-lg transition hover:bg-emerald-400">
              Open suggested step <ChevronRight size={16}/>
            </button>
          </div>
        );
      })()}

      {/* PARENTAL CONTROLS & SCREEN SAFETY GATE */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Family preferences &amp; supervision
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 font-medium">
                These preferences are stored on this browser; enforcement controls are not connected yet.
              </p>
            </div>
          </div>

          {parentActionToast && (
            <span className="text-xs font-bold text-emerald-300 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/30 animate-pulse">
              ✓ {parentActionToast}
            </span>
          )}
        </div>

        <div className="rounded-xl border border-amber-400/20 bg-amber-400/[.06] px-4 py-3 text-xs leading-relaxed text-amber-100/90">For transparency: screen-time and bedtime values below are saved preferences only. This build does not yet enforce a timer, block access at bedtime, or apply per-child controls. The AI tutor can also make mistakes; review important answers with your learner.</div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Daily Screen Time Budget */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Clock size={14} className="text-indigo-400" /> Screen-time goal
              </span>
              <span className="text-xs font-black text-indigo-400">
                {screenTimeLimit} mins
              </span>
            </div>
            <div className="flex items-center gap-2">
              {[30, 45, 60, 90].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleUpdateScreenTime(mins)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    screenTimeLimit === mins
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              A planning preference only; reaching this value does not currently trigger a break or block.
            </p>
          </div>

          {/* Bedtime Lock Toggle */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <AlertCircle size={14} className="text-amber-400" /> Bedtime preference
              </span>
              <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                bedtimeLockEnabled ? "bg-amber-500/20 text-amber-300" : "bg-slate-800 text-slate-500"
              }`}>
                {bedtimeLockEnabled ? "Saved (8 PM)" : "Off"}
              </span>
            </div>
            <button
              onClick={handleToggleBedtimeLock}
              className={`w-full py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                bedtimeLockEnabled
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-200 hover:bg-amber-500/30"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {bedtimeLockEnabled ? "✓ Preference: 8:00 PM" : "Set bedtime preference"}
            </button>
            <p className="text-[11px] text-slate-500 font-medium">
              Stored as a reminder preference only; no bedtime lock is currently applied.
            </p>
          </div>

          {/* Socratic Homework Guard */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Brain size={14} className="text-emerald-400" /> Tutor approach
              </span>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                Guidance
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 text-xs font-medium text-slate-300 border border-slate-800 flex items-center justify-between">
              <span>Hint-first Socratic coaching</span>
              <span className="text-emerald-400 font-bold">Default</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              The tutor is prompted to guide reasoning, but it may still provide an incomplete or direct answer. Check important work together.
            </p>
          </div>

          {/* AI Coach Voice (Guy / Natural Male Priority) */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Volume2 size={14} className="text-cyan-400" /> AI Coach Voice
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                voiceInfo.isGuy
                  ? "bg-emerald-500/20 text-emerald-300"
                  : voiceInfo.isMale
                  ? "bg-cyan-500/20 text-cyan-300"
                  : "bg-slate-800 text-slate-300"
              }`}>
                {voiceInfo.isGuy ? "Guy (Natural)" : voiceInfo.isMale ? "Natural Male" : "System Voice"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestVoiceToggle}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  isVoiceTesting
                    ? "bg-amber-600 text-white animate-pulse"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
                }`}
              >
                {isVoiceTesting ? <Square size={12} className="fill-white" /> : <Play size={12} className="fill-white" />}
                <span>{isVoiceTesting ? "Stop" : "Test Voice"}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsVoiceModalOpen(true)}
                className="p-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 cursor-pointer transition-all flex items-center gap-1 text-xs font-bold"
                title="Open Voice Settings"
              >
                <Settings size={13} />
                <span>Tuning</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 font-medium truncate" title={voiceInfo.name}>
              {voiceInfo.name}
            </p>
          </div>
        </div>

      </div>

      {/* Two Column Layout: Subject Mastery Matrix & Today's Study Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Mastery Matrix */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Target className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base sm:text-lg font-black text-white">Subject Mastery Matrix</h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Real-time progress indicators
            </span>
          </div>

          <div className="space-y-3">
            {notebooks.slice(0, 5).map((nb) => {
              const status = getNotebookTopicStatus(nb, practiceSessions);
              const badge = getTopicStatusBadge(status);
              const msgCount = nb.messages?.length || 0;

              return (
                <div
                  key={nb.id}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3.5 hover:bg-slate-950 transition-colors shadow-sm"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-bold text-white truncate">
                        {nb.name}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold px-2 py-0.5 bg-slate-800 rounded">
                        {nb.subject}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 font-medium">
                      {msgCount} interactive tutor exchanges logged
                    </p>
                  </div>

                  <span
                    className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold border ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs sm:text-sm text-slate-400 font-medium">
            <span>Overall On-Track Mastery</span>
            <span className="font-bold text-emerald-400">
              {topicBreakdown.onTrack.length} of {notebooks.length} Topics
            </span>
          </div>
        </div>

        {/* Study Plan & Homework Tasks */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CalendarCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base sm:text-lg font-black text-white">
                Daily Study Plan & Assignments
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">Today's Goals</span>
          </div>

          {childTodayTasks.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs sm:text-sm bg-slate-950/60 rounded-2xl border border-slate-800 font-medium">
              All scheduled study items completed for today!
            </div>
          ) : (
            <div className="space-y-3">
              {childTodayTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border transition-colors flex items-start gap-3.5 shadow-sm ${
                    task.completed
                      ? "bg-slate-950/60 border-slate-800 text-slate-400"
                      : "bg-slate-950/80 border-slate-800 text-white"
                  }`}
                >
                  <div className="mt-0.5">
                    {task.completed ? (
                      <CheckCircle2 size={18} className="text-emerald-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs sm:text-sm font-bold ${
                        task.completed ? "line-through text-slate-500" : "text-white"
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 font-medium">
                      {task.subject} • {task.durationMinutes} mins • {task.reason || "Scheduled module"}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                      task.priority === "high"
                        ? "bg-rose-500/10 text-rose-300 border border-rose-500/30"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Enrolled Classroom Homework Status */}
          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider mb-2.5">
              Classroom Homework Tracker
            </h4>
            <div className="space-y-2.5">
              {classAssignments.slice(0, 3).map((asgn) => {
                const sub = assignmentSubmissions[asgn.id];
                return (
                  <div
                    key={asgn.id}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs sm:text-sm shadow-inner"
                  >
                    <div>
                      <span className="font-bold text-white">{asgn.title}</span>
                      <span className="text-slate-400 block text-xs mt-0.5 font-medium">
                        Due {asgn.dueDate} • {asgn.subject}
                      </span>
                    </div>
                    {sub?.grade ? (
                      <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold text-xs border border-emerald-500/30">
                        Grade: {sub.grade}
                      </span>
                    ) : sub ? (
                      <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold text-xs border border-amber-500/30">
                        Turned In
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-400 text-xs font-semibold">
                        Pending
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Pro Competency Gap Radar & Diagnostic Intelligence */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Curriculum Competency Radar & Diagnostic Insights
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 font-medium">
                Standard-aligned mastery across Mathematics, Phonics, STEM, and Computational Thinking.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsWorksheetModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer size={15} />
              <span>Print Offline Worksheet</span>
            </button>
            <button
              onClick={() => setIsDiagnosticModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Compass size={15} />
              <span>Run Diagnostic Check</span>
            </button>
          </div>
        </div>

        {/* Domain Progress Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CURRICULUM_DOMAINS.map((domain) => {
            const domainNodes = CURRICULUM_SKILL_NODES.filter((n) => n.domain === domain.id);
            // Real computed standard mastery from Unified Learning Brain for active child
            const pct = computeDomainMastery(domain.id, activeChildId);
            return (
              <div
                key={domain.id}
                className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{domain.emoji}</span>
                  <span className="text-xs font-black text-emerald-400">{pct}% Mastered</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white truncate">{domain.label}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{domainNodes.length} Standards Nodes</p>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Identified Gap / Recommended Next Step Banner */}
        {learnerModel.recommendedNext.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 text-amber-200">
              <AlertCircle size={18} className="text-amber-400 shrink-0" />
              <span>
                <strong>Smart Recommendation ({learnerModel.recommendedNext[0].badge}):</strong>{" "}
                {learnerModel.recommendedNext[0].title} — {learnerModel.recommendedNext[0].reason}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onNavigate(learnerModel.recommendedNext[0].targetTab)}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Start Recommended Task
              </button>
              <button
                onClick={() => setIsWorksheetModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                Worksheet
              </button>
            </div>
          </div>
        )}

        {/* Unified Learning Journey Event Stream */}
        {learnerModel.recentEvents.length > 0 && (
          <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
              <span>Recent Learning Milestones ({learnerModel.recentEvents.length} Recorded)</span>
              <span className="text-emerald-400">{learnerModel.strongSkills.length} Strong Skills</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
              {learnerModel.recentEvents.slice(0, 6).map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs flex items-center justify-between gap-2 shadow-sm"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate">{evt.activityTitle}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(evt.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • {evt.domain}
                    </p>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md shrink-0 ${
                    evt.result === "mastered"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : evt.result === "success"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  }`}>
                    {evt.result}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Guided Milestone Assessments for Early & Primary Learners */}
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Guided Milestone Assessments ({activeChild?.name})
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 font-medium">
                Short interactive learning snapshots for early literacy, math and reasoning. Use these as a guide—not a formal or standardized assessment.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="parent-assessment-stage">Choose a learning stage</label>
            <select id="parent-assessment-stage" value={selectedAssessmentStage} onChange={(event) => setSelectedAssessmentStage(event.target.value as "toddler" | "primary")} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">
              <option value="toddler">Early learner · ages 2–5</option>
              <option value="primary">Primary · ages 6–11</option>
            </select>
            <button
            onClick={() => {
              if (onStartAssessment) onStartAssessment(selectedAssessmentStage);
              else onNavigate("assessment");
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-950/40 transition-all cursor-pointer active:scale-95"
          >
            <Sparkles size={16} />
            Start Guided Evaluation
          </button>
          </div>
        </div>

        {!diagnosticSnapshot && assessmentResults.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-2">
            <p className="text-xs sm:text-sm text-slate-300 font-bold">No learning snapshot has been saved in this browser yet.</p>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">Choose an age band above to take a short skill snapshot. Results are a guide, not a formal assessment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {diagnosticSnapshot && (
              <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/[.07] p-5 md:col-span-2">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><p className="text-[10px] font-black uppercase tracking-wider text-indigo-200">Latest learning snapshot · {new Date(diagnosticSnapshot.completedAt).toLocaleDateString()}</p><h4 className="mt-1 text-base font-extrabold text-white">Suggested starting band: {diagnosticSnapshot.recommendedGradeBand}</h4><p className="mt-1 text-xs text-slate-300">Focus to explore: {diagnosticSnapshot.recommendedDomainFocus}</p></div>
                  <span className="rounded-lg bg-slate-950/60 px-3 py-2 text-sm font-black text-white">{diagnosticSnapshot.score}/{diagnosticSnapshot.total} correct</span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">{Object.entries(diagnosticSnapshot.gradeBandScores).map(([band, result]) => <div key={band} className="rounded-lg border border-white/[.06] bg-slate-950/50 p-2 text-center"><span className="block text-[10px] text-slate-400">Band {band}</span><span className="text-sm font-bold text-white">{result.correct}/{result.total}</span></div>)}</div>
                <p className="mt-3 text-[10px] leading-relaxed text-slate-500">Brief screening snapshot only—not a standardized test or definitive grade placement.</p>
              </div>
            )}
            {assessmentResults.slice(0, 4).map((res) => (
              <div
                key={res.id}
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-white">{res.assessmentTitle}</span>
                  <span className="px-2 py-0.5 rounded text-xs font-black bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    ⭐ {res.starsAwarded} Stars
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="text-emerald-400 font-bold">{res.masteredCount} Mastered</span>
                  <span>•</span>
                  <span className="text-blue-400 font-medium">{res.developingCount} Developing</span>
                  <span>•</span>
                  <span className="text-slate-500">{res.date}</span>
                </div>
                {res.feedbackSummary && (
                  <p className="text-xs text-slate-300 italic line-clamp-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                    "{res.feedbackSummary}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Subscription & Family Plan Callout */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-black text-white">
              Family & Homeschool Intelligence
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 font-medium">
              View saved learning activity for the learner profile on this browser. Secure multi-child linking and weekly email reports are not available yet.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenSubscriptionModal}
          className="shrink-0 px-5 py-2.5 text-xs sm:text-sm font-bold text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-xl transition-all cursor-pointer shadow-sm"
        >
          View subscription settings
        </button>
      </div>

      {/* Transparent account-linking status: no fake codes or local-only accounts. */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="link-learner-title">
          <div className="w-full max-w-md space-y-5 rounded-3xl border border-slate-700 bg-[#0f172a] p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <LinkIcon className="h-5 w-5 text-emerald-400" />
                <h3 id="link-learner-title" className="text-lg font-black text-white">Learner accounts</h3>
              </div>
              <button onClick={() => setIsLinkModalOpen(false)} aria-label="Close learner account information" className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"><X size={18}/></button>
            </div>
            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[.06] p-4">
              <p className="text-sm font-bold text-amber-100">Secure family linking isn’t available yet.</p>
              <p className="mt-2 text-xs leading-5 text-slate-300">This dashboard currently reflects learning data stored in this browser profile. It cannot verify or connect another student account. No link codes or student IDs are being collected here.</p>
            </div>
            <button onClick={() => setIsLinkModalOpen(false)} className="w-full rounded-xl bg-slate-800 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-700">Got it</button>
          </div>
        </div>
      )}

      {/* AI Voice Tuning & Selection Modal */}
      <VoiceSettingsModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />

      {/* Printable Worksheet Modal */}
      <PrintableWorksheetGenerator
        isOpen={isWorksheetModalOpen}
        onClose={() => setIsWorksheetModalOpen(false)}
      />

      {/* Diagnostic Placement Modal */}
      <DiagnosticPlacementModal
        isOpen={isDiagnosticModalOpen}
        onClose={() => setIsDiagnosticModalOpen(false)}
        onApplyRecommendation={onApplyDiagnosticRecommendation}
      />

      {/* Mistake Review Vault Modal */}
      <MistakeReviewVaultModal
        isOpen={isMistakeModalOpen}
        onClose={() => setIsMistakeModalOpen(false)}
      />
    </div>
  );
}

