"use client";
import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { products as demo, type GemProduct } from '@/lib/products';
import { useCart } from '@/components/cart-provider';
import { GemImage } from '@/components/gem-image';
import { isCertified } from '@/components/gem-filters';
import { inr, wa } from '@/lib/site';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [p, setP] = useState<GemProduct | undefined>(() => demo.find(x => x.slug === slug));
  const [loaded, setLoaded] = useState(false);
  const { add } = useCart();
  useEffect(() => {
    let on = true;
    fetch(`/api/products/${encodeURIComponent(slug)}`).then(async r => { if (!r.ok) throw new Error(); const d = await r.json(); if (on) setP(d.product); }).catch(() => {}).finally(() => on && setLoaded(true));
    return () => { on = false; };
  }, [slug]);
  if (!p && loaded) return notFound();
  if (!p) return <main className="wrap s-sec"><p>Loading…</p></main>;
  const rows: [string, string][] = [['SKU', p.sku], ['Stone', p.category], ['Colour', p.colour], ['Weight', `${p.carat} ct (about ${(p.carat / 0.91).toFixed(2)} ratti)`], ['Shape', p.shape], ['Origin', p.origin], ['Treatment', p.treatment], ['Clarity', p.clarity]];
  return <main className="wrap s-sec"><Link href="/shop" className="text-link">← All stones</Link>
    <div className="s-detail"><div className="s-gi big"><GemImage p={p} /></div>
      <div><small>{p.category} · {p.sku}</small><h1>{p.name}</h1><p className="s-price">{inr(p.price)} <span className="s-muted">+ 3% GST</span></p><p>{p.description}</p>
        <p>{p.stock > 0 ? `In stock (${p.stock})` : 'Sold'}</p>
        <div className="s-row"><button className="button button-gold" disabled={p.stock < 1} onClick={() => add(p)}>Add to bag</button><a className="button button-outline" target="_blank" rel="noreferrer" href={wa(`Hello Jhalak Gems, I am interested in ${p.name} (${p.sku}). Please share the report and a video.`)}>Ask on WhatsApp</a></div>
        <div className="s-cert">{isCertified(p) ? <><b>{p.certification} report {p.certificateNo}</b><Link className="text-link" href={`/certificate?no=${encodeURIComponent(p.certificateNo)}`}>Verify this report</Link></> : <b>Laboratory report pending for this stone.</b>}</div>
        <table className="s-spec"><tbody>{rows.filter(r => r[1]).map(([k, v]) => <tr key={k}><th>{k}</th><td>{v}</td></tr>)}</tbody></table></div></div></main>;
}
