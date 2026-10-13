/** Booking progress drawn as a vine that grows; a leaf sprouts on each finished step. */
const VINE = "M0 14C25 4 42 24 67 14S117 4 133 14 183 24 200 14 250 4 267 14 317 24 333 14 383 4 400 14";

export function Stepper({ labels, current }: { labels: string[]; current: number }) {
  const n = labels.length;
  return (
    <div className="stepper" style={{ ["--n" as string]: n }}>
      <svg className="vine" viewBox="0 0 400 28" preserveAspectRatio="none">
        <path className="vine-bg" d={VINE} />
        <path className="vine-grow" pathLength={100} d={VINE} style={{ strokeDashoffset: 100 - ((current - 1) / (n - 1)) * 100 }} />
      </svg>
      {labels.map((l, i) => {
        const done = i < current - 1;
        return (
          <div key={l} className={`st${done ? " done" : ""}${i === current - 1 ? " cur" : ""}`} style={{ left: `${(i / (n - 1)) * 100}%` }}>
            <span className="dot">
              {done ? "" : String(i + 1)}
              <svg className="lf" viewBox="0 0 24 24">
                <path d="M3 21C3 11 9 4 21 3c0 11-7 18-18 18z" fill="currentColor" />
                <path d="M4 20 15 9" stroke="var(--surface)" strokeWidth="1.4" />
              </svg>
            </span>
            {l}
          </div>
        );
      })}
    </div>
  );
}
