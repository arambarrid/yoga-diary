import type { Prisma, Practice } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  practiceSchema,
  practiceUpdateSchema,
  type PracticeInput,
  type PracticeUpdate,
} from "@/lib/schemas";
import { startOfMonth, startOfWeek } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

export const practiceFilterSchema = z.object({
  type: z.enum(["yoga", "meditation"]).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});
export type PracticeFilter = z.infer<typeof practiceFilterSchema>;

export function toCreateInput(input: PracticeInput): Prisma.PracticeCreateInput {
  const base = {
    type: input.type,
    date: input.date,
    durationMin: input.durationMin,
    guidance: input.guidance,
    moodBefore: input.moodBefore ?? null,
    moodAfter: input.moodAfter ?? null,
    notes: input.notes ?? null,
  };
  if (input.type === "yoga") {
    return {
      ...base,
      yogaStyle: input.yogaStyle,
      yogaStyleCustom: input.yogaStyle === "other" ? (input.yogaStyleCustom ?? null) : null,
      focusObjects: [],
      position: null,
    };
  }
  return {
    ...base,
    yogaStyle: null,
    yogaStyleCustom: null,
    focusObjects: input.focusObjects,
    position: input.position,
  };
}

export function toUpdateInput(input: PracticeUpdate): Prisma.PracticeUpdateInput {
  const data: Prisma.PracticeUpdateInput = {};
  if (input.date !== undefined) data.date = input.date;
  if (input.durationMin !== undefined) data.durationMin = input.durationMin;
  if (input.guidance !== undefined) data.guidance = input.guidance;
  if (input.moodBefore !== undefined) data.moodBefore = input.moodBefore;
  if (input.moodAfter !== undefined) data.moodAfter = input.moodAfter;
  if (input.notes !== undefined) data.notes = input.notes;
  if (input.type === "yoga" && input.yogaStyle !== undefined) {
    data.yogaStyle = input.yogaStyle;
    data.yogaStyleCustom = input.yogaStyle === "other" ? (input.yogaStyleCustom ?? null) : null;
  }
  if (input.type === "meditation") {
    if (input.focusObjects !== undefined) data.focusObjects = input.focusObjects;
    if (input.position !== undefined) data.position = input.position;
  }
  return data;
}

export async function listPractices(filter: PracticeFilter): Promise<Practice[]> {
  const where: Prisma.PracticeWhereInput = {};
  if (filter.type) where.type = filter.type;
  if (filter.from || filter.to) {
    where.date = {};
    if (filter.from) where.date.gte = filter.from;
    if (filter.to) where.date.lte = filter.to;
  }
  return prisma.practice.findMany({
    where,
    orderBy: { date: "desc" },
  });
}

export async function getPractice(id: string): Promise<Practice | null> {
  return prisma.practice.findUnique({ where: { id } });
}

export async function createPractice(input: PracticeInput): Promise<Practice> {
  return prisma.practice.create({ data: toCreateInput(input) });
}

export async function updatePractice(id: string, input: PracticeUpdate): Promise<Practice> {
  return prisma.practice.update({ where: { id }, data: toUpdateInput(input) });
}

export async function deletePractice(id: string): Promise<void> {
  await prisma.practice.delete({ where: { id } });
}

// Distinct custom yoga style names previously entered, for autocompletion in
// the form. De-duplicated case-insensitively; original casing preserved (first
// occurrence wins, ordered alphabetically).
export async function listYogaStyleCustoms(): Promise<string[]> {
  const rows = await prisma.practice.findMany({
    where: { yogaStyleCustom: { not: null } },
    select: { yogaStyleCustom: true },
    orderBy: { yogaStyleCustom: "asc" },
  });
  const seen = new Set<string>();
  const result: string[] = [];
  for (const { yogaStyleCustom } of rows) {
    if (!yogaStyleCustom) continue;
    const key = yogaStyleCustom.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(yogaStyleCustom);
  }
  return result;
}

export { practiceSchema, practiceUpdateSchema };

// --- Practice summary (issue #9, phase 1) ----------------------------------
// Single query + in-memory bucketing. Time-zone-aware: week and month buckets
// are computed in the caller's `tz` (the browser's local zone), then mapped
// back to UTC instants for stable comparisons / chart x-axes.

type PracticeType = "yoga" | "meditation";

export type PracticeBucket = {
  bucketStart: Date;
  type: PracticeType;
  count: number;
  totalMin: number;
};

export type PracticeSummary = {
  byType: Record<PracticeType, number>;
  byWeek: PracticeBucket[]; // weeks start on Monday in the user's TZ
  byMonth: PracticeBucket[];
  yogaStyleDistribution: Array<{ yogaStyle: string; count: number }>;
  focusObjectDistribution: Array<{ focusObject: string; count: number }>;
  // average of (moodAfter - moodBefore); null when no practice of that type
  // has both moods recorded.
  moodDeltaByType: Record<PracticeType, number | null>;
};

export const practiceSummaryFilterSchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  tz: z.string().min(1),
});
export type PracticeSummaryFilter = z.infer<typeof practiceSummaryFilterSchema>;

export async function getPracticeSummary(filter: PracticeSummaryFilter): Promise<PracticeSummary> {
  const where: Prisma.PracticeWhereInput = {};
  if (filter.from || filter.to) {
    where.date = {};
    if (filter.from) where.date.gte = filter.from;
    if (filter.to) where.date.lte = filter.to;
  }
  const practices = await prisma.practice.findMany({
    where,
    orderBy: { date: "asc" },
  });
  return summarizePractices(practices, filter.tz);
}

// Pure aggregation, extracted so unit tests can feed in fixture arrays without
// touching Prisma. Exported for tests; `getPracticeSummary` above is the
// production entry point.
export function summarizePractices(practices: Practice[], tz: string): PracticeSummary {
  const byType: Record<PracticeType, number> = { yoga: 0, meditation: 0 };
  const weekMap = new Map<string, PracticeBucket>();
  const monthMap = new Map<string, PracticeBucket>();
  const yogaStyleMap = new Map<string, number>();
  const focusObjectMap = new Map<string, number>();
  const moodSum: Record<PracticeType, { sum: number; n: number }> = {
    yoga: { sum: 0, n: 0 },
    meditation: { sum: 0, n: 0 },
  };

  const bumpBucket = (
    map: Map<string, PracticeBucket>,
    bucketStart: Date,
    type: PracticeType,
    durationMin: number,
  ) => {
    const key = `${bucketStart.toISOString()}|${type}`;
    const entry = map.get(key) ?? { bucketStart, type, count: 0, totalMin: 0 };
    entry.count += 1;
    entry.totalMin += durationMin;
    map.set(key, entry);
  };

  for (const p of practices) {
    const type = p.type as PracticeType;
    byType[type] += 1;

    // Bucket in the user's zone, then store the UTC instant of that bucket
    // start so two readers with the same tz always get the same key.
    const zoned = toZonedTime(p.date, tz);
    const weekStart = fromZonedTime(startOfWeek(zoned, { weekStartsOn: 1 }), tz);
    const monthStart = fromZonedTime(startOfMonth(zoned), tz);
    bumpBucket(weekMap, weekStart, type, p.durationMin);
    bumpBucket(monthMap, monthStart, type, p.durationMin);

    if (p.yogaStyle) {
      yogaStyleMap.set(p.yogaStyle, (yogaStyleMap.get(p.yogaStyle) ?? 0) + 1);
    }
    for (const fo of p.focusObjects) {
      focusObjectMap.set(fo, (focusObjectMap.get(fo) ?? 0) + 1);
    }
    if (p.moodBefore !== null && p.moodAfter !== null) {
      moodSum[type].sum += p.moodAfter - p.moodBefore;
      moodSum[type].n += 1;
    }
  }

  const byBucketStart = (a: PracticeBucket, b: PracticeBucket) =>
    a.bucketStart.getTime() - b.bucketStart.getTime();
  const byCountDesc = <T extends { count: number }>(a: T, b: T) => b.count - a.count;

  return {
    byType,
    byWeek: Array.from(weekMap.values()).sort(byBucketStart),
    byMonth: Array.from(monthMap.values()).sort(byBucketStart),
    yogaStyleDistribution: Array.from(yogaStyleMap, ([yogaStyle, count]) => ({
      yogaStyle,
      count,
    })).sort(byCountDesc),
    focusObjectDistribution: Array.from(focusObjectMap, ([focusObject, count]) => ({
      focusObject,
      count,
    })).sort(byCountDesc),
    moodDeltaByType: {
      yoga: moodSum.yoga.n > 0 ? moodSum.yoga.sum / moodSum.yoga.n : null,
      meditation: moodSum.meditation.n > 0 ? moodSum.meditation.sum / moodSum.meditation.n : null,
    },
  };
}
