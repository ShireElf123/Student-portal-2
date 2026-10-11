import express, { type Request, type Response, type Router } from "express";
import type { AIProvider, ChatResponse, PracticeQuestion } from "./types";
import { validatePracticeRequest, validatePracticeQuestions } from "./practiceValidation";
import {
  validateChatRequest,
  validateChatResponse,
  validatePracticeAdmissionRequest,
  validateStudyPlanRequest,
  validateStudyPlanTasks,
} from "./aiValidation";
import { sendAiQuotaDenial, setAiQuotaHeaders } from "./aiGateway";
import type { AiGateway } from "./aiGateway";

export interface AiApiRouterOptions {
  gateway: AiGateway;
  provider?: AIProvider;
  apiKeyAvailable?: () => boolean;
}

const DEFAULT_PRACTICE_SYSTEM_INSTRUCTION =
  "You are an expert academic examiner and assessment author. Generate accurate questions with exactly 4 options each, one definitive correct answer, and clear pedagogical explanations. Avoid ambiguous wording, trick questions, unsupported facts, and culturally narrow assumptions.";
const STUDY_PLAN_SYSTEM_INSTRUCTION =
  "You are an expert academic advisor and executive function coach. Create actionable, focused study sessions that prevent burnout and foster deep conceptual mastery.";

function isProviderConfigured(options: AiApiRouterOptions): boolean {
  return (options.apiKeyAvailable ?? (() => Boolean(process.env.GEMINI_API_KEY || process.env.API_KEY)))();
}

function providerUnavailable(res: Response): Response {
  return res.status(503).json({
    error: "AI services are temporarily unavailable because the server provider is not configured.",
    code: "AI_PROVIDER_UNAVAILABLE",
  });
}

function upstreamFailure(res: Response, operation: string, error: unknown): Response {
  console.error(`${operation} provider request failed.`, error);
  return res.status(502).json({
    error: "The AI provider could not complete this request. Please try again later.",
    code: "AI_PROVIDER_ERROR",
  });
}

function practicePrompt(subject: string, topic: string, difficulty: string, count: number): string {
  let difficultyGuidelines = "";
  if (difficulty === "easy") {
    difficultyGuidelines = "DIFFICULTY SPECIFICATION: 'EASY' (Foundational / Recognition Level - Bloom's Recall/Understanding). Generate direct single-step questions focusing on core definitions, basic computation, straightforward identification, and easily distinguishable distractors.";
  } else if (difficulty === "medium") {
    difficultyGuidelines = "DIFFICULTY SPECIFICATION: 'MEDIUM' (Application / Procedural Level - Bloom's Application). Generate multi-step application problems, contextual word problems, interpretation of scenarios, and realistic distractors addressing common student misconceptions.";
  } else {
    difficultyGuidelines = "DIFFICULTY SPECIFICATION: 'HARD' (Analytical / Synthesis Level - Bloom's Analysis/Evaluation). Generate complex multi-step reasoning, non-routine scenarios, subtle edge cases, evaluation of composite statements, and plausible distractors that require deep conceptual mastery to rule out.";
  }

  return `Generate exactly ${count} rigorous, high-yield practice multiple-choice questions for:
Subject: "${subject}"
Topic: "${topic}"
Difficulty: "${difficulty}"

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
}

function studyPlanPrompt(subjects: string[]): string {
  return `Create a balanced, realistic, and prioritized daily study plan for a student with courses in: ${subjects.join(", ")}.
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
}

export function createAiApiRouter(options: AiApiRouterOptions): Router {
  const router = express.Router();
  const provider = options.provider;

  router.post("/api/chat", options.gateway.authenticate, async (req: Request, res: Response) => {
    const validation = validateChatRequest(req.body);
    if (!validation.valid) return res.status(400).json({ error: validation.error, code: "INVALID_CHAT_REQUEST" });
    if (!isProviderConfigured(options) || !provider) return providerUnavailable(res);

    const admission = await options.gateway.admit(
      req,
      res,
      "chat",
      validation.request.attachment ? 2 : 1
    );
    if (!admission.allowed) return sendAiQuotaDenial(res, admission);
    setAiQuotaHeaders(res, admission);

    try {
      const generated: ChatResponse = await provider.chat(validation.request);
      const response = validateChatResponse(generated);
      if (!response) {
        return res.status(502).json({ error: "The AI provider returned an invalid response.", code: "AI_PROVIDER_INVALID_RESPONSE" });
      }
      return res.json(response);
    } catch (error) {
      return upstreamFailure(res, "Chat", error);
    }
  });

  router.post("/api/chat/stream", options.gateway.authenticate, async (req: Request, res: Response) => {
    const validation = validateChatRequest(req.body);
    if (!validation.valid) return res.status(400).json({ error: validation.error, code: "INVALID_CHAT_REQUEST" });
    if (!isProviderConfigured(options) || !provider) return providerUnavailable(res);

    const admission = await options.gateway.admit(
      req,
      res,
      "chat",
      validation.request.attachment ? 2 : 1
    );
    if (!admission.allowed) return sendAiQuotaDenial(res, admission);
    setAiQuotaHeaders(res, admission);

    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders?.();

    try {
      const result = await provider.chatStream(validation.request, (chunkText) => {
        if (chunkText && !res.destroyed) {
          res.write(`data: ${JSON.stringify({ type: "chunk", text: chunkText })}\n\n`);
        }
      });
      if (!res.destroyed) {
        res.write(`data: ${JSON.stringify({ type: "done", interactionId: result.interactionId })}\n\n`);
        res.end();
      }
    } catch (error) {
      console.error("Streaming chat provider request failed.", error);
      if (!res.headersSent) {
        return res.status(502).json({
          error: "The AI provider could not complete this request. Please try again later.",
          code: "AI_PROVIDER_ERROR",
        });
      }
      if (!res.destroyed) {
        res.write(`data: ${JSON.stringify({ type: "error", error: "The AI provider could not complete this request." })}\n\n`);
        res.end();
      }
    }
  });

  router.post("/api/practice/generate", options.gateway.authenticate, async (req: Request, res: Response) => {
    const requestValidation = validatePracticeRequest(req.body);
    if (requestValidation.ok === false) {
      return res.status(400).json({ error: requestValidation.error, code: "INVALID_PRACTICE_REQUEST" });
    }
    if (!isProviderConfigured(options) || !provider) return providerUnavailable(res);

    const { subject, topic, difficulty, count } = requestValidation.request;
    const admission = await options.gateway.admit(
      req,
      res,
      "practice",
      validatePracticeAdmissionRequest(requestValidation.request)
    );
    if (!admission.allowed) return sendAiQuotaDenial(res, admission);
    setAiQuotaHeaders(res, admission);

    try {
      const generated = await provider.generateJSON<unknown>(
        practicePrompt(subject, topic, difficulty, count),
        DEFAULT_PRACTICE_SYSTEM_INSTRUCTION
      );
      const { valid, questions }: { valid: boolean; questions: PracticeQuestion[] } =
        validatePracticeQuestions(generated, count);
      if (!valid) {
        console.warn(`Practice generator returned ${questions.length}/${count} valid questions.`);
        return res.status(502).json({
          error: "The question generator returned an incomplete or invalid set. Please try again.",
          code: "AI_PROVIDER_INVALID_RESPONSE",
        });
      }
      return res.json({ subject, topic, difficulty, count: questions.length, questions });
    } catch (error) {
      return upstreamFailure(res, "Practice generation", error);
    }
  });

  router.post("/api/study-plan/generate", options.gateway.authenticate, async (req: Request, res: Response) => {
    const requestValidation = validateStudyPlanRequest(req.body);
    if (!requestValidation.valid) {
      return res.status(400).json({ error: requestValidation.error, code: "INVALID_STUDY_PLAN_REQUEST" });
    }
    if (!isProviderConfigured(options) || !provider) return providerUnavailable(res);

    const admission = await options.gateway.admit(req, res, "study_plan", 1);
    if (!admission.allowed) return sendAiQuotaDenial(res, admission);
    setAiQuotaHeaders(res, admission);

    try {
      const generated = await provider.generateJSON<unknown>(
        studyPlanPrompt(requestValidation.subjects),
        STUDY_PLAN_SYSTEM_INSTRUCTION
      );
      const tasks = validateStudyPlanTasks(generated);
      if (!tasks.valid) {
        return res.status(502).json({
          error: "The study-plan generator returned incomplete or invalid tasks. Please try again.",
          code: "AI_PROVIDER_INVALID_RESPONSE",
        });
      }
      return res.json({ tasks: tasks.tasks });
    } catch (error) {
      return upstreamFailure(res, "Study-plan generation", error);
    }
  });

  return router;
}
