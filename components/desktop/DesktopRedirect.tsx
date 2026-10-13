"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MOBILE_QUERY } from "@/lib/useMediaQuery";

/** On wide screens, an app deep link (/m/...) forwards to the matching website page. Small screens stay put. */
export function DesktopRedirect({ to }: { to: string }) {
  const router = useRouter();
  useEffect(() => {
    if (!window.matchMedia(MOBILE_QUERY).matches) router.replace(to);
  }, [router, to]);
  return <div style={{ minHeight: "60vh" }} />;
}
