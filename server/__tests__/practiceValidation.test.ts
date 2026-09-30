import { describe, it, expect } from "vitest";
import {
  validatePracticeRequest,
  validatePracticeQuestions,
} from "../practiceValidation";

function validQuestion(prompt: string, answerIndex = 0) {
  return {
    question: prompt,
    options: ["Alpha option", "Beta option", "Gamma option", "Delta option"],
    correctAnswerIndex: answerIndex,
    explanation: "Alpha is correct because the other options contradict the core rule.",
    hint: "Think about the core rule first.",
  };
}

describe("validatePracticeRequest", () => {
  it("accepts a well-formed request and trims values", () => {
    const result = validatePracticeRequest({
      subject: "  Mathematics ",
      topic: " Fractions ",
      difficulty: "Medium",
      count: 3,
    });
    expect(result.ok).toBe(true);
    if (result.ok === false) throw new Error("unreachable");
    expect(result.request).toEqual({
      subject: "Mathematics",
      topic: "Fractions",
      difficulty: "medium",
      count: 3,
    });
  });

  it("rejects empty subject or topic", () => {
    expect(validatePracticeRequest({ subject: "  ", topic: "x", difficulty: "easy" }).ok).toBe(false);
    expect(validatePracticeRequest({ subject: "x", topic: "", difficulty: "easy" }).ok).toBe(false);
    expect(validatePracticeRequest(null).ok).toBe(false);
    expect(validatePracticeRequest({}).ok).toBe(false);
  });

  it("rejects unknown difficulties", () => {
    const result = validatePracticeRequest({ subject: "s", topic: "t", difficulty: "extreme" });
    expect(result.ok).toBe(false);
    if (result.ok === true) throw new Error("unreachable");
    expect(result.error).toContain("easy");
  });

  it("falls back to 5 for non-numeric counts and clamps to 1-10", () => {
    const fallback = validatePracticeRequest({ subject: "s", topic: "t", difficulty: "hard", count: "many" });
    expect(fallback.ok).toBe(true);
    if (fallback.ok === false) throw new Error("unreachable");
    expect(fallback.request.count).toBe(5);

    const huge = validatePracticeRequest({ subject: "s", topic: "t", difficulty: "hard", count: 99 });
    if (huge.ok === false) throw new Error("unreachable");
    expect(huge.request.count).toBe(10);

    const zero = validatePracticeRequest({ subject: "s", topic: "t", difficulty: "hard", count: 0 });
    if (zero.ok === false) throw new Error("unreachable");
    expect(zero.request.count).toBe(5);
  });
});

describe("validatePracticeQuestions", () => {
  it("accepts a fully valid set and assigns stable ids", () => {
    const result = validatePracticeQuestions(
      [validQuestion("What is one plus one in plain arithmetic?", 1), validQuestion("Which shape has three straight sides?", 2)],
      2,
      (index) => `test-${index}`
    );
    expect(result.valid).toBe(true);
    expect(result.questions).toHaveLength(2);
    expect(result.questions[0].id).toBe("test-0");
    expect(result.questions[1].correctAnswerIndex).toBe(2);
  });

  it("rejects sets with too few valid questions", () => {
    const result = validatePracticeQuestions([validQuestion("What is one plus one in plain arithmetic?")], 2);
    expect(result.valid).toBe(false);
    expect(result.questions).toHaveLength(1);
  });

  it("rejects non-arrays and non-objects", () => {
    expect(validatePracticeQuestions(null, 1).valid).toBe(false);
    expect(validatePracticeQuestions({ not: "array" }, 1).valid).toBe(false);
    expect(validatePracticeQuestions([null, 42, "x"], 1).valid).toBe(false);
  });

  it("rejects short questions, missing explanations, and missing hints", () => {
    const short = { ...validQuestion("Tiny?", 0) };
    expect(validatePracticeQuestions([short], 1).valid).toBe(false);

    const noExplanation = { ...validQuestion("What is one plus one in plain arithmetic?", 0), explanation: "  " };
    expect(validatePracticeQuestions([noExplanation], 1).valid).toBe(false);

    const noHint = { ...validQuestion("What is one plus one in plain arithmetic?", 0), hint: "" };
    expect(validatePracticeQuestions([noHint], 1).valid).toBe(false);
  });

  it("requires exactly 4 unique non-empty options", () => {
    const three = { ...validQuestion("What is one plus one in plain arithmetic?", 0), options: ["a", "b", "c"] };
    expect(validatePracticeQuestions([three], 1).valid).toBe(false);

    const dupes = {
      ...validQuestion("What is one plus one in plain arithmetic?", 0),
      options: ["Same", "same ", "Other", "Another"],
    };
    expect(validatePracticeQuestions([dupes], 1).valid).toBe(false);

    const empty = {
      ...validQuestion("What is one plus one in plain arithmetic?", 0),
      options: ["a", "", "c", "d"],
    };
    expect(validatePracticeQuestions([empty], 1).valid).toBe(false);
  });

  it("rejects out-of-range or non-integer answer indices", () => {
    expect(validatePracticeQuestions([{ ...validQuestion("What is one plus one in plain arithmetic?", 4) }], 1).valid).toBe(false);
    expect(validatePracticeQuestions([{ ...validQuestion("What is one plus one in plain arithmetic?", -1) }], 1).valid).toBe(false);
    expect(validatePracticeQuestions([{ ...validQuestion("What is one plus one in plain arithmetic?", 1.5) }], 1).valid).toBe(false);
  });

  it("rejects duplicate prompts case-insensitively", () => {
    const result = validatePracticeQuestions(
      [
        validQuestion("What is one plus one in plain arithmetic?", 0),
        validQuestion("  WHAT IS ONE PLUS ONE IN PLAIN ARITHMETIC? ", 1),
      ],
      2
    );
    expect(result.valid).toBe(false);
    expect(result.questions).toHaveLength(1);
  });
});
