"use client";

import { useState } from "react";
import { PlantArt } from "./Icon";

/** Draggable before/after comparison (wilted vs thriving illustration). */
export function BeforeAfter({
  before = "p-monstera-wilted",
  after = "p-monstera",
  beforeTag = "Before",
  afterTag = "After",
}: {
  before?: string;
  after?: string;
  beforeTag?: string;
  afterTag?: string;
}) {
  const [pos, setPos] = useState(50);
  return (
    <div className="ba-slider" style={{ ["--pos" as string]: pos + "%" }}>
      <div className="ba-l">
        <PlantArt id={before} className="" />
        <span className="ba-tag">{beforeTag}</span>
      </div>
      <div className="ba-r">
        <PlantArt id={after} className="" />
        <span className="ba-tag">{afterTag}</span>
      </div>
      <div className="ba-h" />
      <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(+e.target.value)} aria-label="Compare before and after" />
    </div>
  );
}
