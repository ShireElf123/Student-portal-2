// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { ToddlerSpaceNav } from "./ToddlerSpaceNav";
import { TODDLER_SPACE_TABS } from "../data/toddler/toddlerSpaceTabs";

const speak = vi.hoisted(() => ({ spoken: [] as string[] }));

vi.mock("../utils/speechUtils", () => ({
  speakText: (text: string) => {
    speak.spoken.push(text);
    return true;
  },
}));

afterEach(() => {
  cleanup();
  speak.spoken = [];
});

describe("ToddlerSpaceNav", () => {
  it("renders eight tabs and reports the selected destination", () => {
    const chosen: string[] = [];
    const { getByTestId, getByLabelText } = render(
      <ToddlerSpaceNav activeTab="worlds" onSelect={(tab) => chosen.push(tab)} isMeadow />,
    );
    expect(getByLabelText("Toddler destinations")).toBeTruthy();
    for (const tab of TODDLER_SPACE_TABS) {
      expect(getByTestId(`toddler-tab-${tab.id}`).textContent).toContain(tab.label);
    }
    const games = getByTestId("toddler-tab-games");
    fireEvent.click(games);
    expect(chosen).toEqual([]);
    fireEvent.click(games);
    expect(chosen).toEqual(["games"]);
  });

  it("speaks the toy name on first tap and opens on the second", () => {
    const chosen: string[] = [];
    const { getByTestId } = render(
      <ToddlerSpaceNav activeTab={null} onSelect={(tab) => chosen.push(tab)} isMeadow />,
    );
    const games = getByTestId("toddler-tab-games");
    fireEvent.click(games);
    expect(speak.spoken).toEqual(["Games"]);
    expect(games.getAttribute("data-named")).toBe("true");
    expect(chosen).toEqual([]);
    fireEvent.click(games);
    expect(chosen).toEqual(["games"]);
    expect(games.getAttribute("data-named")).toBe("false");
  });

  it("names a different toy instead of opening the first", () => {
    const chosen: string[] = [];
    const { getByTestId } = render(
      <ToddlerSpaceNav activeTab={null} onSelect={(tab) => chosen.push(tab)} isMeadow />,
    );
    fireEvent.click(getByTestId("toddler-tab-games"));
    fireEvent.click(getByTestId("toddler-tab-worlds"));
    expect(speak.spoken).toEqual(["Games", "Worlds"]);
    expect(chosen).toEqual([]);
    fireEvent.click(getByTestId("toddler-tab-worlds"));
    expect(chosen).toEqual(["worlds"]);
  });

  it("marks the active tab for assistive tech", () => {
    const { getByTestId } = render(<ToddlerSpaceNav activeTab="focus" onSelect={() => {}} isMeadow={false} />);
    expect(getByTestId("toddler-tab-focus").getAttribute("aria-selected")).toBe("true");
    expect(getByTestId("toddler-tab-worlds").getAttribute("aria-selected")).toBe("false");
  });
});
