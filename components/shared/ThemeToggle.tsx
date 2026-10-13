"use client";

import { useTheme } from "@/lib/theme";

/** Moon/sun round button (desktop nav). CSS picks the visible icon from [data-theme]. */
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button className="d-theme" onClick={toggle} aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}>
      <svg className="ico i-lt" aria-hidden="true">
        <use href="#i-moon" />
      </svg>
      <svg className="ico i-dk" aria-hidden="true">
        <use href="#i-sun" />
      </svg>
    </button>
  );
}
