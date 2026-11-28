// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";

vi.mock("../utils/speechUtils", () => ({
  speakText: () => true,
  stopSpeaking: () => {},
  isVoiceMuted: () => false,
  setVoiceMuted: () => {},
  speechCoordinator: { subscribe: () => () => {} },
}));
vi.mock("../utils/learnerBrain", () => ({
  getActiveLearnerId: () => "test-learner",
  recordLearningEvent: () => {},
}));

import { GuidedAssessmentBridge } from "./GuidedAssessmentBridge";
import { GUIDED_ASSESSMENTS } from "../data/assessmentTemplates";
import type { AssessmentResult } from "../types";

beforeEach(() => {
  cleanup();
  localStorage.clear();
});
afterEach(() => cleanup());

describe("GuidedAssessmentBridge scoring", () => {
  it("blocks Next until a score, and skipped items are not developing", () => {
    const finished: AssessmentResult[] = [];
    const { getByText, getByRole } = render(
      <GuidedAssessmentBridge onAssessmentCompleted={(result) => finished.push(result)} />,
    );

    expect((getByRole("button", { name: /Next Checkpoint/i }) as HTMLButtonElement).disabled).toBe(true);

    const first = GUIDED_ASSESSMENTS[0];
    fireEvent.click(getByText("🌟 Mastered"));
    fireEvent.click(getByRole("button", { name: /Next Checkpoint/i }));

    for (let i = 1; i < first.items.length; i += 1) {
      fireEvent.click(getByText("Skip — not scored"));
    }

    expect(finished).toHaveLength(1);
    expect(finished[0].masteredCount).toBe(1);
    expect(finished[0].developingCount).toBe(0);
    expect(finished[0].unansweredCount).toBe(first.items.length - 1);
    expect(finished[0].itemScores[first.items[0].id]).toBe("mastered");
    expect(Object.values(finished[0].itemScores).filter((score) => score === "not_assessed")).toHaveLength(
      first.items.length - 1,
    );

    const stored = Object.keys(localStorage)
      .map((key) => localStorage.getItem(key))
      .find((value) => value?.includes(finished[0].id));
    expect(stored).toBeTruthy();
    expect(stored).toContain("\"unansweredCount\":");
    expect(stored).not.toMatch(/"developingCount":[1-9]/);
  });
});
