"use client";

import { useState } from "react";

type Props = {
  id?: string;
  name: string;
  defaultValue?: number;
};

export function MoodSlider({ id, name, defaultValue = 3 }: Props) {
  const [value, setValue] = useState<number>(defaultValue);

  return (
    <div className="flex flex-col items-center gap-1">
      <input
        id={id}
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        style={{ "--value": String(value) } as React.CSSProperties}
        className="mood-slider w-full sm:w-60"
      />
      <span className="text-xs tabular-nums text-ink-400">{value}</span>
      <input type="hidden" name={name} value={value} />
    </div>
  );
}
