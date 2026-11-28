import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgeCheck, Gem, Headphones, PackageCheck, ShieldCheck } from "lucide-react";
import { FeaturedProducts } from "@/components/featured-products";

const stones = [
  { name: "Emerald", detail: "Rich greens, timeless character", tone: "emerald", href: "/shop?category=Emerald" },
  { name: "Blue Sapphire", detail: "A classic in every collection", tone: "sapphire", href: "/shop?category=Sapphire" },
  { name: "Ruby", detail: "Bold colour, unmistakable presence", tone: "ruby", href: "/shop?category=Ruby" },
  { name: "Amethyst", detail: "Violet tones with quiet elegance", tone: "amethyst", href: "/shop?category=Amethyst" }
];

const assurances = [
  { icon: ShieldCheck, title: "Transparent details", copy: "Clear stone specifications" },
  { icon: BadgeCheck, title: "Certificate guidance", copy: "Ask us about lab reports" },
  { icon: PackageCheck, title: "Careful dispatch", copy: "Packed with attention" },
  { icon: Headphones, title: "Personal assistance", copy: "Talk to our gemstone team" }
];

export default function HomePage() {
  return <main className="jg-storefront">
    <section className="jg-hero">
      <div className="jg-hero-copy">
        <p className="jg-kicker"><span/> THE JHALAK GEMS COLLECTION</p>
        <h1>Find the stone<br/>that feels <em>like yours.</em></h1>
        <p className="jg-hero-description">Explore colour, character and craftsmanship in a considered collection of gemstones.</p>
        <div className="jg-hero-actions">
          <Link className="jg-primary" href="/shop">Explore gemstones <ArrowUpRight size={17}/></Link>
          <Link className="jg-secondary" href="/shop">Browse all stones <ArrowRight size={16}/></Link>
        </div>
        <div className="jg-hero-meta"><span>CURATED WITH CARE</span><span>AHMEDABAD · INDIA</span></div>
      </div>
      <div className="jg-hero-visual">
        <img src="https://c.pxhere.com/photos/64/5a/photo-576865.jpg!d" alt="Emerald gemstone macro photograph" />
        <div className="jg-image-caption"><span>THE BEAUTY OF EVERY FACET</span><b>JHALAK GEMS</b></div>
        <div className="jg-floating-note"><Gem size={17}/><span>Discover something<br/><b>exceptional.</b></span></div>
      </div>
    </section>

    <section className="jg-assurances wrap" aria-label="Store benefits">
      {assurances.map(({icon:Icon,title,copy}) => <div className="jg-assurance" key={title}><Icon size={21}/><span><b>{title}</b><small>{copy}</small></span></div>)}
    </section>

    <section className="jg-section wrap">
      <div className="jg-section-heading"><div><p className="jg-kicker">SHOP BY GEMSTONE</p><h2>A colour for every <em>story.</em></h2><p>Start with the gemstone you love.</p></div><Link href="/shop" className="jg-text-link">View all gemstones <ArrowUpRight size={16}/></Link></div>
      <div className="jg-stone-grid">
        {stones.map((stone,index)=><Link href={stone.href} key={stone.name} className={`jg-stone-tile ${stone.tone}`}><span className="jg-stone-number">0{index+1}</span><div><small>{stone.detail}</small><h3>{stone.name}</h3><span className="jg-tile-link">Explore collection <ArrowUpRight size={15}/></span></div><div className="jg-crystal" aria-hidden="true"/></Link>)}
      </div>
    </section>

    <section className="jg-featured">
      <div className="wrap">
        <div className="jg-section-heading"><div><p className="jg-kicker">HANDPICKED FOR YOU</p><h2>Discover the <em>collection.</em></h2><p>Explore the latest stones available in our catalogue.</p></div><Link href="/shop" className="jg-text-link">Shop all <ArrowUpRight size={16}/></Link></div>
        <FeaturedProducts/>
        <div className="jg-center"><Link className="jg-outline" href="/shop">Explore the full collection <ArrowRight size={16}/></Link></div>
      </div>
    </section>

    <section className="jg-story">
      <div className="jg-story-visual"><div className="jg-story-gem"/><span>EVERY STONE HAS ITS OWN CHARACTER</span></div>
      <div className="jg-story-copy"><p className="jg-kicker">THE JHALAK APPROACH</p><h2>Choose with<br/><em>confidence.</em></h2><p>Buying a gemstone is personal. We want every detail to feel clear—from the stone's colour and cut to its weight, treatment and available certificate information.</p><p>Need help choosing? Speak with our team and ask for additional photographs, videos and verified product details before you buy.</p><a className="jg-primary" href="https://wa.me/?text=Hello%20Jhalak%20Gems%2C%20I%20need%20help%20choosing%20a%20gemstone." target="_blank" rel="noreferrer">Talk to our team <ArrowUpRight size={17}/></a></div>
    </section>

    <section className="jg-help wrap"><div><p className="jg-kicker">NOT SURE WHERE TO START?</p><h2>Let us help you find<br/>your <em>perfect gemstone.</em></h2><p>Tell us what you are looking for. Our team can help you explore suitable options and share more details.</p></div><a className="jg-primary" href="https://wa.me/?text=Hello%20Jhalak%20Gems%2C%20please%20help%20me%20find%20a%20gemstone." target="_blank" rel="noreferrer">Get personal assistance <ArrowUpRight size={17}/></a></section>

    <section className="jg-faq wrap" id="faq"><div><p className="jg-kicker">GOOD TO KNOW</p><h2>Before you <em>choose.</em></h2></div><div className="jg-faq-list"><details><summary>Can I ask for more photos or a video? <span>+</span></summary><p>Yes. Contact our team to request additional photographs, a short video and current availability for a specific stone.</p></details><details><summary>Are gemstone certificates available? <span>+</span></summary><p>Certificate availability depends on the individual product. Please check the product details or contact us before placing an order.</p></details><details><summary>How do I confirm the stone details? <span>+</span></summary><p>Review the product specifications and ask our team to confirm the physical stone's details and supporting report before purchase.</p></details></div></section>

    <footer className="jg-footer"><div className="wrap jg-footer-inner"><Link href="/" className="jg-wordmark">JHALAK <i>GEMS</i></Link><div><Link href="/shop">Shop gemstones</Link><Link href="/cart">Shopping bag</Link><Link href="/admin">Store admin</Link></div><span>© {new Date().getFullYear()} Jhalak Gems · Chandkheda, Ahmedabad</span></div></footer>
  </main>;
}
