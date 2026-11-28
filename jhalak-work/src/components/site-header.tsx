"use client";
import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "./cart-provider";
import { MENU } from "@/lib/nav";
import { wa } from "@/lib/site";

export function SiteHeader() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const phone = process.env.NEXT_PUBLIC_STORE_PHONE;
  return <header className="s-head">
    <div className="s-bar">Lab report with every stone · Insured delivery across India</div>
    <div className="s-util wrap"><Link href="/certificate">Check certificate</Link><a href={wa('Hello Jhalak Gems, I need help choosing a stone.')} target="_blank" rel="noreferrer">WhatsApp</a>{phone && <a href={`tel:${phone}`}>{phone}</a>}</div>
    <nav className="s-nav wrap" aria-label="Main">
      <Link href="/" className="s-brand">Jhalak <i>Gems</i></Link>
      <ul className={open ? 's-menu open' : 's-menu'}>
        {MENU.map(m => <li key={m.label}><button type="button" className="s-top">{m.label}</button>
          <div className="s-mega">{m.cols.map(c => <div key={c.h}><h4>{c.h}</h4>{c.links.map(([t, href]) => <Link key={t} href={href} onClick={() => setOpen(false)}>{t}</Link>)}</div>)}</div></li>)}
        <li><Link className="s-top" href="/shop" onClick={() => setOpen(false)}>All stones</Link></li>
      </ul>
      <div className="s-acts"><Link className="s-bag" href="/cart" aria-label="Bag"><ShoppingBag size={20} /><span>{count}</span></Link><button className="s-burger" aria-label="Menu" onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button></div>
    </nav>
  </header>;
}
