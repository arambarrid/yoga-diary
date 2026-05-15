import type { ReactNode } from "react";

type FieldProps = {
  label: string;
  htmlFor?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
};

export function Field({ label, htmlFor, hint, required, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-ink-900"
      >
        {label}
        {required ? <span className="text-action ml-0.5">*</span> : null}
      </label>
      {children}
      {hint ? <p className="text-xs text-ink-600">{hint}</p> : null}
    </div>
  );
}
