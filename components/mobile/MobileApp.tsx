"use client";

/* The BloomBuddy mobile app (< 900px). Opens straight on Home as a guest — sign-up/OTP is optional and lives
   behind Profile → "Sign in / Create account" or the dismissible Home banner. */

import { useCallback, useEffect, useRef, useState } from "react";
import { MDATA } from "@/lib/data";
import { Button } from "@/components/shared/Button";
import { MobileProvider, TAB_OF, useM, type TabName } from "./MobileContext";
import { Ico } from "./Screen";
import { AddPlantsScreen, OnboardingScreen, ParentScreen, SignupScreen, Splash } from "./screens/Onboarding";
import { HomeScreen, PlantScreen, PlantsScreen } from "./screens/Main";
import { CalendarSheet, ConfirmScreen, DocsScreen, PayScreen, ScheduleScreen, ServiceScreen } from "./screens/Booking";
import { CareScreen, DiagnoseScreen, HubScreen, ProfileScreen, ReportScreen, TrackScreen } from "./screens/Account";

function TabBar() {
  const { cur, tab } = useM();
  const on = TAB_OF[cur];
  const items: [TabName, string, string][] = [
    ["home", "i-home", "Home"],
    ["plants", "i-leaf", "My Plants"],
    ["book", "m-leaf-plus", "Book"],
    ["care", "i-tips", "Care"],
    ["profile", "i-user", "Profile"],
  ];
  return (
    <nav className={`tabbar${on ? "" : " is-hidden"}`} aria-label="App tabs">
      {items.map(([t, ic, l]) =>
        t === "book" ? (
          <button key={t} className="m-tab-book" onClick={() => tab("book")} aria-label="Book care">
            <i>
              <Ico id={ic} />
            </i>
            <span>{l}</span>
          </button>
        ) : (
          <button key={t} className={on === t ? "is-on" : ""} onClick={() => tab(t)}>
            <Ico id={ic} />
            <span>{l}</span>
          </button>
        ),
      )}
    </nav>
  );
}

const CAT_T = (i: number) => MDATA.tips[i];

function Chat() {
  const [msgs, setMsgs] = useState<{ me?: boolean; t: string; s: string }[]>([
    { t: "Namaste Nisha! Leaving Sector 29 now, reaching by 4:58 🌿", s: "4:46 pm" },
    { t: "Should I bring extra cocopeat for the soil refresh?", s: "4:46 pm" },
  ]);
  const [quick, setQuick] = useState(["Yes please", "Guard has the key", "Running 10 min late", "Please ring the bell"]);
  return (
    <>
      <div className="m-chat">
        {msgs.map((m, i) => (
          <div key={i} className={`m-msg${m.me ? " me" : ""}`}>
            {m.t}
            <small>{m.s}</small>
          </div>
        ))}
      </div>
      <div className="m-quick">
        {quick.map((q) => (
          <button
            key={q}
            className="chip"
            onClick={() => {
              setMsgs((m) => [...m, { me: true, t: q, s: "now" }]);
              setQuick((x) => x.filter((y) => y !== q));
              window.setTimeout(() => setMsgs((m) => [...m, { t: "Noted, thank you! 🙏", s: "now" }]), 900);
            }}
          >
            {q}
          </button>
        ))}
      </div>
    </>
  );
}

function TipSearch() {
  const { openSheet } = useM();
  const [q, setQ] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const t = window.setTimeout(() => ref.current?.focus({ preventScroll: true }), 300);
    return () => window.clearTimeout(t);
  }, []);
  const v = q.toLowerCase();
  const res = MDATA.tips.map((x, i) => ({ x, i })).filter((o) => !v || (o.x.title + " " + o.x.steps.join(" ")).toLowerCase().includes(v));
  return (
    <>
      <div className="m-search">
        <Ico id="m-search" />
        <input ref={ref} placeholder="e.g. yellow leaves, gnats" aria-label="Search tips" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <ul className="m-tips" style={{ marginTop: 12 }}>
        {res.length ? (
          res.map(({ x, i }) => (
            <li key={x.title}>
              <button className="m-tip" onClick={() => openSheet("tip", i)}>
                <svg className={`m-tip-ill m-tint-${x.tint}`} viewBox="0 0 120 160">
                  <use href={`#${x.p}`} />
                </svg>
                <div>
                  <b>{x.title}</b>
                  <small>{x.read} min read</small>
                </div>
              </button>
            </li>
          ))
        ) : (
          <li className="m-empty">No tips yet — ask an expert.</li>
        )}
      </ul>
    </>
  );
}

function SheetHost() {
  const { sheet, closeSheet, toast, startBook, setSheetArg } = useM();
  const [rem, setRem] = useState("8:00 am");
  const y0 = useRef<number | null>(null);
  const k = sheet?.kind;
  let title = "";
  let body: React.ReactNode = null;
  if (k === "notif") {
    title = "Notifications";
    body = (
      <>
        <ul className="m-notif">
          {MDATA.notifs.map((n) => (
            <li key={n.t}>
              <Ico id={n.i} />
              <div>
                {n.t}
                <small>{n.s}</small>
              </div>
            </li>
          ))}
        </ul>
        <Button
          variant="ghost"
          className="m-btn m-btn--block"
          onClick={() => {
            closeSheet();
            toast("All caught up");
          }}
        >
          Mark all as read
        </Button>
      </>
    );
  } else if (k === "cal") {
    const mode = sheet!.arg as "visit" | "leave" | "back";
    title = mode === "visit" ? "Pick a visit date" : mode === "leave" ? "When are you leaving?" : "When are you back?";
    body = <CalendarSheet key={mode} mode={mode} onMode={(m) => setSheetArg(m)} onClose={closeSheet} />;
  } else if (k === "tip") {
    const tp = CAT_T(+(sheet!.arg ?? 0));
    title = tp.title;
    body = (
      <div className="m-article">
        <div className={`m-art-ill m-tint-${tp.tint}`}>
          <svg viewBox="0 0 120 160">
            <use href={`#${tp.p}`} />
          </svg>
        </div>
        <p className="muted m-small">{tp.read} min read · reviewed by Meera Iyer, plant pathologist</p>
        <ol>
          {tp.steps.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ol>
        <div className="m-row2">
          <Button variant="ghost" className="m-btn" onClick={() => toast("Saved to your Care library")}>
            Save
          </Button>
          <Button
            variant="accent"
            className="m-btn"
            onClick={() => {
              closeSheet();
              startBook("visit");
            }}
          >
            Ask an expert
          </Button>
        </div>
      </div>
    );
  } else if (k === "chat") {
    title = "Chat with Priya";
    body = <Chat />;
  } else if (k === "help") {
    title = "Help";
    body = (
      <ul className="m-menu" style={{ marginTop: 4 }}>
        {(
          [
            ["i-chat", "Chat with support", "8 am – 10 pm, all days", "Chat opened · avg reply 3 min"],
            ["m-phone", "Call 1800-120-2566", "Toll-free", "Calling 1800-120-2566…"],
            ["i-shield", "Happy-Plant guarantee", "What's covered if a plant struggles", "Happy-Plant guarantee: free re-visit or plant replacement up to ₹1,500"],
            ["i-calendar", "Cancel or reschedule", "Free up to 4 h before", "Free cancellation up to 4 hours before"],
          ] as const
        ).map(([i, b, s, t]) => (
          <li key={b}>
            <button onClick={() => toast(t)}>
              <Ico id={i} />
              <span>
                <b>{b}</b>
                <small>{s}</small>
              </span>
            </button>
          </li>
        ))}
      </ul>
    );
  } else if (k === "address") {
    title = "Addresses & home access";
    body = (
      <>
        <ul className="m-bk">
          <li>
            <button onClick={() => toast("Home set as default")}>
              <Ico id="i-home" />
              <span>
                <b>Home · default</b>
                <small>Tower C-1204, Ireo Victory Valley, Sec 67</small>
              </span>
              <em className="m-tag">Default</em>
            </button>
          </li>
          <li>
            <button onClick={() => toast("Parents' home selected")}>
              <Ico id="i-pin" />
              <span>
                <b>Parents&apos; home</b>
                <small>H-23, Sector 49, South City II</small>
              </span>
            </button>
          </li>
        </ul>
        <label className="m-label">Home-access notes</label>
        <textarea className="m-textarea" rows={3} defaultValue="Spare key with guard Ramesh ji (gate 2). Balcony door sticks — lift and slide. Coco (beagle) is friendly." />
        <Button
          variant="accent"
          className="m-btn m-btn--block"
          onClick={() => {
            closeSheet();
            toast("Access notes saved · shared only with your expert");
          }}
        >
          Save
        </Button>
      </>
    );
  } else if (k === "payments") {
    title = "Payments";
    body = (
      <>
        <div className="m-savedcard">
          <Ico id="m-upi" />
          <div>
            <b>nisha.p@okhdfcbank</b>
            <span className="muted m-small">UPI · default</span>
          </div>
          <i className="m-radio is-on" />
        </div>
        <div className="m-savedcard">
          <Ico id="m-card" />
          <div>
            <b>HDFC Millennia ···· 4417</b>
            <span className="muted m-small">Expires 08/29</span>
          </div>
          <i className="m-radio" />
        </div>
        <div className="m-savedcard">
          <Ico id="m-leaf-plus" />
          <div>
            <b>₹250 BloomBuddy credits</b>
            <span className="muted m-small">Refer a friend: both get ₹150</span>
          </div>
        </div>
        <Button variant="ghost" className="m-btn m-btn--block" onClick={() => toast("Referral link copied: bloombuddy.in/r/NISHA150")}>
          Share referral link
        </Button>
      </>
    );
  } else if (k === "remind") {
    title = "Reminder";
    body = (
      <>
        <p className="m-sub">We&apos;ll nudge you at 8:00 am on the day. Want a different time?</p>
        <div className="m-chips m-chips--wrap">
          {["7:00 am", "8:00 am", "6:30 pm", "9:00 pm"].map((x) => (
            <button key={x} className={`chip${rem === x ? " chip--on" : ""}`} onClick={() => setRem(x)}>
              {x}
            </button>
          ))}
        </div>
        <Button
          variant="accent"
          className="m-btn m-btn--block"
          onClick={() => {
            closeSheet();
            toast("Reminder time saved");
          }}
        >
          Save
        </Button>
      </>
    );
  } else if (k === "search") {
    title = "Search tips";
    body = <TipSearch />;
  }
  useEffect(() => {
    if (!k) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && closeSheet();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [k, closeSheet]);
  return (
    <>
      <div className={`m-scrim${k ? " is-on" : ""}`} onClick={closeSheet} />
      <div
        className={`m-sheet${k ? " is-on" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mSheetT"
        aria-hidden={!k}
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest(".m-sheet-grab,.m-sheet-hd")) y0.current = e.clientY;
        }}
        onPointerUp={(e) => {
          if (y0.current !== null && e.clientY - y0.current > 60) closeSheet();
          y0.current = null;
        }}
      >
        <div className="m-sheet-grab" />
        <div className="m-sheet-hd">
          <h3 className="m-h2" id="mSheetT">
            {title}
          </h3>
          <button className="m-icobtn" onClick={closeSheet} aria-label="Close">
            <Ico id="i-close" />
          </button>
        </div>
        <div className="m-sheet-body">{body}</div>
      </div>
    </>
  );
}

function App() {
  const { cur } = useM();
  return (
    <div className="m-app" data-cur={cur}>
      <Splash />
      <OnboardingScreen />
      <SignupScreen />
      <ParentScreen />
      <AddPlantsScreen />
      <HomeScreen />
      <PlantsScreen />
      <PlantScreen />
      <ServiceScreen />
      <ScheduleScreen />
      <DocsScreen />
      <PayScreen />
      <ConfirmScreen />
      <TrackScreen />
      <ReportScreen />
      <CareScreen />
      <DiagnoseScreen />
      <ProfileScreen />
      <HubScreen />
      <TabBar />
      <SheetHost />
    </div>
  );
}

export default function MobileApp() {
  // Remounting the provider is the cleanest "log out → fresh guest session".
  const [session, setSession] = useState(0);
  const logout = useCallback(() => setSession((s) => s + 1), []);
  return (
    <section id="mobile" aria-label="BloomBuddy app">
      <MobileProvider key={session} onLogout={logout}>
        <App />
      </MobileProvider>
    </section>
  );
}
