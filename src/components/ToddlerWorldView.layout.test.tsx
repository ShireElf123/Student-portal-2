// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { ToddlerWorldView } from "./ToddlerWorldView";

afterEach(() => cleanup());

describe("ToddlerWorldView home HUD", () => {
  it("renders grouped rewards, utilities, buddy stage, and eight destinations", () => {
    const { getByTestId, getByText } = render(
      <ToddlerWorldView onStartAssessment={() => undefined} onRequestExit={() => undefined} />,
    );
    expect(getByTestId("wonder-home-header")).toBeTruthy();
    expect(getByTestId("wonder-utility-rail")).toBeTruthy();
    expect(getByTestId("wonder-buddy-stage")).toBeTruthy();
    expect(getByTestId("wonder-treasure-tray")).toBeTruthy();
    expect(getByTestId("hud-star-count")).toBeTruthy();
    expect(getByTestId("hud-sticker-count")).toBeTruthy();
    expect(getByTestId("hud-champion-chip")).toBeTruthy();
    expect(getByText("Toddler Wonderland")).toBeTruthy();
    expect(getByTestId("toddler-space-nav").querySelectorAll('[role="tab"]')).toHaveLength(8);
  });

  it("opens Games without an intro banner blocking the game grid", () => {
    const { getByTestId, getByText, queryByText } = render(
      <ToddlerWorldView onStartAssessment={() => undefined} onRequestExit={() => undefined} />,
    );
    fireEvent.click(getByTestId("toddler-tab-games"));
    expect(queryByText("Toddler Play Zone")).toBeNull();
    expect(queryByText("Toddler Interactive Quizzes & Play Games")).toBeNull();
    expect(getByText("Xylophone")).toBeTruthy();
    expect(getByText("Safari")).toBeTruthy();
  });
});
