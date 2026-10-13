"use client";

import { BookBtn, LenCards, ScrollBtn } from "./widgets";
import { BeforeAfter } from "@/components/shared/BeforeAfter";
import { Reveal } from "@/components/shared/Reveal";

/* Ported from the v1.0 desktop prototype (visits). */
export function VisitsPage() {
  return (
    <article className="d-page on">

      <section className="d-phero"><div className="d-wrap">
      <div>
      <span className="eyebrow">Expert Home Visit</span>
      <h1 className="h1">A plant expert,<br /><em>right at home.</em></h1>
      <p className="d-lead">A trained BloomBuddy comes to your flat, checks every plant, and does the work — the right way for each species. Organic products only.</p>
      <div className="row" style={{ marginTop: "28px" }}><BookBtn svc="visit" className="btn btn--accent">Book a visit · from ₹499</BookBtn><ScrollBtn to="vReport" className="btn btn--ghost" >See a report card</ScrollBtn></div>
      <div className="d-crumbs"><span className="pill"><svg className="ico" aria-hidden="true"><use href="#i-shield" /></svg>Police-verified</span><span className="pill"><svg className="ico" aria-hidden="true"><use href="#i-clock" /></svg>Slots 8 am – 8 pm</span><span className="pill"><svg className="ico" aria-hidden="true"><use href="#i-leaf" /></svg>Organic only</span></div>
      </div>
      <div className="art-box"><svg viewBox="0 0 480 560" style={{ height: "118%", marginBottom: "-6%" }}><use href="#s-expert-watering" /></svg></div>
      </div></section>
      <section className="d-sec d-sec--tint"><div className="d-wrap">
      <Reveal className="d-head"><div><span className="eyebrow">{"What's included"}</span><h2 className="h2">Everything your plants need, in one visit.</h2></div></Reveal>
      <div className="d-incl">
      <Reveal className="card d-inc"><span className="ic"><svg className="ico" aria-hidden="true"><use href="#i-water" /></svg></span><div><b>Right-amount watering</b><p>Measured per pot. Moisture checked 2 cm down first.</p></div></Reveal>
      <Reveal className="card d-inc"><span className="ic"><svg className="ico" aria-hidden="true"><use href="#i-prune" /></svg></span><div><b>Pruning & cleaning</b><p>Dead leaves removed, dust wiped so leaves can breathe.</p></div></Reveal>
      <Reveal className="card d-inc"><span className="ic"><svg className="ico" aria-hidden="true"><use href="#i-pest" /></svg></span><div><b>Pest check</b><p>Under-leaf check for mealybugs, mites and scale.</p></div></Reveal>
      <Reveal className="card d-inc"><span className="ic"><svg className="ico" aria-hidden="true"><use href="#i-repot" /></svg></span><div><b>Soil refresh</b><p>Top 3 cm replaced with cocopeat + vermicompost.</p><span className="pill pill--accent">Add-on ₹149</span></div></Reveal>
      <Reveal className="card d-inc"><span className="ic"><svg className="ico" aria-hidden="true"><use href="#i-feed" /></svg></span><div><b>Feeding</b><p>Seaweed or compost tea, matched to the season.</p></div></Reveal>
      <Reveal className="card d-inc"><span className="ic"><svg className="ico" aria-hidden="true"><use href="#i-repot" /></svg></span><div><b>Repotting</b><p>Root check, pot sized up, fresh mix. Pot not included.</p><span className="pill pill--accent">Add-on ₹249 / plant</span></div></Reveal>
      </div>
      </div></section>
      <section className="d-sec"><div className="d-wrap">
      <Reveal className="d-head"><div><span className="eyebrow">Pricing</span><h2 className="h2">Pay by visit length.</h2></div><p className="muted">Not sure? Most flats with up to 8 plants need 45 minutes.</p></Reveal>
      <LenCards />
      </div></section>
      <section className="d-sec d-sec--tint" id="vReport"><div className="d-wrap">
      <Reveal className="d-head"><div><span className="eyebrow">Visit Report Card</span><h2 className="h2">Proof of care, after every visit.</h2></div><p className="muted">{"Drag the slider to compare the same monstera before and after Priya's visit."}</p></Reveal>
      <Reveal className="card d-report">
      <div className="l">
      <BeforeAfter beforeTag="Before · 1 Oct" afterTag="After · 8 Oct" />
      <div className="d-rstats"><div><b>+31%</b><span>health score</span></div><div><b>2</b><span>new leaves</span></div><div><b>0</b><span>pests found</span></div></div>
      <p className="muted" style={{ fontSize: "13px", margin: "14px 0 0" }}>Photos are taken from the same spot each visit, so you can see real change over time.</p>
      </div>
      <div className="r">
      <div className="row" style={{ justifyContent: "space-between" }}><div><b style={{ font: "500 22px/1.2 var(--ff-d)" }}>Bruno the Monstera</b><div className="muted" style={{ fontSize: "13px" }}>Visit #14 · Tue 8 Oct 2026 · 47 min</div></div><span className="pill">Health 92% ↑ 31</span></div>
      <div>
      <div className="d-task"><svg className="ico" aria-hidden="true"><use href="#i-check" /></svg><span>Watered 240 ml, drained saucer</span><em>5:06 pm</em></div>
      <div className="d-task"><svg className="ico" aria-hidden="true"><use href="#i-check" /></svg><span>Pruned 2 yellow leaves at the node</span><em>5:12 pm</em></div>
      <div className="d-task"><svg className="ico" aria-hidden="true"><use href="#i-check" /></svg><span>Pest check — no mealybugs found</span><em>5:18 pm</em></div>
      <div className="d-task"><svg className="ico" aria-hidden="true"><use href="#i-check" /></svg><span>Soil refresh, 3 cm vermicompost mix</span><em>5:31 pm</em></div>
      <div className="d-task"><svg className="ico" aria-hidden="true"><use href="#i-check" /></svg><span>Moved 1 m back from the hot window</span><em>5:40 pm</em></div>
      </div>
      <div className="d-note"><svg className="ico" aria-hidden="true"><use href="#i-calendar" /></svg><span><b>Next due: Thu 15 Oct.</b>{" Water 240 ml. Wipe leaves. Check the new leaf near the moss pole."}</span></div>
      <div className="d-sign"><div className="row"><svg className="av" viewBox="0 0 80 80" aria-hidden="true"><use href="#a-priya" /></svg><div><b style={{ fontSize: "14px" }}>Priya Sharma</b><div className="muted" style={{ fontSize: "12px" }}>Certified horticulturist</div></div></div><svg className="sig" viewBox="0 0 150 44"><path d="M6 32c10-18 18-24 20-16s-8 18-4 18 12-20 18-20-2 18 4 16 8-12 14-12 0 10 6 10 10-16 16-16-4 14 2 14 16-8 24-10 18 2 26-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></div>
      </div>
      </Reveal>
      </div></section>
      <section className="d-sec"><div className="d-wrap">
      <Reveal className="d-head" id="faqV"><div><span className="eyebrow">FAQ</span><h2 className="h2">Good questions, straight answers.</h2></div></Reveal>
      <div className="d-faq">
      <details open><summary>{"How does the expert get into my home if I'm away?"}<svg className="ico" aria-hidden="true"><use href="#i-plus" /></svg></summary><p>{"You choose: a neighbour, your society's front desk, a smart-lock code, or a key handed over at a hub. Your access note is only shown to the assigned expert on the visit day, and the expert logs entry and exit times in the app."}</p></details>
      <details><summary>Are visits insured?<svg className="ico" aria-hidden="true"><use href="#i-plus" /></svg></summary><p>Yes. Every visit is covered up to ₹50,000 for accidental damage to your home or plants. Claims are settled within 7 working days.</p></details>
      <details><summary>What if a plant dies in your care?<svg className="ico" aria-hidden="true"><use href="#i-plus" /></svg></summary><p>{"Our Happy-Plant guarantee covers it. If a plant declines while we care for it, we treat it free. If it can't be saved, we replace it with the same species and a similar size."}</p></details>
      <details><summary>Can I cancel or reschedule?<svg className="ico" aria-hidden="true"><use href="#i-plus" /></svg></summary><p>{"Free changes up to 6 hours before the slot. Later than that, we charge ₹99 so the expert's time is paid."}</p></details>
      <details><summary>I have a dog and a cat. Is that okay?<svg className="ico" aria-hidden="true"><use href="#i-plus" /></svg></summary><p>Of course. Mark “Pets at home” when booking. Experts only use pet-safe neem doses and will tell you which plants are toxic to pets.</p></details>
      </div>
      </div></section>
      <section className="d-sec" style={{ paddingTop: "0" }}><div className="d-wrap"><Reveal className="d-cta"><div><h2 className="h2">Book Priya, Arjun or Meera.</h2><p className="muted" style={{ margin: "6px 0 0" }}>Next free slot today at 5:00 pm in Sector 56.</p></div><BookBtn svc="visit" className="btn btn--accent">Book a home visit</BookBtn></Reveal></div></section>

    </article>
  );
}
