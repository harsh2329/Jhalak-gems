import Link from "next/link";
import { FeaturedProducts } from "@/components/featured-products";
import { DailyGem } from "@/components/daily-gem";
import { ExpertForm } from "@/components/expert-form";
import { NAVRATNA } from "@/lib/nav";

const faqs = [
  ['Are the stones genuine and certified?', 'Each stone lists its laboratory, report number and treatment. Use “Check certificate” to look up a report number.'],
  ['How do I pay?', 'Place an order request. We confirm availability and share payment details by phone.'],
  ['Can I return a stone?', 'Return terms are shared when we confirm your order.']
];
export default function HomePage() {
  return <main>
    <section className="s-hero"><div className="wrap"><h1>Natural gemstones.<br />Proof in your hands.</h1><p>Every stone is listed with its carat, origin, treatment and laboratory report.</p><div className="s-row"><Link className="button button-gold" href="/shop">Shop all stones</Link><Link className="button button-outline" href="/certificate">Check a report number</Link></div></div></section>
    <div className="s-trust wrap"><span>Lab report with every stone</span><span>Verify reports online</span><span>Insured delivery</span><span>Talk to a gem expert</span></div>
    <section className="wrap s-sec"><div className="s-between"><h2>Bestsellers</h2><Link className="text-link" href="/shop">Shop all</Link></div><FeaturedProducts /></section>
    <section className="wrap s-sec"><h2>Shop by stone</h2><div className="s-tiles">{NAVRATNA.map(n => <Link key={n} href={`/shop?category=${encodeURIComponent(n)}`}>{n}</Link>)}</div></section>
    <ExpertForm />
    <DailyGem />
    <section className="wrap s-sec" id="faq"><h2>Your questions, answered</h2>{faqs.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>
  </main>;
}
