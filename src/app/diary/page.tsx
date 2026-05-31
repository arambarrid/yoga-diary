import Link from "next/link";
import { PracticeList } from "@/components/PracticeList";
import { WeekSummary } from "@/components/WeekSummary";
import { listPractices } from "@/lib/practice";
import { cn } from "@/lib/utils";

const LATEST_COUNT = 4;

export default async function DiaryPage() {
  const practices = await listPractices({});
  const latest = practices.slice(0, LATEST_COUNT);
  const weekItems = practices.map((p) => ({
    date: p.date.toISOString(),
    durationMin: p.durationMin,
  }));

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-display text-display-lg text-brand-primary leading-none">Mi diario</h1>
        <p className="text-ink-600 mt-1">Tu práctica, de un vistazo.</p>
      </header>

      <WeekSummary practices={weekItems} />

      <div className="flex gap-3 flex-wrap">
        <DiaryLink href="/diary/practices" label="Ver prácticas" primary />
        <DiaryLink href="/diary/stats" label="Estadísticas" />
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-display-md text-brand-primary leading-none">Últimas</h2>
        <PracticeList practices={latest} />
      </section>
    </div>
  );
}

function DiaryLink({ href, label, primary }: { href: string; label: string; primary?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium px-5 py-2.5 rounded-pill border-2 transition-colors",
        primary
          ? "bg-brand-primary text-white border-brand-primary hover:bg-brand-primary/90"
          : "bg-surface-white text-ink-900 border-ink-400/20 hover:border-brand-primary hover:text-brand-primary",
      )}
    >
      {label}
    </Link>
  );
}
