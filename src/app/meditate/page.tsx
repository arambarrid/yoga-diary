import { MeditationTimer } from "@/components/MeditationTimer";

export default function MeditatePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Meditar</h1>
        <p className="text-sm text-stone-600 mt-1">
          Sesión guiada por timer. Suena un bell al inicio y al final. Al
          terminar te llevamos al registro con la duración pre-llenada.
        </p>
      </div>
      <div className="rounded-lg border border-stone-200 bg-white p-6">
        <MeditationTimer />
      </div>
    </div>
  );
}
