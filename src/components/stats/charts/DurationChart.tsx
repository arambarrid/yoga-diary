"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { WeeklySeriesRow } from "@/lib/stats-series";

// Brand primary — a single-series bar doesn't need to differentiate types.
const BAR_COLOR = "#8b6fe8"; // --color-brand-primary
const AXIS_COLOR = "#5d4e7b"; // --color-ink-600
const CURRENT_STROKE = "#1a0b2e"; // --color-ink-900, marks "this week"

export function DurationChart({ data }: { data: WeeklySeriesRow[] }) {
  return (
    <div className="w-full h-[220px]">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="weekLabel"
            tickLine={false}
            axisLine={false}
            stroke={AXIS_COLOR}
            fontSize={11}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            stroke={AXIS_COLOR}
            fontSize={11}
            width={40}
            tickFormatter={(v) => `${v}m`}
          />
          <Tooltip
            cursor={{ fill: "rgba(139, 111, 232, 0.08)" }}
            formatter={(value) => [`${value} min`, "Tiempo total"]}
            labelFormatter={(label) => `Semana del ${label}`}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid rgba(150, 144, 168, 0.2)",
              fontSize: 12,
            }}
          />
          <Bar dataKey="totalMin" fill={BAR_COLOR} radius={[4, 4, 0, 0]}>
            {data.map((d) => (
              <Cell
                key={d.weekStart.toISOString()}
                stroke={d.isCurrent ? CURRENT_STROKE : "none"}
                strokeWidth={d.isCurrent ? 1.5 : 0}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
