"use client";

/* Booking engines.
   - Desktop: one booking draft (BK) edited by the 5-step modal; opened from any "Book" CTA via useBooking().open().
   - Mobile: price helpers for the in-app booking flow (state itself lives in the mobile app context). */

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { DATA, MDATA, expertById, hubById, suiteById } from "./data";

/* ---------------- shared date helpers ---------------- */
export const dDays = (a: string, b: string) => Math.max(1, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 864e5));
export const fmtISO = (d: string) => new Date(d).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

/* ---------------- desktop booking ---------------- */
export type Svc = "visit" | "drop";
export type PayMode = "upi" | "card" | "later";
export type BK = {
  step: number;
  svc: Svc;
  len: number;
  n: number;
  add: string[];
  date: string | null;
  from: string | null;
  to: string | null;
  expert: string;
  slot: string | null;
  hub: string;
  suite: string;
  plants: string[];
  pots: Record<number, string>;
  pets: boolean;
  photos: (string | null)[];
  photoN: number;
  pay: PayMode;
  promo: boolean;
  plan: string | null;
  calMonth: number;
  id: string;
};

export type BookOpts = {
  expert?: string;
  len?: number;
  hub?: string;
  suite?: string;
  plan?: string;
  n?: number;
  from?: string;
  to?: string;
  addons?: string[];
  step?: number;
};

export function bkInitial(): BK {
  return {
    step: 1,
    svc: "visit",
    len: 45,
    n: 6,
    add: [],
    date: null,
    from: null,
    to: null,
    expert: "priya",
    slot: null,
    hub: "s29",
    suite: "shade",
    plants: ["monstera", "fiddle", "pothos", "tulsi", "fern", "peacelily"],
    pots: {},
    pets: false,
    photos: [null, null, null, null],
    photoN: 0,
    pay: "upi",
    promo: false,
    plan: null,
    calMonth: 9,
    id: "BB-24817",
  };
}

export function bkWithOpts(service: Svc | undefined, o: BookOpts = {}): BK {
  const b = bkInitial();
  b.id = "BB-" + (24817 + Math.floor(Math.random() * 900));
  if (service === "drop" || service === "visit") b.svc = service;
  if (o.expert) b.expert = o.expert;
  if (o.len) b.len = +o.len;
  if (o.hub) b.hub = o.hub;
  if (o.suite) b.suite = o.suite;
  if (o.plan) {
    b.plan = o.plan;
    b.svc = "visit";
  }
  if (o.n) b.n = +o.n;
  b.plants = fitPlants(b.plants, b.n);
  if (o.from && b.svc === "drop") {
    b.from = o.from;
    b.to = o.to ?? null;
    b.calMonth = +o.from.slice(5, 7) - 1;
  }
  if (o.from && b.svc === "visit") {
    b.date = o.from;
    b.calMonth = +o.from.slice(5, 7) - 1;
  }
  if (o.addons) b.add = [...o.addons];
  if (o.step) b.step = o.step;
  return b;
}

export function fitPlants(plants: string[], n: number) {
  const p = [...plants];
  while (p.length < n) p.push(DATA.plants[p.length % 8].id);
  return p.slice(0, n);
}

export function bkTotals(b: BK) {
  const L: [string, number][] = [];
  let sub = 0;
  const pl = b.plan ? DATA.plans.find((p) => p.id === b.plan) : null;
  if (pl) {
    L.push([pl.name + " " + pl.per.replace("per ", ""), pl.price]);
    sub += pl.price;
  } else if (b.svc === "visit") {
    const l = DATA.visitLengths.find((x) => x.id === b.len) ?? DATA.visitLengths[0];
    const cap = b.len === 45 ? 8 : 20;
    const ex = Math.max(0, b.n - cap) * 40;
    L.push([l.label, l.price]);
    sub += l.price;
    if (ex) {
      L.push([`${b.n - cap} extra plants × ₹40`, ex]);
      sub += ex;
    }
  } else {
    const s = suiteById(b.suite);
    const nights = b.from && b.to ? dDays(b.from, b.to) : 9;
    L.push([`${s.name}: ${nights} nights × ${b.n} plants × ₹${s.price}`, nights * b.n * s.price]);
    sub += nights * b.n * s.price;
  }
  DATA.addons.forEach((a) => {
    if (b.add.includes(a.id)) {
      L.push([a.name, a.price]);
      sub += a.price;
    }
  });
  const disc = b.promo ? Math.min(300, Math.round(sub * 0.2)) : 0;
  return { L, sub, disc, tot: sub - disc };
}

export const MONTHS: [number, string, number, number][] = [
  [9, "October 2026", 3, 31],
  [10, "November 2026", 6, 30],
];
export const SLOTS_D = ["8:00 am", "9:30 am", "11:00 am", "12:30 pm", "2:00 pm", "3:30 pm", "5:00 pm", "6:30 pm", "8:00 pm"];

export function bkValidate(b: BK, upi: string): string {
  if (b.step === 2) {
    if (b.svc === "visit" && !(b.date && b.slot)) return "Pick a date and a time slot to continue.";
    if (b.svc === "drop" && !(b.from && b.to)) return "Pick both Leaving and Back dates.";
  }
  if (b.step === 3 && !b.plants.length) return "Add at least one plant.";
  if (b.step === 4 && b.pay === "upi" && !/^[\w.\-]+@[\w]+$/.test(upi.trim())) return "Enter a valid UPI ID, like name@okhdfc.";
  return "";
}

/* Desktop modal + session context: booking draft, which modal is open, optional login. Nothing requires login. */
type Modal = null | "book" | "login" | "tip";
type Ctx = {
  bk: BK;
  setBk: React.Dispatch<React.SetStateAction<BK>>;
  open: (service?: Svc, o?: BookOpts) => void;
  modal: Modal;
  setModal: (m: Modal) => void;
  tipId: string | null;
  openTip: (id: string) => void;
  loggedIn: boolean;
  setLoggedIn: (v: boolean) => void;
};
const BookingCtx = createContext<Ctx | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bk, setBk] = useState<BK>(bkInitial);
  const [modal, setModal] = useState<Modal>(null);
  const [tipId, setTipId] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const open = useCallback((service?: Svc, o?: BookOpts) => {
    setBk(bkWithOpts(service, o));
    setModal("book");
  }, []);
  const openTip = useCallback((id: string) => {
    setTipId(id);
    setModal("tip");
  }, []);
  const v = useMemo(
    () => ({ bk, setBk, open, modal, setModal, tipId, openTip, loggedIn, setLoggedIn }),
    [bk, open, modal, tipId, openTip, loggedIn],
  );
  return <BookingCtx.Provider value={v}>{children}</BookingCtx.Provider>;
}

export function useBooking() {
  const c = useContext(BookingCtx);
  if (!c) throw new Error("useBooking must be used inside <BookingProvider>");
  return c;
}

/* ---------------- mobile booking pricing ---------------- */
export type MSvc = "visit" | "dropoff";
export type MB = {
  svc: MSvc;
  len: number;
  plants: string[];
  addons: string[];
  expert: string;
  day: Date;
  slot: string | null;
  leave: Date;
  back: Date;
  dropPlants: number;
  hub: string;
  suite: string;
  promo: boolean;
  pay: "upi" | "card" | "wallet";
  upiApp: string;
  pots: Record<string, string>;
};

export const M_ADDONS: Record<string, { n: string; p: number }> = {
  soil: { n: "Soil refresh", p: 149 },
  pest: { n: "Neem pest spray", p: 99 },
  pickup: { n: "Pick-and-drop", p: 199 },
};

export function mBookingInitial(svc: MSvc = "visit"): MB {
  return {
    svc,
    len: 45,
    plants: ["monty", "shanti", "bijli", "fernanda"],
    addons: [],
    expert: "priya",
    day: new Date(2026, 9, 15),
    slot: "5:00 pm",
    leave: new Date(2026, 9, 18),
    back: new Date(2026, 9, 24),
    dropPlants: 4,
    hub: "s29",
    suite: "sunny",
    promo: false,
    pay: "upi",
    upiApp: "GPay",
    pots: {},
  };
}

export const mNights = (b: MB) => Math.max(1, Math.round((b.back.getTime() - b.leave.getTime()) / 864e5));
export const mSuite = (id: string) => MDATA.suites.find((s) => s.id === id) ?? MDATA.suites[0];
export const mHub = (id: string) => MDATA.hubs.find((h) => h.id === id) ?? MDATA.hubs[0];
export const mExpert = (id: string) => MDATA.experts.find((e) => e.id === id) ?? MDATA.experts[0];

export function mPriceLines(b: MB): [string, number][] {
  const L: [string, number][] = [];
  if (b.svc === "visit") {
    const base = b.len === 45 ? 499 : 849;
    const lim = b.len === 45 ? 6 : 15;
    const n = b.plants.length;
    const extra = Math.max(0, n - lim);
    L.push([`${b.len}-min home visit · ${n} plant${n !== 1 ? "s" : ""}`, base]);
    if (extra) L.push([`${extra} extra plant${extra > 1 ? "s" : ""} × ₹39`, extra * 39]);
  } else {
    const s = mSuite(b.suite);
    const nn = mNights(b);
    L.push([`${s.name} suite · ${b.dropPlants} × ${nn} night${nn > 1 ? "s" : ""} × ₹${s.price}`, b.dropPlants * nn * s.price]);
  }
  b.addons.forEach((a) => L.push([M_ADDONS[a].n, M_ADDONS[a].p]));
  const sub = L.reduce((a, l) => a + l[1], 0);
  if (b.promo) {
    const d = Math.min(200, Math.round(sub * 0.2));
    L.push(["FIRSTBLOOM · 20% off (max ₹200)", -d]);
  }
  return L;
}
export const mTotal = (b: MB) => mPriceLines(b).reduce((a, l) => a + l[1], 0);

export { expertById, hubById, suiteById };
