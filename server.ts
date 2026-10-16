import express, { type NextFunction, type Request, type Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { aiService } from "./server/aiService";
import { createAiApiRouter } from "./server/aiApi";
import { createAiGateway } from "./server/aiGateway";
import { createContentGenerationRouter } from "./server/contentApi";
import {
  createFirebaseContentAuthVerifier,
  createOptionalIdentityMiddleware,
} from "./server/contentAuth";
import { createTieredRateLimitMiddleware, TieredRateLimiter } from "./server/tieredRateLimit";
import type { AiQuotaStore } from "./server/aiQuota";
import type { ContentAuthVerifier } from "./server/contentAuth";

dotenv.config();

function getTrustedProxyHops(): number | false {
  const configured = process.env.TRUST_PROXY?.trim();
  if (!configured || configured.toLowerCase() === "false") return false;
  if (configured.toLowerCase() === "true") return 1;
  const hops = Number(configured);
  if (Number.isSafeInteger(hops) && hops >= 1) return hops;
  console.warn("Ignoring invalid TRUST_PROXY; set it to a trusted proxy hop count or leave it unset.");
  return false;
}

/** Model credentials are server-side secrets only; the Firebase web key is never a Gemini key. */
function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY || process.env.API_KEY);
}

/**
 * The product intentionally supports signed-out learners (local learning works
 * before sign-in), so the interactive AI routes use *optional* identity: a
 * verified Firebase ID token upgrades the caller to a per-account budget,
 * while anonymous traffic is bounded per network address. Keys are derived
 * server-side only — client-supplied user IDs are never trusted.
 */
const attachOptionalIdentity = createOptionalIdentityMiddleware(createFirebaseContentAuthVerifier());

/** Default per-route abuse budgets (signed-in learner / anonymous visitor). */
export const DEFAULT_RATE_BUDGETS = {
  chat: { authenticated: { maxPerMinute: 8, maxPerDay: 120 }, anonymous: { maxPerMinute: 3, maxPerDay: 15 } },
  practice: { authenticated: { maxPerMinute: 3, maxPerDay: 24 }, anonymous: { maxPerMinute: 2, maxPerDay: 6 } },
  studyPlan: { authenticated: { maxPerMinute: 3, maxPerDay: 20 }, anonymous: { maxPerMinute: 2, maxPerDay: 5 } },
} as const;

export interface ApiAppOptions {
  /**
   * Mount the Vite dev middleware (SPA serving). Defaults to "on outside
   * production"; pass `false` in tests so no dev server is spawned.
   */
  withVite?: boolean;
  /** Test hook: substitute rate limiters (e.g. generous budgets or fake clocks). */
  limiters?: {
    chat?: TieredRateLimiter;
    practice?: TieredRateLimiter;
    studyPlan?: TieredRateLimiter;
  };
  /** Test hook: substitute the durable quota store / identity verifier. */
  gateway?: {
    quotaStore?: AiQuotaStore;
    verifier?: ContentAuthVerifier;
  };
}

/**
 * Build the fully configured Express app. Kept separate from listen() so the
 * API contract (routes, limits, auth tiers, body budgets) can be exercised by
 * integration tests without binding a port or starting Vite.
 */
export async function createApiApp(options: ApiAppOptions = {}): Promise<express.Express> {
  const app = express();

  const chatLimiter =
    options.limiters?.chat ??
    new TieredRateLimiter(DEFAULT_RATE_BUDGETS.chat.authenticated, DEFAULT_RATE_BUDGETS.chat.anonymous);
  const practiceLimiter =
    options.limiters?.practice ??
    new TieredRateLimiter(DEFAULT_RATE_BUDGETS.practice.authenticated, DEFAULT_RATE_BUDGETS.practice.anonymous);
  const studyPlanLimiter =
    options.limiters?.studyPlan ??
    new TieredRateLimiter(DEFAULT_RATE_BUDGETS.studyPlan.authenticated, DEFAULT_RATE_BUDGETS.studyPlan.anonymous);
  const requireChatRateLimit = createTieredRateLimitMiddleware(chatLimiter);
  const requirePracticeRateLimit = createTieredRateLimitMiddleware(practiceLimiter);
  const requireStudyPlanRateLimit = createTieredRateLimitMiddleware(studyPlanLimiter);

  // Use an explicit trusted-hop count; boolean `true` would trust spoofable X-Forwarded-For chains.
  app.set("trust proxy", getTrustedProxyHops());

  // Body budgets: the chat routes carry base64 homework photos, which the
  // browser downscales/compresses before upload (src/utils/imageAttachment.ts
  // keeps prepared payloads under ~1.5 MB of base64) — 2 MB covers that with
  // headroom. Every other JSON payload in this app is a few KB, so those
  // routes get a strict 100 KB budget. The chat routes declare their own
  // parser; the standard parser below skips bodies that are already parsed.
  const chatJsonParser = express.json({ limit: "2mb" });
  const standardJsonParser = express.json({ limit: "100kb" });

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Serve public static assets (favicons, manifest, etc.)
  app.use(express.static(path.resolve(process.cwd(), "public")));

  // Favicon fallback
  app.get("/favicon.ico", (_req, res) => {
    res.type("image/svg+xml").sendFile(path.resolve(process.cwd(), "public/favicon.svg"));
  });

  // Parse + optional identity + guest/signed-in abuse budgets, then the
  // authenticated AI gateway modules own the handlers.
  app.post("/api/chat", chatJsonParser, attachOptionalIdentity, requireChatRateLimit);
  app.post("/api/chat/stream", chatJsonParser, attachOptionalIdentity, requireChatRateLimit);
  app.use(standardJsonParser);
  app.post("/api/practice/generate", attachOptionalIdentity, requirePracticeRateLimit);
  app.post("/api/study-plan/generate", attachOptionalIdentity, requireStudyPlanRateLimit);

  const aiGateway = createAiGateway({
    ...(options.gateway?.verifier ? { verifier: options.gateway.verifier } : {}),
    ...(options.gateway?.quotaStore ? { quotaStore: options.gateway.quotaStore } : {}),
  });
  app.use(createAiApiRouter({
    gateway: aiGateway,
    provider: aiService.getProvider(),
    apiKeyAvailable: isGeminiConfigured,
    allowAnonymous: true,
  }));
  app.use(createContentGenerationRouter({
    gateway: aiGateway,
    apiKeyAvailable: isGeminiConfigured,
  }));

  // Keep JSON parser errors (including oversized image uploads) structured and fail before AI calls.
  app.use((error: unknown, _req: Request, res: Response, next: NextFunction) => {
    const record = error && typeof error === "object" ? error as Record<string, unknown> : {};
    const status = typeof record.status === "number" && Number.isInteger(record.status) ? record.status : 400;
    if (res.headersSent) {
      next(error);
      return;
    }
    if (status === 413) {
      res
        .status(413)
        .json({ error: "That request is too large. If you attached a photo, please pick a smaller image and try again." });
      return;
    }
    if (error instanceof SyntaxError) {
      res.status(400).json({ error: "Request body must contain valid JSON." });
      return;
    }
    console.error("API request could not be parsed.", error);
    res.status(status >= 400 && status < 500 ? status : 400).json({ error: "The request could not be processed." });
  });

  // Vite middleware for development
  const useVite = options.withVite ?? process.env.NODE_ENV !== "production";
  if (useVite) {
    const vite = await createViteServer({
      server: { middlewareMode: true, allowedHosts: [".e2b.app", ".run.app"] },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  return app;
}

async function startServer() {
  const PORT = 3000;
  const app = await createApiApp();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Importing this module for createApiApp() (integration tests) must not bind
// a port; the server boots only when actually run (tsx server.ts / node dist).
if (process.env.NODE_ENV !== "test") {
  startServer();
}
