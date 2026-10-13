"use client";

import { CompareTable, PlanCards, PlanQuiz } from "./widgets";
import { Reveal } from "@/components/shared/Reveal";
import { useState } from "react";

/* Ported from the v1.0 desktop prototype (plans). */
export function PlansPage() {
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <article className="d-page on">

      <section className="d-phero" style={{ paddingBottom: "24px" }}><div className="d-wrap" style={{ gridTemplateColumns: "1fr", textAlign: "center", justifyItems: "center" }}>
      <div><span className="eyebrow">Plans & Pricing</span><h1 className="h1">Pick the care that<br /><em>fits your life.</em></h1><p className="d-lead" style={{ marginInline: "auto" }}>All prices include GST. No joining fee. Cancel monthly plans any time.</p></div>
      </div></section>
      <section className="d-sec" style={{ paddingTop: "32px" }}><div className="d-wrap"><PlanCards picked={picked} /></div></section>
      <section className="d-sec d-sec--tint"><div className="d-wrap">
      <Reveal className="d-head"><div><span className="eyebrow">Compare</span><h2 className="h2">{"What's in each plan."}</h2></div></Reveal>
      <Reveal className="card" style={{ padding: "12px 16px", overflow: "hidden" }}><CompareTable /></Reveal>
      <p className="muted" style={{ fontSize: "12.5px", marginTop: "12px" }}>* Unlimited means up to 2 visits a week, fair use.</p>
      </div></section>
      <section className="d-sec"><div className="d-wrap">
      <Reveal className="d-head"><div><span className="eyebrow">60-second quiz</span><h2 className="h2">Which plan fits you?</h2></div></Reveal>
      <PlanQuiz onPick={setPicked} />
      </div></section>

    </article>
  );
}
