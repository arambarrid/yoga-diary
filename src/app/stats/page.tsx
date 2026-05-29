import Link from "next/link";
import { startOfMonth, startOfWeek } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { Card } from "@/components/ui/Card";
import { TzGuard } from "@/components/stats/TzGuard";
import {
  getPracticeSummary,
  type PracticeBucket,
  type PracticeSummary,
} from "@/lib/practice";
import {
  focusObjectLabels,
  practiceTypeLabels,
  yogaStyleLabels,
} from "@/lib/labels";
import type { FocusObject, YogaStyle } from "@/lib/schemas";
import { cn } from "@/lib/utils";

// Issue #9 — phase 1: numbers-only skeleton. Charts arrive in phase 2.

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

export default async function StatsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const raw = await searchParams;

  // Wait for TzGuard to populate `?tz=` before doing any TZ-sensitive
  // bucketing. Avoids a flash of UTC-bucketed numbers that may shift at week
  // or month boundaries.
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
  const total = summary.byType.yoga + summary.byType.meditation;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader />
      <RangeFilter active={range.key} tz={raw.tz} />

      {total === 0 ? (
        <Card variant="soft" padding="lg">
          <p className="text-ink-600">
            Sin prácticas registradas en este período. Cuando registres alguna,
            los números aparecen acá.
          </p>
        </Card>
      ) : (
        <>
          <ByTypeSection summary={summary} />
          <BucketSection
            heading="Por semana"
            buckets={summary.byWeek}
            tz={raw.tz}
            granularity="week"
          />
          <BucketSection
            heading="Por mes"
            buckets={summary.byMonth}
            tz={raw.tz}
            granularity="month"
          />
          <DistributionSection
            heading="Distribución por estilo de yoga"
            items={summary.yogaStyleDistribution.map((s) => ({
              label:
                yogaStyleLabels[s.yogaStyle as YogaStyle] ?? s.yogaStyle,
              count: s.count,
            }))}
          />
          <DistributionSection
            heading="Distribución por objeto de meditación"
            items={summary.focusObjectDistribution.map((f) => ({
              label:
                focusObjectLabels[f.focusObject as FocusObject] ??
                f.focusObject,
              count: f.count,
            }))}
          />
          <MoodDeltaSection summary={summary} />
        </>
      )}
    </div>
  );
}

function PageHeader() {
  return (
    <header>
      <h1 className="font-display text-display-lg text-brand-primary leading-none">
        Estadísticas
      </h1>
      <p className="text-ink-600 mt-1">
        Tu práctica en números. Los gráficos llegan en la próxima iteración.
      </p>
    </header>
  );
}

function RangeFilter({ active, tz }: { active: RangeKey; tz: string }) {
  // Build hrefs that preserve the resolved tz so the chip click doesn't
  // bounce through the TzGuard placeholder again.
  const keys: RangeKey[] = ["30", "90", "all"];
  return (
    <div
      className="flex gap-2 flex-wrap"
      role="group"
      aria-label="Rango de tiempo"
    >
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

function SectionHeading({
  children,
  note,
}: {
  children: React.ReactNode;
  note?: string;
}) {
  return (
    <div>
      <h2 className="font-display text-display-md text-brand-primary leading-none">
        {children}
      </h2>
      {note && <p className="text-xs text-ink-600 mt-1">{note}</p>}
    </div>
  );
}

function ByTypeSection({ summary }: { summary: PracticeSummary }) {
  return (
    <section className="flex flex-col gap-3">
      <SectionHeading>Resumen</SectionHeading>
      <div className="grid grid-cols-2 gap-3">
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

function BucketSection({
  heading,
  buckets,
  tz,
  granularity,
}: {
  heading: string;
  buckets: PracticeBucket[];
  tz: string;
  granularity: "week" | "month";
}) {
  // Aggregate by bucketStart across types so the list reads chronologically.
  const grouped = new Map<
    string,
    { bucketStart: Date; yoga: number; meditation: number; totalMin: number }
  >();
  for (const b of buckets) {
    const key = b.bucketStart.toISOString();
    const entry = grouped.get(key) ?? {
      bucketStart: b.bucketStart,
      yoga: 0,
      meditation: 0,
      totalMin: 0,
    };
    entry[b.type] += b.count;
    entry.totalMin += b.totalMin;
    grouped.set(key, entry);
  }

  // Always surface the current period — even with zero practices — so the
  // user can see where they are right now. Tone stays neutral / inviting
  // (no streaks, no guilt).
  const currentStart = currentBucketStart(granularity, tz);
  const currentKey = currentStart.toISOString();
  if (!grouped.has(currentKey)) {
    grouped.set(currentKey, {
      bucketStart: currentStart,
      yoga: 0,
      meditation: 0,
      totalMin: 0,
    });
  }

  const rows = Array.from(grouped.values()).sort(
    (a, b) => b.bucketStart.getTime() - a.bucketStart.getTime(),
  );

  return (
    <section className="flex flex-col gap-3">
      <SectionHeading>{heading}</SectionHeading>
      <Card variant="soft" padding="md">
        <ul className="divide-y divide-ink-400/10">
          {rows.map((r) => {
            const isCurrent = r.bucketStart.toISOString() === currentKey;
            const isEmpty = r.yoga === 0 && r.meditation === 0;
            return (
              <li
                key={r.bucketStart.toISOString()}
                className="py-3 flex items-baseline justify-between gap-3"
              >
                <span className="text-sm font-medium text-ink-900">
                  {isCurrent
                    ? granularity === "week"
                      ? "Esta semana"
                      : "Este mes"
                    : formatBucket(r.bucketStart, tz, granularity)}
                </span>
                {isEmpty ? (
                  <span className="text-sm text-ink-600 italic">
                    Aún sin registrar
                  </span>
                ) : (
                  <span className="text-sm text-ink-600 tabular-nums">
                    {r.yoga > 0 && <>🤸 {r.yoga} </>}
                    {r.meditation > 0 && <>🧘 {r.meditation} </>}
                    <span className="ml-2">· {r.totalMin} min</span>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </Card>
    </section>
  );
}

// Start of the current week (Monday) or month, expressed as a UTC instant
// of midnight in the user's zone — matches the bucket keys produced by
// summarizePractices().
function currentBucketStart(granularity: "week" | "month", tz: string): Date {
  const zoned = toZonedTime(new Date(), tz);
  const start =
    granularity === "week"
      ? startOfWeek(zoned, { weekStartsOn: 1 })
      : startOfMonth(zoned);
  return fromZonedTime(start, tz);
}

function formatBucket(
  bucketStart: Date,
  tz: string,
  granularity: "week" | "month",
): string {
  if (granularity === "month") {
    return new Intl.DateTimeFormat("es-AR", {
      month: "long",
      year: "numeric",
      timeZone: tz,
    }).format(bucketStart);
  }
  return `Semana del ${new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
    timeZone: tz,
  }).format(bucketStart)}`;
}

function DistributionSection({
  heading,
  items,
}: {
  heading: string;
  items: Array<{ label: string; count: number }>;
}) {
  if (items.length === 0) return null;
  return (
    <section className="flex flex-col gap-3">
      <SectionHeading>{heading}</SectionHeading>
      <Card variant="soft" padding="md">
        <ul className="divide-y divide-ink-400/10">
          {items.map((it) => (
            <li
              key={it.label}
              className="py-2 flex items-baseline justify-between gap-3"
            >
              <span className="text-sm text-ink-900">{it.label}</span>
              <span className="text-sm text-ink-600 tabular-nums">
                {it.count}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}

function MoodDeltaSection({ summary }: { summary: PracticeSummary }) {
  const { yoga, meditation } = summary.moodDeltaByType;
  if (yoga === null && meditation === null) return null;
  return (
    <section className="flex flex-col gap-3">
      <SectionHeading note="Cambio promedio de mood (después − antes).">
        Mood delta
      </SectionHeading>
      <div className="grid grid-cols-2 gap-3">
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
