"use client";

/* S14 tracking, S15 report + rating, S16 Care + Diagnose, S17 Profile, S18 Hub detail. */

import { useEffect, useRef, useState } from "react";
import { MDATA } from "@/lib/data";
import { mBookingInitial } from "@/lib/booking";
import { reducedMotion } from "@/lib/motion";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/shared/Button";
import { QR } from "@/components/shared/QR";
import { Ico, Screen, Seg } from "../Screen";
import { useM } from "../MobileContext";

/* ---------- S14 visit-day tracking ---------- */
export function TrackScreen() {
  const { cur, pop, openSheet, toast, push } = useM();
  const route = useRef<SVGPathElement>(null);
  const [st, setSt] = useState({ x: 44, y: 200, e: 0 });
  useEffect(() => {
    if (cur !== "s14-track") return;
    const path = route.current;
    if (!path) return;
    const L = path.getTotalLength();
    const DUR = reducedMotion() ? 1 : 14000;
    const t0 = performance.now();
    let raf = 0;
    let said = false;
    const frame = (now: number) => {
      const t = Math.min(1, (now - t0) / DUR);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const p = path.getPointAtLength(L * e);
      setSt({ x: p.x, y: p.y, e });
      if (t < 1) raf = requestAnimationFrame(frame);
      else if (!said) {
        said = true;
        toast("Priya is at your door · gate 2");
      }
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [cur, toast]);
  const eta = Math.max(0, Math.ceil(12 * (1 - st.e)));
  const stepAt = eta ? 1 : 2;
  return (
    <Screen id="s14-track" className="m-noscroll" label="Visit day tracking">
      <div className="m-map">
        <svg className="m-map-svg" viewBox="0 0 390 300" preserveAspectRatio="xMidYMid slice">
          <use href="#m-map-base" width="390" height="300" />
          <path className="m-route-bg" d="M44 200 L250 200 L250 98 L330 98 L330 64" />
          <path ref={route} className="m-route" d="M44 200 L250 200 L250 98 L330 98 L330 64" pathLength={100} style={{ strokeDashoffset: String(100 - st.e * 100) }} />
          <use href="#m-home-pin" x="312" y="20" width="36" height="44" />
          <g transform={`translate(${st.x} ${st.y})`}>
            <use href="#m-scooter" x="-18" y="-18" width="36" height="36" />
          </g>
        </svg>
        <header className="m-top m-top--float">
          <button className="m-icobtn m-icobtn--glass" onClick={pop} aria-label="Back">
            <Ico id="i-back" />
          </button>
          <span className="m-live">
            <i />
            Live
          </span>
          <button className="m-icobtn m-icobtn--glass" onClick={() => openSheet("help")} aria-label="Help">
            <Ico id="m-help" />
          </button>
        </header>
      </div>
      <div className="m-trk">
        <div className="m-trk-grab" />
        <div className="m-trk-eta">
          <div>
            <span className="muted m-small">{eta ? `On the way · ${(3.2 * (1 - st.e)).toFixed(1)} km` : "Priya has arrived"}</span>
            <b className="m-trk-big">
              <span>{eta}</span> min
            </b>
          </div>
          <span className="m-tag m-tag--accent">Arriving 4:58 pm</span>
        </div>
        <ol className="m-trk-steps">
          {["Kit packed", "En route", "At your door", "Caring"].map((l, i) => (
            <li key={l} className={i < stepAt ? "is-done" : i === stepAt ? "is-on" : ""}>
              {l}
            </li>
          ))}
        </ol>
        <div className="m-expert">
          <svg className="m-expert-ava">
            <use href="#a-priya" />
          </svg>
          <div>
            <b>Priya Sharma</b>
            <span className="muted m-small">
              Certified horticulturist · 6 yrs · <Ico id="i-star" className="ico--xs m-star" />
              4.9
            </span>
            <span className="m-small m-plate">Activa · HR26 EK 4471</span>
          </div>
          <button className="m-icobtn m-icobtn--soft" onClick={() => openSheet("chat")} aria-label="Chat">
            <Ico id="i-chat" />
          </button>
          <button className="m-icobtn m-icobtn--soft" onClick={() => toast("Calling Priya via masked number…")} aria-label="Call">
            <Ico id="m-phone" />
          </button>
        </div>
        <div className="m-door">
          <Ico id="m-door" />
          <div>
            <b>Door-code reminder</b>
            <span>
              Guard at gate 2 has the spare key. Share OTP <b className="m-code">7316</b> only with Priya.
            </span>
          </div>
        </div>
        <Button
          variant="primary"
          className="m-btn m-btn--block"
          onClick={() => {
            push("s15-report");
            toast("Visit complete · report card ready");
          }}
        >
          <Ico id="i-check" />
          Mark visit complete <small>(demo)</small>
        </Button>
      </div>
    </Screen>
  );
}

/* ---------- S15 report + rating ---------- */
function BA() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const drag = useRef(false);
  const set = (pc: number) => setPos(Math.max(3, Math.min(97, pc)));
  const at = (x: number) => {
    const r = ref.current!.getBoundingClientRect();
    set(((x - r.left) / r.width) * 100);
  };
  return (
    <div
      className="m-ba"
      ref={ref}
      style={{ ["--pos" as string]: pos + "%" }}
      onPointerDown={(e) => {
        drag.current = true;
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {}
        at(e.clientX);
      }}
      onPointerMove={(e) => drag.current && at(e.clientX)}
      onPointerUp={() => (drag.current = false)}
      onPointerCancel={() => (drag.current = false)}
    >
      <div className="m-ba-pane m-ba-after">
        <svg viewBox="0 0 120 160">
          <use href="#p-monstera" />
        </svg>
        <span className="m-ba-tag">After</span>
      </div>
      <div className="m-ba-pane m-ba-before">
        <svg viewBox="0 0 120 160">
          <use href="#p-monstera-wilted" />
        </svg>
        <span className="m-ba-tag">Before</span>
      </div>
      <div
        className="m-ba-handle"
        role="slider"
        tabIndex={0}
        aria-label="Before and after"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            set(pos - 5);
            e.preventDefault();
          }
          if (e.key === "ArrowRight") {
            set(pos + 5);
            e.preventDefault();
          }
        }}
      >
        <i />
      </div>
    </div>
  );
}

const RLBL = ["Tap a star", "Not great", "Could be better", "Good", "Very good", "Loved it!"];
const RCHIPS = ["On time", "Gentle with plants", "Great tips", "Clean work", "Friendly"];

export function ReportScreen() {
  const { cur, pop, toast, tab, user } = useM();
  const [rating, setRating] = useState(0);
  const [popK, setPopK] = useState(0);
  const [chips, setChips] = useState<string[]>([]);
  const [thanks, setThanks] = useState(false);
  const [note, setNote] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (cur === "s15-report") {
      setRating(0);
      setChips([]);
      setThanks(false);
      setNote("");
    }
  }, [cur]);
  const explore = () => {
    tab("home");
    window.setTimeout(
      () => {
        const ex = document.getElementById("mExplore");
        const sc = ex?.closest(".scr");
        if (ex && sc) sc.scrollTo({ top: ex.offsetTop - 12, behavior: reducedMotion() ? "auto" : "smooth" });
      },
      reducedMotion() ? 20 : 320,
    );
  };
  return (
    <Screen id="s15-report" label="Visit report and rating">
      <header className="m-top">
        <button className="m-icobtn" onClick={pop} aria-label="Back">
          <Ico id="i-back" />
        </button>
        <span className="m-top-t">Visit report</span>
        <button className="m-icobtn" onClick={() => toast("Report saved as PDF to Downloads")} aria-label="Share">
          <Ico id="m-share" />
        </button>
      </header>
      <div className="m-pad m-pad--t8" hidden={thanks} ref={ref}>
        <div className="m-rc-hd">
          <div>
            <p className="eyebrow m-eyebrow">Report card · Thu 15 Oct</p>
            <h2 className="m-h2">4 plants cared for in 52 min</h2>
          </div>
          <span className="m-tag m-tag--ok">
            <Ico id="i-check" />
            Happy-Plant
          </span>
        </div>
        <BA />
        <p className="m-fine m-center">Drag to compare Monty · before and after</p>
        <ul className="m-done">
          {(
            [
              ["i-water", "Watered 4 plants · 820 ml total", false],
              ["i-prune", "Pruned 3 yellow leaves (Monty, Bijli)", false],
              ["i-pest", "Pest check · mealybugs removed on Shanti", false],
              ["i-repot", "Soil refresh · cocopeat + vermicompost", false],
              ["i-feed", "Next feed due Thu 12 Nov", true],
            ] as const
          ).map(([i, t, soft]) => (
            <li key={t}>
              <Ico id={i} />
              <span>{t}</span>
              <i className={`m-ok${soft ? " m-ok--soft" : ""}`}>
                <Ico id={soft ? "i-calendar" : "i-check"} />
              </i>
            </li>
          ))}
        </ul>
        <div className="m-sign">
          <svg className="m-sign-ava">
            <use href="#a-priya" />
          </svg>
          <div>
            <span className="muted m-small">“Monty is pushing a new leaf — keep it 1 m off the AC vent.”</span>
            <svg className="m-sign-sig">
              <use href="#m-signature" />
            </svg>
            <b className="m-small">Priya Sharma · BB-EXP-0142</b>
          </div>
        </div>
        <div className="card m-rate">
          <h3 className="m-h2 m-center">How was Priya&apos;s visit?</h3>
          <div className="m-stars" role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((v) => (
              <button
                key={v + "-" + (v === rating ? popK : 0)}
                role="radio"
                aria-checked={v === rating}
                aria-label={`${v} star${v > 1 ? "s" : ""}`}
                className={`${v <= rating ? "is-on" : ""}${v === rating ? " is-pop" : ""}`}
                onClick={() => {
                  setRating(v);
                  setPopK((k) => k + 1);
                }}
              >
                <svg>
                  <use href="#m-star" />
                </svg>
              </button>
            ))}
          </div>
          <p className="m-center m-rate-lbl">{RLBL[rating]}</p>
          <div className="m-chips m-chips--wrap m-chips--center">
            {RCHIPS.map((c) => (
              <button key={c} className={`chip${chips.includes(c) ? " chip--on" : ""}`} onClick={() => setChips((x) => (x.includes(c) ? x.filter((y) => y !== c) : [...x, c]))}>
                {c}
              </button>
            ))}
          </div>
          <textarea className="m-textarea" rows={2} placeholder="Anything else? (optional)" aria-label="Comment" value={note} onChange={(e) => setNote(e.target.value)} />
          <Button
            variant="accent"
            className="m-btn m-btn--block"
            disabled={!rating}
            onClick={() => {
              setThanks(true);
              ref.current?.closest(".scr")?.scrollTo({ top: 0 });
              toast(`Thanks! ${rating}★${chips.length ? " · " + chips.join(", ") : ""}`);
            }}
          >
            Submit rating
          </Button>
        </div>
      </div>
      <div className="m-thanks" hidden={!thanks}>
        <svg className="m-thanks-ill">
          <use href="#p-fiddle" />
        </svg>
        <h2 className="m-h1">Thank you{user.name ? `, ${user.name}` : ""}!</h2>
        <p className="m-sub">Your rating helps Priya and 40 other Bloom Buddies grow. ₹50 credit added for your next visit.</p>
        <Button variant="accent" className="m-btn m-btn--block" onClick={explore}>
          Explore more care
        </Button>
        <Button variant="ghost" className="m-btn m-btn--block" onClick={() => toast("Monthly Care with Priya: ₹1,499/mo · tap Book to start")}>
          Make Priya my regular expert
        </Button>
      </div>
    </Screen>
  );
}

/* ---------- S16 Care ---------- */
const CAT: Record<string, string> = { water: "Watering", light: "Light", pests: "Pests", repot: "Repotting", season: "Seasonal" };

export function CareScreen() {
  const { push, openSheet, cur } = useM();
  const [f, setF] = useState("all");
  const [k, setK] = useState(0);
  useEffect(() => {
    if (cur === "s16-care") setK((x) => x + 1);
  }, [cur]);
  const list = MDATA.tips.map((t, i) => ({ t, i })).filter((o) => f === "all" || o.t.cat === f);
  return (
    <Screen id="s16-care" className="m-tabscr" label="Care tips">
      <header className="m-top m-top--big">
        <div>
          <span className="muted m-small">Tips &amp; disease care</span>
          <h1 className="m-h1">Care</h1>
        </div>
        <button className="m-icobtn m-icobtn--soft" onClick={() => openSheet("search")} aria-label="Search tips">
          <Ico id="m-search" />
        </button>
      </header>
      <div className="m-pad m-pad--t0">
        <button className="m-diag-cta" onClick={() => push("s16-diagnose")}>
          <div>
            <p className="eyebrow m-eyebrow">Disease care</p>
            <b>Something looks off?</b>
            <span>Snap a leaf. Get a diagnosis with confidence %, then ask an expert.</span>
            <span className="btn btn--accent btn--sm m-btn--sm">
              <Ico id="i-camera" />
              Diagnose a plant
            </span>
          </div>
          <svg className="m-diag-cta-ill" viewBox="0 0 300 360">
            <use href="#m-leaf-closeup" />
          </svg>
        </button>
        <div className="m-chips m-chips--scroll">
          {(
            [
              ["all", "All"],
              ["water", "Watering"],
              ["light", "Light"],
              ["pests", "Pests"],
              ["repot", "Repotting"],
              ["season", "Seasonal"],
            ] as const
          ).map(([v, l]) => (
            <button key={v} className={`chip${f === v ? " chip--on" : ""}`} onClick={() => setF(v)}>
              {l}
            </button>
          ))}
        </div>
        <ul className="m-tips" key={k + f}>
          {list.map(({ t, i }, j) => (
            <li key={t.title}>
              <button className="m-tip" style={{ animationDelay: `${j * 40}ms` }} onClick={() => openSheet("tip", i)}>
                <svg className={`m-tip-ill m-tint-${t.tint}`} viewBox="0 0 120 160">
                  <use href={`#${t.p}`} />
                </svg>
                <div>
                  <p className="eyebrow m-eyebrow">{CAT[t.cat]}</p>
                  <b>{t.title}</b>
                  <small>{t.read} min read · by Meera Iyer</small>
                </div>
                <Ico id="i-chevron" className="m-chev" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Screen>
  );
}

/* ---------- S16b Diagnose ---------- */
export function DiagnoseScreen() {
  const { cur, pop, toast, startBook } = useM();
  const [state, setState] = useState<"ready" | "scanning" | "result">("ready");
  const t = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (cur === "s16-diagnose") setState("ready");
    return () => window.clearTimeout(t.current);
  }, [cur]);
  const scan = () => {
    if (state !== "ready") return;
    setState("scanning");
    t.current = window.setTimeout(() => setState("result"), reducedMotion() ? 200 : 2600);
  };
  return (
    <Screen id="s16-diagnose" className="m-noscroll m-dark-scr" label="Diagnose">
      <div className="m-cam" data-state={state}>
        <header className="m-top m-top--float">
          <button className="m-icobtn m-icobtn--glass" onClick={pop} aria-label="Back">
            <Ico id="i-back" />
          </button>
          <span className="m-cam-t">Diagnose</span>
          <button className="m-icobtn m-icobtn--glass" onClick={() => toast("Flash on")} aria-label="Flash">
            <Ico id="i-sun" />
          </button>
        </header>
        <div className="m-cam-view">
          <svg className="m-cam-leaf" viewBox="0 0 300 360">
            <use href="#m-leaf-closeup" />
          </svg>
          <svg className="m-cam-frame" viewBox="0 0 260 300">
            <use href="#m-scan-frame" />
          </svg>
          <div className="m-cam-scan" />
          <div className="m-cam-dots">
            {(
              [
                ["37%", "31%"],
                ["57%", "45%"],
                ["32%", "47%"],
                ["67%", "34%"],
              ] as const
            ).map(([x, y]) => (
              <i key={x + y} style={{ ["--x" as string]: x, ["--y" as string]: y }} />
            ))}
          </div>
          <p className="m-cam-hint">{state === "ready" ? "Fit one leaf inside the frame" : state === "scanning" ? "Scanning leaf… checking 38 conditions" : "4 spots found"}</p>
        </div>
        <div className="m-cam-bar">
          <button className="m-cam-side" onClick={() => toast("Gallery: 3 recent leaf photos")} aria-label="Gallery">
            <Ico id="m-bag" />
          </button>
          <button className="m-shutter" onClick={scan} aria-label="Take photo">
            <i />
          </button>
          <button className="m-cam-side" onClick={() => toast("Switched camera")} aria-label="Flip camera">
            <Ico id="m-rotate" />
          </button>
        </div>
        <div className="m-result">
          <div className="m-result-grab" />
          <div className="m-result-hd">
            <div>
              <p className="eyebrow m-eyebrow">Most likely</p>
              <h2 className="m-h2">Leaf-spot fungus</h2>
              <span className="muted m-small">Cercospora · common after monsoon</span>
            </div>
            <div className="m-conf">
              <svg viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="18" className="m-ring-bg" />
                <circle cx="22" cy="22" r="18" className="m-ring-fg m-conf-fg" pathLength={100} />
              </svg>
              <b>86%</b>
            </div>
          </div>
          <ul className="m-alts">
            <li>
              <span>Sunscald</span>
              <i style={{ ["--w" as string]: "9%" }} />
              <b>9%</b>
            </li>
            <li>
              <span>Bacterial blight</span>
              <i style={{ ["--w" as string]: "5%" }} />
              <b>5%</b>
            </li>
          </ul>
          <div className="m-rx">
            <b>Do today</b>
            <span>Cut affected leaves with clean scissors · stop misting for 7 days · water at soil level only.</span>
          </div>
          <div className="m-row2">
            <Button variant="ghost" className="m-btn" onClick={() => setState("ready")}>
              Retake
            </Button>
            <Button
              variant="accent"
              className="m-btn"
              onClick={() => {
                startBook("visit", { addons: ["pest"], expert: "meera", plants: ["monty"] });
                toast("Meera (plant pathologist) suggested · neem spray added");
              }}
            >
              Ask an expert
            </Button>
          </div>
        </div>
      </div>
    </Screen>
  );
}

/* ---------- S17 Profile ---------- */
export function ProfileScreen() {
  const { push, openSheet, toast, user, logout, reset } = useM();
  const { theme, setTheme } = useTheme();
  const [bk, setBk] = useState<"up" | "past">("up");
  return (
    <Screen id="s17-profile" className="m-tabscr" label="Profile">
      <header className="m-top m-top--big">
        <div className="m-prof">
          {user.signedIn ? (
            <svg className="m-prof-ava">
              <use href="#a-nisha" />
            </svg>
          ) : (
            <span className="m-prof-ava m-ava--guest" style={{ display: "grid", placeItems: "center", borderRadius: "50%" }}>
              <Ico id="i-user" />
            </span>
          )}
          <div>
            <h1 className="m-h2">{user.signedIn ? user.name || "Nisha Patnaik" : "Guest"}</h1>
            <span className="muted m-small">{user.signedIn ? `${user.phone || "Phone not added"} · Sector 49` : "Not signed in · Sector 49, Gurgaon"}</span>
          </div>
        </div>
        <button className="m-icobtn m-icobtn--soft" onClick={() => (user.signedIn ? toast("Edit profile") : push("s3-signup"))} aria-label={user.signedIn ? "Edit profile" : "Sign in"}>
          <Ico id="i-user" />
        </button>
      </header>
      <div className="m-pad m-pad--t0">
        {!user.signedIn ? (
          <div className="m-signin">
            <b>Sign in / Create account</b>
            <span>Optional. Keep your plants, bookings and postcards synced across devices. OTP is not required.</span>
            <Button variant="accent" className="m-btn m-btn--block" onClick={() => push("s2-onboarding")}>
              Sign in / Create account
            </Button>
          </div>
        ) : null}
        <div className="m-member">
          <div className="m-member-top">
            <svg className="m-member-logo">
              <use href="#i-logo-mono" />
            </svg>
            <span>Buddy Care+</span>
            <em>Annual · ₹9,999</em>
          </div>
          <div className="m-member-mid">
            <div>
              <span>Member since</span>
              <b>Mar 2026</b>
            </div>
            <div>
              <span>Hub nights left</span>
              <b>5 of 7</b>
            </div>
            <div>
              <span>Renews</span>
              <b>Mar 2027</b>
            </div>
          </div>
          <div className="m-member-bar">
            <i style={{ width: "71%" }} />
          </div>
          <span className="m-member-f">Priority slots · 12-month Happy-Plant guarantee</span>
        </div>
        <div className="m-sechd">
          <h3 className="m-h2">Bookings</h3>
          <Seg
            className="m-seg--mini"
            value={bk}
            onChange={setBk}
            items={[
              { v: "up", label: "Upcoming" },
              { v: "past", label: "Past" },
            ]}
          />
        </div>
        <ul className="m-bk" hidden={bk !== "up"}>
          <li>
            <button onClick={() => push("s14-track")}>
              <svg className="m-bk-ava">
                <use href="#a-priya" />
              </svg>
              <span>
                <b>Home visit · Priya</b>
                <small>Thu 15 Oct · 5:00 pm · 4 plants</small>
              </span>
              <em className="m-tag">Confirmed</em>
            </button>
          </li>
          <li>
            <button onClick={() => push("s18-hub")}>
              <svg className="m-bk-ava m-bk-ava--hub">
                <use href="#s-hub" />
              </svg>
              <span>
                <b>Drop-off · Sector 29 hub</b>
                <small>Sun 18 – Sat 24 Oct · Sunny suite</small>
              </span>
              <em className="m-tag m-tag--accent">Pick-up 9 am</em>
            </button>
          </li>
        </ul>
        <ul className="m-bk" hidden={bk !== "past"}>
          <li>
            <button onClick={() => push("s15-report")}>
              <svg className="m-bk-ava">
                <use href="#a-arjun" />
              </svg>
              <span>
                <b>Home visit · Arjun</b>
                <small>Tue 22 Sep · report card · ₹649</small>
              </span>
              <em className="m-tag m-tag--ok">★ 5</em>
            </button>
          </li>
          <li>
            <button onClick={() => push("s6-home")}>
              <svg className="m-bk-ava m-bk-ava--hub">
                <use href="#s-hub" />
              </svg>
              <span>
                <b>Drop-off · Sohna Rd hub</b>
                <small>2 – 6 Oct · 5 postcards · ₹1,616</small>
              </span>
              <em className="m-tag m-tag--ok">★ 5</em>
            </button>
          </li>
        </ul>
        <ul className="m-menu">
          <li>
            <button onClick={() => openSheet("address")}>
              <Ico id="i-pin" />
              <span>
                <b>Addresses &amp; home access</b>
                <small>2 saved · Ireo Victory Valley</small>
              </span>
              <Ico id="i-chevron" className="m-chev" />
            </button>
          </li>
          <li>
            <button onClick={() => openSheet("payments")}>
              <Ico id="m-card" />
              <span>
                <b>Payments</b>
                <small>UPI · HDFC ···· 4417 · ₹250 credits</small>
              </span>
              <Ico id="i-chevron" className="m-chev" />
            </button>
          </li>
          <li>
            <button onClick={() => openSheet("help")}>
              <Ico id="m-help" />
              <span>
                <b>Help</b>
                <small>Chat replies in under 5 min</small>
              </span>
              <Ico id="i-chevron" className="m-chev" />
            </button>
          </li>
          <li>
            <label className="m-menu-row">
              <Ico id="i-moon" />
              <span>
                <b>Dark mode</b>
                <small>Night Conservatory theme</small>
              </span>
              <input type="checkbox" checked={theme === "dark"} onChange={(e) => setTheme(e.target.checked ? "dark" : "light")} />
              <i className="m-switch" />
            </label>
          </li>
          <li>
            <label className="m-menu-row">
              <Ico id="m-bell" />
              <span>
                <b>Care reminders</b>
                <small>8:00 am daily</small>
              </span>
              <input type="checkbox" defaultChecked onChange={(e) => toast(e.target.checked ? "Reminders on · 8:00 am" : "Reminders paused")} />
              <i className="m-switch" />
            </label>
          </li>
          {user.signedIn ? (
            <li>
              <button
                onClick={() => {
                  toast("Logged out · you can keep using BloomBuddy as a guest");
                  window.setTimeout(logout, 300);
                }}
                className="m-danger"
              >
                <Ico id="m-logout" />
                <span>
                  <b>Log out</b>
                  <small>Back to guest mode</small>
                </span>
              </button>
            </li>
          ) : (
            <li>
              <button onClick={() => push("s3-signup")}>
                <Ico id="i-user" />
                <span>
                  <b>Sign in</b>
                  <small>Phone number only · OTP optional</small>
                </span>
                <Ico id="i-chevron" className="m-chev" />
              </button>
            </li>
          )}
        </ul>
        <p className="m-fine m-center">
          BloomBuddy 1.0 · Made in Gurgaon ·{" "}
          <button className="m-link m-link--sm" onClick={() => reset("s1-splash")}>
            Replay intro
          </button>
        </p>
      </div>
    </Screen>
  );
}

/* ---------- S18 Hub detail ---------- */
export function HubScreen() {
  const { hubView, pop, toast, stack, setB, push, B, cur } = useM();
  const h = MDATA.hubs.find((x) => x.id === hubView) ?? MDATA.hubs[0];
  const [shown, setShown] = useState(false);
  useEffect(() => {
    setShown(false);
    if (cur !== "s18-hub") return;
    const r = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    return () => cancelAnimationFrame(r);
  }, [cur, hubView]);
  return (
    <Screen id="s18-hub" label="Hub detail">
      <div className="m-hub-hero">
        <header className="m-top m-top--float">
          <button className="m-icobtn m-icobtn--glass" onClick={pop} aria-label="Back">
            <Ico id="i-back" />
          </button>
          <button className="m-icobtn m-icobtn--glass" onClick={() => toast("Directions opened in Maps")} aria-label="Directions">
            <Ico id="i-pin" />
          </button>
        </header>
        <svg className="m-hub-ill" viewBox="0 0 300 220" preserveAspectRatio="xMidYMid meet">
          <use href="#s-hub" />
        </svg>
      </div>
      <div className="m-pad">
        <p className="eyebrow m-eyebrow">{h.dist} away</p>
        <h1 className="m-h1">{h.name}</h1>
        <p className="muted">{h.addr}</p>
        <div className="m-hub-facts">
          <span>
            <Ico id="i-clock" />8 am – 9 pm
          </span>
          <span>
            <Ico id="i-shield" />
            CCTV · insured
          </span>
          <span>
            <Ico id="i-temp" />
            22–26°
          </span>
        </div>
        <h3 className="m-h2">Suites</h3>
        <ul className="m-hsuites">
          {MDATA.suites.map((s) => {
            const [u, c] = h.cap[s.id as "sunny" | "shade" | "humid"];
            const pc = Math.round((u / c) * 100);
            return (
              <li key={s.id}>
                <div className="m-hs-top">
                  <Ico id={s.icon} />
                  <span>
                    <b>{s.name} suite</b>
                    <small>{s.desc}</small>
                  </span>
                  <em>
                    ₹{s.price}
                    <small>/night</small>
                  </em>
                </div>
                <div className={`m-cap${pc > 80 ? " is-hi" : ""}`}>
                  <i style={{ width: shown ? pc + "%" : 0 }} />
                </div>
                <div className="m-cap-l">
                  <span>
                    {u} of {c} rooms booked
                  </span>
                  <span>{c - u} free</span>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="m-qrtag">
          <QR seed={"TAG-" + h.id} className="m-qr m-qr--sm" />
          <div>
            <b>QR pot-tags at check-in</b>
            <span className="muted m-small">Scan any tag to see that plant&apos;s stay log and daily postcards.</span>
          </div>
        </div>
        <h3 className="m-h3">Opening hours</h3>
        <ul className="m-hours">
          <li>
            <span>Mon – Fri</span>
            <b>8:00 am – 9:00 pm</b>
          </li>
          <li>
            <span>Sat – Sun</span>
            <b>9:00 am – 8:00 pm</b>
          </li>
          <li>
            <span>Diwali (Sun 8 Nov)</span>
            <b>10:00 am – 2:00 pm</b>
          </li>
        </ul>
      </div>
      <div className="m-cta-bar">
        <Button
          variant="accent"
          className="m-btn m-btn--block"
          onClick={() => {
            if (stack[stack.length - 2] === "s10-schedule") {
              setB((b) => ({ ...b, hub: h.id }));
              pop();
            } else {
              setB({ ...mBookingInitial("dropoff"), hub: h.id, plants: B.plants });
              push("s9-service");
            }
            toast(h.name + " selected");
          }}
        >
          Choose this hub
        </Button>
      </div>
    </Screen>
  );
}
