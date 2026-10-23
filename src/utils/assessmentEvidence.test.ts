import { describe, expect, it } from "vitest";
import { tallyAssessmentScores } from "./assessmentEvidence";

describe("tallyAssessmentScores", () => {
  it("does not count blanks or skips as developing", () => {
    const tallied = tallyAssessmentScores(["a", "b", "c", "d"], {
      a: "mastered",
      b: "not_assessed",
    });
    expect(tallied.mastered).toBe(1);
    expect(tallied.developing).toBe(0);
    expect(tallied.needsPractice).toBe(0);
    expect(tallied.unanswered).toBe(3);
    expect(tallied.scored).toBe(1);
    expect(tallied.starsAwarded).toBe(5);
    expect(tallied.itemScores).toEqual({
      a: "mastered",
      b: "not_assessed",
      c: "not_assessed",
      d: "not_assessed",
    });
  });

  it("awards no stars when every item is unanswered", () => {
    const tallied = tallyAssessmentScores(["a", "b"], {});
    expect(tallied.percent).toBe(0);
    expect(tallied.starsAwarded).toBe(0);
    expect(tallied.developing).toBe(0);
  });
});
