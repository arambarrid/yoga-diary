import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const base =
  "block w-full rounded-xl border-2 border-ink-400/30 bg-surface-white px-4 py-3 text-base text-ink-900 placeholder:text-ink-400 transition-colors focus:border-brand-primary focus:outline-none focus:ring-4 focus:ring-brand-primary/15 disabled:bg-surface-soft disabled:cursor-not-allowed";

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  return <input ref={ref} className={cn(base, className)} {...props} />;
});
