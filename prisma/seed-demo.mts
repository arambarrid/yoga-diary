// Seeds a demo database with ~3 months of fictional practices so the public
// deployment can be shown without exposing personal records.
//
// Usage (Node 24+ runs TypeScript directly):
//   node --env-file=.env.demo prisma/seed-demo.mts [--reset]
//   (.env.demo holds DEMO_DATABASE_URL, the demo branch direct URL)
//
// It reads DEMO_DATABASE_URL (never DATABASE_URL) so it cannot hit the
// personal database by accident. If the table already has rows it aborts,
// unless --reset is passed, which deletes them first.

import { PrismaClient } from "@prisma/client";

const url = process.env.DEMO_DATABASE_URL;
if (!url) {
  console.error("DEMO_DATABASE_URL is not set.");
  process.exit(1);
}

const prisma = new PrismaClient({ datasourceUrl: url });
const reset = process.argv.includes("--reset");

// Small deterministic PRNG so every run produces the same demo data.
let seed = 42;
function rand(): number {
  seed = (seed * 1664525 + 1013904223) % 2 ** 32;
  return seed / 2 ** 32;
}
function pick<T>(items: readonly T[]): T {
  return items[Math.floor(rand() * items.length)] as T;
}

const yogaStyles = ["vinyasa", "hatha", "yin", "integral", "restorative", "ashtanga"] as const;
const teachers = ["Laura", "Martín", "Sofía"];
const focusObjects = ["breath", "mantra", "body_scan", "sound", "visualization"] as const;
const positions = ["zafu", "cushion", "chair", "floor"] as const;

const yogaNotes = [
  "Mucha apertura de cadera, salí liviana.",
  "Costó arrancar, pero el final en savasana valió la pena.",
  "Probé una secuencia nueva de saludos al sol.",
  "Hombros tensos, me enfoqué en torsiones suaves.",
  "Clase tranquila, mucho trabajo de respiración.",
  null,
  null,
];
const meditationNotes = [
  "Mente inquieta los primeros minutos, después se aquietó.",
  "Muy presente, casi no noté el paso del tiempo.",
  "Me dormí un poco al final.",
  "Buen momento para cerrar el día.",
  null,
  null,
];

type PracticeData = Parameters<typeof prisma.practice.create>[0]["data"];

function buildPractices(): PracticeData[] {
  const practices: PracticeData[] = [];
  for (let daysAgo = 90; daysAgo >= 1; daysAgo--) {
    // Roughly 4-5 practice days per week.
    if (rand() < 0.35) continue;

    const isYoga = rand() < 0.6;

    // Morning yoga (~8h), evening meditation (~21h), in the timezone of the
    // machine running the seed.
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(isYoga ? 8 : 21, Math.floor(rand() * 4) * 15, 0, 0);

    const guidance = isYoga
      ? pick(["live", "live", "recorded", "self"])
      : pick(["self", "self", "recorded"]);
    const teacher = guidance === "self" ? null : pick(teachers);

    if (isYoga) {
      practices.push({
        date,
        type: "yoga",
        durationMin: pick([45, 60, 60, 75, 90]),
        guidance,
        teacher,
        notes: pick(yogaNotes),
        yogaStyle: pick(yogaStyles),
      });
    } else {
      const focus = [pick(focusObjects)];
      if (rand() < 0.3) focus.push(pick(focusObjects));
      practices.push({
        date,
        type: "meditation",
        durationMin: pick([10, 15, 15, 20, 30]),
        guidance,
        teacher,
        notes: pick(meditationNotes),
        focusObjects: [...new Set(focus)],
        position: pick(positions),
      });
    }
  }
  return practices;
}

async function main() {
  const existing = await prisma.practice.count();
  if (existing > 0 && !reset) {
    console.error(`Database already has ${existing} practices. Pass --reset to replace them.`);
    process.exit(1);
  }
  if (reset) await prisma.practice.deleteMany();

  const practices = buildPractices();
  for (const data of practices) await prisma.practice.create({ data });
  console.log(`Seeded ${practices.length} demo practices.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
