"use client";

import Link from "next/link";
import { BookBtn, ContactForm, ExpertCards, HeroWidget, PersonaTiles, PlanBtn, PlanCards, PostcardDemo, ReviewCards, SectorChips, TipCarouselSection } from "./widgets";
import { Reveal } from "@/components/shared/Reveal";

/* Ported from the v1.0 desktop prototype (home). */
export function HomePage() {
  return (
    <article className="d-page on">

      <section className="d-hero"><div className="d-wrap">
      <div>
      <span className="eyebrow">{"Plant care, even when you're away"}</span>
      <h1 className="h1">{"Your plants, looked after like "}<em>family.</em></h1>
      <p className="d-lead">{"Professional in-home plant care and Smart Drop-off hubs for plant lovers who travel or are busy. Trained experts, organic care, and a photo of your plants every day you're away."}</p>
      <HeroWidget />
      </div>
      <div className="d-arch">
      <div className="frame"><svg viewBox="0 0 480 560" preserveAspectRatio="xMidYMid slice" role="img" aria-label="A BloomBuddy expert watering a monstera in a sunny room"><use href="#s-expert-watering" /></svg></div>
      <div className="card d-float f1"><svg className="ico" aria-hidden="true"><use href="#i-star" /></svg><div><b>4.8 ★ rating</b>1,200+ visits in NCR</div></div>
      <div className="card d-float f2"><svg className="av" viewBox="0 0 80 80" aria-hidden="true"><use href="#a-priya" /></svg><div><b>Next slot: today 5 pm</b>Priya · Sector 56</div></div>
      </div>
      </div></section>
      <section className="d-trust"><div className="d-wrap">
      <div className="t"><span className="ic"><svg className="ico" aria-hidden="true"><use href="#i-shield" /></svg></span><div><b>Verified experts</b><p>Police-verified, trained horticulturists. Same face every visit.</p></div></div>
      <div className="t"><span className="ic"><svg className="ico" aria-hidden="true"><use href="#i-home" /></svg></span><div><b>Insured visits</b><p>Every visit is covered up to ₹50,000 for your home and plants.</p></div></div>
      <div className="t"><span className="ic"><svg className="ico" aria-hidden="true"><use href="#i-leaf" /></svg></span><div><b>Happy-Plant guarantee</b><p>If a plant declines in our care, we treat or replace it free.</p></div></div>
      </div></section>
      <section className="d-sec"><div className="d-wrap">
      <Reveal className="d-head"><div><span className="eyebrow">Start here</span><h2 className="h2">What kind of plant parent are you?</h2></div><p className="muted">{"Pick one. We'll show the service that fits you best."}</p></Reveal>
      <PersonaTiles />
      </div></section>
      <section className="d-sec d-sec--tint"><div className="d-wrap">
      <Reveal className="d-head"><div><span className="eyebrow">Our services</span><h2 className="h2">Care that comes to you,<br />{"or a hotel they'll love."}</h2></div><Link href="/plans" className="d-link">{"Compare all plans "}<svg className="ico" aria-hidden="true"><use href="#i-chevron" /></svg></Link></Reveal>
      <div className="d-bento">
      <Reveal className="card d-cell d-cell--big" data-cell="visit">
      <span className="eyebrow">Expert Home Visit</span>
      <h3 className="h3">A trained expert at your door, on your schedule.</h3>
      <p>Watering, pruning, pest checks, soil refresh and feeding — done the right way for each plant. You get a report card after every visit.</p>
      <div className="vis"><svg viewBox="0 0 120 160"><use href="#p-fiddle" /></svg><svg viewBox="0 0 120 160"><use href="#p-monstera" /></svg><svg viewBox="0 0 120 160"><use href="#p-peacelily" /></svg></div>
      <div className="from"><div><small>From</small><br /><b>₹499</b> <small>/ 45-min visit</small></div><BookBtn svc="visit" className="btn btn--accent">Book a visit</BookBtn></div>
      </Reveal>
      <Reveal className="card d-cell" data-cell="drop">
      <span className="eyebrow">Smart Drop-off</span>
      <h3 className="h3">The Plant Hotel</h3>
      <p>{"Drop plants at a hub before you travel. Sunny, bright-shade or humid \"spa\" suites."}</p>
      <svg className="mini" viewBox="0 0 120 160" style={{ width: "100px", height: "134px", right: "6px", bottom: "56px" }}><use href="#p-snake" /></svg>
      <div className="from"><div><small>From</small> <b>₹79</b> <small>/ plant-night</small></div><Link href="/dropoff" className="d-link">{"See hubs "}<svg className="ico" aria-hidden="true"><use href="#i-chevron" /></svg></Link></div>
      </Reveal>
      <Reveal className="card d-cell" data-cell="plus">
      <span className="eyebrow">Membership</span>
      <h3 className="h3">Buddy Care+</h3>
      <p>Priority slots, 7 free hub nights and a 12-month Happy-Plant guarantee.</p>
      <svg className="mini" viewBox="0 0 120 160" style={{ width: "100px", height: "134px", right: "6px", bottom: "56px" }}><use href="#p-moneyplant" /></svg>
      <div className="from"><div><b>₹9,999</b> <small>/ year</small></div><PlanBtn plan="plus" className="d-link" >{"Join Care+ "}<svg className="ico" aria-hidden="true"><use href="#i-chevron" /></svg></PlanBtn></div>
      </Reveal>
      <Reveal className="card d-cell d-cell--wide" data-cell="disease">
      <div>
      <span className="eyebrow">Disease Care</span>
      <h3 className="h3">Spots on a leaf? Send a photo.</h3>
      <p>Our photo check finds the likely problem in seconds. A plant doctor confirms it and books a treatment visit.</p>
      <div className="from" style={{ paddingTop: "4px" }}><div><b>Free check</b> <small>· treatment visit from ₹649</small></div><Link href="/care#diag" className="d-link">{"Try it now "}<svg className="ico" aria-hidden="true"><use href="#i-chevron" /></svg></Link></div>
      </div>
      <div className="d-scan"><div className="row" style={{ gap: "8px" }}><svg className="ico" aria-hidden="true"><use href="#i-camera" /></svg><b style={{ fontSize: "13px" }}>Leaf-spot fungus</b></div><div className="bar"><i /></div><small className="muted" style={{ fontSize: "12px" }}>86% confidence · expert confirms in 2 h</small></div>
      </Reveal>
      </div>
      </div></section>
      <section className="d-sec"><div className="d-wrap">
      <Reveal className="d-head" style={{ justifyContent: "center", textAlign: "center" }}><div><span className="eyebrow">How it works</span><h2 className="h2">Three steps. Then you relax.</h2></div></Reveal>
      <Reveal className="d-how" id="howRow">
      <svg className="vine" viewBox="0 0 800 40" preserveAspectRatio="none"><path pathLength="1" d="M0 20C80 0 120 40 200 20S320 0 400 20 520 40 600 20 720 0 800 20" /></svg>
      <div className="stp"><div className="num"><svg className="ico" aria-hidden="true"><use href="#i-leaf" /></svg></div><span className="tag">1</span><b>Tell us about your plants</b><p>Add plants by name or photo. We build a care plan for each one by species, age and needs.</p></div>
      <div className="stp"><div className="num"><svg className="ico" aria-hidden="true"><use href="#i-calendar" /></svg></div><span className="tag">2</span><b>Pick an expert & time</b><p>Choose a home visit slot, or your Leaving and Back dates for a hub stay.</p></div>
      <div className="stp"><div className="num"><svg className="ico" aria-hidden="true"><use href="#i-camera" /></svg></div><span className="tag">3</span><b>Relax. Get a Plant Postcard.</b><p>{"A photo and a short note from your expert, every day you're away."}</p></div>
      </Reveal>
      </div></section>
      <section className="d-sec d-sec--tint"><div className="d-wrap d-pc">
      <PostcardDemo copy={<>
      <span className="eyebrow">Plant Postcards</span>
      <h2 className="h2">Peace of mind,<br />{"delivered "}<em>every evening.</em></h2>
      <p className="d-lead">{"While you're away, your expert sends one photo a day with what was done and how each plant is doing."}</p>
      <ul className="d-checks">
      <li><svg className="ico" aria-hidden="true"><use href="#i-check" /></svg><span><b>Exact care, not guesswork.</b>{" “Monstera drank 240 ml” — not “watered plants”."}</span></li>
      <li><svg className="ico" aria-hidden="true"><use href="#i-check" /></svg><span><b>Health at a glance.</b>{" Water, light and health ticks on every card."}</span></li>
      <li><svg className="ico" aria-hidden="true"><use href="#i-check" /></svg><span><b>Reply to your expert.</b>{" Ask a question right from the postcard."}</span></li>
      </ul>
      </>} />
      </div></section>
      <section className="d-sec"><div className="d-wrap">
      <Reveal className="d-head"><div><span className="eyebrow">Meet the experts</span><h2 className="h2">Real people who know plants.</h2></div><p className="muted">Every BloomBuddy is trained, background-verified and rated after each visit. Book the same expert every time.</p></Reveal>
      <ExpertCards />
      </div></section>
      <section className="d-sec d-sec--tint"><div className="d-wrap">
      <Reveal className="d-head"><div><span className="eyebrow">Plans</span><h2 className="h2">Simple plans. No surprise fees.</h2></div><Link href="/plans" className="d-link">{"Full comparison "}<svg className="ico" aria-hidden="true"><use href="#i-chevron" /></svg></Link></Reveal>
      <PlanCards />
      </div></section>
      <section className="d-sec"><div className="d-wrap">
      <Reveal className="d-head"><div><span className="eyebrow">Reviews</span><h2 className="h2">From balconies across India.</h2></div><div className="d-score"><b>4.8</b><div><span className="stars"><svg className="ico"><use href="#i-star" /></svg><svg className="ico"><use href="#i-star" /></svg><svg className="ico"><use href="#i-star" /></svg><svg className="ico"><use href="#i-star" /></svg><svg className="ico"><use href="#i-star" /></svg></span><div className="muted" style={{ fontSize: "13px" }}>from 1,214 verified visits</div></div></div></Reveal>
      <ReviewCards />
      </div></section>
      <section className="d-sec d-sec--tint"><div className="d-wrap">
      <TipCarouselSection />
      </div></section>
      <section className="d-sec"><div className="d-wrap d-cov">
      <Reveal as="div">
      <span className="eyebrow">Where we work</span>
      <h2 className="h2">Now across Gurgaon,<br />with 3 Plant Hotels.</h2>
      <p className="d-lead">Tap your area to check slots. South Delhi and Noida are live too; Paradeep and Dhanbad have pilot visits.</p>
      <SectorChips />
      <div className="card d-map"><svg viewBox="0 0 320 240" role="img" aria-label="Map of Gurgaon with three hub pins"><use href="#s-map" /></svg></div>
      </Reveal>
      <ContactForm />
      </div></section>
      <section className="d-sec" style={{ paddingTop: "0" }}><div className="d-wrap">
      <Reveal className="d-app">
      <div>
      <span className="eyebrow" style={{ color: "var(--pollen)" }}>Your plant dashboard</span>
      <h2 className="h2">{"Daily reminders. "}<em>Daily postcards.</em></h2>
      <p>Exact watering amounts for each plant, live booking tracking, and a chat with your expert — right here on bloombuddy.in, on any screen. No download, no login needed.</p>
      <div className="row"><Link href="/track" className="d-store"><svg className="ico" aria-hidden="true"><use href="#i-pin" /></svg><span><small>Open</small>Track a booking</span></Link><Link href="/care" className="d-store"><svg className="ico" aria-hidden="true"><use href="#i-camera" /></svg><span><small>Free</small>Photo diagnosis</span></Link></div>
      </div>
      <div className="shelf"><svg viewBox="0 0 120 160"><use href="#p-tulsi" /></svg><svg viewBox="0 0 120 160"><use href="#p-pothos" /></svg><svg viewBox="0 0 120 160"><use href="#p-fern" /></svg></div>
      </Reveal>
      </div></section>

    </article>
  );
}
