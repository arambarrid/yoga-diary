import type {
  FocusObject,
  Guidance,
  Position,
  YogaStyle,
} from "@/lib/schemas";

export const guidanceLabels: Record<Guidance, string> = {
  live: "Guiada en vivo",
  recorded: "Guiada grabada",
  self: "Autoguiada",
};

export const yogaStyleLabels: Record<YogaStyle, string> = {
  integral:"Integral",
  vinyasa: "Vinyasa",
  hatha: "Hatha",
  ashtanga: "Ashtanga",
  yin: "Yin",
  restorative: "Restaurativa",
  other: "Otro",
};

export const focusObjectLabels: Record<FocusObject, string> = {
  breath: "Respiración",
  mantra: "Mantra",
  body_scan: "Body scan",
  sound: "Sonidos",
  visualization: "Visualización",
  other: "Otro",
};

export const positionLabels: Record<Position, string> = {
  bed: "Cama",
  chair: "Silla",
  zafu: "Zafu",
  floor: "Piso",
  cushion: "Almohadón",
  other: "Otro",
};

export const practiceTypeLabels = {
  yoga: "Yoga",
  meditation: "Meditación",
} as const;
