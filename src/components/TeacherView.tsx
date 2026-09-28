import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Users,
  Send,
  FileText,
  Paperclip,
  CheckCircle,
  Clock,
  ExternalLink,
  Plus,
  BookOpen,
  MessageSquare,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  ChevronDown,
  UserCheck,
  ShieldCheck,
  KeyRound,
  Layers,
  Brain,
  Award,
  Target,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { getLearnerSummary, getLearnerModel } from "../utils/pedagogicalEngine";
import { CURRICULUM_DOMAINS, CURRICULUM_SKILL_NODES } from "../data/curriculumUniverse";
import { fetchEnrolledStudentsMastery } from "../firebase";
import {
  Classroom,
  ClassAssignment,
  AssignmentSubmission,
  ClassResource,
  ClassMessage,
  Notebook,
  PracticeSession,
} from "../types";
import { User } from "firebase/auth";

interface TeacherViewProps {
  currentUser?: User | null;
  classrooms: Classroom[];
  activeClassId: string;
  onSelectClass: (classId: string) => void;
  onCreateClass: (name: string, subject: string, customCode?: string) => Promise<void>;
  onJoinClass: (code: string) => Promise<void>;
  classAssignments: ClassAssignment[];
  submissions: Record<string, AssignmentSubmission>; // Keyed by assignmentId or studentId
  allClassSubmissions?: AssignmentSubmission[];
  resources: ClassResource[];
  messages: ClassMessage[];
  notebooks: Notebook[];
  practiceSessions: PracticeSession[];
  onSendMessage: (text: string, attachedNotebookId?: string) => void;
  onSubmitAssignment: (assignmentId: string, submissionText: string, note?: string) => void;
  onReviewAssignment: (
    assignmentId: string,
    studentId: string,
    grade: string,
    feedback: string
  ) => void;
  onCreateAssignment: (asgn: Omit<ClassAssignment, "id" | "classId" | "teacherId" | "createdAt">) => void;
  onAddResource: (res: Omit<ClassResource, "id" | "classId" | "teacherId" | "createdAt">) => void;
}

export function TeacherView({
  currentUser,
  classrooms,
  activeClassId,
  onSelectClass,
  onCreateClass,
  onJoinClass,
  classAssignments,
  submissions,
  allClassSubmissions = [],
  resources,
  messages,
  notebooks,
  practiceSessions,
  onSendMessage,
  onSubmitAssignment,
  onReviewAssignment,
  onCreateAssignment,
  onAddResource,
}: TeacherViewProps) {
  const activeClass = classrooms.find((c) => c.id === activeClassId) || classrooms[0];

  // Role toggle: detect if current signed-in user is the class teacher
  const isActualTeacher = currentUser && activeClass && activeClass.teacherId === currentUser.uid;
  const [role, setRole] = useState<"student" | "teacher">(() => (isActualTeacher ? "teacher" : "student"));

  const [activeTab, setActiveTab] = useState<"assignments" | "messages" | "resources" | "roster" | "mastery">(
    "assignments"
  );

  // Classroom Modals & Join states
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [joinError, setJoinError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newClassSubject, setNewClassSubject] = useState("Mathematics");
  const [newClassCode, setNewClassCode] = useState("");
  const [isCreatingClass, setIsCreatingClass] = useState(false);

  // Copied Join Code Feedback
  const [hasCopiedCode, setHasCopiedCode] = useState(false);

  // Student messaging & Attach Notebook state
  const [msgInput, setMsgInput] = useState("");
  const [selectedNotebookToAttach, setSelectedNotebookToAttach] = useState<string>("");
  const [showAttachModal, setShowAttachModal] = useState(false);

  // Student assignment submission modal
  const [submittingAssignmentId, setSubmittingAssignmentId] = useState<string | null>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [studentNote, setStudentNote] = useState("");

  // Teacher assignment review modal
  const [reviewingSubmission, setReviewingSubmission] = useState<{
    assignment: ClassAssignment;
    submission: AssignmentSubmission;
  } | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [gradeInput, setGradeInput] = useState("A");

  // Teacher create assignment modal
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [newAsgnTitle, setNewAsgnTitle] = useState("");
  const [newAsgnSubject, setNewAsgnSubject] = useState(activeClass?.subject || "Mathematics");
  const [newAsgnDesc, setNewAsgnDesc] = useState("");
  const [newAsgnDueDate, setNewAsgnDueDate] = useState("2026-09-28");

  // Teacher add resource modal
  const [showAddResource, setShowAddResource] = useState(false);
  const [resTitle, setResTitle] = useState("");
  const [resSubject, setResSubject] = useState(activeClass?.subject || "Mathematics");
  const [resType, setResType] = useState<"note" | "link">("link");
  const [resContent, setResContent] = useState("");
  const [resUrl, setResUrl] = useState("");

  // Standards Mastery student filter and multi-student data states
  const [selectedMasteryStudentId, setSelectedMasteryStudentId] = useState<string>("class-aggregate");
  const [enrolledMasteryMap, setEnrolledMasteryMap] = useState<Record<string, any>>({});
  const [isLoadingMastery, setIsLoadingMastery] = useState<boolean>(false);

  // Fetch real enrolled students' mastery models whenever classroom or roster changes
  useEffect(() => {
    if (!activeClass) return;
    const studentIds = activeClass.studentIds || [];
    if (studentIds.length === 0) {
      setEnrolledMasteryMap({});
      return;
    }

    let isMounted = true;
    setIsLoadingMastery(true);

    fetchEnrolledStudentsMastery(activeClass.id, studentIds)
      .then((map) => {
        if (isMounted) {
          setEnrolledMasteryMap(map || {});
          setIsLoadingMastery(false);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch enrolled students mastery:", err);
        if (isMounted) setIsLoadingMastery(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeClass?.id, activeClass?.studentIds, activeTab]);

  // Copy join code helper
  const handleCopyCode = () => {
    if (!activeClass) return;
    navigator.clipboard.writeText(activeClass.joinCode);
    setHasCopiedCode(true);
    setTimeout(() => setHasCopiedCode(false), 2500);
  };

  // Join Class Handler
  const handleJoinClassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;
    setIsJoining(true);
    setJoinError(null);
    try {
      await onJoinClass(joinCodeInput.trim());
      setJoinCodeInput("");
      setShowJoinModal(false);
    } catch (err: any) {
      setJoinError(err.message || "Failed to join class. Verify the Join Code.");
    } finally {
      setIsJoining(false);
    }
  };

  // Create Class Handler
  const handleCreateClassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    setIsCreatingClass(true);
    try {
      await onCreateClass(newClassName.trim(), newClassSubject.trim(), newClassCode.trim() || undefined);
      setNewClassName("");
      setNewClassCode("");
      setShowCreateClassModal(false);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsCreatingClass(false);
    }
  };

  // Send Message Handler
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim()) return;
    onSendMessage(msgInput.trim(), selectedNotebookToAttach || undefined);
    setMsgInput("");
    setSelectedNotebookToAttach("");
    setShowAttachModal(false);
  };

  // Submit Homework Handler
  const handleCompleteSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingAssignmentId || !submissionText.trim()) return;
    onSubmitAssignment(submittingAssignmentId, submissionText.trim(), studentNote.trim() || undefined);
    setSubmittingAssignmentId(null);
    setSubmissionText("");
    setStudentNote("");
  };

  // Review & Grade Handler
  const handleCompleteReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingSubmission || !feedbackText.trim()) return;
    onReviewAssignment(
      reviewingSubmission.assignment.id,
      reviewingSubmission.submission.studentId,
      gradeInput.trim(),
      feedbackText.trim()
    );
    setReviewingSubmission(null);
    setFeedbackText("");
  };

  // Create Assignment Handler
  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsgnTitle.trim()) return;
    onCreateAssignment({
      subject: newAsgnSubject.trim(),
      title: newAsgnTitle.trim(),
      description: newAsgnDesc.trim(),
      dueDate: newAsgnDueDate,
    });
    setNewAsgnTitle("");
    setNewAsgnDesc("");
    setShowCreateAssignment(false);
  };

  // Add Resource Handler
  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim()) return;
    onAddResource({
      subject: resSubject.trim(),
      title: resTitle.trim(),
      type: resType,
      content: resContent.trim(),
      url: resType === "link" ? resUrl.trim() : undefined,
    });
    setResTitle("");
    setResContent("");
    setResUrl("");
    setShowAddResource(false);
  };

  // Student perspective submission lookups
  const studentUid = currentUser?.uid || "mock-student-id";
  const getStudentSubmission = (asgnId: string) => {
    return (
      submissions[asgnId] ||
      allClassSubmissions.find((s) => s.assignmentId === asgnId && s.studentId === studentUid)
    );
  };

  // Submissions count for badges
  const pendingTeacherReviews = allClassSubmissions.filter((s) => s.status === "submitted").length;
  const pendingStudentAssignments = classAssignments.filter((a) => !getStudentSubmission(a.id)).length;
  const unreadMessagesCount = messages.filter((m) => !m.read && m.senderRole !== role).length;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-6xl mx-auto w-full">
      {/* Top Classroom Bar with Class Selector, Join Code, and Actions */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-rose-500/20 flex-shrink-0">
            <GraduationCap size={24} />
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <label htmlFor="class-selector" className="sr-only">Active Classroom</label>
              <select
                id="class-selector"
                value={activeClass?.id || ""}
                onChange={(e) => onSelectClass(e.target.value)}
                className="bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer shadow-inner"
              >
                {classrooms.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                    {c.name} ({c.subject})
                  </option>
                ))}
              </select>

              {/* Verified Instructor Badge if user is teacher */}
              {isActualTeacher ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm">
                  <ShieldCheck size={13} />
                  Class Instructor
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-sm">
                  <UserCheck size={13} />
                  Enrolled Student
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 font-medium">
              Instructor: <span className="text-slate-200 font-bold">{activeClass?.teacherName || "Instructor"}</span>{" "}
              • {activeClass?.studentIds?.length || 1} Enrolled Students
            </p>
          </div>
        </div>

        {/* Join Code Display & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {activeClass && (
            <div
              className="flex items-center gap-2.5 bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 shadow-inner"
              title="Class Join Code. Share with students to enroll."
            >
              <div className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-bold">Join Code</div>
              <code className="text-xs sm:text-sm font-mono font-bold text-amber-400 tracking-wider">
                {activeClass.joinCode}
              </code>
              <button
                onClick={handleCopyCode}
                className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-white cursor-pointer"
                title="Copy Join Code"
              >
                {hasCopiedCode ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
          )}

          <button
            onClick={() => setShowJoinModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all border border-slate-700 shadow-sm cursor-pointer"
          >
            <KeyRound size={15} className="text-indigo-400" />
            <span>Join Class</span>
          </button>

          <button
            onClick={() => setShowCreateClassModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            <Plus size={15} />
            <span>New Class</span>
          </button>
        </div>
      </div>

      {/* Header & Role Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>{activeClass?.name || "Academic Classroom"}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
            Real-time assignment submissions, grading review, curriculum resources, and office hours
          </p>
        </div>

        {/* Role Switcher (Enables testing both student submission & teacher grading on any session) */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start sm:self-auto shadow-inner">
          <button
            onClick={() => setRole("student")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              role === "student"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Student View
          </button>
          <button
            onClick={() => setRole("teacher")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              role === "teacher"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Teacher Portal
          </button>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab("assignments")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "assignments"
              ? "bg-slate-800 text-white border border-slate-700 shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-slate-800/40"
          }`}
        >
          <FileText size={15} />
          <span>Assignments ({classAssignments.length})</span>
          {role === "student" && pendingStudentAssignments > 0 && (
            <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold">
              {pendingStudentAssignments} due
            </span>
          )}
          {role === "teacher" && pendingTeacherReviews > 0 && (
            <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-amber-500 text-black font-bold">
              {pendingTeacherReviews} to review
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("messages")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "messages"
              ? "bg-slate-800 text-white border border-slate-700 shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-slate-800/40"
          }`}
        >
          <MessageSquare size={15} />
          <span>Office Hours Thread</span>
          {unreadMessagesCount > 0 && (
            <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-indigo-500 text-white font-bold">
              {unreadMessagesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("resources")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "resources"
              ? "bg-slate-800 text-white border border-slate-700 shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-slate-800/40"
          }`}
        >
          <BookOpen size={15} />
          <span>Course Handouts ({resources.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("roster")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "roster"
              ? "bg-slate-800 text-white border border-slate-700 shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-slate-800/40"
          }`}
        >
          <Users size={15} />
          <span>Class Roster</span>
        </button>

        <button
          onClick={() => setActiveTab("mastery")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "mastery"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-slate-800/40"
          }`}
        >
          <Brain size={15} />
          <span>Standards &amp; Mastery Intelligence</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: ASSIGNMENTS (Shared Multi-User Homework Pipeline) */}
      {/* ========================================================= */}
      {activeTab === "assignments" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">Coursework & Problem Sets</h2>
              <p className="text-xs text-white/40">
                {role === "student"
                  ? "Submit solutions and review returned instructor grades and feedback"
                  : "Post new assignments and grade enrolled student submissions in real-time"}
              </p>
            </div>

            {role === "teacher" && (
              <button
                onClick={() => setShowCreateAssignment(true)}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/30"
              >
                <Plus size={15} />
                <span>Post New Assignment</span>
              </button>
            )}
          </div>

          {classAssignments.length === 0 ? (
            <div className="p-8 sm:p-12 text-center rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-xl space-y-3">
              <FileText size={36} className="mx-auto text-slate-600" />
              <p className="text-sm sm:text-base font-bold text-slate-300">No assignments posted for this class yet.</p>
              {role === "teacher" && (
                <button
                  onClick={() => setShowCreateAssignment(true)}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-black shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  Create First Assignment
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {classAssignments.map((asgn) => {
                const mySubmission = getStudentSubmission(asgn.id);
                // In teacher mode, gather all submissions for this assignment
                const asgnSubmissions = allClassSubmissions.filter((s) => s.assignmentId === asgn.id);

                return (
                  <div
                    key={asgn.id}
                    className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-700/80 flex flex-col space-y-5 hover:border-slate-600 transition-all shadow-xl"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-xs font-black uppercase tracking-wider text-slate-300 px-2.5 py-1 rounded bg-slate-800 border border-slate-700">
                            {asgn.subject}
                          </span>
                          <span className="text-xs sm:text-sm text-slate-400 flex items-center gap-1 font-medium">
                            <Clock size={13} />
                            Due: {asgn.dueDate}
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-white">{asgn.title}</h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl font-medium">{asgn.description}</p>
                      </div>

                      {/* Student submission action badge */}
                      {role === "student" && (
                        <div>
                          {mySubmission ? (
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl border ${
                                mySubmission.status === "reviewed"
                                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-sm"
                                  : "bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-sm"
                              }`}
                            >
                              <CheckCircle size={15} />
                              {mySubmission.status === "reviewed"
                                ? `Graded: ${mySubmission.grade || "Reviewed"}`
                                : "Submitted (Pending Review)"}
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                setSubmittingAssignmentId(asgn.id);
                                setSubmissionText("");
                                setStudentNote("");
                              }}
                              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all shadow-md shadow-rose-600/30 cursor-pointer active:scale-95"
                            >
                              <FileText size={15} />
                              <span>Submit Work</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Student View: Show submitted work and teacher review feedback */}
                    {role === "student" && mySubmission && (
                      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs sm:text-sm shadow-inner">
                        <div className="flex items-center justify-between text-slate-400 font-medium">
                          <span>Your Submission:</span>
                          <span>{new Date(mySubmission.submittedAt).toLocaleString()}</span>
                        </div>
                        <p className="text-white bg-slate-900 p-4 rounded-xl font-mono text-xs sm:text-sm whitespace-pre-wrap border border-slate-800 leading-relaxed">
                          {mySubmission.studentSubmission}
                        </p>
                        {mySubmission.studentNote && (
                          <p className="text-slate-400 italic font-medium">Note: "{mySubmission.studentNote}"</p>
                        )}

                        {/* If reviewed, show grade and instructor comments */}
                        {mySubmission.status === "reviewed" && (
                          <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 space-y-2 shadow-sm">
                            <div className="flex items-center justify-between">
                              <span className="font-bold flex items-center gap-1.5 text-white text-xs sm:text-sm">
                                <Sparkles size={15} className="text-emerald-400" />
                                Teacher Feedback & Grade: {mySubmission.grade}
                              </span>
                              {mySubmission.reviewedAt && (
                                <span className="text-xs text-emerald-400/80 font-medium">
                                  {new Date(mySubmission.reviewedAt).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm leading-relaxed text-emerald-100 whitespace-pre-wrap font-medium">
                              {mySubmission.teacherFeedback}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Teacher View: Submissions Pipeline */}
                    {role === "teacher" && (
                      <div className="pt-4 border-t border-slate-800 space-y-3">
                        <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
                          <span className="font-black text-slate-300 uppercase tracking-wider text-xs">
                            Student Submissions ({asgnSubmissions.length})
                          </span>
                          <span className="text-slate-400 text-xs">
                            {asgnSubmissions.filter((s) => s.status === "reviewed").length} Graded /{" "}
                            {asgnSubmissions.filter((s) => s.status === "submitted").length} Pending
                          </span>
                        </div>

                        {asgnSubmissions.length === 0 ? (
                          <p className="text-xs sm:text-sm text-slate-500 italic font-medium">No students have submitted this assignment yet.</p>
                        ) : (
                          <div className="divide-y divide-slate-800 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner">
                            {asgnSubmissions.map((sub) => (
                              <div
                                key={sub.studentId}
                                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm"
                              >
                                <div>
                                  <div className="flex items-center gap-2.5">
                                    <span className="font-bold text-white">{sub.studentName}</span>
                                    <span
                                      className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                                        sub.status === "reviewed"
                                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                      }`}
                                    >
                                      {sub.status === "reviewed" ? `Grade: ${sub.grade}` : "Needs Review"}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-400 mt-1 font-medium">
                                    Submitted {new Date(sub.submittedAt).toLocaleTimeString()} • Preview: "
                                    {sub.studentSubmission.slice(0, 70)}..."
                                  </p>
                                </div>

                                <button
                                  onClick={() => {
                                    setReviewingSubmission({ assignment: asgn, submission: sub });
                                    setGradeInput(sub.grade || "A");
                                    setFeedbackText(sub.teacherFeedback || "");
                                  }}
                                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold self-start sm:self-auto transition-all shadow-sm cursor-pointer"
                                >
                                  {sub.status === "reviewed" ? "Edit Grade / Feedback" : "Review & Grade"}
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: OFFICE HOURS MESSAGES (Two-Way Student-Teacher) */}
      {/* ========================================================= */}
      {activeTab === "messages" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-700/80 space-y-5 shadow-xl flex flex-col h-[650px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-shrink-0">
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white">Office Hours Communication</h2>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                Direct academic inquiry with Instructor {activeClass?.teacherName || "Faculty"}
              </p>
            </div>

            {selectedNotebookToAttach && (
              <span className="text-xs text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20 flex items-center gap-2 font-bold">
                <Paperclip size={13} />
                <span>Context Attached</span>
                <button onClick={() => setSelectedNotebookToAttach("")} className="hover:text-white cursor-pointer ml-1">
                  ✕
                </button>
              </span>
            )}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-3">
                <MessageSquare size={36} />
                <p className="text-sm font-medium">No office hours messages yet. Send a question below!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderRole === role;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                        {msg.senderName || (msg.senderRole === "teacher" ? "Instructor" : "Student")}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    <div
                      className={`p-4 sm:p-5 rounded-3xl max-w-xl text-xs sm:text-sm leading-relaxed ${
                        isMe
                          ? "bg-indigo-600 text-white rounded-br-none shadow-lg shadow-indigo-600/20 font-medium"
                          : "bg-slate-950 text-slate-100 rounded-bl-none border border-slate-800 font-medium shadow-inner"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {/* Attached Notebook Context Display */}
                      {msg.attachedNotebookContext && (
                        <div className="mt-3 pt-3 border-t border-white/20 text-xs space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-amber-300">
                            <Paperclip size={13} />
                            <span>Attached: {msg.attachedNotebookContext.notebookName}</span>
                          </div>
                          <p className="opacity-90 italic line-clamp-2">
                            "{msg.attachedNotebookContext.lastAIResponse}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 flex-shrink-0">
            <div className="flex items-center gap-3">
              {role === "student" && (
                <button
                  type="button"
                  onClick={() => setShowAttachModal(true)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    selectedNotebookToAttach
                      ? "bg-indigo-600/30 border-indigo-400 text-indigo-300"
                      : "bg-slate-950 border-slate-700/80 text-slate-400 hover:text-white hover:border-slate-600"
                  }`}
                  title="Attach Study Notebook Context"
                >
                  <Paperclip size={18} />
                </button>
              )}

              <input
                type="text"
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                placeholder={
                  role === "student"
                    ? `Ask ${activeClass?.teacherName || "Professor"} a question or request feedback...`
                    : "Send student guidance or office hours reply..."
                }
                className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />

              <button
                type="submit"
                disabled={!msgInput.trim()}
                className="p-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: CLASS RESOURCES (Handouts, Links, Lecture Notes) */}
      {/* ========================================================= */}
      {activeTab === "resources" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white">Course Materials & Handouts</h2>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">Verified references, problem sets, formulas, and syllabus links</p>
            </div>

            {role === "teacher" && (
              <button
                onClick={() => setShowAddResource(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
              >
                <Plus size={15} />
                <span>Add Class Resource</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {resources.map((res) => (
              <div
                key={res.id}
                className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-700/80 flex flex-col justify-between space-y-4 shadow-xl hover:border-slate-600 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-300 uppercase tracking-wider px-2.5 py-1 rounded bg-slate-800 border border-slate-700">
                      {res.subject}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {res.type === "link" ? "External Reference" : "Lecture Note"}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-white leading-snug">{res.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">{res.content}</p>
                </div>

                {res.url && (
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm text-indigo-400 hover:text-indigo-300 font-bold pt-3 border-t border-slate-800"
                  >
                    <span>Open Reference Resource</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: CLASS ROSTER (Enrolled Students & Progress) */}
      {/* ========================================================= */}
      {activeTab === "roster" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-700/80 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white">Class Roster & Academic Status</h2>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                Enrolled students in {activeClass?.name} • Join Code:{" "}
                <code className="text-amber-400 font-mono font-bold">{activeClass?.joinCode}</code>
              </p>
            </div>
            <button
              onClick={handleCopyCode}
              className="text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white flex items-center gap-2 cursor-pointer self-start sm:self-auto transition-all shadow-sm"
            >
              <Copy size={14} />
              <span>Share Code</span>
            </button>
          </div>

          <div className="divide-y divide-slate-800 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner">
            {/* Display Enrolled Students */}
            {(activeClass?.studentIds || ["mock-student-id"]).map((stuId, index) => {
              const profile = activeClass?.studentProfiles?.[stuId] || {
                displayName: `Student ${index + 1} (${stuId.slice(0, 6)})`,
                email: `${stuId.slice(0, 8)}@portal.edu`,
                enrolledAt: activeClass?.createdAt || Date.now(),
              };

              const studentSubmissions = allClassSubmissions.filter((s) => s.studentId === stuId);
              const reviewedCount = studentSubmissions.filter((s) => s.status === "reviewed").length;

              return (
                <div
                  key={stuId}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-indigo-500/20">
                      {profile.displayName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-white text-sm sm:text-base">{profile.displayName}</span>
                      <p className="text-xs text-slate-400 mt-0.5 font-medium">
                        {profile.email} • Enrolled {new Date(profile.enrolledAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-bold">
                      {studentSubmissions.length} Submissions ({reviewedCount} Graded)
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Active
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: STANDARDS & MASTERY INTELLIGENCE (Learner Brain) */}
      {/* ========================================================= */}
      {activeTab === "mastery" && (() => {
        const enrolledStudents = activeClass?.studentIds || [];
        const isAggregate = selectedMasteryStudentId === "class-aggregate";

        // Filter authorized enrolled students' profiles fetched from Firestore
        const enrolledProfilesWithData = enrolledStudents
          .map((sid) => ({ sid, model: enrolledMasteryMap[sid] }))
          .filter((item) => !!item.model);

        // Individual student profile
        const individualProfile = !isAggregate ? enrolledMasteryMap[selectedMasteryStudentId] : null;

        // Calculate aggregate statistics across enrolled students
        const totalSkills = CURRICULUM_SKILL_NODES.length;
        const studentsRepresentedCount = enrolledProfilesWithData.length;
        const totalClassLearningEvents = enrolledProfilesWithData.reduce(
          (acc, p) => acc + (p.model.totalLearningEventsCount || 0),
          0
        );

        // Calculate Domain Mastery Averages
        const aggregateDomainMastery: Record<string, number> = {};
        CURRICULUM_DOMAINS.forEach((domain) => {
          const domainNodes = CURRICULUM_SKILL_NODES.filter((n) => n.domain === domain.id);
          if (studentsRepresentedCount === 0 || domainNodes.length === 0) {
            aggregateDomainMastery[domain.id] = 0;
            return;
          }
          const sumDomainPcts = enrolledProfilesWithData.reduce((acc, { model }) => {
            let totalEvidence = 0;
            domainNodes.forEach((node) => {
              const rec = model.skillMastery?.[node.id];
              totalEvidence += rec?.tier === "master" ? 100 : (rec?.evidenceScore || 0);
            });
            const pct = Math.min(100, Math.round(totalEvidence / domainNodes.length));
            return acc + pct;
          }, 0);
          aggregateDomainMastery[domain.id] = Math.round(sumDomainPcts / studentsRepresentedCount);
        });

        // Average standards mastered per active student
        const avgMasteredCount = studentsRepresentedCount > 0
          ? Math.round(
              enrolledProfilesWithData.reduce((acc, { model }) => {
                const count = Object.values(model.skillMastery || {}).filter(
                  (s: any) => s.tier === "master"
                ).length;
                return acc + count;
              }, 0) / studentsRepresentedCount
            )
          : 0;

        // Calculate Skill Hotspots (Weaknesses and Strengths) across enrolled students
        const skillAnalytics = CURRICULUM_SKILL_NODES.map((node) => {
          let totalStruggles = 0;
          let totalScore = 0;
          let attemptCount = 0;
          let masteredCount = 0;

          enrolledProfilesWithData.forEach(({ model }) => {
            const rec = model.skillMastery?.[node.id];
            if (rec && rec.totalAttempts > 0) {
              attemptCount += 1;
              totalStruggles += rec.strugglesCount || 0;
              totalScore += rec.evidenceScore || 0;
              if (rec.tier === "master") masteredCount += 1;
            }
          });

          return {
            node,
            totalStruggles,
            avgScore: attemptCount > 0 ? Math.round(totalScore / attemptCount) : 0,
            attemptCount,
            masteredCount,
          };
        });

        const classWeaknessSkills = [...skillAnalytics]
          .filter((s) => s.totalStruggles > 0 || (s.attemptCount > 0 && s.avgScore < 60))
          .sort((a, b) => b.totalStruggles - a.totalStruggles || a.avgScore - b.avgScore)
          .slice(0, 4);

        const classStrongestSkills = [...skillAnalytics]
          .filter((s) => s.masteredCount > 0 || s.avgScore >= 75)
          .sort((a, b) => b.masteredCount - a.masteredCount || b.avgScore - a.avgScore)
          .slice(0, 4);

        // Students needing review
        const studentsNeedingReview = enrolledProfilesWithData.filter(({ model }) => {
          const weakCount = Number(model.weakSkills?.length) || 0;
          const strugglesTotal: number = (Object.values(model.skillMastery || {}) as any[]).reduce(
            (acc: number, s: any): number => acc + (Number(s?.strugglesCount) || 0),
            0
          );
          return weakCount > 0 || strugglesTotal >= 2;
        });

        // Aggregated class recent learning events
        const aggregatedClassEvents = enrolledProfilesWithData
          .flatMap(({ sid, model }) =>
            (model.recentEvents || []).map((evt: any) => ({
              ...evt,
              enrolledStudentId: sid,
            }))
          )
          .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
          .slice(0, 20);

        return (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-700/80 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white flex items-center gap-2.5">
                  <Brain size={20} className="text-indigo-400" />
                  Standards Mastery & Diagnostic Analytics
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  {isAggregate
                    ? `Authorized Classroom Analytics for "${activeClass?.name || "Classroom"}" (${enrolledStudents.length} Enrolled Scholars)`
                    : `Individual Scholar Diagnostic: ${selectedMasteryStudentId}`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {isLoadingMastery && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold">
                    <RefreshCw size={12} className="animate-spin text-indigo-400" />
                    <span>Fetching Roster Telemetry...</span>
                  </div>
                )}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                  <Target size={14} />
                  <span>
                    {isAggregate
                      ? `${avgMasteredCount} of ${totalSkills} Standards Mastered (Avg across ${studentsRepresentedCount} active)`
                      : individualProfile
                      ? `${Object.values(individualProfile.skillMastery || {}).filter((s: any) => s.tier === "master").length} of ${totalSkills} Standards Mastered`
                      : `0 of ${totalSkills} Standards Mastered (Awaiting sync)`}
                  </span>
                </div>
              </div>
            </div>

            {/* Student Filter Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">Analytics Scope:</span>
                <button
                  type="button"
                  onClick={() => setSelectedMasteryStudentId("class-aggregate")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                    isAggregate
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  🏫 Class Aggregate Overview
                </button>
              </div>

              {enrolledStudents.length > 0 ? (
                <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
                  <span className="text-slate-500 font-semibold text-[11px]">Enrolled:</span>
                  {enrolledStudents.map((stuId) => (
                    <button
                      key={stuId}
                      type="button"
                      onClick={() => setSelectedMasteryStudentId(stuId)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        selectedMasteryStudentId === stuId
                          ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                          : "bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700"
                      }`}
                    >
                      👤 {stuId === "mock-student-id" ? "Student Scholar" : stuId.slice(0, 10)}
                    </button>
                  ))}
                </div>
              ) : (
                <span className="text-slate-500 text-xs italic">No enrolled students in this classroom</span>
              )}
            </div>

            {/* ==================================================== */}
            {/* VIEW A: CLASS AGGREGATE OVERVIEW                     */}
            {/* ==================================================== */}
            {isAggregate && (
              <>
                {enrolledStudents.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-4">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <Users size={28} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">No Scholars Enrolled Yet</h3>
                      <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
                        Share your unique Class Join Code with students or parents. Once scholars enroll and complete exercises, continuous standard mastery diagnostics will aggregate here.
                      </p>
                    </div>
                    {activeClass && (
                      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-amber-400">
                        <span>Join Code: {activeClass.joinCode}</span>
                        <button
                          onClick={handleCopyCode}
                          className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Class Roster Diagnostic KPI Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Roster Coverage</span>
                        <p className="text-sm font-black text-white">{studentsRepresentedCount} of {enrolledStudents.length} Active</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Class Telemetry Volume</span>
                        <p className="text-sm font-black text-indigo-400">{totalClassLearningEvents} Events Logged</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Needs Targeted Review</span>
                        <p className={`text-sm font-black ${studentsNeedingReview.length > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                          {studentsNeedingReview.length} Scholars Flagged
                        </p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Classroom Code</span>
                        <p className="text-sm font-black text-amber-400 font-mono">{activeClass?.joinCode || "N/A"}</p>
                      </div>
                    </div>

                    {/* Domain Mastery Grid (Class Averages) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {CURRICULUM_DOMAINS.map((domain) => {
                        const pct = aggregateDomainMastery[domain.id] || 0;
                        const domainNodes = CURRICULUM_SKILL_NODES.filter((n) => n.domain === domain.id);
                        return (
                          <div key={domain.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 shadow-inner">
                            <div className="flex items-center justify-between">
                              <span className="text-2xl">{domain.emoji}</span>
                              <span className="text-xs font-black text-emerald-400">{pct}% Class Avg</span>
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-white truncate">{domain.label}</h4>
                              <p className="text-[11px] text-slate-400 mt-0.5">{domainNodes.length} Standards Aligned</p>
                            </div>
                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Class Hotspots: Weakness Interventions & Strongest Competencies */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Weakness Hotspots */}
                      <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-black text-rose-300 uppercase tracking-wider">
                          <AlertTriangle size={14} className="text-rose-400" />
                          <span>Class Weakness Hotspots (Needs Targeted Lesson)</span>
                        </div>
                        {classWeaknessSkills.length > 0 ? (
                          <div className="space-y-2 pt-1">
                            {classWeaknessSkills.map(({ node, totalStruggles, avgScore }) => (
                              <div key={node.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                                <div className="min-w-0 pr-2">
                                  <p className="font-bold text-white truncate">{node.title}</p>
                                  <p className="text-[11px] text-slate-400 mt-0.5">{node.standardCode} • Domain: {node.domain}</p>
                                </div>
                                <div className="text-right shrink-0">
                                  <span className="text-rose-400 font-bold text-[11px]">{totalStruggles} Struggles</span>
                                  <p className="text-[10px] text-slate-500">Score: {avgScore}%</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic">No recurring struggle hotspots detected across active scholars.</p>
                        )}
                      </div>

                      {/* Class Strongest Competencies */}
                      <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-black text-emerald-300 uppercase tracking-wider">
                          <TrendingUp size={14} className="text-emerald-400" />
                          <span>Class Competencies (High Mastery Standards)</span>
                        </div>
                        {classStrongestSkills.length > 0 ? (
                          <div className="space-y-2 pt-1">
                            {classStrongestSkills.map(({ node, masteredCount, avgScore }) => (
                              <div key={node.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                                <div className="min-w-0 pr-2">
                                  <p className="font-bold text-white truncate">{node.title}</p>
                                  <p className="text-[11px] text-slate-400 mt-0.5">{node.standardCode} • Domain: {node.domain}</p>
                                </div>
                                <div className="text-right shrink-0">
                                  <span className="text-emerald-400 font-bold text-[11px]">{masteredCount} Mastered</span>
                                  <p className="text-[10px] text-slate-500">Avg: {avgScore}%</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic">No mastery evidence recorded yet.</p>
                        )}
                      </div>
                    </div>

                    {/* Class-wide Recent Learning Audit Feed */}
                    <div className="space-y-3 pt-2">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Classroom Activity Telemetry Audit ({aggregatedClassEvents.length} Events Logged)
                      </h3>
                      <div className="divide-y divide-slate-800 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner max-h-64 overflow-y-auto">
                        {aggregatedClassEvents.length > 0 ? (
                          aggregatedClassEvents.map((evt) => (
                            <div key={evt.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-900/50 transition-colors">
                              <div className="min-w-0 pr-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                                    👤 {evt.enrolledStudentId?.slice(0, 8) || "Student"}
                                  </span>
                                  <p className="font-bold text-white truncate">{evt.activityTitle}</p>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-0.5 ml-0.5">
                                  {evt.activityType} • Domain: {evt.domain} • Difficulty: {evt.difficulty}
                                </p>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {new Date(evt.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                                  evt.result === "mastered"
                                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                    : evt.result === "success"
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                    : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                }`}>
                                  {evt.result}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-6 text-center text-slate-500 text-xs italic">
                            No learning activity logged for enrolled students in this classroom yet.
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* ==================================================== */}
            {/* VIEW B: INDIVIDUAL STUDENT DIAGNOSTIC                */}
            {/* ==================================================== */}
            {!isAggregate && (
              <>
                {!individualProfile ? (
                  <div className="p-8 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                      <GraduationCap size={24} />
                    </div>
                    <h3 className="text-sm font-bold text-white">No Telemetry Recorded for Student: {selectedMasteryStudentId}</h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                      This enrolled student has not completed any learning sessions or synced their profile yet. Diagnostic intelligence will populate automatically once they submit assignments or practice.
                    </p>
                  </div>
                ) : (() => {
                  const studentModel = individualProfile;
                  const masteredCount = Object.values(studentModel.skillMastery || {}).filter((s: any) => s.tier === "master").length;
                  const recentEvts = studentModel.recentEvents || [];

                  return (
                    <div className="space-y-6">
                      {/* Individual Domain Mastery Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {CURRICULUM_DOMAINS.map((domain) => {
                          const domainNodes = CURRICULUM_SKILL_NODES.filter((n) => n.domain === domain.id);
                          let evidenceSum = 0;
                          domainNodes.forEach((node) => {
                            const rec = studentModel.skillMastery?.[node.id];
                            evidenceSum += rec?.tier === "master" ? 100 : (rec?.evidenceScore || 0);
                          });
                          const pct = domainNodes.length ? Math.min(100, Math.round(evidenceSum / domainNodes.length)) : 0;

                          return (
                            <div key={domain.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 shadow-inner">
                              <div className="flex items-center justify-between">
                                <span className="text-2xl">{domain.emoji}</span>
                                <span className="text-xs font-black text-emerald-400">{pct}% Mastered</span>
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-white truncate">{domain.label}</h4>
                                <p className="text-[11px] text-slate-400 mt-0.5">{domainNodes.length} Standards Aligned</p>
                              </div>
                              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Weak Skills & Identified Interventions */}
                      {studentModel.weakSkills && studentModel.weakSkills.length > 0 && (
                        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-2">
                          <div className="flex items-center gap-2 text-xs font-black text-amber-300 uppercase tracking-wider">
                            <AlertTriangle size={14} className="text-amber-400" />
                            <span>Scholar Concept Reinforcement Targets</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {studentModel.weakSkills.map((skId: string) => {
                              const node = CURRICULUM_SKILL_NODES.find((n) => n.id === skId);
                              return (
                                <div key={skId} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                                  <p className="font-bold text-white truncate">{node?.title || skId}</p>
                                  <p className="text-[10px] text-slate-400 mt-0.5">Domain: {node?.domain || "General"} • Standard: {node?.standardCode || skId}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Recent Learning Events Audit Trail */}
                      <div className="space-y-3 pt-2">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Scholar Real-Time Activity Feed ({recentEvts.length} Events)
                        </h3>
                        <div className="divide-y divide-slate-800 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner max-h-64 overflow-y-auto">
                          {recentEvts.length > 0 ? (
                            recentEvts.map((evt: any) => (
                              <div key={evt.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-900/50 transition-colors">
                                <div className="min-w-0 pr-2">
                                  <p className="font-bold text-white truncate">{evt.activityTitle}</p>
                                  <p className="text-[11px] text-slate-400 mt-0.5">
                                    {evt.activityType} • {evt.domain} • Difficulty: {evt.difficulty}
                                  </p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {new Date(evt.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                  </span>
                                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                                    evt.result === "mastered"
                                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                      : evt.result === "success"
                                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                      : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                  }`}>
                                    {evt.result}
                                  </span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-6 text-center text-slate-500 text-xs italic">
                              No recent learning events recorded for this scholar yet.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        );
      })()}

      {/* ========================================================= */}
      {/* MODAL: JOIN CLASSROOM VIA CODE */}
      {/* ========================================================= */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-black text-white flex items-center gap-2.5">
                <KeyRound size={20} className="text-indigo-400" />
                Join a Classroom
              </h3>
              <button onClick={() => setShowJoinModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
              Enter the unique 6-8 character Join Code provided by your instructor (e.g. CALC101 or CS201).
            </p>

            <form onSubmit={handleJoinClassSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Class Join Code</label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. CALC101"
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-center font-mono font-black text-xl text-amber-400 uppercase tracking-widest placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {joinError && (
                <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs sm:text-sm font-medium flex items-center gap-2.5">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{joinError}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isJoining || !joinCodeInput.trim()}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-black transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  {isJoining ? "Joining..." : "Enroll in Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREATE CLASSROOM */}
      {/* ========================================================= */}
      {showCreateClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-black text-white flex items-center gap-2.5">
                <GraduationCap size={20} className="text-indigo-400" />
                Create New Classroom
              </h3>
              <button onClick={() => setShowCreateClassModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClassSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Class Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AP Chemistry - Period 3"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Subject</label>
                <select
                  value={newClassSubject}
                  onChange={(e) => setNewClassSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm font-bold text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                >
                  <option value="Mathematics" className="bg-slate-900">Mathematics</option>
                  <option value="Computer Science" className="bg-slate-900">Computer Science</option>
                  <option value="Physics" className="bg-slate-900">Physics</option>
                  <option value="Chemistry" className="bg-slate-900">Chemistry</option>
                  <option value="Biology" className="bg-slate-900">Biology</option>
                  <option value="Humanities" className="bg-slate-900">Humanities</option>
                  <option value="History" className="bg-slate-900">History</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Custom Join Code (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. CHEM301 (or leave blank to auto-generate)"
                  value={newClassCode}
                  onChange={(e) => setNewClassCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white font-mono uppercase tracking-wider placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateClassModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingClass || !newClassName.trim()}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-black transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  {isCreatingClass ? "Creating..." : "Create Classroom"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: SUBMIT ASSIGNMENT (Student) */}
      {/* ========================================================= */}
      {submittingAssignmentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-black text-white flex items-center gap-2.5">
                <FileText size={20} className="text-rose-400" />
                Submit Assignment Solution
              </h3>
              <button onClick={() => setSubmittingAssignmentId(null)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCompleteSubmission} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Your Submission / Derivations</label>
                <textarea
                  required
                  rows={5}
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Enter your step-by-step problem solution, answers, or derivations..."
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-mono leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Optional Note to Instructor</label>
                <input
                  type="text"
                  value={studentNote}
                  onChange={(e) => setStudentNote(e.target.value)}
                  placeholder="e.g. Please check my sign chart derivation on step 3"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSubmittingAssignmentId(null)}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!submissionText.trim()}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-black transition-all shadow-md shadow-rose-600/30 cursor-pointer"
                >
                  Turn In Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: TEACHER REVIEW & GRADE SUBMISSION */}
      {/* ========================================================= */}
      {reviewingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-black text-white">Grade Student Submission</h3>
                <p className="text-xs text-slate-400 font-medium">{reviewingSubmission.submission.studentName}</p>
              </div>
              <button onClick={() => setReviewingSubmission(null)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs sm:text-sm max-h-48 overflow-y-auto shadow-inner">
              <span className="font-bold text-slate-400 block text-xs uppercase tracking-wider">
                Student Work:
              </span>
              <p className="text-white whitespace-pre-wrap font-mono text-xs sm:text-sm leading-relaxed">
                {reviewingSubmission.submission.studentSubmission}
              </p>
              {reviewingSubmission.submission.studentNote && (
                <p className="text-slate-400 italic mt-2 font-medium">
                  Student Note: "{reviewingSubmission.submission.studentNote}"
                </p>
              )}
            </div>

            <form onSubmit={handleCompleteReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Grade / Score</label>
                <input
                  type="text"
                  required
                  value={gradeInput}
                  onChange={(e) => setGradeInput(e.target.value)}
                  placeholder="e.g. 95% or A"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Instructor Feedback</label>
                <textarea
                  required
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Provide constructive feedback, notations, and encouragement..."
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setReviewingSubmission(null)}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!feedbackText.trim()}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-black transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  Publish Grade & Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREATE ASSIGNMENT (Teacher) */}
      {/* ========================================================= */}
      {showCreateAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-black text-white">Post New Assignment</h3>
              <button onClick={() => setShowCreateAssignment(false)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Calculus Problem Set 4: Taylor Series"
                  value={newAsgnTitle}
                  onChange={(e) => setNewAsgnTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Subject</label>
                  <input
                    type="text"
                    required
                    value={newAsgnSubject}
                    onChange={(e) => setNewAsgnSubject(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newAsgnDueDate}
                    onChange={(e) => setNewAsgnDueDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Description & Questions</label>
                <textarea
                  required
                  rows={4}
                  placeholder="State problem instructions, questions, and expectations..."
                  value={newAsgnDesc}
                  onChange={(e) => setNewAsgnDesc(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateAssignment(false)}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newAsgnTitle.trim()}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-black transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  Publish to Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD RESOURCE (Teacher) */}
      {/* ========================================================= */}
      {showAddResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-black text-white">Add Class Material / Handout</h3>
              <button onClick={() => setShowAddResource(false)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddResource} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Formula Sheet PDF or Seminar Notes"
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Subject</label>
                  <input
                    type="text"
                    required
                    value={resSubject}
                    onChange={(e) => setResSubject(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Type</label>
                  <select
                    value={resType}
                    onChange={(e) => setResType(e.target.value as any)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm font-bold text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                  >
                    <option value="link" className="bg-slate-900">External URL / Document</option>
                    <option value="note" className="bg-slate-900">Lecture Note / Text</option>
                  </select>
                </div>
              </div>

              {resType === "link" && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Resource URL</label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={resUrl}
                    onChange={(e) => setResUrl(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Description / Summary</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Key concepts or reading guidelines..."
                  value={resContent}
                  onChange={(e) => setResContent(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddResource(false)}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!resTitle.trim()}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-black transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  Add Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ATTACH NOTEBOOK CONTEXT (Student -> Teacher) */}
      {/* ========================================================= */}
      {showAttachModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-black text-white flex items-center gap-2.5">
                <Paperclip size={20} className="text-indigo-400" />
                Attach Study Notebook Context
              </h3>
              <button onClick={() => setShowAttachModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
              Select which notebook to attach to your inquiry. The instructor will receive the latest AI explanation so
              they have full context without you retyping formulas.
            </p>

            <div className="space-y-2.5 max-h-60 overflow-y-auto custom-scrollbar">
              {notebooks.map((nb) => (
                <button
                  key={nb.id}
                  type="button"
                  onClick={() => {
                    setSelectedNotebookToAttach(nb.id);
                    setShowAttachModal(false);
                  }}
                  className="w-full p-4 rounded-2xl border border-slate-800 hover:border-indigo-500/80 bg-slate-950 hover:bg-slate-800/60 text-left text-xs sm:text-sm transition-all cursor-pointer shadow-sm group"
                >
                  <span className="text-xs font-bold text-slate-400 group-hover:text-indigo-400 uppercase tracking-wider block">{nb.subject}</span>
                  <span className="font-bold text-white block mt-1">{nb.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
