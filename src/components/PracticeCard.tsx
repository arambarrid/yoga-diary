import Link from "next/link";
import type { Practice } from "@prisma/client";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { NotesPreview } from "@/components/ui/NotesPreview";
import { LocalDateTime } from "@/components/ui/LocalDateTime";
import {
  focusObjectLabels,
  guidanceLabels,
  positionLabels,
  practiceTypeLabels,
  yogaStyleLabels,
} from "@/lib/labels";
import type { FocusObject, Guidance, Position, YogaStyle } from "@/lib/schemas";

export function PracticeCard({ practice }: { practice: Practice }) {
  const isYoga = practice.type === "yoga";
  const type = practice.type as "yoga" | "meditation";

  const specifics = isYoga
    ? practice.yogaStyle
      ? yogaStyleLabels[practice.yogaStyle as YogaStyle]
      : null
    : practice.focusObjects.length > 0 && practice.position
      ? `${practice.focusObjects
          .map((fo) => focusObjectLabels[fo as FocusObject])
          .join(" · ")} · ${positionLabels[practice.position as Position]}`
      : null;

  return (
    <Link href={`/practices/${practice.id}`} className="block">
      <Card variant="white" interactive className="h-full">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <Badge variant={type} size="md">
              {practiceTypeLabels[type]}
            </Badge>
            <LocalDateTime date={practice.date} className="text-right text-xs text-ink-600" />
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-display text-display-md text-ink-900 leading-none">
              {practice.durationMin} <span className="text-display-md text-ink-600">min</span>
            </p>
            <p className="text-sm text-ink-600">
              {guidanceLabels[practice.guidance as Guidance]}
              {specifics ? ` · ${specifics}` : null}
            </p>
          </div>

          {practice.notes ? <NotesPreview notes={practice.notes} /> : null}

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
