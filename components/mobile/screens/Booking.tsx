"use client";

/* S9 Service & choices → S10 Schedule → S11 Documentation → S12 Payment → S13 Confirmation. Guest-friendly. */

import { useEffect, useRef, useState } from "react";
import { MDATA, inr } from "@/lib/data";
import { M_ADDONS, mExpert, mHub, mNights, mPriceLines, mSuite, mTotal, type MB } from "@/lib/booking";
import { reducedMotion } from "@/lib/motion";
import { Button } from "@/components/shared/Button";
import { QR } from "@/components/shared/QR";
import { Ico, Screen, Seg } from "../Screen";
import { DOW, DOWL, MON, MONL, SLOTS, TODAY, addD, fmtD, sameD, useM, type ScreenId } from "../MobileContext";

const VINE = "M10 15 C60 4 100 26 170 15 S280 4 330 15";
function Vine({ step }: { step: number }) {
  return (
    <div className="m-vine" data-step={step}>
      <svg viewBox="0 0 340 30" preserveAspectRatio="none">
        <path className="m-vine-bg" d={VINE} />
        <path className="m-vine-fg" d={VINE} pathLength={100} />
      </svg>
      <ol>
        <li>Service</li>
        <li>Schedule</li>
        <li>Details</li>
        <li>Pay</li>
      </ol>
    </div>
  );
}

function BookTop({ title }: { title: string }) {
  const { pop, reset, toast } = useM();
  return (
    <header className="m-top">
      <button className="m-icobtn" onClick={pop} aria-label="Back">
        <Ico id="i-back" />
      </button>
      <span className="m-top-t">{title}</span>
      <button
        className="m-icobtn"
        onClick={() => {
          reset("s6-home");
          toast("Booking saved as draft");
        }}
        aria-label="Close"
      >
        <Ico id="i-close" />
      </button>
    </header>
  );
}

/** Sticky total bar; the total "bumps" whenever it changes. */
function TotalBar({ next, onNext }: { next: ScreenId; onNext?: () => boolean }) {
  const { B, push } = useM();
  const t = mTotal(B);
  const n = B.svc === "visit" ? B.plants.length : B.dropPlants;
  const last = useRef(t);
  const [bump, setBump] = useState(0);
  useEffect(() => {
    if (last.current !== t) {
      last.current = t;
      setBump((b) => b + 1);
    }
  }, [t]);
  return (
    <div className="m-totalbar">
      <div>
        <span className="muted m-small">
          {B.svc === "visit" ? `Home visit · ${n} plant${n !== 1 ? "s" : ""} · ${B.len} min` : `Drop-off · ${n} plants · ${mNights(B)} nights`}
        </span>
        <b className={`m-total${bump ? " is-bump" : ""}`} key={bump}>
          {inr(t)}
        </b>
      </div>
      <Button variant="accent" className="m-btn" onClick={() => (onNext ? onNext() : true) && push(next)}>
        Continue
        <Ico id="i-chevron" />
      </Button>
    </div>
  );
}

/* ---------- S9 ---------- */
export function ServiceScreen() {
  const { B, setB, plants, toast } = useM();
  const up = (p: Partial<MB> | ((b: MB) => Partial<MB>)) => setB((b) => ({ ...b, ...(typeof p === "function" ? p(b) : p) }));
  const all = B.plants.length === plants.length;
  return (
    <Screen id="s9-service" className="m-book" label="Book: service and choices">
      <BookTop title="Book care" />
      <Vine step={1} />
      <div className="m-pad m-pad--t8">
        <h2 className="m-h2">What do your plants need?</h2>
        <div className="m-svcpick">
          {(
            [
              ["visit", "s-expert-watering", "Home Visit", "Expert comes to you", "from ₹499"],
              ["dropoff", "s-hub", "Smart Drop-off", "Plant hotel stay", "₹79/night"],
            ] as const
          ).map(([v, ill, b, s, em]) => (
            <button key={v} className={`m-svcopt${B.svc === v ? " is-on" : ""}`} onClick={() => up((b) => ({ svc: v, dropPlants: v === "dropoff" ? Math.max(1, b.plants.length) : b.dropPlants }))}>
              <svg className="m-svcopt-ill">
                <use href={`#${ill}`} />
              </svg>
              <b>{b}</b>
              <span>{s}</span>
              <em>{em}</em>
              <i className="m-radio" />
            </button>
          ))}
        </div>
        <div className="m-block" hidden={B.svc !== "visit"}>
          <h3 className="m-h3">Visit length</h3>
          <Seg
            className="m-seg--2"
            value={String(B.len)}
            onChange={(v) => up({ len: +v })}
            items={[
              {
                v: "45",
                label: (
                  <>
                    45 min · ₹499<small>up to 6 plants</small>
                  </>
                ),
              },
              {
                v: "90",
                label: (
                  <>
                    90 min · ₹849<small>up to 15 plants</small>
                  </>
                ),
              },
            ]}
          />
        </div>
        <div className="m-block">
          <div className="m-sechd m-sechd--tight">
            <h3 className="m-h3">Which plants?</h3>
            <button
              className="m-link m-link--sm"
              onClick={() => {
                const next = all ? [] : plants.map((p) => p.id);
                up({ plants: next, dropPlants: Math.max(1, next.length) });
              }}
            >
              Select all
            </button>
          </div>
          <div className="m-chips m-chips--wrap">
            {plants.map((p) => {
              const on = B.plants.includes(p.id);
              return (
                <button
                  key={p.id}
                  className={`chip${on ? " chip--on" : ""}`}
                  aria-pressed={on}
                  onClick={() =>
                    up((b) => {
                      const next = on ? b.plants.filter((x) => x !== p.id) : [...b.plants, p.id];
                      return { plants: next, dropPlants: Math.max(1, next.length) };
                    })
                  }
                >
                  <svg className="m-th" viewBox="0 0 120 160">
                    <use href={`#${p.sym}`} />
                  </svg>
                  {p.nick}
                </button>
              );
            })}
          </div>
          <p className="m-fine">{B.svc === "visit" ? `Visit covers up to ${B.len === 45 ? 6 : 15} plants · extras ₹39 each.` : "Each plant checks in with its own QR pot-tag."}</p>
        </div>
        <div className="m-block">
          <h3 className="m-h3">Add-ons</h3>
          <ul className="m-addons">
            {(
              [
                ["soil", "i-repot", "Organic cocopeat + vermicompost top-up"],
                ["pest", "i-pest", "Cold-pressed neem, pet-safe"],
                ["pickup", "m-scooter", "We collect & return your plants"],
              ] as const
            ).map(([id, ic, note]) => (
              <li key={id}>
                <label>
                  <span className="m-addon-ic">
                    <Ico id={ic} />
                  </span>
                  <span>
                    <b>{M_ADDONS[id].n}</b>
                    <small>{note}</small>
                  </span>
                  <em>{inr(M_ADDONS[id].p)}</em>
                  <input
                    type="checkbox"
                    checked={B.addons.includes(id)}
                    onChange={(e) => up((b) => ({ addons: e.target.checked ? [...b.addons, id] : b.addons.filter((x) => x !== id) }))}
                  />
                  <i className="m-switch" />
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <TotalBar
        next="s10-schedule"
        onNext={() => {
          if (B.svc === "visit" && !B.plants.length) {
            toast("Pick at least one plant");
            return false;
          }
          return true;
        }}
      />
    </Screen>
  );
}

/* ---------- S10 ---------- */
const slotBusy = (d: Date, s: string, expert: string) => (d.getDate() * 7 + SLOTS.indexOf(s) * 3 + expert.length) % 5 === 0;

export function ScheduleScreen() {
  const { B, setB, toast, openSheet, openHub, cur } = useM();
  const up = (p: Partial<MB>) => setB((b) => ({ ...b, ...p }));
  const days: Date[] = [];
  for (let i = 0; i < 14; i++) days.push(addD(TODAY, i));
  if (!days.some((d) => sameD(d, B.day))) days.push(B.day);
  const strip = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (cur !== "s10-schedule") return;
    const t = window.setTimeout(() => {
      const box = strip.current;
      const on = box?.querySelector<HTMLElement>(".is-on");
      if (box && on) box.scrollLeft = Math.max(0, on.offsetLeft - box.clientWidth / 2 + on.offsetWidth / 2);
    }, 30);
    return () => window.clearTimeout(t);
  }, [cur, B.day]);
  const busy = (s: string) => slotBusy(B.day, s, B.expert) || (sameD(B.day, TODAY) && SLOTS.indexOf(s) < 3);
  useEffect(() => {
    if (B.slot && busy(B.slot)) setB((b) => ({ ...b, slot: null }));
  });
  const hub = mHub(B.hub);
  const nn = mNights(B);
  return (
    <Screen id="s10-schedule" className="m-book" label="Book: schedule">
      <BookTop title="Schedule" />
      <Vine step={2} />
      <div className="m-pad m-pad--t8">
        {B.svc === "visit" ? (
          <div>
            <div className="m-sechd m-sechd--tight">
              <h2 className="m-h2">Choose your expert</h2>
              <span className="muted m-small">All background verified</span>
            </div>
            <div className="m-hscroll m-experts">
              {MDATA.experts.map((e) => (
                <button
                  key={e.id}
                  className={`m-exp${e.id === B.expert ? " is-on" : ""}`}
                  aria-pressed={e.id === B.expert}
                  onClick={() => {
                    up({ expert: e.id });
                    toast(e.name + " selected");
                  }}
                >
                  <div className="m-exp-hd">
                    <svg viewBox="0 0 80 80">
                      <use href={`#${e.sym}`} />
                    </svg>
                    <div>
                      <b>{e.name}</b>
                      <span>
                        {e.yrs} yrs · {e.visits} visits
                      </span>
                    </div>
                  </div>
                  <span className="m-tag">
                    <Ico id="i-shield" />
                    {e.cred}
                  </span>
                  <span className="m-rt">
                    <Ico id="i-star" />
                    {e.rating.toFixed(1)} <small>· {e.lang}</small>
                  </span>
                  <small>Next free: {e.next}</small>
                </button>
              ))}
            </div>
            <div className="m-sechd m-sechd--tight">
              <h3 className="m-h3">
                {MONL[B.day.getMonth()]} {B.day.getFullYear()}
              </h3>
              <button className="m-link m-link--sm" onClick={() => openSheet("cal", "visit")}>
                Full calendar
              </button>
            </div>
            <div className="m-hscroll m-days" ref={strip}>
              {days.map((d) => (
                <button key={d.toISOString()} className={`m-day${sameD(d, B.day) ? " is-on" : ""}`} aria-pressed={sameD(d, B.day)} onClick={() => up({ day: d })}>
                  <span>{sameD(d, TODAY) ? "Today" : DOW[d.getDay()]}</span>
                  <b>{d.getDate()}</b>
                  {d.getDay() === 0 ? null : <i />}
                </button>
              ))}
            </div>
            <h3 className="m-h3">Time slot</h3>
            <div className="m-slots">
              {SLOTS.map((s) => (
                <button key={s} className={`m-slot${B.slot === s ? " is-on" : ""}`} disabled={busy(s)} onClick={() => up({ slot: s })}>
                  {s}
                </button>
              ))}
            </div>
            <p className="m-fine">
              <Ico id="i-clock" className="ico--xs" /> Expert arrives within a 15-min window. Free reschedule up to 4 hours before.
            </p>
          </div>
        ) : (
          <div>
            <h2 className="m-h2">When are you away?</h2>
            <div className="m-dates">
              <button className="m-datebox" onClick={() => openSheet("cal", "leave")}>
                <span className="muted m-small">Leaving</span>
                <b>{fmtD(B.leave)}</b>
                <Ico id="i-calendar" />
              </button>
              <span className="m-dates-n">
                {nn} night{nn > 1 ? "s" : ""}
              </span>
              <button className="m-datebox" onClick={() => openSheet("cal", "back")}>
                <span className="muted m-small">Back</span>
                <b>{fmtD(B.back)}</b>
                <Ico id="i-calendar" />
              </button>
            </div>
            <div className="m-stepper-row">
              <div>
                <b>Plants checking in</b>
                <span className="muted m-small">Each gets a QR pot-tag</span>
              </div>
              <div className="m-stepper">
                <button onClick={() => up({ dropPlants: Math.max(1, B.dropPlants - 1) })} aria-label="Fewer plants">
                  −
                </button>
                <output>{B.dropPlants}</output>
                <button onClick={() => up({ dropPlants: Math.min(30, B.dropPlants + 1) })} aria-label="More plants">
                  +
                </button>
              </div>
            </div>
            <div className="m-sechd m-sechd--tight">
              <h3 className="m-h3">Pick a hub</h3>
              <span className="muted m-small">Sorted by distance</span>
            </div>
            <ul className="m-hubs">
              {MDATA.hubs.map((h) => {
                const free = Object.values(h.cap).reduce((a, c) => a + (c[1] - c[0]), 0);
                return (
                  <li key={h.id} className={`m-hub${h.id === B.hub ? " is-on" : ""}`}>
                    <button className="m-hub-pick" aria-pressed={h.id === B.hub} onClick={() => up({ hub: h.id })}>
                      <i className={`m-radio${h.id === B.hub ? " is-on" : ""}`} />
                      <span>
                        <b>{h.name}</b>
                        <small>
                          {h.dist} · {free} rooms free · open till 9 pm
                        </small>
                      </span>
                    </button>
                    <button className="m-hub-info" onClick={() => openHub(h.id)}>
                      Details
                    </button>
                  </li>
                );
              })}
            </ul>
            <h3 className="m-h3">Suite</h3>
            <div className="m-suites">
              {MDATA.suites.map((s) => {
                const c = hub.cap[s.id as "sunny" | "shade" | "humid"];
                return (
                  <button key={s.id} className={`m-suite${s.id === B.suite ? " is-on" : ""}`} aria-pressed={s.id === B.suite} onClick={() => up({ suite: s.id })}>
                    <Ico id={s.icon} />
                    <b>{s.name}</b>
                    <small>₹{s.price}/night</small>
                    <small>{c[1] - c[0]} left</small>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <TotalBar
        next="s11-docs"
        onNext={() => {
          if (B.svc === "visit" && !B.slot) {
            toast("Choose a time slot");
            return false;
          }
          return true;
        }}
      />
    </Screen>
  );
}

/* ---------- S11 ---------- */
export function DocsScreen() {
  const { B, setB, plants, toast } = useM();
  const [photos, setPhotos] = useState<Record<number, boolean>>({});
  const [pets, setPets] = useState(true);
  const ids = B.plants;
  const list = (ids.length ? ids.map((id) => plants.find((p) => p.id === id)) : plants)
    .filter((p): p is (typeof plants)[number] => !!p)
    .slice(0, B.svc === "visit" ? 99 : Math.max(1, B.dropPlants));
  const ills = ["p-monstera", "p-fiddle", "p-peacelily", "p-moneyplant"];
  return (
    <Screen id="s11-docs" className="m-book" label="Book: documentation">
      <BookTop title="Plant details" />
      <Vine step={3} />
      <div className="m-pad m-pad--t8">
        <h2 className="m-h2">Tell your expert about them</h2>
        <p className="m-sub">Species are filled in from My Plants. This builds each plant&apos;s care plan.</p>
        <div className="m-docs">
          {list.map((p, i) => {
            const pot = B.pots[p.id] ?? ["M", "L", "S", "M"][i % 4];
            return (
              <div className="m-doc" key={p.id}>
                <div className="m-doc-hd">
                  <svg viewBox="0 0 120 160">
                    <use href={`#${p.sym}`} />
                  </svg>
                  <div>
                    <b>{p.nick}</b>
                    <span className="m-tag">
                      <Ico id="i-leaf" />
                      {p.sp}
                    </span>
                  </div>
                </div>
                <div className="m-doc-row">
                  <span>Pot size</span>
                  <div className="m-pot">
                    {["S", "M", "L"].map((s) => (
                      <button key={s} className={pot === s ? "is-on" : ""} aria-pressed={pot === s} onClick={() => setB((b) => ({ ...b, pots: { ...b.pots, [p.id]: s } }))}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="m-doc-row">
                  <span>Last watered</span>
                  <select aria-label={`Last watered for ${p.nick}`} defaultValue={i % 3 === 2 ? "2–3 days ago" : i % 2 ? "Yesterday" : "Today"}>
                    <option>Today</option>
                    <option>Yesterday</option>
                    <option>2–3 days ago</option>
                    <option>A week or more</option>
                  </select>
                </div>
              </div>
            );
          })}
          {B.svc !== "visit" && B.dropPlants > list.length ? (
            <p className="m-fine">
              + {B.dropPlants - list.length} more plant{B.dropPlants - list.length > 1 ? "s" : ""} — the hub team will tag and photograph them at check-in.
            </p>
          ) : null}
        </div>
        <h3 className="m-h3">Photos (optional)</h3>
        <div className="m-photos">
          {ills.map((ill, i) => (
            <button
              key={ill}
              className={`m-photo${photos[i] ? " is-filled" : ""}`}
              aria-label={photos[i] ? "Remove photo" : "Add photo"}
              onClick={() => {
                setPhotos((ph) => ({ ...ph, [i]: !ph[i] }));
                if (!photos[i]) toast("Photo added · 1.2 MB");
              }}
            >
              {photos[i] ? (
                <>
                  <svg viewBox="0 0 120 160">
                    <use href={`#${ill}`} />
                  </svg>
                  <span className="m-x">
                    <Ico id="i-close" />
                  </span>
                </>
              ) : (
                <>
                  <Ico id="i-camera" />
                  <span>Add</span>
                </>
              )}
            </button>
          ))}
        </div>
        <h3 className="m-h3" id="mAccessLbl">
          {B.svc === "visit" ? "Home-access notes" : "Pick-up & hand-over notes"}
        </h3>
        <textarea
          className="m-textarea"
          rows={3}
          aria-labelledby="mAccessLbl"
          defaultValue="Tower C, flat 1204, Ireo Victory Valley, Sec 67. Spare key with guard Ramesh ji (gate 2). Balcony door sticks — lift and slide."
        />
        <ul className="m-toggles">
          <li>
            <label>
              <span>
                <b>Pets at home</b>
                <small>Experts use pet-safe products only</small>
              </span>
              <input type="checkbox" checked={pets} onChange={(e) => setPets(e.target.checked)} />
              <i className="m-switch" />
            </label>
          </li>
          <li>
            <label>
              <span>
                <b>I&apos;ll be home during the visit</b>
                <small>Otherwise we share a door-code check-in</small>
              </span>
              <input type="checkbox" />
              <i className="m-switch" />
            </label>
          </li>
        </ul>
        <p className="m-pet-note" style={{ opacity: pets ? 1 : 0 }}>
          <Ico id="i-petsafe" />
          Noted: Coco (beagle). Expert will close the balcony door while spraying.
        </p>
      </div>
      <TotalBar next="s12-pay" />
    </Screen>
  );
}

/* ---------- S12 ---------- */
const UPI_IDS: Record<string, string> = { GPay: "nisha.p@okhdfcbank", PhonePe: "9811042317@ybl", Paytm: "9811042317@paytm", BHIM: "nisha.p@upi" };

export function PayScreen() {
  const { B, setB, toast, push, popTo, setBookingId } = useM();
  const [promo, setPromo] = useState("");
  const [upiId, setUpiId] = useState("nisha.p@okhdfcbank");
  const [cvv, setCvv] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const cvvRef = useRef<HTMLInputElement>(null);
  const e = mExpert(B.expert);
  const h = mHub(B.hub);
  const s = mSuite(B.suite);
  const nn = mNights(B);
  const apply = (code?: string) => {
    const v = (code ?? promo).trim().toUpperCase();
    if (code) setPromo(code);
    if (v === "FIRSTBLOOM") {
      setB((b) => ({ ...b, promo: true }));
      toast("FIRSTBLOOM applied · 20% off");
    } else if (!v) toast("Enter a promo code");
    else {
      setB((b) => ({ ...b, promo: false }));
      toast(`“${v}” isn't valid. Try FIRSTBLOOM`);
    }
  };
  const pay = () => {
    if (busy) return;
    if (B.pay === "card" && !/^\d{3}$/.test(cvv)) {
      toast("Enter the 3-digit CVV");
      cvvRef.current?.focus();
      return;
    }
    setBusy(true);
    window.setTimeout(
      () => {
        setSuccess(true);
        window.setTimeout(
          () => {
            setBusy(false);
            setBookingId("BB-26-" + (48217 + Math.floor(Math.random() * 900)));
            push("s13-confirm");
            window.setTimeout(() => setSuccess(false), 450);
          },
          reducedMotion() ? 400 : 2200,
        );
      },
      reducedMotion() ? 100 : 900,
    );
  };
  return (
    <Screen id="s12-pay" className="m-book" label="Book: payment">
      <BookTop title="Payment" />
      <Vine step={4} />
      <div className="m-pad m-pad--t8" style={success ? { overflow: "hidden" } : undefined}>
        <div className="card m-sum">
          <div className="m-sum-hd">
            {B.svc === "visit" ? (
              <svg className="m-sum-ill" viewBox="0 0 80 80">
                <use href={`#${e.sym}`} />
              </svg>
            ) : (
              <svg className="m-sum-ill" viewBox="0 0 300 220">
                <use href="#s-hub" />
              </svg>
            )}
            <div>
              <b>{B.svc === "visit" ? `Home visit with ${e.name.split(" ")[0]}` : `${s.name} suite · ${h.name}`}</b>
              <span className="muted m-small">
                {B.svc === "visit" ? `${fmtD(B.day)} · ${B.slot ?? "5:00 pm"} · ${B.len} min` : `${fmtD(B.leave)} → ${fmtD(B.back)} · ${nn} nights`}
              </span>
            </div>
            <button className="m-link m-link--sm" onClick={() => popTo("s9-service")}>
              Edit
            </button>
          </div>
          <ul className="m-sum-lines">
            {mPriceLines(B).map(([n, p]) => (
              <li key={n} className={p < 0 ? "is-disc" : ""}>
                <span>{n}</span>
                <b>{p < 0 ? "−" + inr(-p) : inr(p)}</b>
              </li>
            ))}
            <li>
              <span>Taxes &amp; visit insurance</span>
              <b>Included</b>
            </li>
          </ul>
          <div className={`m-promo${B.promo ? " is-ok" : ""}`}>
            <input placeholder="Promo code" aria-label="Promo code" value={promo} onChange={(ev) => setPromo(ev.target.value)} onKeyDown={(ev) => ev.key === "Enter" && apply()} />
            <Button variant="ghost" size="sm" className="m-btn--sm" onClick={() => apply()}>
              Apply
            </Button>
          </div>
          <button className="m-promo-hint" onClick={() => apply("FIRSTBLOOM")}>
            Try <b>FIRSTBLOOM</b> · 20% off your first booking
          </button>
          <div className="m-sum-total">
            <span>To pay</span>
            <b>{inr(mTotal(B))}</b>
          </div>
        </div>
        <Seg
          className="m-seg--3"
          value={B.pay}
          onChange={(v) => setB((b) => ({ ...b, pay: v }))}
          items={[
            {
              v: "upi",
              label: (
                <>
                  <Ico id="m-upi" />
                  UPI
                </>
              ),
            },
            {
              v: "card",
              label: (
                <>
                  <Ico id="m-card" />
                  Card
                </>
              ),
            },
            {
              v: "wallet",
              label: (
                <>
                  <Ico id="m-wallet" />
                  Wallet
                </>
              ),
            },
          ]}
        />
        <div className="m-paypanel" hidden={B.pay !== "upi"}>
          <div className="m-upi-apps">
            {(
              [
                ["GPay", "#4285F4", "G"],
                ["PhonePe", "#5F259F", "Pe"],
                ["Paytm", "#00B9F1", "P"],
                ["BHIM", "#F47D20", "B"],
              ] as const
            ).map(([a, c, l]) => (
              <button
                key={a}
                className={`m-upi${B.upiApp === a ? " is-on" : ""}`}
                onClick={() => {
                  setB((b) => ({ ...b, upiApp: a }));
                  setUpiId(UPI_IDS[a]);
                }}
              >
                <i style={{ ["--c" as string]: c }}>{l}</i>
                {a}
              </button>
            ))}
          </div>
          <label className="m-label" htmlFor="mUpiId">
            Or enter UPI ID
          </label>
          <input className="m-input" id="mUpiId" value={upiId} onChange={(ev) => setUpiId(ev.target.value)} />
        </div>
        <div className="m-paypanel" hidden={B.pay !== "card"}>
          <div className="m-savedcard">
            <Ico id="m-card" />
            <div>
              <b>HDFC Millennia ···· 4417</b>
              <span className="muted m-small">Expires 08/29</span>
            </div>
            <i className="m-radio is-on" />
          </div>
          <label className="m-label" htmlFor="mCvv">
            CVV
          </label>
          <input
            ref={cvvRef}
            className="m-input m-input--short"
            id="mCvv"
            inputMode="numeric"
            maxLength={3}
            placeholder="•••"
            value={cvv}
            onChange={(ev) => setCvv(ev.target.value.replace(/\D/g, ""))}
          />
        </div>
        <div className="m-paypanel" hidden={B.pay !== "wallet"}>
          <div className="m-savedcard">
            <Ico id="m-leaf-plus" />
            <div>
              <b>BloomBuddy credits</b>
              <span className="muted m-small">₹250 available · from referrals</span>
            </div>
            <i className="m-radio is-on" />
          </div>
          <div className="m-savedcard">
            <Ico id="m-wallet" />
            <div>
              <b>Amazon Pay</b>
              <span className="muted m-small">Linked · nisha.p@…</span>
            </div>
            <i className="m-radio" />
          </div>
        </div>
        <p className="m-fine m-secure">
          <Ico id="m-lock" className="ico--xs" />
          Secured by RBI-compliant gateway. Pay after the visit with Care+.
        </p>
      </div>
      <div className="m-cta-bar">
        <Button variant="accent" className={`m-btn m-btn--block m-paybtn${busy ? " is-busy" : ""}`} onClick={pay}>
          {busy ? (B.pay === "upi" ? `Waiting for ${B.upiApp}…` : "Processing…") : `Pay ${inr(mTotal(B))}`}
        </Button>
      </div>
      <div className={`m-success${success ? " is-on" : ""}`} aria-hidden={!success}>
        <svg className="m-unfurl" viewBox="0 0 160 160">
          <circle className="m-unfurl-ring" cx="80" cy="80" r="70" />
          <path className="m-unfurl-stem" d="M80 132V78" />
          <path className="m-unfurl-l" d="M80 92C58 92 44 78 42 58c22 0 36 12 38 34z" />
          <path className="m-unfurl-r" d="M80 80c2-26 18-42 42-44-2 26-18 42-42 44z" />
          <path className="m-unfurl-tick" d="M60 140l12 10 28-26" />
        </svg>
        <b>Payment received</b>
        <span>Booking your expert…</span>
      </div>
    </Screen>
  );
}

/* ---------- S13 ---------- */
export function ConfirmScreen() {
  const { B, bookingId, reset, push, toast, user } = useM();
  const e = mExpert(B.expert);
  const h = mHub(B.hub);
  const s = mSuite(B.suite);
  const n = B.plants.length;
  const first = e.name.split(" ")[0];
  const visit = B.svc === "visit";
  const cells: [string, string][] = visit
    ? [
        ["Expert", e.name],
        ["When", `${fmtD(B.day)} · ${B.slot ?? "5:00 pm"}`],
        ["Plants", `${n} plant${n !== 1 ? "s" : ""} · ${B.len} min`],
      ]
    : [
        ["Hub", h.name],
        ["Stay", `${fmtD(B.leave)} → ${fmtD(B.back)}`],
        ["Suite", `${s.name} · ${B.dropPlants} plants`],
      ];
  return (
    <Screen id="s13-confirm" label="Booking confirmed">
      <header className="m-top">
        <span className="m-icobtn m-ghost" />
        <span className="m-top-t">Confirmed</span>
        <button className="m-icobtn" onClick={() => reset("s6-home")} aria-label="Close">
          <Ico id="i-close" />
        </button>
      </header>
      <div className="m-pad m-pad--t8">
        <div className="m-confhd">
          <span className="m-confhd-ic">
            <Ico id="i-check" />
          </span>
          <h2 className="m-h1">You&apos;re all set{user.name ? `, ${user.name}` : ""}!</h2>
          <p className="m-sub">
            {visit
              ? `${first} will see your ${n} plant${n !== 1 ? "s" : ""} on ${DOWL[B.day.getDay()]}, ${B.day.getDate()} ${MON[B.day.getMonth()]}.`
              : `${B.dropPlants} plants checking in to ${h.name}. Daily postcards start ${fmtD(B.leave)}.`}
          </p>
        </div>
        <div className="m-ticket">
          <div className="m-ticket-top">
            <div className="m-ticket-row">
              <div>
                <span className="m-tk-l">Booking ID</span>
                <b className="m-tk-id">{bookingId}</b>
              </div>
              <svg className="m-ticket-logo">
                <use href="#i-logo-mono" />
              </svg>
            </div>
            <div className="m-ticket-grid">
              {cells.map(([k, v]) => (
                <div key={k}>
                  <span className="m-tk-l">{k}</span>
                  <b>{v}</b>
                </div>
              ))}
              <div>
                <span className="m-tk-l">Paid</span>
                <b>{inr(mTotal(B))}</b>
              </div>
            </div>
          </div>
          <div className="m-ticket-cut" />
          <div className="m-ticket-bot">
            <QR seed={bookingId} className="m-qr" />
            <div>
              <b>Show at the door or hub</b>
              <span className="muted m-small">
                {visit
                  ? `${first} scans this to start the visit and tag your pots.`
                  : B.addons.includes("pickup")
                    ? "Our rider scans this at your door, 9 am pick-up."
                    : "Show this at the hub desk to check in."}
              </span>
            </div>
          </div>
        </div>
        <div className="m-row2">
          <Button variant="ghost" className="m-btn" onClick={() => toast("Added to Google Calendar · reminder 1 hr before")}>
            <Ico id="i-calendar" />
            Add to calendar
          </Button>
          <Button variant="primary" className="m-btn" onClick={() => push("s14-track")}>
            <Ico id="i-pin" />
            Track
          </Button>
        </div>
        <Button variant="accent" className="m-btn m-btn--block" onClick={() => reset("s6-home")}>
          Back to Home
        </Button>
      </div>
    </Screen>
  );
}

/* ---------- calendar sheet body (used by the sheet host) ---------- */
export function CalendarSheet({ mode, onMode, onClose }: { mode: "visit" | "leave" | "back"; onMode: (m: "back") => void; onClose: () => void }) {
  const { B, setB } = useM();
  const base = mode === "back" ? B.back : mode === "leave" ? B.leave : B.day;
  const [ym, setYm] = useState(() => new Date(base.getFullYear(), base.getMonth(), 1));
  const y = ym.getFullYear();
  const m = ym.getMonth();
  const first = new Date(y, m, 1);
  const n = new Date(y, m + 1, 0).getDate();
  const nn = mNights(B);
  const pick = (dt: Date) => {
    if (mode === "visit") {
      setB((b) => ({ ...b, day: dt }));
      onClose();
      return;
    }
    if (mode === "leave") {
      setB((b) => ({ ...b, leave: dt, back: b.back <= dt ? addD(dt, 3) : b.back }));
      onMode("back");
    } else setB((b) => ({ ...b, back: dt }));
  };
  return (
    <>
      <div className="m-cal-hd">
        <button
          className="m-icobtn"
          aria-label="Previous month"
          disabled={y === 2026 && m <= 9}
          style={y === 2026 && m <= 9 ? { opacity: 0.3 } : undefined}
          onClick={() => setYm(new Date(y, m - 1, 1))}
        >
          <Ico id="i-back" />
        </button>
        <b>
          {MONL[m]} {y}
        </b>
        <button className="m-icobtn" aria-label="Next month" style={{ transform: "scaleX(-1)" }} onClick={() => setYm(new Date(y, m + 1, 1))}>
          <Ico id="i-back" />
        </button>
      </div>
      <div className="m-cal">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
        {Array.from({ length: first.getDay() }, (_, i) => (
          <i key={"o" + i} />
        ))}
        {Array.from({ length: n }, (_, i) => {
          const dt = new Date(y, m, i + 1);
          const past = dt < TODAY && !sameD(dt, TODAY);
          let cls = sameD(dt, TODAY) ? "is-today" : "";
          if (mode === "visit" && sameD(dt, B.day)) cls += " is-on";
          if (mode !== "visit") {
            if (sameD(dt, B.leave) || sameD(dt, B.back)) cls += " is-on";
            else if (dt > B.leave && dt < B.back) cls += " is-range";
          }
          const dis = past || (mode === "back" && dt <= B.leave);
          return (
            <button key={i} className={cls.trim()} disabled={dis} onClick={() => pick(dt)}>
              {i + 1}
            </button>
          );
        })}
      </div>
      {mode === "visit" ? (
        <p className="m-fine">Dots on the strip mean {mExpert(B.expert).name.split(" ")[0]} has free slots.</p>
      ) : (
        <div className="m-cal-legend">
          <span>
            <b>{fmtD(B.leave)}</b> → <b>{fmtD(B.back)}</b>
          </span>
          <span>{nn} nights</span>
        </div>
      )}
      <Button variant="accent" className="m-btn m-btn--block" onClick={onClose}>
        Done
      </Button>
    </>
  );
}
