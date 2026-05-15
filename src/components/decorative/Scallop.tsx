import { cn } from "@/lib/utils";

type ScallopProps = {
  flip?: boolean;
  className?: string;
};

/**
 * Section divider with a scalloped edge. Place at the top of a section to make
 * the section's background color "drip" into the section above, or set `flip`
 * to invert (scallops point down).
 */
export function Scallop({ flip = false, className }: ScallopProps) {
  return (
    <svg
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn(
        "block w-full h-10",
        flip && "rotate-180",
        className,
      )}
    >
      <path
        fill="currentColor"
        d="M0,40 L0,20 Q30,0 60,20 T120,20 T180,20 T240,20 T300,20 T360,20 T420,20 T480,20 T540,20 T600,20 T660,20 T720,20 T780,20 T840,20 T900,20 T960,20 T1020,20 T1080,20 T1140,20 T1200,20 L1200,40 Z"
      />
    </svg>
  );
}
