import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  getDocFromServer,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  arrayUnion,
  writeBatch,
} from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";
import {
  Notebook,
  StudyPlanItem,
  PracticeSession,
  TeacherMessage,
  Assignment,
  TeacherResource,
  Classroom,
  ClassAssignment,
  AssignmentSubmission,
  ClassResource,
  ClassMessage,
  SyncStatusInfo,
} from "./types";

const app = initializeApp(firebaseConfig);

// CRITICAL: Specifying firestoreDatabaseId is required by AI Studio environment
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  };
}

// Global Sync Status Pub/Sub (Fixes #5: Silent Failures)
type SyncListener = (info: SyncStatusInfo) => void;
const syncListeners: Set<SyncListener> = new Set();

export function subscribeToSyncStatus(listener: SyncListener) {
  syncListeners.add(listener);
  return () => {
    syncListeners.delete(listener);
  };
}

export function notifySyncStatus(info: SyncStatusInfo) {
  syncListeners.forEach((fn) => {
    try {
      fn(info);
    } catch {
      // ignore
    }
  });
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errInfo: FirestoreErrorInfo = {
    error: errorMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  notifySyncStatus({
    state: "error",
    message: `Cloud sync error on ${path || "operation"}: ${errorMessage.slice(0, 100)}`,
  });
  throw new Error(JSON.stringify(errInfo));
}

// Connection check on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("the client is offline")
    ) {
      console.warn("Firebase client offline warning.");
    }
  }
}
testConnection();

// Authentication helpers
export async function signInWithGoogle() {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (err: any) {
    console.error("Error signing in with Google:", err);
    notifySyncStatus({
      state: "error",
      message: err.message || "Failed to sign in with Google",
    });
    throw err;
  }
}

export async function logOut() {
  try {
    await signOut(auth);
    notifySyncStatus({
      state: "synced",
      message: "Signed out successfully",
    });
  } catch (err) {
    console.error("Error signing out:", err);
    throw err;
  }
}

// User Profile creation / synchronization
export async function syncUserProfile(
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  },
  initialRole: "student" | "parent" | "teacher" | "tutor" = "student"
) {
  const userRef = doc(db, "users", user.uid);
  const path = `users/${user.uid}`;
  try {
    const existingSnap = await getDoc(userRef);
    if (!existingSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || `${user.uid}@example.com`,
        displayName: user.displayName || "Scholar",
        photoURL: user.photoURL || "",
        role: initialRole,
        createdAt: Date.now(),
      });
    } else {
      const data = existingSnap.data();
      const updates: Record<string, any> = {
        email: user.email || data.email,
        displayName: user.displayName || data.displayName || "Scholar",
        photoURL: user.photoURL || data.photoURL || "",
      };
      await updateDoc(userRef, updates);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateUserRole(
  userId: string,
  role: "student" | "parent" | "teacher" | "tutor"
) {
  const userRef = doc(db, "users", userId);
  const path = `users/${userId}`;
  try {
    await updateDoc(userRef, { role });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function generateParentLinkCode(
  studentId: string,
  studentName: string,
  studentEmail?: string
): Promise<string> {
  const code = `P-${studentId.slice(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const linkRef = doc(db, "parentLinkCodes", code);
  try {
    await setDoc(linkRef, {
      id: code,
      studentId,
      studentName,
      studentEmail: studentEmail || "",
      linkCode: code,
      createdAt: Date.now(),
    });
    return code;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `parentLinkCodes/${code}`);
  }
}

export async function linkChildByCode(
  parentUid: string,
  code: string
): Promise<{ success: boolean; studentName?: string; studentId?: string; error?: string }> {
  const cleanCode = code.trim().toUpperCase();
  const linkRef = doc(db, "parentLinkCodes", cleanCode);
  try {
    const snap = await getDoc(linkRef);
    if (!snap.exists()) {
      return { success: false, error: "Link code not found or expired." };
    }
    const data = snap.data();
    const parentRef = doc(db, "users", parentUid);
    await updateDoc(parentRef, {
      linkedStudentIds: arrayUnion(data.studentId),
    });
    return {
      success: true,
      studentName: data.studentName,
      studentId: data.studentId,
    };
  } catch (error) {
    console.error("Error linking child code:", error);
    return { success: false, error: "Could not link child account." };
  }
}

// ========================================================
// NOTEBOOKS & MESSAGES (Fixes #3: All Notebooks & #4: 1MB Limit)
// ========================================================

/**
 * Saves a notebook to cloud. To guarantee we don't breach Firestore's 1MB
 * document size limit, messages are saved both trimmed in the main doc and
 * individually into `/users/{userId}/notebooks/{notebookId}/messages/{msgId}`.
 */
export async function saveNotebookToCloud(userId: string, notebook: Notebook) {
  const path = `users/${userId}/notebooks/${notebook.id}`;
  notifySyncStatus({ state: "syncing", message: `Syncing ${notebook.name}...` });
  try {
    // Keep last 30 messages in the main document for fast cold-start preview,
    // each message content capped at 25000 characters.
    const sanitizedMessages = (notebook.messages || []).slice(-30).map((m) => ({
      id: m.id.slice(0, 128),
      role: m.role,
      content: m.content ? m.content.slice(0, 25000) : "",
      timestamp: m.timestamp || Date.now(),
      interactionId: m.interactionId || null,
      attachment: m.attachment ? { name: m.attachment.name } : null,
    }));

    const payload = {
      id: notebook.id.slice(0, 128),
      userId: userId.slice(0, 128),
      name: notebook.name.slice(0, 200),
      subject: notebook.subject.slice(0, 100),
      mode: notebook.mode,
      messages: sanitizedMessages,
      lastInteractionId: (notebook.lastInteractionId || "").slice(0, 200),
      createdAt: notebook.createdAt || Date.now(),
    };

    await setDoc(doc(db, "users", userId, "notebooks", notebook.id), payload);

    // Save newest individual messages to subcollection for unbounded growth
    if (notebook.messages && notebook.messages.length > 0) {
      const recentMessages = notebook.messages.slice(-10);
      for (const msg of recentMessages) {
        if (!msg.id) continue;
        const msgDocRef = doc(
          db,
          "users",
          userId,
          "notebooks",
          notebook.id,
          "messages",
          msg.id
        );
        await setDoc(
          msgDocRef,
          {
            id: msg.id.slice(0, 128),
            userId: userId.slice(0, 128),
            notebookId: notebook.id.slice(0, 128),
            role: msg.role,
            content: (msg.content || "").slice(0, 50000),
            timestamp: msg.timestamp || Date.now(),
          },
          { merge: true }
        );
      }
    }

    notifySyncStatus({
      state: "synced",
      message: `Notebook "${notebook.name}" synced to cloud`,
      lastSyncedAt: Date.now(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function syncAllNotebooksToCloud(userId: string, notebooks: Notebook[]) {
  if (!notebooks || notebooks.length === 0) return;
  notifySyncStatus({ state: "syncing", message: `Syncing ${notebooks.length} notebooks...` });
  for (const nb of notebooks) {
    await saveNotebookToCloud(userId, nb);
  }
  notifySyncStatus({
    state: "synced",
    message: `All ${notebooks.length} notebooks synced to cloud`,
    lastSyncedAt: Date.now(),
  });
}

export async function deleteNotebookFromCloud(userId: string, notebookId: string) {
  const path = `users/${userId}/notebooks/${notebookId}`;
  try {
    await deleteDoc(doc(db, "users", userId, "notebooks", notebookId));
    notifySyncStatus({
      state: "synced",
      message: "Notebook removed from cloud",
      lastSyncedAt: Date.now(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ========================================================
// STUDY PLAN & PRACTICE SESSIONS
// ========================================================

export async function saveStudyPlanItemToCloud(userId: string, item: StudyPlanItem) {
  const path = `users/${userId}/studyPlanItems/${item.id}`;
  try {
    const payload = {
      id: item.id.slice(0, 128),
      userId: userId.slice(0, 128),
      title: item.title.slice(0, 300),
      subject: item.subject.slice(0, 100),
      durationMinutes: Math.min(Math.max(item.durationMinutes, 0), 1440),
      priority: item.priority,
      reason: (item.reason || "").slice(0, 500),
      completed: Boolean(item.completed),
      type: item.type,
      date: item.date.slice(0, 20),
    };
    await setDoc(doc(db, "users", userId, "studyPlanItems", item.id), payload);
    notifySyncStatus({ state: "synced", message: "Study task updated", lastSyncedAt: Date.now() });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteStudyPlanItemFromCloud(userId: string, itemId: string) {
  const path = `users/${userId}/studyPlanItems/${itemId}`;
  try {
    await deleteDoc(doc(db, "users", userId, "studyPlanItems", itemId));
    notifySyncStatus({ state: "synced", message: "Study task deleted", lastSyncedAt: Date.now() });
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function savePracticeSessionToCloud(userId: string, session: PracticeSession) {
  const path = `users/${userId}/practiceSessions/${session.id}`;
  try {
    const payload = {
      id: session.id.slice(0, 128),
      userId: userId.slice(0, 128),
      subject: session.subject.slice(0, 100),
      topic: session.topic.slice(0, 200),
      difficulty: session.difficulty,
      totalQuestions: Math.min(Math.max(session.totalQuestions, 0), 100),
      correctAnswers: Math.min(Math.max(session.correctAnswers, 0), session.totalQuestions),
      timestamp: session.timestamp || Date.now(),
    };
    await setDoc(doc(db, "users", userId, "practiceSessions", session.id), payload);
    notifySyncStatus({ state: "synced", message: "Practice quiz saved", lastSyncedAt: Date.now() });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Legacy personal helpers (kept for non-class interactions)
export async function saveTeacherMessageToCloud(userId: string, msg: TeacherMessage) {
  const path = `users/${userId}/teacherMessages/${msg.id}`;
  try {
    const payload = {
      id: msg.id.slice(0, 128),
      userId: userId.slice(0, 128),
      sender: msg.sender,
      text: msg.text.slice(0, 4000),
      timestamp: msg.timestamp || Date.now(),
      read: Boolean(msg.read),
      attachedNotebookContext: msg.attachedNotebookContext || null,
    };
    await setDoc(doc(db, "users", userId, "teacherMessages", msg.id), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveAssignmentToCloud(userId: string, asgn: Assignment) {
  const path = `users/${userId}/assignments/${asgn.id}`;
  try {
    const payload = {
      id: asgn.id.slice(0, 128),
      userId: userId.slice(0, 128),
      subject: asgn.subject.slice(0, 100),
      title: asgn.title.slice(0, 300),
      description: asgn.description.slice(0, 4000),
      dueDate: asgn.dueDate.slice(0, 50),
      status: asgn.status,
      studentSubmission: (asgn.studentSubmission || "").slice(0, 10000),
      studentNote: (asgn.studentNote || "").slice(0, 1000),
      teacherFeedback: (asgn.teacherFeedback || "").slice(0, 4000),
      grade: (asgn.grade || "").slice(0, 20),
      submittedAt: asgn.submittedAt || null,
    };
    await setDoc(doc(db, "users", userId, "assignments", asgn.id), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveTeacherResourceToCloud(userId: string, res: TeacherResource) {
  const path = `users/${userId}/teacherResources/${res.id}`;
  try {
    const payload = {
      id: res.id.slice(0, 128),
      userId: userId.slice(0, 128),
      subject: res.subject.slice(0, 100),
      title: res.title.slice(0, 300),
      type: res.type,
      content: res.content.slice(0, 10000),
      url: (res.url || "").slice(0, 1000),
      createdAt: res.createdAt || Date.now(),
    };
    await setDoc(doc(db, "users", userId, "teacherResources", res.id), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ========================================================
// MULTI-USER CLASSROOM SYSTEM (Path B Architecture)
// ========================================================

/**
 * Creates a brand new classroom.
 */
export async function createClassroom(
  teacher: { uid: string; displayName: string; email?: string | null },
  name: string,
  subject: string,
  customJoinCode?: string
): Promise<Classroom> {
  const cleanId = `class-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const code = (
    customJoinCode ||
    `${subject.slice(0, 3).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`
  )
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 8);

  const classroom: Classroom = {
    id: cleanId,
    name: name.trim().slice(0, 200),
    subject: subject.trim().slice(0, 100),
    joinCode: code,
    teacherId: teacher.uid,
    teacherName: teacher.displayName || "Instructor",
    teacherEmail: teacher.email || undefined,
    studentIds: [],
    createdAt: Date.now(),
  };

  const path = `classes/${cleanId}`;
  try {
    notifySyncStatus({ state: "syncing", message: `Creating classroom "${name}"...` });
    await setDoc(doc(db, "classes", cleanId), classroom);
    // Direct join-code index entry to enable instant join without collection listing
    try {
      await setDoc(doc(db, "classJoinCodes", code), {
        id: code,
        classId: cleanId,
        joinCode: code,
        teacherId: teacher.uid,
        createdAt: classroom.createdAt,
      });
    } catch (e) {
      console.warn("Could not index join code:", e);
    }
    notifySyncStatus({
      state: "synced",
      message: `Classroom "${name}" created with code ${code}!`,
      lastSyncedAt: Date.now(),
    });
    return classroom;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Allows a student to join a classroom by its unique join code.
 * Uses direct single-document lookup first to avoid blanket collection listing,
 * followed by scoped queries and atomic student roster update.
 */
export async function joinClassroomByCode(
  student: { uid: string; displayName: string; email?: string | null },
  joinCode: string
): Promise<Classroom> {
  const code = joinCode.trim().toUpperCase();
  const path = `classes/${code}`;
  notifySyncStatus({ state: "syncing", message: `Searching class code "${code}"...` });

  try {
    let targetClassId: string | null = null;
    let classData: Classroom | null = null;

    // 1. Direct single-doc lookup in classJoinCodes (No collection listing required)
    try {
      const codeDoc = await getDoc(doc(db, "classJoinCodes", code));
      if (codeDoc.exists()) {
        const data = codeDoc.data() as { classId: string };
        targetClassId = data.classId;
      }
    } catch {
      // Non-fatal, fall through to alternative lookup methods
    }

    // 2. Direct ID check (in case classId is code or seeded format class-xxx)
    if (!targetClassId) {
      const candidateIds = [code, `class-${code.toLowerCase()}`, `class-${code.toLowerCase()}-1`];
      for (const cid of candidateIds) {
        try {
          const directDoc = await getDoc(doc(db, "classes", cid));
          if (directDoc.exists()) {
            targetClassId = cid;
            classData = directDoc.data() as Classroom;
            break;
          }
        } catch {
          // Continue to next candidate
        }
      }
    }

    // 3. If targetClassId was resolved from joinCode map, fetch the class document
    if (targetClassId && !classData) {
      const classDoc = await getDoc(doc(db, "classes", targetClassId));
      if (classDoc.exists()) {
        classData = classDoc.data() as Classroom;
      }
    }

    // 4. Query fallback (works for developer/tester access)
    if (!classData) {
      try {
        const q = query(collection(db, "classes"), where("joinCode", "==", code));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const classDoc = snapshot.docs[0];
          classData = classDoc.data() as Classroom;
          targetClassId = classDoc.id;
        }
      } catch {
        // Query might be denied if user is not authorized to list classes
      }
    }

    if (!classData || !targetClassId) {
      throw new Error(`No classroom found with Join Code "${code}". Please verify the code with your teacher.`);
    }

    if (classData.teacherId === student.uid) {
      throw new Error("You are the instructor for this class!");
    }

    if (classData.studentIds && classData.studentIds.includes(student.uid)) {
      notifySyncStatus({
        state: "synced",
        message: `Already enrolled in "${classData.name}"`,
      });
      return classData;
    }

    // Atomic student self-join update: restricted exclusively to appending the student's own UID
    await updateDoc(doc(db, "classes", targetClassId), {
      studentIds: arrayUnion(student.uid),
    });

    // Also register teacherIds and enrolledClassIds on student profile for teacher authorization
    try {
      await updateDoc(doc(db, "users", student.uid), {
        teacherIds: arrayUnion(classData.teacherId),
        enrolledClassIds: arrayUnion(targetClassId),
      });
    } catch {
      // Non-fatal if user document is being created
    }

    notifySyncStatus({
      state: "synced",
      message: `Successfully joined ${classData.name}!`,
      lastSyncedAt: Date.now(),
    });

    return {
      ...classData,
      studentIds: [...(classData.studentIds || []), student.uid],
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Creates an assignment within a classroom.
 */
export async function createClassAssignment(
  classId: string,
  teacherId: string,
  assignment: Omit<ClassAssignment, "id" | "classId" | "teacherId" | "createdAt">
): Promise<ClassAssignment> {
  const asgnId = `asgn-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
  const fullAssignment: ClassAssignment = {
    ...assignment,
    id: asgnId,
    classId,
    teacherId,
    createdAt: Date.now(),
  };

  const path = `classes/${classId}/assignments/${asgnId}`;
  notifySyncStatus({ state: "syncing", message: `Publishing assignment "${assignment.title}"...` });

  try {
    await setDoc(doc(db, "classes", classId, "assignments", asgnId), fullAssignment);
    notifySyncStatus({
      state: "synced",
      message: `Assignment "${assignment.title}" published!`,
      lastSyncedAt: Date.now(),
    });
    return fullAssignment;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Submits work for an assignment by a student.
 */
export async function submitClassAssignment(
  classId: string,
  assignmentId: string,
  student: { uid: string; displayName: string; email?: string | null },
  studentSubmission: string,
  studentNote?: string
): Promise<AssignmentSubmission> {
  const submissionId = student.uid;
  const submission: AssignmentSubmission = {
    id: submissionId,
    assignmentId,
    classId,
    studentId: student.uid,
    studentName: student.displayName || "Student",
    studentEmail: student.email || undefined,
    studentSubmission: studentSubmission.slice(0, 15000),
    studentNote: (studentNote || "").slice(0, 2000),
    submittedAt: Date.now(),
    status: "submitted",
  };

  const path = `classes/${classId}/assignments/${assignmentId}/submissions/${submissionId}`;
  notifySyncStatus({ state: "syncing", message: "Submitting homework..." });

  try {
    await setDoc(
      doc(db, "classes", classId, "assignments", assignmentId, "submissions", submissionId),
      submission
    );
    notifySyncStatus({
      state: "synced",
      message: "Assignment submitted successfully to teacher!",
      lastSyncedAt: Date.now(),
    });
    return submission;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Allows the teacher to grade a submission and provide feedback.
 */
export async function gradeClassSubmission(
  classId: string,
  assignmentId: string,
  studentId: string,
  grade: string,
  teacherFeedback: string
) {
  const path = `classes/${classId}/assignments/${assignmentId}/submissions/${studentId}`;
  notifySyncStatus({ state: "syncing", message: "Saving grade and feedback..." });

  try {
    await setDoc(
      doc(db, "classes", classId, "assignments", assignmentId, "submissions", studentId),
      {
        status: "reviewed",
        grade: grade.slice(0, 20),
        teacherFeedback: teacherFeedback.slice(0, 5000),
        reviewedAt: Date.now(),
      },
      { merge: true }
    );
    notifySyncStatus({
      state: "synced",
      message: "Grade & feedback posted!",
      lastSyncedAt: Date.now(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Adds a resource to a class.
 */
export async function addClassResource(
  classId: string,
  teacherId: string,
  resource: Omit<ClassResource, "id" | "classId" | "teacherId" | "createdAt">
): Promise<ClassResource> {
  const resId = `res-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
  const fullResource: ClassResource = {
    ...resource,
    id: resId,
    classId,
    teacherId,
    createdAt: Date.now(),
  };

  const path = `classes/${classId}/resources/${resId}`;
  notifySyncStatus({ state: "syncing", message: `Adding resource "${resource.title}"...` });

  try {
    await setDoc(doc(db, "classes", classId, "resources", resId), fullResource);
    notifySyncStatus({
      state: "synced",
      message: `Resource "${resource.title}" added to class!`,
      lastSyncedAt: Date.now(),
    });
    return fullResource;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Sends a real-time office hours message within a class.
 */
export async function sendClassMessage(
  classId: string,
  message: Omit<ClassMessage, "id" | "timestamp">
): Promise<ClassMessage> {
  const msgId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
  const fullMessage: ClassMessage = {
    ...message,
    id: msgId,
    timestamp: Date.now(),
  };

  const path = `classes/${classId}/messages/${msgId}`;

  try {
    await setDoc(doc(db, "classes", classId, "messages", msgId), fullMessage);
    return fullMessage;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Saves the learner brain model to Firestore under users/{userId}/learnerModel/profile
 */
export async function saveLearnerModelToCloud(userId: string, model: any): Promise<void> {
  if (!userId) return;
  const path = `users/${userId}/learnerModel/profile`;
  try {
    await setDoc(doc(db, "users", userId, "learnerModel", "profile"), {
      ...model,
      updatedAt: Date.now(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Fetches the learner brain model from Firestore
 */
export async function fetchLearnerModelFromCloud(userId: string): Promise<any | null> {
  if (!userId) return null;
  const path = `users/${userId}/learnerModel/profile`;
  try {
    const snap = await getDoc(doc(db, "users", userId, "learnerModel", "profile"));
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

/**
 * Records an individual learning event to Firestore for immutable telemetry
 */
export async function recordCloudLearningEvent(userId: string, event: any): Promise<void> {
  if (!userId || !event?.id) return;
  const path = `users/${userId}/learningEvents/${event.id}`;
  try {
    await setDoc(doc(db, "users", userId, "learningEvents", event.id), event);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Fetches learner profiles for multiple enrolled students in a classroom roster.
 * Scoped to authorized classroom data first, then falls back to direct student learner profile.
 */
export async function fetchEnrolledStudentsMastery(
  classId: string,
  studentIds: string[]
): Promise<Record<string, any>> {
  const result: Record<string, any> = {};
  if (!studentIds || studentIds.length === 0) return result;

  await Promise.all(
    studentIds.map(async (sid) => {
      // 1. Try class-scoped mastery doc first
      if (classId) {
        try {
          const classMasterySnap = await getDoc(doc(db, "classes", classId, "studentMastery", sid));
          if (classMasterySnap.exists()) {
            result[sid] = classMasterySnap.data();
            return;
          }
        } catch {
          // Fall through to direct profile lookup
        }
      }

      // 2. Try direct student learnerModel doc (authorized for enrolled teacher)
      try {
        const snap = await getDoc(doc(db, "users", sid, "learnerModel", "profile"));
        if (snap.exists()) {
          result[sid] = snap.data();
        }
      } catch {
        // Student might not have a cloud model yet
      }
    })
  );

  return result;
}

/**
 * Publishes an enrolled student's mastery snapshot into a classroom
 */
export async function publishStudentMasteryToClass(
  classId: string,
  studentId: string,
  model: any
): Promise<void> {
  if (!classId || !studentId || !model) return;
  const path = `classes/${classId}/studentMastery/${studentId}`;
  try {
    await setDoc(doc(db, "classes", classId, "studentMastery", studentId), {
      ...model,
      updatedAt: Date.now(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

