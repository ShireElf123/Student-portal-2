import type { ContentTheme } from "./types";

/** Renderer-owned visual palette. AI content selects a theme, never arbitrary assets or URLs. */
export const STORYBOOK_ILLUSTRATIONS: Readonly<Record<ContentTheme, readonly string[]>> = {
  space: ["🚀", "🌙", "🌍", "⭐", "🛸"],
  garden: ["🌱", "🐞", "🌻", "🦋", "🍓"],
  ocean: ["🐬", "🐠", "🐚", "🐢", "🌊"],
  animals: ["🐻", "🦊", "🐿️", "🦉", "🦒"],
  everyday: ["🧸", "🚌", "🏠", "📚", "🎈"],
};

export function getStorybookIllustration(theme: ContentTheme, pageIndex: number): string {
  if (!Number.isInteger(pageIndex) || pageIndex < 0) throw new Error("Storybook page index must be a non-negative integer.");
  const illustrations = STORYBOOK_ILLUSTRATIONS[theme];
  const illustration = illustrations[pageIndex % illustrations.length];
  if (!illustration) throw new Error(`No storybook illustration is registered for ${theme}.`);
  return illustration;
}
