import Link from "next/link";

export function Nav() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-semibold text-lg text-stone-900">
            yogaDiary
          </span>
          <span className="text-xs text-stone-500">tu práctica</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/meditate"
            className="text-sm px-3 py-1.5 rounded-md text-stone-700 hover:bg-stone-100"
          >
            Meditar
          </Link>
          <Link
            href="/practices/new"
            className="text-sm px-3 py-1.5 rounded-md bg-emerald-700 text-white hover:bg-emerald-800"
          >
            Nueva práctica
          </Link>
        </nav>
      </div>
    </header>
  );
}
