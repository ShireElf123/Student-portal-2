// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { ToddlerWorldView } from "./ToddlerWorldView";

afterEach(() => cleanup());

describe("ToddlerWorldView home gateway", () => {
  it("renders grouped rewards, utilities, buddy stage, and eight destinations", () => {
    const { getByTestId, getByText, queryByText } = render(
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
    expect(getByText(/Ages 2/)).toBeTruthy();
    expect(getByText("Play inside. Every land is a new place.")).toBeTruthy();
    expect(getByTestId("toddler-space-nav").querySelectorAll('[role="tab"]')).toHaveLength(8);
    expect(queryByText("Pick a land")).toBeNull();
    expect(queryByText("Xylophone")).toBeNull();
  });

  it("opens Games as a dedicated destination without the home launcher", () => {
    const { getByTestId, getByText, queryByTestId, queryByText } = render(
      <ToddlerWorldView onStartAssessment={() => undefined} onRequestExit={() => undefined} />,
    );
    fireEvent.click(getByTestId("toddler-tab-games"));
    expect(queryByTestId("toddler-space-nav")).toBeNull();
    expect(queryByTestId("wonder-home-header")).toBeNull();
    expect(getByTestId("wonder-destination-games")).toBeTruthy();
    expect(queryByText("Toddler Play Zone")).toBeNull();
    expect(queryByText("Toddler Interactive Quizzes & Play Games")).toBeNull();
    expect(getByText("Xylophone")).toBeTruthy();
    expect(getByText("Safari")).toBeTruthy();
    fireEvent.click(getByTestId("wonder-home-back"));
    expect(getByTestId("toddler-space-nav")).toBeTruthy();
    expect(getByTestId("wonder-home-header")).toBeTruthy();
  });

  it("opens Worlds atlas inside the destination shell", () => {
    const { getByTestId, getByText, queryByTestId } = render(
      <ToddlerWorldView onStartAssessment={() => undefined} onRequestExit={() => undefined} />,
    );
    fireEvent.click(getByTestId("toddler-tab-worlds"));
    expect(queryByTestId("toddler-space-nav")).toBeNull();
    expect(getByTestId("wonder-destination-worlds")).toBeTruthy();
    expect(getByText("Pick a land")).toBeTruthy();
  });

  it("returns to the home gateway on browser back", () => {
    const { getByTestId, queryByTestId } = render(
      <ToddlerWorldView onStartAssessment={() => undefined} onRequestExit={() => undefined} />,
    );
    fireEvent.click(getByTestId("toddler-tab-phonics"));
    expect(getByTestId("wonder-destination-phonics")).toBeTruthy();
    fireEvent.popState(window);
    window.dispatchEvent(new PopStateEvent("popstate", { state: {} }));
    expect(queryByTestId("wonder-destination-phonics")).toBeNull();
    expect(getByTestId("wonder-home-header")).toBeTruthy();
  });
});
