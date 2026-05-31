import Link from "next/link";
import { notFound } from "next/navigation";
import { DeletePracticeButton } from "@/components/DeletePracticeButton";
import { PracticeForm } from "@/components/PracticeForm";
import { Card } from "@/components/ui/Card";
import { getPractice } from "@/lib/practice";
import { practiceTypeLabels } from "@/lib/labels";
import type { FocusObject, Guidance, Position, YogaStyle } from "@/lib/schemas";

type Params = Promise<{ id: string }>;

export default async function PracticeDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const practice = await getPractice(id);
  if (!practice) notFound();

  const type = practice.type as "yoga" | "meditation";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/diary/practices"
          className="text-sm text-ink-600 hover:text-brand-primary transition-colors"
        >
          ← Volver al diario
        </Link>
        <h1 className="font-display text-display-lg text-brand-primary mt-1">
          Editar {practiceTypeLabels[type].toLowerCase()}
        </h1>
      </div>

      <Card variant="white" padding="lg">
        <PracticeForm
          mode="edit"
          initial={{
            id: practice.id,
            type,
            date: practice.date.toISOString(),
            durationMin: practice.durationMin,
            guidance: practice.guidance as Guidance,
            moodBefore: practice.moodBefore,
            moodAfter: practice.moodAfter,
            notes: practice.notes,
            yogaStyle: practice.yogaStyle as YogaStyle | null,
            focusObjects: practice.focusObjects as FocusObject[],
            position: practice.position as Position | null,
          }}
        />
      </Card>

      <div className="border-t border-ink-400/15 pt-4">
        <DeletePracticeButton practiceId={practice.id} />
      </div>
    </div>
  );
}
