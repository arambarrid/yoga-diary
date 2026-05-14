import { describe, it, expect } from "vitest";
import {
  practiceSchema,
  yogaPracticeSchema,
  meditationPracticeSchema,
} from "@/lib/schemas";

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
  focusObject: "breath" as const,
  position: "zafu" as const,
};

describe("practiceSchema (discriminated union)", () => {
  it("parsea una práctica de yoga válida", () => {
    const result = practiceSchema.safeParse(baseYoga);
    expect(result.success).toBe(true);
  });

  it("parsea una práctica de meditación válida", () => {
    const result = practiceSchema.safeParse(baseMeditation);
    expect(result.success).toBe(true);
  });

  it("rechaza yoga sin yogaStyle", () => {
    const { yogaStyle: _omit, ...withoutStyle } = baseYoga;
    void _omit;
    const result = yogaPracticeSchema.safeParse(withoutStyle);
    expect(result.success).toBe(false);
  });

  it("rechaza meditación sin focusObject", () => {
    const { focusObject: _omit, ...withoutFocus } = baseMeditation;
    void _omit;
    const result = meditationPracticeSchema.safeParse(withoutFocus);
    expect(result.success).toBe(false);
  });

  it("rechaza meditación sin position", () => {
    const { position: _omit, ...withoutPosition } = baseMeditation;
    void _omit;
    const result = meditationPracticeSchema.safeParse(withoutPosition);
    expect(result.success).toBe(false);
  });

  it("rechaza práctica sin guidance", () => {
    const { guidance: _omit, ...withoutGuidance } = baseYoga;
    void _omit;
    const result = yogaPracticeSchema.safeParse(withoutGuidance);
    expect(result.success).toBe(false);
  });

  it("rechaza guidance fuera del enum", () => {
    const result = practiceSchema.safeParse({ ...baseYoga, guidance: "invalid" });
    expect(result.success).toBe(false);
  });

  it("rechaza duración no positiva", () => {
    const result = practiceSchema.safeParse({ ...baseYoga, durationMin: 0 });
    expect(result.success).toBe(false);
  });

  it("rechaza mood fuera de rango 1-5", () => {
    const result = practiceSchema.safeParse({ ...baseYoga, moodBefore: 0 });
    expect(result.success).toBe(false);
  });

  it("acepta mood y notas opcionales", () => {
    const result = practiceSchema.safeParse({
      ...baseYoga,
      moodBefore: 3,
      moodAfter: 4,
      notes: "Práctica suave después de un día intenso",
    });
    expect(result.success).toBe(true);
  });
});
