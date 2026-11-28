"use client";
import Link from "next/link";
import type { GemProduct } from "@/lib/products";
import { useCart } from "./cart-provider";
import { GemImage } from "./gem-image";
import { isCertified } from "./gem-filters";
import { inr } from "@/lib/site";

export function ProductCard({ product: p }: { product: GemProduct }) {
  const { add } = useCart();
  return <article className="s-card">
    <Link href={`/product/${p.slug}`} className="s-gi"><GemImage p={p} />{isCertified(p) && <span className="s-chip">Certified</span>}</Link>
    <small>{p.category} · {p.carat.toFixed(2)} ct</small>
    <Link href={`/product/${p.slug}`}><h3>{p.name}</h3></Link>
    <div className="s-row"><b>{inr(p.price)}</b>{p.stock > 0 ? <button className="button button-outline" onClick={() => add(p)}>Add to bag</button> : <span>Sold</span>}</div>
  </article>;
}
