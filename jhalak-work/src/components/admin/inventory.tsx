"use client";
import { useMemo, useState } from 'react';
import type { GemProduct } from '@/lib/products';
import { FilterBar, applyFilters, emptyFilters, isCertified, type Filters } from '@/components/gem-filters';
import { GemImage } from '@/components/gem-image';
import { fileToUrl } from '@/lib/image';
import { inr } from '@/lib/site';

const F0 = { name: '', sku: '', category: '', colour: '', carat: '', shape: '', origin: '', treatment: '', clarity: '', certIssuer: '', certNo: '', price: '', stock: '1', description: 'Verified stone details to be added.' };
type Form = typeof F0;
const FIELDS: [keyof Form, string, string][] = [['name', 'Stone name', 'text'], ['sku', 'SKU', 'text'], ['category', 'Stone type (Ruby, Emerald…)', 'text'], ['colour', 'Colour', 'text'], ['carat', 'Carat', 'number'], ['shape', 'Shape', 'text'], ['origin', 'Origin', 'text'], ['treatment', 'Treatment', 'text'], ['clarity', 'Clarity', 'text'], ['certIssuer', 'Lab (GIA, IGI, GRS…)', 'text'], ['certNo', 'Report number', 'text'], ['price', 'Price ₹', 'number'], ['stock', 'Stock', 'number']];
const slugOf = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export function Inventory({ items, reload }: { items: GemProduct[]; reload: () => void }) {
  const [f, setF] = useState<Filters>(emptyFilters);
  const [form, setForm] = useState<Form>(F0);
  const [edit, setEdit] = useState<GemProduct | null>(null);
  const [open, setOpen] = useState(false);
  const [img, setImg] = useState<File | null>(null); const [cimg, setCimg] = useState<File | null>(null);
  const [err, setErr] = useState('');
  const shown = useMemo(() => applyFilters(items, f), [items, f]);
  const call = async (url: string, method: string, body?: unknown) => {
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
    if (!r.ok) { setErr((await r.json().catch(() => ({}))).error || 'Request failed'); return false; }
    setErr(''); return true;
  };
  function startEdit(p: GemProduct | null) {
    setEdit(p); setImg(null); setCimg(null); setOpen(true);
    setForm(p ? { ...F0, name: p.name, sku: p.sku, category: p.category, colour: p.colour, carat: String(p.carat), shape: p.shape, origin: p.origin, treatment: p.treatment, clarity: p.clarity, certIssuer: p.certification, certNo: p.certificateNo, price: String(p.price), stock: String(p.stock), description: p.description } : F0);
  }
  async function save(e: React.FormEvent) {
    e.preventDefault();
    const body: Record<string, unknown> = { ...form, carat: Number(form.carat) || 0, price: Number(form.price), stock: Number(form.stock) || 0, slug: slugOf(form.name) };
    Object.keys(body).forEach(k => body[k] === '' && delete body[k]);
    if (img) body.image = await fileToUrl(img, 800);
    if (cimg) body.certImage = await fileToUrl(cimg, 1200);
    if (await (edit ? call(`/api/products/${edit.id}`, 'PATCH', body) : call('/api/products', 'POST', body))) { setOpen(false); reload(); }
  }
  async function fromPhotos(files: FileList | null) {
    if (!files) return;
    for (const file of Array.from(files)) {
      const name = file.name.replace(/\.\w+$/, '') || 'New stone'; const t = Date.now().toString(36);
      await call('/api/products', 'POST', { sku: 'JG-' + t.toUpperCase(), name, slug: slugOf(name) + '-' + t, category: 'Unsorted', description: 'Draft made from a photo. Add verified details, then publish.', carat: 0, price: 1, stock: 0, status: 'DRAFT', image: await fileToUrl(file, 800) });
    }
    reload();
  }
  const stockBy = async (p: GemProduct, d: number) => { if (await call(`/api/products/${p.id}`, 'PATCH', { stock: Math.max(0, p.stock + d) })) reload(); };
  const setStatus = async (p: GemProduct, status: string) => { if (await call(`/api/products/${p.id}`, 'PATCH', { status })) reload(); };
  return <section>
    <div className="s-row"><button className="button button-gold" onClick={() => startEdit(null)}>Add stone</button>
      <label className="button button-outline">Add from photos<input type="file" accept="image/*" multiple hidden onChange={e => fromPhotos(e.target.files)} /></label></div>
    {err && <p role="alert" className="s-err">{err}</p>}
    {open && <form className="s-form" onSubmit={save}>
      {FIELDS.map(([k, l, t]) => <label key={k}>{l}<input type={t} step="any" required={['name', 'sku', 'category', 'price'].includes(k) && !edit || (edit ? ['name', 'price'].includes(k) : false)} value={form[k]} disabled={!!edit && ['sku', 'category'].includes(k)} onChange={e => setForm({ ...form, [k]: e.target.value })} /></label>)}
      <label>Description<input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label>
      {!edit && <label>Stone photo<input type="file" accept="image/*" onChange={e => setImg(e.target.files?.[0] ?? null)} /></label>}
      <label>Certificate image<input type="file" accept="image/*" onChange={e => setCimg(e.target.files?.[0] ?? null)} /></label>
      <div className="s-row"><button className="button button-gold">Save stone</button><button type="button" className="button button-outline" onClick={() => setOpen(false)}>Cancel</button></div></form>}
    <FilterBar list={items} f={f} set={setF} stock />
    <div className="s-wrap"><table className="s-table"><thead><tr><th></th><th>Stone</th><th>Carat</th><th>Price</th><th>Stock</th><th>Report</th><th>Status</th><th></th></tr></thead><tbody>
      {shown.map(p => <tr key={p.id}><td className="s-thumb"><GemImage p={p} /></td><td>{p.name}<br /><small>{p.category} · {p.sku}</small></td><td>{p.carat}</td><td>{inr(p.price)}</td>
        <td><button onClick={() => stockBy(p, -1)} aria-label="Reduce stock">−</button> {p.stock} <button onClick={() => stockBy(p, 1)} aria-label="Increase stock">+</button></td>
        <td>{isCertified(p) ? `${p.certification} ${p.certificateNo}` : <span className="s-err">Missing</span>}</td>
        <td><select aria-label="Status" value={p.status} onChange={e => setStatus(p, e.target.value)}><option value="PUBLISHED">Listed</option><option value="DRAFT">Draft</option><option value="ARCHIVED">Archive</option></select></td>
        <td><button onClick={() => startEdit(p)}>Edit</button></td></tr>)}
    </tbody></table></div>
    <p className="s-muted">{shown.length} stones · stock value {inr(shown.reduce((a, p) => a + p.price * p.stock, 0))}</p>
  </section>;
}
