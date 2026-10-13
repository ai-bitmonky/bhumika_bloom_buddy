"use client";

import { BizQuote, ScrollBtn } from "./widgets";
import { Reveal } from "@/components/shared/Reveal";

/* Ported from the v1.0 desktop prototype (business). */
export function BusinessPage() {
  return (
    <article className="d-page on">

      <section className="d-phero"><div className="d-wrap">
      <div><span className="eyebrow">BloomBuddy for Business</span><h1 className="h1">Greener offices,<br /><em>zero effort.</em></h1><p className="d-lead">Weekly expert care for offices, cafés and co-working spaces. One monthly invoice, one point of contact, plants that always look fresh.</p><div className="row" style={{ marginTop: "26px" }}><ScrollBtn to="bizForm" className="btn btn--accent" >Request a quote</ScrollBtn><span className="muted" style={{ fontSize: "14px" }}>From ₹4,999 / month for up to 40 plants</span></div></div>
      <div className="art-box" style={{ gap: "0" }}><svg viewBox="0 0 120 160" style={{ height: "70%" }}><use href="#p-snake" /></svg><svg viewBox="0 0 120 160" style={{ height: "96%" }}><use href="#p-monstera" /></svg><svg viewBox="0 0 120 160" style={{ height: "80%" }}><use href="#p-peacelily" /></svg><svg viewBox="0 0 120 160" style={{ height: "62%" }}><use href="#p-moneyplant" /></svg></div>
      </div></section>
      <section className="d-sec d-sec--tint" style={{ padding: "40px 0" }}><div className="d-wrap"><div className="d-logos"><span>Brewhouse Café</span><span>WorkNest Cyber City</span><span>Lumen Dental</span><span>Studio Kaath</span><span>NorthBay Realty</span></div></div></section>
      <section className="d-sec"><div className="d-wrap">
      <div className="d-biz">
      <Reveal className="card d-inc"><span className="ic"><svg className="ico" aria-hidden="true"><use href="#i-calendar" /></svg></span><div><b>Fixed weekly slot</b><p>Before opening hours, so your team and guests are never disturbed.</p></div></Reveal>
      <Reveal className="card d-inc"><span className="ic"><svg className="ico" aria-hidden="true"><use href="#i-leaf" /></svg></span><div><b>Free swaps</b><p>Any plant that looks tired is swapped with a fresh one, at no cost.</p></div></Reveal>
      <Reveal className="card d-inc"><span className="ic"><svg className="ico" aria-hidden="true"><use href="#i-book" /></svg></span><div><b>One GST invoice</b><p>Monthly billing with GST input credit. Pay by NEFT or UPI.</p></div></Reveal>
      </div>
      </div></section>
      <section className="d-sec d-sec--tint" id="bizForm"><div className="d-wrap" style={{ display: "grid", gridTemplateColumns: ".9fr 1.1fr", gap: "48px", alignItems: "start" }}>
      <Reveal as="div"><span className="eyebrow">Get a quote</span><h2 className="h2">Tell us about your space.</h2><p className="d-lead">{"We'll visit for a free 20-minute survey and send a plan with prices within 2 working days."}</p>
      <ul className="d-checks"><li><svg className="ico" aria-hidden="true"><use href="#i-check" /></svg><span>Free survey anywhere in Gurgaon, South Delhi and Noida</span></li><li><svg className="ico" aria-hidden="true"><use href="#i-check" /></svg><span>Plant rental available for new offices</span></li><li><svg className="ico" aria-hidden="true"><use href="#i-check" /></svg><span>Pause during holidays, no charge</span></li></ul></Reveal>
      <BizQuote />
      </div></section>

    </article>
  );
}
