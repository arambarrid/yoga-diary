import Link from "next/link";
import { PracticeList } from "@/components/PracticeList";
import { listPractices, practiceFilterSchema } from "@/lib/practice";
import { practiceTypeLabels } from "@/lib/labels";
import { cn } from "@/lib/utils";

type SearchParams = Promise<{ type?: string }>;

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const raw = await searchParams;
  const filterParse = practiceFilterSchema.safeParse({ type: raw.type });
  const filter = filterParse.success ? filterParse.data : {};
  const practices = await listPractices(filter);
  const count = practices.length;

  return (
    <div className="flex flex-col gap-16">
      <HeroComposition />

      <section className="flex flex-col gap-5">
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <h2 className="font-display text-display-md text-brand-primary leading-none">
              Tu diario
            </h2>
            <p className="text-sm text-ink-600 mt-1">
              {count === 0
                ? "Todavía sin prácticas registradas"
                : `${count} práctica${count === 1 ? "" : "s"}`}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <FilterChip href="/" label="Todas" active={!filter.type} />
            <FilterChip
              href="/?type=yoga"
              label={practiceTypeLabels.yoga}
              active={filter.type === "yoga"}
            />
            <FilterChip
              href="/?type=meditation"
              label={practiceTypeLabels.meditation}
              active={filter.type === "meditation"}
            />
          </div>
        </div>

        <PracticeList practices={practices} />
      </section>
    </div>
  );
}

function HeroComposition() {
  return (
    <section
      className="relative w-full mx-auto"
      style={{ aspectRatio: "1 / 1", maxWidth: "560px" }}
      aria-label="Atajos principales"
    >
      <Link
        href="/practices/new"
        aria-label="Registrar práctica"
        className="absolute inset-0 transition-transform duration-500 hover:scale-[1.01] focus-visible:outline-none rounded-full"
        style={{ pointerEvents: "none" }}
      >
        <svg
          viewBox="0 0 200 200"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 w-full h-full"
          style={{ overflow: "visible" }}
          aria-hidden="true"
        >
          <defs>
            <path
              id="register-text-path"
              d="M 28 36 C 70 6 138 6 176 40"
              fill="none"
            />
            <filter id="blob-rough-fill" x="-15%" y="-15%" width="130%" height="130%">
              <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="3" />
              <feDisplacementMap in="SourceGraphic" scale="4" />
            </filter>
            <filter id="blob-rough-stroke" x="-15%" y="-15%" width="130%" height="130%">
              <feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves="2" seed="11" />
              <feDisplacementMap in="SourceGraphic" scale="5" />
            </filter>
          </defs>

          <path
            d="M 100 38
               C 158 32 192 70 184 122
               C 196 172 138 196 88 190
               C 34 192 14 162 24 112
               C 14 64 50 38 100 38 Z"
            fill="var(--color-hero-sage)"
            filter="url(#blob-rough-fill)"
            style={{ pointerEvents: "auto" }}
          />

          <path
            d="M 92 26
               C 154 22 198 60 184 118
               C 200 164 124 192 76 186
               C 22 184 4 154 22 110
               C 14 56 48 26 92 26 Z"
            fill="none"
            stroke="var(--color-hero-contour)"
            strokeWidth="1.1"
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity="0.75"
            filter="url(#blob-rough-stroke)"
          />

          <text
            className="font-display"
            fontSize="14"
            fill="var(--color-hero-contour)"
            style={{ pointerEvents: "auto", letterSpacing: "0.01em" }}
          >
            <textPath
              href="#register-text-path"
              startOffset="50%"
              textAnchor="middle"
            >
              Registrar práctica
            </textPath>
          </text>
        </svg>
      </Link>

      <Link
        href="/meditate"
        aria-label="Meditar"
        className="absolute top-[56%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[62%] h-[34%] flex items-center justify-center z-10 transition-transform duration-500 hover:scale-[1.04] focus-visible:outline-none rounded-3xl"
        style={{ pointerEvents: "none" }}
      >
        <svg
          viewBox="0 0 200 100"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 w-full h-full"
          style={{ overflow: "visible" }}
          aria-hidden="true"
        >
          <defs>
            <filter id="cloud-rough-fill" x="-15%" y="-15%" width="130%" height="130%">
              <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed="5" />
              <feDisplacementMap in="SourceGraphic" scale="2.8" />
            </filter>
            <filter id="cloud-rough-stroke" x="-15%" y="-15%" width="130%" height="130%">
              <feTurbulence type="fractalNoise" baseFrequency="0.026" numOctaves="2" seed="17" />
              <feDisplacementMap in="SourceGraphic" scale="3.5" />
            </filter>
          </defs>
          <path
            d="M 30 54
               C 14 50 14 28 32 24
               C 24 16 76 12 80 24
               C 86 -2 116 -4 122 22
               C 128 10 168 10 170 38
               C 188 40 182 68 164 68
               C 162 84 42 88 30 76
               C 14 76 14 62 30 54 Z"
            fill="var(--color-hero-lavender)"
            filter="url(#cloud-rough-fill)"
            style={{ pointerEvents: "auto" }}
          />
          <path
            d="M 26 56
               C 8 50 10 24 30 20
               C 22 12 78 8 82 22
               C 88 -8 120 -10 126 20
               C 132 4 172 8 174 38
               C 194 42 184 70 162 70
               C 160 88 40 92 26 78
               C 8 78 8 62 26 56 Z"
            fill="none"
            stroke="var(--color-hero-contour)"
            strokeWidth="1.1"
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity="0.7"
            filter="url(#cloud-rough-stroke)"
          />
        </svg>
        <span
          className="relative z-10 font-display text-3xl sm:text-4xl text-ink-900"
          style={{ pointerEvents: "auto" }}
        >
          Meditar
        </span>
      </Link>
    </section>
  );
}

function FilterChip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium px-4 py-1.5 rounded-pill border-2 transition-colors",
        active
          ? "bg-brand-primary text-white border-brand-primary"
          : "bg-surface-white text-ink-900 border-ink-400/20 hover:border-brand-primary hover:text-brand-primary",
      )}
    >
      {label}
    </Link>
  );
}
