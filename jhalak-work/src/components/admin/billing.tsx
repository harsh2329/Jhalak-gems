"use client";
import { useCallback, useEffect, useState } from 'react';
import type { GemProduct } from '@/lib/products';
import { inr } from '@/lib/site';

const STATUS = ['PENDING_PAYMENT', 'PAID', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const label = (s: string) => s.replace(/_/g, ' ').toLowerCase().replace(/^./, c => c.toUpperCase());

export function Billing({ items, reload }: { items: GemProduct[]; reload: () => void }) {
  const [bills, setBills] = useState<any[]>([]);
  const [cust, setCust] = useState(''); const [ph, setPh] = useState(''); const [gst, setGst] = useState('3'); const [st, setSt] = useState('PENDING_PAYMENT');
  const [lines, setLines] = useState<{ id: string; q: number }[]>([]); const [pick, setPick] = useState('');
  const [err, setErr] = useState(''); const [inv, setInv] = useState<any>(null);
  const load = useCallback(async () => { const r = await fetch('/api/admin/orders'); if (r.ok) setBills((await r.json()).orders); }, []);
  useEffect(() => { load(); }, [load]);
  const avail = items.filter(p => p.status === 'PUBLISHED' && p.stock > 0 && !lines.some(l => l.id === p.id));
  const sub = lines.reduce((a, l) => a + (items.find(p => p.id === l.id)?.price ?? 0) * l.q, 0);
  async function create() {
    const r = await fetch('/api/admin/bills', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customerName: cust, customerPhone: ph, gst: Number(gst), status: st, items: lines.map(l => ({ productId: l.id, quantity: l.q })) }) });
    const d = await r.json();
    if (!r.ok) { setErr(d.error || 'Could not create bill'); return; }
    setErr(''); setLines([]); setCust(''); setPh(''); load(); reload();
  }
  async function setStatus(id: string, status: string) {
    const r = await fetch(`/api/admin/bills/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    if (!r.ok) setErr((await r.json()).error || 'Update failed'); else { setErr(''); load(); reload(); }
  }
  return <section>
    <div className="s-form"><label>Customer<input value={cust} onChange={e => setCust(e.target.value)} /></label><label>Phone<input value={ph} onChange={e => setPh(e.target.value)} /></label><label>GST %<input type="number" value={gst} onChange={e => setGst(e.target.value)} /></label>
      <label>Bill status<select value={st} onChange={e => setSt(e.target.value)}><option value="PENDING_PAYMENT">Awaiting payment</option><option value="PAID">Paid (removes stock)</option></select></label></div>
    <div className="s-row"><select aria-label="Stone" value={pick} onChange={e => setPick(e.target.value)}><option value="">Choose a stone</option>{avail.map(p => <option key={p.id} value={p.id}>{p.name} · {inr(p.price)} · {p.stock} left</option>)}</select>
      <button className="button button-outline" onClick={() => pick && (setLines([...lines, { id: pick, q: 1 }]), setPick(''))}>Add stone</button></div>
    {lines.map(l => { const p = items.find(x => x.id === l.id)!; return <p key={l.id}>{p.name} × <input type="number" min={1} max={p.stock} style={{ width: 60 }} value={l.q} onChange={e => setLines(lines.map(x => x.id === l.id ? { ...x, q: Math.max(1, Math.min(p.stock, Number(e.target.value) || 1)) } : x))} /> = {inr(p.price * l.q)} <button onClick={() => setLines(lines.filter(x => x.id !== l.id))}>Remove</button></p>; })}
    <p><b>Total {inr(sub + sub * Number(gst) / 100)}</b> (GST {gst}%) <button className="button button-gold" onClick={create}>Create bill</button></p>
    {err && <p role="alert" className="s-err">{err}</p>}
    <div className="s-wrap"><table className="s-table"><thead><tr><th>No.</th><th>Customer</th><th>Total</th><th>Status</th><th></th></tr></thead><tbody>
      {bills.map(b => <tr key={b.id}><td>{b.orderNumber}</td><td>{b.customerName}<br /><small>{b.customerPhone}</small></td><td>{inr(b.totalPaise / 100)}</td>
        <td><select aria-label="Status" value={b.status} onChange={e => setStatus(b.id, e.target.value)}>{STATUS.map(s => <option key={s} value={s}>{label(s)}</option>)}{!STATUS.includes(b.status) && <option>{b.status}</option>}</select></td>
        <td><button onClick={() => { setInv(b); setTimeout(() => window.print(), 80); }}>Print</button></td></tr>)}
    </tbody></table></div>
    <p className="s-muted">Marking a bill Paid removes its stones from stock. Cancelling it puts them back.</p>
    {inv && <div className="s-cp s-print"><h2>Jhalak Gems · Tax invoice {inv.orderNumber}</h2><p>{process.env.NEXT_PUBLIC_STORE_CITY || 'Chandkheda, Ahmedabad'}<br />{new Date(inv.createdAt).toLocaleDateString('en-IN')} · {inv.customerName} {inv.customerPhone}</p>
      <table className="s-table"><tbody>{inv.items.map((i: any) => <tr key={i.id}><td>{i.nameSnapshot}</td><td>{i.quantity} × {inr(i.pricePaise / 100)}</td><td>{inr(i.quantity * i.pricePaise / 100)}</td></tr>)}</tbody></table>
      <p>Subtotal {inr(inv.subtotalPaise / 100)} · GST {inr(inv.taxPaise / 100)}<br /><b>Total {inr(inv.totalPaise / 100)}</b> · {label(inv.status)}</p></div>}
  </section>;
}
