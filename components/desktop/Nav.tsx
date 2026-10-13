"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DATA } from "@/lib/data";
import { useBooking } from "@/lib/booking";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/shared/Button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useToast } from "@/components/shared/Toast";

const MENU = [
  ["/visits", "Home Visits"],
  ["/dropoff", "Smart Drop-off"],
  ["/plans", "Plans & Pricing"],
  ["/care", "Plant Care"],
  ["/business", "For Business"],
] as const;

export function Nav() {
  const path = usePathname();
  const { open, setModal, loggedIn, setLoggedIn } = useBooking();
  const toast = useToast();
  const [city, setCity] = useState("Gurgaon");
  const [pop, setPop] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!pop) return;
    const close = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setPop(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setPop(false);
    document.addEventListener("click", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", esc);
    };
  }, [pop]);
  return (
    <nav className="d-nav">
      <div className="d-wrap">
        <Link href="/" className="d-logo" aria-label="BloomBuddy home">
          <svg viewBox="0 0 196 72">
            <use href="#i-logo-full" />
          </svg>
        </Link>
        <div className="d-menu">
          {MENU.map(([href, l]) => (
            <Link key={href} href={href} className={path === href ? "on" : ""}>
              {l}
            </Link>
          ))}
        </div>
        <div className="d-nav-r" ref={wrap}>
          <button className="chip" id="cityBtn" onClick={() => setPop((p) => !p)} aria-expanded={pop}>
            <Icon id="i-pin" />
            <span>{city}</span> ▾
          </button>
          <div className={`card d-city-pop${pop ? " open" : ""}`}>
            {DATA.cities.map((c) => (
              <button
                key={c.n}
                onClick={() => {
                  setCity(c.n);
                  setPop(false);
                  toast(c.live ? `Showing slots and hubs for ${c.n}` : `${c.n}: ${c.note}. Hubs coming in 2027.`, "i-pin");
                }}
              >
                <span>{c.n}</span>
                <small>{c.live ? "Live" : c.note}</small>
              </button>
            ))}
          </div>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (loggedIn) {
                setLoggedIn(false);
                toast("Logged out. See you soon, Nisha!", "i-user");
              } else setModal("login");
            }}
          >
            {loggedIn ? (
              <>
                <svg className="av" viewBox="0 0 80 80" style={{ width: 24, height: 24, marginLeft: -8 }}>
                  <use href="#a-nisha" />
                </svg>
                Nisha
              </>
            ) : (
              "Log in"
            )}
          </Button>
          <Button variant="accent" size="sm" onClick={() => open("visit")}>
            Book a visit
          </Button>
        </div>
      </div>
    </nav>
  );
}
