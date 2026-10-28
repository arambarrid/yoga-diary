import { describe, it, expect } from "vitest";
import { practiceSchema, yogaPracticeSchema, meditationPracticeSchema } from "@/lib/schemas";

const baseYoga = {
  type: "yoga" as const,
  date: "2026-05-14T08:00:00.000Z",
  durationMin: 60,
  guidance: "self" as const,
  yogaStyle: "vinyasa" as const,
};

const baseMeditation = {
  type: "meditation" as const,
  date: "2026-05-14T08:00:00.000Z",
  durationMin: 15,
  guidance: "recorded" as const,
  focusObjects: ["breath"] as const,
  position: "zafu" as const,
};

describe("practiceSchema (discriminated union)", () => {
  it("parses a valid yoga practice", () => {
    const result = practiceSchema.safeParse(baseYoga);
    expect(result.success).toBe(true);
  });

  it("parses a valid meditation practice", () => {
    const result = practiceSchema.safeParse(baseMeditation);
    expect(result.success).toBe(true);
  });

  it("rejects a yoga practice without yogaStyle", () => {
    const { yogaStyle: _omit, ...withoutStyle } = baseYoga;
    void _omit;
    const result = yogaPracticeSchema.safeParse(withoutStyle);
    expect(result.success).toBe(false);
  });

  it("rejects a meditation practice without focusObjects", () => {
    const { focusObjects: _omit, ...withoutFocus } = baseMeditation;
    void _omit;
    const result = meditationPracticeSchema.safeParse(withoutFocus);
    expect(result.success).toBe(false);
  });

  it("rejects a meditation practice with an empty focusObjects array", () => {
    const result = meditationPracticeSchema.safeParse({
      ...baseMeditation,
      focusObjects: [],
    });
    expect(result.success).toBe(false);
  });

  it("accepts a meditation practice with multiple focusObjects", () => {
    const result = meditationPracticeSchema.safeParse({
      ...baseMeditation,
      focusObjects: ["breath", "mantra", "visualization"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects a meditation practice without position", () => {
    const { position: _omit, ...withoutPosition } = baseMeditation;
    void _omit;
    const result = meditationPracticeSchema.safeParse(withoutPosition);
    expect(result.success).toBe(false);
  });

  it("rejects a practice without guidance", () => {
    const { guidance: _omit, ...withoutGuidance } = baseYoga;
    void _omit;
    const result = yogaPracticeSchema.safeParse(withoutGuidance);
    expect(result.success).toBe(false);
  });

  it("rejects a guidance value outside the enum", () => {
    const result = practiceSchema.safeParse({ ...baseYoga, guidance: "invalid" });
    expect(result.success).toBe(false);
  });

  it("rejects a non-positive duration", () => {
    const result = practiceSchema.safeParse({ ...baseYoga, durationMin: 0 });
    expect(result.success).toBe(false);
  });

  it("accepts optional notes", () => {
    const result = practiceSchema.safeParse({
      ...baseYoga,
      notes: "Soft practice after an intense day",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a yoga practice with style 'other' but no custom name", () => {
    const result = practiceSchema.safeParse({ ...baseYoga, yogaStyle: "other" });
    expect(result.success).toBe(false);
  });

  it("accepts a yoga practice with style 'other' and a custom name", () => {
    const result = practiceSchema.safeParse({
      ...baseYoga,
      yogaStyle: "other",
      yogaStyleCustom: "Iyengar",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a blank custom name (trimmed) for style 'other'", () => {
    const result = practiceSchema.safeParse({
      ...baseYoga,
      yogaStyle: "other",
      yogaStyleCustom: "   ",
    });
    expect(result.success).toBe(false);
  });

  it("accepts (and ignores) yogaStyleCustom when style is a known enum", () => {
    const result = practiceSchema.safeParse({
      ...baseYoga,
      yogaStyle: "vinyasa",
      yogaStyleCustom: "ignored",
    });
    expect(result.success).toBe(true);
  });

  it("accepts an optional teacher on a guided practice", () => {
    const result = practiceSchema.safeParse({ ...baseYoga, guidance: "live", teacher: "Lu" });
    expect(result.success).toBe(true);
  });

  it("accepts a practice without a teacher", () => {
    const result = practiceSchema.safeParse(baseYoga);
    expect(result.success).toBe(true);
  });

  it("rejects a blank teacher (trimmed)", () => {
    const result = practiceSchema.safeParse({ ...baseYoga, guidance: "live", teacher: "   " });
    expect(result.success).toBe(false);
  });
});
