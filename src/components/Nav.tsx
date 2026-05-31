import Link from "next/link";
import { Sparkle } from "@/components/decorative/Sparkle";

export function Nav() {
  return (
    <header className="sticky top-0 z-10 bg-surface-cream/80 backdrop-blur-md border-b border-ink-400/10">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Sparkle
            size={22}
            className="text-brand-primary transition-transform duration-700 group-hover:rotate-180"
          />
          <span className="font-display text-2xl text-brand-primary leading-none">
            Caleidoscopio
          </span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/diary"
            className="text-sm font-medium text-ink-600 hover:text-brand-primary transition-colors"
          >
            Mi diario
          </Link>
          <Link
            href="/stats"
            className="text-sm font-medium text-ink-600 hover:text-brand-primary transition-colors"
          >
            Estadísticas
          </Link>
        </nav>
      </div>
    </header>
  );
}
