import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import firebaseConfig from "../firebase-applet-config.json";
import { SyncStatusInfo } from "./types";

// Keep authentication in the lightweight application shell. Firestore is loaded
// separately when a signed-in user enters a cloud-backed workflow.
export const app = initializeApp(firebaseConfig);
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

// Shared sync state is intentionally independent of Firestore so the shell can
// display honest sync status without eagerly importing the database SDK.
type SyncListener = (info: SyncStatusInfo) => void;
const syncListeners = new Set<SyncListener>();

export function subscribeToSyncStatus(listener: SyncListener) {
  syncListeners.add(listener);
  return () => {
    syncListeners.delete(listener);
  };
}

export function notifySyncStatus(info: SyncStatusInfo) {
  syncListeners.forEach((listener) => {
    try {
      listener(info);
    } catch {
      // A status observer must not prevent other observers from updating.
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
  console.error("Firestore Error:", JSON.stringify(errInfo));
  notifySyncStatus({
    state: "error",
    message: `Cloud sync error on ${path || "operation"}: ${errorMessage.slice(0, 100)}`,
  });
  throw new Error(JSON.stringify(errInfo));
}

export async function signInWithGoogle() {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (err: any) {
    console.error("Error signing in with Google:", err);
    notifySyncStatus({ state: "error", message: err.message || "Failed to sign in with Google" });
    throw err;
  }
}

export async function logOut() {
  try {
    await signOut(auth);
    notifySyncStatus({ state: "synced", message: "Signed out successfully" });
  } catch (err) {
    console.error("Error signing out:", err);
    throw err;
  }
}

// Cloud data APIs are async already; these wrappers preserve their call surface
// while deferring the Firestore bundle until a cloud operation is actually used.
type CloudModule = typeof import("./firebase");

export const syncUserProfile = (...args: Parameters<CloudModule["syncUserProfile"]>): ReturnType<CloudModule["syncUserProfile"]> =>
  import("./firebase").then((cloud) => cloud.syncUserProfile(...args));

export const updateUserRole = (...args: Parameters<CloudModule["updateUserRole"]>): ReturnType<CloudModule["updateUserRole"]> =>
  import("./firebase").then((cloud) => cloud.updateUserRole(...args));

export const fetchUserProfile = (...args: Parameters<CloudModule["fetchUserProfile"]>): ReturnType<CloudModule["fetchUserProfile"]> =>
  import("./firebase").then((cloud) => cloud.fetchUserProfile(...args));

export const generateParentLinkCode = (...args: Parameters<CloudModule["generateParentLinkCode"]>): ReturnType<CloudModule["generateParentLinkCode"]> =>
  import("./firebase").then((cloud) => cloud.generateParentLinkCode(...args));

export const linkChildByCode = (...args: Parameters<CloudModule["linkChildByCode"]>): ReturnType<CloudModule["linkChildByCode"]> =>
  import("./firebase").then((cloud) => cloud.linkChildByCode(...args));

export const unlinkChild = (...args: Parameters<CloudModule["unlinkChild"]>): ReturnType<CloudModule["unlinkChild"]> =>
  import("./firebase").then((cloud) => cloud.unlinkChild(...args));

export const fetchLinkedStudentProfiles = (...args: Parameters<CloudModule["fetchLinkedStudentProfiles"]>): ReturnType<CloudModule["fetchLinkedStudentProfiles"]> =>
  import("./firebase").then((cloud) => cloud.fetchLinkedStudentProfiles(...args));

export const fetchLinkedChildCollection = (...args: Parameters<CloudModule["fetchLinkedChildCollection"]>): ReturnType<CloudModule["fetchLinkedChildCollection"]> =>
  import("./firebase").then((cloud) => cloud.fetchLinkedChildCollection(...args));

export const saveNotebookToCloud = (...args: Parameters<CloudModule["saveNotebookToCloud"]>): ReturnType<CloudModule["saveNotebookToCloud"]> =>
  import("./firebase").then((cloud) => cloud.saveNotebookToCloud(...args));

export const syncAllNotebooksToCloud = (...args: Parameters<CloudModule["syncAllNotebooksToCloud"]>): ReturnType<CloudModule["syncAllNotebooksToCloud"]> =>
  import("./firebase").then((cloud) => cloud.syncAllNotebooksToCloud(...args));

export const deleteNotebookFromCloud = (...args: Parameters<CloudModule["deleteNotebookFromCloud"]>): ReturnType<CloudModule["deleteNotebookFromCloud"]> =>
  import("./firebase").then((cloud) => cloud.deleteNotebookFromCloud(...args));

export const saveStudyPlanItemToCloud = (...args: Parameters<CloudModule["saveStudyPlanItemToCloud"]>): ReturnType<CloudModule["saveStudyPlanItemToCloud"]> =>
  import("./firebase").then((cloud) => cloud.saveStudyPlanItemToCloud(...args));

export const deleteStudyPlanItemFromCloud = (...args: Parameters<CloudModule["deleteStudyPlanItemFromCloud"]>): ReturnType<CloudModule["deleteStudyPlanItemFromCloud"]> =>
  import("./firebase").then((cloud) => cloud.deleteStudyPlanItemFromCloud(...args));

export const savePracticeSessionToCloud = (...args: Parameters<CloudModule["savePracticeSessionToCloud"]>): ReturnType<CloudModule["savePracticeSessionToCloud"]> =>
  import("./firebase").then((cloud) => cloud.savePracticeSessionToCloud(...args));

export const saveTeacherMessageToCloud = (...args: Parameters<CloudModule["saveTeacherMessageToCloud"]>): ReturnType<CloudModule["saveTeacherMessageToCloud"]> =>
  import("./firebase").then((cloud) => cloud.saveTeacherMessageToCloud(...args));

export const saveAssignmentToCloud = (...args: Parameters<CloudModule["saveAssignmentToCloud"]>): ReturnType<CloudModule["saveAssignmentToCloud"]> =>
  import("./firebase").then((cloud) => cloud.saveAssignmentToCloud(...args));

export const saveTeacherResourceToCloud = (...args: Parameters<CloudModule["saveTeacherResourceToCloud"]>): ReturnType<CloudModule["saveTeacherResourceToCloud"]> =>
  import("./firebase").then((cloud) => cloud.saveTeacherResourceToCloud(...args));

export const createClassroom = (...args: Parameters<CloudModule["createClassroom"]>): ReturnType<CloudModule["createClassroom"]> =>
  import("./firebase").then((cloud) => cloud.createClassroom(...args));

export const joinClassroomByCode = (...args: Parameters<CloudModule["joinClassroomByCode"]>): ReturnType<CloudModule["joinClassroomByCode"]> =>
  import("./firebase").then((cloud) => cloud.joinClassroomByCode(...args));

export const createClassAssignment = (...args: Parameters<CloudModule["createClassAssignment"]>): ReturnType<CloudModule["createClassAssignment"]> =>
  import("./firebase").then((cloud) => cloud.createClassAssignment(...args));

export const submitClassAssignment = (...args: Parameters<CloudModule["submitClassAssignment"]>): ReturnType<CloudModule["submitClassAssignment"]> =>
  import("./firebase").then((cloud) => cloud.submitClassAssignment(...args));

export const gradeClassSubmission = (...args: Parameters<CloudModule["gradeClassSubmission"]>): ReturnType<CloudModule["gradeClassSubmission"]> =>
  import("./firebase").then((cloud) => cloud.gradeClassSubmission(...args));

export const addClassResource = (...args: Parameters<CloudModule["addClassResource"]>): ReturnType<CloudModule["addClassResource"]> =>
  import("./firebase").then((cloud) => cloud.addClassResource(...args));

export const sendClassMessage = (...args: Parameters<CloudModule["sendClassMessage"]>): ReturnType<CloudModule["sendClassMessage"]> =>
  import("./firebase").then((cloud) => cloud.sendClassMessage(...args));

export const saveLearnerModelToCloud = (...args: Parameters<CloudModule["saveLearnerModelToCloud"]>): ReturnType<CloudModule["saveLearnerModelToCloud"]> =>
  import("./firebase").then((cloud) => cloud.saveLearnerModelToCloud(...args));

export const fetchLearnerModelFromCloud = (...args: Parameters<CloudModule["fetchLearnerModelFromCloud"]>): ReturnType<CloudModule["fetchLearnerModelFromCloud"]> =>
  import("./firebase").then((cloud) => cloud.fetchLearnerModelFromCloud(...args));

export const recordCloudLearningEvent = (...args: Parameters<CloudModule["recordCloudLearningEvent"]>): ReturnType<CloudModule["recordCloudLearningEvent"]> =>
  import("./firebase").then((cloud) => cloud.recordCloudLearningEvent(...args));

export const fetchEnrolledStudentsMastery = (...args: Parameters<CloudModule["fetchEnrolledStudentsMastery"]>): ReturnType<CloudModule["fetchEnrolledStudentsMastery"]> =>
  import("./firebase").then((cloud) => cloud.fetchEnrolledStudentsMastery(...args));

export const publishStudentMasteryToClass = (...args: Parameters<CloudModule["publishStudentMasteryToClass"]>): ReturnType<CloudModule["publishStudentMasteryToClass"]> =>
  import("./firebase").then((cloud) => cloud.publishStudentMasteryToClass(...args));
