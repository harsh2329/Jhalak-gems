import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/admin-auth';
import { moveStock } from '@/lib/stock';
export const runtime = 'nodejs';
const body = z.object({ status: z.enum(['PENDING_PAYMENT', 'PAID', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED']) });
const out = (s: string) => s !== 'PENDING_PAYMENT' && s !== 'CANCELLED';
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const b = body.safeParse(await req.json().catch(() => null));
  if (!b.success) return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  try {
    const order = await prisma.$transaction(async tx => {
      const cur = await tx.order.findUniqueOrThrow({ where: { id }, include: { items: true } });
      // Only bills created in the admin move stock here; online orders use the checkout reservation flow.
      if ((cur.shippingAddress as any)?.source === 'ADMIN') {
        const lines = cur.items.map(i => ({ id: i.productId, q: i.quantity }));
        if (!out(cur.status) && out(b.data.status)) await moveStock(tx, lines, -1, cur.orderNumber);
        if (out(cur.status) && !out(b.data.status)) await moveStock(tx, lines, 1, cur.orderNumber);
      }
      return tx.order.update({ where: { id }, data: { status: b.data.status } });
    });
    return NextResponse.json({ order });
  } catch (e: any) { return NextResponse.json({ error: e.message || 'Update failed' }, { status: 400 }); }
}
