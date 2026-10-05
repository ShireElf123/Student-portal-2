import { beforeEach, describe, expect, it, vi } from "vitest";

const { generateJSON } = vi.hoisted(() => ({ generateJSON: vi.fn() }));
vi.mock("../aiService", () => ({
  aiService: { generateJSON },
}));

import { geminiStructuredContentProvider } from "../contentGeneration";

describe("Gemini structured-content adapter", () => {
  beforeEach(() => generateJSON.mockReset());

  it("forwards the schema prompt through the existing provider-independent AI service", async () => {
    const structuredResponse = { gameType: "speed-math", rounds: [] };
    generateJSON.mockResolvedValue(structuredResponse);
    const result = await geminiStructuredContentProvider.generateStructuredContent(
      "Return this exact structured payload.",
      "Only valid JSON."
    );
    expect(result).toBe(structuredResponse);
    expect(generateJSON).toHaveBeenCalledWith("Return this exact structured payload.", "Only valid JSON.");
  });
});
