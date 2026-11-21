import { describe, expect, it } from "vitest";
import { PLAYHOUSE_SHOWS } from "./playhouseShows";

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
});
