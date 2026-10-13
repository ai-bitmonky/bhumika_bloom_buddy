"use client";

/* S1–S5: splash, onboarding slides, sign-up (+ optional OTP), plant-parent quiz, add plants.
   None of these gate the app: it opens on Home as a guest; this flow is started from Profile or the Home banner. */

import { useEffect, useRef, useState } from "react";
import { MDATA } from "@/lib/data";
import { Button } from "@/components/shared/Button";
import { Ico, Screen, TopBar } from "../Screen";
import { useM } from "../MobileContext";

/* ---------- S1 splash (shown once per visit while the app "boots") ---------- */
export function Splash() {
  const { cur, reset } = useM();
  useEffect(() => {
    if (cur !== "s1-splash") return;
    const t = window.setTimeout(() => reset("s6-home"), window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 400 : 1500);
    return () => window.clearTimeout(t);
  }, [cur, reset]);
  return (
    <Screen id="s1-splash" className="m-dark-scr" label="Splash">
      <div className="m-splash" onClick={() => reset("s6-home")}>
        <div className="m-splash-glow" />
        <svg className="m-splash-mark" viewBox="0 0 120 120" aria-hidden="true">
          <use href="#i-logo-mark" />
        </svg>
        <svg className="m-splash-leaf" viewBox="0 0 120 40" aria-hidden="true">
          <path d="M8 32C30 30 46 18 60 8c14 10 30 22 52 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M60 8c-4 10-4 18 0 28 4-10 4-18 0-28z" fill="currentColor" />
        </svg>
        <div className="m-splash-word">
          <span>Bloom</span>
          <span>Buddy</span>
        </div>
        <p className="m-splash-tag">Plant care, even when you&apos;re away</p>
        <div className="m-splash-bar">
          <i />
        </div>
      </div>
    </Screen>
  );
}

/* ---------- S2 onboarding ---------- */
const SLIDES = [
  {
    art: (
      <div className="m-ob-art m-ob-art--1">
        <div className="m-ob-arch">
          <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
            <use href="#s-expert-watering" />
          </svg>
        </div>
        <span className="m-float m-float--a">
          <Ico id="i-shield" />
          Background verified
        </span>
        <span className="m-float m-float--b">
          <Ico id="i-star" />
          4.8 · 1,200+ visits
        </span>
      </div>
    ),
    eb: "Expert home visits",
    h: "A certified plant expert, at your door.",
    p: "Watering, pruning, pest checks and soil refresh — done by trained horticulturists in 45 or 90 minutes.",
  },
  {
    art: (
      <div className="m-ob-art m-ob-art--2">
        <div className="m-ob-arch m-ob-arch--hub">
          <svg viewBox="0 0 300 220" preserveAspectRatio="xMidYMid meet">
            <use href="#s-hub" />
          </svg>
        </div>
        <div className="m-ob-room">
          <b>Suite 12 · Sunny</b>
          <span>Sector 29 hub · 18–24 Oct</span>
        </div>
        <span className="m-float m-float--c">
          <Ico id="m-suitcase" />
          Going away?
        </span>
      </div>
    ),
    eb: "Smart Drop-off",
    h: "A plant hotel for when you travel.",
    p: "Check your plants into a Sunny, Bright-shade or Humid “spa” suite at a hub near you. We can pick them up too.",
  },
  {
    art: null,
    eb: "Daily Plant Postcards",
    h: "See them thrive, every single day.",
    p: "A photo and a short note from your expert each day — water, light and health at a glance.",
  },
];

export function OnboardingScreen() {
  const { push, cur } = useM();
  const [i, setI] = useState(0);
  const [dx, setDx] = useState(0);
  const [drag, setDrag] = useState(false);
  const [dev, setDev] = useState(0);
  const x0 = useRef<number | null>(null);
  const w = useRef(390);
  const goI = (n: number) => {
    const k = Math.max(0, Math.min(2, n));
    setI(k);
    if (k === 2) setDev((d) => d + 1);
  };
  useEffect(() => {
    if (cur === "s2-onboarding") {
      setI(0);
      setDx(0);
    }
  }, [cur]);
  const end = () => {
    if (x0.current === null) return;
    setDrag(false);
    const t = w.current * 0.18;
    if (dx < -t) goI(i + 1);
    else if (dx > t) goI(i - 1);
    setDx(0);
    x0.current = null;
  };
  const edge = (i === 0 && dx > 0) || (i === 2 && dx < 0) ? 0.35 : 1;
  return (
    <Screen id="s2-onboarding" className="m-noscroll" label="Onboarding">
      <div className="m-ob">
        <div className="m-ob-top">
          <svg className="m-ob-logo" viewBox="0 0 120 120">
            <use href="#i-logo-mark" />
          </svg>
          <button className="m-link" onClick={() => push("s3-signup")}>
            Skip
          </button>
        </div>
        <div
          className={`m-ob-viewport${drag ? " is-drag" : ""}`}
          tabIndex={0}
          onPointerDown={(e) => {
            x0.current = e.clientX;
            w.current = e.currentTarget.clientWidth || 390;
            setDrag(true);
            try {
              e.currentTarget.setPointerCapture(e.pointerId);
            } catch {}
          }}
          onPointerMove={(e) => x0.current !== null && setDx(e.clientX - x0.current)}
          onPointerUp={end}
          onPointerCancel={end}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") goI(i + 1);
            if (e.key === "ArrowLeft") goI(i - 1);
          }}
        >
          <div className={`m-ob-track${drag ? " is-drag" : ""}`} style={{ transform: `translateX(calc(${-i * 100}% + ${dx * edge}px))` }}>
            {SLIDES.map((s, k) => (
              <article className="m-ob-slide" key={k}>
                {s.art ?? (
                  <div className="m-ob-art m-ob-art--3" key={dev}>
                    <div className={`m-pol m-pol--tilt-l${dev ? " m-develop" : ""}`}>
                      <div className="m-pol-img m-tint-1">
                        <svg viewBox="0 0 120 160">
                          <use href="#p-peacelily" />
                        </svg>
                      </div>
                      <b>Shanti · Day 3</b>
                      <small>Drank 180 ml</small>
                    </div>
                    <div className={`m-pol m-pol--tilt-r${dev ? " m-develop" : ""}`} style={{ animationDelay: "250ms" }}>
                      <div className="m-pol-img m-tint-2">
                        <svg viewBox="0 0 120 160">
                          <use href="#p-monstera" />
                        </svg>
                      </div>
                      <b>Monty · Day 4</b>
                      <small>New leaf unfurling</small>
                    </div>
                  </div>
                )}
                <p className="eyebrow m-eyebrow">{s.eb}</p>
                <h2 className="m-h1">{s.h}</h2>
                <p className="m-sub">{s.p}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="m-ob-foot">
          <div className="m-dots" role="tablist">
            {[0, 1, 2].map((k) => (
              <button key={k} role="tab" aria-label={`Slide ${k + 1}`} aria-selected={k === i} className={k === i ? "is-on" : ""} onClick={() => goI(k)} />
            ))}
          </div>
          <Button variant="accent" className="m-btn m-btn--block" onClick={() => (i < 2 ? goI(i + 1) : push("s3-signup"))}>
            {i === 2 ? "Get started" : "Next"}
          </Button>
          <p className="m-fine">
            Already a member?{" "}
            <button className="m-link" onClick={() => push("s3-signup")}>
              Log in
            </button>
          </p>
        </div>
      </div>
    </Screen>
  );
}

/* ---------- S3 sign up — phone alone is enough; OTP is optional ---------- */
export function SignupScreen() {
  const { push, cur, toast, setUser, user } = useM();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("98110 42317");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [ok, setOk] = useState(false);
  const [bad, setBad] = useState(0);
  const [secs, setSecs] = useState(24);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => {
    if (cur === "s3-signup") {
      setStep("phone");
      setOk(false);
      if (user.name) setName(user.name);
    }
  }, [cur, user.name]);
  useEffect(() => {
    if (step !== "otp" || secs <= 0) return;
    const t = window.setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [step, secs]);
  const digits = phone.replace(/\D/g, "");
  const nice = digits.length === 10 ? "+91 " + digits.slice(0, 5) + " " + digits.slice(5) : "";
  const complete = (verified: boolean) => {
    setUser({ signedIn: true, name: name.trim() || "Nisha", phone: nice });
    push("s4-parent");
    toast(verified ? "Number verified" : nice ? "Signed in · verify your number any time" : "Account created · add your number any time");
  };
  const send = () => {
    if (digits.length !== 10) {
      toast("Enter a 10-digit number, or tap Continue without OTP");
      return;
    }
    setOtp(["", "", "", ""]);
    setOk(false);
    setStep("otp");
    setSecs(24);
    window.setTimeout(() => refs.current[0]?.focus({ preventScroll: true }), 60);
    toast("OTP sent to " + nice);
  };
  const verify = (code: string[], manual: boolean) => {
    if (!code.every((c) => /^\d$/.test(c))) {
      if (manual) {
        setBad((b) => b + 1);
        toast("Enter all 4 digits — or skip for now");
      }
      return;
    }
    setOk(true);
    window.setTimeout(() => complete(true), 650);
  };
  return (
    <Screen id="s3-signup" label="Sign up">
      <TopBar step="Step 1 of 3" />
      <div className="m-pad">
        <svg className="m-auth-mark" viewBox="0 0 120 120">
          <use href="#i-logo-mark" />
        </svg>
        <h2 className="m-h1">
          Let&apos;s get you
          <br />
          signed in
        </h2>
        <p className="m-sub">Optional — everything already works as a guest. Signing in keeps your plants and bookings on every device.</p>
        {step === "phone" ? (
          <div>
            <label className="m-label" htmlFor="mName">
              Your name (optional)
            </label>
            <input className="m-input m-input--name" id="mName" value={name} placeholder="e.g. Nisha" onChange={(e) => setName(e.target.value)} autoComplete="given-name" />
            <label className="m-label" htmlFor="mPhone">
              Mobile number
            </label>
            <div className="m-phone">
              <span className="m-cc">+91</span>
              <input
                id="mPhone"
                inputMode="numeric"
                maxLength={11}
                value={phone}
                autoComplete="tel"
                aria-label="Mobile number"
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setPhone(v.length > 5 ? v.slice(0, 5) + " " + v.slice(5) : v);
                }}
                onKeyDown={(e) => e.key === "Enter" && send()}
              />
            </div>
            <label className="m-check">
              <input type="checkbox" defaultChecked />
              <span>Send booking updates on WhatsApp</span>
            </label>
            <Button variant="accent" className="m-btn m-btn--block" onClick={send}>
              Send OTP
            </Button>
            <button className="m-skip" onClick={() => complete(false)}>
              Continue without OTP
            </button>
            <p className="m-fine">By continuing you agree to our Terms &amp; Happy-Plant guarantee policy.</p>
          </div>
        ) : (
          <div>
            <label className="m-label">
              Enter the code sent to <b>{nice}</b>
            </label>
            <div className={`m-otp${ok ? " is-ok" : ""}${bad ? " is-bad" : ""}`} key={bad}>
              {otp.map((d, k) => (
                <input
                  key={k}
                  ref={(el) => {
                    refs.current[k] = el;
                  }}
                  inputMode="numeric"
                  maxLength={1}
                  aria-label={`Digit ${k + 1}`}
                  value={d}
                  className={d ? "is-filled" : ""}
                  style={{ ["--i" as string]: k }}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(-1);
                    const next = otp.map((x, j) => (j === k ? v : x));
                    setOtp(next);
                    if (v && k < 3) refs.current[k + 1]?.focus();
                    verify(next, false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !d && k > 0) {
                      refs.current[k - 1]?.focus();
                      setOtp((o) => o.map((x, j) => (j === k - 1 ? "" : x)));
                    }
                    if (e.key === "Enter") verify(otp, true);
                  }}
                  onPaste={(e) => {
                    const p = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, 4);
                    if (!p) return;
                    e.preventDefault();
                    const next = [0, 1, 2, 3].map((j) => p[j] ?? "");
                    setOtp(next);
                    verify(next, false);
                  }}
                />
              ))}
            </div>
            <p className="m-fine">
              {secs > 0 ? (
                <>
                  Any 4 digits work in this prototype. Resend in <b>0:{String(secs).padStart(2, "0")}</b>
                </>
              ) : (
                <>
                  Didn&apos;t get it?{" "}
                  <button className="m-link" onClick={send}>
                    Resend OTP
                  </button>
                </>
              )}
            </p>
            <div className="m-row2">
              <Button variant="ghost" className="m-btn" onClick={() => setStep("phone")}>
                Change number
              </Button>
              <Button variant="accent" className="m-btn" onClick={() => verify(otp, true)}>
                Verify
              </Button>
            </div>
            <button className="m-skip" onClick={() => complete(false)}>
              Skip for now
            </button>
          </div>
        )}
      </div>
    </Screen>
  );
}

/* ---------- S4 plant parent ---------- */
const RECO: Record<string, React.ReactNode> = {
  traveller: (
    <>
      We suggest <b>Smart Drop-off</b> — a hotel suite while you travel, from ₹79/night with pick-up.
    </>
  ),
  busy: (
    <>
      We suggest <b>Monthly Care</b> — an expert every 2 weeks, ₹1,499/mo. Keys stay with your guard.
    </>
  ),
  new: (
    <>
      We suggest a <b>45-min Home Visit</b> (₹499) — your expert will teach as they care.
    </>
  ),
  jungle: (
    <>
      We suggest <b>Buddy Care+</b> — 90-min visits, priority slots and 7 free hub nights.
    </>
  ),
};
const TILES = [
  ["traveller", "dropoff", "Frequent Traveller", "Away 4+ days a month"],
  ["busy", "visit", "Busy Professional", "Long office days"],
  ["new", "visit", "New Plant Parent", "1–3 plants, learning"],
  ["jungle", "visit", "Jungle Owner", "15+ plants at home"],
] as const;

export function ParentScreen() {
  const { push, parent, setParent } = useM();
  return (
    <Screen id="s4-parent" label="What kind of plant parent are you">
      <TopBar
        step="Step 2 of 3"
        right={
          <button className="m-link" onClick={() => push("s5-addplants")}>
            Skip
          </button>
        }
      />
      <div className="m-pad">
        <h2 className="m-h1">What kind of plant parent are you?</h2>
        <p className="m-sub">We&apos;ll set up the right service for you. You can change it any time.</p>
        <div className="m-tiles">
          {TILES.map(([id, svc, b, s]) => (
            <button key={id} className={`m-tile${parent === id ? " is-on" : ""}`} onClick={() => setParent(id, svc)}>
              <svg viewBox="0 0 96 80">
                <use href={`#m-parent-${id}`} />
              </svg>
              <b>{b}</b>
              <span>{s}</span>
              <i className="m-tile-tick">
                <Ico id="i-check" />
              </i>
            </button>
          ))}
        </div>
        <div className="m-reco">
          <Ico id="i-leaf" />
          <span>{parent ? RECO[parent] : "Pick a tile to see what we suggest."}</span>
        </div>
      </div>
      <div className="m-cta-bar">
        <Button variant="accent" className="m-btn m-btn--block" disabled={!parent} onClick={() => push("s5-addplants")}>
          Continue
        </Button>
      </div>
    </Screen>
  );
}

/* ---------- S5 add plants ---------- */
const FILTERS = [
  ["all", "All"],
  ["easy", "Easy care"],
  ["pet", "Pet-safe"],
  ["low", "Low light"],
  ["sacred", "Indian classics"],
] as const;

export function AddPlantsScreen() {
  const { added, setAdded, setPlants, reset, toast, user } = useM();
  const [q, setQ] = useState("");
  const [f, setF] = useState("all");
  const qRef = useRef<HTMLInputElement>(null);
  const list = MDATA.species.filter(
    (s) => (f === "all" || (s.tags as readonly string[]).includes(f)) && (!q.trim() || (s.name + " " + s.latin).toLowerCase().includes(q.trim().toLowerCase())),
  );
  const n = added.length;
  const finish = () => {
    setPlants((ps) => {
      const next = [...ps];
      added.forEach((id) => {
        const sp = MDATA.species.find((s) => s.id === id);
        if (!sp || next.some((p) => p.fromSp === id)) return;
        next.push({
          id: "n" + id,
          fromSp: id,
          nick: sp.name,
          sp: sp.latin,
          sym: sp.sym,
          room: "Just added",
          adopted: "13 Oct 2026",
          health: 100,
          due: 7,
          water: 7,
          ml: 150,
          light: "Bright indirect",
          hum: 50,
          pet: (sp.tags as readonly string[]).includes("pet"),
          tint: 1,
        });
      });
      return next;
    });
    reset("s6-home");
    toast(n ? `${n} plant${n > 1 ? "s" : ""} added · care plans ready` : `Welcome to BloomBuddy${user.name ? ", " + user.name : ""}!`);
  };
  return (
    <Screen id="s5-addplants" label="Add your first plants">
      <TopBar step="Step 3 of 3" />
      <div className="m-pad">
        <h2 className="m-h1">Add your first plants</h2>
        <p className="m-sub">Tap to add. We&apos;ll build a care plan for each one.</p>
        <div className="m-search">
          <Ico id="m-search" />
          <input ref={qRef} placeholder="Search 1,400+ species" aria-label="Search species" value={q} onChange={(e) => setQ(e.target.value)} />
          <button
            className="m-icobtn m-icobtn--sm"
            onClick={() => {
              setQ("");
              qRef.current?.focus();
            }}
            aria-label="Clear"
          >
            <Ico id="i-close" />
          </button>
        </div>
        <div className="m-chips m-chips--scroll">
          {FILTERS.map(([v, l]) => (
            <button key={v} className={`chip${f === v ? " chip--on" : ""}`} onClick={() => setF(v)}>
              {l}
            </button>
          ))}
        </div>
        <ul className="m-species">
          {list.map((s) => {
            const on = added.includes(s.id);
            return (
              <li key={s.id}>
                <button className={on ? "is-on" : ""} aria-pressed={on} onClick={() => setAdded((a) => (on ? a.filter((x) => x !== s.id) : [...a, s.id]))}>
                  <svg className="m-sp-th" viewBox="0 0 120 160">
                    <use href={`#${s.sym}`} />
                  </svg>
                  <span className="m-sp-t">
                    <b>{s.name}</b>
                    <small>
                      <i>{s.latin}</i> · {s.note}
                    </small>
                  </span>
                  <span className="m-add">
                    <Ico id={on ? "i-check" : "i-plus"} />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="m-empty" hidden={list.length > 0}>
          No match. Try “money”, “fern” or “tulsi”.
        </p>
      </div>
      <div className="m-cta-bar">
        <Button variant="accent" className="m-btn m-btn--block" onClick={finish}>
          {n ? `Done · ${n} plant${n > 1 ? "s" : ""}` : "Done · skip for now"}
        </Button>
      </div>
    </Screen>
  );
}
