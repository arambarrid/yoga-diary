"use client";

import {
  Bar,
  BarChart,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { WeeklySeriesRow } from "@/lib/stats-series";
import { practiceTypeLabels } from "@/lib/labels";

// Aligned with the design tokens in src/app/globals.css.
const YOGA_COLOR = "#b9a7f5"; // --color-yoga-500
const MEDITATION_COLOR = "#5ca8ad"; // --color-meditation-500
const AXIS_COLOR = "#5d4e7b"; // --color-ink-600
const CURRENT_STROKE = "#1a0b2e"; // --color-ink-900, marks "this week"

export function FrequencyChart({ data }: { data: WeeklySeriesRow[] }) {
  const formatType = (key: string) =>
    practiceTypeLabels[key as keyof typeof practiceTypeLabels] ?? key;

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
            width={28}
          />
          <Tooltip
            cursor={{ fill: "rgba(139, 111, 232, 0.08)" }}
            formatter={(value, name) => [value, formatType(String(name))]}
            labelFormatter={(label) => `Semana del ${label}`}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid rgba(150, 144, 168, 0.2)",
              fontSize: 12,
            }}
          />
          <Legend
            formatter={(value) => formatType(String(value))}
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, paddingTop: 4 }}
          />
          <Bar dataKey="yoga" stackId="a" fill={YOGA_COLOR}>
            {data.map((d) => (
              <Cell
                key={d.weekStart.toISOString()}
                stroke={d.isCurrent ? CURRENT_STROKE : "none"}
                strokeWidth={d.isCurrent ? 1.5 : 0}
              />
            ))}
          </Bar>
          <Bar dataKey="meditation" stackId="a" fill={MEDITATION_COLOR}>
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
