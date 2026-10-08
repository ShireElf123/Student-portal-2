import { auth } from "../firebaseCore";

/** Returns a freshly obtained Firebase ID-token header for protected AI endpoints. */
export async function getAiAuthorizationHeader(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("Sign in to use AI features. Saved learning activities remain available.");
  try {
    const token = await user.getIdToken();
    if (!token) throw new Error("Missing Firebase ID token.");
    return `Bearer ${token}`;
  } catch {
    throw new Error("Your sign-in could not be verified. Please sign in again.");
  }
}
