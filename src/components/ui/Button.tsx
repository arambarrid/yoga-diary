import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-primary focus-visible:ring-offset-surface-cream",
  {
    variants: {
      variant: {
        primary: "bg-action text-white hover:bg-action-hover shadow-soft hover:shadow-lifted",
        secondary: "bg-brand-primary text-white hover:bg-brand-secondary shadow-soft",
        meditation:
          "bg-meditation-500 text-ink-900 hover:bg-meditation-700 hover:text-white shadow-soft hover:shadow-lifted",
        yoga: "bg-yoga-500 text-ink-900 hover:bg-yoga-700 hover:text-white shadow-soft hover:shadow-lifted",
        outline: "border-2 border-brand-primary text-brand-primary hover:bg-surface-soft",
        ghost: "text-brand-primary hover:bg-surface-soft",
        danger: "border-2 border-yoga-700 text-yoga-700 hover:bg-yoga-50",
      },
      size: {
        sm: "h-9 px-4 text-sm rounded-pill",
        md: "h-11 px-6 text-base rounded-pill",
        lg: "h-14 px-8 text-lg rounded-pill",
        xl: "h-16 px-10 text-xl rounded-pill font-display",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, className, ...props },
  ref,
) {
  return (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
});
