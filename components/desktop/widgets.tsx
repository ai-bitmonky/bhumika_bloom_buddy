"use client";

/* Interactive pieces of the desktop website (each one replaces a renderer/handler from the v1.0 prototype script). */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DATA, inr } from "@/lib/data";
import { dDays, useBooking, type Svc } from "@/lib/booking";
import { reducedMotion } from "@/lib/motion";
import { Avatar, Icon, PlantArt, Stars } from "@/components/shared/Icon";
import { Button } from "@/components/shared/Button";
import { Chip } from "@/components/shared/Chip";
import { Reveal } from "@/components/shared/Reveal";
import { useToast } from "@/components/shared/Toast";

export function scrollToId(id: string) {
  const el = document.getElementById(id.replace(/^#/, ""));
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: reducedMotion() ? "auto" : "smooth" });
}

/* ---------- two-date widget (hero + drop-off) ---------- */
export function DateWidget({ mode }: { mode: "hero" | "drop" }) {
  const { open } = useBooking();
  const toast = useToast();
  const [svc, setSvc] = useState<Svc>(mode === "hero" ? "visit" : "drop");
  const [from, setFrom] = useState("2026-10-23");
  const [to, setTo] = useState("2026-11-01");
  const [n, setN] = useState(6);
  const nights = dDays(from, to);
  let price: number, calc: string;
  if (svc === "visit") {
    const v = Math.max(1, Math.ceil(nights / 2.5));
    const each = 499 + Math.max(0, n - 8) * 40;
    price = v * each;
    calc = `${v} visits × ${inr(each)} · every 2–3 days while you're away`;
  } else {
    price = nights * n * 99;
    calc = `${nights} nights × ${n} plants × ₹99 · Bright-shade suite`;
  }
  const go = () => {
    if (to <= from) {
      toast("Back date must be after Leaving date", "i-calendar");
      return;
    }
    open(svc, { from, to, n, step: svc === "drop" ? 2 : 1 });
  };
  return (
    <div className="card d-widget">
      {mode === "hero" && (
        <div className="seg">
          <button className={svc === "visit" ? "on" : ""} onClick={() => setSvc("visit")}>
            Home Visit
          </button>
          <button className={svc === "drop" ? "on" : ""} onClick={() => setSvc("drop")}>
            Smart Drop-off
          </button>
        </div>
      )}
      <div className="d-fields">
        <label className="d-field">
          <span>Leaving</span>
          <input type="date" value={from} min="2026-10-13" onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label className="d-field">
          <span>Back</span>
          <input type="date" value={to} min="2026-10-14" onChange={(e) => setTo(e.target.value)} />
        </label>
        <div className="d-field">
          <span>Plants</span>
          <div className="d-qty">
            <button onClick={() => setN((x) => Math.max(1, x - 1))} aria-label="Fewer plants">
              −
            </button>
            <b className="tnum">{n}</b>
            <button onClick={() => setN((x) => Math.min(40, x + 1))} aria-label="More plants">
              +
            </button>
          </div>
        </div>
      </div>
      <div className="d-widget-f">
        <div>
          <span className="price tnum">{inr(price)}</span>
          <small>{calc}</small>
        </div>
        <Button variant="primary" onClick={go}>
          {svc === "visit" ? "See price " : "Reserve suites "}
          <Icon id="i-chevron" />
        </Button>
      </div>
    </div>
  );
}
export const HeroWidget = () => <DateWidget mode="hero" />;
export const DropWidget = () => <DateWidget mode="drop" />;

/* ---------- generic CTAs ---------- */
export function BookBtn({
  svc = "visit",
  className = "btn btn--accent",
  children,
  opts,
  style,
}: {
  svc?: Svc;
  className?: string;
  children: React.ReactNode;
  opts?: Parameters<ReturnType<typeof useBooking>["open"]>[1];
  style?: React.CSSProperties;
}) {
  const { open } = useBooking();
  return (
    <button className={className} style={style} onClick={() => open(svc, opts)}>
      {children}
    </button>
  );
}
export function PlanBtn({ plan, className, children, style }: { plan: string; className?: string; children: React.ReactNode; style?: React.CSSProperties }) {
  const { open } = useBooking();
  return (
    <button className={className} style={style} onClick={() => open("visit", { plan })}>
      {children}
    </button>
  );
}
export function ScrollBtn({ to, className, children }: { to: string; className?: string; children: React.ReactNode }) {
  return (
    <button className={className} onClick={() => scrollToId(to)}>
      {children}
    </button>
  );
}
export function ToastBtn({ msg, ico, className, children }: { msg: string; ico?: string; className?: string; children: React.ReactNode }) {
  const toast = useToast();
  return (
    <button className={className} onClick={() => toast(msg, ico)}>
      {children}
    </button>
  );
}

/* ---------- home: personas + bento highlight ---------- */
const PERSONAS = [
  { t: "Frequent Traveller", d: "Away for work or holidays every month.", art: "p-snake", cell: "drop", rec: "Smart Drop-off" },
  { t: "Busy Professional", d: "Home late, weekends packed.", art: "p-moneyplant", cell: "plus", rec: "Buddy Care+" },
  { t: "New Plant Parent", d: "First few plants, lots of questions.", art: "p-pothos", cell: "disease", rec: "Disease Care & tips" },
  { t: "Jungle Owner", d: "20+ plants and a crowded balcony.", art: "p-fern", cell: "visit", rec: "Expert Home Visit" },
];
export function PersonaTiles() {
  const toast = useToast();
  const [on, setOn] = useState<number | null>(null);
  useEffect(() => {
    const b = document.querySelector<HTMLElement>(".d-bento");
    if (b) b.dataset.hl = on === null ? "" : PERSONAS[on].cell;
  }, [on]);
  return (
    <div className="d-tiles">
      {PERSONAS.map((p, i) => (
        <Reveal
          as="button"
          key={p.t}
          className={`d-tile${on === i ? " on" : ""}`}
          onClick={() => {
            setOn(i);
            window.setTimeout(() => {
              const el = document.querySelector<HTMLElement>(`.d-cell[data-cell="${p.cell}"]`);
              if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: reducedMotion() ? "auto" : "smooth" });
            }, 120);
            toast(`Best fit for a ${p.t}: ${p.rec}`, "i-leaf");
          }}
        >
          <PlantArt id={p.art} />
          <b>{p.t}</b>
          <span>{p.d}</span>
          <span className="pill pill--accent">Best fit: {p.rec}</span>
        </Reveal>
      ))}
    </div>
  );
}

/* ---------- experts / plans / reviews ---------- */
export function ExpertCards() {
  return (
    <div className="d-experts" id="expertCards">
      {DATA.experts.map((e) => (
        <Reveal key={e.id} className="card d-ex">
          <div className="top">
            <Avatar id={e.art} />
            <div>
              <b>{e.name}</b>
              <span className="pill" style={{ marginTop: 6 }}>
                {e.role}
              </span>
            </div>
          </div>
          <div className="meta">
            <span className="pill pill--gold">
              <Icon id="i-shield" />
              Background verified
            </span>
            {e.langs.map((l) => (
              <span key={l} className="chip" style={{ minHeight: 26, fontSize: 12, padding: "0 10px" }}>
                {l}
              </span>
            ))}
          </div>
          <div className="stats">
            <div>
              <b>{e.rating} ★</b>
              <br />
              <span>rating</span>
            </div>
            <div>
              <b>{e.yrs} yrs</b>
              <br />
              <span>experience</span>
            </div>
            <div>
              <b className="tnum">{e.visits}</b>
              <br />
              <span>visits</span>
            </div>
          </div>
          <p>
            {e.bio}
            <br />
            <span style={{ fontSize: 12.5 }}>
              <Icon id="i-pin" /> {e.area}
            </span>
          </p>
          <div className="ft">
            <small>
              Next free
              <br />
              <b>{e.next}</b>
            </small>
            <BookBtn className="btn btn--primary btn--sm" opts={{ expert: e.id }}>
              Book {e.name.split(" ")[0]}
            </BookBtn>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function PlanCards({ picked }: { picked?: string | null }) {
  return (
    <div className="d-plans">
      {DATA.plans.map((p) => (
        <Reveal key={p.id} className={`card d-plan${p.id === "monthly" ? " d-plan--hl" : ""}${picked === p.id ? " picked" : ""}`}>
          {p.tag ? <span className="badge">{p.tag}</span> : null}
          <span className="eyebrow" style={p.id === "monthly" ? { color: "var(--pollen)" } : undefined}>
            {p.name}
          </span>
          <div className="pr tnum">
            {inr(p.price)} <small>{p.per}</small>
          </div>
          <p>{p.blurb}</p>
          <ul>
            {p.feats.map((f) => (
              <li key={f}>
                <Icon id="i-check" />
                {f}
              </li>
            ))}
          </ul>
          <PlanBtn plan={p.id} className={`btn ${p.id === "monthly" ? "btn--accent" : "btn--ghost"}`} style={p.id === "monthly" ? undefined : { color: "inherit" }}>
            Choose {p.name}
          </PlanBtn>
        </Reveal>
      ))}
    </div>
  );
}

export function ReviewCards() {
  return (
    <div className="d-revs">
      {DATA.reviews.map((r) => (
        <Reveal key={r.who} className="card d-rev">
          <Stars n={r.stars} />
          <q>{r.q}</q>
          <div className="who">
            <Avatar id={r.art} />
            <div>
              <b>{r.who}</b>
              <span>
                {r.area} · {r.when}
              </span>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ---------- tips ---------- */
function TipCard({ t, hidden }: { t: (typeof DATA.tips)[number]; hidden?: boolean }) {
  const { openTip } = useBooking();
  return (
    <button className={`card d-tip${hidden ? " hide" : ""}`} onClick={() => openTip(t.id)}>
      <div className="img">
        <PlantArt id={t.art} />
      </div>
      <div className="bd">
        <span className="eyebrow">{t.cat}</span>
        <b>{t.title}</b>
        <small>
          <Icon id="i-clock" />
          {t.read} min read · by {t.id < "t5" ? "Priya" : "Arjun"}
        </small>
      </div>
    </button>
  );
}
export function TipCarouselSection() {
  const ref = useRef<HTMLDivElement>(null);
  const move = (d: number) => {
    const c = ref.current;
    if (!c || !c.firstElementChild) return;
    c.scrollBy({ left: d * ((c.firstElementChild as HTMLElement).offsetWidth + 20), behavior: reducedMotion() ? "auto" : "smooth" });
  };
  return (
    <>
      <Reveal className="d-head">
        <div>
          <span className="eyebrow">Tips &amp; Tricks</span>
          <h2 className="h2">Little lessons from our experts.</h2>
        </div>
        <div className="d-arrows">
          <button onClick={() => move(-1)} aria-label="Previous tips">
            <Icon id="i-chevron" />
          </button>
          <button onClick={() => move(1)} aria-label="Next tips">
            <Icon id="i-chevron" />
          </button>
        </div>
      </Reveal>
      <div className="d-carousel" ref={ref}>
        {DATA.tips.slice(0, 6).map((t) => (
          <TipCard key={t.id} t={t} />
        ))}
      </div>
    </>
  );
}
const CATS = ["All", "Watering", "Light", "Pests", "Repotting", "Seasonal"];
export function TipsAll() {
  const [f, setF] = useState("All");
  const n = DATA.tips.filter((t) => f === "All" || t.cat === f).length;
  return (
    <>
      <div className="d-head" style={{ marginBottom: 0 }}>
        <div className="d-filter">
          {CATS.map((c) => (
            <Chip key={c} on={f === c} onClick={() => setF(c)}>
              {c}
            </Chip>
          ))}
        </div>
        <span className="muted" style={{ fontSize: 14 }}>
          {n} guide{n > 1 ? "s" : ""}
        </span>
      </div>
      <div className="d-tgrid">
        {DATA.tips.map((t) => (
          <TipCard key={t.id} t={t} hidden={!(f === "All" || t.cat === f)} />
        ))}
      </div>
    </>
  );
}

/* ---------- coverage + contact ---------- */
export function SectorChips() {
  const toast = useToast();
  const [on, setOn] = useState<string | null>(null);
  return (
    <div className="d-chips">
      {DATA.sectors.map((s) => (
        <Chip
          key={s}
          on={on === s}
          onClick={() => {
            const next = on === s ? null : s;
            setOn(next);
            if (next) {
              const h = [...s].reduce((a, c) => a + c.charCodeAt(0), 0);
              toast(`${s}: ${3 + (h % 9)} visit slots free this week · nearest hub ${DATA.hubs[h % 3].name}`, "i-pin");
            }
          }}
        >
          {s}
        </Chip>
      ))}
    </div>
  );
}

function UploadTile({ done, onClick }: { done: boolean; onClick: () => void }) {
  return (
    <button type="button" className={`d-upl${done ? " done" : ""}`} onClick={onClick}>
      {done ? (
        <>
          <span className="ic">
            <PlantArt id="p-fiddle" />
          </span>
          <span>
            <b>fiddle_leaf_spots.jpg</b>
            <br />
            2.4 MB · tap to replace
          </span>
        </>
      ) : (
        <>
          <span className="ic">
            <Icon id="i-camera" />
          </span>
          <span>
            <b>Add a photo of your plant</b>
            <br />
            JPG or PNG, up to 10 MB
          </span>
        </>
      )}
    </button>
  );
}

export function ContactForm() {
  const toast = useToast();
  const [bad, setBad] = useState({ name: false, phone: false });
  const [photo, setPhoto] = useState(false);
  return (
    <Reveal
      as="form"
      className="card d-form"
      id="contactForm"
      noValidate
      onSubmit={(e: React.FormEvent<HTMLElement>) => {
        e.preventDefault();
        const f = e.currentTarget as HTMLFormElement;
        const nm = (f.elements.namedItem("name") as HTMLInputElement).value.trim();
        const ph = (f.elements.namedItem("phone") as HTMLInputElement).value.replace(/\D/g, "");
        setBad({ name: !nm, phone: ph.length !== 10 });
        if (!nm || ph.length !== 10) {
          toast("Please add your name and a 10-digit phone", "i-close");
          return;
        }
        toast(`Thanks ${nm.split(" ")[0]}! We'll reply by tomorrow, 6 pm.`, "i-chat");
        f.reset();
        setPhoto(false);
      }}
    >
      <div>
        <span className="eyebrow">Talk to us</span>
        <h3 className="h3" style={{ marginTop: 8, fontSize: 26 }}>
          Not sure what your plants need?
        </h3>
        <p className="muted" style={{ margin: "6px 0 0", fontSize: 14 }}>
          Send a photo. We reply within 1 business day.
        </p>
      </div>
      <div className="two">
        <label className={`d-in${bad.name ? " bad" : ""}`}>
          Your name
          <input name="name" placeholder="e.g. Ritika Kapoor" />
        </label>
        <label className={`d-in${bad.phone ? " bad" : ""}`}>
          Phone
          <input name="phone" inputMode="tel" placeholder="98xxx xxxxx" />
        </label>
      </div>
      <label className="d-in">
        Message
        <textarea name="msg" placeholder="My fiddle-leaf fig has brown spots and drops leaves…" />
      </label>
      <UploadTile done={photo} onClick={() => setPhoto(true)} />
      <Button variant="primary" type="submit">
        Send message <Icon id="i-chevron" />
      </Button>
    </Reveal>
  );
}

export function BizQuote() {
  const toast = useToast();
  const [bad, setBad] = useState({ co: false, email: false });
  return (
    <Reveal
      as="form"
      className="card d-form"
      id="bizQuote"
      noValidate
      onSubmit={(e: React.FormEvent<HTMLElement>) => {
        e.preventDefault();
        const f = e.currentTarget as HTMLFormElement;
        const co = (f.elements.namedItem("co") as HTMLInputElement).value.trim();
        const em = /\S+@\S+\.\S+/.test((f.elements.namedItem("email") as HTMLInputElement).value);
        setBad({ co: !co, email: !em });
        if (!co || !em) {
          toast("Add your company and a work email", "i-close");
          return;
        }
        toast(`Quote request sent for ${co}. Survey call within 2 working days.`, "i-check");
        f.reset();
      }}
    >
      <div className="two">
        <label className={`d-in${bad.co ? " bad" : ""}`}>
          Company
          <input name="co" placeholder="e.g. WorkNest Cyber City" />
        </label>
        <label className={`d-in${bad.email ? " bad" : ""}`}>
          Work email
          <input name="email" type="email" placeholder="you@company.in" />
        </label>
      </div>
      <div className="two">
        <label className="d-in">
          Type of space
          <select name="type">
            <option>Office</option>
            <option>Café / restaurant</option>
            <option>Co-working</option>
            <option>Clinic / salon</option>
            <option>Hotel lobby</option>
          </select>
        </label>
        <label className="d-in">
          Approx. plants
          <select name="n" defaultValue="20–40">
            <option>Up to 20</option>
            <option>20–40</option>
            <option>40–100</option>
            <option>100+</option>
          </select>
        </label>
      </div>
      <label className="d-in">
        Address / area
        <input name="addr" placeholder="Tower C, DLF Cyber City, Phase 2" />
      </label>
      <label className="d-in">
        Anything else?
        <textarea name="msg" placeholder="We have a 12 m reception wall and 6 meeting rooms…" />
      </label>
      <Button variant="primary" type="submit">
        Request a quote <Icon id="i-chevron" />
      </Button>
    </Reveal>
  );
}

/* ---------- plant postcard demo ---------- */
export function PostcardDemo({ copy }: { copy: React.ReactNode }) {
  const [dev, setDev] = useState(0);
  return (
    <>
      <Reveal>
        {copy}
        <div className="row">
          <Button variant="primary" onClick={() => setDev((d) => d + 1)}>
            <Icon id="i-camera" />
            Replay postcard
          </Button>
          <LinkBtn href="/dropoff" className="btn btn--ghost">
            See a full stay
          </LinkBtn>
        </div>
      </Reveal>
      <Reveal className="d-phone" id="pcPhone" onReveal={() => setDev((d) => (d ? d : 1))}>
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 10 }}>
          <b style={{ font: "500 17px/1 var(--ff-d)" }}>Plant Postcard</b>
          <span className="pill">Day 3 of 9</span>
        </div>
        <div className={`polaroid${dev ? " develop" : ""}`} key={dev}>
          <div className="pol-img">
            <PlantArt id="p-monstera" className="" />
          </div>
          <div className="pol-cap">
            <b>Bruno the Monstera</b>
            <br />
            <span className="muted tnum">Sun 25 Oct 2026 · 6:42 pm</span>
          </div>
        </div>
        <div className="ic3">
          <span>
            <Icon id="i-water" />
            240 ml ✓
          </span>
          <span>
            <Icon id="i-light" />
            Light ✓
          </span>
          <span>
            <Icon id="i-leaf" />
            Health 92%
          </span>
        </div>
        <div className="note">
          <Avatar id="a-priya" />
          <div>
            <b>Priya</b> · “Monstera drank 240 ml today. A new leaf is unfurling near the moss pole!”
          </div>
        </div>
      </Reveal>
    </>
  );
}

function LinkBtn({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

/* ---------- visits: visit-length cards ---------- */
export function LenCards() {
  const [on, setOn] = useState(45);
  return (
    <div className="d-len">
      {DATA.visitLengths.map((l, i) => (
        <Reveal key={l.id} className={`card${on === l.id ? " on" : ""}`} onClick={() => setOn(l.id)}>
          <svg className="dial" viewBox="0 0 86 86">
            <circle cx="43" cy="43" r="36" stroke="var(--line)" />
            <circle cx="43" cy="43" r="36" stroke="var(--primary)" strokeDasharray={`${(l.id / 120) * 226} 226`} transform="rotate(-90 43 43)" strokeLinecap="round" />
            <text x="43" y="49" textAnchor="middle" fontWeight="600" fontSize="17" fill="currentColor">
              {l.id}m
            </text>
          </svg>
          <div style={{ flex: 1 }}>
            <b className="p tnum">{inr(l.price)}</b>
            <div className="muted" style={{ fontSize: 14, marginTop: 4 }}>
              {l.label} · {l.cover}
            </div>
            <div className="muted" style={{ fontSize: 13 }}>
              {i ? "Best for balconies & big collections" : "Best for flats with a few plants"}
            </div>
          </div>
          <BookBtn className="btn btn--primary btn--sm" opts={{ len: l.id }}>
            Book {l.id} min
          </BookBtn>
        </Reveal>
      ))}
    </div>
  );
}

/* ---------- drop-off: suites, hubs, QR scan ---------- */
export function SuiteCards() {
  return (
    <div className="d-suites">
      {DATA.suites.map((s) => (
        <Reveal key={s.id} className="card d-suite">
          <span className="glow" style={{ background: s.tone }} />
          <PlantArt id={s.art} />
          <b className="h3">{s.name}</b>
          <div className="pr tnum">
            {inr(s.price)} <small>/ plant-night</small>
          </div>
          <dl>
            <dt>
              <Icon id="i-light" />
              Light
            </dt>
            <dd>{s.light}</dd>
            <dt>
              <Icon id="i-humidity" />
              Humidity
            </dt>
            <dd>{s.hum}</dd>
            <dt>
              <Icon id="i-temp" />
              Temp
            </dt>
            <dd>{s.temp}</dd>
            <dt>
              <Icon id="i-leaf" />
              Best for
            </dt>
            <dd>{s.best}</dd>
          </dl>
          <BookBtn svc="drop" className="btn btn--ghost btn--sm" style={{ marginTop: 8, alignSelf: "flex-start" }} opts={{ suite: s.id }}>
            Reserve {s.name.split(" ")[0]}
          </BookBtn>
        </Reveal>
      ))}
    </div>
  );
}

export function HubCards() {
  return (
    <div className="d-hubs">
      {DATA.hubs.map((h) => (
        <Reveal key={h.id} className="card d-hub">
          <div className="img">
            <svg viewBox="0 0 240 160">
              <use href="#s-hub" />
            </svg>
          </div>
          <div className="bd">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <b>{h.name}</b>
              <span className="pill">{h.dist}</span>
            </div>
            <small>
              <Icon id="i-pin" />
              {h.addr}
            </small>
            <small>
              <Icon id="i-clock" />
              {h.hours}
            </small>
            <div className="d-cap">
              {DATA.suites.map((s) => {
                const [u, t] = h.cap[s.id as "sunny" | "shade" | "humid"];
                const pc = (u / t) * 100;
                return (
                  <div key={s.id}>
                    <span>{s.name.replace(" Suite", "")}</span>
                    <i>
                      <u className={pc > 85 ? "hi" : ""} style={{ width: `${pc}%` }} />
                    </i>
                    <span className="tnum">{t - u} free</span>
                  </div>
                );
              })}
            </div>
            <BookBtn svc="drop" className="btn btn--primary btn--sm" style={{ marginTop: "auto" }} opts={{ hub: h.id }}>
              Choose this hub
            </BookBtn>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function ScanTag() {
  const toast = useToast();
  const [on, setOn] = useState(false);
  return (
    <>
      <div className="row" style={{ marginTop: 22 }}>
        <Button
          variant="primary"
          onClick={() => {
            setOn(true);
            toast("Tag scanned · opening Shanti's profile", "i-qr");
          }}
        >
          <Icon id="i-qr" />
          Simulate a scan
        </Button>
        <span className="pill pill--accent">Pick-and-drop · ₹199 both ways</span>
      </div>
      <div className={`card d-scanres${on ? " on" : ""}`}>
        <PlantArt id="p-peacelily" />
        <div>
          <b style={{ font: "500 19px/1.2 var(--ff-d)" }}>Shanti · Peace Lily</b>
          <div className="muted" style={{ fontSize: 13.5 }}>
            Humid Spa Suite H-07 · Day 3 of 9 · Watered 200 ml at 7:40 am
          </div>
          <div className="row" style={{ marginTop: 8, gap: 6 }}>
            <span className="pill">
              <Icon id="i-humidity" />
              70%
            </span>
            <span className="pill">
              <Icon id="i-temp" />
              21°C
            </span>
            <span className="pill">
              <Icon id="i-leaf" />
              Health 88%
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- plans: compare table + quiz ---------- */
export function CompareTable() {
  const P = DATA.plans;
  return (
    <table className="d-table">
      <thead>
        <tr>
          <th />
          {P.map((p) => (
            <th key={p.id}>
              {p.name}
              <small className="tnum">
                {inr(p.price)} {p.per}
              </small>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {DATA.compare.map((r) => (
          <tr key={r[0]}>
            {r.map((c, i) => (
              <td key={i}>
                {i === 0 ? (
                  c
                ) : c === "✓" ? (
                  <span className="y">
                    <Icon id="i-check" />
                  </span>
                ) : c === "–" ? (
                  <span className="n" aria-label="Not included" />
                ) : (
                  c
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td />
          {P.map((p) => (
            <td key={p.id}>
              <PlanBtn plan={p.id} className={`btn btn--sm ${p.id === "monthly" ? "btn--accent" : "btn--ghost"}`}>
                Choose
              </PlanBtn>
            </td>
          ))}
        </tr>
      </tfoot>
    </table>
  );
}

const QUIZ = [
  { q: "plants", t: "1. How many plants do you have?", o: ["1–5", "6–15", "16+"] },
  { q: "travel", t: "2. How often are you away from home?", o: ["Rarely", "A few days a month", "A week or more, often"] },
  { q: "help", t: "3. What do you want most?", o: ["A one-time fix", "Regular, same expert", "Total peace of mind"] },
] as const;

export function PlanQuiz({ onPick }: { onPick: (id: string | null) => void }) {
  const [qz, setQz] = useState<Record<string, number>>({});
  const k = Object.keys(qz).length;
  let picked: string | null = null;
  let res: React.ReactNode;
  if (k < 3) {
    res = (
      <>
        <div className="d-meter">
          {[0, 1, 2].map((i) => (
            <i key={i} className={i < k ? "on" : ""} />
          ))}
        </div>
        <span className="eyebrow">Your match</span>
        <b className="h3">{k === 0 ? "Answer 3 questions" : `${3 - k} question${3 - k > 1 ? "s" : ""} to go`}</b>
        <p className="muted" style={{ margin: 0, fontSize: 14 }}>
          We&apos;ll recommend a plan and show what it costs you each month.
        </p>
      </>
    );
  } else {
    const sum = qz.plants + qz.travel + qz.help;
    const id = qz.travel === 3 || sum >= 8 ? "plus" : sum >= 5 ? "monthly" : "once";
    picked = id;
    const p = DATA.plans.find((x) => x.id === id)!;
    const why = {
      plus: "You travel a lot or want zero worry. Care+ adds hub nights and daily postcards.",
      monthly: "Regular care from the same expert keeps a growing collection healthy.",
      once: "A single visit fixes today's problems. Upgrade any time.",
    }[id];
    const pm = id === "plus" ? "≈ ₹833 / month" : id === "monthly" ? "₹375 per visit" : "No commitment";
    res = (
      <>
        <div className="d-meter">
          <i className="on" />
          <i className="on" />
          <i className="on" />
        </div>
        <span className="eyebrow">Your match</span>
        <b className="h3" style={{ fontSize: 28 }}>
          {p.name}
        </b>
        <div className="pr tnum">
          {inr(p.price)}{" "}
          <small className="muted" style={{ font: "500 14px var(--ff)" }}>
            {p.per} · {pm}
          </small>
        </div>
        <p style={{ margin: 0, fontSize: 14.5 }}>{why}</p>
        <div className="row" style={{ marginTop: "auto" }}>
          <PlanBtn plan={id} className="btn btn--accent">
            Choose {p.name}
          </PlanBtn>
          <button className="d-link" onClick={() => setQz({})}>
            Start over
          </button>
        </div>
      </>
    );
  }
  useEffect(() => onPick(picked), [picked, onPick]);
  return (
    <Reveal className="card d-quiz" id="quiz">
      <div>
        {QUIZ.map((q) => (
          <div className="d-q" key={q.q}>
            <b>{q.t}</b>
            <div className="opts">
              {q.o.map((o, i) => (
                <Chip key={o} on={qz[q.q] === i + 1} onClick={() => setQz((s) => ({ ...s, [q.q]: i + 1 }))}>
                  {o}
                </Chip>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="d-res">{res}</div>
    </Reveal>
  );
}

/* ---------- care: photo diagnosis ---------- */
export function Diagnosis() {
  const [state, setState] = useState<"idle" | "scanning" | "done">("idle");
  const [p, setP] = useState(0);
  const t = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearInterval(t.current), []);
  const msgs: [number, string][] = [
    [0, "Uploading leaf_photo.jpg · 2.1 MB"],
    [25, "Finding the leaf edges…"],
    [55, "Checking 40+ problems…"],
    [85, "Comparing with 12,000 expert cases…"],
  ];
  const run = () => {
    if (state === "scanning") return;
    setState("scanning");
    let v = 0;
    setP(0);
    window.clearInterval(t.current);
    t.current = window.setInterval(() => {
      v = Math.min(100, v + (reducedMotion() ? 50 : 4));
      setP(v);
      if (v >= 100) {
        window.clearInterval(t.current);
        setState("done");
      }
    }, 90);
  };
  const reset = () => {
    window.clearInterval(t.current);
    setState("idle");
    setP(0);
  };
  const g = DATA.diag;
  const C = 2 * Math.PI * 34;
  const label = state === "idle" ? "Waiting for a photo · sample: fiddle-leaf fig leaf" : state === "done" ? "Done · checked in 2.4 s" : msgs.filter((x) => x[0] <= p).pop()![1];
  return (
    <>
      <div className="l">
        <button className={`d-drop${state !== "idle" ? " has" : ""}${state === "scanning" ? " scanning" : ""}`} type="button" onClick={run}>
          <span className="leafimg">
            <svg viewBox="0 0 200 160" style={{ width: "100%", height: "100%" }}>
              <use href="#i-sick-leaf" />
            </svg>
          </span>
          <span className="scanline" />
          <Icon id="i-camera" className="ico big" />
          <b style={{ color: "var(--ink)" }}>Click to upload a leaf photo</b>
          <span style={{ fontSize: 13 }}>Close-up, in daylight, top and underside</span>
        </button>
        <div className="d-prog">
          <i style={{ width: p + "%" }} />
        </div>
        <small className="muted">{label}</small>
      </div>
      <div className="r">
        {state !== "done" ? (
          <>
            <span className="eyebrow">Result</span>
            <b className="h3" style={{ fontSize: 26 }}>
              Your diagnosis appears here
            </b>
            <p className="muted" style={{ margin: 0 }}>
              We check for 40+ common problems in Indian homes: fungus, root rot, mealybugs, spider mites, sunburn and nutrient issues.
            </p>
            <div className="d-note" style={{ marginTop: "auto" }}>
              <Icon id="i-shield" />
              <span>Photos are only used for this check and deleted after 30 days.</span>
            </div>
          </>
        ) : (
          <>
            <span className="eyebrow">Most likely</span>
            <div className="d-conf">
              <svg viewBox="0 0 84 84">
                <circle cx="42" cy="42" r="34" fill="none" stroke="var(--line)" strokeWidth="8" />
                <circle
                  cx="42"
                  cy="42"
                  r="34"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(C * g.conf) / 100} ${C}`}
                  transform="rotate(-90 42 42)"
                />
                <text x="42" y="48" textAnchor="middle" fontWeight="600" fontSize="18" fill="currentColor">
                  {g.conf}%
                </text>
              </svg>
              <div>
                <b className="h3" style={{ fontSize: 26 }}>
                  {g.name}
                </b>
                <div className="muted" style={{ fontSize: 13.5 }}>
                  <i>{g.sci}</i> · {g.conf}% confidence · common after monsoon
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              <small className="muted" style={{ fontWeight: 600 }}>
                Other possibilities
              </small>
              {g.alts.map(([n, v]) => (
                <div className="d-alt" key={n as string}>
                  <span>{n}</span>
                  <i>
                    <u style={{ width: `${(v as number) * 4}%` }} />
                  </i>
                  <span className="tnum muted">{v}%</span>
                </div>
              ))}
            </div>
            <div>
              <small className="muted" style={{ fontWeight: 600 }}>
                What to do now
              </small>
              <ol className="d-ol" style={{ marginTop: 6 }}>
                {g.plan.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </div>
            <div className="row" style={{ marginTop: "auto" }}>
              <BookBtn opts={{ addons: ["pest"] }}>
                <Icon id="i-chat" />
                Ask a BloomBuddy expert
              </BookBtn>
              <Button variant="ghost" onClick={reset}>
                Try another photo
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
