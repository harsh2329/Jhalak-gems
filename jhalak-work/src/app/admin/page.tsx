"use client";
import { useCallback, useEffect, useState } from 'react';
import type { GemProduct } from '@/lib/products';
import { Inventory } from '@/components/admin/inventory';
import { Catalogue } from '@/components/admin/catalogue';
import { Billing } from '@/components/admin/billing';

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<'inv' | 'cat' | 'bill'>('inv');
  const [items, setItems] = useState<GemProduct[]>([]);
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [err, setErr] = useState('');
  const load = useCallback(async () => {
    const r = await fetch('/api/products?all=1');
    if (!r.ok) return;
    const d = await r.json();
    if (d.admin) { setAuthed(true); setItems(d.products); }
  }, []);
  useEffect(() => { load(); }, [load]);
  async function login(e: React.FormEvent) {
    e.preventDefault(); setErr('');
    const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    const d = await r.json();
    if (!r.ok) { setErr(d.error || 'Login failed'); return; }
    setPassword(''); load();
  }
  async function logout() { await fetch('/api/admin/logout', { method: 'POST' }); setAuthed(false); setItems([]); }
  if (!authed) return <main className="wrap s-sec" style={{ maxWidth: 480 }}><h1>Admin sign in</h1>
    <form className="s-form" onSubmit={login}><label>Email<input required type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} /></label><label>Password<input required type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} /></label>{err && <p role="alert" className="s-err">{err}</p>}<button className="button button-gold">Sign in</button></form></main>;
  const tabs: [typeof tab, string][] = [['inv', 'Inventory'], ['cat', 'Catalogue designer'], ['bill', 'Billing']];
  return <main className="wrap s-sec"><div className="s-between"><h1>Store admin</h1><button className="button button-outline" onClick={logout}>Sign out</button></div>
    <div className="s-tabs">{tabs.map(([k, n]) => <button key={k} aria-pressed={tab === k} onClick={() => setTab(k)}>{n}</button>)}</div>
    {tab === 'inv' && <Inventory items={items} reload={load} />}
    {tab === 'cat' && <Catalogue items={items} />}
    {tab === 'bill' && <Billing items={items} reload={load} />}
  </main>;
}
