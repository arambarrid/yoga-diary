// Chart-ready time series for the /stats page.
//
// `PracticeBucket[]` from `getPracticeSummary` only contains weeks that have
// at least one practice. For a chart, we want every week in the visible range
// — including the empty ones — so the x-axis reads as a continuous timeline
// and the current week is always present. This module builds that filled
// series in the user's time zone.

import { addWeeks, startOfWeek } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import type { PracticeBucket } from "@/lib/practice";

export type WeeklySeriesRow = {
  weekStart: Date;
  weekLabel: string;
  yoga: number;
  meditation: number;
  totalMin: number;
  isCurrent: boolean;
};

export function buildWeeklySeries(opts: {
  buckets: PracticeBucket[];
  tz: string;
  /** Range start; when omitted the series starts at the earliest bucket. */
  from?: Date;
  /** Injectable clock for tests. Defaults to the real `now`. */
  now?: Date;
}): WeeklySeriesRow[] {
  const now = opts.now ?? new Date();

  // Aggregate buckets across types per week-start key.
  type Agg = { yoga: number; meditation: number; totalMin: number };
  const byKey = new Map<string, Agg>();
  for (const b of opts.buckets) {
    const key = b.bucketStart.toISOString();
    const cur = byKey.get(key) ?? { yoga: 0, meditation: 0, totalMin: 0 };
    cur[b.type as "yoga" | "meditation"] += b.count;
    cur.totalMin += b.totalMin;
    byKey.set(key, cur);
  }

  const seriesEnd = weekStartIn(now, opts.tz);
  const seriesStart = computeSeriesStart(opts, seriesEnd);
  const endKey = seriesEnd.toISOString();

  const rows: WeeklySeriesRow[] = [];
  let cursor = seriesStart;
  // Safety bound: 10 years of weekly buckets is plenty for a personal diary.
  let safety = 0;
  while (cursor.getTime() <= seriesEnd.getTime() && safety < 520) {
    const key = cursor.toISOString();
    const agg = byKey.get(key) ?? { yoga: 0, meditation: 0, totalMin: 0 };
    rows.push({
      weekStart: cursor,
      weekLabel: formatWeekLabel(cursor, opts.tz),
      yoga: agg.yoga,
      meditation: agg.meditation,
      totalMin: agg.totalMin,
      isCurrent: key === endKey,
    });
    cursor = nextWeek(cursor, opts.tz);
    safety += 1;
  }
  return rows;
}

function weekStartIn(d: Date, tz: string): Date {
  const zoned = toZonedTime(d, tz);
  return fromZonedTime(startOfWeek(zoned, { weekStartsOn: 1 }), tz);
}

function nextWeek(weekStart: Date, tz: string): Date {
  // Add 7 days in the user's zone so DST jumps don't drift the cursor.
  const zoned = toZonedTime(weekStart, tz);
  return fromZonedTime(addWeeks(zoned, 1), tz);
}

function computeSeriesStart(
  opts: { buckets: PracticeBucket[]; tz: string; from?: Date },
  fallback: Date,
): Date {
  if (opts.from) return weekStartIn(opts.from, opts.tz);
  if (opts.buckets.length === 0) return fallback;
  // "all" mode with data: start from the earliest practice's week.
  const earliest = opts.buckets.reduce(
    (min, b) => (b.bucketStart.getTime() < min.getTime() ? b.bucketStart : min),
    opts.buckets[0]!.bucketStart,
  );
  // Bucket starts are already aligned to a week start in some tz; re-align
  // in the *current* tz in case it differs.
  return weekStartIn(earliest, opts.tz);
}

function formatWeekLabel(weekStart: Date, tz: string): string {
  // "18 may" — Spanish short month, no trailing dot.
  const raw = new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
    timeZone: tz,
  }).format(weekStart);
  return raw.replace(/\.$/, "");
}
