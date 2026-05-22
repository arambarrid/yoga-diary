import { PracticeForm } from "@/components/PracticeForm";
import { Card } from "@/components/ui/Card";

type SearchParams = Promise<{
  type?: string;
  durationMin?: string;
}>;

export default async function NewPracticePage({ searchParams }: { searchParams: SearchParams }) {
  const raw = await searchParams;
  const type = raw.type === "meditation" ? "meditation" : raw.type === "yoga" ? "yoga" : undefined;
  const durationMin = raw.durationMin ? Number(raw.durationMin) : undefined;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-display-lg text-brand-primary">Nueva práctica</h1>
        <p className="text-ink-600 mt-1">Registrá una sesión de yoga o de meditación.</p>
      </div>
      <Card variant="white" padding="lg">
        <PracticeForm
          initial={{
            type,
            durationMin: Number.isFinite(durationMin) ? durationMin : undefined,
          }}
        />
      </Card>
    </div>
  );
}
