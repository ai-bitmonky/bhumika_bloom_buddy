"use client";

/* S6 Home, S7 My Plants, S8 Plant detail. Everything works as a guest. */

import { useEffect, useRef, useState } from "react";
import { MDATA } from "@/lib/data";
import { reducedMotion } from "@/lib/motion";
import { Button } from "@/components/shared/Button";
import { Ico, Screen, Seg } from "../Screen";
import { TODAY, addD, fmtD, useM } from "../MobileContext";

/* ---------- S6 Home ---------- */
const NOW0 = new Date(2026, 9, 13, 10, 41, 20).getTime();
const VISIT = new Date(2026, 9, 15, 17, 0, 0).getTime();

function Countdown() {
  const [t0] = useState(() => Date.now());
  const [now, setNow] = useState(t0);
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);
  let s = Math.max(0, Math.floor((VISIT - (NOW0 + (now - t0))) / 1000));
  const d = Math.floor(s / 86400);
  s %= 86400;
  const h = Math.floor(s / 3600);
  s %= 3600;
  const m = Math.floor(s / 60);
  s %= 60;
  return (
    <div className="m-count">
      {(
        [
          [d, "days"],
          [h, "hrs"],
          [m, "min"],
          [s, "sec"],
        ] as const
      ).map(([v, u], i) => (
        <span key={u}>
          <b>{i ? String(v).padStart(2, "0") : v}</b>
          {u}
        </span>
      ))}
    </div>
  );
}

function Tasks() {
  const { plants, smart, done, setDone, openPlant, push, toast } = useM();
  const [leaving, setLeaving] = useState<string[]>([]);
  const [rip, setRip] = useState<string | null>(null);
  const ml = (p: { ml: number }) => Math.round((p.ml * (smart ? 1.15 : 1)) / 10) * 10;
  const left = MDATA.tasks.filter((t) => !done.includes(t.id));
  const mark = (id: string) => {
    if (done.includes(id) || leaving.includes(id)) return;
    setRip(id);
    const t = MDATA.tasks.find((x) => x.id === id);
    toast(t ? t.title + " — done" : "Done");
    window.setTimeout(() => setLeaving((l) => [...l, id]), reducedMotion() ? 0 : 280);
    window.setTimeout(() => setDone((d) => [...d, id]), reducedMotion() ? 10 : 950);
  };
  return (
    <ul className="m-tasks">
      {left.map((t) => {
        if (t.kind === "visit")
          return (
            <li key={t.id} className="m-task m-task--visit">
              <svg className="m-task-th" viewBox="0 0 80 80">
                <use href={`#${t.sym}`} />
              </svg>
              <button className="m-task-t" style={{ textAlign: "left" }} onClick={() => push("s14-track")}>
                <span className="m-vchip">EXPERT VISIT</span>
                <b>{t.title}</b>
                <small>{t.sub}</small>
              </button>
              <button className="m-task-go" aria-label="Track visit" onClick={() => push("s14-track")}>
                <Ico id="i-pin" />
              </button>
            </li>
          );
        const p = plants.find((x) => x.id === t.plant);
        const isDone = rip === t.id || leaving.includes(t.id);
        return (
          <li key={t.id} className={`m-task${leaving.includes(t.id) ? " is-done" : ""}`}>
            <svg className="m-task-th" viewBox="0 0 120 160">
              <use href={`#${p?.sym ?? "p-fern"}`} />
            </svg>
            <button className="m-task-t" style={{ textAlign: "left" }} onClick={() => p && openPlant(p.id)}>
              <b>
                {t.title}
                {t.kind === "water" && p ? (
                  <>
                    {" · "}
                    <span className="m-amt">{ml(p)} ml</span>
                  </>
                ) : null}
              </b>
              <small>
                {t.kind === "water" && smart ? (
                  <>
                    <span className="m-amt">+15%</span> ·{" "}
                  </>
                ) : null}
                {t.sub}
              </small>
            </button>
            <button className={`m-task-go${rip === t.id ? " ripple-on" : ""}`} aria-label={`Mark ${t.title} done`} onClick={() => mark(t.id)}>
              <Ico id={isDone ? "i-check" : (t.icon ?? "i-water")} />
            </button>
          </li>
        );
      })}
      {left.filter((t) => t.kind !== "visit").length ? null : (
        <li className="m-alldone">
          All plants cared for today 🌿<small>Next: water Vrinda tomorrow, 8:00 am</small>
        </li>
      )}
    </ul>
  );
}

function Upcoming() {
  const { smart, push, openSheet } = useM();
  return (
    <ul className="m-tasks">
      {MDATA.upcoming.map((g) => [
        <li key={g.day} className="m-updh">
          {g.day}
        </li>,
        ...g.items.map((it, k) => {
          const x = it as typeof it & { ml?: number; visit?: boolean; stay?: boolean };
          const vb = x.sym.startsWith("a-") ? "0 0 80 80" : x.sym.startsWith("s-") ? "0 0 300 220" : "0 0 120 160";
          return (
            <li key={g.day + k} className={`m-task${x.visit ? " m-task--visit" : ""}${x.stay ? " m-task--stay" : ""}`}>
              <svg className="m-task-th" viewBox={vb}>
                <use href={`#${x.sym}`} />
              </svg>
              <div className="m-task-t">
                {x.visit ? <span className="m-vchip">EXPERT VISIT</span> : null}
                {x.stay ? (
                  <span className="m-vchip" style={{ background: "var(--accent)", color: "#fff" }}>
                    HUB STAY
                  </span>
                ) : null}
                <b>
                  {x.t}
                  {x.ml ? " · " + Math.round((x.ml * (smart ? 1.15 : 1)) / 10) * 10 + " ml" : ""}
                </b>
                <small>{x.s}</small>
              </div>
              <button
                className="m-task-go"
                aria-label="Open"
                onClick={() => (x.visit ? push("s14-track") : x.stay ? push("s18-hub") : openSheet("remind"))}
              >
                <Ico id={x.visit ? "i-pin" : x.stay ? "i-chevron" : "i-clock"} />
              </button>
            </li>
          );
        }),
      ])}
    </ul>
  );
}

function Postcards({ active }: { active: boolean }) {
  const { toast } = useM();
  const box = useRef<HTMLDivElement>(null);
  const [dev, setDev] = useState<Record<number, number>>({});
  useEffect(() => {
    if (!active) return;
    const root = box.current?.closest(".scr") ?? null;
    const items = Array.from(box.current?.querySelectorAll<HTMLElement>(".m-pol") ?? []);
    if (reducedMotion() || !("IntersectionObserver" in window)) {
      setDev(Object.fromEntries(items.map((_, i) => [i, 1])));
      return;
    }
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = +((e.target as HTMLElement).dataset.pc ?? 0);
          window.setTimeout(() => setDev((d) => (d[i] ? d : { ...d, [i]: 1 })), (i % 3) * 180);
          io.unobserve(e.target);
        }),
      { root, threshold: 0.45 },
    );
    items.forEach((p) => io.observe(p));
    return () => io.disconnect();
  }, [active]);
  return (
    <div className="m-hscroll m-pcs" ref={box}>
      {MDATA.postcards.map((c, i) => (
        <button
          key={c.name + (dev[i] ?? 0)}
          className={`m-pol${dev[i] ? " m-develop" : ""}`}
          data-pc={i}
          style={{ textAlign: "left" }}
          onClick={() => {
            setDev((d) => ({ ...d, [i]: (d[i] ?? 0) + 1 }));
            toast(`${c.name}: “${c.note}”`);
          }}
        >
          <div className={`m-pol-img m-tint-${c.tint}`}>
            <svg viewBox="0 0 120 160">
              <use href={`#${c.p}`} />
            </svg>
          </div>
          <b>{c.name}</b>
          <small>{c.day}</small>
          <div className="m-pol-ico">
            <span>
              <Ico id="i-water" />✓
            </span>
            <span>
              <Ico id="i-light" />✓
            </span>
            <span>
              <Ico id="i-leaf" />
              92
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

export function HomeScreen() {
  const { cur, tab, push, openSheet, startBook, smart, setSmart, done, toast, user, banner, dismissBanner } = useM();
  const [seg, setSeg] = useState<"today" | "upcoming">("today");
  const left = MDATA.tasks.filter((t) => !done.includes(t.id) && t.kind !== "visit").length;
  const greet = user.name ? `Namaste, ${user.name}` : "Namaste, plant parent";
  return (
    <Screen id="s6-home" className="m-tabscr" label="Home">
      <header className="m-hello">
        <button className={`m-ava${user.signedIn ? "" : " m-ava--guest"}`} onClick={() => tab("profile")} aria-label="Profile">
          {user.signedIn ? (
            <svg>
              <use href="#a-nisha" />
            </svg>
          ) : (
            <Ico id="i-user" />
          )}
        </button>
        <div className="m-hello-txt">
          <span className="muted">Tue, 13 Oct · Sector 49, Gurgaon</span>
          <h1 className="m-h1 m-h1--hello">{greet}</h1>
        </div>
        <button className="m-icobtn m-icobtn--soft" onClick={() => openSheet("notif")} aria-label="Notifications">
          <Ico id="m-bell-on" />
        </button>
      </header>
      <div className="m-pad m-pad--t0">
        {!user.signedIn && banner ? (
          <div className="m-guest">
            <Ico id="i-leaf" />
            <div>
              <b>Browsing as a guest</b>
              <span>Everything works — no login needed.</span>
              <button className="m-link m-link--sm" style={{ justifySelf: "start" }} onClick={() => push("s2-onboarding")}>
                Sign in / Create account
              </button>
            </div>
            <button className="m-icobtn" onClick={dismissBanner} aria-label="Dismiss">
              <Ico id="i-close" />
            </button>
          </div>
        ) : null}
        <div className={`m-smart${smart ? "" : " is-reset"}`}>
          <Ico id="m-weather" />
          <div>
            <b>{smart ? "32° · hot week: +15% water" : "32° · original schedule"}</b>
            <span>{smart ? "Gurgaon is 4° above normal till Sun. Amounts adjusted." : "Smart adjustment paused. Base amounts restored."}</span>
          </div>
          <button
            className="m-link m-link--sm"
            onClick={() => {
              setSmart(!smart);
              toast(!smart ? "Smart schedule on: +15% water this week" : "Reset to original amounts");
            }}
          >
            {smart ? "Reset" : "Re-apply"}
          </button>
        </div>
        <Seg
          items={[
            {
              v: "today",
              label: (
                <>
                  Today <em>{left || "✓"}</em>
                </>
              ),
            },
            { v: "upcoming", label: "Upcoming" },
          ]}
          value={seg}
          onChange={setSeg}
        />
        {seg === "today" ? <Tasks /> : <Upcoming />}

        <div className="m-sechd">
          <h3 className="m-h2">Next booking</h3>
          <button className="m-link m-link--sm" onClick={() => tab("profile")}>
            All bookings
          </button>
        </div>
        <button className="m-next" onClick={() => push("s14-track")}>
          <div className="m-next-l">
            <svg className="m-next-ava">
              <use href="#a-priya" />
            </svg>
            <div>
              <b>Home visit · Priya Sharma</b>
              <span>Thu 15 Oct · 5:00 pm · 45 min · 4 plants</span>
            </div>
          </div>
          <Countdown />
          <div className="m-next-f">
            <span className="m-tag">
              <Ico id="i-shield" />
              Verified · Insured
            </span>
            <span className="m-next-go">
              Track visit <Ico id="i-chevron" />
            </span>
          </div>
        </button>

        <div className="m-sechd">
          <h3 className="m-h2">Plant Postcards</h3>
          <span className="muted m-small">Sohna Rd hub · 2–6 Oct</span>
        </div>
        <Postcards active={cur === "s6-home"} />

        <article className="m-tipcard">
          <div className="m-tipcard-ill">
            <svg>
              <use href="#p-tulsi" />
            </svg>
          </div>
          <div>
            <p className="eyebrow m-eyebrow">Smart tip · for your Tulsi</p>
            <b>Nights drop to 18° next week. Move Vrinda off the balcony grill after sunset.</b>
            <button className="m-link m-link--sm" onClick={() => openSheet("tip", 3)}>
              Read: Tulsi through Delhi winters · 4 min
            </button>
          </div>
        </article>

        <div className="m-sechd" id="mExplore">
          <h3 className="m-h2">Explore services</h3>
          <span className="muted m-small">Gurgaon · 11 sectors</span>
        </div>
        <div className="m-explore">
          <button className="m-svc m-svc--visit" onClick={() => startBook("visit")}>
            <svg className="m-svc-ill">
              <use href="#s-expert-watering" />
            </svg>
            <p className="eyebrow m-eyebrow">Expert home visit</p>
            <b>From ₹499</b>
            <span>45 or 90 min · same-week slots</span>
          </button>
          <button className="m-svc m-svc--drop" onClick={() => startBook("dropoff")}>
            <svg className="m-svc-ill">
              <use href="#s-hub" />
            </svg>
            <p className="eyebrow m-eyebrow">Smart Drop-off</p>
            <b>₹79 / plant-night</b>
            <span>3 hubs · pick-up ₹199</span>
          </button>
        </div>
        <button className="m-wide" onClick={() => tab("care")}>
          <Ico id="i-camera" />
          <div>
            <b>Spots on a leaf?</b>
            <span>Photo diagnosis in 10 seconds, free</span>
          </div>
          <Ico id="i-chevron" />
        </button>
      </div>
    </Screen>
  );
}

/* ---------- S7 My Plants ---------- */
export function PlantsScreen() {
  const { plants, openPlant, push, cur } = useM();
  const [sort, setSort] = useState<"name" | "species" | "due">("name");
  const [k, setK] = useState(0);
  useEffect(() => {
    if (cur === "s7-plants") setK((x) => x + 1);
  }, [cur]);
  const arr = [...plants].sort((a, b) => (sort === "name" ? a.nick.localeCompare(b.nick) : sort === "species" ? a.sp.localeCompare(b.sp) : a.due - b.due));
  return (
    <Screen id="s7-plants" className="m-tabscr" label="My Plants">
      <header className="m-top m-top--big">
        <div>
          <span className="muted m-small">{plants.length} plants · 2 rooms + balcony</span>
          <h1 className="m-h1">My Plants</h1>
        </div>
        <button className="m-icobtn m-icobtn--soft" onClick={() => push("s5-addplants")} aria-label="Add plant">
          <Ico id="i-plus" />
        </button>
      </header>
      <div className="m-pad m-pad--t0">
        <div className="m-chips">
          <span className="muted m-small">Sort</span>
          {(
            [
              ["name", "Name"],
              ["species", "Species"],
              ["due", "Next due"],
            ] as const
          ).map(([v, l]) => (
            <button key={v} className={`chip${sort === v ? " chip--on" : ""}`} onClick={() => setSort(v)}>
              {l}
            </button>
          ))}
        </div>
        <div className="m-pgrid" key={k + sort}>
          {arr.map((p, i) => (
            <button key={p.id} className="m-pcard" style={{ animationDelay: `${i * 40}ms` }} onClick={() => openPlant(p.id)}>
              <div className={`m-pcard-ill m-tint-${p.tint}`}>
                <svg viewBox="0 0 120 160">
                  <use href={`#${p.sym}`} />
                </svg>
              </div>
              <div className={`m-ring${p.health < 75 ? " is-warn" : ""}`}>
                <svg viewBox="0 0 44 44">
                  <circle cx="22" cy="22" r="18" className="m-ring-bg" />
                  <circle cx="22" cy="22" r="18" className="m-ring-fg" pathLength={100} strokeDasharray={`${p.health} 100`} />
                </svg>
                <b>{p.health}</b>
              </div>
              <b>{p.nick}</b>
              <small>{p.sp}</small>
              <div className="m-pcard-ic">
                <Ico id="i-water" />
                <Ico id="i-light" />
                <Ico id={p.hum >= 60 ? "i-humidity" : "i-temp"} />
                {p.pet ? <Ico id="i-petsafe" /> : null}
              </div>
              <span className="m-pcard-due">{p.due === 0 ? "Water today" : p.due === 1 ? "Due tomorrow" : "Due in " + p.due + " days"}</span>
            </button>
          ))}
        </div>
      </div>
      <button className="m-fab" onClick={() => push("s16-diagnose")} aria-label="Diagnose a plant">
        <Ico id="i-camera" />
        <span>Diagnose</span>
      </button>
    </Screen>
  );
}

/* ---------- S8 Plant detail ---------- */
export function PlantScreen() {
  const { plants, curPlant, pop, toast, smart, startBook, defaultSvc } = useM();
  const p = plants.find((x) => x.id === curPlant) ?? plants[0];
  const ml = Math.round((p.ml * (smart ? 1.15 : 1)) / 10) * 10;
  const care: [string, string, string, boolean][] = [
    ["i-water", `Every ${p.water} days`, `${ml} ml per drink`, false],
    ["i-light", p.light, "Light", false],
    ["i-humidity", p.hum + "% humidity", "Mist if below", false],
    ["i-petsafe", p.pet ? "Pet-safe ✓" : "Pet-safe ✗", p.pet ? "Safe for Coco" : "Keep from Coco", !p.pet],
  ];
  const journal: [string, string, string, boolean][] = [
    ["Today", "Watered " + ml + " ml", "Smart schedule (+15% hot week)", false],
    ["Thu 8 Oct", "Plant Postcard", "“Looking perky after the hub stay.” — Sohna Rd hub", false],
    ["Tue 22 Sep", "Visit report · Arjun", "Pruned 2 leaves, neem spray, soil topped up", true],
    ["Sat 12 Sep", "Repotted", "Moved to 30 cm terracotta pot", false],
    [p.adopted, "Adopted " + p.nick, "Welcome home 🌱", false],
  ];
  return (
    <Screen id="s8-plant" label="Plant detail">
      <div className="m-pd-hero">
        <header className="m-top m-top--float">
          <button className="m-icobtn m-icobtn--glass" onClick={pop} aria-label="Back">
            <Ico id="i-back" />
          </button>
          <button className="m-icobtn m-icobtn--glass" onClick={() => toast("Care plan shared on WhatsApp")} aria-label="Share">
            <Ico id="m-share" />
          </button>
        </header>
        <svg className="m-pd-ill" viewBox="0 0 120 160">
          <use href={`#${p.sym}`} />
        </svg>
        <div className={`m-ring${p.health < 75 ? " is-warn" : ""}`}>
          <svg viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="18" className="m-ring-bg" />
            <circle cx="22" cy="22" r="18" className="m-ring-fg" pathLength={100} strokeDasharray={`${p.health} 100`} />
          </svg>
          <b>{p.health}</b>
          <small>health</small>
        </div>
      </div>
      <div className="m-pad">
        <p className="eyebrow m-eyebrow">{p.sp}</p>
        <h1 className="m-h1">{p.nick}</h1>
        <p className="muted">
          Adopted {p.adopted} · {p.room}
        </p>
        <div className="m-care">
          {care.map(([i, a, b, no]) => (
            <div key={a} className={no ? "is-no" : ""}>
              <Ico id={i} />
              <span>
                {a}
                <small>{b}</small>
              </span>
            </div>
          ))}
        </div>
        <div className="m-plan">
          <Ico id="m-sprout" />
          <div>
            <b>Custom care plan</b>
            <span>
              Organic feed every 4 weeks · {p.health < 75 ? "pest check booked" : "repot due Mar 2027"} · next water {p.due === 0 ? "today" : fmtD(addD(TODAY, p.due))}
            </span>
          </div>
        </div>
        <h3 className="m-h2">Journal</h3>
        <ol className="m-journal">
          {journal.map(([d, a, b, v]) => (
            <li key={a} className={v ? "is-visit" : ""}>
              <time>{d}</time>
              <b>{a}</b>
              <span>{b}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="m-cta-bar">
        <Button
          variant="accent"
          className="m-btn m-btn--block"
          onClick={() => {
            startBook(defaultSvc, { plants: [p.id], dropPlants: 1 });
            toast("Booking care for " + p.nick);
          }}
        >
          <Ico id="i-calendar" />
          Book care for this plant
        </Button>
      </div>
    </Screen>
  );
}
