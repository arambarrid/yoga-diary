"use client";

import { useSyncExternalStore } from "react";

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

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function LocalDateTime({ date, className }: Props) {
  const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const parts = format(date, isClient ? undefined : "UTC");

  return (
    <div className={className}>
      <div>{parts.date}</div>
      <div>{parts.time}</div>
    </div>
  );
}
