"use client";

import { useMemo, useSyncExternalStore } from "react";
import { startOfWeek } from "date-fns";
import { Card } from "@/components/ui/Card";

// "This week" panel for the diary landing. The browser already runs in the
// user's local zone, so `startOfWeek` on a local `new Date()` gives the
// correct Monday without any tz plumbing. We gate the computation behind a
// client check via `useSyncExternalStore` (server snapshot = false) so the
// server and first client render agree, then the real value renders after
// hydration — no effect, no hydration mismatch.

type WeekItem = { date: string; durationMin: number };

const subscribe = () => () => {};

function formatMinutes(min: number): string {
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function WeekSummary({ practices }: { practices: WeekItem[] }) {
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const week = useMemo(() => {
    if (!isClient) return null;
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    let count = 0;
    let minutes = 0;
    for (const p of practices) {
      if (new Date(p.date) >= weekStart) {
        count += 1;
        minutes += p.durationMin;
      }
    }
    return { count, minutes };
  }, [isClient, practices]);

  return (
    <Card variant="soft" padding="lg">
      <p className="text-xs uppercase tracking-wider text-ink-600">Esta semana</p>
      {week === null ? (
        <p className="font-display text-3xl text-brand-primary/30 mt-1 leading-none">…</p>
      ) : week.count === 0 ? (
        <p className="text-ink-600 mt-2">
          Todavía sin prácticas esta semana. Cuando quieras, registrá una. 🌱
        </p>
      ) : (
        <p className="font-display text-3xl text-brand-primary mt-1 leading-none">
          {week.count} práctica{week.count === 1 ? "" : "s"}
          <span className="text-ink-600"> · {formatMinutes(week.minutes)}</span>
        </p>
      )}
    </Card>
  );
}
