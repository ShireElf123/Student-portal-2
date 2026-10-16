import type { PictureBook, PictureBookPage } from "../types";
import { PICTURE_BOOKS } from "../data/pictureBooksData";
import type { StorybookComprehensionBlueprint } from "./types";

const CATEGORY_BY_THEME: Record<StorybookComprehensionBlueprint["theme"], PictureBook["category"]> = {
  space: "space",
  garden: "nature",
  ocean: "ocean",
  animals: "animals",
  everyday: "manners",
};

const PAGE_BACKGROUND_BY_THEME: Record<StorybookComprehensionBlueprint["theme"], string> = {
  space: "from-indigo-100 to-sky-200 text-indigo-950",
  garden: "from-emerald-100 to-lime-200 text-emerald-950",
  ocean: "from-cyan-100 to-blue-200 text-cyan-950",
  animals: "from-amber-100 to-orange-200 text-amber-950",
  everyday: "from-violet-100 to-fuchsia-200 text-violet-950",
};

const COVER_GRADIENT_BY_THEME: Record<StorybookComprehensionBlueprint["theme"], string> = {
  space: "from-indigo-500 to-sky-500",
  garden: "from-lime-400 to-emerald-500",
  ocean: "from-cyan-400 to-blue-600",
  animals: "from-amber-400 to-orange-500",
  everyday: "from-violet-400 to-fuchsia-500",
};

/** Converts validated, structured generated pages into the app's existing read-aloud renderer model. */
export function adaptStorybookBlueprintToPictureBook(blueprint: StorybookComprehensionBlueprint): PictureBook {
  const pages: PictureBookPage[] = blueprint.content.rounds.map((round, index) => ({
    pageNumber: index + 1,
    title: round.title,
    text: round.text,
    illustration: round.illustration,
    bgGradient: PAGE_BACKGROUND_BY_THEME[blueprint.theme],
    narration: round.narration,
    interactivePrompt: blueprint.instructions,
    learningInteraction: {
      id: round.id,
      prompt: round.prompt,
      options: [...round.options],
      correctOptionIndex: round.correctOptionIndex,
      skillId: blueprint.skillId,
      questionType: round.questionType,
      hint: round.hint,
      explanation: round.explanation,
    },
  }));

  return {
    id: `generated-${blueprint.id}`,
    title: blueprint.content.storyTitle,
    subtitle: blueprint.content.storySummary,
    ageRange: "Ages 5-7",
    category: CATEGORY_BY_THEME[blueprint.theme],
    coverEmoji: blueprint.content.rounds[0]?.illustration ?? "📖",
    coverGradient: COVER_GRADIENT_BY_THEME[blueprint.theme],
    pages,
    author: "Story Trail",
    readTimeMinutes: Math.max(2, Math.ceil(pages.length / 2)),
  };
}

/** Finds a real, pre-existing picture book page as the graceful offline/provider fallback. */
export function findStaticPictureBookForSkill(skillId: string): { book: PictureBook; pageIndex: number } | null {
  for (const book of PICTURE_BOOKS) {
    const pageIndex = book.pages.findIndex((page) => page.learningInteraction?.skillId === skillId);
    if (pageIndex >= 0) return { book, pageIndex };
  }
  return null;
}
