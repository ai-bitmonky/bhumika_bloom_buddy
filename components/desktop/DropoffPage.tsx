"use client";

import { DropWidget, HubCards, ScanTag, SuiteCards } from "./widgets";
import { Reveal } from "@/components/shared/Reveal";
import { QR } from "@/components/shared/QR";

/* Ported from the v1.0 desktop prototype (dropoff). */
export function DropoffPage() {
  return (
    <article className="d-page on">

      <section className="d-phero"><div className="d-wrap">
      <div>
      <span className="eyebrow">Smart Drop-off · The Plant Hotel</span>
      <h1 className="h1">Going away? Your plants<br /><em>check in, too.</em></h1>
      <p className="d-lead">Drop your plants at a BloomBuddy hub. They stay in a suite made for their light and humidity, and you get a postcard every day.</p>
      <DropWidget />
      </div>
      <div className="art-box" style={{ alignItems: "center", padding: "24px" }}><svg viewBox="0 0 240 160" style={{ width: "100%", height: "auto" }}><use href="#s-hub" /></svg></div>
      </div></section>
      <section className="d-sec d-sec--tint"><div className="d-wrap">
      <Reveal className="d-head"><div><span className="eyebrow">Choose a suite</span><h2 className="h2">Three rooms, three climates.</h2></div><p className="muted">Not sure? Our team sorts each plant into the right suite at check-in, free.</p></Reveal>
      <SuiteCards />
      </div></section>
      <section className="d-sec"><div className="d-wrap">
      <Reveal className="d-head"><div><span className="eyebrow">Hubs in Gurgaon</span><h2 className="h2">Three Plant Hotels near you.</h2></div><p className="muted">Live room availability for Fri 23 Oct.</p></Reveal>
      <HubCards />
      </div></section>
      <section className="d-sec d-sec--tint"><div className="d-wrap">
      <Reveal className="d-head"><div><span className="eyebrow">A stay, day by day</span><h2 className="h2">Check-in to check-out.</h2></div></Reveal>
      <Reveal className="d-tl">
      <div className="ev"><span className="dt"><svg className="ico" aria-hidden="true"><use href="#i-pin" /></svg></span><b>Check-in</b><p>Fri 23 Oct · 8:30 am. Each plant is weighed, photographed and tagged.</p><div className="polaroid" style={{ "--r": "-3deg" } as React.CSSProperties}><div className="pol-img"><svg viewBox="0 0 120 160"><use href="#p-snake" /></svg></div><div className="pol-cap"><b>Tagged #BB-0412</b></div></div></div>
      <div className="ev"><span className="dt"><svg className="ico" aria-hidden="true"><use href="#i-water" /></svg></span><b>Daily care</b><p>Watering by weight, misting in the spa suite, leaves wiped weekly.</p><div className="polaroid" style={{ "--r": "2deg" } as React.CSSProperties}><div className="pol-img"><svg viewBox="0 0 120 160"><use href="#p-fern" /></svg></div><div className="pol-cap"><b>Day 4 · misted</b></div></div></div>
      <div className="ev"><span className="dt"><svg className="ico" aria-hidden="true"><use href="#i-camera" /></svg></span><b>Plant Postcards</b><p>One photo and note every evening, on your BloomBuddy dashboard.</p><div className="polaroid" style={{ "--r": "-1deg" } as React.CSSProperties}><div className="pol-img"><svg viewBox="0 0 120 160"><use href="#p-peacelily" /></svg></div><div className="pol-cap"><b>Day 7 · new bloom!</b></div></div></div>
      <div className="ev"><span className="dt"><svg className="ico" aria-hidden="true"><use href="#i-check" /></svg></span><b>Check-out</b><p>Sun 1 Nov. Collect, or we drop them home with pick-and-drop.</p><div className="polaroid" style={{ "--r": "3deg" } as React.CSSProperties}><div className="pol-img"><svg viewBox="0 0 120 160"><use href="#p-tulsi" /></svg></div><div className="pol-cap"><b>Home, happy</b></div></div></div>
      </Reveal>
      </div></section>
      <section className="d-sec"><div className="d-wrap d-qr">
      <Reveal className="d-tag"><b>Shanti</b><small>Peace Lily · Humid Spa Suite · H-07</small><QR seed={41} className="qr" /><small>Scan me · bloombuddy.in/p/0412</small></Reveal>
      <Reveal as="div">
      <span className="eyebrow">QR pot tags</span>
      <h2 className="h2">Every plant gets an ID tag.</h2>
      <p className="d-lead">{"Scan the tag to open that plant's profile: its care plan, its suite, and every postcard from its stay."}</p>
      <ScanTag />
      </Reveal>
      </div></section>
      <section className="d-sec d-sec--tint"><div className="d-wrap">
      <Reveal className="d-head"><div><span className="eyebrow">FAQ</span><h2 className="h2">Before you check in.</h2></div></Reveal>
      <div className="d-faq">
      <details open><summary>How long can my plants stay?<svg className="ico" aria-hidden="true"><use href="#i-plus" /></svg></summary><p>From 2 nights to 60 nights. For stays over 21 nights we include a free feed and pest spray.</p></details>
      <details><summary>Can you pick them up from my home?<svg className="ico" aria-hidden="true"><use href="#i-plus" /></svg></summary><p>Yes. Our van with plant racks picks up and drops back for ₹199 both ways, within 15 km of a hub. Buddy Care+ members get 2 free trips a year.</p></details>
      <details><summary>What if my plant gets sick at the hub?<svg className="ico" aria-hidden="true"><use href="#i-plus" /></svg></summary><p>{"A plant doctor checks it the same day and treats it free. We'll message you before any big step like repotting."}</p></details>
      <details><summary>Are big plants okay?<svg className="ico" aria-hidden="true"><use href="#i-plus" /></svg></summary><p>Up to 1.8 m tall and 40 kg per pot. For bigger plants, a home visit works better.</p></details>
      </div>
      </div></section>

    </article>
  );
}
