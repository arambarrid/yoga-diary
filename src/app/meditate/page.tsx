import { MeditationTimer } from "@/components/MeditationTimer";
import { Card } from "@/components/ui/Card";

export default function MeditatePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-display-lg text-brand-primary">
          Meditar
        </h1>
        <p className="text-ink-600 mt-1">
          Sesión guiada por timer. Suena un bell al inicio y al final. Al
          terminar te llevamos al registro con la duración pre-llenada.
        </p>
      </div>
      <Card variant="meditation" padding="lg">
        <MeditationTimer />
      </Card>
    </div>
  );
}
