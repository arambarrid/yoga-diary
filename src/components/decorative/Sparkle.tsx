import { cn } from "@/lib/utils";

type SparkleProps = {
  size?: number;
  className?: string;
};

export function Sparkle({ size = 24, className }: SparkleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("inline-block", className)}
    >
      <path d="M12 0 L13.5 9 L24 12 L13.5 15 L12 24 L10.5 15 L0 12 L10.5 9 Z" />
    </svg>
  );
}
