import { qrPath } from "@/lib/qr";

export function QR({ seed, className, id }: { seed: string | number; className?: string; id?: string }) {
  return (
    <svg className={className} id={id} viewBox="0 0 29 29" shapeRendering="crispEdges" aria-hidden="true">
      <rect width="29" height="29" fill="#fff" />
      <path d={qrPath(seed)} fill="#1B1F1C" />
    </svg>
  );
}
