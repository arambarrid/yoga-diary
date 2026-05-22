import type { Prisma, Practice } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  practiceSchema,
  practiceUpdateSchema,
  type PracticeInput,
  type PracticeUpdate,
} from "@/lib/schemas";

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
    return { ...base, yogaStyle: input.yogaStyle, focusObjects: [], position: null };
  }
  return {
    ...base,
    yogaStyle: null,
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

export { practiceSchema, practiceUpdateSchema };
