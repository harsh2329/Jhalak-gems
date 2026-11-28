"use client";
import Link from "next/link";
import { Gem, Search, ShoppingBag, Menu } from "lucide-react";
import { useCart } from "./cart-provider";

export function SiteHeader() {
  const { count } = useCart();
  return (
    <header className="site-header">
      <div className="topline">A CURATED WORLD OF GEMSTONES <span>·</span> CHANDKHEDA, AHMEDABAD</div>
      <nav className="nav wrap">
        <Link href="/" className="brand"><span className="brand-mark"><Gem size={22}/></span><span>JHALAK <i>GEMS</i></span></Link>
        <div className="nav-links"><Link href="/shop">Shop all</Link><a href="/#collections">Collections</a><a href="/#story">Our story</a><a href="/#contact">Contact</a></div>
        <div className="nav-actions"><Link aria-label="Search" href="/shop"><Search size={19}/></Link><Link className="cart-link" href="/cart"><ShoppingBag size={19}/><span>{count}</span></Link><button className="mobile-menu" aria-label="Menu"><Menu size={20}/></button></div>
      </nav>
    </header>
  );
}
