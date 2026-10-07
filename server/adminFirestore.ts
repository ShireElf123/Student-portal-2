import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import firebaseConfig from "../firebase-applet-config.json";
import { resolveFirebaseProjectId } from "./contentAuth";

const ADMIN_APP_NAME = "student-portal-server-admin";

/** One server-only Firebase Admin app shared by the validated content writer and AI quota store. */
export function getAdminFirestore() {
  const projectId = resolveFirebaseProjectId();
  const databaseId = firebaseConfig.firestoreDatabaseId;
  if (!projectId || !databaseId) {
    throw new Error("Firebase project and Firestore database IDs are required for server-side AI services.");
  }
  const app = getApps().find((candidate) => candidate.name === ADMIN_APP_NAME) ?? initializeApp({
    credential: applicationDefault(),
    projectId,
  }, ADMIN_APP_NAME);
  return getFirestore(app, databaseId);
}
