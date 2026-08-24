import { z } from "zod";

export const guidanceEnum = z.enum(["live", "recorded", "self"]);
export type Guidance = z.infer<typeof guidanceEnum>;

export const yogaStyleEnum = z.enum([
  "integral",
  "vinyasa",
  "hatha",
  "ashtanga",
  "yin",
  "restorative",
  "other",
]);
export type YogaStyle = z.infer<typeof yogaStyleEnum>;

export const focusObjectEnum = z.enum([
  "breath",
  "mantra",
  "body_scan",
  "sound",
  "visualization",
  "other",
]);
export type FocusObject = z.infer<typeof focusObjectEnum>;

export const positionEnum = z.enum(["bed", "chair", "zafu", "floor", "cushion", "other"]);
export type Position = z.infer<typeof positionEnum>;


const commonFields = {
  date: z.coerce.date(),
  durationMin: z
    .number()
    .int()
    .positive()
    .max(24 * 60),
  guidance: guidanceEnum,
  // Optional teacher/guide name; only meaningful when the practice is guided.
  // Trimmed; original casing preserved for display.
  teacher: z.string().trim().min(1).max(100).optional().nullable(),
  notes: z.string().max(5000).optional().nullable(),
};

export const yogaPracticeSchema = z.object({
  type: z.literal("yoga"),
  yogaStyle: yogaStyleEnum,
  // Free-text name used only when yogaStyle is "other". Required by the
  // refinement on practiceSchema / practiceUpdateSchema below. Trimmed;
  // original casing preserved for display.
  yogaStyleCustom: z.string().trim().min(1).max(100).optional().nullable(),
  ...commonFields,
});

export const meditationPracticeSchema = z.object({
  type: z.literal("meditation"),
  focusObjects: focusObjectEnum.array().min(1),
  position: positionEnum,
  ...commonFields,
});

export const practiceSchema = z
  .discriminatedUnion("type", [yogaPracticeSchema, meditationPracticeSchema])
  .superRefine((data, ctx) => {
    if (data.type === "yoga" && data.yogaStyle === "other" && !data.yogaStyleCustom) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["yogaStyleCustom"],
        message: "Nombrá el estilo de yoga",
      });
    }
  });

export type PracticeInput = z.infer<typeof practiceSchema>;
export type YogaPracticeInput = z.infer<typeof yogaPracticeSchema>;
export type MeditationPracticeInput = z.infer<typeof meditationPracticeSchema>;

export const practiceUpdateSchema = z
  .union([
    yogaPracticeSchema.partial().extend({ type: z.literal("yoga") }),
    meditationPracticeSchema.partial().extend({ type: z.literal("meditation") }),
  ])
  .superRefine((data, ctx) => {
    if (data.type === "yoga" && data.yogaStyle === "other" && !data.yogaStyleCustom) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["yogaStyleCustom"],
        message: "Nombrá el estilo de yoga",
      });
    }
  });
export type PracticeUpdate = z.infer<typeof practiceUpdateSchema>;
