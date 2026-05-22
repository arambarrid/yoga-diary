"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  notes: string;
};

export function NotesPreview({ notes }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () => {
      setOverflows(el.scrollHeight > el.clientHeight + 1);
    };

    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [notes, expanded]);

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setExpanded((v) => !v);
  }

  return (
    <div>
      <p ref={ref} className={`text-sm text-ink-600 ${expanded ? "" : "line-clamp-2"}`}>
        {notes}
      </p>
      {(overflows || expanded) && (
        <button
          type="button"
          onClick={handleToggle}
          className="text-xs text-brand-primary hover:text-brand-secondary mt-1"
        >
          {expanded ? "Ver menos" : "Ver más"}
        </button>
      )}
    </div>
  );
}
