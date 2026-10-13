"use client";

import { createElement, useEffect, useRef, useState, type HTMLAttributes } from "react";

type P = HTMLAttributes<HTMLElement> & { as?: string; onReveal?: () => void; noValidate?: boolean };

/** Scroll reveal: rises 16px and fades in the first time it enters the viewport. */
export function Reveal({ as = "div", className = "", onReveal, children, ...rest }: P) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setIn] = useState(false);
  const cb = useRef(onReveal);
  cb.current = onReveal;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setIn(true);
      cb.current?.();
      return;
    }
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            setIn(true);
            cb.current?.();
            io.disconnect();
          }
        }),
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return createElement(as, { ref, className: `reveal${inView ? " in" : ""}${className ? " " + className : ""}`, ...rest }, children);
}
