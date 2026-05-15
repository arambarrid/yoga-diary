import Link from "next/link";
import type { Practice } from "@prisma/client";
import { PracticeCard } from "@/components/PracticeCard";
import { Card } from "@/components/ui/Card";
import { Cloud } from "@/components/decorative/Cloud";

export function PracticeList({ practices }: { practices: Practice[] }) {
  if (practices.length === 0) {
    return (
      <Card variant="soft" padding="lg">
        <div className="flex flex-col items-center gap-5 py-8 text-center">
          <Cloud
            variant="large"
            className="text-meditation-500 opacity-70"
          />
          <div className="flex flex-col gap-1">
            <p className="font-display text-display-md text-brand-primary">
              Tu diario te espera
            </p>
            <p className="text-ink-600">
              Empezá registrando tu primera práctica.
            </p>
          </div>
          <Link
            href="/practices/new"
            className="text-base font-medium px-6 py-3 rounded-pill bg-action text-white hover:bg-action-hover shadow-soft hover:shadow-lifted transition-all"
          >
            Crear primera práctica
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {practices.map((p) => (
        <PracticeCard key={p.id} practice={p} />
      ))}
    </div>
  );
}
