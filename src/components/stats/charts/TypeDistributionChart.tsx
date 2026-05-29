// Pure-CSS horizontal ranked bars — no Recharts. For 5-10 categories with
// counts this is lighter and easier to read on mobile than a SVG chart.
// Renders nothing when there are no items, mirroring the previous
// `DistributionSection` behaviour.

type Item = { label: string; count: number };

export function TypeDistributionChart({
  yogaStyles,
  focusObjects,
}: {
  yogaStyles: Item[];
  focusObjects: Item[];
}) {
  const hasYoga = yogaStyles.length > 0;
  const hasMeditation = focusObjects.length > 0;
  if (!hasYoga && !hasMeditation) return null;

  return (
    <div className="flex flex-col gap-6">
      {hasYoga && <BarList heading="Estilos de yoga" items={yogaStyles} accent="yoga" />}
      {hasMeditation && (
        <BarList
          heading="Objetos de meditación"
          items={focusObjects}
          accent="meditation"
        />
      )}
    </div>
  );
}

function BarList({
  heading,
  items,
  accent,
}: {
  heading: string;
  items: Item[];
  accent: "yoga" | "meditation";
}) {
  const max = items.reduce((m, it) => Math.max(m, it.count), 0) || 1;
  const barColor =
    accent === "yoga"
      ? "bg-[color:var(--color-yoga-500)]"
      : "bg-[color:var(--color-meditation-500)]";
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs uppercase tracking-wider text-ink-600">{heading}</h3>
      <ul className="flex flex-col gap-1.5">
        {items.map((it) => {
          const pct = (it.count / max) * 100;
          return (
            <li key={it.label} className="flex items-center gap-3">
              <span className="text-sm text-ink-900 w-32 shrink-0 truncate">
                {it.label}
              </span>
              <div className="flex-1 h-2.5 bg-ink-400/10 rounded-full overflow-hidden">
                <div
                  className={`h-full ${barColor} rounded-full`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-sm text-ink-600 tabular-nums w-8 text-right">
                {it.count}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
