import express, { type NextFunction, type Request, type Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { aiService } from "./server/aiService";
import { createAiApiRouter } from "./server/aiApi";
import { createAiGateway } from "./server/aiGateway";
import { createContentGenerationRouter } from "./server/contentApi";

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

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use an explicit trusted-hop count; boolean `true` would trust spoofable X-Forwarded-For chains.
  app.set("trust proxy", getTrustedProxyHops());
  app.use(express.json({ limit: "7mb" }));

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

  // One gateway instance shares authenticated identity, network abuse limits, and durable quotas
  // across chat, practice, study-plan, and structured content generation.
  const aiGateway = createAiGateway();
  app.use(createAiApiRouter({
    gateway: aiGateway,
    provider: aiService.getProvider(),
    apiKeyAvailable: isGeminiConfigured,
  }));
  app.use(createContentGenerationRouter({
    gateway: aiGateway,
    apiKeyAvailable: isGeminiConfigured,
  }));

  // Keep JSON parser errors (including oversized image uploads) structured and fail before AI calls.
  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const record = error && typeof error === "object" ? error as Record<string, unknown> : {};
    const status = typeof record.status === "number" && Number.isInteger(record.status) ? record.status : 400;
    if (res.headersSent) return;
    if (status === 413) {
      res.status(413).json({ error: "Request body is too large." });
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
  if (process.env.NODE_ENV !== "production") {
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
