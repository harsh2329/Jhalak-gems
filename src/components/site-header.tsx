"use client";
import Link from "next/link";
import { useState } from "react";
import { Gem, Search, ShoppingBag, Menu, X, UserRound, ChevronDown } from "lucide-react";
import { useCart } from "./cart-provider";

const nav = [
  { label: "Gemstones", href: "/shop", children: ["Emerald", "Ruby", "Sapphire", "Amethyst", "Topaz", "Tourmaline"] },
  { label: "Collections", href: "/shop" },
  { label: "New arrivals", href: "/shop?sort=new" },
  { label: "Our story", href: "/#story" },
  { label: "Contact", href: "https://wa.me/?text=Hello%20Jhalak%20Gems" }
];

export function SiteHeader() {
  const { count } = useCart();
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  return <header className="site-header jg-header">
    <div className="jg-promo">A CURATED WORLD OF GEMSTONES <span>✦</span> COMPLIMENTARY GUIDANCE FROM JHALAK GEMS</div>
    <div className="jg-utility wrap">
      <span>CHANDKHEDA · AHMEDABAD</span>
      <div><Link href="/shop">Explore gemstones</Link><a href="https://wa.me/?text=Hello%20Jhalak%20Gems">Need help? Talk to us</a></div>
    </div>
    <div className="jg-main-nav wrap">
      <button className="jg-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Close menu" : "Open menu"}>{mobileOpen ? <X/> : <Menu/>}</button>
      <Link href="/" className="jg-logo"><span className="jg-logo-icon"><Gem size={25}/></span><span>JHALAK <i>GEMS</i><small>THE GEMSTONE HOUSE</small></span></Link>
      <form className="jg-search" action="/shop">
        <Search size={18}/>
        <input name="q" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search gemstones, colour, SKU..." aria-label="Search gemstones"/>
        <button type="submit">SEARCH</button>
      </form>
      <div className="jg-header-actions">
        <Link href="/admin" aria-label="Account and store login"><UserRound size={20}/><small>ACCOUNT</small></Link>
        <Link href="/cart" className="jg-bag" aria-label={`Shopping bag, ${count} items`}><span className="jg-bag-icon"><ShoppingBag size={20}/><b>{count}</b></span><small>BAG</small></Link>
      </div>
    </div>
    <nav className={`jg-category-nav ${mobileOpen ? "is-open" : ""}`} aria-label="Main navigation">
      <div className="wrap">{nav.map(item=><div className="jg-nav-item" key={item.label}><Link href={item.href} onClick={()=>setMobileOpen(false)}>{item.label}{item.children&&<ChevronDown size={13}/>}</Link>{item.children&&<div className="jg-mega"><div><small>SHOP BY GEMSTONE</small><div className="jg-mega-grid">{item.children.map(name=><Link key={name} href={`/shop?category=${encodeURIComponent(name)}`}>{name}<span>Explore →</span></Link>)}</div></div><div className="jg-mega-note"><Gem size={25}/><b>Find your perfect stone</b><span>Browse our gemstone collection and ask us for personal assistance.</span><Link href="/shop">Shop all gemstones →</Link></div></div>}</div>)}</div>
    </nav>
  </header>;
}
