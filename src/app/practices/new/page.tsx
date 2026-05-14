import { PracticeForm } from "@/components/PracticeForm";

type SearchParams = Promise<{
  type?: string;
  durationMin?: string;
}>;

export default async function NewPracticePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const raw = await searchParams;
  const type = raw.type === "meditation" ? "meditation" : raw.type === "yoga" ? "yoga" : undefined;
  const durationMin = raw.durationMin ? Number(raw.durationMin) : undefined;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">
          Nueva práctica
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          Registrá una sesión de yoga o de meditación.
        </p>
      </div>
      <div className="rounded-lg border border-stone-200 bg-white p-5">
        <PracticeForm
          initial={{
            type,
            durationMin: Number.isFinite(durationMin) ? durationMin : undefined,
          }}
        />
      </div>
    </div>
  );
}
