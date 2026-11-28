// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { ToddlerWorldView } from "./ToddlerWorldView";

afterEach(() => cleanup());

async function openToy(getByTestId: (id: string) => HTMLElement, id: string) {
  fireEvent.click(getByTestId(`toddler-tab-${id}`));
  await waitFor(() => expect(getByTestId(`wonder-destination-${id}`)).toBeTruthy());
}

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
    expect(getByTestId("wonder-home-tip").textContent).toMatch(/Tap a picture to play/);
    expect(getByTestId("toddler-space-nav").querySelectorAll('[role="tab"]')).toHaveLength(8);
    expect(queryByText("Pick a land")).toBeNull();
    expect(queryByText("Xylophone")).toBeNull();
  });

  it("opens Games as a dedicated destination without the home launcher", async () => {
    const { getByTestId, getByText, queryByTestId, queryByText } = render(
      <ToddlerWorldView onStartAssessment={() => undefined} onRequestExit={() => undefined} />,
    );
    await openToy(getByTestId, "games");
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

  it("opens Worlds atlas inside the destination shell", async () => {
    const { getByTestId, getByText, queryByTestId } = render(
      <ToddlerWorldView onStartAssessment={() => undefined} onRequestExit={() => undefined} />,
    );
    await openToy(getByTestId, "worlds");
    expect(queryByTestId("toddler-space-nav")).toBeNull();
    expect(getByTestId("wonder-destination-worlds")).toBeTruthy();
    expect(getByText("Pick a land")).toBeTruthy();
  });

  it("returns to the home gateway on browser back", async () => {
    const { getByTestId, queryByTestId } = render(
      <ToddlerWorldView onStartAssessment={() => undefined} onRequestExit={() => undefined} />,
    );
    await openToy(getByTestId, "phonics");
    expect(getByTestId("wonder-destination-phonics")).toBeTruthy();
    fireEvent.popState(window);
    window.dispatchEvent(new PopStateEvent("popstate", { state: {} }));
    expect(queryByTestId("wonder-destination-phonics")).toBeNull();
    expect(getByTestId("wonder-home-header")).toBeTruthy();
  });

  it("returns from an opened game to the Games arcade on browser back", async () => {
    const { getByTestId, queryByTestId } = render(
      <ToddlerWorldView onStartAssessment={() => undefined} onRequestExit={() => undefined} />,
    );
    await openToy(getByTestId, "games");
    fireEvent.click(getByTestId("arcade-game-rainbow-piano"));
    expect(getByTestId("arcade-more-games")).toBeTruthy();
    window.dispatchEvent(
      new PopStateEvent("popstate", {
        state: { wonderlandDestination: { tab: "games" } },
      }),
    );
    await waitFor(() => expect(queryByTestId("arcade-more-games")).toBeNull());
    expect(getByTestId("wonder-arcade-board")).toBeTruthy();
    expect(getByTestId("wonder-destination-games")).toBeTruthy();
  });

  it("returns from a Playhouse show to the Playhouse posters on browser back", async () => {
    const { getByTestId, getByText, queryByText } = render(
      <ToddlerWorldView onStartAssessment={() => undefined} onRequestExit={() => undefined} />,
    );
    await openToy(getByTestId, "playhouse");
    fireEvent.click(getByTestId("playhouse-show-teddy-loose-button"));
    expect(getByText("All plays")).toBeTruthy();
    window.dispatchEvent(
      new PopStateEvent("popstate", {
        state: { wonderlandDestination: { tab: "playhouse" } },
      }),
    );
    await waitFor(() => expect(queryByText("All plays")).toBeNull());
    expect(getByTestId("playhouse-show-teddy-loose-button")).toBeTruthy();
  });

  it("centres destination play inside a max-width shell", async () => {
    const { getByTestId } = render(
      <ToddlerWorldView onStartAssessment={() => undefined} onRequestExit={() => undefined} />,
    );
    await openToy(getByTestId, "games");
    const shell = getByTestId("wonder-destination-games");
    expect(shell.className).toContain("wonder-place");
    const stage = shell.querySelector(".flex-1.max-w-7xl.mx-auto");
    expect(stage).toBeTruthy();
    expect(getByTestId("wonder-place-mark").getAttribute("data-place")).toBe("games");
  });
});
