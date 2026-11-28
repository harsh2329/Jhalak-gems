import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/admin-auth';
import { moveStock } from '@/lib/stock';
export const runtime = 'nodejs';
const schema = z.object({ customerName: z.string().min(2), customerPhone: z.string().min(5), gst: z.number().min(0).max(28), status: z.enum(['PENDING_PAYMENT', 'PAID']), items: z.array(z.object({ productId: z.string(), quantity: z.number().int().positive() })).min(1) });
export async function POST(req: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Add a customer name, phone and at least one stone.' }, { status: 400 });
  const d = parsed.data;
  try {
    const order = await prisma.$transaction(async tx => {
      const prods = await tx.product.findMany({ where: { id: { in: d.items.map(i => i.productId) } } });
      if (prods.length !== d.items.length) throw new Error('Unknown stone in bill');
      const lines = d.items.map(i => ({ p: prods.find(x => x.id === i.productId)!, q: i.quantity }));
      const sub = lines.reduce((a, l) => a + l.p.pricePaise * l.q, 0); const tax = Math.round(sub * d.gst / 100);
      const n = await tx.order.count();
      const o = await tx.order.create({ data: { orderNumber: 'JG-' + String(n + 1).padStart(4, '0'), status: d.status, subtotalPaise: sub, taxPaise: tax, totalPaise: sub + tax, customerName: d.customerName, customerPhone: d.customerPhone, shippingAddress: { source: 'ADMIN', gst: d.gst },
        items: { create: lines.map(l => ({ productId: l.p.id, skuSnapshot: l.p.sku, nameSnapshot: l.p.name, pricePaise: l.p.pricePaise, quantity: l.q, attributesSnapshot: {} })) } }, include: { items: true, payments: true } });
      if (d.status === 'PAID') await moveStock(tx, lines.map(l => ({ id: l.p.id, q: l.q })), -1, o.orderNumber);
      return o;
    });
    return NextResponse.json({ order });
  } catch (e: any) { return NextResponse.json({ error: e.message || 'Could not create bill' }, { status: 400 }); }
}
