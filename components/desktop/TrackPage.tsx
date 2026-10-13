"use client";

/* /track — the booking tracking view on the website (the small-screen layout shows the app's tracking screen). */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { reducedMotion } from "@/lib/motion";
import { Avatar, Icon } from "@/components/shared/Icon";
import { Button } from "@/components/shared/Button";
import { QR } from "@/components/shared/QR";
import { Reveal } from "@/components/shared/Reveal";
import { useToast } from "@/components/shared/Toast";

const ROUTE = "M44 200 L250 200 L250 98 L330 98 L330 64";
const STEPS = ["Kit packed", "En route", "At your door", "Caring"];

export function TrackPage() {
  const toast = useToast();
  const path = useRef<SVGPathElement>(null);
  const [st, setSt] = useState({ x: 44, y: 200, e: 0 });
  const [run, setRun] = useState(0);
  useEffect(() => {
    const p = path.current;
    if (!p) return;
    const L = p.getTotalLength();
    const DUR = reducedMotion() ? 1 : 14000;
    const t0 = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const t = Math.min(1, (now - t0) / DUR);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const pt = p.getPointAtLength(L * e);
      setSt({ x: pt.x, y: pt.y, e });
      if (t < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [run]);
  const eta = Math.max(0, Math.ceil(12 * (1 - st.e)));
  const at = eta ? 1 : 2;
  return (
    <article className="d-page on">
      <section className="d-phero" style={{ paddingBottom: 24 }}>
        <div className="d-wrap" style={{ gridTemplateColumns: "1fr", textAlign: "center", justifyItems: "center" }}>
          <div>
            <span className="eyebrow">Track booking · BB-26-48217</span>
            <h1 className="h1">
              Priya is <em>{eta ? "on the way." : "at your door."}</em>
            </h1>
            <p className="d-lead" style={{ marginInline: "auto" }}>
              Home visit · Thu 15 Oct · 5:00 pm · 45 min · 4 plants. No login needed — anyone with this link can follow the visit.
            </p>
          </div>
        </div>
      </section>
      <section className="d-sec" style={{ paddingTop: 24 }}>
        <div className="d-wrap">
          <Reveal className="card d-report">
            <div className="l" style={{ padding: 0, overflow: "hidden" }}>
              <svg viewBox="0 0 390 300" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", minHeight: 360 }}>
                <use href="#m-map-base" width="390" height="300" />
                <path d={ROUTE} fill="none" stroke="var(--line-2)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <path
                  ref={path}
                  d={ROUTE}
                  pathLength={100}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="100"
                  style={{ strokeDashoffset: 100 - st.e * 100 }}
                />
                <use href="#m-home-pin" x="312" y="20" width="36" height="44" />
                <g transform={`translate(${st.x} ${st.y})`}>
                  <use href="#m-scooter" x="-18" y="-18" width="36" height="36" />
                </g>
              </svg>
            </div>
            <div className="r">
              <div className="row" style={{ justifyContent: "space-between" }}>
                <div>
                  <small className="muted">{eta ? `On the way · ${(3.2 * (1 - st.e)).toFixed(1)} km` : "Arrived · gate 2"}</small>
                  <div style={{ font: "500 44px/1 var(--ff-d)" }} className="tnum">
                    {eta} min
                  </div>
                </div>
                <span className="pill pill--accent">Arriving 4:58 pm</span>
              </div>
              <div className="d-rstats" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
                {STEPS.map((s, i) => (
                  <div key={s} style={i === at ? { background: "var(--primary)", color: "var(--on-primary)" } : i < at ? undefined : { opacity: 0.55 }}>
                    <b style={{ fontSize: 15 }}>{i < at ? "✓" : i + 1}</b>
                    <span style={i === at ? { color: "inherit" } : undefined}>{s}</span>
                  </div>
                ))}
              </div>
              <div className="d-sign" style={{ marginTop: 4 }}>
                <div className="row">
                  <Avatar id="a-priya" />
                  <div>
                    <b style={{ fontSize: 14 }}>Priya Sharma</b>
                    <div className="muted" style={{ fontSize: 12 }}>
                      Certified horticulturist · 4.9 ★ · Activa HR26 EK 4471
                    </div>
                  </div>
                </div>
                <div className="row" style={{ gap: 8 }}>
                  <Button variant="ghost" size="sm" onClick={() => toast("Chat opened with Priya", "i-chat")}>
                    <Icon id="i-chat" />
                    Chat
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => toast("Calling Priya via masked number…", "i-chat")}>
                    Call
                  </Button>
                </div>
              </div>
              <div className="d-note">
                <Icon id="i-shield" />
                <span>
                  <b>Door-code reminder.</b> Guard at gate 2 has the spare key. Share OTP <b>7316</b> only with Priya.
                </span>
              </div>
              <div className="row" style={{ marginTop: "auto", justifyContent: "space-between" }}>
                <div className="row" style={{ gap: 10 }}>
                  <QR seed="BB-26-48217" className="d-trk-qr" />
                  <small className="muted">Show at the door</small>
                </div>
                <div className="row" style={{ gap: 8 }}>
                  <Button variant="ghost" size="sm" onClick={() => setRun((r) => r + 1)}>
                    Replay
                  </Button>
                  <Link href="/visits#vReport" className="btn btn--primary btn--sm">
                    See a report card
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
