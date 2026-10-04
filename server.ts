import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { aiService } from "./server/aiService";
import { PracticeQuestion, StudyPlanTask } from "./server/types";
import { validatePracticeRequest, validatePracticeQuestions } from "./server/practiceValidation";

import firebaseConfig from "./firebase-applet-config.json";

dotenv.config();

function getApiKey(): string {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.API_KEY ||
    (firebaseConfig as any)?.apiKey ||
    ""
  );
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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
  app.post("/api/chat", async (req, res) => {
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
  app.post("/api/chat/stream", async (req, res) => {
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

  // Practice generation endpoint with strict server-side validation
  app.post("/api/practice/generate", async (req, res) => {
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

  // Study plan generation endpoint
  app.post("/api/study-plan/generate", async (req, res) => {
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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
