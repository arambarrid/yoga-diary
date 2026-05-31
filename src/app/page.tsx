import { HeroButtons } from "@/components/HeroButtons";

export default function HomePage() {
  return (
    <section
      className="w-full mx-auto"
      style={{ maxWidth: "560px" }}
      aria-label="Atajos principales"
    >
      <HeroButtons
        leftBg="var(--color-meditation-700)"
        rightBg="var(--color-pink-vivid)"
        rightText="var(--color-ink-900)"
        leftLabel="Registro"
        rightAlign="center"
      />
    </section>
  );
}
