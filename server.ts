import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { aiService } from "./server/aiService";
import { PracticeQuestion, StudyPlanTask } from "./server/types";
import { validatePracticeRequest, validatePracticeQuestions } from "./server/practiceValidation";
import { validateContentGenerationRequest, validateExcludedFingerprints } from "./src/contentEngine/validation";
import { ContentGenerationRateLimiter } from "./server/contentRateLimit";
import { generateGameBlueprintWithProvider } from "./server/contentGeneration";
import {
  createContentAuthMiddleware,
  createFirebaseContentAuthVerifier,
  createOptionalIdentityMiddleware,
  getContentIdentity,
} from "./server/contentAuth";
import { createTieredRateLimitMiddleware, TieredRateLimiter } from "./server/tieredRateLimit";

dotenv.config();

const contentGenerationLimiter = new ContentGenerationRateLimiter(3, 12);
const requireContentAuth = createContentAuthMiddleware(createFirebaseContentAuthVerifier());

// The product intentionally supports signed-out learners (local learning works
// before sign-in), so the interactive AI routes use *optional* identity: a
// verified Firebase ID token upgrades the caller to a per-account budget,
// while anonymous traffic is bounded per network address. Keys are derived
// server-side only — client-supplied user IDs are never trusted.
const attachOptionalIdentity = createOptionalIdentityMiddleware(createFirebaseContentAuthVerifier());

/** Default per-route abuse budgets (signed-in learner / anonymous visitor). */
export const DEFAULT_RATE_BUDGETS = {
  chat: { authenticated: { maxPerMinute: 8, maxPerDay: 120 }, anonymous: { maxPerMinute: 3, maxPerDay: 15 } },
  practice: { authenticated: { maxPerMinute: 3, maxPerDay: 24 }, anonymous: { maxPerMinute: 2, maxPerDay: 6 } },
  studyPlan: { authenticated: { maxPerMinute: 3, maxPerDay: 20 }, anonymous: { maxPerMinute: 2, maxPerDay: 5 } },
} as const;

/**
 * Model credentials are server-side secrets only. The Firebase *web* API key shipped in
 * firebase-applet-config.json and bundled into the client must never be accepted as a
 * Gemini credential; when no server key is configured the AI routes fail closed.
 */
function getApiKey(): string {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.API_KEY ||
    ""
  );
}

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

  // Only trust forwarded headers when explicitly configured, so req.ip cannot be spoofed by default.
  app.set("trust proxy", process.env.TRUST_PROXY === "1" || process.env.TRUST_PROXY === "true");

  // Body budgets: the chat routes carry base64 homework photos, which the
  // browser downscales/compresses before upload (src/utils/imageAttachment.ts
  // keeps prepared payloads under ~1.5 MB of base64) — 2 MB covers that with
  // headroom. Every other JSON payload in this app is a few KB, so those
  // routes get a strict 100 KB budget. The chat routes declare their own
  // parser; the standard parser below skips bodies that are already parsed.
  const chatJsonParser = express.json({ limit: "2mb" });
  const standardJsonParser = express.json({ limit: "100kb" });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Serve public static assets (favicons, manifest, etc.)
  app.use(express.static(path.resolve(process.cwd(), "public")));

  // Favicon fallback
  app.get("/favicon.ico", (req, res) => {
    res.type("image/svg+xml").sendFile(path.resolve(process.cwd(), "public/favicon.svg"));
  });

  // Standard non-streaming chat endpoint
  app.post("/api/chat", chatJsonParser, attachOptionalIdentity, requireChatRateLimit, async (req, res) => {
    try {
      const { message, previousInteractionId, mode = "general", attachment } = req.body;

      if (!getApiKey()) {
        return res.status(500).json({ error: "Academic intelligence core offline: GEMINI_API_KEY is missing." });
      }

      const trimmedMessage = typeof message === "string" ? message.trim() : "";
      if (!trimmedMessage && (!attachment || !attachment.data)) {
        return res.status(400).json({ error: "Please provide a query or attach a study document/image." });
      }

      const response = await aiService.chat({
        message: trimmedMessage,
        previousInteractionId,
        mode,
        attachment,
      });

      return res.json({
        text: response.text,
        interactionId: response.interactionId,
      });
    } catch (error: any) {
      console.error("Chat API Error:", error);
      res.status(error.status || 500).json({
        error: error.message || "A critical error occurred while processing the chat request.",
        code: error.status || 500,
      });
    }
  });

  // Streaming chat endpoint using Server-Sent Events (SSE)
  app.post("/api/chat/stream", chatJsonParser, attachOptionalIdentity, requireChatRateLimit, async (req, res) => {
    try {
      const { message, previousInteractionId, mode = "general", attachment } = req.body;

      if (!getApiKey()) {
        return res.status(500).json({ error: "Academic intelligence core offline: GEMINI_API_KEY is missing." });
      }

      const trimmedMessage = typeof message === "string" ? message.trim() : "";
      if (!trimmedMessage && (!attachment || !attachment.data)) {
        return res.status(400).json({ error: "Please provide a query or attach a study document/image." });
      }

      res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no");
      res.flushHeaders?.();

      const result = await aiService.chatStream(
        {
          message: trimmedMessage,
          previousInteractionId,
          mode,
          attachment,
        },
        (chunkText) => {
          res.write(`data: ${JSON.stringify({ type: "chunk", text: chunkText })}\n\n`);
        }
      );

      res.write(`data: ${JSON.stringify({ type: "done", interactionId: result.interactionId })}\n\n`);
      res.end();
    } catch (error: any) {
      console.error("Stream API Error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message || "Failed to start streaming response" });
      } else {
        res.write(`data: ${JSON.stringify({ type: "error", error: error.message })}\n\n`);
        res.end();
      }
    }
  });

  // All remaining JSON routes accept only small payloads.
  app.use(standardJsonParser);

  // Practice generation endpoint with strict server-side validation
  app.post("/api/practice/generate", attachOptionalIdentity, requirePracticeRateLimit, async (req, res) => {
    try {
      if (!getApiKey()) {
        return res.status(500).json({ error: "Academic intelligence core offline: GEMINI_API_KEY is missing." });
      }

      // 1-5. Validate and clean the request (see server/practiceValidation.ts).
      const requestValidation = validatePracticeRequest(req.body);
      if (requestValidation.ok === false) {
        return res.status(400).json({ error: requestValidation.error });
      }
      const { subject: cleanSubject, topic: cleanTopic, difficulty: cleanDifficulty, count: cleanCount } =
        requestValidation.request;

      // 6. Use strictly cleaned & clamped values in the AI prompt (never raw body)
      let difficultyGuidelines = "";
      if (cleanDifficulty === "easy") {
        difficultyGuidelines = "DIFFICULTY SPECIFICATION: 'EASY' (Foundational / Recognition Level - Bloom's Recall/Understanding). Generate direct single-step questions focusing on core definitions, basic computation, straightforward identification, and easily distinguishable distractors.";
      } else if (cleanDifficulty === "medium") {
        difficultyGuidelines = "DIFFICULTY SPECIFICATION: 'MEDIUM' (Application / Procedural Level - Bloom's Application). Generate multi-step application problems, contextual word problems, interpretation of scenarios, and realistic distractors addressing common student misconceptions.";
      } else {
        difficultyGuidelines = "DIFFICULTY SPECIFICATION: 'HARD' (Analytical / Synthesis Level - Bloom's Analysis/Evaluation). Generate complex multi-step reasoning, non-routine scenarios, subtle edge cases, evaluation of composite statements, and plausible distractors that require deep conceptual mastery to rule out.";
      }

      const prompt = `Generate exactly ${cleanCount} rigorous, high-yield practice multiple-choice questions for:
Subject: "${cleanSubject}"
Topic: "${cleanTopic}"
Difficulty: "${cleanDifficulty}"

${difficultyGuidelines}

Return a valid JSON array of question objects adhering strictly to this schema:
[
  {
    "id": "q-1",
    "question": "Question text here...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswerIndex": 0,
    "explanation": "Clear pedagogical explanation of why this answer is correct and why other options are incorrect.",
    "hint": "Constructive hint that nudges the student towards first principles without giving away the answer directly."
  }
]`;

      const generated = await aiService.generateJSON<unknown>(
        prompt,
        "You are an expert academic examiner and assessment author. Generate accurate questions with exactly 4 options each, one definitive correct answer, and clear pedagogical explanations. Avoid ambiguous wording, trick questions, unsupported facts, and culturally narrow assumptions."
      );

      // Treat model output as untrusted input: validate the full contract before
      // exposing it to learners or recording scores against it.
      const { valid, questions: validQuestions } = validatePracticeQuestions(generated, cleanCount);

      if (!valid) {
        console.warn(`Practice generator returned ${validQuestions.length}/${cleanCount} valid questions.`);
        return res.status(502).json({ error: "The question generator returned an incomplete or invalid set. Please try again." });
      }

      return res.json({
        subject: cleanSubject,
        topic: cleanTopic,
        difficulty: cleanDifficulty,
        count: validQuestions.length,
        questions: validQuestions,
      });
    } catch (error: any) {
      console.error("Practice Generation Error:", error);
      return res.status(500).json({
        error: error.message || "Failed to generate practice questions.",
      });
    }
  });

  // Structured game-content generation. Content is validated before it leaves the server;
  // learner outcomes remain deterministic in the existing game/evidence pipeline.
  app.post("/api/content/generate", requireContentAuth, async (req, res) => {
    const body = req.body && typeof req.body === "object" && !Array.isArray(req.body)
      ? req.body as Record<string, unknown>
      : {};
    let requestSize = 0;
    try {
      requestSize = JSON.stringify(body).length;
    } catch {
      requestSize = Number.POSITIVE_INFINITY;
    }
    if (requestSize > 32_000) {
      return res.status(413).json({ error: "Content generation request is too large." });
    }

    const requestResult = validateContentGenerationRequest(body.request);
    if (!requestResult.valid) {
      return res.status(400).json({ error: "Content generation request is invalid.", errors: requestResult.errors });
    }
    const excludedResult = validateExcludedFingerprints(body.excludedFingerprints ?? []);
    if (!excludedResult.valid) {
      return res.status(400).json({ error: "Content de-duplication data is invalid.", errors: excludedResult.errors });
    }
    if (!getApiKey()) {
      return res.status(503).json({ error: "Structured content generation is unavailable because GEMINI_API_KEY is not configured." });
    }

    const identity = getContentIdentity(res);
    const rateLimit = contentGenerationLimiter.consume(identity?.uid || req.ip || req.socket.remoteAddress || "anonymous");
    if (!rateLimit.allowed) {
      if (rateLimit.retryAfterSeconds > 0) res.setHeader("Retry-After", String(rateLimit.retryAfterSeconds));
      return res.status(429).json({
        error: rateLimit.reason === "daily-limit"
          ? "This address has reached today's content-generation limit. Try cached learning content or come back tomorrow."
          : "Too many content-generation requests. Please wait before trying again.",
      });
    }

    try {
      const outcome = await generateGameBlueprintWithProvider({
        request: requestResult.request,
        excludedFingerprints: excludedResult.fingerprints,
      });
      if (!outcome.valid) {
        console.warn(
          `Structured content generation rejected for learner ${identity?.uid ?? "unknown"} after ${outcome.attempts} attempt(s): ` +
          outcome.errors.map((error) => `${error.code}@${error.field}`).join(", ")
        );
        return res.status(502).json({
          error: "The provider did not produce a valid, original game blueprint within the retry limit.",
          attempts: outcome.attempts,
          errors: outcome.errors,
        });
      }
      return res.json({ blueprint: outcome.blueprint, attempts: outcome.attempts });
    } catch (error: unknown) {
      console.error("Structured content generation failed:", error);
      return res.status(502).json({ error: "Structured content generation failed safely. Curated activities remain available." });
    }
  });

  // Study plan generation endpoint
  app.post("/api/study-plan/generate", attachOptionalIdentity, requireStudyPlanRateLimit, async (req, res) => {
    try {
      if (!getApiKey()) {
        return res.status(500).json({ error: "Academic intelligence core offline: GEMINI_API_KEY is missing." });
      }

      const activeSubjects: string[] = Array.isArray(req.body?.subjects)
        ? req.body.subjects.map((s: any) => String(s).trim()).filter(Boolean)
        : ["Mathematics", "Computer Science", "Humanities", "Science"];

      const prompt = `Create a balanced, realistic, and prioritized daily study plan for a student with courses in: ${activeSubjects.join(", ")}.
Generate 3 to 5 actionable study tasks for today.
Return a valid JSON array adhering strictly to this schema:
[
  {
    "id": "task-1",
    "title": "Clear actionable task title (e.g., Practice integration by parts)",
    "subject": "Name of relevant subject",
    "durationMinutes": 30,
    "priority": "high",
    "reason": "Specific learning rationale for why this should be studied today"
  }
]
Where priority is one of: "high", "medium", "low". Duration is typically between 15 and 45 minutes.`;

      const tasks = await aiService.generateJSON<StudyPlanTask[]>(
        prompt,
        "You are an expert academic advisor and executive function coach. Create actionable, focused study sessions that prevent burnout and foster deep conceptual mastery."
      );

      return res.json({
        tasks: Array.isArray(tasks) ? tasks : [],
      });
    } catch (error: any) {
      console.error("Study Plan Generation Error:", error);
      return res.status(500).json({
        error: error.message || "Failed to generate study plan tasks.",
      });
    }
  });

  // Body-parser failures (e.g. an oversized homework photo that slipped past the
  // client-side compressor) become clean JSON errors the UI can surface, instead
  // of Express's default HTML error page.
  app.use(
    (
      err: { status?: number; type?: string },
      _req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      if (err && err.status === 413) {
        res
          .status(413)
          .json({ error: "That request is too large. If you attached a photo, please pick a smaller image and try again." });
        return;
      }
      next(err);
    }
  );

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
    app.get("*", (req, res) => {
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
