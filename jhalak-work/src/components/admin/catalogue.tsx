"use client";
import { useMemo, useState } from 'react';
import type { GemProduct } from '@/lib/products';
import { FilterBar, applyFilters, emptyFilters, isCertified, type Filters } from '@/components/gem-filters';
import { GemImage } from '@/components/gem-image';
import { inr } from '@/lib/site';

export function Catalogue({ items }: { items: GemProduct[] }) {
  const [f, setF] = useState<Filters>(emptyFilters);
  const [o, setO] = useState({ title: 'Jhalak Gems Collection', tag: 'Certified gemstones, Ahmedabad', lay: 'grid', price: true, cert: true });
  const shown = useMemo(() => applyFilters(items.filter(p => p.status !== 'DRAFT'), f), [items, f]);
  return <section>
    <div className="s-form"><label>Title<input value={o.title} onChange={e => setO({ ...o, title: e.target.value })} /></label><label>Tagline<input value={o.tag} onChange={e => setO({ ...o, tag: e.target.value })} /></label>
      <label>Layout<select value={o.lay} onChange={e => setO({ ...o, lay: e.target.value })}><option value="grid">Two columns</option><option value="list">List</option></select></label>
      <label><span><input type="checkbox" checked={o.price} onChange={e => setO({ ...o, price: e.target.checked })} /> Show prices</span><span><input type="checkbox" checked={o.cert} onChange={e => setO({ ...o, cert: e.target.checked })} /> Show report details</span></label></div>
    <FilterBar list={items} f={f} set={setF} stock />
    <button className="button button-gold" onClick={() => window.print()}>Print or save as PDF</button>
    <div className={`s-cp s-print ${o.lay}`} style={{ marginTop: '1rem' }}><h2>{o.title}</h2><p>{o.tag}</p>
      <div className="g">{shown.map(p => <div className="it" key={p.id}><div className="s-gi"><GemImage p={p} /></div><div><b>{p.name}</b><br />{p.category} · {p.carat} ct · {p.shape}<br />{p.origin} {p.treatment && `· ${p.treatment}`}{o.cert && <><br />{isCertified(p) ? `${p.certification} ${p.certificateNo}` : 'Report pending'}</>}{o.price && <><br /><b>{inr(p.price)}</b></>}</div></div>)}</div></div>
  </section>;
}
