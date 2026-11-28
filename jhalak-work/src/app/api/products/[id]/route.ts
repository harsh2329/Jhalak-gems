import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/admin-auth';
import { products } from '@/lib/products';
import { mapProduct } from '@/lib/map-product';
export const runtime = 'nodejs';
const patchSchema = z.object({ name: z.string().min(2).optional(), description: z.string().min(5).optional(), colour: z.string().optional(), carat: z.number().nonnegative().optional(), shape: z.string().optional(), origin: z.string().optional(), treatment: z.string().optional(), clarity: z.string().optional(), certIssuer: z.string().optional(), certNo: z.string().optional(), certImage: z.string().optional(), price: z.number().int().positive().optional(), stock: z.number().int().nonnegative().optional(), status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional() });
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!process.env.DATABASE_URL) { const p = products.find(x => x.slug === id || x.id === id); return p ? NextResponse.json({ product: p }) : NextResponse.json({ error: 'Not found' }, { status: 404 }); }
  try {
    const p = await prisma.product.findFirst({ where: { OR: [{ id }, { slug: id }], status: 'PUBLISHED' }, include: { category: true, inventory: true, images: { orderBy: { sortOrder: 'asc' } }, certificates: true } });
    return p ? NextResponse.json({ product: mapProduct(p) }) : NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch { return NextResponse.json({ error: 'Database unavailable' }, { status: 503 }); }
}
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  const d = parsed.data;
  try {
    await prisma.$transaction(async tx => {
      await tx.product.update({ where: { id }, data: { name: d.name, description: d.description, colour: d.colour, carat: d.carat, shape: d.shape, origin: d.origin, treatment: d.treatment, clarity: d.clarity, pricePaise: d.price === undefined ? undefined : d.price * 100, status: d.status } });
      if (d.stock !== undefined) await tx.inventory.upsert({ where: { productId: id }, update: { quantity: d.stock }, create: { productId: id, quantity: d.stock, isUniqueStone: d.stock === 1 } });
      if (d.certIssuer && d.certNo) { await tx.certificate.deleteMany({ where: { productId: id } }); await tx.certificate.create({ data: { productId: id, issuer: d.certIssuer, certificateNo: d.certNo, fileUrl: d.certImage || '' } }); }
    });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: 'Stone not found or update failed' }, { status: 404 }); }
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  try { await prisma.product.update({ where: { id }, data: { status: 'ARCHIVED' } }); return NextResponse.json({ ok: true }); } catch { return NextResponse.json({ error: 'Stone not found' }, { status: 404 }); }
}
