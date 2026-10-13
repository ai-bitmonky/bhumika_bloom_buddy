import type { CSSProperties, ReactNode } from "react";
import { PlantArt } from "./Icon";

/** Plant Postcard card; add `develop` to replay the "photo developing" animation. */
export function Polaroid({
  art,
  caption,
  develop,
  id,
  tilt,
}: {
  art: string;
  caption: ReactNode;
  develop?: boolean;
  id?: string;
  tilt?: string;
}) {
  return (
    <div className={`polaroid${develop ? " develop" : ""}`} id={id} style={tilt ? ({ "--r": tilt } as CSSProperties) : undefined}>
      <div className="pol-img">
        <PlantArt id={art} className="" />
      </div>
      <div className="pol-cap">{caption}</div>
    </div>
  );
}
