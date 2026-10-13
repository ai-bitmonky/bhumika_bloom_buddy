"use client";

import { Diagnosis, ScrollBtn, TipsAll } from "./widgets";
import { Reveal } from "@/components/shared/Reveal";

/* Ported from the v1.0 desktop prototype (care). */
export function CarePage() {
  return (
    <article className="d-page on">

      <section className="d-phero" style={{ paddingBottom: "32px" }}><div className="d-wrap">
      <div><span className="eyebrow">Plant Care</span><h1 className="h1">Tips, tricks &<br /><em>a plant doctor.</em></h1><p className="d-lead">{"Short guides written by our experts for Indian homes and seasons. Or upload a photo and find out what's wrong."}</p><div className="row" style={{ marginTop: "26px" }}><ScrollBtn to="diag" className="btn btn--primary" ><svg className="ico" aria-hidden="true"><use href="#i-camera" /></svg>Check a sick plant</ScrollBtn><ScrollBtn to="tipsAll" className="btn btn--ghost" >Browse 8 guides</ScrollBtn></div></div>
      <div className="art-box"><svg viewBox="0 0 120 160" style={{ position: "absolute", left: "4%", bottom: "0", height: "70%" }}><use href="#p-pothos" /></svg><svg viewBox="0 0 120 160" style={{ position: "relative", height: "92%" }}><use href="#p-fiddle" /></svg><svg viewBox="0 0 120 160" style={{ position: "absolute", right: "4%", bottom: "0", height: "66%" }}><use href="#p-fern" /></svg></div>
      </div></section>
      <section className="d-sec" id="tipsAll" style={{ paddingTop: "40px" }}><div className="d-wrap">
      <TipsAll />
      </div></section>
      <section className="d-sec d-sec--tint" id="diag"><div className="d-wrap">
      <Reveal className="d-head"><div><span className="eyebrow">Disease Care</span><h2 className="h2">Upload a photo. Get an answer.</h2></div><p className="muted">Free photo check. A BloomBuddy plant doctor confirms the result and can visit to treat it.</p></Reveal>
      <Reveal className="card d-diag">
      <Diagnosis />
      </Reveal>
      </div></section>

    </article>
  );
}
