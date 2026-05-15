import { type SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

const base =
  "block w-full rounded-xl border-2 border-ink-400/30 bg-surface-white px-4 py-3 text-base text-ink-900 transition-colors focus:border-brand-primary focus:outline-none focus:ring-4 focus:ring-brand-primary/15 disabled:bg-surface-soft disabled:cursor-not-allowed";

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, children, ...props },
  ref,
) {
  return (
    <select ref={ref} className={cn(base, className)} {...props}>
      {children}
    </select>
  );
});
