"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

type ToastFn = (msg: string, ico?: string) => void;
const ToastCtx = createContext<ToastFn>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState({ msg: "", ico: "i-check", show: false });
  const timer = useRef<number | undefined>(undefined);
  const toast = useCallback<ToastFn>((msg, ico = "i-check") => {
    setState({ msg, ico, show: true });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState((s) => ({ ...s, show: false })), 2800);
  }, []);
  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className={`toast${state.show ? " show" : ""}`} role="status" aria-live="polite">
        <svg className="ico">
          <use href={`#${state.ico}`} />
        </svg>
        <span>{state.msg}</span>
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
