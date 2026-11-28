"use client";
import { useState } from "react";
import { NAVRATNA } from "@/lib/nav";
import { wa } from "@/lib/site";
export function ExpertForm() {
  const [stone, setStone] = useState(NAVRATNA[0]); const [budget, setBudget] = useState('Under ₹10,000');
  return <section className="s-exp"><div className="wrap"><h2>Your stone. Chosen with care.</h2><p>Tell us the stone and your budget. We reply on WhatsApp with matching pieces, reports and video.</p>
    <div className="s-row"><select aria-label="Stone" value={stone} onChange={e => setStone(e.target.value)}>{NAVRATNA.map(n => <option key={n}>{n}</option>)}<option>Not sure, please guide me</option></select>
      <select aria-label="Budget" value={budget} onChange={e => setBudget(e.target.value)}>{['Under ₹10,000', '₹10,000 to ₹50,000', '₹50,000 to ₹1 lakh', 'Above ₹1 lakh'].map(b => <option key={b}>{b}</option>)}</select>
      <a className="button button-gold" target="_blank" rel="noreferrer" href={wa(`Hello Jhalak Gems, I am looking for ${stone}. Budget: ${budget}.`)}>Get my shortlist on WhatsApp</a></div></div></section>;
}
