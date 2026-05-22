import { useId } from "react";
import { cn } from "@/lib/utils";

type Option = {
  value: string;
  label: string;
};

type ChipMultiSelectProps = {
  name: string;
  options: Option[];
  defaultValue?: string[];
  className?: string;
};

export function ChipMultiSelect({
  name,
  options,
  defaultValue = [],
  className,
}: ChipMultiSelectProps) {
  const groupId = useId();
  return (
    <div className={cn("flex flex-wrap gap-2", className)} role="group">
      {options.map((opt) => {
        const id = `${groupId}-${opt.value}`;
        return (
          <label key={opt.value} htmlFor={id} className="cursor-pointer">
            <input
              id={id}
              type="checkbox"
              name={name}
              value={opt.value}
              defaultChecked={defaultValue.includes(opt.value)}
              className="peer sr-only"
            />
            <span
              className={cn(
                "inline-flex items-center justify-center",
                "min-h-[44px] rounded-pill border-2 px-4 py-2",
                "border-ink-400/30 bg-surface-white",
                "text-sm text-ink-900 transition-colors",
                "hover:border-meditation-500/60",
                "peer-focus-visible:ring-4",
                "peer-focus-visible:ring-brand-primary/15",
                "peer-checked:border-meditation-500",
                "peer-checked:bg-meditation-500",
              )}
            >
              {opt.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}
