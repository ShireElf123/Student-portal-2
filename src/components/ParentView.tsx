import React, { useState, useMemo, useEffect } from "react";
import {
  Users,
  Sparkles,
  Target,
  CheckCircle2,
  CalendarCheck,
  AlertCircle,
  Link as LinkIcon,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Brain,
  Award,
  Plus,
  X,
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
  testVoice,
  stopSpeaking,
  isSpeaking,
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
  getInitialLearnerModel,
  subscribeLearnerModel,
  computeDomainMastery,
  getLearnerSummary,
  getSavedDiagnosticResult,
  DiagnosticResult,
  LearnerModel,
} from "../utils/pedagogicalEngine";
import {
  fetchLinkedStudentProfiles,
  fetchLinkedChildCollection,
  fetchLearnerModelFromCloud,
  linkChildByCode,
  generateParentLinkCode,
  unlinkChild,
} from "../firebaseCore";

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
  currentUserId?: string | null;
}

/** Selector value for the learner profile stored in this browser. */
const BROWSER_LEARNER_ID = "__browser__";

const EMPTY_CHILD_CLOUD = {
  notebooks: [] as Notebook[],
  studyPlan: [] as StudyPlanItem[],
  practiceSessions: [] as PracticeSession[],
  model: null as LearnerModel | null,
};

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
  currentUserId = null,
}: ParentViewProps) {
  // Real linked learners resolve from the cloud family graph. Placeholder/demo
  // children from older local profiles are never treated as actual accounts.
  const [children, setChildren] = useState<LinkedStudent[]>([]);
  const [childrenLoading, setChildrenLoading] = useState(false);

  const [activeChildId, setActiveChildId] = useState<string>(BROWSER_LEARNER_ID);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkModalTab, setLinkModalTab] = useState<"enter" | "issue" | "manage">("enter");
  const [linkCodeInput, setLinkCodeInput] = useState("");
  const [linkActionError, setLinkActionError] = useState<string | null>(null);
  const [linkActionBusy, setLinkActionBusy] = useState(false);
  const [linkSuccessName, setLinkSuccessName] = useState<string | null>(null);
  const [issuedCode, setIssuedCode] = useState<string | null>(null);
  const [issuedName, setIssuedName] = useState("");
  const [unlinkingId, setUnlinkingId] = useState<string | null>(null);

  const refreshChildren = async (selectId?: string) => {
    if (!currentUserId) {
      setChildren([]);
      return;
    }
    setChildrenLoading(true);
    try {
      const profiles = await fetchLinkedStudentProfiles(currentUserId);
      const next: LinkedStudent[] = profiles.map((profile) => ({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        gradeLevel: profile.gradeLevel,
        lastActive: typeof profile.lastActive === "number" ? profile.lastActive : Date.now(),
      }));
      setChildren(next);
      if (selectId && next.some((child) => child.id === selectId)) {
        setActiveChildId(selectId);
      }
    } catch {
      setChildren([]);
    } finally {
      setChildrenLoading(false);
    }
  };

  // Reload the family graph on sign-in/out/switch and reset the viewer to
  // this browser's learner so one account never sees another's children.
  useEffect(() => {
    setActiveChildId(BROWSER_LEARNER_ID);
    setLinkSuccessName(null);
    setIssuedCode(null);
    setLinkActionError(null);
    refreshChildren();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  const isViewingLinked = activeChildId !== BROWSER_LEARNER_ID;
  const [childCloud, setChildCloud] = useState({ ...EMPTY_CHILD_CLOUD });
  const [childLoading, setChildLoading] = useState(false);

  // Load the linked learner's live cloud data whenever the selection changes.
  useEffect(() => {
    let cancelled = false;
    if (!isViewingLinked || !currentUserId) {
      setChildCloud({ ...EMPTY_CHILD_CLOUD });
      setChildLoading(false);
      return;
    }
    const studentId = activeChildId;
    setChildLoading(true);
    (async () => {
      try {
        const [cloudNotebooks, cloudStudy, cloudPractice, cloudModel] = await Promise.all([
          fetchLinkedChildCollection(currentUserId, studentId, "notebooks"),
          fetchLinkedChildCollection(currentUserId, studentId, "studyPlanItems"),
          fetchLinkedChildCollection(currentUserId, studentId, "practiceSessions"),
          fetchLearnerModelFromCloud(studentId),
        ]);
        if (cancelled) return;
        const asNotebooks = (cloudNotebooks as unknown[]).filter(
          (doc): doc is Notebook => !!doc && typeof (doc as Notebook).id === "string"
        );
        const asStudy = (cloudStudy as unknown[]).filter(
          (doc): doc is StudyPlanItem => !!doc && typeof (doc as StudyPlanItem).id === "string"
        );
        const asPractice = (cloudPractice as unknown[]).filter(
          (doc): doc is PracticeSession => !!doc && typeof (doc as PracticeSession).id === "string"
        );
        const model =
          cloudModel && typeof cloudModel === "object" && (cloudModel as LearnerModel).skillMastery
            ? (cloudModel as LearnerModel)
            : null;
        setChildCloud({ notebooks: asNotebooks, studyPlan: asStudy, practiceSessions: asPractice, model });
      } catch {
        if (!cancelled) setChildCloud({ ...EMPTY_CHILD_CLOUD });
      } finally {
        if (!cancelled) setChildLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeChildId, currentUserId, isViewingLinked]);

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
  // This browser's learner brain (live subscription to the active learner).
  const [learnerModel, setLearnerModel] = useState<LearnerModel>(() => getLearnerModel());

  useEffect(() => {
    setLearnerModel(getLearnerModel());
    return subscribeLearnerModel(setLearnerModel);
  }, [currentUserId]);

  // What the dashboard displays: live cloud data for a linked learner, or
  // this browser's local data otherwise. A linked learner with no cloud
  // model yet shows honest zeros — never another profile's numbers.
  const emptyLinkedModel = useMemo(() => {
    const fresh = getInitialLearnerModel(activeChildId);
    fresh.recommendedNext = [];
    return fresh;
  }, [activeChildId]);
  const displayModel = isViewingLinked ? childCloud.model || emptyLinkedModel : learnerModel;
  const displayNotebooks = isViewingLinked ? childCloud.notebooks : notebooks;
  const displayStudyPlan = isViewingLinked ? childCloud.studyPlan : studyPlan;
  const displayPracticeSessions = isViewingLinked ? childCloud.practiceSessions : practiceSessions;
  const hasLinkedCloudData = !isViewingLinked || childCloud.model !== null;

  useEffect(() => {
    const unsubSpeech = speechCoordinator.subscribe(setIsVoiceTesting);
    return () => {
      unsubSpeech();
    };
  }, []);

  const handleTestVoiceToggle = () => {
    if (isVoiceTesting) {
      stopSpeaking();
    } else {
      testVoice("Hello! I am your AI learning coach. Ready for today's learning quest?");
    }
  };

  const activeChild: LinkedStudent = useMemo(
    () =>
      children.find((c) => c.id === activeChildId) || {
        id: BROWSER_LEARNER_ID,
        name: "Current learner",
        email: "",
        gradeLevel: "This browser",
        avatarUrl: "",
        lastActive: Date.now(),
        subjects: [],
      },
    [children, activeChildId]
  );

  // Today's Study Tasks for Child
  const todayStr = todayISO();
  const childTodayTasks = useMemo(
    () => displayStudyPlan.filter((task) => task.date === todayStr),
    [displayStudyPlan, todayStr]
  );
  const completedTasksCount = childTodayTasks.filter((t) => t.completed).length;

  // Real Practice Accuracy & Stats
  const practiceMetrics = useMemo(() => {
    if (displayPracticeSessions.length === 0) {
      return { totalQuestions: 0, correctAnswers: 0, accuracy: 0 };
    }
    const totalQuestions = displayPracticeSessions.reduce(
      (acc, s) => acc + s.totalQuestions,
      0
    );
    const correctAnswers = displayPracticeSessions.reduce(
      (acc, s) => acc + s.correctAnswers,
      0
    );
    const accuracy =
      totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    return { totalQuestions, correctAnswers, accuracy };
  }, [displayPracticeSessions]);

  // Topic Mastery Categorization from Real Notebooks
  const topicBreakdown = useMemo(() => {
    const onTrack: { name: string; subject: string }[] = [];
    const needsReview: { name: string; subject: string }[] = [];
    const inProgress: { name: string; subject: string }[] = [];

    displayNotebooks.forEach((nb) => {
      const status = getNotebookTopicStatus(nb, displayPracticeSessions);
      if (status === "on_track") {
        onTrack.push({ name: nb.name, subject: nb.subject });
      } else if (status === "needs_revisiting") {
        needsReview.push({ name: nb.name, subject: nb.subject });
      } else {
        inProgress.push({ name: nb.name, subject: nb.subject });
      }
    });

    return { onTrack, needsReview, inProgress };
  }, [displayNotebooks, displayPracticeSessions]);

  // AI Discussion Starters dynamically generated from the student's actual notebooks & practice
  const parentConversationStarters = useMemo(() => {
    const starters: {
      topic: string;
      subject: string;
      prompt: string;
      context: string;
    }[] = [];

    displayNotebooks.forEach((nb) => {
      const userQuestions = (nb.messages || [])
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
  }, [displayNotebooks]);

  const openLinkModal = (tab: "enter" | "issue" | "manage") => {
    setLinkModalTab(tab);
    setLinkActionError(null);
    setLinkSuccessName(null);
    setIsLinkModalOpen(true);
  };

  const handleClaimCode = async () => {
    if (!currentUserId || linkActionBusy) return;
    const code = linkCodeInput.trim().toUpperCase();
    if (!code) {
      setLinkActionError("Enter the link code from the learner's device.");
      return;
    }
    setLinkActionBusy(true);
    setLinkActionError(null);
    setLinkSuccessName(null);
    try {
      const result = await linkChildByCode(currentUserId, code);
      if (result.success && result.studentId) {
        setLinkSuccessName(result.studentName || "Learner");
        setLinkCodeInput("");
        await refreshChildren(result.studentId);
      } else {
        setLinkActionError(result.error || "Could not link the learner account.");
      }
    } catch {
      setLinkActionError("Could not link the learner account. Check your connection and try again.");
    } finally {
      setLinkActionBusy(false);
    }
  };

  const handleIssueCode = async () => {
    if (!currentUserId || linkActionBusy) return;
    setLinkActionBusy(true);
    setLinkActionError(null);
    try {
      const code = await generateParentLinkCode(currentUserId, issuedName.trim() || "Learner");
      setIssuedCode(code);
    } catch (error: any) {
      setLinkActionError(error?.message || "Could not issue a link code right now.");
    } finally {
      setLinkActionBusy(false);
    }
  };

  const handleCopyCode = async () => {
    if (!issuedCode) return;
    try {
      await navigator.clipboard.writeText(issuedCode);
    } catch {
      // clipboard unavailable; the code stays visible for manual entry
    }
  };

  const handleUnlink = async (studentId: string) => {
    if (!currentUserId || unlinkingId) return;
    setUnlinkingId(studentId);
    setLinkActionError(null);
    try {
      await unlinkChild(currentUserId, studentId);
      if (activeChildId === studentId) setActiveChildId(BROWSER_LEARNER_ID);
      await refreshChildren();
    } catch {
      setLinkActionError("Could not remove the link. Check your connection and try again.");
    } finally {
      setUnlinkingId(null);
    }
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
            Your learner’s progress
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
            A clear view of recent learning, progress, and what to try next.
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
              <option value={BROWSER_LEARNER_ID}>Current learner · this browser</option>
              {childrenLoading && <option disabled>Loading linked learners…</option>}
              {children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name} • {child.gradeLevel || "Linked account"}
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
            onClick={() => openLinkModal(children.length > 0 ? "manage" : "enter")}
            className="p-2.5 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700/80 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            title="Link and manage family learner accounts"
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
              <span className={`w-2.5 h-2.5 rounded-full ${isViewingLinked ? "bg-sky-400" : "bg-emerald-400 animate-pulse"}`} />
              <span className={`text-xs font-bold uppercase tracking-wider ${isViewingLinked ? "text-sky-300" : "text-emerald-400"}`}>
                {isViewingLinked ? "Linked account" : "This browser"}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 font-medium">
              {isViewingLinked ? (
                childLoading
                  ? `Loading ${activeChild?.name || "learner"}'s live progress…`
                  : hasLinkedCloudData
                    ? `${activeChild?.gradeLevel || "Student"} • Live from ${activeChild?.name || "learner"}'s signed-in account`
                    : `${activeChild?.name || "Learner"} hasn't synced learning data yet — it appears after they sign in and practice.`
              ) : (
                <>Local learner profile • {displayNotebooks.length} subject {displayNotebooks.length === 1 ? "notebook" : "notebooks"}</>
              )}
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
                Conversation starters
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 font-medium">
                {parentConversationStarters.some((starter) => starter.context.startsWith("Explored inquiry:")) ? `Conversation prompts based on ${isViewingLinked ? `${activeChild.name}'s saved tutor questions` : `this browser profile's saved tutor questions for ${activeChild.name}`}.` : "Gentle conversation prompts for reflecting on learning together."}
              </p>
            </div>
          </div>
          <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 shadow-sm">
            Based on learning
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
      {displayModel.recommendedNext[0] && (() => {
        const nextAction = displayModel.recommendedNext[0];
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

      {/* Family settings: only expose controls that work in this build. */}
      <section className="rounded-3xl border border-slate-700/80 bg-slate-900/90 p-5 shadow-xl sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-black text-white sm:text-lg">Family settings</h3>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-400">
              Progress shown here is from this browser profile unless a linked learner is selected above. Enforced screen-time or bedtime limits are not available yet.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button type="button" onClick={handleTestVoiceToggle} className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700">
              {isVoiceTesting ? "Stop voice" : "Preview voice"}
            </button>
            <button type="button" onClick={() => setIsVoiceModalOpen(true)} className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-500">
              Voice settings
            </button>
          </div>
        </div>
      </section>

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
              Progress from saved practice
            </span>
          </div>

          <div className="space-y-3">
            {displayNotebooks.slice(0, 5).map((nb) => {
              const status = getNotebookTopicStatus(nb, displayPracticeSessions);
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
            // Real computed mastery from the displayed model (linked cloud or this browser)
            const pct = isViewingLinked
              ? (() => {
                  if (domainNodes.length === 0) return 0;
                  let totalEvidence = 0;
                  domainNodes.forEach((node) => {
                    const record = displayModel.skillMastery[node.id];
                    if (record) totalEvidence += record.tier === "master" ? 100 : record.evidenceScore;
                  });
                  return Math.min(100, Math.round(totalEvidence / domainNodes.length));
                })()
              : computeDomainMastery(domain.id);
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
        {displayModel.recommendedNext.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 text-amber-200">
              <AlertCircle size={18} className="text-amber-400 shrink-0" />
              <span>
                <strong>Smart Recommendation ({displayModel.recommendedNext[0].badge}):</strong>{" "}
                {displayModel.recommendedNext[0].title} — {displayModel.recommendedNext[0].reason}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onNavigate(displayModel.recommendedNext[0].targetTab)}
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
        {displayModel.recentEvents.length > 0 && (
          <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
              <span>Recent Learning Milestones ({displayModel.recentEvents.length} Recorded)</span>
              <span className="text-emerald-400">{displayModel.strongSkills.length} Strong Skills</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
              {displayModel.recentEvents.slice(0, 6).map((evt) => (
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
              View saved learning activity for this browser's learner, or link family accounts above to follow each learner's live progress. Weekly email reports are not available yet.
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

      {/* Real family account linking: claim, issue, and manage verified links. */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="link-learner-title">
          <div className="max-h-[92vh] w-full max-w-md space-y-5 overflow-y-auto rounded-3xl border border-slate-700 bg-[#0f172a] p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <LinkIcon className="h-5 w-5 text-emerald-400" />
                <h3 id="link-learner-title" className="text-lg font-black text-white">Family accounts</h3>
              </div>
              <button onClick={() => setIsLinkModalOpen(false)} aria-label="Close family account linking" className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"><X size={18}/></button>
            </div>

            {!currentUserId ? (
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[.06] p-4">
                <p className="text-sm font-bold text-amber-100">Sign in to link family accounts.</p>
                <p className="mt-2 text-xs leading-5 text-slate-300">Family linking connects verified signed-in accounts. Sign in with Google, then return here to enter a code or show one from the learner&apos;s device.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-950/70 p-1 text-xs font-bold">
                  {([["enter", "Enter code"], ["issue", "Get a code"], ["manage", `Linked (${children.length})`]] as const).map(([tab, label]) => (
                    <button
                      key={tab}
                      onClick={() => { setLinkModalTab(tab); setLinkActionError(null); setLinkSuccessName(null); }}
                      className={`rounded-lg px-2 py-2 transition-colors ${linkModalTab === tab ? "bg-emerald-500/20 text-emerald-200" : "text-slate-400 hover:text-white"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {linkModalTab === "enter" && (
                  <div className="space-y-3">
                    <p className="text-xs leading-5 text-slate-300">On the learner&apos;s signed-in device, open Family accounts → Get a code. Enter that code here to connect their live progress to this dashboard.</p>
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-400">Link code</span>
                      <input
                        value={linkCodeInput}
                        onChange={(event) => setLinkCodeInput(event.target.value.toUpperCase())}
                        onKeyDown={(event) => { if (event.key === "Enter") handleClaimCode(); }}
                        placeholder="P-XXXXXX"
                        maxLength={16}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-center text-lg font-black tracking-[0.2em] text-white placeholder:text-slate-600 focus:border-emerald-400 focus:outline-none"
                      />
                    </label>
                    <button
                      onClick={handleClaimCode}
                      disabled={linkActionBusy}
                      className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"
                    >
                      {linkActionBusy ? "Linking…" : "Link learner account"}
                    </button>
                    <p className="text-[11px] leading-4 text-slate-500">Codes expire after 24 hours and work exactly once. Each learner needs their own code.</p>
                  </div>
                )}

                {linkModalTab === "issue" && (
                  <div className="space-y-3">
                    <p className="text-xs leading-5 text-slate-300">Generate a code for the learner signed in on <strong>this device right now</strong>. Read it to the parent, who enters it under Family accounts → Enter code.</p>
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-400">Learner name (shown to the parent)</span>
                      <input
                        value={issuedName}
                        onChange={(event) => setIssuedName(event.target.value)}
                        placeholder="e.g. Amahle"
                        maxLength={60}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm font-bold text-white placeholder:text-slate-600 focus:border-emerald-400 focus:outline-none"
                      />
                    </label>
                    {!issuedCode ? (
                      <button
                        onClick={handleIssueCode}
                        disabled={linkActionBusy}
                        className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"
                      >
                        {linkActionBusy ? "Generating…" : "Generate one-time code"}
                      </button>
                    ) : (
                      <div className="space-y-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/[.07] p-4 text-center">
                        <p className="text-3xl font-black tracking-[0.15em] text-white">{issuedCode}</p>
                        <p className="text-[11px] text-slate-400">Expires in 24 hours · one-time use</p>
                        <div className="flex gap-2">
                          <button onClick={handleCopyCode} className="flex-1 rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold text-white hover:bg-slate-700">Copy code</button>
                          <button onClick={() => setIssuedCode(null)} className="flex-1 rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700">New code</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {linkModalTab === "manage" && (
                  <div className="space-y-2">
                    {childrenLoading && <p className="text-xs text-slate-400">Loading linked learners…</p>}
                    {!childrenLoading && children.length === 0 && (
                      <p className="text-xs leading-5 text-slate-300">No learners linked yet. Use Enter code to connect a learner&apos;s account.</p>
                    )}
                    {children.map((child) => (
                      <div key={child.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-white">{child.name}</p>
                          <p className="text-[11px] text-slate-400">{child.gradeLevel || "Linked account"}</p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <button
                            onClick={() => { setActiveChildId(child.id); setIsLinkModalOpen(false); }}
                            className="rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-200 hover:bg-emerald-500/30"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleUnlink(child.id)}
                            disabled={unlinkingId === child.id}
                            className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-rose-500/30 hover:text-rose-200 disabled:opacity-50"
                          >
                            {unlinkingId === child.id ? "Removing…" : "Unlink"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {linkSuccessName && (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[.08] p-3 text-xs font-bold text-emerald-200">
                    ✓ {linkSuccessName} is now linked. Select them above to see live progress.
                  </div>
                )}
                {linkActionError && (
                  <div className="rounded-2xl border border-rose-500/30 bg-rose-500/[.08] p-3 text-xs font-bold text-rose-200">
                    {linkActionError}
                  </div>
                )}
              </>
            )}

            <button onClick={() => setIsLinkModalOpen(false)} className="w-full rounded-xl bg-slate-800 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-700">Done</button>
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

