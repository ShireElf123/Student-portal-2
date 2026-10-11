import type { NextFunction, Request, RequestHandler, Response } from "express";
import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from "jose";
import firebaseConfig from "../firebase-applet-config.json";

const FIREBASE_JWKS_URL =
  "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";

export interface ContentIdentity {
  readonly uid: string;
}

export interface ContentAuthVerifier {
  verify(idToken: string): Promise<ContentIdentity | null>;
}

/** Extracts a Firebase ID token from an `Authorization: Bearer <token>` header. */
export function extractBearerToken(header: string | undefined): string | null {
  if (typeof header !== "string") return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  const token = match?.[1]?.trim();
  return token ? token : null;
}

export function resolveFirebaseProjectId(): string {
  const fromEnv = process.env.FIREBASE_PROJECT_ID;
  const fromConfig = (firebaseConfig as { projectId?: string }).projectId;
  return (fromEnv || fromConfig || "").trim();
}

/**
 * Verifies Firebase ID tokens against Google's public secure-token JWKS.
 * Verification needs only the public project ID (no service-account secret).
 * `keyResolver` is injectable so tests can validate the full verification path offline.
 */
export function createFirebaseContentAuthVerifier(options: {
  projectId?: string;
  keyResolver?: JWTVerifyGetKey;
} = {}): ContentAuthVerifier {
  const projectId = (options.projectId ?? resolveFirebaseProjectId()).trim();
  if (!projectId) {
    console.error(
      "Firebase project ID is unavailable; the AI gateway will reject requests until FIREBASE_PROJECT_ID is configured."
    );
    return { verify: async () => null };
  }
  const keyResolver = options.keyResolver ?? createRemoteJWKSet(new URL(FIREBASE_JWKS_URL));
  return {
    async verify(idToken: string): Promise<ContentIdentity | null> {
      if (!idToken) return null;
      try {
        const { payload } = await jwtVerify(idToken, keyResolver, {
          issuer: `https://securetoken.google.com/${projectId}`,
          audience: projectId,
          algorithms: ["RS256"],
        });
        const uid = typeof payload.sub === "string" && payload.sub.trim()
          ? payload.sub.trim()
          : typeof payload.user_id === "string" && payload.user_id.trim()
            ? payload.user_id.trim()
            : "";
        return uid ? { uid } : null;
      } catch {
        return null;
      }
    },
  };
}

/**
 * Require a verified Firebase identity before an AI route runs.
 * On success the identity is available via `getContentIdentity(res)`.
 */
export function createContentAuthMiddleware(verifier: ContentAuthVerifier): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = extractBearerToken(req.headers.authorization);
    if (!token) {
      res.status(401).json({ error: "Sign in is required to use AI features." });
      return;
    }
    let identity: ContentIdentity | null;
    try {
      identity = await verifier.verify(token);
    } catch {
      identity = null;
    }
    if (!identity) {
      res.status(401).json({ error: "Your sign-in could not be verified. Please sign in again." });
      return;
    }
    res.locals.contentIdentity = identity;
    next();
  };
}

export function getContentIdentity(res: Response): ContentIdentity | null {
  const identity = res.locals.contentIdentity as ContentIdentity | undefined;
  return identity && typeof identity.uid === "string" && identity.uid ? identity : null;
}
