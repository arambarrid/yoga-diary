  "use client";

  import { useState } from "react";

  type Props = {
    id?: string;
    name: string;
    defaultValue?: number | null;
  };

  export function MoodSlider({ id, name, defaultValue = null }: Props) {
    const [value, setValue] = useState<number | null>(defaultValue);
    const engaged = value !== null;

    return (
      <div className="flex items-center justify-center gap-3">
        <input
          id={id}
          type="range"
          min={1}
          max={5}
          step={1}
          value={value ?? 3}
          onChange={(e) => setValue(Number(e.target.value))}
          style={{ "--value": String(value ?? 3) } as React.CSSProperties}
          className={`mood-slider w-48 ${engaged ? "" : "opacity-40"}`}
        />
        <span className="w-6 text-center text-sm tabular-nums text-ink-600">
          {engaged ? value : "—"}
        </span>
        <button
          type="button"
          onClick={() => setValue(null)}
          disabled={!engaged}
          aria-label="Clear mood"
          className="text-sm text-ink-400 hover:text-ink-600 disabled:opacity-30
  disabled:cursor-not-allowed"
        >
          ✕
        </button>
        <input type="hidden" name={name} value={value ?? ""} />
      </div>
    );
  }