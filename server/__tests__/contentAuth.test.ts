import { describe, expect, it } from "vitest";
import type { NextFunction, Request, Response } from "express";
import { createLocalJWKSet, exportJWK, generateKeyPair, SignJWT } from "jose";
import {
  createContentAuthMiddleware,
  createFirebaseContentAuthVerifier,
  extractBearerToken,
  resolveFirebaseProjectId,
} from "../contentAuth";

const PROJECT_ID = "student-portal-test";
const ISSUER = `https://securetoken.google.com/${PROJECT_ID}`;

let cachedKeys: {
  privateKey: Awaited<ReturnType<typeof generateKeyPair>>["privateKey"];
  jwks: ReturnType<typeof createLocalJWKSet>;
} | null = null;

async function testKeys() {
  if (!cachedKeys) {
    const { publicKey, privateKey } = await generateKeyPair("RS256");
    const jwk = { ...(await exportJWK(publicKey)), alg: "RS256", kid: "test-key" };
    cachedKeys = { privateKey, jwks: createLocalJWKSet({ keys: [jwk] }) };
  }
  return cachedKeys;
}

async function signToken(overrides: {
  audience?: string;
  issuer?: string;
  expiresIn?: string;
  subject?: string;
  useDifferentKey?: boolean;
} = {}): Promise<string> {
  const { privateKey } = await testKeys();
  const signingKey = overrides.useDifferentKey
    ? (await generateKeyPair("RS256")).privateKey
    : privateKey;
  const payload = overrides.subject === undefined ? { user_id: "learner-uid-1" } : { user_id: overrides.subject };
  const builder = new SignJWT(payload)
    .setProtectedHeader({ alg: "RS256", kid: "test-key" })
    .setIssuedAt()
    .setIssuer(overrides.issuer ?? ISSUER)
    .setAudience(overrides.audience ?? PROJECT_ID)
    .setExpirationTime(overrides.expiresIn ?? "5m");
  return overrides.subject === undefined ? builder.sign(signingKey) : builder.setSubject(overrides.subject).sign(signingKey);
}

function fakeResponse() {
  const res = {
    statusCode: 200,
    payload: undefined as unknown,
    locals: {} as Record<string, unknown>,
    status(code: number) { this.statusCode = code; return this; },
    json(body: unknown) { this.payload = body; return this; },
  };
  return res;
}

describe("Firebase content authentication", () => {
  it("verifies a genuine RS256 Firebase ID token and returns its uid", async () => {
    const authVerifier = await verifierWithKeys();
    const identity = await authVerifier.verify(await signToken());
    expect(identity).toEqual({ uid: "learner-uid-1" });
  });

  it("rejects expired, mis-audienced, mis-issued, wrong-key, wrong-algorithm, and malformed tokens", async () => {
    const authVerifier = await verifierWithKeys();
    await expect(authVerifier.verify(await signToken({ expiresIn: "-1m" }))).resolves.toBeNull();
    await expect(authVerifier.verify(await signToken({ audience: "other-project" }))).resolves.toBeNull();
    await expect(authVerifier.verify(await signToken({ issuer: "https://example.com" }))).resolves.toBeNull();
    await expect(authVerifier.verify(await signToken({ useDifferentKey: true }))).resolves.toBeNull();
    await expect(authVerifier.verify("not-a-jwt")).resolves.toBeNull();
    await expect(authVerifier.verify("")).resolves.toBeNull();

    const hs256 = await new SignJWT({ user_id: "learner-uid-1" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setIssuer(ISSUER)
      .setAudience(PROJECT_ID)
      .setSubject("learner-uid-1")
      .setExpirationTime("5m")
      .sign(new TextEncoder().encode("shared-secret"));
    await expect(authVerifier.verify(hs256)).resolves.toBeNull();
  });

  it("rejects a token with no usable subject claim", async () => {
    const authVerifier = await verifierWithKeys();
    const { privateKey } = await testKeys();
    const token = await new SignJWT({})
      .setProtectedHeader({ alg: "RS256", kid: "test-key" })
      .setIssuedAt()
      .setIssuer(ISSUER)
      .setAudience(PROJECT_ID)
      .setExpirationTime("5m")
      .sign(privateKey);
    await expect(authVerifier.verify(token)).resolves.toBeNull();
  });

  it("fails closed when no Firebase project ID can be resolved", async () => {
    const authVerifier = createFirebaseContentAuthVerifier({ projectId: "   " });
    await expect(authVerifier.verify("any-token")).resolves.toBeNull();
  });

  it("extracts bearer tokens case-insensitively and rejects malformed headers", () => {
    expect(extractBearerToken("Bearer abc.def.ghi")).toBe("abc.def.ghi");
    expect(extractBearerToken("bearer abc.def.ghi")).toBe("abc.def.ghi");
    expect(extractBearerToken("Bearer   abc.def.ghi  ")).toBe("abc.def.ghi");
    expect(extractBearerToken("Basic abc")).toBeNull();
    expect(extractBearerToken("Bearer ")).toBeNull();
    expect(extractBearerToken(undefined)).toBeNull();
  });

  it("resolves a project ID from the committed Firebase config", () => {
    expect(resolveFirebaseProjectId().length).toBeGreaterThan(0);
  });

  it("guards the route: 401 without or with an unverifiable token, else next() with the identity", async () => {
    const middleware = createContentAuthMiddleware(await verifierWithKeys());

    const missing = fakeResponse();
    await middleware(
      { headers: {} } as unknown as Request,
      missing as unknown as Response,
      (() => { throw new Error("next must not be called"); }) as unknown as NextFunction
    );
    expect(missing.statusCode).toBe(401);

    const invalid = fakeResponse();
    await middleware(
      { headers: { authorization: "Bearer not-a-jwt" } } as unknown as Request,
      invalid as unknown as Response,
      (() => { throw new Error("next must not be called"); }) as unknown as NextFunction
    );
    expect(invalid.statusCode).toBe(401);

    const valid = fakeResponse();
    let nextCalled = false;
    await middleware(
      { headers: { authorization: `Bearer ${await signToken()}` } } as unknown as Request,
      valid as unknown as Response,
      (() => { nextCalled = true; }) as unknown as NextFunction
    );
    expect(nextCalled).toBe(true);
    expect(valid.locals.contentIdentity).toEqual({ uid: "learner-uid-1" });
  });
});

async function verifierWithKeys() {
  const { jwks } = await testKeys();
  return createFirebaseContentAuthVerifier({ projectId: PROJECT_ID, keyResolver: jwks });
}
