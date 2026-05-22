import Link from "next/link";
import { cn } from "@/lib/utils";

export type HeroButtonsProps = {
  leftBg: string;
  rightBg: string;
  leftText?: string;
  rightText?: string;
  leftLabel?: string;
  rightLabel?: string;
  leftHref?: string;
  rightHref?: string;
  blend?: "normal" | "multiply";
  /** "outer" biases the text toward the outer (non-overlapping) side; "center" centers it on the circle's geometric center. */
  leftAlign?: "outer" | "center";
  rightAlign?: "outer" | "center";
  className?: string;
};

const linkBase =
  "absolute top-1/2 -translate-y-1/2 w-[58%] aspect-square rounded-full flex items-center transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-cream";

export function HeroButtons({
  leftBg,
  rightBg,
  leftText = "#FFFFFF",
  rightText = "#FFFFFF",
  leftLabel = "Registrar",
  rightLabel = "Meditar",
  leftHref = "/practices/new",
  rightHref = "/meditate",
  blend = "normal",
  leftAlign = "outer",
  rightAlign = "outer",
  className,
}: HeroButtonsProps) {
  const leftAlignClass = leftAlign === "center" ? "justify-center" : "justify-start pl-[12%]";
  const rightAlignClass = rightAlign === "center" ? "justify-center" : "justify-end pr-[12%]";

  return (
    <div className={cn("relative w-full mx-auto", className)} style={{ aspectRatio: "7 / 5" }}>
      <Link
        href={leftHref}
        aria-label={leftLabel}
        className={cn(linkBase, "left-0", leftAlignClass)}
        style={{ background: leftBg, zIndex: 1 }}
      >
        <span className="font-display text-2xl sm:text-4xl" style={{ color: leftText }}>
          {leftLabel}
        </span>
      </Link>
      <Link
        href={rightHref}
        aria-label={rightLabel}
        className={cn(linkBase, "right-0", rightAlignClass)}
        style={{
          background: rightBg,
          zIndex: 2,
          mixBlendMode: blend === "multiply" ? "multiply" : undefined,
        }}
      >
        <span className="font-display text-2xl sm:text-4xl" style={{ color: rightText }}>
          {rightLabel}
        </span>
      </Link>
    </div>
  );
}
