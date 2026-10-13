"use client";

import { BookingProvider } from "@/lib/booking";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { Modals } from "./Modals";

/** The desktop website chrome: sticky nav, page content, footer, and the modal layer (booking / login / tips). */
export function DesktopSite({ children }: { children: React.ReactNode }) {
  return (
    <BookingProvider>
      <main id="desktop" aria-label="BloomBuddy website">
        <div className="d-viewport grain" id="dview">
          <Nav />
          {children}
          <Footer />
        </div>
        <Modals />
      </main>
    </BookingProvider>
  );
}
