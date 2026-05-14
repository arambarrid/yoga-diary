import Link from "next/link";
import type { Practice } from "@prisma/client";
import {
  focusObjectLabels,
  guidanceLabels,
  positionLabels,
  practiceTypeLabels,
  yogaStyleLabels,
} from "@/lib/labels";
import type {
  FocusObject,
  Guidance,
  Position,
  YogaStyle,
} from "@/lib/schemas";

function formatDate(d: Date) {
  return new Date(d).toLocaleString("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function PracticeCard({ practice }: { practice: Practice }) {
  const isYoga = practice.type === "yoga";
  const badgeClass = isYoga
    ? "bg-emerald-100 text-emerald-800"
    : "bg-violet-100 text-violet-800";

  return (
    <Link
      href={`/practices/${practice.id}`}
      className="block rounded-lg border border-stone-200 bg-white p-4 hover:border-stone-400 transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeClass}`}
            >
              {practiceTypeLabels[practice.type as "yoga" | "meditation"]}
            </span>
            <span className="text-sm text-stone-500">
              {formatDate(practice.date)}
            </span>
          </div>
          <div className="text-stone-900 font-medium">
            {practice.durationMin} min ·{" "}
            {guidanceLabels[practice.guidance as Guidance]}
          </div>
          <div className="text-sm text-stone-600">
            {isYoga && practice.yogaStyle
              ? yogaStyleLabels[practice.yogaStyle as YogaStyle]
              : null}
            {!isYoga && practice.focusObject && practice.position
              ? `${focusObjectLabels[practice.focusObject as FocusObject]} · ${positionLabels[practice.position as Position]}`
              : null}
          </div>
          {practice.notes ? (
            <p className="text-sm text-stone-600 line-clamp-2 mt-1">
              {practice.notes}
            </p>
          ) : null}
        </div>
        {practice.moodBefore && practice.moodAfter ? (
          <div className="shrink-0 text-right text-xs text-stone-500">
            <div>Mood</div>
            <div className="font-medium text-stone-700">
              {practice.moodBefore} → {practice.moodAfter}
            </div>
          </div>
        ) : null}
      </div>
    </Link>
  );
}
