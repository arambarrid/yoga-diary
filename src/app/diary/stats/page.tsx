import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { TzGuard } from "@/components/stats/TzGuard";
import { DurationChart } from "@/components/stats/charts/DurationChart";
import { FrequencyChart } from "@/components/stats/charts/FrequencyChart";
import { TypeDistributionChart } from "@/components/stats/charts/TypeDistributionChart";
import { getPracticeSummary, type PracticeSummary } from "@/lib/practice";
import { buildWeeklySeries } from "@/lib/stats-series";
import { focusObjectLabels, practiceTypeLabels, yogaStyleLabels } from "@/lib/labels";
import type { FocusObject, YogaStyle } from "@/lib/schemas";
import { cn } from "@/lib/utils";

// Issue #9 — phase 2: charts via Recharts + ranked bar lists for
// distributions. The page itself stays a server component; the chart
// children are client components that receive plain data via props.

type RangeKey = "30" | "90" | "all";
const RANGE_LABELS: Record<RangeKey, string> = {
  "30": "30 días",
  "90": "90 días",
  all: "Todo",
};
const DEFAULT_RANGE: RangeKey = "30";

type SearchParams = Promise<{ range?: string; tz?: string }>;

function parseRange(raw: string | undefined): {
  key: RangeKey;
  from?: Date;
  to?: Date;
} {
  if (raw === "all") return { key: "all" };
  const key: RangeKey = raw === "90" ? "90" : "30";
  const days = key === "90" ? 90 : 30;
  const to = new Date();
  const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);
  return { key, from, to };
}

export default async function StatsPage({ searchParams }: { searchParams: SearchParams }) {
  const raw = await searchParams;

  // Wait for TzGuard to populate `?tz=` before doing any TZ-sensitive
  // bucketing.
  if (!raw.tz) {
    return (
      <div className="flex flex-col gap-6">
        <TzGuard />
        <PageHeader />
        <p className="text-ink-600">Cargando…</p>
      </div>
    );
  }

  const range = parseRange(raw.range);
  const summary = await getPracticeSummary({
    tz: raw.tz,
    from: range.from,
    to: range.to,
  });
  const weeklySeries = buildWeeklySeries({
    buckets: summary.byWeek,
    tz: raw.tz,
    from: range.from,
  });
  const yogaStyles = summary.yogaStyleDistribution.map((s) => ({
    label: yogaStyleLabels[s.yogaStyle as YogaStyle] ?? s.yogaStyle,
    count: s.count,
  }));
  const focusObjects = summary.focusObjectDistribution.map((f) => ({
    label: focusObjectLabels[f.focusObject as FocusObject] ?? f.focusObject,
    count: f.count,
  }));

  return (
    <div className="flex flex-col gap-8">
      <PageHeader />
      <RangeFilter active={range.key} tz={raw.tz} />
      <ByTypeSection summary={summary} />

      <section className="flex flex-col gap-3">
        <SectionHeading>Tendencia semanal</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChartCard caption="Sesiones por semana">
            <FrequencyChart data={weeklySeries} />
          </ChartCard>
          <ChartCard caption="Minutos por semana">
            <DurationChart data={weeklySeries} />
          </ChartCard>
        </div>
      </section>

      {(yogaStyles.length > 0 || focusObjects.length > 0) && (
        <section className="flex flex-col gap-3">
          <SectionHeading>Distribución</SectionHeading>
          <Card variant="soft" padding="md">
            <TypeDistributionChart yogaStyles={yogaStyles} focusObjects={focusObjects} />
          </Card>
        </section>
      )}

      <MoodDeltaSection summary={summary} />
    </div>
  );
}

function PageHeader() {
  return (
    <header>
      <h1 className="font-display text-display-lg text-brand-primary leading-none">Estadísticas</h1>
      <p className="text-ink-600 mt-1">Tu práctica en números.</p>
    </header>
  );
}

function RangeFilter({ active, tz }: { active: RangeKey; tz: string }) {
  const keys: RangeKey[] = ["30", "90", "all"];
  return (
    <div className="flex gap-2 flex-wrap" role="group" aria-label="Rango de tiempo">
      {keys.map((k) => {
        const params = new URLSearchParams({ tz });
        if (k !== DEFAULT_RANGE) params.set("range", k);
        const href = `/stats?${params.toString()}`;
        return (
          <Link
            key={k}
            href={href}
            className={cn(
              "text-sm font-medium px-4 py-1.5 rounded-pill border-2 transition-colors",
              active === k
                ? "bg-brand-primary text-white border-brand-primary"
                : "bg-surface-white text-ink-900 border-ink-400/20 hover:border-brand-primary hover:text-brand-primary",
            )}
          >
            {RANGE_LABELS[k]}
          </Link>
        );
      })}
    </div>
  );
}

function SectionHeading({ children, note }: { children: React.ReactNode; note?: string }) {
  return (
    <div>
      <h2 className="font-display text-display-md text-brand-primary leading-none">{children}</h2>
      {note && <p className="text-xs text-ink-600 mt-1">{note}</p>}
    </div>
  );
}

function ChartCard({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <Card variant="soft" padding="md">
      <p className="text-xs uppercase tracking-wider text-ink-600 mb-2">{caption}</p>
      {children}
    </Card>
  );
}

function ByTypeSection({ summary }: { summary: PracticeSummary }) {
  return (
    <section className="flex flex-col gap-3">
      <SectionHeading>Resumen</SectionHeading>
      <div className="grid grid-cols-2 gap-3 max-w-2xl">
        <NumberCard
          label={practiceTypeLabels.yoga}
          value={summary.byType.yoga}
          unit="prácticas"
          testId="stats-count-yoga"
        />
        <NumberCard
          label={practiceTypeLabels.meditation}
          value={summary.byType.meditation}
          unit="prácticas"
          testId="stats-count-meditation"
        />
      </div>
    </section>
  );
}

function NumberCard({
  label,
  value,
  unit,
  testId,
}: {
  label: string;
  value: string | number;
  unit?: string;
  testId?: string;
}) {
  return (
    <Card variant="soft" padding="md">
      <p className="text-xs uppercase tracking-wider text-ink-600">{label}</p>
      <p
        className="font-display text-3xl text-brand-primary mt-1 leading-none"
        data-testid={testId}
      >
        {value}
      </p>
      {unit && <p className="text-xs text-ink-600 mt-1">{unit}</p>}
    </Card>
  );
}

function MoodDeltaSection({ summary }: { summary: PracticeSummary }) {
  const { yoga, meditation } = summary.moodDeltaByType;
  if (yoga === null && meditation === null) return null;
  return (
    <section className="flex flex-col gap-3">
      <SectionHeading note="Cambio promedio de mood (después − antes).">Mood delta</SectionHeading>
      <div className="grid grid-cols-2 gap-3 max-w-2xl">
        <NumberCard
          label={practiceTypeLabels.yoga}
          value={yoga === null ? "—" : formatDelta(yoga)}
        />
        <NumberCard
          label={practiceTypeLabels.meditation}
          value={meditation === null ? "—" : formatDelta(meditation)}
        />
      </div>
    </section>
  );
}

function formatDelta(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  const sign = rounded > 0 ? "+" : rounded < 0 ? "" : "±";
  return `${sign}${rounded}`;
}
