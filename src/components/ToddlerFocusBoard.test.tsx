// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render } from "@testing-library/react";
import { TimerBar } from "./ToddlerFocusBoard";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("Quiet TimerBar", () => {
  it("fires onDone once even when the parent callback identity changes", async () => {
    vi.useFakeTimers();
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = render(<TimerBar seconds={2} running onDone={first} />);
    rerender(<TimerBar seconds={2} running onDone={second} />);
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    rerender(<TimerBar seconds={2} running onDone={second} />);
    await act(async () => {
      vi.advanceTimersByTime(1500);
    });
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});
