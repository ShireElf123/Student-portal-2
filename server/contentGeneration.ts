import { aiService } from "./aiService";
import { generateValidatedGameBlueprint, StructuredContentProvider } from "../src/contentEngine/generation";
import type { GenerateBlueprintCommand } from "../src/contentEngine/types";

/** Adapter boundary: Gemini is the current provider, but the content engine accepts any provider. */
export const geminiStructuredContentProvider: StructuredContentProvider = {
  name: "gemini",
  generateStructuredContent(prompt, systemInstruction) {
    return aiService.generateJSON<unknown>(prompt, systemInstruction);
  },
};

export function generateGameBlueprintWithProvider(
  command: GenerateBlueprintCommand,
  provider: StructuredContentProvider = geminiStructuredContentProvider
) {
  return generateValidatedGameBlueprint(command.request, provider, {
    excludedFingerprints: command.excludedFingerprints,
  });
}
