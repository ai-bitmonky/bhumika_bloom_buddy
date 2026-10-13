"use client";

import type { ButtonHTMLAttributes, PointerEvent } from "react";
import { reducedMotion } from "@/lib/motion";

type Variant = "primary" | "accent" | "ghost";
type P = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: "sm" };

/** Adds the expanding-ring ripple used on every pill button. */
export function addRipple(el: HTMLElement, x: number, y: number) {
  if (reducedMotion()) return;
  const r = el.getBoundingClientRect();
  const s = document.createElement("span");
  s.className = "ripple";
  s.style.left = x - r.left + "px";
  s.style.top = y - r.top + "px";
  if (getComputedStyle(el).position === "static") el.style.position = "relative";
  el.appendChild(s);
  window.setTimeout(() => s.remove(), 700);
}

export function Button({ variant = "primary", size, className = "", onPointerDown, type = "button", ...rest }: P) {
  const cls = ["btn", `btn--${variant}`, size === "sm" ? "btn--sm" : "", className].filter(Boolean).join(" ");
  return (
    <button
      type={type}
      className={cls}
      onPointerDown={(e: PointerEvent<HTMLButtonElement>) => {
        addRipple(e.currentTarget, e.clientX, e.clientY);
        onPointerDown?.(e);
      }}
      {...rest}
    />
  );
}
