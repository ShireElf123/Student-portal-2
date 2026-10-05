/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense, useState, useEffect, useRef } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import type * as FirestoreSdk from "firebase/firestore";
import {
  AcademicMode,
  NavigationTab,
  Notebook,
  PracticeSession,
  StudyPlanItem,
  Classroom,
  ClassAssignment,
  AssignmentSubmission,
  ClassResource,
  ClassMessage,
  UserRole,
  LearningStage,
} from "./types";
import { INITIAL_NOTEBOOKS } from "./data/defaultNotebooks";

import { NavigationSidebar } from "./components/NavigationSidebar";
import { MobileNavigation } from "./components/MobileNavigation";
import { HomeDashboard } from "./components/HomeDashboard";
import { GamificationHeader } from "./components/GamificationHeader";
import { AgeStageModal } from "./components/AgeStageModal";
import { SubscriptionModal } from "./components/SubscriptionModal";
import { StartupGateway } from "./components/StartupGateway";
import { ParentalGateModal } from "./components/ParentalGateModal";
import { VoiceSettingsModal } from "./components/VoiceSettingsModal";

// Route-sized bundles keep the first workspace load fast; specialist studios load on demand.
const ChatInterface = lazy(() => import("./components/ChatInterface").then((module) => ({ default: module.ChatInterface })));
const SubjectsView = lazy(() => import("./components/SubjectsView").then((module) => ({ default: module.SubjectsView })));
const StudyPlanView = lazy(() => import("./components/StudyPlanView").then((module) => ({ default: module.StudyPlanView })));
const NotebooksView = lazy(() => import("./components/NotebooksView").then((module) => ({ default: module.NotebooksView })));
const PracticeView = lazy(() => import("./components/PracticeView").then((module) => ({ default: module.PracticeView })));
const ProgressView = lazy(() => import("./components/ProgressView").then((module) => ({ default: module.ProgressView })));
const TeacherView = lazy(() => import("./components/TeacherView").then((module) => ({ default: module.TeacherView })));
const ParentView = lazy(() => import("./components/ParentView").then((module) => ({ default: module.ParentView })));
const TutorHubView = lazy(() => import("./components/TutorHubView").then((module) => ({ default: module.TutorHubView })));
const ToddlerWorldView = lazy(() => import("./components/ToddlerWorldView").then((module) => ({ default: module.ToddlerWorldView })));
const PrimaryHomeworkView = lazy(() => import("./components/PrimaryHomeworkView").then((module) => ({ default: module.PrimaryHomeworkView })));
const PrimaryLearningLab = lazy(() => import("./components/PrimaryLearningLab").then((module) => ({ default: module.PrimaryLearningLab })));
const LearningOdysseyMap = lazy(() => import("./components/LearningOdysseyMap").then((module) => ({ default: module.LearningOdysseyMap })));
const GuidedAssessmentBridge = lazy(() => import("./components/GuidedAssessmentBridge").then((module) => ({ default: module.GuidedAssessmentBridge })));
import { soundEffects } from "./utils/soundEffects";
import { todayISO } from "./utils/dateUtils";
import {
  auth, signInWithGoogle, logOut, handleFirestoreError, OperationType,
  syncUserProfile, updateUserRole, fetchUserProfile, saveNotebookToCloud, syncAllNotebooksToCloud,
  deleteNotebookFromCloud, saveStudyPlanItemToCloud, deleteStudyPlanItemFromCloud,
  savePracticeSessionToCloud, createClassroom, joinClassroomByCode,
  createClassAssignment, submitClassAssignment, gradeClassSubmission,
  addClassResource, sendClassMessage,
} from "./firebaseCore";
import {
  GUEST_LEARNER_ID,
  getActiveAccountId,
  migrateLegacyAccountData,
  readScopedJSON,
  writeScopedJSON,
} from "./utils/accountStorage";
import {
  setActiveLearnerId,
  saveLearnerModel,
  syncLearnerBrainWithCloud,
  recordLearningEvent,
} from "./utils/learnerBrain";
import { resolveActivityDefinition, resolveSkillForActivity } from "./data/activitySkillRegistry";
import { CURRICULUM_SKILL_NODES } from "./data/curriculumUniverse";
import type { RecommendedAction } from "./utils/learnerBrain";
import type { DailyRouteItem } from "./utils/dailyLearningRoute";

// Storage keys
const NOTEBOOKS_KEY = "my_student_portal_notebooks_v3";
const STUDY_PLAN_KEY = "my_student_portal_study_plan_v3";
const PRACTICE_KEY = "my_student_portal_practice_v3";
const USER_ROLE_KEY = "my_student_portal_user_role";

const STARTER_NOTEBOOK_IDS = new Set([
  "math-primary-3",
  "reading-phonics-2",
  "stem-discovery",
  "flashcards-primary",
  "teach-planning",
]);

/** Loads the notebook partition for `accountId` (defaults to active scope). */
function loadScopedNotebooks(accountId: string = getActiveAccountId()): Notebook[] {
  const saved = readScopedJSON<unknown>(NOTEBOOKS_KEY, null, accountId);
  if (Array.isArray(saved)) {
    return (saved as Notebook[]).filter(
      (notebook) =>
        notebook &&
        !(STARTER_NOTEBOOK_IDS.has(notebook.id) &&
          notebook.messages?.length === 1 &&
          notebook.messages[0]?.id?.startsWith("msg-init-"))
    );
  }
  return [...INITIAL_NOTEBOOKS];
}

/** Loads the study-plan partition for `accountId` (defaults to active scope). */
function loadScopedStudyPlan(accountId: string = getActiveAccountId()): StudyPlanItem[] {
  const saved = readScopedJSON<unknown>(STUDY_PLAN_KEY, null, accountId);
  if (Array.isArray(saved)) {
    return (saved as StudyPlanItem[]).filter((task) => task && !task.id.startsWith("default-task-"));
  }
  return [];
}

/** Loads the practice-session partition for `accountId` (defaults to active scope). */
function loadScopedPracticeSessions(accountId: string = getActiveAccountId()): PracticeSession[] {
  const saved = readScopedJSON<unknown>(PRACTICE_KEY, null, accountId);
  if (Array.isArray(saved)) {
    return (saved as PracticeSession[]).filter((session) => session && !session.id.startsWith("prac-init-"));
  }
  return [];
}

const VALID_ROLES: UserRole[] = ["student", "parent", "teacher", "tutor"];

type LearningLaunchRequest = Pick<RecommendedAction, "activityId" | "experienceId" | "skillId" | "targetTab" | "targetId">;

type PendingLearningLaunch = LearningLaunchRequest & {
  nonce: number;
};

/** Loads the persisted role for `accountId` (defaults to active scope). */
function loadScopedRole(accountId: string = getActiveAccountId()): UserRole {
  const saved = readScopedJSON<unknown>(USER_ROLE_KEY, null, accountId);
  if (typeof saved === "string" && (VALID_ROLES as string[]).includes(saved)) {
    return saved as UserRole;
  }
  return "student";
}

export default function App() {
  const [learningStage, setLearningStage] = useState<LearningStage>(() => {
    try {
      const saved = localStorage.getItem("my_student_portal_learning_stage");
      if (saved && ["toddler", "primary", "educator"].includes(saved)) {
        return saved as LearningStage;
      }
    } catch {
      // ignore
    }
    return "primary";
  });

  const [activeTab, setActiveTab] = useState<NavigationTab>(() => {
    try {
      const stage = localStorage.getItem("my_student_portal_learning_stage");
      if (stage === "toddler") return "toddler";
      if (stage === "educator") return "parent";
      if (stage === "primary") return "homework";
    } catch {
      // ignore
    }
    return "homework";
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [cloudModule, setCloudModule] = useState<typeof import("./firebase") | null>(null);
  const [firestoreSdk, setFirestoreSdk] = useState<typeof FirestoreSdk | null>(null);

  // Primary Homework Desk is the default landing experience.
  // The workspace switcher is opened on-demand via the sidebar switcher or profile action,
  // so strangers and signed-in users land directly on their desk.
  const [isStartupGatewayOpen, setIsStartupGatewayOpen] = useState<boolean>(false);
  const [isParentalGateOpen, setIsParentalGateOpen] = useState<boolean>(false);
  const [pendingStageSwitch, setPendingStageSwitch] = useState<LearningStage | null>(null);

  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>("toddler-phonics-basics");

  const [userRole, setUserRole] = useState<UserRole>(() => loadScopedRole(getActiveAccountId()));
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState<boolean>(false);
  const [isAgeModalOpen, setIsAgeModalOpen] = useState<boolean>(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);

  const handleSelectLearningStage = (stage: LearningStage) => {
    setLearningStage(stage);
    try {
      localStorage.setItem("my_student_portal_learning_stage", stage);
      localStorage.setItem("my_student_portal_gateway_completed", "true");
    } catch {
      // ignore
    }
    if (stage === "toddler") {
      soundEffects.playStarSparkle();
      setActiveTab("toddler");
    } else if (stage === "primary") {
      soundEffects.playSuccessChime();
      setActiveTab("homework");
    } else if (stage === "educator") {
      soundEffects.playPop();
      if (userRole === "student") {
        setUserRole("parent");
      }
      setActiveTab("parent");
    }
    setIsStartupGatewayOpen(false);
  };

  const handleRequestExitToddler = (targetStage?: LearningStage) => {
    setPendingStageSwitch(targetStage || null);
    setIsParentalGateOpen(true);
  };

  const handleParentalGateSuccess = () => {
    if (pendingStageSwitch) {
      handleSelectLearningStage(pendingStageSwitch);
      setPendingStageSwitch(null);
    } else {
      setIsStartupGatewayOpen(true);
    }
  };

  const handleSelectRole = (newRole: UserRole) => {
    setUserRole(newRole);
    try {
      writeScopedJSON(USER_ROLE_KEY, newRole);
    } catch {
      // ignore
    }
    if (currentUser) {
      updateUserRole(currentUser.uid, newRole).catch(console.error);
    }
    if (newRole === "parent") {
      setActiveTab("parent");
    } else if (newRole === "tutor") {
      setActiveTab("tutor-hub");
    } else if (newRole === "teacher") {
      setActiveTab("teacher");
    } else if (newRole === "student" && (activeTab === "parent" || activeTab === "tutor-hub")) {
      setActiveTab("home");
    }
  };

  // 1. Notebooks State (partitioned per account; Fix #3: Multi-Notebook Cloud Persistence)
  const [notebooks, setNotebooks] = useState<Notebook[]>(() => loadScopedNotebooks(getActiveAccountId()));

  const [activeNotebookId, setActiveNotebookId] = useState<string>(() => {
    return notebooks[0]?.id || "";
  });

  // Fix #3: Persist and sync EVERY modified notebook to Firestore, not just the active one
  useEffect(() => {
    try {
      writeScopedJSON(NOTEBOOKS_KEY, notebooks);
      if (currentUser) {
        // Sync all updated notebooks to cloud
        notebooks.forEach((nb) => {
          saveNotebookToCloud(currentUser.uid, nb).catch(console.error);
        });
      }
    } catch (e) {
      console.warn("Error persisting notebooks", e);
    }
  }, [notebooks, currentUser]);

  // 2. Study Plan State (partitioned per account)
  const [studyPlan, setStudyPlan] = useState<StudyPlanItem[]>(() => loadScopedStudyPlan(getActiveAccountId()));

  useEffect(() => {
    try {
      writeScopedJSON(STUDY_PLAN_KEY, studyPlan);
    } catch (e) {
      console.warn("Error persisting study plan", e);
    }
  }, [studyPlan]);

  // 3. Practice Sessions State (partitioned per account)
  const [practiceSessions, setPracticeSessions] = useState<PracticeSession[]>(() => loadScopedPracticeSessions(getActiveAccountId()));

  useEffect(() => {
    try {
      writeScopedJSON(PRACTICE_KEY, practiceSessions);
    } catch (e) {
      console.warn("Error persisting practice sessions", e);
    }
  }, [practiceSessions]);

  // 4. TRUE MULTI-USER CLASSROOM STATE (Path B)
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  const [activeClassId, setActiveClassId] = useState<string>(() => classrooms[0]?.id || "");

  const activeClass = classrooms.find((c) => c.id === activeClassId) || classrooms[0];

  const [classAssignments, setClassAssignments] = useState<ClassAssignment[]>([]);
  const [classSubmissions, setClassSubmissions] = useState<AssignmentSubmission[]>([]);
  const [classResources, setClassResources] = useState<ClassResource[]>([]);
  const [classMessages, setClassMessages] = useState<ClassMessage[]>([]);

  // Auth Lifecycle Setup. On every sign-in, sign-out, or account switch the
  // previous account's UI state is cleared and reloaded from the new account's
  // partition before it can be displayed, persisted, or synced to the cloud.
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      const accountId = user?.uid || GUEST_LEARNER_ID;
      // Adopt legacy unscoped browser data at most once, for the first account.
      migrateLegacyAccountData(accountId);
      // Cascades into the storage scope so cached services (gamification,
      // toddler progress, AI usage, learner brain) reload from this account.
      setActiveLearnerId(accountId);

      // Immediately swap account-owned UI state to the new partition.
      const scopedNotebooks = loadScopedNotebooks(accountId);
      setNotebooks(scopedNotebooks);
      setActiveNotebookId(scopedNotebooks[0]?.id || "");
      setStudyPlan(loadScopedStudyPlan(accountId));
      setPracticeSessions(loadScopedPracticeSessions(accountId));
      setUserRole(loadScopedRole(accountId));
      setClassrooms([]);
      setActiveClassId("");
      setClassAssignments([]);
      setClassSubmissions([]);
      setClassResources([]);
      setClassMessages([]);
      setPracticePrefill({ subject: "", topic: "" });
      setPendingTutorQuery(undefined);
      setPendingLearningLaunch(null);
      setRecommendedSkillNodeId(undefined);

      setCurrentUser(user);
      if (user) {
        try {
          await syncUserProfile({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          });
          // Reload the persisted role (including Parent/Educator mode) so the
          // workspace matches the signed-in profile instead of a stale device value.
          const profile = await fetchUserProfile(user.uid);
          const cloudRole = profile?.role;
          if (cloudRole && ["student", "parent", "teacher", "tutor"].includes(cloudRole)) {
            setUserRole(cloudRole);
            writeScopedJSON(USER_ROLE_KEY, cloudRole, user.uid);
          }
          // Deterministic merge-safe synchronization that protects local offline progress
          await syncLearnerBrainWithCloud(user.uid);
        } catch (err) {
          console.error("Failed to sync user profile or learner model", err);
        }
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Load Firestore only after sign-in. Local learning stays light and usable
  // without downloading the database SDK before a cloud-backed session is needed.
  useEffect(() => {
    if (!currentUser) {
      setCloudModule(null);
      setFirestoreSdk(null);
      return;
    }
    let active = true;
    Promise.all([import("./firebase"), import("firebase/firestore")])
      .then(([cloud, firestore]) => {
        if (!active) return;
        setCloudModule(cloud);
        setFirestoreSdk(firestore);
      })
      .catch((error) => {
        console.error("Could not load cloud sync services", error);
        setIsSyncing(false);
      });
    return () => { active = false; };
  }, [currentUser]);

  // Firestore Real-Time Data Synchronization: Personal Partition (/users/{uid}/*)
  useEffect(() => {
    if (!currentUser || !cloudModule || !firestoreSdk) return;
    const { collection, onSnapshot, query, where } = firestoreSdk;
    const { db } = cloudModule;

    setIsSyncing(true);
    const uid = currentUser.uid;

    // 1. Notebooks listener & sync
    const nbPath = `users/${uid}/notebooks`;
    const unsubNb = onSnapshot(
      collection(db, "users", uid, "notebooks"),
      (snapshot) => {
        if (snapshot.empty) {
          // Seed cloud with existing local notebooks
          syncAllNotebooksToCloud(uid, notebooks);
        } else {
          const loaded: Notebook[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push(docSnap.data() as Notebook);
          });
          loaded.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setNotebooks(loaded);
        }
        setIsSyncing(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, nbPath);
      }
    );

    // 2. Study Plan listener
    const spPath = `users/${uid}/studyPlanItems`;
    const unsubSp = onSnapshot(
      collection(db, "users", uid, "studyPlanItems"),
      (snapshot) => {
        if (snapshot.empty) {
          loadScopedStudyPlan(uid).forEach((item) => saveStudyPlanItemToCloud(uid, item));
        } else {
          const loaded: StudyPlanItem[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push(docSnap.data() as StudyPlanItem);
          });
          setStudyPlan(loaded);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, spPath);
      }
    );

    // 3. Practice Sessions listener
    const psPath = `users/${uid}/practiceSessions`;
    const unsubPs = onSnapshot(
      collection(db, "users", uid, "practiceSessions"),
      (snapshot) => {
        if (snapshot.empty) {
          loadScopedPracticeSessions(uid).forEach((p) => savePracticeSessionToCloud(uid, p));
        } else {
          const loaded: PracticeSession[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push(docSnap.data() as PracticeSession);
          });
          loaded.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          setPracticeSessions(loaded);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, psPath);
      }
    );

    return () => {
      unsubNb();
      unsubSp();
      unsubPs();
    };
  }, [currentUser, cloudModule, firestoreSdk]);

  // Firestore Real-Time Data Synchronization: Classroom Partition (/classes/*)
  useEffect(() => {
    if (!currentUser || !cloudModule || !firestoreSdk) return;
    const { collection, onSnapshot, query, where } = firestoreSdk;
    const { db } = cloudModule;

    const uid = currentUser.uid;

    // Listen to classes where user is student or teacher
    const qTeacher = query(collection(db, "classes"), where("teacherId", "==", uid));
    const qStudent = query(collection(db, "classes"), where("studentIds", "array-contains", uid));

    let teacherClasses: Classroom[] = [];
    let studentClasses: Classroom[] = [];

    const updateCombined = () => {
      const classMap = new Map<string, Classroom>();
      teacherClasses.forEach((c) => classMap.set(c.id, c));
      studentClasses.forEach((c) => classMap.set(c.id, c));
      const combined = Array.from(classMap.values());

      setClassrooms(combined);
      if (!combined.some((c) => c.id === activeClassId)) {
        setActiveClassId(combined[0]?.id || "");
      }
    };

    const unsubTeacher = onSnapshot(qTeacher, (snap) => {
      teacherClasses = snap.docs.map((d) => d.data() as Classroom);
      updateCombined();
    });

    const unsubStudent = onSnapshot(qStudent, (snap) => {
      studentClasses = snap.docs.map((d) => d.data() as Classroom);
      updateCombined();
    });

    return () => {
      unsubTeacher();
      unsubStudent();
    };
  }, [currentUser, activeClassId, cloudModule, firestoreSdk]);

  // Real-Time Active Classroom Listeners (Assignments, Resources, Messages, Submissions)
  useEffect(() => {
    if (!currentUser) return;
    if (!activeClassId || !cloudModule || !firestoreSdk) {
      setClassAssignments([]);
      setClassResources([]);
      setClassMessages([]);
      return;
    }
    const { collection, onSnapshot } = firestoreSdk;
    const { db } = cloudModule;

    // 1. Listen to class assignments
    const unsubAsgns = onSnapshot(
      collection(db, "classes", activeClassId, "assignments"),
      (snapshot) => {
        const asgns = snapshot.docs.map((d) => d.data() as ClassAssignment);
        asgns.sort((a, b) => b.createdAt - a.createdAt);
        setClassAssignments(asgns);
      },
      (err) => handleFirestoreError(err, OperationType.GET, `classes/${activeClassId}/assignments`)
    );

    // 2. Listen to class resources
    const unsubResources = onSnapshot(
      collection(db, "classes", activeClassId, "resources"),
      (snapshot) => {
        const res = snapshot.docs.map((d) => d.data() as ClassResource);
        res.sort((a, b) => b.createdAt - a.createdAt);
        setClassResources(res);
      },
      (err) => handleFirestoreError(err, OperationType.GET, `classes/${activeClassId}/resources`)
    );

    // 3. Listen to class office hours messages
    const unsubMessages = onSnapshot(
      collection(db, "classes", activeClassId, "messages"),
      (snapshot) => {
        const msgs = snapshot.docs.map((d) => d.data() as ClassMessage);
        msgs.sort((a, b) => a.timestamp - b.timestamp);
        setClassMessages(msgs);
      },
      (err) => handleFirestoreError(err, OperationType.GET, `classes/${activeClassId}/messages`)
    );

    return () => {
      unsubAsgns();
      unsubResources();
      unsubMessages();
    };
  }, [currentUser, activeClassId, cloudModule, firestoreSdk]);

  // Listen to Submissions for each class assignment
  useEffect(() => {
    if (!currentUser || !activeClassId || !cloudModule || !firestoreSdk || classAssignments.length === 0) {
      setClassSubmissions([]);
      return;
    }
    const { collection, onSnapshot } = firestoreSdk;
    const { db } = cloudModule;
    setClassSubmissions([]);

    const unsubs = classAssignments.map((asgn) => {
      return onSnapshot(
        collection(db, "classes", activeClassId, "assignments", asgn.id, "submissions"),
        (snapshot) => {
          const subs = snapshot.docs.map((d) => d.data() as AssignmentSubmission);
          setClassSubmissions((prev) => {
            const others = prev.filter((s) => s.assignmentId !== asgn.id);
            return [...others, ...subs];
          });
        },
        (err) =>
          handleFirestoreError(
            err,
            OperationType.GET,
            `classes/${activeClassId}/assignments/${asgn.id}/submissions`
          )
      );
    });

    return () => {
      unsubs.forEach((u) => u());
    };
  }, [currentUser, activeClassId, classAssignments, cloudModule, firestoreSdk]);

  // Query & Practice pre-fill states for inter-tab navigation
  const [pendingTutorQuery, setPendingTutorQuery] = useState<string | undefined>(undefined);
  const [practicePrefill, setPracticePrefill] = useState<{ subject: string; topic: string }>({
    subject: "",
    topic: "",
  });
  const [recommendedSkillNodeId, setRecommendedSkillNodeId] = useState<string | undefined>();
  const [pendingLearningLaunch, setPendingLearningLaunch] = useState<PendingLearningLaunch | null>(null);

  useEffect(() => {
    if (pendingLearningLaunch && activeTab !== pendingLearningLaunch.targetTab) {
      setPendingLearningLaunch(null);
    }
  }, [activeTab, pendingLearningLaunch?.targetTab]);

  // Action handlers
  const handleAskTutor = (queryText: string) => {
    setPendingTutorQuery(queryText);
    setActiveTab("tutor");
  };

  const handleSendTutorAction = (notebookId: string, prompt: string) => {
    setActiveNotebookId(notebookId);
    setPendingTutorQuery(prompt);
    setActiveTab("tutor");
  };

  const handleStartPracticeForNotebook = (subject: string, topic: string) => {
    setPracticePrefill({ subject, topic });
    setPendingLearningLaunch(null);
    setActiveTab("practice");
  };

  const handleLearningLaunch = (request: LearningLaunchRequest) => {
    const activity = resolveActivityDefinition(request.activityId);
    if (activity.experienceId !== request.experienceId || activity.launch.route !== request.targetTab ||
      activity.launch.targetId !== request.targetId || !activity.skillIds.includes(request.skillId)) {
      throw new Error(`Learning launch does not match registered activity ${request.activityId}`);
    }
    const skill = CURRICULUM_SKILL_NODES.find((node) => node.id === request.skillId);
    if (!skill) throw new Error(`Learning launch references unknown curriculum skill ${request.skillId}`);

    setPendingLearningLaunch({ ...request, nonce: Date.now() });
    setRecommendedSkillNodeId(request.targetTab === "odyssey" ? request.skillId : undefined);
    if (request.targetTab === "practice") {
      const subject = skill.domain === "reading" ? "Reading" : skill.domain === "science" ? "Science" : skill.domain === "logic" ? "Logic" : "Mathematics";
      setPracticePrefill({ subject, topic: skill.title });
    }
    setActiveTab(request.targetTab);
  };

  const handleToggleTask = (taskId: string) => {
    setStudyPlan((prev) => {
      const updated = prev.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      if (currentUser) {
        const item = updated.find((t) => t.id === taskId);
        if (item) saveStudyPlanItemToCloud(currentUser.uid, item).catch(console.error);
      }
      return updated;
    });
  };

  const handleAddTask = (task: StudyPlanItem) => {
    setStudyPlan((prev) => [task, ...prev]);
    if (currentUser) {
      saveStudyPlanItemToCloud(currentUser.uid, task).catch(console.error);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setStudyPlan((prev) => prev.filter((t) => t.id !== taskId));
    if (currentUser) {
      deleteStudyPlanItemFromCloud(currentUser.uid, taskId).catch(console.error);
    }
  };

  const handleSavePracticeSession = (session: PracticeSession) => {
    setPracticeSessions((prev) => [session, ...prev]);
    if (currentUser) {
      savePracticeSessionToCloud(currentUser.uid, session).catch(console.error);
    }
  };

  // MULTI-USER CLASSROOM HANDLERS
  const handleCreateClass = async (name: string, subject: string, customCode?: string) => {
    if (currentUser) {
      const newClass = await createClassroom(
        {
          uid: currentUser.uid,
          displayName: currentUser.displayName || "Instructor",
          email: currentUser.email,
        },
        name,
        subject,
        customCode
      );
      setClassrooms((prev) => [newClass, ...prev]);
      setActiveClassId(newClass.id);
    } else {
      // Local fallback for quick preview
      const code = (customCode || name.slice(0, 4).toUpperCase() + Math.floor(100 + Math.random() * 900)).trim();
      const newClass: Classroom = {
        id: `class-${Date.now()}`,
        name,
        subject,
        joinCode: code,
        teacherId: "local-teacher",
        teacherName: "Local teacher",
        teacherEmail: "",
        studentIds: [],
        createdAt: Date.now(),
      };
      setClassrooms((prev) => [newClass, ...prev]);
      setActiveClassId(newClass.id);
    }
  };

  const handleJoinClass = async (code: string) => {
    const formattedCode = code.trim().toUpperCase();
    if (currentUser) {
      const joinedClass = await joinClassroomByCode(
        {
          uid: currentUser.uid,
          displayName: currentUser.displayName || "Student",
          email: currentUser.email,
        },
        formattedCode
      );
      setClassrooms((prev) => {
        if (prev.some((c) => c.id === joinedClass.id)) return prev;
        return [joinedClass, ...prev];
      });
      setActiveClassId(joinedClass.id);
    } else {
      // Offline fallback: join a class already created in this browser profile.
      const found = classrooms.find((c) => c.joinCode.toUpperCase() === formattedCode);
      if (!found) {
        throw new Error(`No classroom found with Join Code "${formattedCode}". Check the code with your teacher.`);
      }
      setActiveClassId(found.id);
    }
  };

  const handleCreateClassAssignment = (
    asgn: Omit<ClassAssignment, "id" | "classId" | "teacherId" | "createdAt">
  ) => {
    if (currentUser) {
      createClassAssignment(activeClassId, currentUser.uid, asgn).catch(console.error);
    } else {
      const newAsgn: ClassAssignment = {
        ...asgn,
        id: `asgn-${Date.now()}`,
        classId: activeClassId,
        teacherId: activeClass?.teacherId || "local-teacher",
        createdAt: Date.now(),
      };
      setClassAssignments((prev) => [newAsgn, ...prev]);
    }
  };

  const handleSubmitClassAssignment = (assignmentId: string, text: string, note?: string) => {
    const studentUser = {
      uid: currentUser?.uid || "local-learner",
      displayName: currentUser?.displayName || "Local learner",
      email: currentUser?.email || "",
    };

    if (currentUser) {
      submitClassAssignment(activeClassId, assignmentId, studentUser, text, note).catch(console.error);
    } else {
      const newSub: AssignmentSubmission = {
        id: studentUser.uid,
        assignmentId,
        classId: activeClassId,
        studentId: studentUser.uid,
        studentName: studentUser.displayName,
        studentEmail: studentUser.email,
        studentSubmission: text,
        studentNote: note,
        submittedAt: Date.now(),
        status: "submitted",
      };
      setClassSubmissions((prev) => {
        const filtered = prev.filter(
          (s) => !(s.assignmentId === assignmentId && s.studentId === studentUser.uid)
        );
        return [...filtered, newSub];
      });
    }
  };

  const handleReviewClassSubmission = (
    assignmentId: string,
    studentId: string,
    grade: string,
    feedback: string
  ) => {
    // Record teacher-confirmed learning evidence for the reviewed student
    try {
      const asgn = classAssignments.find((a) => a.id === assignmentId);
      const resolved = resolveSkillForActivity("teacher-reviewed-assignment", asgn?.subject, asgn?.title);
      const normalizedGrade = grade.trim().toUpperCase();
      const numericGrade = Number.parseFloat(normalizedGrade.replace("%", ""));
      const gradeScore = Number.isFinite(numericGrade)
        ? Math.max(0, Math.min(100, numericGrade))
        : normalizedGrade === "PASS"
          ? 100
          : normalizedGrade.startsWith("A")
            ? 95
            : normalizedGrade.startsWith("B")
              ? 85
              : normalizedGrade.startsWith("C")
                ? 75
                : normalizedGrade.startsWith("D")
                  ? 60
                  : normalizedGrade.startsWith("F")
                    ? 40
                    : undefined;
      const result = gradeScore === undefined
        ? "explored"
        : gradeScore >= 85 ? "success" : gradeScore < 60 ? "struggle" : "practice";
      recordLearningEvent({
        learnerId: studentId,
        activityId: "teacher-reviewed-assignment",
        experienceId: "homework-desk",
        contentId: `assignment-${assignmentId}`,
        eventType: resolved.skillId ? "assessment_response" : "content_explored",
        activityType: "homework-submission",
        activityTitle: `Teacher Reviewed: ${asgn?.title || "Class Assignment"} (Grade: ${grade})`,
        skillId: resolved.skillId,
        domain: resolved.skillId ? resolved.domain : "general",
        gradeBand: resolved.gradeBand,
        result: resolved.skillId ? result : "explored",
        score: resolved.skillId ? gradeScore : undefined,
        difficulty: "medium",
        attempts: 1,
        hintsUsed: 0,
        metadata: {
          teacherGrade: grade,
          teacherFeedback: feedback,
          reviewedByTeacher: true,
          mappedSkillId: resolved.skillId || null,
        },
      });
    } catch (e) {
      console.warn("Failed recording teacher review telemetry:", e);
    }

    if (currentUser) {
      gradeClassSubmission(activeClassId, assignmentId, studentId, grade, feedback).catch(console.error);
    } else {
      setClassSubmissions((prev) =>
        prev.map((s) =>
          s.assignmentId === assignmentId && s.studentId === studentId
            ? {
                ...s,
                status: "reviewed",
                grade,
                teacherFeedback: feedback,
                reviewedAt: Date.now(),
              }
            : s
        )
      );
    }
  };

  const handleAddClassResource = (
    res: Omit<ClassResource, "id" | "classId" | "teacherId" | "createdAt">
  ) => {
    if (currentUser) {
      addClassResource(activeClassId, currentUser.uid, res).catch(console.error);
    } else {
      const newRes: ClassResource = {
        ...res,
        id: `res-${Date.now()}`,
        classId: activeClassId,
        teacherId: activeClass?.teacherId || "local-teacher",
        createdAt: Date.now(),
      };
      setClassResources((prev) => [newRes, ...prev]);
    }
  };

  const handleSendClassMessage = (text: string, attachedNotebookId?: string) => {
    let attachedContext = undefined;
    if (attachedNotebookId) {
      const nb = notebooks.find((n) => n.id === attachedNotebookId);
      if (nb) {
        const modelMsgs = nb.messages.filter((m) => m.role === "model");
        const lastModel = modelMsgs[modelMsgs.length - 1];
        attachedContext = {
          notebookId: nb.id,
          subject: nb.subject,
          notebookName: nb.name,
          lastAIResponse: lastModel ? lastModel.content : "Session initialized.",
        };
      }
    }

    const isTeacher = currentUser && activeClass && activeClass.teacherId === currentUser.uid;

    if (currentUser) {
      sendClassMessage(activeClassId, {
        classId: activeClassId,
        studentId: isTeacher ? "all" : currentUser.uid,
        studentName: isTeacher ? "Instructor Broadcast" : (currentUser.displayName || "Student"),
        senderId: currentUser.uid,
        senderName: currentUser.displayName || (isTeacher ? "Instructor" : "Student"),
        senderRole: isTeacher ? "teacher" : "student",
        text,
        attachedNotebookContext: attachedContext,
        read: false,
      }).catch(console.error);
    } else {
      const newMsg: ClassMessage = {
        id: `msg-${Date.now()}`,
        classId: activeClassId,
        studentId: "local-learner",
        studentName: "Local learner",
        senderId: "local-learner",
        senderName: "Local learner",
        senderRole: "student",
        text,
        timestamp: Date.now(),
        attachedNotebookContext: attachedContext,
        read: true,
      };
      setClassMessages((prev) => [...prev, newMsg]);
    }
  };

  const handleCreateNotebook = (name: string, subject: string, mode: AcademicMode) => {
    const newNb: Notebook = {
      id: `nb-${Date.now()}`,
      name,
      subject,
      mode,
      createdAt: Date.now(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          role: "model",
          content: `Welcome to **${name}** (${subject}). How can I assist your studies today?`,
          timestamp: Date.now(),
        },
      ],
    };
    setNotebooks((prev) => [newNb, ...prev]);
    setActiveNotebookId(newNb.id);
    if (currentUser) {
      saveNotebookToCloud(currentUser.uid, newNb).catch(console.error);
    }
  };

  const handleDeleteNotebook = (id: string) => {
    if (notebooks.length <= 1) return;
    setNotebooks((prev) => {
      const filtered = prev.filter((nb) => nb.id !== id);
      if (activeNotebookId === id && filtered.length > 0) {
        setActiveNotebookId(filtered[0].id);
      }
      return filtered;
    });
    if (currentUser) {
      deleteNotebookFromCloud(currentUser.uid, id).catch(console.error);
    }
  };

  // Badges calculation
  const unreadTeacherCount = classMessages.filter(
    (m) => !m.read && m.senderRole === "teacher"
  ).length;
  const studentUid = currentUser?.uid || "local-learner";
  const openAssignmentsCount = classAssignments.filter(
    (a) => !classSubmissions.some((s) => s.assignmentId === a.id && s.studentId === studentUid)
  ).length;

  const submissionsByAsgn = classSubmissions.reduce<Record<string, AssignmentSubmission>>(
    (acc, sub) => {
      if (sub.studentId === studentUid) {
        acc[sub.assignmentId] = sub;
      }
      return acc;
    },
    {}
  );

  const isToddlerActive = learningStage === "toddler" || activeTab === "toddler";

  return (
    <div className="h-screen w-screen bg-[#050507] text-white flex flex-col md:flex-row overflow-hidden font-sans selection:bg-indigo-500/30">
      <a href="#workspace-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:font-bold focus:text-slate-950">Skip to main content</a>
      {/* Desktop Sidebar Navigation - Hidden in Toddler mode for 100% immersive wonderland */}
      {!isToddlerActive && (
        <NavigationSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          userRole={userRole}
          onSelectRole={handleSelectRole}
          learningStage={learningStage}
          onSelectLearningStage={handleSelectLearningStage}
          onOpenStartupGateway={() => setIsStartupGatewayOpen(true)}
          onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
          unreadTeacherMessagesCount={unreadTeacherCount}
          openAssignmentsCount={openAssignmentsCount}
          currentUser={currentUser}
          onSignIn={signInWithGoogle}
          onSignOut={logOut}
          isSyncing={isSyncing}
        />
      )}

      {/* Main Workspace Area */}
      <main id="workspace-main" tabIndex={-1} className={`flex-1 flex flex-col min-w-0 min-h-0 ${
        isToddlerActive 
          ? "bg-[#0c0d14]" 
          : learningStage === "primary"
          ? "bg-[#f8fafc] text-slate-900"
          : "bg-[#0b0f19] text-white"
      } relative overflow-hidden ${isToddlerActive ? "pb-0" : "pb-16 md:pb-0"}`}>
        {/* Top Control Bar - Only displayed for Primary & Educator stages (Toddler has its own child-proof top bar) */}
        {!isToddlerActive && (
          <div
            className={`border-b px-3 py-2 sm:px-6 flex items-center justify-between gap-2 overflow-x-auto z-10 flex-shrink-0 scrollbar-none transition-colors ${
              learningStage === "primary"
                ? "bg-white/95 backdrop-blur-md border-slate-200 text-slate-900 shadow-sm"
                : "bg-[#0f172a] border-slate-800 text-white shadow-sm"
            }`}
          >
            {/* Active Stage Badge */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {learningStage === "primary" ? (
                <div className="flex items-center gap-1.5 sm:gap-2 bg-indigo-50 border-2 border-indigo-200 px-3.5 py-1.5 rounded-2xl shadow-sm">
                  <span className="text-base">🎒</span>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <span className="text-xs sm:text-sm font-black text-indigo-950">Primary Desk</span>
                    <span className="text-xs text-indigo-600 font-bold hidden sm:inline">Ages 6–11</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                  <span className="text-base">👩‍🏫</span>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <span className="text-xs sm:text-sm font-black text-emerald-300">Educator Hub</span>
                    <span className="text-xs text-emerald-400 font-bold hidden sm:inline">Parent & Tutor Mode</span>
                  </div>
                </div>
              )}
            </div>

            {/* Agency Gamification HUD: XP, Streak, Stars, Odyssey Map Button, AI Voice */}
            <GamificationHeader
              onOpenOdyssey={() => setActiveTab("odyssey")}
              onOpenVoiceSettings={() => setIsVoiceModalOpen(true)}
              activeTab={activeTab}
              isLight={learningStage === "primary"}
            />

            {/* Quick Profile Switcher & Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <button
                onClick={() => setIsStartupGatewayOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 flex-shrink-0 border ${
                  learningStage === "primary"
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-800 border-b-2"
                    : "bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
                }`}
                title="Switch Learner Profile (Toddler, Primary, Educator)"
              >
                <span>🔄</span>
                <span className="font-bold hidden sm:inline">Switch Profile</span>
                <span className="font-bold sm:hidden">Switch</span>
              </button>

              <button
                onClick={() => {
                  setSelectedAssessmentId("primary-homework-comprehension");
                  setActiveTab("assessment");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer border flex-shrink-0 ${
                  activeTab === "assessment"
                    ? "bg-emerald-500 border-emerald-600 text-white ring-2 ring-emerald-400 shadow-md"
                    : learningStage === "primary"
                    ? "bg-white border-2 border-indigo-200 text-indigo-950 hover:bg-indigo-50"
                    : "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                }`}
              >
                <span>📋</span>
                <span className="hidden sm:inline">Diagnostic Bridge</span>
                <span className="sm:hidden">Assess</span>
              </button>

              <button
                onClick={() => setIsAgeModalOpen(true)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex-shrink-0 border ${
                  learningStage === "primary"
                    ? "bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300"
                    : "bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-400/30"
                }`}
                title="Learn about age stages and features"
              >
                <span>ℹ️</span>
                <span className="hidden md:inline">Stage Guide</span>
              </button>
            </div>
          </div>
        )}

        <Suspense fallback={
          <div className="flex-1 grid place-items-center p-8">
            <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
              <div className="h-2 w-20 animate-pulse rounded bg-sky-200" />
              <div className="mt-5 h-5 w-3/4 animate-pulse rounded bg-slate-200" />
              <div className="mt-3 h-3 w-full animate-pulse rounded bg-slate-100" />
              <div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-slate-100" />
              <p className="mt-5 text-xs font-semibold text-slate-500">Opening your learning space…</p>
            </div>
          </div>
        }>
        {/* LEARNING ODYSSEY MAP VIEW */}
        {activeTab === "odyssey" && (
          <div className="flex-1 overflow-y-auto">
            <LearningOdysseyMap
              onNavigateTab={(tab) => setActiveTab(tab)}
              onSelectStage={(stage) => setLearningStage(stage)}
              recommendedNodeId={recommendedSkillNodeId}
              onRecommendationConsumed={() => setRecommendedSkillNodeId(undefined)}
            />
          </div>
        )}

        {/* PRIMARY STEM & CONCEPT LAB ARCADE */}
        {activeTab === "primary-lab" && (
          <div className="flex-1 overflow-y-auto">
            <PrimaryLearningLab
              onBack={() => setActiveTab("homework")}
              onAskTutor={handleAskTutor}
              initialActivityId={pendingLearningLaunch?.targetTab === "primary-lab" ? pendingLearningLaunch.targetId : undefined}
            />
          </div>
        )}

        {/* TODDLER WORLD VIEW (Cocomelon style, picture books, phonics, counting) */}
        {activeTab === "toddler" && (
          <div className="flex-1 overflow-y-auto">
            <ToddlerWorldView
              initialActivityId={pendingLearningLaunch?.targetTab === "toddler" ? pendingLearningLaunch.targetId : undefined}
              onStartAssessment={(asmtId) => {
                setSelectedAssessmentId(asmtId);
                setActiveTab("assessment");
              }}
              onSwitchToPrimary={() => handleRequestExitToddler("primary")}
              onSwitchToEducator={() => handleRequestExitToddler("educator")}
              onRequestExit={() => handleRequestExitToddler()}
            />
          </div>
        )}

        {/* PRIMARY HOMEWORK VIEW (Homework app, Socratic solver, task tracker) */}
        {activeTab === "homework" && (
          <div className="flex-1 overflow-y-auto">
            <PrimaryHomeworkView
              onAskTutor={handleAskTutor}
              onNavigateToPractice={() => setActiveTab("practice")}
              onStartAssessment={(asmtId) => {
                setSelectedAssessmentId(asmtId);
                setActiveTab("assessment");
              }}
              onOpenSTEMArcade={() => setActiveTab("primary-lab")}
              onNavigate={setActiveTab}
              notebooks={notebooks}
              classAssignments={classAssignments}
              submissions={submissionsByAsgn}
              onSubmitAssignment={async (assignmentId, text, note) => {
                try {
                  handleSubmitClassAssignment(assignmentId, text, note);
                  return true;
                } catch {
                  return false;
                }
              }}
              activeClass={activeClass}
              currentUserId={currentUser?.uid}
            />
          </div>
        )}

        {/* GUIDED ASSESSMENT BRIDGE (Parent/Tutor or Student Self-Use) */}
        {activeTab === "assessment" && (
          <div className="flex-1 overflow-y-auto">
            <GuidedAssessmentBridge
              initialAssessmentId={selectedAssessmentId}
              onClose={() => setActiveTab(learningStage === "toddler" ? "toddler" : "homework")}
            />
          </div>
        )}

        {activeTab === "home" && (
          <HomeDashboard
            notebooks={notebooks}
            studyPlan={studyPlan}
            practiceSessions={practiceSessions}
            onNavigate={setActiveTab}
            onSelectNotebook={(id) => {
              setActiveNotebookId(id);
              setActiveTab("tutor");
            }}
            onAskTutor={handleAskTutor}
            onToggleTask={handleToggleTask}
            onStartRecommendation={handleLearningLaunch}
            onStartRouteItem={handleLearningLaunch}
          />
        )}

        {activeTab === "parent" && (
          <ParentView
            currentUserId={currentUser?.uid || null}
            notebooks={notebooks}
            studyPlan={studyPlan}
            practiceSessions={practiceSessions}
            classrooms={classrooms}
            classAssignments={classAssignments}
            assignmentSubmissions={submissionsByAsgn}
            onNavigate={setActiveTab}
            onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
            onApplyDiagnosticRecommendation={(nodeId) => {
              setRecommendedSkillNodeId(nodeId);
              setActiveTab("odyssey");
            }}
            onStartAssessment={(stage) => {
              if (stage === "toddler") {
                setSelectedAssessmentId("toddler-phonics-basics");
              } else {
                setSelectedAssessmentId("primary-homework-comprehension");
              }
              setActiveTab("assessment");
            }}
          />
        )}

        {activeTab === "tutor-hub" && (
          <TutorHubView
            notebooks={notebooks}
            studyPlan={studyPlan}
            practiceSessions={practiceSessions}
            onNavigate={setActiveTab}
            onAddTask={handleAddTask}
            onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
          />
        )}

        {activeTab === "tutor" && (
          <div className="flex-1 p-2 sm:p-4 md:p-6 flex flex-col min-h-0">
            <ChatInterface
              notebooks={notebooks}
              setNotebooks={setNotebooks}
              activeNotebookId={activeNotebookId}
              setActiveNotebookId={setActiveNotebookId}
              pendingInitialQuery={pendingTutorQuery}
              onClearInitialQuery={() => setPendingTutorQuery(undefined)}
              onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
            />
          </div>
        )}

        {activeTab === "subjects" && (
          <SubjectsView
            notebooks={notebooks}
            practiceSessions={practiceSessions}
            onNavigate={setActiveTab}
            onSelectNotebook={(id) => {
              setActiveNotebookId(id);
              setActiveTab("tutor");
            }}
            onStartPracticeForNotebook={handleStartPracticeForNotebook}
          />
        )}

        {activeTab === "study-plan" && (
          <StudyPlanView
            studyPlan={studyPlan}
            notebooks={notebooks}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onSetTasks={setStudyPlan}
          />
        )}

        {activeTab === "notebooks" && (
          <NotebooksView
            notebooks={notebooks}
            activeNotebookId={activeNotebookId}
            practiceSessions={practiceSessions}
            onSelectNotebook={setActiveNotebookId}
            onCreateNotebook={handleCreateNotebook}
            onDeleteNotebook={handleDeleteNotebook}
            onNavigate={setActiveTab}
            onSendTutorAction={handleSendTutorAction}
            onStartPracticeForNotebook={handleStartPracticeForNotebook}
          />
        )}

        {activeTab === "practice" && (
          <PracticeView
            notebooks={notebooks}
            prefilledSubject={practicePrefill.subject}
            prefilledTopic={practicePrefill.topic}
            currentUserId={currentUser?.uid || getActiveAccountId()}
            onSaveSession={handleSavePracticeSession}
            onNavigate={setActiveTab}
            onAskTutor={handleAskTutor}
            onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
            initialActivityId={pendingLearningLaunch?.targetTab === "practice" ? pendingLearningLaunch.targetId : undefined}
            initialSkillId={pendingLearningLaunch?.targetTab === "practice" ? pendingLearningLaunch.skillId : undefined}
          />
        )}

        {activeTab === "progress" && (
          <ProgressView
            notebooks={notebooks}
            practiceSessions={practiceSessions}
            studyPlan={studyPlan}
            onNavigate={setActiveTab}
            onSelectNotebook={(id) => {
              setActiveNotebookId(id);
              setActiveTab("tutor");
            }}
            onStartPractice={handleStartPracticeForNotebook}
          />
        )}

        {activeTab === "teacher" && (
          <TeacherView
            currentUser={currentUser}
            classrooms={classrooms}
            activeClassId={activeClassId}
            onSelectClass={setActiveClassId}
            onCreateClass={handleCreateClass}
            onJoinClass={handleJoinClass}
            classAssignments={classAssignments}
            submissions={submissionsByAsgn}
            allClassSubmissions={classSubmissions}
            resources={classResources}
            messages={classMessages}
            notebooks={notebooks}
            practiceSessions={practiceSessions}
            onSendMessage={handleSendClassMessage}
            onSubmitAssignment={handleSubmitClassAssignment}
            onReviewAssignment={handleReviewClassSubmission}
            onCreateAssignment={handleCreateClassAssignment}
            onAddResource={handleAddClassResource}
          />
        )}
        </Suspense>
      </main>

      {/* Mobile Navigation Bar */}
      <MobileNavigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        userRole={userRole}
        onSelectRole={handleSelectRole}
        learningStage={learningStage}
        onSelectLearningStage={handleSelectLearningStage}
        onOpenStartupGateway={() => setIsStartupGatewayOpen(true)}
        onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
        onOpenVoiceSettings={() => setIsVoiceModalOpen(true)}
        unreadTeacherMessagesCount={unreadTeacherCount}
        openAssignmentsCount={openAssignmentsCount}
        currentUser={currentUser}
        onSignIn={signInWithGoogle}
        onSignOut={logOut}
        isSyncing={isSyncing}
      />

      {/* Subscription & AI Quota Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        currentUser={currentUser}
      />

      {/* Adaptive Age Stage Selector & Pathway Guide Modal */}
      <AgeStageModal
        isOpen={isAgeModalOpen}
        onClose={() => setIsAgeModalOpen(false)}
        currentStage={learningStage}
        onSelectStage={handleSelectLearningStage}
        userRole={userRole}
        onSelectRole={handleSelectRole}
      />

      {/* Agency-Grade Startup Gateway ("Who is Learning Today?") */}
      <StartupGateway
        isOpen={isStartupGatewayOpen}
        onSelectStage={handleSelectLearningStage}
        currentStage={learningStage}
        onClose={() => setIsStartupGatewayOpen(false)}
        isDismissible={true}
      />

      {/* Parental Gate Modal for Safe Toddler Exit */}
      <ParentalGateModal
        isOpen={isParentalGateOpen}
        onClose={() => {
          setIsParentalGateOpen(false);
          setPendingStageSwitch(null);
        }}
        onSuccess={handleParentalGateSuccess}
      />

      {/* AI Voice Tuning & Selection Modal */}
      <VoiceSettingsModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
    </div>
  );
}
