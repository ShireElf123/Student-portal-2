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

  it("does not fire while stopped, and does not fire after unmount", async () => {
    vi.useFakeTimers();
    const onDone = vi.fn();
    const { rerender } = render(<TimerBar seconds={3} running onDone={onDone} />);
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    rerender(<TimerBar seconds={3} running={false} onDone={onDone} />);
    await act(async () => {
      vi.advanceTimersByTime(5000);
    });
    expect(onDone).not.toHaveBeenCalled();

    const late = vi.fn();
    const second = render(<TimerBar seconds={2} running onDone={late} />);
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    second.unmount();
    await act(async () => {
      vi.advanceTimersByTime(5000);
    });
    expect(late).not.toHaveBeenCalled();
  });

  const tick = async (times: number) => {
    for (let i = 0; i < times; i += 1) {
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });
    }
  };

  it("pauses without resetting, then resumes the remaining seconds", async () => {
    vi.useFakeTimers();
    const onDone = vi.fn();
    const { rerender, getByTestId } = render(<TimerBar seconds={5} running onDone={onDone} />);
    await tick(2);
    expect(getByTestId("quiet-seconds-left").textContent).toBe("3s");
    rerender(<TimerBar seconds={5} running={false} onDone={onDone} />);
    await tick(4);
    expect(getByTestId("quiet-seconds-left").textContent).toBe("3s");
    expect(onDone).not.toHaveBeenCalled();
    rerender(<TimerBar seconds={5} running onDone={onDone} />);
    await tick(3);
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("starts a fresh countdown when resetToken changes", async () => {
    vi.useFakeTimers();
    const onDone = vi.fn();
    const { rerender, getByTestId } = render(<TimerBar seconds={4} running resetToken={0} onDone={onDone} />);
    await tick(2);
    rerender(<TimerBar seconds={4} running resetToken={1} onDone={onDone} />);
    expect(getByTestId("quiet-seconds-left").textContent).toBe("4s");
    await tick(4);
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
