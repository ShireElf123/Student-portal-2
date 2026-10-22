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

beforeEach(() => {
  cleanup();
  localStorage.clear();
});
afterEach(() => cleanup());

describe("GuidedAssessmentBridge scoring", () => {
  it("blocks Next until a score, and skipped items are not developing", () => {
    const finished: Array<{ developingCount: number; unansweredCount?: number; masteredCount: number }> = [];
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
  });
});
