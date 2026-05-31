import type { Practice } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { summarizePractices } from "@/lib/practice";

// Fixture factory: every field has a sane default, override only what the
// test cares about. Keeps test bodies focused on the assertion.
const make = (overrides: Partial<Practice> = {}): Practice => ({
  id: `p-${Math.random().toString(36).slice(2, 8)}`,
  createdAt: new Date("2026-01-01T00:00:00Z"),
  updatedAt: new Date("2026-01-01T00:00:00Z"),
  type: "yoga",
  date: new Date("2026-01-15T12:00:00Z"),
  durationMin: 30,
  guidance: "self",
  moodBefore: null,
  moodAfter: null,
  notes: null,
  yogaStyle: null,
  yogaStyleCustom: null,
  focusObjects: [],
  position: null,
  ...overrides,
});

const TZ_BA = "America/Argentina/Buenos_Aires"; // UTC-3, no DST
const TZ_UTC = "UTC";

describe("summarizePractices — empty input", () => {
  it("returns zeroed counts, empty arrays and null mood deltas", () => {
    const summary = summarizePractices([], TZ_BA);

    expect(summary.byType).toEqual({ yoga: 0, meditation: 0 });
    expect(summary.byWeek).toEqual([]);
    expect(summary.byMonth).toEqual([]);
    expect(summary.yogaStyleDistribution).toEqual([]);
    expect(summary.focusObjectDistribution).toEqual([]);
    expect(summary.moodDeltaByType).toEqual({ yoga: null, meditation: null });
  });
});

describe("summarizePractices — byType", () => {
  it("counts yoga and meditation separately", () => {
    const summary = summarizePractices(
      [make({ type: "yoga" }), make({ type: "yoga" }), make({ type: "meditation" })],
      TZ_UTC,
    );

    expect(summary.byType).toEqual({ yoga: 2, meditation: 1 });
  });
});

describe("summarizePractices — week bucketing", () => {
  it("groups same-week practices and splits across weeks", () => {
    // ISO weeks (Mon-Sun) in UTC for Jan 2026:
    //   week of Mon Jan 12 contains Jan 12–18
    //   week of Mon Jan 19 contains Jan 19–25
    const summary = summarizePractices(
      [
        make({ date: new Date("2026-01-14T10:00:00Z"), durationMin: 30 }), // Wed
        make({ date: new Date("2026-01-18T10:00:00Z"), durationMin: 45 }), // Sun
        make({ date: new Date("2026-01-19T10:00:00Z"), durationMin: 60 }), // Mon
      ],
      TZ_UTC,
    );

    expect(summary.byWeek).toEqual([
      {
        bucketStart: new Date("2026-01-12T00:00:00Z"),
        type: "yoga",
        count: 2,
        totalMin: 75,
      },
      {
        bucketStart: new Date("2026-01-19T00:00:00Z"),
        type: "yoga",
        count: 1,
        totalMin: 60,
      },
    ]);
  });

  it("keeps separate rows per type within the same week", () => {
    const summary = summarizePractices(
      [
        make({ date: new Date("2026-01-14T10:00:00Z"), type: "yoga" }),
        make({ date: new Date("2026-01-15T10:00:00Z"), type: "meditation" }),
      ],
      TZ_UTC,
    );

    expect(summary.byWeek).toHaveLength(2);
    const types = summary.byWeek.map((b) => b.type).sort();
    expect(types).toEqual(["meditation", "yoga"]);
    expect(summary.byWeek.every((b) => b.count === 1)).toBe(true);
  });

  it("places a practice in the user's local week, not UTC's", () => {
    // 2026-01-19T02:00:00Z is Mon 02:00 UTC, but Sun 23:00 in Buenos Aires.
    // In UTC the week is Mon Jan 19; in BA the week is Mon Jan 12.
    const p = make({ date: new Date("2026-01-19T02:00:00Z") });

    const utcSummary = summarizePractices([p], TZ_UTC);
    expect(utcSummary.byWeek[0]!.bucketStart).toEqual(new Date("2026-01-19T00:00:00Z"));

    const baSummary = summarizePractices([p], TZ_BA);
    // Mon Jan 12 00:00 in BA (UTC-3) is Jan 12 03:00 UTC.
    expect(baSummary.byWeek[0]!.bucketStart).toEqual(new Date("2026-01-12T03:00:00Z"));
  });
});

describe("summarizePractices — month bucketing", () => {
  it("places a practice in the user's local month, not UTC's", () => {
    // 2026-02-01T02:00:00Z is Feb 01 02:00 UTC, but Jan 31 23:00 in BA.
    const p = make({ date: new Date("2026-02-01T02:00:00Z") });

    const utcSummary = summarizePractices([p], TZ_UTC);
    expect(utcSummary.byMonth[0]!.bucketStart).toEqual(new Date("2026-02-01T00:00:00Z"));

    const baSummary = summarizePractices([p], TZ_BA);
    // Jan 01 00:00 in BA is Jan 01 03:00 UTC.
    expect(baSummary.byMonth[0]!.bucketStart).toEqual(new Date("2026-01-01T03:00:00Z"));
  });
});

describe("summarizePractices — distributions", () => {
  it("counts yoga styles, sorted desc by count", () => {
    const summary = summarizePractices(
      [
        make({ yogaStyle: "vinyasa" }),
        make({ yogaStyle: "vinyasa" }),
        make({ yogaStyle: "integral" }),
      ],
      TZ_UTC,
    );

    expect(summary.yogaStyleDistribution).toEqual([
      { yogaStyle: "vinyasa", count: 2 },
      { yogaStyle: "integral", count: 1 },
    ]);
  });

  it("counts each focusObject element separately (multi-focus practices)", () => {
    const summary = summarizePractices(
      [
        make({ type: "meditation", focusObjects: ["breath", "mantra"] }),
        make({ type: "meditation", focusObjects: ["breath"] }),
      ],
      TZ_UTC,
    );

    expect(summary.focusObjectDistribution).toEqual([
      { focusObject: "breath", count: 2 },
      { focusObject: "mantra", count: 1 },
    ]);
  });

  it("ignores null yogaStyle and empty focusObjects", () => {
    const summary = summarizePractices(
      [make({ yogaStyle: null }), make({ type: "meditation", focusObjects: [] })],
      TZ_UTC,
    );

    expect(summary.yogaStyleDistribution).toEqual([]);
    expect(summary.focusObjectDistribution).toEqual([]);
  });
});

describe("summarizePractices — moodDeltaByType", () => {
  it("averages (moodAfter - moodBefore) per type", () => {
    const summary = summarizePractices(
      [
        make({ type: "yoga", moodBefore: 2, moodAfter: 4 }), // +2
        make({ type: "yoga", moodBefore: 3, moodAfter: 4 }), // +1
        make({ type: "meditation", moodBefore: 1, moodAfter: 4 }), // +3
      ],
      TZ_UTC,
    );

    expect(summary.moodDeltaByType.yoga).toBeCloseTo(1.5);
    expect(summary.moodDeltaByType.meditation).toBeCloseTo(3);
  });

  it("ignores practices where either mood is null", () => {
    const summary = summarizePractices(
      [
        make({ type: "yoga", moodBefore: 2, moodAfter: 4 }), // counted: +2
        make({ type: "yoga", moodBefore: null, moodAfter: 4 }), // skipped
        make({ type: "yoga", moodBefore: 2, moodAfter: null }), // skipped
      ],
      TZ_UTC,
    );

    expect(summary.moodDeltaByType.yoga).toBe(2);
  });

  it("returns null for a type with no fully-recorded mood data", () => {
    const summary = summarizePractices(
      [make({ type: "yoga", moodBefore: 2, moodAfter: 4 })],
      TZ_UTC,
    );

    expect(summary.moodDeltaByType.meditation).toBeNull();
  });
});
