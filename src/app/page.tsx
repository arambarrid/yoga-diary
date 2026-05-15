import Link from "next/link";
import { PracticeList } from "@/components/PracticeList";
import { Marquee } from "@/components/decorative/Marquee";
import { Sparkle } from "@/components/decorative/Sparkle";
import { listPractices, practiceFilterSchema } from "@/lib/practice";
import { practiceTypeLabels } from "@/lib/labels";
import { cn } from "@/lib/utils";

type SearchParams = Promise<{ type?: string }>;

const MANTRAS = ["respirá", "presente", "ahora", "soltá", "respirá", "presente"];

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const raw = await searchParams;
  const filterParse = practiceFilterSchema.safeParse({ type: raw.type });
  const filter = filterParse.success ? filterParse.data : {};
  const practices = await listPractices(filter);
  const count = practices.length;

  return (
    <div className="flex flex-col gap-10">
      <section className="relative flex flex-col gap-3 pt-4">
        <Sparkle
          size={28}
          className="absolute top-0 left-0 text-warm rotate-12"
        />
        <Sparkle
          size={20}
          className="absolute top-4 right-12 text-meditation-500 -rotate-12"
        />
        <Sparkle
          size={16}
          className="absolute top-20 right-0 text-yoga-500"
        />
        <h1 className="font-display text-display-2xl text-brand-primary leading-none">
          tu diario
        </h1>
        <p className="text-ink-600 text-lg">
          {count === 0
            ? "Todavía no registraste ninguna práctica."
            : `${count} práctica${count === 1 ? "" : "s"} registrada${count === 1 ? "" : "s"}.`}
        </p>
      </section>

      <div className="bg-meditation-100 text-meditation-700 rounded-2xl">
        <Marquee items={MANTRAS} />
      </div>

      <section className="flex flex-col gap-4">
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

        <PracticeList practices={practices} />
      </section>
    </div>
  );
}

function FilterChip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium px-5 py-2 rounded-pill border-2 transition-colors",
        active
          ? "bg-brand-primary text-white border-brand-primary"
          : "bg-surface-white text-ink-900 border-ink-400/20 hover:border-brand-primary hover:text-brand-primary",
      )}
    >
      {label}
    </Link>
  );
}
