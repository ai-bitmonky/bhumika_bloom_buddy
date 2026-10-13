"use client";

/* Mobile app state: in-memory screen stack (push / pop / tab with slide + fade transitions), the visitor
   (guest by default — nothing is gated behind sign-up), plants, tasks, the booking draft and bottom sheets. */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { MDATA, type MPlant } from "@/lib/data";
import { mBookingInitial, type MB, type MSvc } from "@/lib/booking";
import { reducedMotion } from "@/lib/motion";
import { useToast } from "@/components/shared/Toast";

export type ScreenId =
  | "s1-splash"
  | "s2-onboarding"
  | "s3-signup"
  | "s4-parent"
  | "s5-addplants"
  | "s6-home"
  | "s7-plants"
  | "s8-plant"
  | "s9-service"
  | "s10-schedule"
  | "s11-docs"
  | "s12-pay"
  | "s13-confirm"
  | "s14-track"
  | "s15-report"
  | "s16-care"
  | "s16-diagnose"
  | "s17-profile"
  | "s18-hub";

export type TabName = "home" | "plants" | "book" | "care" | "profile";
type Mode = "push" | "pop" | "fade";
export const TABS: Record<Exclude<TabName, "book">, ScreenId> = { home: "s6-home", plants: "s7-plants", care: "s16-care", profile: "s17-profile" };
export const TAB_OF: Partial<Record<ScreenId, TabName>> = { "s6-home": "home", "s7-plants": "plants", "s16-care": "care", "s17-profile": "profile" };

export type Sheet = { kind: "notif" | "cal" | "tip" | "chat" | "help" | "address" | "payments" | "remind" | "search"; arg?: string | number } | null;

export type User = { signedIn: boolean; name: string; phone: string };

type Ctx = {
  stack: ScreenId[];
  cur: ScreenId;
  trans: { from: ScreenId | null; to: ScreenId; mode: Mode; n: number };
  push: (id: ScreenId, x?: { plant?: string; hub?: string }) => void;
  pop: () => void;
  popTo: (id: ScreenId) => void;
  tab: (t: TabName) => void;
  reset: (id: ScreenId) => void;
  toast: (m: string) => void;

  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  banner: boolean;
  dismissBanner: () => void;
  parent: string | null;
  setParent: (p: string | null, svc: MSvc) => void;
  defaultSvc: MSvc;

  plants: MPlant[];
  setPlants: React.Dispatch<React.SetStateAction<MPlant[]>>;
  curPlant: string;
  openPlant: (id: string) => void;
  added: string[];
  setAdded: React.Dispatch<React.SetStateAction<string[]>>;

  smart: boolean;
  setSmart: (v: boolean) => void;
  done: string[];
  setDone: React.Dispatch<React.SetStateAction<string[]>>;

  B: MB;
  setB: React.Dispatch<React.SetStateAction<MB>>;
  startBook: (svc?: MSvc, patch?: Partial<MB>) => void;
  bookingId: string;
  setBookingId: (s: string) => void;

  hubView: string;
  openHub: (id: string) => void;

  sheet: Sheet;
  openSheet: (kind: NonNullable<Sheet>["kind"], arg?: string | number) => void;
  closeSheet: () => void;
  setSheetArg: (arg: string | number) => void;

  logout: () => void;
  afterSignIn: React.MutableRefObject<ScreenId | null>;
};

const MCtx = createContext<Ctx | null>(null);

/* ---------- real URLs for every screen (browser back/forward, refresh and shared links all work) ---------- */
const SLUG: Record<ScreenId, string> = {
  "s1-splash": "/m/welcome",
  "s2-onboarding": "/m/welcome",
  "s3-signup": "/m/sign-in",
  "s4-parent": "/m/sign-in/plant-parent",
  "s5-addplants": "/m/plants/add",
  "s6-home": "/",
  "s7-plants": "/m/plants",
  "s8-plant": "/m/plants/",
  "s9-service": "/m/book/service",
  "s10-schedule": "/m/book/schedule",
  "s11-docs": "/m/book/details",
  "s12-pay": "/m/book/payment",
  "s13-confirm": "/m/book/confirmed",
  "s14-track": "/track",
  "s15-report": "/track/report",
  "s16-care": "/care",
  "s16-diagnose": "/m/care/diagnose",
  "s17-profile": "/m/profile",
  "s18-hub": "/m/hubs/",
};
type Extra = { plant?: string; hub?: string };
export function pathFor(id: ScreenId, x: Extra = {}) {
  if (id === "s8-plant") return SLUG[id] + (x.plant ?? "monty");
  if (id === "s18-hub") return SLUG[id] + (x.hub ?? "s29");
  return SLUG[id];
}
/** Maps any URL (including the desktop routes) to an app screen. */
export function parsePath(path: string): { id: ScreenId; svc?: MSvc } & Extra {
  const p = path.replace(/\/+$/, "") || "/";
  let m = p.match(/^\/m\/plants\/(?!add$)([\w-]+)$/);
  if (m) return { id: "s8-plant", plant: m[1] };
  m = p.match(/^\/m\/hubs\/([\w-]+)$/);
  if (m) return { id: "s18-hub", hub: m[1] };
  if (p === "/track") return { id: "s14-track" };
  if (p === "/visits") return { id: "s9-service", svc: "visit" };
  if (p === "/dropoff") return { id: "s9-service", svc: "dropoff" };
  const hit = (Object.keys(SLUG) as ScreenId[]).find((k) => k !== "s1-splash" && SLUG[k] === p);
  return { id: hit ?? "s6-home" };
}
const ROOTS: ScreenId[] = ["s6-home", "s7-plants", "s16-care", "s17-profile"];
const PARENT: Partial<Record<ScreenId, ScreenId[]>> = {
  "s8-plant": ["s7-plants"],
  "s5-addplants": ["s7-plants"],
  "s16-diagnose": ["s16-care"],
  "s2-onboarding": ["s17-profile"],
  "s3-signup": ["s17-profile"],
  "s4-parent": ["s17-profile", "s3-signup"],
  "s10-schedule": ["s6-home", "s9-service"],
  "s11-docs": ["s6-home", "s9-service", "s10-schedule"],
  "s12-pay": ["s6-home", "s9-service", "s10-schedule", "s11-docs"],
  "s15-report": ["s6-home", "s14-track"],
};
const defaultStack = (id: ScreenId): ScreenId[] => (ROOTS.includes(id) ? [id] : [...(PARENT[id] ?? ["s6-home"]), id]);

type HState = { stack: ScreenId[]; idx: number } & Extra;
const readH = (): HState | null => {
  const st = window.history.state as { bb?: HState } | null;
  return st && st.bb && Array.isArray(st.bb.stack) && st.bb.stack.length ? st.bb : null;
};

/* ---------- session persistence (survives refresh; per tab) ---------- */
const STORE = "bb-app";
type Saved = Partial<{
  user: User;
  banner: boolean;
  parent: string | null;
  defaultSvc: MSvc;
  plants: MPlant[];
  curPlant: string;
  added: string[];
  smart: boolean;
  done: string[];
  B: MB;
  bookingId: string;
  hubView: string;
}>;
function loadSaved(): Saved {
  try {
    const raw = sessionStorage.getItem(STORE);
    if (!raw) return {};
    const s = JSON.parse(raw) as Saved;
    if (s.B) {
      const b = s.B as unknown as Record<string, unknown>;
      (["day", "leave", "back"] as const).forEach((k) => (b[k] = new Date(b[k] as string)));
    }
    return s;
  } catch {
    return {};
  }
}
export function clearSaved() {
  try {
    sessionStorage.removeItem(STORE);
  } catch {}
}

export function MobileProvider({ children, onLogout }: { children: React.ReactNode; onLogout: () => void }) {
  const toast = useToast();
  const [saved] = useState(loadSaved);
  const [boot] = useState(() => {
    const h = readH();
    if (h) return h;
    const p = parsePath(window.location.pathname);
    return { stack: defaultStack(p.id), idx: 0, plant: p.plant, hub: p.hub, svc: p.svc } as HState & { svc?: MSvc };
  });
  const [stack, setStack] = useState<ScreenId[]>(boot.stack);
  const [trans, setTrans] = useState<Ctx["trans"]>({ from: null, to: boot.stack[boot.stack.length - 1], mode: "fade", n: 0 });
  const [sheet, setSheet] = useState<Sheet>(null);
  const [user, setUser] = useState<User>(saved.user ?? { signedIn: false, name: "", phone: "" });
  const [banner, setBanner] = useState(saved.banner ?? true);
  const [parent, setParentS] = useState<string | null>(saved.parent ?? null);
  const [defaultSvc, setDefaultSvc] = useState<MSvc>(saved.defaultSvc ?? "visit");
  const [plants, setPlants] = useState<MPlant[]>(() => saved.plants ?? MDATA.plants.map((p) => ({ ...p })));
  const [curPlant, setCurPlant] = useState(boot.plant ?? saved.curPlant ?? "monty");
  const [added, setAdded] = useState<string[]>(saved.added ?? []);
  const [smart, setSmart] = useState(saved.smart ?? true);
  const [done, setDone] = useState<string[]>(saved.done ?? []);
  const [B, setB] = useState<MB>(() => saved.B ?? mBookingInitial((boot as { svc?: MSvc }).svc ?? "visit"));
  const [bookingId, setBookingId] = useState(saved.bookingId ?? "BB-26-48217");
  const [hubView, setHubView] = useState(boot.hub ?? saved.hubView ?? "s29");
  const afterSignIn = useRef<ScreenId | null>(null);
  const cur = stack[stack.length - 1];

  const stackRef = useRef(stack);
  const idxRef = useRef(boot.idx);
  const extraRef = useRef<Extra>({ plant: curPlant, hub: hubView });

  useEffect(() => {
    try {
      const s: Saved = { user, banner, parent, defaultSvc, plants, curPlant, added, smart, done, B, bookingId, hubView };
      sessionStorage.setItem(STORE, JSON.stringify(s));
    } catch {}
  }, [user, banner, parent, defaultSvc, plants, curPlant, added, smart, done, B, bookingId, hubView]);

  const go = useCallback((from: ScreenId | null, to: ScreenId, mode: Mode) => {
    setSheet(null);
    setTrans((t) => ({ from: from === to ? null : from, to, mode: reducedMotion() ? "fade" : mode, n: t.n + 1 }));
  }, []);

  /** Moves to a new stack and records it in the browser history. */
  const nav = useCallback(
    (next: ScreenId[], mode: Mode, x: Extra = {}, replace = false) => {
      const from = stackRef.current[stackRef.current.length - 1];
      const to = next[next.length - 1];
      const ex = { ...extraRef.current, ...x };
      extraRef.current = ex;
      const idx = replace ? idxRef.current : idxRef.current + 1;
      const st = { ...(window.history.state ?? {}), bb: { stack: next, idx, ...ex } };
      const url = pathFor(to, ex);
      if (replace) window.history.replaceState(st, "", url);
      else window.history.pushState(st, "", url);
      idxRef.current = idx;
      stackRef.current = next;
      setStack(next);
      go(from, to, mode);
    },
    [go],
  );

  // First load: stamp the current history entry so back/forward can restore the stack.
  useEffect(() => {
    const ex = { plant: boot.plant ?? curPlant, hub: boot.hub ?? hubView };
    extraRef.current = ex;
    const st = { ...(window.history.state ?? {}), bb: { stack: boot.stack, idx: boot.idx, ...ex } };
    const top = boot.stack[boot.stack.length - 1];
    const keepPath = ["s6-home", "s16-care", "s14-track"].includes(top) || window.location.pathname.startsWith("/m/");
    window.history.replaceState(st, "", keepPath ? window.location.href : pathFor(top, ex));
    const onPop = () => {
      const h = readH();
      const p = parsePath(window.location.pathname);
      const next = h ? h.stack : defaultStack(p.id);
      const idx = h ? h.idx : 0;
      const from = stackRef.current[stackRef.current.length - 1];
      const mode: Mode = idx < idxRef.current ? "pop" : "push";
      const plant = h?.plant ?? p.plant;
      const hub = h?.hub ?? p.hub;
      if (plant) setCurPlant(plant);
      if (hub) setHubView(hub);
      extraRef.current = { ...extraRef.current, plant, hub };
      idxRef.current = idx;
      stackRef.current = next;
      setStack(next);
      go(from, next[next.length - 1], mode);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const push = useCallback(
    (id: ScreenId, x?: Extra) => {
      const s = stackRef.current;
      if (s[s.length - 1] === id && !x) return;
      nav([...s, id], "push", x);
    },
    [nav],
  );
  const tab = useCallback(
    (t: TabName) => {
      if (t === "book") return;
      const id = TABS[t];
      const s = stackRef.current;
      if (s.length === 1 && s[0] === id) return;
      nav([id], "fade");
    },
    [nav],
  );
  const pop = useCallback(() => {
    const s = stackRef.current;
    if (idxRef.current > 0) {
      window.history.back();
      return;
    }
    if (s.length >= 2) nav(s.slice(0, -1), "pop", {}, true);
    else if (s[0] !== "s6-home") nav(["s6-home"], "fade", {}, true);
  }, [nav]);
  const popTo = useCallback(
    (id: ScreenId) => {
      const s = stackRef.current;
      const i = s.indexOf(id);
      if (i < 0) return push(id);
      const k = s.length - 1 - i;
      if (!k) return;
      if (idxRef.current >= k) window.history.go(-k);
      else nav(s.slice(0, i + 1), "pop", {}, true);
    },
    [nav, push],
  );
  const reset = useCallback((id: ScreenId) => nav([id], "fade"), [nav]);

  const startBook = useCallback(
    (svc?: MSvc, patch?: Partial<MB>) => {
      setB({ ...mBookingInitial(svc ?? defaultSvc), ...patch });
      push("s9-service");
    },
    [defaultSvc, push],
  );

  const v: Ctx = useMemo(
    () => ({
      stack,
      cur,
      trans,
      push,
      pop,
      popTo,
      tab: (t: TabName) => (t === "book" ? startBook() : tab(t)),
      reset,
      toast: (m: string) => toast(m),
      user,
      setUser,
      banner,
      dismissBanner: () => setBanner(false),
      parent,
      setParent: (p, svc) => {
        setParentS(p);
        setDefaultSvc(svc);
      },
      defaultSvc,
      plants,
      setPlants,
      curPlant,
      openPlant: (id: string) => {
        setCurPlant(id);
        push("s8-plant", { plant: id });
      },
      added,
      setAdded,
      smart,
      setSmart,
      done,
      setDone,
      B,
      setB,
      startBook,
      bookingId,
      setBookingId,
      hubView,
      openHub: (id: string) => {
        setHubView(id);
        push("s18-hub", { hub: id });
      },
      sheet,
      openSheet: (kind, arg) => setSheet({ kind, arg }),
      closeSheet: () => setSheet(null),
      setSheetArg: (arg) => setSheet((s) => (s ? { ...s, arg } : s)),
      logout: onLogout,
      afterSignIn,
    }),
    [stack, cur, trans, push, pop, popTo, tab, reset, toast, user, banner, parent, defaultSvc, plants, curPlant, added, smart, done, B, startBook, bookingId, hubView, sheet, onLogout],
  );
  return <MCtx.Provider value={v}>{children}</MCtx.Provider>;
}

export function useM() {
  const c = useContext(MCtx);
  if (!c) throw new Error("useM must be used inside <MobileProvider>");
  return c;
}

/* ---- date helpers (demo "today" is Tue 13 Oct 2026) ---- */
export const TODAY = new Date(2026, 9, 13);
export const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const DOWL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const MONL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const fmtD = (d: Date) => `${DOW[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]}`;
export const addD = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
export const sameD = (a?: Date | null, b?: Date | null) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
export const SLOTS = ["9:00 am", "11:00 am", "1:00 pm", "3:00 pm", "5:00 pm", "7:00 pm"];
