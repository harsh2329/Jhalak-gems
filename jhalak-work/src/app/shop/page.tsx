"use client";
import { useEffect, useMemo, useState } from 'react';
import { products as demo, type GemProduct } from '@/lib/products';
import { ProductCard } from '@/components/product-card';
import { FilterBar, applyFilters, emptyFilters, type Filters } from '@/components/gem-filters';

export default function ShopPage() {
  const [list, setList] = useState<GemProduct[]>(demo);
  const [mode, setMode] = useState('demo');
  const [f, setF] = useState<Filters>(emptyFilters);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setF(x => ({ ...x, category: q.get('category') || '', max: q.get('max') || '', cert: q.get('cert') || '' }));
    fetch('/api/products').then(r => r.ok ? r.json() : null).then(d => { if (d?.products) { setList(d.products); setMode(d.mode); } }).catch(() => {});
  }, []);
  const shown = useMemo(() => applyFilters(list, f), [list, f]);
  return <main className="wrap s-sec"><h1>Gemstones</h1>
    <FilterBar list={list} f={f} set={setF} />
    <p className="s-muted">{shown.length} stones{mode === 'demo' ? ' · placeholder catalogue, add real stones in Admin' : ''}</p>
    {shown.length ? <div className="s-grid">{shown.map(p => <ProductCard key={p.id} product={p} />)}</div> : <div className="empty-state"><h3>No stones match</h3><p>Try removing a filter.</p></div>}
  </main>;
}
