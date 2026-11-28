import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { createAdminSession } from '@/lib/admin-auth';
export const runtime = 'nodejs';
export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  const expectedEmail = process.env.ADMIN_EMAIL || '';
  const expectedPassword = process.env.ADMIN_PASSWORD || '';
  if (!expectedEmail || !expectedPassword || !process.env.ADMIN_SESSION_SECRET) return NextResponse.json({ error: 'Admin credentials are not configured on the server.' }, { status: 503 });
  const safe = (a: string, b: string) => { const x = Buffer.from(a); const y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); };
  if (typeof email !== 'string' || typeof password !== 'string' || !safe(email.toLowerCase(), expectedEmail.toLowerCase()) || !safe(password, expectedPassword)) return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  try { await createAdminSession(); return NextResponse.json({ ok: true }); }
  catch { return NextResponse.json({ error: 'Admin session secret is invalid.' }, { status: 503 }); }
}
