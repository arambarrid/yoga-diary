import { describe, expect, it } from "vitest";
import { buildWeeklySeries } from "@/lib/stats-series";
import type { PracticeBucket } from "@/lib/practice";

const TZ_UTC = "UTC";
const TZ_BA = "America/Argentina/Buenos_Aires"; // UTC-3, no DST

// Fixture clock: a fixed Friday so "current week" is unambiguous.
//   2026-05-29T15:00:00Z = Fri May 29
//   Current week in UTC starts Mon 2026-05-25.
const NOW = new Date("2026-05-29T15:00:00Z");

const wk = (
  iso: string,
  type: "yoga" | "meditation",
  count: number,
  totalMin = count * 30,
): PracticeBucket => ({
  bucketStart: new Date(iso),
  type,
  count,
  totalMin,
});

describe("buildWeeklySeries — empty buckets", () => {
  it("returns just the current week when no buckets and no `from`", () => {
    const rows = buildWeeklySeries({ buckets: [], tz: TZ_UTC, now: NOW });

    expect(rows).toHaveLength(1);
    expect(rows[0]!.weekStart).toEqual(new Date("2026-05-25T00:00:00Z"));
    expect(rows[0]!.yoga).toBe(0);
    expect(rows[0]!.meditation).toBe(0);
    expect(rows[0]!.totalMin).toBe(0);
    expect(rows[0]!.isCurrent).toBe(true);
  });

  it("fills every week from `from` to current, all empty", () => {
    // `from` = 2026-05-08 (Fri) → its week starts Mon 2026-05-04.
    // Series: Mon May 4, Mon May 11, Mon May 18, Mon May 25 → 4 weeks.
    const from = new Date("2026-05-08T00:00:00Z");
    const rows = buildWeeklySeries({ buckets: [], tz: TZ_UTC, from, now: NOW });

    expect(rows.map((r) => r.weekStart.toISOString())).toEqual([
      "2026-05-04T00:00:00.000Z",
      "2026-05-11T00:00:00.000Z",
      "2026-05-18T00:00:00.000Z",
      "2026-05-25T00:00:00.000Z",
    ]);
    expect(rows.every((r) => r.yoga === 0 && r.meditation === 0)).toBe(true);
    expect(rows[3]!.isCurrent).toBe(true);
    expect(rows.slice(0, 3).every((r) => !r.isCurrent)).toBe(true);
  });
});

describe("buildWeeklySeries — counts and totals", () => {
  it("merges yoga and meditation buckets for the same week", () => {
    const rows = buildWeeklySeries({
      buckets: [
        wk("2026-05-18T00:00:00Z", "yoga", 2, 90),
        wk("2026-05-18T00:00:00Z", "meditation", 1, 15),
      ],
      tz: TZ_UTC,
      from: new Date("2026-05-18T00:00:00Z"),
      now: NOW,
    });

    const may18 = rows.find((r) => r.weekStart.toISOString() === "2026-05-18T00:00:00.000Z");
    expect(may18).toBeDefined();
    expect(may18!.yoga).toBe(2);
    expect(may18!.meditation).toBe(1);
    expect(may18!.totalMin).toBe(105);
  });

  it("places non-current weeks with isCurrent=false", () => {
    const rows = buildWeeklySeries({
      buckets: [wk("2026-05-18T00:00:00Z", "yoga", 1)],
      tz: TZ_UTC,
      from: new Date("2026-05-18T00:00:00Z"),
      now: NOW,
    });

    const may18 = rows.find((r) => r.weekStart.toISOString() === "2026-05-18T00:00:00.000Z")!;
    const may25 = rows.find((r) => r.weekStart.toISOString() === "2026-05-25T00:00:00.000Z")!;
    expect(may18.isCurrent).toBe(false);
    expect(may25.isCurrent).toBe(true);
    expect(may25.yoga).toBe(0); // empty current week still appears
  });
});

describe("buildWeeklySeries — `all` mode", () => {
  it("starts from the earliest bucket when no `from` is given", () => {
    const rows = buildWeeklySeries({
      buckets: [wk("2026-05-04T00:00:00Z", "yoga", 1), wk("2026-05-25T00:00:00Z", "meditation", 1)],
      tz: TZ_UTC,
      now: NOW,
    });

    expect(rows[0]!.weekStart.toISOString()).toBe("2026-05-04T00:00:00.000Z");
    expect(rows[rows.length - 1]!.weekStart.toISOString()).toBe("2026-05-25T00:00:00.000Z");
    expect(rows).toHaveLength(4); // May 4, 11, 18, 25
  });
});

describe("buildWeeklySeries — time-zone behaviour", () => {
  it("anchors the current week to the user's tz, not UTC's", () => {
    // 2026-05-25T01:00:00Z = Sun May 24 22:00 in Buenos Aires (UTC-3).
    // In UTC the current week is Mon May 25; in BA it's still Mon May 18.
    const onSundayLateInBA = new Date("2026-05-25T01:00:00Z");

    const utcRows = buildWeeklySeries({
      buckets: [],
      tz: TZ_UTC,
      now: onSundayLateInBA,
    });
    expect(utcRows[0]!.weekStart.toISOString()).toBe("2026-05-25T00:00:00.000Z");

    const baRows = buildWeeklySeries({
      buckets: [],
      tz: TZ_BA,
      now: onSundayLateInBA,
    });
    // Mon May 18 00:00 BA = May 18 03:00 UTC.
    expect(baRows[0]!.weekStart.toISOString()).toBe("2026-05-18T03:00:00.000Z");
  });
});

describe("buildWeeklySeries — labels", () => {
  it("formats weekLabel as 'DD MMM' in es-AR without a trailing dot", () => {
    const rows = buildWeeklySeries({
      buckets: [],
      tz: TZ_UTC,
      from: new Date("2026-05-25T00:00:00Z"),
      now: NOW,
    });

    expect(rows[0]!.weekLabel).toMatch(/^\d{1,2} \w{3,4}$/);
    expect(rows[0]!.weekLabel.endsWith(".")).toBe(false);
  });
});
