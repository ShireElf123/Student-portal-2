import { describe, expect, it } from "vitest";
import { PICTURE_BOOKS } from "./pictureBooksData";
import { EPIC_PICTURE_BOOKS } from "./pictureBooksEpics";
import { STUDIO_PICTURE_BOOKS } from "./pictureBooksStudio";
import { FIRST_WORD_PICTURE_BOOKS } from "./pictureBooksFirstWords";
import { PICTURE_BOOK_COVERS } from "./pictureBookCovers";
import { PICTURE_BOOK_SPREADS } from "./pictureBookSpreads";
import { STORY_ADVENTURES } from "./toddler/toddlerWorldsData";
import { CURRICULUM_SKILL_NODES } from "./curriculumUniverse";
import { resolveActivityDefinition } from "./activitySkillRegistry";

const BOOK_SKILLS = new Set(resolveActivityDefinition("picture-book-interaction").skillIds);

describe("story library", () => {
  it("keeps every picture-book id unique", () => {
    const ids = PICTURE_BOOKS.map((book) => book.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("ships long picture books with a real arc, not two-page flashcards", () => {
    expect(EPIC_PICTURE_BOOKS.length).toBeGreaterThanOrEqual(16);
    const longBooks = PICTURE_BOOKS.filter((book) => book.pages.length >= 8);
    expect(longBooks.length).toBeGreaterThanOrEqual(32);
    for (const book of EPIC_PICTURE_BOOKS) {
      expect(book.pages.length, book.id).toBeGreaterThanOrEqual(8);
      expect(book.pages.map((page) => page.pageNumber)).toEqual(
        Array.from({ length: book.pages.length }, (_, index) => index + 1),
      );
    }
    const bear = PICTURE_BOOKS.find((book) => book.id === "little-bear-bedtime");
    expect(bear?.pages.length).toBeGreaterThanOrEqual(8);
  });

  it("adds long stoop tales, look-and-learn, and first-word readers", () => {
    expect(STUDIO_PICTURE_BOOKS.length).toBeGreaterThanOrEqual(12);
    expect(STUDIO_PICTURE_BOOKS.every((book) => book.pages.length >= 8)).toBe(true);
    expect(STUDIO_PICTURE_BOOKS.filter((book) => book.series === "look-learn").length).toBeGreaterThanOrEqual(4);
    expect(STUDIO_PICTURE_BOOKS.filter((book) => book.series === "first-words").length).toBeGreaterThanOrEqual(4);
    expect(STUDIO_PICTURE_BOOKS.filter((book) => book.pages.length >= 12).length).toBeGreaterThanOrEqual(4);
  });

  it("adds more first-word readers and paints Cat on the Mat page-by-page", () => {
    expect(FIRST_WORD_PICTURE_BOOKS.length).toBeGreaterThanOrEqual(6);
    expect(FIRST_WORD_PICTURE_BOOKS.every((book) => book.pages.length >= 8)).toBe(true);
    expect(FIRST_WORD_PICTURE_BOOKS.every((book) => book.series === "first-words")).toBe(true);
    const cat = PICTURE_BOOKS.find((book) => book.id === "cat-on-mat");
    const bus = PICTURE_BOOKS.find((book) => book.id === "red-bus-run");
    const pig = PICTURE_BOOKS.find((book) => book.id === "pig-in-mud");
    const fox = PICTURE_BOOKS.find((book) => book.id === "fox-in-box");
    const dog = PICTURE_BOOKS.find((book) => book.id === "dog-on-log");
    const hen = PICTURE_BOOKS.find((book) => book.id === "hen-in-pen");
    const bug = PICTURE_BOOKS.find((book) => book.id === "bug-in-mug");
    const hop = PICTURE_BOOKS.find((book) => book.id === "hop-on-top");
    expect(cat?.pages.every((page) => Boolean(page.illustrationImage))).toBe(true);
    expect(bus?.pages.every((page) => Boolean(page.illustrationImage))).toBe(true);
    expect(pig?.pages.every((page) => Boolean(page.illustrationImage))).toBe(true);
    expect(fox?.pages.every((page) => Boolean(page.illustrationImage))).toBe(true);
    expect(dog?.pages.every((page) => Boolean(page.illustrationImage))).toBe(true);
    expect(hen?.pages.every((page) => Boolean(page.illustrationImage))).toBe(true);
    expect(bug?.pages.every((page) => Boolean(page.illustrationImage))).toBe(true);
    expect(hop?.pages.every((page) => Boolean(page.illustrationImage))).toBe(true);
    const melon = PICTURE_BOOKS.find((book) => book.id === "stoop-watermelon");
    const boat = PICTURE_BOOKS.find((book) => book.id === "paper-gutter-boat");
    const tomatoes = PICTURE_BOOKS.find((book) => book.id === "window-box-tomatoes");
    const feast = PICTURE_BOOKS.find((book) => book.id === "block-table-feast");
    const mail = PICTURE_BOOKS.find((book) => book.id === "how-mail-travels");
    const bread = PICTURE_BOOKS.find((book) => book.id === "how-bread-rises");
    const rain = PICTURE_BOOKS.find((book) => book.id === "what-rain-does");
    const ferry = PICTURE_BOOKS.find((book) => book.id === "how-a-ferry-floats");
    expect(melon?.pages.every((page) => Boolean(page.illustrationImage))).toBe(true);
    expect(boat?.pages.every((page) => Boolean(page.illustrationImage))).toBe(true);
    expect(tomatoes?.pages.every((page) => Boolean(page.illustrationImage))).toBe(true);
    expect(feast?.pages.every((page) => Boolean(page.illustrationImage))).toBe(true);
    expect(mail?.pages.every((page) => Boolean(page.illustrationImage))).toBe(true);
    expect(bread?.pages.every((page) => Boolean(page.illustrationImage))).toBe(true);
    expect(rain?.pages.every((page) => Boolean(page.illustrationImage))).toBe(true);
    expect(ferry?.pages.every((page) => Boolean(page.illustrationImage))).toBe(true);
    const pot = PICTURE_BOOKS.find((book) => book.id === "hot-pot-sip");
    const hug = PICTURE_BOOKS.find((book) => book.id === "big-hug-bed");
    expect(pot?.pages.every((page) => Boolean(page.illustrationImage))).toBe(true);
    expect(hug?.pages.every((page) => Boolean(page.illustrationImage))).toBe(true);
    const attic = PICTURE_BOOKS.find((book) => book.id === "attic-rain-trunk");
    const ferryHorn = PICTURE_BOOKS.find((book) => book.id === "ferry-horn-morning");
    expect(attic?.pages.every((page) => Boolean(page.illustrationImage))).toBe(true);
    expect(ferryHorn?.pages.every((page) => Boolean(page.illustrationImage))).toBe(true);
    const chalk = PICTURE_BOOKS.find((book) => book.id === "sidewalk-chalk-sun");
    const bakery = PICTURE_BOOKS.find((book) => book.id === "bakery-window-fog");
    expect(chalk?.pages.every((page) => Boolean(page.illustrationImage))).toBe(true);
    expect(bakery?.pages.slice(0, 6).every((page) => Boolean(page.illustrationImage))).toBe(true);
    expect(PICTURE_BOOK_COVERS["hot-pot-sip"]).toBe("/covers/hot-pot-sip.jpg");
    expect(PICTURE_BOOK_COVERS["big-hug-bed"]).toBe("/covers/big-hug-bed.jpg");
    expect(Object.values(PICTURE_BOOK_COVERS).every((path) => path.endsWith(".jpg"))).toBe(true);
    expect(Object.values(PICTURE_BOOK_SPREADS).every((path) => path.endsWith(".jpg"))).toBe(true);
    expect(Object.keys(PICTURE_BOOK_SPREADS).length).toBeGreaterThanOrEqual(16);
  });

  it("maps every scored page to a real picture-book skill", () => {
    const skillIds = new Set(CURRICULUM_SKILL_NODES.map((node) => node.id));
    let scored = 0;
    for (const book of PICTURE_BOOKS) {
      for (const page of book.pages) {
        const interaction = page.learningInteraction;
        if (!interaction) continue;
        scored += 1;
        expect(skillIds.has(interaction.skillId), `${book.id}/${interaction.id}`).toBe(true);
        expect(BOOK_SKILLS.has(interaction.skillId), `${book.id}/${interaction.id}`).toBe(true);
      }
    }
    expect(scored).toBeGreaterThan(12);
  });

  it("keeps interactive story adventures unique and longer than a three-beat demo", () => {
    const ids = STORY_ADVENTURES.map((story) => story.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(STORY_ADVENTURES.length).toBeGreaterThanOrEqual(8);
    expect(STORY_ADVENTURES.every((story) => story.steps.length >= 3)).toBe(true);
    expect(STORY_ADVENTURES.filter((story) => story.steps.length >= 6).length).toBeGreaterThanOrEqual(5);
  });
});
