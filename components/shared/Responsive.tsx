"use client";

import dynamic from "next/dynamic";
import { useIsMobile } from "@/lib/useMediaQuery";

const MobileApp = dynamic(() => import("@/components/mobile/MobileApp"), { ssr: false });

/**
 * Breakpoint gate (900px). The desktop website is server-rendered inside `.bb-desktop`; CSS hides it below 900px
 * and shows `.bb-mobile` instead, so the first paint is always the right version (no flash, no hydration mismatch).
 * The mobile app is client-only and is mounted only once the viewport is known to be < 900px; until then its
 * container shows the brand-coloured background, which matches the app's own first frame.
 */
export function Responsive({ desktop }: { desktop: React.ReactNode }) {
  const isMobile = useIsMobile();
  return (
    <>
      <div className="bb-desktop">{desktop}</div>
      <div className="bb-mobile">{isMobile ? <MobileApp /> : <div id="mobile" aria-hidden="true" />}</div>
    </>
  );
}
