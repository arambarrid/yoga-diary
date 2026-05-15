import Link from "next/link";
import type { Practice } from "@prisma/client";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
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
  return new Date(d).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(d: Date) {
  return new Date(d).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function PracticeCard({ practice }: { practice: Practice }) {
  const isYoga = practice.type === "yoga";
  const type = practice.type as "yoga" | "meditation";

  const specifics = isYoga
    ? practice.yogaStyle
      ? yogaStyleLabels[practice.yogaStyle as YogaStyle]
      : null
    : practice.focusObject && practice.position
      ? `${focusObjectLabels[practice.focusObject as FocusObject]} · ${positionLabels[practice.position as Position]}`
      : null;

  return (
    <Link href={`/practices/${practice.id}`} className="block">
      <Card variant="white" interactive className="h-full">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <Badge variant={type} size="md">
              {practiceTypeLabels[type]}
            </Badge>
            <div className="text-right text-xs text-ink-600">
              <div>{formatDate(practice.date)}</div>
              <div>{formatTime(practice.date)}</div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-display text-display-md text-ink-900 leading-none">
              {practice.durationMin}{" "}
              <span className="text-display-md text-ink-600">min</span>
            </p>
            <p className="text-sm text-ink-600">
              {guidanceLabels[practice.guidance as Guidance]}
              {specifics ? ` · ${specifics}` : null}
            </p>
          </div>

          {practice.notes ? (
            <p className="text-sm text-ink-600 line-clamp-2">
              {practice.notes}
            </p>
          ) : null}

          {practice.moodBefore && practice.moodAfter ? (
            <div className="flex items-center gap-1.5 text-xs text-ink-600 pt-1 border-t border-ink-400/10">
              <span>mood</span>
              <span className="font-medium text-ink-900">
                {practice.moodBefore} → {practice.moodAfter}
              </span>
            </div>
          ) : null}
        </div>
      </Card>
    </Link>
  );
}
