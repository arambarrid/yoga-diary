import { type HTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-2xl shadow-soft transition-shadow", {
  variants: {
    variant: {
      white: "bg-surface-white",
      soft: "bg-surface-soft",
      brand: "bg-brand-primary text-white",
      warm: "bg-warm-soft",
      meditation: "bg-meditation-500 text-ink-900",
      yoga: "bg-yoga-500 text-ink-900",
    },
    padding: {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
    interactive: {
      true: "hover:shadow-lifted cursor-pointer",
      false: "",
    },
  },
  defaultVariants: { variant: "white", padding: "md", interactive: false },
});

export type CardProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>;

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant, padding, interactive, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, interactive }), className)}
      {...props}
    />
  );
});
