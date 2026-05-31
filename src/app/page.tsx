import { HeroButtons } from "@/components/HeroButtons";

export default function HomePage() {
  return (
    <div className="w-full mx-auto flex flex-col gap-8" style={{ maxWidth: "560px" }}>
      <section aria-label="Atajos principales">
        <HeroButtons
          leftBg="var(--color-meditation-700)"
          rightBg="var(--color-pink-vivid)"
          rightText="var(--color-ink-900)"
          leftLabel="Registro"
          rightAlign="center"
        />
      </section>

      <p className="text-center text-ink-600 max-w-md mx-auto">
        <span className="font-medium text-ink-900">¡Hola!</span> Este es un espacio para registrar
        prácticas de yoga y meditación, próximamente con más herramientas.
      </p>
    </div>
  );
}
