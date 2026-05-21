  "use client";

  import { useEffect, useState } from "react";

  type Props = {
    date: Date | string;
    className?: string;
  };

  function format(date: Date | string, timeZone?: string) {
    const d = new Date(date);
    return {
      date: d.toLocaleDateString("es-AR", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone,
      }),
      time: d.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone,
      }),
    };
  }

  export function LocalDateTime({ date, className }: Props) {
    const [parts, setParts] = useState(() => format(date, "UTC"));

    useEffect(() => {
      setParts(format(date));
    }, [date]);

    return (
      <div className={className}>
        <div>{parts.date}</div>
        <div>{parts.time}</div>
      </div>
    );
  }