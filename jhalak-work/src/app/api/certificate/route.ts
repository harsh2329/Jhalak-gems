import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { products } from '@/lib/products';
import { mapProduct } from '@/lib/map-product';
export const runtime = 'nodejs';
export async function GET(req: Request) {
  const no = (new URL(req.url).searchParams.get('no') || '').trim();
  if (no.length < 3) return NextResponse.json({ error: 'Enter a report number' }, { status: 400 });
  if (!process.env.DATABASE_URL) { const p = products.find(x => x.certificateNo && x.certificateNo.toLowerCase() === no.toLowerCase()); return p ? NextResponse.json({ product: p }) : NextResponse.json({ error: 'Not found' }, { status: 404 }); }
  try {
    const c = await prisma.certificate.findFirst({ where: { certificateNo: { equals: no, mode: 'insensitive' }, product: { status: 'PUBLISHED' } }, include: { product: { include: { category: true, inventory: true, images: true, certificates: true } } } });
    return c ? NextResponse.json({ product: mapProduct(c.product) }) : NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch { return NextResponse.json({ error: 'Database unavailable' }, { status: 503 }); }
}
