"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Reads the browser's IANA time zone and reflects it into the URL as `?tz=...`
// the first time the user lands on a page that needs it. The server reads the
// query param to bucket practice dates by the user's local week / month
// without ever persisting a TZ. Renders nothing.
export function TzGuard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("tz")) return;
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const next = new URLSearchParams(searchParams.toString());
    next.set("tz", detected);
    router.replace(`?${next.toString()}`);
  }, [router, searchParams]);

  return null;
}
