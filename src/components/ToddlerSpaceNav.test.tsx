// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
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
  it("renders eight tabs and reports the selected destination", async () => {
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
    expect(games.getAttribute("data-opening")).toBe("true");
    await waitFor(() => expect(chosen).toEqual(["games"]));
  });

  it("opens on one tap without speaking the category name", async () => {
    const chosen: string[] = [];
    const { getByTestId } = render(
      <ToddlerSpaceNav activeTab={null} onSelect={(tab) => chosen.push(tab)} isMeadow />,
    );
    const games = getByTestId("toddler-tab-games");
    fireEvent.click(games);
    expect(speak.spoken).toEqual([]);
    expect(games.getAttribute("data-opening")).toBe("true");
    expect(chosen).toEqual([]);
    await waitFor(() => expect(chosen).toEqual(["games"]));
  });

  it("ignores a second tap while the open motion is playing", async () => {
    const chosen: string[] = [];
    const { getByTestId } = render(
      <ToddlerSpaceNav activeTab={null} onSelect={(tab) => chosen.push(tab)} isMeadow />,
    );
    fireEvent.click(getByTestId("toddler-tab-games"));
    fireEvent.click(getByTestId("toddler-tab-worlds"));
    expect(speak.spoken).toEqual([]);
    expect(getByTestId("toddler-tab-games").getAttribute("data-opening")).toBe("true");
    expect(getByTestId("toddler-tab-worlds").getAttribute("data-opening")).toBe("false");
    await waitFor(() => expect(chosen).toEqual(["games"]));
  });

  it("marks the active tab for assistive tech", () => {
    const { getByTestId } = render(<ToddlerSpaceNav activeTab="focus" onSelect={() => {}} isMeadow={false} />);
    expect(getByTestId("toddler-tab-focus").getAttribute("aria-selected")).toBe("true");
    expect(getByTestId("toddler-tab-worlds").getAttribute("aria-selected")).toBe("false");
  });
});
