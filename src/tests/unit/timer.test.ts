import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { computeRemainingMs, formatRemaining, minutesToMs } from "@/lib/timer";

describe("minutesToMs", () => {
  it("converts whole minutes to milliseconds", () => {
    expect(minutesToMs(5)).toBe(300_000);
    expect(minutesToMs(10)).toBe(600_000);
  });

  it("rounds fractional minutes", () => {
    expect(minutesToMs(0.5)).toBe(30_000);
  });
});

describe("computeRemainingMs", () => {
  it("returns the full duration when no time has elapsed", () => {
    expect(computeRemainingMs(0, 0, 60_000)).toBe(60_000);
  });

  it("decreases by the elapsed amount", () => {
    expect(computeRemainingMs(15_000, 0, 60_000)).toBe(45_000);
  });

  it("returns zero exactly when the duration is reached", () => {
    expect(computeRemainingMs(60_000, 0, 60_000)).toBe(0);
  });

  it("clamps to zero when the duration is exceeded", () => {
    expect(computeRemainingMs(70_000, 0, 60_000)).toBe(0);
  });

  it("works with non-zero start timestamps", () => {
    expect(computeRemainingMs(1_005_000, 1_000_000, 10_000)).toBe(5_000);
  });
});

describe("formatRemaining", () => {
  it("formats whole minutes as MM:SS", () => {
    expect(formatRemaining(60_000)).toBe("01:00");
  });

  it("formats minutes and seconds", () => {
    expect(formatRemaining(125_000)).toBe("02:05");
  });

  it("rounds up partial seconds so the clock never reaches 00:00 too early", () => {
    expect(formatRemaining(1)).toBe("00:01");
    expect(formatRemaining(500)).toBe("00:01");
    expect(formatRemaining(999)).toBe("00:01");
  });

  it("returns 00:00 for zero or negative input", () => {
    expect(formatRemaining(0)).toBe("00:00");
    expect(formatRemaining(-1_000)).toBe("00:00");
  });
});

// Demonstrates Vitest fake timers — useful for any time-dependent logic.
describe("computeRemainingMs with mocked clock", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("tracks elapsed time as the mocked clock advances", () => {
    const startedAt = Date.now();
    const durationMs = minutesToMs(5);

    expect(computeRemainingMs(Date.now(), startedAt, durationMs)).toBe(300_000);

    vi.advanceTimersByTime(60_000);
    expect(computeRemainingMs(Date.now(), startedAt, durationMs)).toBe(240_000);

    vi.advanceTimersByTime(240_000);
    expect(computeRemainingMs(Date.now(), startedAt, durationMs)).toBe(0);

    vi.advanceTimersByTime(10_000);
    expect(computeRemainingMs(Date.now(), startedAt, durationMs)).toBe(0);
  });
});
