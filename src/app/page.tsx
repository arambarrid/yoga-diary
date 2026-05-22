import Link from "next/link";
import { PracticeList } from "@/components/PracticeList";
import { HeroButtons } from "@/components/HeroButtons";
import { listPractices, practiceFilterSchema } from "@/lib/practice";
import { practiceTypeLabels } from "@/lib/labels";
import { cn } from "@/lib/utils";

type SearchParams = Promise<{ type?: string }>;

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const raw = await searchParams;
  const filterParse = practiceFilterSchema.safeParse({ type: raw.type });
  const filter = filterParse.success ? filterParse.data : {};
  const practices = await listPractices(filter);
  const count = practices.length;

  return (
    <div className="flex flex-col gap-16">
      <HeroComposition />

      <section className="flex flex-col gap-5">
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <h2 className="font-display text-display-md text-brand-primary leading-none">
              Tu diario
            </h2>
            <p className="text-sm text-ink-600 mt-1">
              {count === 0
                ? "Todavía sin prácticas registradas"
                : `${count} práctica${count === 1 ? "" : "s"}`}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <FilterChip href="/" label="Todas" active={!filter.type} />
            <FilterChip
              href="/?type=yoga"
              label={practiceTypeLabels.yoga}
              active={filter.type === "yoga"}
            />
            <FilterChip
              href="/?type=meditation"
              label={practiceTypeLabels.meditation}
              active={filter.type === "meditation"}
            />
          </div>
        </div>

        <PracticeList practices={practices} />
      </section>
    </div>
  );
}

function HeroComposition() {
  return (
    <section
      className="w-full mx-auto"
      style={{ maxWidth: "560px" }}
      aria-label="Atajos principales"
    >
      <HeroButtons
        leftBg="var(--color-meditation-700)"
        rightBg="var(--color-pink-vivid)"
        rightText="var(--color-ink-900)"
        leftLabel="Registro"
        rightAlign="center"
      />
    </section>
  );
}

function FilterChip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium px-4 py-1.5 rounded-pill border-2 transition-colors",
        active
          ? "bg-brand-primary text-white border-brand-primary"
          : "bg-surface-white text-ink-900 border-ink-400/20 hover:border-brand-primary hover:text-brand-primary",
      )}
    >
      {label}
    </Link>
  );
}
