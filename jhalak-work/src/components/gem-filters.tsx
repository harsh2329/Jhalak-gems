"use client";
import type { GemProduct } from "@/lib/products";
export type Filters = { q: string; category: string; colour: string; shape: string; treatment: string; origin: string; clarity: string; cert: string; stock: string; max: string; minCt: string; sort: string };
export const emptyFilters: Filters = { q: '', category: '', colour: '', shape: '', treatment: '', origin: '', clarity: '', cert: '', stock: '', max: '', minCt: '', sort: '' };
type K = 'category' | 'colour' | 'shape' | 'treatment' | 'origin' | 'clarity';
const KEYS: K[] = ['category', 'colour', 'shape', 'treatment', 'origin', 'clarity'];
export const isCertified = (p: GemProduct) => !!(p.certification && p.certificateNo);
export function applyFilters(list: GemProduct[], f: Filters) {
  const r = list.filter(p => (!f.q || `${p.name} ${p.sku} ${p.category}`.toLowerCase().includes(f.q.toLowerCase())) && KEYS.every(k => !f[k] || p[k] === f[k]) && (!f.max || p.price <= +f.max) && (!f.minCt || p.carat >= +f.minCt) && (!f.cert || (f.cert === 'y') === isCertified(p)) && (!f.stock || (f.stock === 'in') === (p.stock > 0)));
  const s: Record<string, (a: GemProduct, b: GemProduct) => number> = { low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price, ct: (a, b) => b.carat - a.carat };
  return s[f.sort] ? [...r].sort(s[f.sort]) : r;
}
const LABEL: Record<K, string> = { category: 'Stone', colour: 'Colour', shape: 'Shape', treatment: 'Treatment', origin: 'Origin', clarity: 'Clarity' };
export function FilterBar({ list, f, set, stock }: { list: GemProduct[]; f: Filters; set: (f: Filters) => void; stock?: boolean }) {
  const up = (k: keyof Filters, v: string) => set({ ...f, [k]: v });
  return <div className="s-filters">
    <input aria-label="Search" placeholder="Search name or SKU" value={f.q} onChange={e => up('q', e.target.value)} />
    {KEYS.map(k => <select key={k} aria-label={LABEL[k]} value={f[k]} onChange={e => up(k, e.target.value)}><option value="">{LABEL[k]}</option>{Array.from(new Set(list.map(p => p[k]).filter(Boolean))).sort().map(o => <option key={o}>{o}</option>)}</select>)}
    <select aria-label="Certificate" value={f.cert} onChange={e => up('cert', e.target.value)}><option value="">Certificate</option><option value="y">Certified</option><option value="n">Report pending</option></select>
    {stock && <select aria-label="Stock" value={f.stock} onChange={e => up('stock', e.target.value)}><option value="">Stock</option><option value="in">In stock</option><option value="out">Sold out</option></select>}
    <input aria-label="Max price" type="number" placeholder="Max price ₹" value={f.max} onChange={e => up('max', e.target.value)} />
    <input aria-label="Minimum carat" type="number" step="0.1" placeholder="Min carat" value={f.minCt} onChange={e => up('minCt', e.target.value)} />
    <select aria-label="Sort" value={f.sort} onChange={e => up('sort', e.target.value)}><option value="">Sort</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="ct">Carat: high to low</option></select>
    <button type="button" className="button button-outline" onClick={() => set(emptyFilters)}>Clear</button>
  </div>;
}
