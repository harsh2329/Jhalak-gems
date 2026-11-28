"use client";
import { useEffect, useState } from "react";
import { products as demo, type GemProduct } from "@/lib/products";
import { ProductCard } from "./product-card";
import { wa } from "@/lib/site";
const DAY = [['Ravivar', 'Ruby'], ['Somvar', 'Pearl'], ['Mangalvar', 'Red Coral'], ['Budhvar', 'Emerald'], ['Guruvar', 'Yellow Sapphire'], ['Shukravar', 'Diamond'], ['Shanivar', 'Blue Sapphire']];
export function DailyGem() {
  const [list, setList] = useState<GemProduct[]>(demo); const [d, setD] = useState(DAY[0]);
  useEffect(() => { setD(DAY[new Date().getDay()]); fetch('/api/products').then(r => r.ok ? r.json() : null).then(x => x?.products && setList(x.products)).catch(() => {}); }, []);
  const m = list.filter(p => p.category === d[1] && p.stock > 0).slice(0, 4);
  return <section className="wrap s-sec"><h2>Aaj ka Ratna · {d[0]}</h2>
    {m.length ? <div className="s-grid">{m.map(p => <ProductCard key={p.id} product={p} />)}</div> : <p>No {d[1]} in stock today. <a className="text-link" href={wa(`Hello Jhalak Gems, please show me ${d[1]} options.`)} target="_blank" rel="noreferrer">Ask us on WhatsApp</a></p>}</section>;
}
