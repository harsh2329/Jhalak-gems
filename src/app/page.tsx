import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, ShieldCheck, Sparkles, Gem } from "lucide-react";
import { FeaturedProducts } from "@/components/featured-products";

const collections = [
  { name: "Emerald", tone: "green", note: "A world of green" },
  { name: "Sapphire", tone: "blue", note: "Depth in every facet" },
  { name: "Ruby", tone: "red", note: "A rare kind of fire" },
  { name: "Amethyst", tone: "purple", note: "Quiet brilliance" }
];

export default function HomePage() {
  return <main>
    <section className="hero">
      <div className="hero-noise"/>
      <div className="hero-copy">
        <p className="eyebrow"><span/> THE ART OF NATURAL BEAUTY</p>
        <h1>Some things<br/>are simply <em>rare.</em></h1>
        <p className="hero-desc">Discover gemstones chosen for their colour, character and timeless allure.</p>
        <div className="hero-actions"><Link className="button button-gold" href="/shop">Explore collection <ArrowUpRight size={17}/></Link><a className="text-link" href="#story">Discover our story <ArrowDown size={15}/></a></div>
        <div className="hero-foot"><span>01 / CURATED GEMSTONES</span><span>CHANDKHEDA · AHMEDABAD</span></div>
      </div>
      <div className="hero-art" aria-label="Decorative gemstone illustration">
        <div className="orbit orbit-one"/><div className="orbit orbit-two"/>
        <div className="gem-scene"><div className="gem-stone"><div className="facet f1"/><div className="facet f2"/><div className="facet f3"/><div className="facet f4"/><div className="facet f5"/></div></div>
        <div className="art-caption"><span>THE EMERALD EDIT</span><b>01 — 04</b></div>
      </div>
    </section>

    <section className="trust-strip wrap">
      <div><ShieldCheck/><span><b>Thoughtfully curated</b><small>Every stone tells a story</small></span></div>
      <div><Gem/><span><b>Stone-level details</b><small>Transparent product information</small></span></div>
      <div><Sparkles/><span><b>A considered experience</b><small>Personal support when you need it</small></span></div>
    </section>

    <section className="section wrap" id="collections">
      <div className="section-heading"><div><p className="eyebrow">FIND YOUR COLOUR</p><h2>Explore the <em>collections.</em></h2></div><Link className="text-link dark-link" href="/shop">View all gemstones <ArrowUpRight size={16}/></Link></div>
      <div className="collection-grid">
        {collections.map((c, i) => <Link key={c.name} href={`/shop?category=${c.name}`} className={`collection-tile ${c.tone}`}><span className="collection-index">0{i+1}</span><div><small>{c.note}</small><h3>{c.name}</h3></div><ArrowUpRight className="collection-arrow"/></Link>)}
      </div>
    </section>

    <section className="section featured-section">
      <div className="wrap">
        <div className="section-heading"><div><p className="eyebrow">THE JHALAK SELECTION</p><h2>Pieces worth <em>discovering.</em></h2></div><Link className="text-link" href="/shop">Shop the collection <ArrowUpRight size={16}/></Link></div>
        <FeaturedProducts/>
      </div>
    </section>

    <section className="story-section" id="story">
      <div className="story-art"><div className="story-ring"/><div className="story-stone"/></div>
      <div className="story-copy"><p className="eyebrow">THE JHALAK APPROACH</p><h2>Beauty is in the<br/><em>details.</em></h2><p>We believe choosing a gemstone should feel as special as owning one. Explore each stone with clear specifications, thoughtful presentation and personal assistance from our team.</p><Link className="button button-outline" href="/shop">Discover Jhalak Gems <ArrowUpRight size={16}/></Link></div>
    </section>

    <section className="cta-section wrap" id="contact"><p className="eyebrow">LOOKING FOR SOMETHING PARTICULAR?</p><h2>Your next rare find<br/>could be <em>closer than you think.</em></h2><p>Speak with the Jhalak Gems team for product details and availability.</p><a className="button button-gold" href="https://wa.me/?text=Hello%20Jhalak%20Gems%2C%20I%20would%20like%20to%20enquire%20about%20a%20gemstone." target="_blank" rel="noreferrer">Enquire on WhatsApp <ArrowUpRight size={17}/></a></section>
    <footer className="footer"><div className="wrap footer-inner"><Link href="/" className="brand"><span className="brand-mark"><Gem size={22}/></span><span>JHALAK <i>GEMS</i></span></Link><span>CHANDKHEDA · AHMEDABAD</span><span>© {new Date().getFullYear()} Jhalak Gems</span></div></footer>
  </main>;
}
