import Link from "next/link";
import { ToastBtn } from "./widgets";

export function Footer() {
  return (
    <footer className="d-foot"><div className="d-wrap">
    <div className="cols">
    <div><div className="logo"><svg viewBox="0 0 196 72"><use href="#i-logo-full" /></svg></div><p style={{ maxWidth: "300px", margin: "14px 0 0" }}>{"Professional in-home plant care and smart drop-offs, for plant lovers even when they're away."}</p><div className="soc"><ToastBtn msg="Opening Instagram · @bloombuddy.in" ico="i-chat" >IG</ToastBtn><ToastBtn msg="Opening YouTube · @bloombuddy.in" ico="i-chat" >YT</ToastBtn><ToastBtn msg="Opening LinkedIn · @bloombuddy.in" ico="i-chat" >in</ToastBtn><ToastBtn msg="Opening WhatsApp · @bloombuddy.in" ico="i-chat" >WA</ToastBtn></div></div>
    <div><h4>Company</h4><Link href="/#howRow">How it works</Link><Link href="/#expertCards">Our experts</Link><Link href="/visits#vReport">Guarantee</Link><ToastBtn msg="We are hiring 14 plant experts in NCR · careers@bloombuddy.in" ico="i-user" >Careers · Become a Bloom Buddy</ToastBtn></div>
    <div><h4>Services</h4><Link href="/visits">Home Visits</Link><Link href="/dropoff">Hub locations</Link><Link href="/plans">Plans & Pricing</Link><Link href="/business">For Business</Link></div>
    <div><h4>Help</h4><Link href="/visits#faqV">FAQ</Link><Link href="/#contactForm">Contact · reply in 1 day</Link><Link href="/care">Plant Care tips</Link><ToastBtn msg="Opening Support chat · @bloombuddy.in" ico="i-chat" >hello@bloombuddy.in</ToastBtn></div>
    </div>
    <div className="bot"><span>© 2026 BloomBuddy · Made with care in Gurgaon</span><span>Privacy · Terms · GSTIN 06AAXCB2026R1Z5</span></div>
    </div></footer>
  );
}
