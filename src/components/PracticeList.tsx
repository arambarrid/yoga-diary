import type { Practice } from "@prisma/client";
import { PracticeCard } from "@/components/PracticeCard";

export function PracticeList({ practices }: { practices: Practice[] }) {
  if (practices.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
        <p className="text-stone-600">
          Todavía no hay prácticas registradas.
        </p>
        <p className="text-sm text-stone-500 mt-1">
          Empezá agregando una desde el botón &ldquo;Nueva práctica&rdquo;.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {practices.map((p) => (
        <PracticeCard key={p.id} practice={p} />
      ))}
    </div>
  );
}
