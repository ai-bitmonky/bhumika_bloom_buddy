import type { CSSProperties } from "react";

type P = { id: string; className?: string; style?: CSSProperties; label?: string };

/** Line icon from the sprite (24px grid, 1.75 stroke). */
export function Icon({ id, className = "ico", style, label }: P) {
  return (
    <svg className={className} style={style} aria-hidden={label ? undefined : true} aria-label={label} role={label ? "img" : undefined}>
      <use href={`#${id}`} />
    </svg>
  );
}

/** Plant / pot illustration (viewBox 0 0 120 160). */
export function PlantArt({ id, className = "art", style }: { id: string; className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 120 160" aria-hidden="true">
      <use href={`#${id}`} />
    </svg>
  );
}

/** Illustrated expert / customer bust (viewBox 0 0 80 80). */
export function Avatar({ id, className = "av", style }: { id: string; className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 80 80" aria-hidden="true">
      <use href={`#${id}`} />
    </svg>
  );
}

export function Stars({ n, max = 5 }: { n: number; max?: number }) {
  return (
    <span className="stars" aria-label={`${n} out of 5`}>
      {Array.from({ length: max }, (_, i) => (
        <svg key={i} className={`ico${i < Math.round(n) ? "" : " off"}`}>
          <use href="#i-star" />
        </svg>
      ))}
    </span>
  );
}
