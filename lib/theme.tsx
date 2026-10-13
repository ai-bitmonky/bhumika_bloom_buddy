"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";
const KEY = "bb-theme";

/** Runs before first paint (inlined in <head>) so the saved / system theme is applied with no flash. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${KEY}');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='light'}})();`;

type Ctx = { theme: Theme; setTheme: (t: Theme) => void; toggle: () => void };
const ThemeCtx = createContext<Ctx>({ theme: "light", setTheme: () => {}, toggle: () => {} });

function readStored(): Theme | null {
  try {
    const t = localStorage.getItem(KEY);
    return t === "light" || t === "dark" ? t : null;
  } catch {
    return null;
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  // Sync React state with what the init script already put on <html>.
  useEffect(() => {
    const cur = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    setThemeState(cur);
    // Follow the OS setting live until the visitor picks a theme themselves.
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      if (readStored()) return;
      const t: Theme = e.matches ? "dark" : "light";
      document.documentElement.dataset.theme = t;
      setThemeState(t);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    const h = document.documentElement;
    h.classList.add("theme-fade");
    h.dataset.theme = t;
    setThemeState(t);
    try {
      localStorage.setItem(KEY, t);
    } catch {}
    window.setTimeout(() => h.classList.remove("theme-fade"), 350);
  }, []);

  const toggle = useCallback(() => setTheme(theme === "dark" ? "light" : "dark"), [theme, setTheme]);

  return <ThemeCtx.Provider value={{ theme, setTheme, toggle }}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);
