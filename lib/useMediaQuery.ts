"use client";

import { useSyncExternalStore } from "react";

/** The single layout breakpoint: >= 900px shows the desktop website, below it the mobile app. */
export const MOBILE_QUERY = "(max-width: 899.98px)";

/**
 * Live media-query match. The server snapshot is `null` ("unknown"), so the first client render matches
 * the server HTML exactly (no hydration mismatch); visibility itself is always decided by CSS.
 */
export function useMediaQuery(query: string): boolean | null {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => null,
  );
}

export const useIsMobile = () => useMediaQuery(MOBILE_QUERY);
