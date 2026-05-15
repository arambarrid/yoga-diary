import { cn } from "@/lib/utils";
import { Sparkle } from "./Sparkle";

type MarqueeProps = {
  items: string[];
  className?: string;
};

/**
 * Horizontal looping banner of text separated by sparkles. The content track is
 * duplicated so the translation can loop seamlessly. Respects
 * `prefers-reduced-motion` via the global rule in globals.css.
 */
export function Marquee({ items, className }: MarqueeProps) {
  const track = [...items, ...items];

  return (
    <div
      className={cn(
        "overflow-hidden whitespace-nowrap py-3",
        className,
      )}
    >
      <div className="inline-flex animate-[marquee_30s_linear_infinite] gap-8 will-change-transform">
        {track.map((item, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-8 font-display text-2xl"
          >
            {item}
            <Sparkle size={18} className="opacity-80" />
          </span>
        ))}
      </div>
    </div>
  );
}
