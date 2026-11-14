// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { ToddlerSpaceNav } from "./ToddlerSpaceNav";
import { TODDLER_SPACE_TABS } from "../data/toddler/toddlerSpaceTabs";

afterEach(() => cleanup());

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
    fireEvent.click(getByTestId("toddler-tab-games"));
    expect(chosen).toEqual(["games"]);
  });

  it("marks the active tab for assistive tech", () => {
    const { getByTestId } = render(<ToddlerSpaceNav activeTab="focus" onSelect={() => {}} isMeadow={false} />);
    expect(getByTestId("toddler-tab-focus").getAttribute("aria-selected")).toBe("true");
    expect(getByTestId("toddler-tab-worlds").getAttribute("aria-selected")).toBe("false");
  });
});
