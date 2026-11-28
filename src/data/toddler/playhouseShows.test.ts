import { describe, expect, it } from "vitest";
import { PLAYHOUSE_SHOWS } from "./playhouseShows";
import { PLAYHOUSE_COVERS } from "../pictureBookCovers";

describe("playhouse shows", () => {
  it("keeps unique show ids and real spoken scenes", () => {
    const ids = PLAYHOUSE_SHOWS.map((show) => show.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(PLAYHOUSE_SHOWS.length).toBeGreaterThanOrEqual(16);
    for (const show of PLAYHOUSE_SHOWS) {
      expect(show.scenes.length, show.id).toBeGreaterThanOrEqual(6);
      expect(show.scenes.every((scene) => scene.lines.length >= 2)).toBe(true);
    }
  });

  it("gives every show a real coverImage as the single source of truth", () => {
    expect(PLAYHOUSE_SHOWS).toHaveLength(20);
    const images = PLAYHOUSE_SHOWS.map((show) => show.coverImage);
    expect(images.every((src) => Boolean(src) && src!.endsWith(".jpg"))).toBe(true);
    expect(images.some((src) => src?.includes("curtain"))).toBe(false);
    expect(new Set(images).size).toBe(images.length);
    expect(PLAYHOUSE_COVERS).toEqual(
      Object.fromEntries(PLAYHOUSE_SHOWS.map((show) => [show.id, show.coverImage ?? ""])),
    );
  });
});
