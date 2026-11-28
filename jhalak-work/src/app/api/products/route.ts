import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/admin-auth';
import { products as demo } from '@/lib/products';
import { mapProduct } from '@/lib/map-product';
export const runtime = 'nodejs';
const img = z.string().refine(s => /^https?:\/\//.test(s) || s.startsWith('data:image/'), 'Invalid image');
const schema = z.object({ sku: z.string().min(2), name: z.string().min(2), slug: z.string().min(2), description: z.string().min(5), category: z.string().min(2), colour: z.string().optional(), carat: z.number().nonnegative(), shape: z.string().optional(), origin: z.string().optional(), treatment: z.string().optional(), clarity: z.string().optional(), certIssuer: z.string().optional(), certNo: z.string().optional(), certImage: z.string().optional(), price: z.number().int().positive(), stock: z.number().int().nonnegative(), image: img.optional(), status: z.enum(['DRAFT', 'PUBLISHED']).optional(), featured: z.boolean().optional() });
const inc = { category: true, inventory: true, images: { orderBy: { sortOrder: 'asc' as const } }, certificates: true };
export async function GET(req: Request) {
  const admin = new URL(req.url).searchParams.get('all') ? await isAdmin() : false;
  if (!process.env.DATABASE_URL) return NextResponse.json({ products: demo, mode: 'demo', admin });
  try {
    const rows = await prisma.product.findMany({ where: admin ? { status: { not: 'ARCHIVED' } } : { status: 'PUBLISHED' }, include: inc, orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ products: rows.map(mapProduct), mode: 'database', admin });
  } catch { return NextResponse.json({ error: 'Database unavailable. Check DATABASE_URL and run migrations.' }, { status: 503 }); }
}
export async function POST(req: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid stone data. Check name, SKU, price and carat.' }, { status: 400 });
  const d = parsed.data; const cs = d.category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  try {
    const row = await prisma.$transaction(async tx => {
      const category = await tx.category.upsert({ where: { slug: cs }, update: {}, create: { name: d.category, slug: cs } });
      return tx.product.create({ data: { sku: d.sku, name: d.name, slug: d.slug, description: d.description, categoryId: category.id, colour: d.colour, carat: d.carat, shape: d.shape, origin: d.origin, treatment: d.treatment, clarity: d.clarity, pricePaise: d.price * 100, status: d.status ?? 'PUBLISHED', isFeatured: !!d.featured,
        ...(d.image ? { images: { create: { url: d.image, alt: d.name } } } : {}),
        ...(d.certIssuer && d.certNo ? { certificates: { create: { issuer: d.certIssuer, certificateNo: d.certNo, fileUrl: d.certImage || '' } } } : {}),
        inventory: { create: { quantity: d.stock, isUniqueStone: d.stock === 1 } } }, include: inc });
    });
    return NextResponse.json({ product: mapProduct(row) }, { status: 201 });
  } catch (e: any) { return NextResponse.json({ error: e.code === 'P2002' ? 'SKU or slug already exists' : 'Could not save stone' }, { status: e.code === 'P2002' ? 409 : 500 }); }
}
