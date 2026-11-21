// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";

vi.mock("../utils/speechUtils", () => ({
  speakText: () => true,
  stopSpeaking: () => {},
}));
vi.mock("../utils/soundEffects", () => ({
  soundEffects: { playPop: () => {}, playFanfare: () => {} },
}));

import { ToddlerPlayhouse } from "./ToddlerPlayhouse";
import { PLAYHOUSE_SHOWS } from "../data/toddler/playhouseShows";
import { PLAYHOUSE_COVERS } from "../data/pictureBookCovers";

afterEach(() => cleanup());

describe("Playhouse interiors", () => {
  it("opens a scene on a painted cover, not an emoji-only stage", () => {
    const { container, getByTestId } = render(<ToddlerPlayhouse isMeadow onAddStar={() => {}} />);
    const first = PLAYHOUSE_SHOWS[0];
    const open = Array.from(container.querySelectorAll("button")).find((button) => button.textContent?.includes(first.title));
    fireEvent.click(open as HTMLButtonElement);
    const art = getByTestId("playhouse-scene-art") as HTMLImageElement;
    expect(art.getAttribute("src")).toBe(first.coverImage ?? PLAYHOUSE_COVERS[first.id] ?? "/covers/playhouse-curtain.jpg");
    expect(art.getAttribute("src")?.endsWith(".jpg")).toBe(true);
  });
});
