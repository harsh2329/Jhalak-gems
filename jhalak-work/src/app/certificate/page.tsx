"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { GemProduct } from '@/lib/products';
import { GemImage } from '@/components/gem-image';
import { inr } from '@/lib/site';

export default function CertificatePage() {
  const [no, setNo] = useState(''); const [p, setP] = useState<GemProduct | null>(null); const [msg, setMsg] = useState('');
  async function check(v: string) {
    setP(null); setMsg('');
    const r = await fetch(`/api/certificate?no=${encodeURIComponent(v)}`);
    if (r.ok) setP((await r.json()).product); else setMsg(r.status === 404 ? 'No stone has this report number. Check the number printed on your certificate.' : 'Could not check right now. Try again.');
  }
  useEffect(() => { const n = new URLSearchParams(window.location.search).get('no'); if (n) { setNo(n); check(n); } }, []);
  return <main className="wrap s-sec"><h1>Check your report</h1><p>Enter the report number printed on your stone’s certificate.</p>
    <form className="s-row" onSubmit={e => { e.preventDefault(); check(no); }}><input aria-label="Report number" value={no} onChange={e => setNo(e.target.value)} placeholder="Report number" /><button className="button button-gold">Check</button></form>
    {msg && <p role="alert">{msg}</p>}
    {p && <div className="s-detail"><div className="s-gi"><GemImage p={p} /></div><div><h2>{p.name}</h2><p><b>{p.certification}</b> · report {p.certificateNo}</p><p>{p.category}, {p.carat} ct, {p.shape}. Origin {p.origin || '—'}. Treatment {p.treatment || '—'}. {inr(p.price)}</p><Link className="text-link" href={`/product/${p.slug}`}>View stone</Link></div></div>}</main>;
}
