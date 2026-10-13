/** Decorative QR-style pattern (29×29 modules) from a seed — same look as the prototype tickets/tags. */
export function qrPath(seed: string | number): string {
  const N = 29;
  let h = 0;
  for (const c of String(seed)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  if (!h) h = 7;
  const rnd = () => {
    h ^= h << 13;
    h >>>= 0;
    h ^= h >>> 17;
    h ^= h << 5;
    h >>>= 0;
    return h / 4294967296;
  };
  const on: number[][] = Array.from({ length: N }, () => Array(N).fill(0));
  const reserved = (x: number, y: number) => (x < 8 && y < 8) || (x >= N - 8 && y < 8) || (x < 8 && y >= N - 8);
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++) {
      if (reserved(x, y)) continue;
      on[y][x] = y === 6 || x === 6 ? ((x + y) % 2 === 0 ? 1 : 0) : rnd() < 0.47 ? 1 : 0;
    }
  const finder = (x: number, y: number) => {
    for (let i = 0; i < 7; i++)
      for (let j = 0; j < 7; j++) {
        const b = i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4);
        on[y + i][x + j] = b ? 1 : 0;
      }
  };
  finder(0, 0);
  finder(N - 7, 0);
  finder(0, N - 7);
  for (let i = 0; i < 5; i++)
    for (let j = 0; j < 5; j++) {
      const b = i === 0 || i === 4 || j === 0 || j === 4 || (i === 2 && j === 2);
      on[20 + i][20 + j] = b ? 1 : 0;
    }
  let d = "";
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (on[y][x]) d += `M${x} ${y}h1v1h-1z`;
  return d;
}
