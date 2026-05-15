import { cn } from "@/lib/utils";

type CloudProps = {
  variant?: "small" | "medium" | "large";
  className?: string;
};

const sizeMap: Record<NonNullable<CloudProps["variant"]>, number> = {
  small: 60,
  medium: 100,
  large: 160,
};

export function Cloud({ variant = "medium", className }: CloudProps) {
  const size = sizeMap[variant];
  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 100 60"
      fill="currentColor"
      aria-hidden="true"
      className={cn("inline-block", className)}
    >
      <ellipse cx="25" cy="40" rx="20" ry="18" />
      <ellipse cx="50" cy="30" rx="25" ry="22" />
      <ellipse cx="75" cy="38" rx="22" ry="20" />
      <rect x="15" y="38" width="70" height="18" rx="9" />
    </svg>
  );
}
