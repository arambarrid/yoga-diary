import Link from "next/link";
import { notFound } from "next/navigation";
import { DeletePracticeButton } from "@/components/DeletePracticeButton";
import { PracticeForm } from "@/components/PracticeForm";
import { getPractice } from "@/lib/practice";
import { practiceTypeLabels } from "@/lib/labels";
import type {
  FocusObject,
  Guidance,
  Position,
  YogaStyle,
} from "@/lib/schemas";

type Params = Promise<{ id: string }>;

export default async function PracticeDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const practice = await getPractice(id);
  if (!practice) notFound();

  const type = practice.type as "yoga" | "meditation";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link href="/" className="text-sm text-stone-500 hover:text-stone-800">
            ← Volver al diario
          </Link>
          <h1 className="text-2xl font-semibold text-stone-900 mt-1">
            Editar {practiceTypeLabels[type].toLowerCase()}
          </h1>
        </div>
      </div>

      <div className="rounded-lg border border-stone-200 bg-white p-5">
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
            focusObject: practice.focusObject as FocusObject | null,
            position: practice.position as Position | null,
          }}
        />
      </div>

      <div className="border-t border-stone-200 pt-4">
        <DeletePracticeButton practiceId={practice.id} />
      </div>
    </div>
  );
}
