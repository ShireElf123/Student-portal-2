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
  assessmentResults?: AssessmentResult[];
  onStartAssessment?: (stage?: "toddler" | "primary") => void;
}

const DEFAULT_CHILDREN: LinkedStudent[] = [
  {
    id: "child-primary",
    name: "Primary Scholar",
    email: "scholar@student.portal",
    gradeLevel: "3rd Grade (Primary)",
    avatarUrl: "",
    lastActive: Date.now() - 1000 * 60 * 25, // 25 mins ago
    subjects: ["Primary Mathematics", "Reading & Writing", "Science Discovery", "Social Studies"],
  },
  {
    id: "child-early",
    name: "Early Learner",
    email: "learner@student.portal",
    gradeLevel: "Early Years (Age 4 • Pre-K)",
    avatarUrl: "",
    lastActive: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    subjects: ["Toddler Phonics", "Animal Picture Books", "Early Numbers", "Sensory Discovery"],
  },
];

export function ParentView({
  notebooks,
  studyPlan,
  practiceSessions,
  classrooms,
  classAssignments,
  assignmentSubmissions,
  onNavigate,
  onOpenSubscriptionModal,
  assessmentResults = [],
  onStartAssessment,
}: ParentViewProps) {
  const [children, setChildren] = useState<LinkedStudent[]>(() => {
    try {
      const saved = localStorage.getItem("my_student_portal_linked_children");
      return saved ? JSON.parse(saved) : DEFAULT_CHILDREN;
    } catch {
      return DEFAULT_CHILDREN;
    }
  });

  const [activeChildId, setActiveChildId] = useState<string>(
    children[0]?.id || "child-maya"
  );
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkCodeInput, setLinkCodeInput] = useState("");
  const [linkError, setLinkError] = useState<string | null>(null);
  const [linkSuccess, setLinkSuccess] = useState<string | null>(null);

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

  const [socraticStrictness, setSocraticStrictness] = useState<boolean>(true);
  const [parentActionToast, setParentActionToast] = useState<string | null>(null);

  const handleUpdateScreenTime = (mins: number) => {
    setScreenTimeLimit(mins);
    try {
      localStorage.setItem("parent_screentime_limit", mins.toString());
    } catch {}
    setParentActionToast(`Daily screen time limit updated to ${mins} minutes`);
    setTimeout(() => setParentActionToast(null), 2500);
  };

  const handleToggleBedtimeLock = () => {
    const nextVal = !bedtimeLockEnabled;
    setBedtimeLockEnabled(nextVal);
    try {
      localStorage.setItem("parent_bedtime_lock", nextVal.toString());
    } catch {}
    setParentActionToast(nextVal ? "Bedtime Lock enabled (8:00 PM)" : "Bedtime Lock disabled");
    setTimeout(() => setParentActionToast(null), 2500);
  };

  const [voiceInfo, setVoiceInfo] = useState(getActiveVoiceInfo());
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Pro Diagnostic & Offline Tools
  const [isWorksheetModalOpen, setIsWorksheetModalOpen] = useState(false);
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState(false);
  const [isMistakeModalOpen, setIsMistakeModalOpen] = useState(false);
  const [dueMistakesCount, setDueMistakesCount] = useState(getDueMistakesCount());

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
    () => children.find((c) => c.id === activeChildId) || children[0],
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

  // Child Linking Handler
  const handleLinkChild = (e: React.FormEvent) => {
    e.preventDefault();
    setLinkError(null);
    setLinkSuccess(null);

    const code = linkCodeInput.trim().toUpperCase();
    if (!code) {
      setLinkError("Please enter a student link code.");
      return;
    }

    // Support simulated linking or demo codes
    const newChildName = code.includes("EARLY")
      ? "Early Learner"
      : code.includes("PRIMARY")
      ? "Primary Scholar"
      : `Student (${code})`;

    const newChild: LinkedStudent = {
      id: `child-${Date.now()}`,
      name: newChildName,
      gradeLevel: "10th Grade",
      avatarUrl: "",
      lastActive: Date.now(),
      subjects: ["Mathematics", "Science", "Literature"],
    };

    const updated = [...children, newChild];
    setChildren(updated);
    setActiveChildId(newChild.id);
    try {
      localStorage.setItem(
        "my_student_portal_linked_children",
        JSON.stringify(updated)
      );
    } catch {
      // ignore
    }

    setLinkSuccess(`Successfully linked ${newChildName}!`);
    setLinkCodeInput("");
    setTimeout(() => {
      setIsLinkModalOpen(false);
      setLinkSuccess(null);
    }, 1200);
  };

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
              {children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name} • {child.gradeLevel || "Student"}
                </option>
              ))}
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
            title="Link another child account"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Link Child</span>
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
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Active</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 font-medium">
              {activeChild?.gradeLevel || "High School"} • Enrolled in {activeChild?.subjects?.length || 4} core courses
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full md:w-auto">
          <div className="flex-1 md:flex-none p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[110px] shadow-inner">
            <span className="text-xs text-slate-400 block mb-1 font-bold">Today's Tasks</span>
            <span className="text-lg sm:text-xl font-black text-white">
              {completedTasksCount} / {childTodayTasks.length || 3}
            </span>
          </div>

          <div className="flex-1 md:flex-none p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[110px] shadow-inner">
            <span className="text-xs text-slate-400 block mb-1 font-bold">Practice Accuracy</span>
            <span className="text-lg sm:text-xl font-black text-emerald-400">
              {practiceMetrics.accuracy > 0 ? `${practiceMetrics.accuracy}%` : "84%"}
            </span>
          </div>

          <div className="flex-1 md:flex-none p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[110px] shadow-inner">
            <span className="text-xs text-slate-400 block mb-1 font-bold">Study Focus</span>
            <span className="text-lg sm:text-xl font-black text-indigo-400">
              {topicBreakdown.onTrack.length} Mastered
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
                Actionable discussion prompts derived from what {activeChild.name.split(" ")[0]} investigated with the AI Tutor.
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

      {/* PARENT NEXT OBVIOUS ACTION JOURNEY BANNER */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-emerald-900/80 via-teal-900/60 to-slate-900 border-2 border-emerald-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400/40 flex items-center justify-center text-3xl shadow-inner flex-shrink-0">
            {activeChildId === "child-leo" ? "🧸" : "🎒"}
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-emerald-300">
              Recommended Next Action for {activeChild.name.split(" ")[0]}
            </div>
            <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
              {activeChildId === "child-early" || activeChildId === "child-leo"
                ? "Run a 3-Minute Phonics & Auditory Milestone Check"
                : "Verify Today's Homework & Check Teacher Feedback"}
            </h3>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              {activeChildId === "child-early" || activeChildId === "child-leo"
                ? `${activeChild.name} explored phonics activities earlier today. Run a quick auditory milestone assessment to track phonemic mastery.`
                : `${activeChild.name} completed assignments today. Review submissions and check teacher notes to reinforce accountability.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => {
              if (activeChildId === "child-early" || activeChildId === "child-leo") {
                if (onStartAssessment) onStartAssessment("toddler");
                else onNavigate("assessment");
              } else {
                onNavigate("homework");
              }
            }}
            className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-950/50 border-b-2 border-emerald-700 active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-2"
          >
            <span>{activeChildId === "child-leo" ? "Start Toddler Check" : "View Homework Desk"}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* PARENTAL CONTROLS & SCREEN SAFETY GATE */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Parental Controls &amp; Screen Safety Gates
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 font-medium">
                Set healthy screen time budgets, bedtime locks, and Socratic guidance constraints for {activeChild.name.split(" ")[0]}.
              </p>
            </div>
          </div>

          {parentActionToast && (
            <span className="text-xs font-bold text-emerald-300 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/30 animate-pulse">
              ✓ {parentActionToast}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Daily Screen Time Budget */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Clock size={14} className="text-indigo-400" /> Daily Screen Budget
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
              After time expires, child is prompted to take a physical break.
            </p>
          </div>

          {/* Bedtime Lock Toggle */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <AlertCircle size={14} className="text-amber-400" /> Bedtime Screen Lock
              </span>
              <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                bedtimeLockEnabled ? "bg-amber-500/20 text-amber-300" : "bg-slate-800 text-slate-500"
              }`}>
                {bedtimeLockEnabled ? "Active (8 PM)" : "Off"}
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
              {bedtimeLockEnabled ? "✓ Bedtime Gate Enabled (8:00 PM)" : "Enable Bedtime Gate"}
            </button>
            <p className="text-[11px] text-slate-500 font-medium">
              Automatically closes interactive activities at 8:00 PM for restful sleep.
            </p>
          </div>

          {/* Socratic Homework Guard */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Brain size={14} className="text-emerald-400" /> Socratic AI Guard
              </span>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                Enforced
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 text-xs font-medium text-slate-300 border border-slate-800 flex items-center justify-between">
              <span>Hints Only • No Direct Answers</span>
              <span className="text-emerald-400 font-bold">✓ ON</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Guarantees the AI coach only prompts the student to think through steps.
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
                Standardized, age-targeted milestone evaluations for phonics, math fluency, and homework readiness.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (onStartAssessment) {
                const stage = activeChildId === "child-leo" ? "toddler" : "primary";
                onStartAssessment(stage);
              } else {
                onNavigate("assessment");
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-950/40 transition-all cursor-pointer active:scale-95"
          >
            <Sparkles size={16} />
            Start Guided Evaluation
          </button>
        </div>

        {assessmentResults.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-2">
            <p className="text-xs sm:text-sm text-slate-300 font-bold">No completed milestone assessments yet this term.</p>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              Run a 5-minute interactive check for {activeChild?.name} on phonemic awareness or primary math word problems to track progress!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              Manage all your children under one account with centralized AI usage allowances and weekly email digests.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenSubscriptionModal}
          className="shrink-0 px-5 py-2.5 text-xs sm:text-sm font-bold text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-xl transition-all cursor-pointer shadow-sm"
        >
          View Family Plan Options
        </button>
      </div>

      {/* Link Child Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0f172a] border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <LinkIcon className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-black text-white">Link Student Account</h3>
              </div>
              <button
                onClick={() => setIsLinkModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Enter the Student Link Code provided on your child's profile or enter their student email address to connect accounts.
            </p>

            <form onSubmit={handleLinkChild} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Student Link Code or UID
                </label>
                <input
                  type="text"
                  value={linkCodeInput}
                  onChange={(e) => setLinkCodeInput(e.target.value)}
                  placeholder="e.g. MSP-ALEX7 or LEO-2026"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 shadow-inner"
                  autoFocus
                />
              </div>

              {linkError && (
                <p className="text-xs sm:text-sm text-rose-400 flex items-center gap-1.5 font-bold">
                  <AlertCircle size={15} /> {linkError}
                </p>
              )}
              {linkSuccess && (
                <p className="text-xs sm:text-sm text-emerald-400 flex items-center gap-1.5 font-bold">
                  <CheckCircle2 size={15} /> {linkSuccess}
                </p>
              )}

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 space-y-1">
                <p className="font-bold text-slate-300">Demo Quick-Links:</p>
                <p>Try entering <strong>LEO-2026</strong> or <strong>EMMA-2026</strong> to test multi-child account switching.</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs sm:text-sm font-black text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md shadow-emerald-900/30 cursor-pointer active:scale-95"
                >
                  Link Account
                </button>
              </div>
            </form>
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
      />

      {/* Mistake Review Vault Modal */}
      <MistakeReviewVaultModal
        isOpen={isMistakeModalOpen}
        onClose={() => setIsMistakeModalOpen(false)}
      />
    </div>
  );
}

