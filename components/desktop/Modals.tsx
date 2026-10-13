"use client";

/* Desktop overlays: 5-step booking modal, optional OTP login, tip reader. None of them is a gate —
   booking works as a guest, and the OTP step can always be skipped. */

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DATA, expertById, hubById, inr, plantById, suiteById } from "@/lib/data";
import { MONTHS, SLOTS_D, bkTotals, bkValidate, fitPlants, fmtISO, useBooking, type BK } from "@/lib/booking";
import { reducedMotion } from "@/lib/motion";
import { Avatar, Icon, PlantArt } from "@/components/shared/Icon";
import { Button } from "@/components/shared/Button";
import { Chip } from "@/components/shared/Chip";
import { Stepper } from "@/components/shared/Stepper";
import { QR } from "@/components/shared/QR";
import { useToast } from "@/components/shared/Toast";

function Wrap({ open, label, onClose, children }: { open: boolean; label: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      className={`d-modal-wrap${open ? " open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      aria-hidden={!open}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {children}
    </div>
  );
}

function CloseX({ onClose, style, label = "Close" }: { onClose: () => void; style?: React.CSSProperties; label?: string }) {
  return (
    <button className="d-x" style={style} onClick={onClose} aria-label={label}>
      <Icon id="i-close" />
    </button>
  );
}

export function Modals() {
  const { modal, setModal } = useBooking();
  const close = () => setModal(null);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModal(null);
    };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [setModal]);
  return (
    <div className="d-layer">
      <Wrap open={modal === "login"} label="Log in" onClose={close}>
        {modal === "login" && <LoginModal onClose={close} />}
      </Wrap>
      <Wrap open={modal === "tip"} label="Plant care guide" onClose={close}>
        <TipModal onClose={close} />
      </Wrap>
      <Wrap open={modal === "book"} label="Book plant care" onClose={close}>
        <BookModal onClose={close} />
      </Wrap>
    </div>
  );
}

/* ---------------- login (optional; OTP can be skipped) ---------------- */
function LoginModal({ onClose }: { onClose: () => void }) {
  const { setLoggedIn } = useBooking();
  const toast = useToast();
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [secs, setSecs] = useState(30);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const phoneRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    window.setTimeout(() => phoneRef.current?.focus(), 50);
  }, []);
  useEffect(() => {
    if (step !== 2 || secs <= 0) return;
    const t = window.setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [step, secs]);
  const finish = (skipped: boolean) => {
    onClose();
    setLoggedIn(true);
    toast(skipped ? "You're in, Nisha. Verify your number any time from your account." : "Namaste, Nisha! You have 1 upcoming visit.", "i-leaf");
  };
  const send = () => {
    const v = phone.replace(/\D/g, "");
    if (v.length !== 10) {
      toast("Enter a 10-digit mobile number — or continue without one", "i-user");
      return;
    }
    setStep(2);
    setSecs(30);
    setOtp(["", "", "", ""]);
    window.setTimeout(() => refs.current[0]?.focus(), 30);
  };
  const digits = phone.replace(/\D/g, "");
  return (
    <div className="d-modal" style={{ width: 440 }}>
      <CloseX onClose={onClose} />
      <svg viewBox="0 0 64 72" style={{ width: 44, height: 50, marginBottom: 14 }}>
        <use href="#i-logo-mark" />
      </svg>
      {step === 1 ? (
        <div>
          <h3 className="h3" style={{ fontSize: 28 }}>
            Welcome back
          </h3>
          <p className="muted" style={{ margin: "6px 0 20px", fontSize: 14.5 }}>
            Log in with your mobile number. We&apos;ll send a 4-digit OTP. Logging in is optional — you can book without it.
          </p>
          <div className="d-phone-in">
            <span>+91</span>
            <input
              ref={phoneRef}
              inputMode="numeric"
              maxLength={11}
              placeholder="98610 42277"
              aria-label="Mobile number"
              value={phone}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                setPhone(v.length > 5 ? v.slice(0, 5) + " " + v.slice(5) : v);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
            />
          </div>
          <Button variant="primary" style={{ width: "100%", marginTop: 16 }} onClick={send}>
            Send OTP
          </Button>
          <button className="d-skip" onClick={() => finish(true)}>
            Continue without OTP
          </button>
          <p className="muted" style={{ fontSize: 12.5, margin: "14px 0 0", textAlign: "center" }}>
            By continuing you agree to our Terms and Privacy Policy.
          </p>
        </div>
      ) : (
        <div>
          <h3 className="h3" style={{ fontSize: 28 }}>
            Enter the OTP
          </h3>
          <p className="muted" style={{ margin: "6px 0 16px", fontSize: 14.5 }}>
            Sent to +91 <b>{digits.slice(0, 5) + " " + digits.slice(5)}</b> ·{" "}
            <button className="d-link" onClick={() => setStep(1)}>
              Change
            </button>
          </p>
          <div className="d-otp">
            {otp.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                maxLength={1}
                inputMode="numeric"
                aria-label={`Digit ${i + 1}`}
                value={d}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(-1);
                  setOtp((o) => o.map((x, j) => (j === i ? v : x)));
                  if (v && i < 3) refs.current[i + 1]?.focus();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !d && i > 0) refs.current[i - 1]?.focus();
                }}
              />
            ))}
          </div>
          <p className="muted" style={{ fontSize: 12.5 }}>
            Prototype: any 4 digits work.{" "}
            <button className="d-link" style={{ fontSize: 12.5 }} onClick={() => secs <= 0 && toast("New OTP sent to +91 " + digits, "i-chat")}>
              {secs > 0 ? `Resend in ${secs}s` : "Resend OTP"}
            </button>
          </p>
          <Button variant="primary" style={{ width: "100%", marginTop: 8 }} disabled={otp.some((x) => !x)} onClick={() => finish(false)}>
            Verify &amp; log in
          </Button>
          <button className="d-skip" onClick={() => finish(true)}>
            Skip for now
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- tip reader ---------------- */
function TipModal({ onClose }: { onClose: () => void }) {
  const { tipId, open } = useBooking();
  const tp = DATA.tips.find((x) => x.id === tipId);
  return (
    <div className="d-modal" style={{ width: 640 }}>
      <CloseX onClose={onClose} />
      {tp && (
        <div>
          <span className="eyebrow">
            {tp.cat} · {tp.read} min read
          </span>
          <h3 className="h3" style={{ fontSize: 30, margin: "8px 0 18px" }}>
            {tp.title}
          </h3>
          <div className="d-art-read">
            <PlantArt id={tp.art} />
            <div>
              <b>Do this:</b>
              <ol>
                {tp.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </div>
          </div>
          <div className="d-cta" style={{ padding: "20px 24px", marginTop: 22, borderRadius: 20 }}>
            <span>
              <b>Still stuck?</b>
              <br />
              <small className="muted">An expert can check it at home.</small>
            </span>
            <button className="btn btn--accent btn--sm" onClick={() => open("visit")}>
              Book a visit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- booking ---------------- */
const TITLES = ["Service & choices", "Schedule", "Documentation", "Payment", "Confirmed"];
const UPI_HANDLE: Record<string, string> = { GPay: "okhdfc", PhonePe: "ybl", Paytm: "paytm", BHIM: "upi" };

function BookModal({ onClose }: { onClose: () => void }) {
  const { bk, setBk, loggedIn, setModal } = useBooking();
  const router = useRouter();
  const toast = useToast();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [upi, setUpi] = useState("nisha.patnaik@okhdfc");
  const [upiApp, setUpiApp] = useState("GPay");
  const [card, setCard] = useState("4386 2190 7712 4821");
  const [promo, setPromo] = useState("");
  const [promoMsg, setPromoMsg] = useState<{ t: string; c?: string }>({ t: "FIRSTBLOOM gives 20% off your first booking (max ₹300)." });
  const [guest, setGuest] = useState({ name: "", phone: "" });
  const bodyRef = useRef<HTMLDivElement>(null);
  const prevId = useRef(bk.id);

  useEffect(() => {
    if (prevId.current !== bk.id) {
      prevId.current = bk.id;
      setErr("");
      setPromo("");
      setPromoMsg({ t: "FIRSTBLOOM gives 20% off your first booking (max ₹300)." });
    }
  }, [bk.id]);

  const up = (f: (b: BK) => Partial<BK>) => {
    setErr("");
    setBk((b) => ({ ...b, ...f(b) }));
  };
  const S = bk.step;
  const t = bkTotals(bk);
  const pl = bk.plan ? DATA.plans.find((p) => p.id === bk.plan) : null;
  const e = expertById(bk.expert);
  const hub = hubById(bk.hub);
  const suite = suiteById(bk.suite);

  const next = () => {
    if (S === 5) {
      onClose();
      toast(`Booking ${bk.id} saved · track it any time from “Track booking”`, "i-check");
      return;
    }
    const v = bkValidate(bk, upi);
    if (v) {
      setErr(v);
      return;
    }
    if (S === 4) {
      setBusy(true);
      window.setTimeout(() => {
        setBusy(false);
        up(() => ({ step: 5 }));
      }, reducedMotion() ? 200 : 1300);
      return;
    }
    up((b) => ({ step: b.step + 1 }));
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  };

  /* calendar */
  const [m, label, off, len] = MONTHS.find((x) => x[0] === bk.calMonth) ?? MONTHS[0];
  const pickDay = (iso: string) =>
    up((b) => {
      if (b.svc === "visit") return { date: iso, slot: null };
      if (!b.from || b.to || iso <= b.from) return { from: iso, to: null };
      return { to: iso };
    });
  const seed = bk.date ? +bk.date.slice(-2) : 1;

  const rows: [string, string][] =
    bk.svc === "visit"
      ? [
          ["Service", pl ? pl.name : `Home Visit · ${bk.len} min`],
          ["Expert", e.name],
          ["When", `${bk.date ? fmtISO(bk.date) : ""} · ${bk.slot ?? ""}`],
          ["Where", loggedIn ? "Ireo Skyon, Sector 60" : "Address shared at check-in"],
          ["Plants", `${bk.n} plants`],
          ["Paid", inr(t.tot) + (bk.pay === "later" ? " · after visit" : " · " + bk.pay.toUpperCase())],
        ]
      : [
          ["Service", "Smart Drop-off"],
          ["Hub", hub.name],
          ["Stay", `${bk.from ? fmtISO(bk.from) : ""} → ${bk.to ? fmtISO(bk.to) : ""}`],
          ["Suite", suite.name],
          ["Plants", `${bk.n} plants · QR tagged`],
          ["Paid", inr(t.tot) + " · " + bk.pay.toUpperCase()],
        ];

  const capN = bk.len === 45 ? 8 : 20;
  return (
    <div className="d-modal d-bk">
      <div className="main">
        <div className="hd">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <div>
              <span className="eyebrow">{S < 5 ? `Step ${S} of 5` : "All done"}</span>
              <h3 className="h3" style={{ fontSize: 28, marginTop: 6 }}>
                {TITLES[S - 1]}
              </h3>
            </div>
            <CloseX onClose={onClose} style={{ position: "static" }} label="Close booking" />
          </div>
          <Stepper labels={["Service", "Schedule", "Plants & home", "Payment", "Confirmed"]} current={S} />
        </div>
        <div className="body" ref={bodyRef}>
          {/* step 1 */}
          <div className={`d-bstep${S === 1 ? " on" : ""}`}>
            <h3>What do you need?</h3>
            <div className="d-svc">
              {(
                [
                  ["visit", "p-monstera", "Expert Home Visit", "An expert comes to your home. 45 or 90 minutes.", "from ₹499"],
                  ["drop", "p-fern", "Smart Drop-off", "Your plants stay at a hub while you travel.", "from ₹79 / night"],
                ] as const
              ).map(([v, art, b, s, pill]) => (
                <button key={v} className={bk.svc === v ? "on" : ""} onClick={() => up(() => ({ svc: v, plan: null, add: [] }))}>
                  <PlantArt id={art} />
                  <div>
                    <b>{b}</b>
                    <span>{s}</span>
                    <br />
                    <span className="pill" style={{ marginTop: 6 }}>
                      {pill}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            {bk.svc === "visit" && (
              <div>
                <h3>Visit length</h3>
                <div className="seg">
                  <button className={bk.len === 45 ? "on" : ""} onClick={() => up(() => ({ len: 45 }))}>
                    45 min · up to 8 plants · ₹499
                  </button>
                  <button className={bk.len === 90 ? "on" : ""} onClick={() => up(() => ({ len: 90 }))}>
                    90 min · up to 20 plants · ₹849
                  </button>
                </div>
              </div>
            )}
            <h3>How many plants?</h3>
            <div className="row">
              <div className="d-field" style={{ width: 200 }}>
                <span>Plants</span>
                <div className="d-qty">
                  {[-1, 1].map((d) => (
                    <button
                      key={d}
                      aria-label={d < 0 ? "Fewer" : "More"}
                      onClick={() =>
                        up((b) => {
                          const n = Math.min(40, Math.max(1, b.n + d));
                          return { n, plants: fitPlants(b.plants, n) };
                        })
                      }
                      style={{ order: d < 0 ? 0 : 2 }}
                    >
                      {d < 0 ? "−" : "+"}
                    </button>
                  ))}
                  <b className="tnum" style={{ order: 1 }}>
                    {bk.n}
                  </b>
                </div>
              </div>
              <small className="muted">
                {bk.svc === "visit"
                  ? bk.n > capN
                    ? `More than ${capN} plants: ₹40 per extra plant, or pick 90 min.`
                    : `Covered by a ${bk.len}-min visit.`
                  : "Each plant gets its own spot and QR tag."}
              </small>
            </div>
            <h3>Add-ons</h3>
            <div className="d-addons">
              {DATA.addons
                .filter((a) => (bk.svc === "visit" ? a.id !== "pick" : a.id !== "repot"))
                .map((a) => (
                  <button
                    key={a.id}
                    className={`d-addon${bk.add.includes(a.id) ? " on" : ""}`}
                    onClick={() => up((b) => ({ add: b.add.includes(a.id) ? b.add.filter((x) => x !== a.id) : [...b.add, a.id] }))}
                  >
                    <span className="ic">
                      <Icon id={a.ico} />
                    </span>
                    <div>
                      <b>
                        {a.name} · {inr(a.price)}
                      </b>
                      <small>{a.note}</small>
                    </div>
                    <span className="tg">
                      <Icon id="i-check" />
                    </span>
                  </button>
                ))}
            </div>
          </div>

          {/* step 2 */}
          <div className={`d-bstep${S === 2 ? " on" : ""}`}>
            <div className="d-sch">
              <div>
                <h3>{bk.svc === "visit" ? "Pick a visit date" : bk.from && !bk.to ? "Now pick your Back date" : "Pick your Leaving date"}</h3>
                <div className="row" style={{ justifyContent: "space-between", maxWidth: 380, marginBottom: 6 }}>
                  <div className="row" style={{ gap: 6 }}>
                    <button className="d-x" style={{ position: "static", width: 32, height: 32 }} aria-label="Previous month" disabled={m === 9} onClick={() => up(() => ({ calMonth: 9 }))}>
                      <Icon id="i-back" />
                    </button>
                    <b style={{ font: "500 17px/1 var(--ff-d)", minWidth: 130, textAlign: "center" }}>{label}</b>
                    <button className="d-x" style={{ position: "static", width: 32, height: 32 }} aria-label="Next month" disabled={m === 10} onClick={() => up(() => ({ calMonth: 10 }))}>
                      <Icon id="i-chevron" />
                    </button>
                  </div>
                  <span className="pill">
                    {bk.svc === "visit"
                      ? bk.date
                        ? fmtISO(bk.date)
                        : "No date yet"
                      : bk.from
                        ? fmtISO(bk.from) + " → " + (bk.to ? fmtISO(bk.to) : "…")
                        : "Leaving → Back"}
                  </span>
                </div>
                <div className="d-cal">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                    <span key={d} className="dw">
                      {d}
                    </span>
                  ))}
                  {Array.from({ length: off }, (_, i) => (
                    <span key={"o" + i} />
                  ))}
                  {Array.from({ length: len }, (_, i) => {
                    const d = i + 1;
                    const iso = `2026-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                    const past = iso < DATA.today;
                    const isOn = iso === bk.date || iso === bk.from || iso === bk.to;
                    const rng = bk.from && bk.to && iso > bk.from && iso < bk.to;
                    return (
                      <button
                        key={iso}
                        disabled={past}
                        className={`tnum${isOn ? " on" : ""}${rng ? " rng" : ""}${iso === DATA.today ? " today" : ""}`}
                        onClick={() => pickDay(iso)}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                {bk.svc === "visit" ? (
                  <div>
                    <h3>Choose your expert</h3>
                    <div className="d-exp-pick">
                      {DATA.experts.map((x) => (
                        <button key={x.id} className={bk.expert === x.id ? "on" : ""} onClick={() => up(() => ({ expert: x.id, slot: null }))}>
                          <Avatar id={x.art} />
                          <span style={{ flex: 1 }}>
                            <b style={{ fontSize: 14 }}>{x.name}</b>
                            <small>
                              {x.role} · {x.rating} ★ · {x.langs.slice(0, 2).join(", ")}
                            </small>
                          </span>
                          {bk.expert === x.id ? <Icon id="i-check" /> : null}
                        </button>
                      ))}
                    </div>
                    <h3>Time slot</h3>
                    <div className="d-slots">
                      {SLOTS_D.map((s, i) => {
                        const offSlot = bk.date === DATA.today ? i < 6 : (i * 7 + seed + bk.expert.length) % 5 === 0;
                        return (
                          <Chip key={s} on={bk.slot === s} disabled={offSlot} onClick={() => up(() => ({ slot: s }))}>
                            {s}
                          </Chip>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3>Choose a hub</h3>
                    <div className="d-exp-pick">
                      {DATA.hubs.map((h) => (
                        <button key={h.id} className={bk.hub === h.id ? "on" : ""} onClick={() => up(() => ({ hub: h.id }))}>
                          <span
                            className="ic"
                            style={{ width: 40, height: 40, borderRadius: 12, display: "grid", placeItems: "center", background: "var(--surface-2)", color: "var(--primary)" }}
                          >
                            <Icon id="i-pin" />
                          </span>
                          <span style={{ flex: 1 }}>
                            <b style={{ fontSize: 14 }}>{h.name}</b>
                            <small>
                              {h.dist} · {h.hours}
                            </small>
                          </span>
                          {bk.hub === h.id ? <Icon id="i-check" /> : null}
                        </button>
                      ))}
                    </div>
                    <h3>Suite</h3>
                    <div className="d-exp-pick">
                      {DATA.suites.map((s) => {
                        const [u, tt] = hub.cap[s.id as "sunny" | "shade" | "humid"];
                        return (
                          <button key={s.id} className={bk.suite === s.id ? "on" : ""} onClick={() => up(() => ({ suite: s.id }))}>
                            <svg className="av" viewBox="0 0 120 160" style={{ width: 34, height: 44 }}>
                              <use href={`#${s.art}`} />
                            </svg>
                            <span style={{ flex: 1 }}>
                              <b style={{ fontSize: 14 }}>
                                {s.name} · ₹{s.price}/night
                              </b>
                              <small>
                                {s.light} · {tt - u} of {tt} free
                              </small>
                            </span>
                            {bk.suite === s.id ? <Icon id="i-check" /> : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* step 3 */}
          <div className={`d-bstep${S === 3 ? " on" : ""}`}>
            <h3>
              Your plants <small className="muted" style={{ font: "500 13px var(--ff)" }}>· tap a species to add it</small>
            </h3>
            <div className="d-species">
              {DATA.plants.map((p) => (
                <Chip
                  key={p.id}
                  onClick={() => {
                    up((b) => ({ plants: [...b.plants, p.id], n: b.plants.length + 1 }));
                    toast(`${p.name} added`, "i-leaf");
                  }}
                >
                  <Icon id="i-plus" />
                  {p.name}
                </Chip>
              ))}
            </div>
            <div className="d-plist" style={{ marginTop: 12 }}>
              {bk.plants.length ? (
                bk.plants.map((id, i) => {
                  const p = plantById(id)!;
                  const sz = bk.pots[i] || "M";
                  return (
                    <div className="d-prow" key={i + id}>
                      <PlantArt id={p.art} />
                      <div>
                        <b>{p.name}</b>
                        <small>
                          {p.species} · water {p.water.toLowerCase()} · {p.light.toLowerCase()}
                        </small>
                      </div>
                      <div className="seg">
                        {["S", "M", "L"].map((z) => (
                          <button key={z} className={z === sz ? "on" : ""} onClick={() => up((b) => ({ pots: { ...b.pots, [i]: z } }))}>
                            {z}
                          </button>
                        ))}
                      </div>
                      <button
                        className="d-x"
                        style={{ position: "static", width: 32, height: 32 }}
                        aria-label={`Remove ${p.name}`}
                        onClick={() =>
                          up((b) => {
                            const plants = b.plants.filter((_, j) => j !== i);
                            return { plants, n: Math.max(1, plants.length) };
                          })
                        }
                      >
                        <Icon id="i-close" />
                      </button>
                    </div>
                  );
                })
              ) : (
                <p className="muted">No plants yet — tap a species above.</p>
              )}
            </div>
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 4 }}>
              <div>
                <h3>Home access notes</h3>
                <label className="d-in">
                  <textarea
                    aria-label="Home access notes"
                    defaultValue="Key with the society front desk (Tower B). Balcony door sticks — lift and slide. Please don't water the cactus."
                  />
                </label>
                <div className="row" style={{ justifyContent: "space-between", marginTop: 14, padding: "12px 14px", borderRadius: 14, border: "1px solid var(--line)" }}>
                  <span>
                    <b style={{ fontSize: 14 }}>Pets at home</b>
                    <br />
                    <small className="muted">We&apos;ll use pet-safe doses only.</small>
                  </span>
                  <button className={`d-toggle${bk.pets ? " on" : ""}`} aria-label="Pets at home" aria-pressed={bk.pets} onClick={() => up((b) => ({ pets: !b.pets }))} />
                </div>
              </div>
              <div>
                <h3>Photos (optional)</h3>
                <div className="d-uplrow">
                  {bk.photos.map((ph, i) => (
                    <button
                      key={i}
                      className={ph ? "done" : ""}
                      aria-label="Add photo"
                      onClick={() =>
                        !ph &&
                        up((b) => {
                          const src = b.plants.length ? plantById(b.plants[b.photoN % b.plants.length])!.art : "p-monstera";
                          return { photos: b.photos.map((x, j) => (j === i ? src : x)), photoN: b.photoN + 1 };
                        })
                      }
                    >
                      {ph ? <PlantArt id={ph} /> : <Icon id={i === 3 ? "i-plus" : "i-camera"} />}
                    </button>
                  ))}
                </div>
                <p className="muted" style={{ fontSize: 12.5, marginTop: 10 }}>
                  Photos help your expert bring the right tools and soil.
                </p>
              </div>
            </div>
          </div>

          {/* step 4 */}
          <div className={`d-bstep${S === 4 ? " on" : ""}`}>
            <div className="d-pay">
              <div>
                <h3>Pay with</h3>
                <div className="seg">
                  {(
                    [
                      ["upi", "UPI"],
                      ["card", "Card"],
                      ["later", "Pay after visit"],
                    ] as const
                  ).map(([v, l]) => (
                    <button key={v} className={bk.pay === v ? "on" : ""} onClick={() => up(() => ({ pay: v }))}>
                      {l}
                    </button>
                  ))}
                </div>
                {bk.pay === "upi" && (
                  <div style={{ marginTop: 16 }}>
                    <div className="d-upi">
                      {Object.keys(UPI_HANDLE).map((a) => (
                        <button
                          key={a}
                          className={upiApp === a ? "on" : ""}
                          onClick={() => {
                            setUpiApp(a);
                            setUpi("nisha.patnaik@" + UPI_HANDLE[a]);
                          }}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                    <label className="d-in" style={{ marginTop: 12 }}>
                      UPI ID
                      <input value={upi} onChange={(e) => setUpi(e.target.value)} />
                    </label>
                    <small className="muted" style={{ display: "block", marginTop: 6, fontSize: 12 }}>
                      You&apos;ll get a collect request in your UPI app.
                    </small>
                  </div>
                )}
                {bk.pay === "card" && (
                  <div style={{ marginTop: 16 }}>
                    <div className="d-cardvis">
                      <div className="row" style={{ justifyContent: "space-between" }}>
                        <span>BloomBuddy Pay</span>
                        <Icon id="i-leaf" />
                      </div>
                      <b className="tnum">•••• •••• •••• {card.replace(/\D/g, "").slice(-4) || "0000"}</b>
                      <div className="row" style={{ justifyContent: "space-between" }}>
                        <span>NISHA PATNAIK</span>
                        <span className="tnum">08/29</span>
                      </div>
                    </div>
                    <div className="grid" style={{ gridTemplateColumns: "2fr 1fr 1fr", gap: 10, marginTop: 12 }}>
                      <label className="d-in">
                        Card number
                        <input value={card} inputMode="numeric" onChange={(e) => setCard(e.target.value)} />
                      </label>
                      <label className="d-in">
                        Expiry
                        <input defaultValue="08/29" />
                      </label>
                      <label className="d-in">
                        CVV
                        <input defaultValue="•••" />
                      </label>
                    </div>
                  </div>
                )}
                {bk.pay === "later" && (
                  <div style={{ marginTop: 16 }}>
                    <div className="d-note">
                      <Icon id="i-clock" />
                      <span>Pay by UPI or cash when the expert finishes. Only for home visits under ₹2,000.</span>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <h3>Promo code</h3>
                <div className="row">
                  <label className="d-in" style={{ flex: 1 }}>
                    <input placeholder="Try FIRSTBLOOM" style={{ textTransform: "uppercase" }} value={promo} onChange={(e) => setPromo(e.target.value)} aria-label="Promo code" />
                  </label>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      const c = promo.trim().toUpperCase();
                      if (c === "FIRSTBLOOM") {
                        up(() => ({ promo: true }));
                        setPromoMsg({ t: "FIRSTBLOOM applied · 20% off", c: "var(--ok)" });
                      } else setPromoMsg({ t: c ? `“${c}” isn't valid. Try FIRSTBLOOM.` : "Enter a code first.", c: "var(--danger)" });
                    }}
                  >
                    Apply
                  </Button>
                </div>
                <small className="muted" style={{ display: "block", marginTop: 6, fontSize: 12.5, color: promoMsg.c }}>
                  {promoMsg.t}
                </small>
                <h3>Booking for</h3>
                {loggedIn ? (
                  <div className="card" style={{ padding: "14px 16px", boxShadow: "none", display: "grid", gap: 4, fontSize: 14 }}>
                    <b>Nisha Patnaik · +91 98610 42277</b>
                    <span className="muted">Tower B-1204, Ireo Skyon, Sector 60, Gurgaon</span>
                  </div>
                ) : (
                  <div className="d-guest">
                    <span className="muted">Booking as a guest — no account needed.</span>
                    <div className="two" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <label className="d-in">
                        Name (optional)
                        <input value={guest.name} onChange={(e) => setGuest((g) => ({ ...g, name: e.target.value }))} placeholder="Your name" />
                      </label>
                      <label className="d-in">
                        Phone (optional)
                        <input value={guest.phone} inputMode="tel" onChange={(e) => setGuest((g) => ({ ...g, phone: e.target.value }))} placeholder="For visit updates" />
                      </label>
                    </div>
                    <button className="d-link" style={{ justifySelf: "start" }} onClick={() => setModal("login")}>
                      Have an account? Log in
                    </button>
                  </div>
                )}
                <div className="d-note" style={{ marginTop: 12 }}>
                  <Icon id="i-shield" />
                  <span>Free cancellation up to 6 hours before. Happy-Plant guarantee included.</span>
                </div>
              </div>
            </div>
          </div>

          {/* step 5 */}
          <div className={`d-bstep${S === 5 ? " on" : ""}`}>
            <div className="d-done-burst">
              <Icon id="i-check" />
            </div>
            <h3 style={{ textAlign: "center", fontSize: 28, margin: "8px 0 4px" }}>{bk.svc === "visit" ? "You're booked!" : "Rooms reserved!"}</h3>
            <p className="muted" style={{ textAlign: "center", margin: "0 0 18px" }}>
              {bk.svc === "visit"
                ? `${e.name.split(" ")[0]} will see you on ${bk.date ? fmtISO(bk.date) : ""} at ${bk.slot ?? ""}.`
                : `Check in at ${hub.name} on ${bk.from ? fmtISO(bk.from) : ""}, 8 am – 8 pm.`}
            </p>
            <div className="d-ticket">
              <div className="a">
                {rows.map(([k, v]) => (
                  <div key={k}>
                    <small>{k}</small>
                    <b>{v}</b>
                  </div>
                ))}
              </div>
              <div className="b">
                <QR seed={bk.id} />
                <b className="tnum" style={{ font: "600 14px/1 var(--ff)" }}>
                  {bk.id}
                </b>
                <small className="muted">Show at the door</small>
              </div>
            </div>
            <div className="row" style={{ justifyContent: "center", marginTop: 22 }}>
              <Button variant="ghost" onClick={() => toast(`Added “BloomBuddy ${bk.svc === "visit" ? "visit" : "check-in"}” to your calendar`, "i-calendar")}>
                <Icon id="i-calendar" />
                Add to calendar
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  onClose();
                  router.push("/track");
                }}
              >
                <Icon id="i-pin" />
                Track booking
              </Button>
            </div>
          </div>
        </div>
        <div className="ft">
          <Button variant="ghost" style={{ visibility: S > 1 && S < 5 ? "visible" : "hidden" }} onClick={() => up((b) => ({ step: Math.max(1, b.step - 1) }))}>
            <Icon id="i-back" />
            Back
          </Button>
          <small className="muted" style={err ? { color: "var(--danger)" } : undefined}>
            {err}
          </small>
          <Button variant="accent" onClick={next} disabled={busy}>
            {busy ? (
              "Processing payment…"
            ) : S === 4 ? (
              <>
                Pay {inr(t.tot)} <Icon id="i-chevron" />
              </>
            ) : S === 5 ? (
              <>
                Done <Icon id="i-check" />
              </>
            ) : (
              <>
                Continue <Icon id="i-chevron" />
              </>
            )}
          </Button>
        </div>
      </div>
      <aside className="side">
        <span className="eyebrow">Your booking</span>
        <div className="row" style={{ gap: 12 }}>
          <svg viewBox="0 0 120 160" style={{ width: 54, height: 72 }}>
            <use href={bk.svc === "visit" ? "#p-monstera" : "#p-fern"} />
          </svg>
          <div>
            <b style={{ font: "500 19px/1.2 var(--ff-d)" }}>{pl ? pl.name : bk.svc === "visit" ? "Expert Home Visit" : "Smart Drop-off"}</b>
            <div className="muted" style={{ fontSize: 13 }}>
              {bk.svc === "visit"
                ? bk.date
                  ? `${fmtISO(bk.date)}${bk.slot ? " · " + bk.slot : ""} · ${e.name.split(" ")[0]}`
                  : "Pick a date"
                : bk.from
                  ? `${fmtISO(bk.from)} → ${bk.to ? fmtISO(bk.to) : "…"} · ${hub.name}`
                  : "Pick your dates"}
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gap: 8, padding: "14px 0", borderBlock: "1px solid var(--line)" }}>
          {t.L.map(([k, v]) => (
            <div className="line" key={k}>
              <span>{k}</span>
              <span className="tnum">{inr(v)}</span>
            </div>
          ))}
          {t.disc ? (
            <div className="line disc">
              <span>FIRSTBLOOM (20%)</span>
              <span className="tnum">−{inr(t.disc)}</span>
            </div>
          ) : null}
          <div className="line">
            <span>Plants</span>
            <span>{bk.n}</span>
          </div>
        </div>
        <div className="line">
          <span>Total (incl. GST)</span>
        </div>
        <div className="tot tnum">{inr(t.tot)}</div>
        <small className="muted" style={{ fontSize: 12 }}>
          {t.disc ? `You save ${inr(t.disc)} with FIRSTBLOOM` : bk.svc === "visit" && !pl ? "Monthly Care saves ₹497 a month on 4 visits." : ""}
        </small>
        <div className="d-note" style={{ marginTop: "auto" }}>
          <Icon id="i-leaf" />
          <span>Happy-Plant guarantee: if a plant declines in our care, we treat or replace it free.</span>
        </div>
      </aside>
    </div>
  );
}
