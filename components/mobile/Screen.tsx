"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useM, type ScreenId } from "./MobileContext";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** One app screen. Active/leaving classes drive the push / pop slide and tab cross-fade from the prototype CSS. */
export function Screen({
  id,
  className = "",
  label,
  children,
  onEnter,
}: {
  id: ScreenId;
  className?: string;
  label: string;
  children: React.ReactNode;
  onEnter?: (fromPop: boolean) => void;
}) {
  const { cur, trans } = useM();
  const ref = useRef<HTMLElement>(null);
  const [anim, setAnim] = useState(-1);
  const active = cur === id;
  const enter = useRef(onEnter);
  enter.current = onEnter;

  useIsoLayoutEffect(() => {
    if (trans.n === 0) return;
    if (trans.to === id || trans.from === id) {
      setAnim(trans.n);
      const t = window.setTimeout(() => setAnim(-1), 420);
      return () => window.clearTimeout(t);
    }
  }, [trans.n]);

  useIsoLayoutEffect(() => {
    if (trans.to === id && trans.n > 0) {
      if (trans.mode !== "pop" && ref.current) ref.current.scrollTop = 0;
      enter.current?.(trans.mode === "pop");
    }
  }, [trans.n]);

  const animating = anim === trans.n;
  const leaving = animating && trans.from === id && !active;
  const cls = ["scr", className, active ? "is-active" : "", leaving ? "is-leaving" : ""];
  if (animating && active && trans.from) cls.push(`m-in-${trans.mode}`);
  if (leaving) cls.push(`m-out-${trans.mode}`);
  return (
    <section ref={ref} className={cls.filter(Boolean).join(" ")} data-screen={id} aria-label={label} aria-hidden={!active}>
      {children}
    </section>
  );
}

/** Standard top bar with a back arrow. */
export function TopBar({ title, step, right, onBack }: { title?: string; step?: string; right?: React.ReactNode; onBack?: () => void }) {
  const { pop } = useM();
  return (
    <header className="m-top">
      <button className="m-icobtn" onClick={onBack ?? pop} aria-label="Back">
        <svg className="ico">
          <use href="#i-back" />
        </svg>
      </button>
      {title ? <span className="m-top-t">{title}</span> : <span className="m-step-lbl">{step}</span>}
      {right ?? <span className="m-icobtn m-ghost" />}
    </header>
  );
}

export function Ico({ id, className = "" }: { id: string; className?: string }) {
  return (
    <svg className={`ico${className ? " " + className : ""}`} aria-hidden="true">
      <use href={`#${id}`} />
    </svg>
  );
}

/** Segmented control with the sliding pill (.m-seg). */
export function Seg<T extends string>({
  items,
  value,
  onChange,
  className = "",
  pill = true,
}: {
  items: { v: T; label: React.ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
  pill?: boolean;
}) {
  const i = Math.max(0, items.findIndex((x) => x.v === value));
  return (
    <div className={`seg m-seg ${className}`} role="tablist" style={{ ["--n" as string]: items.length, ["--i" as string]: i }}>
      {items.map((x) => (
        <button key={x.v} role="tab" aria-selected={x.v === value} className={x.v === value ? "is-on" : ""} onClick={() => onChange(x.v)}>
          {x.label}
        </button>
      ))}
      {pill && <i className="m-seg-pill" />}
    </div>
  );
}
