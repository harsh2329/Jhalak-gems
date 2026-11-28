import type { Prisma } from '@prisma/client';
export async function moveStock(tx: Prisma.TransactionClient, lines: { id: string; q: number }[], dir: 1 | -1, ref: string) {
  for (const l of lines) {
    const inv = await tx.inventory.findUnique({ where: { productId: l.id } });
    if (!inv || (dir < 0 && inv.quantity < l.q)) throw new Error('Not enough stock for one of the stones');
    await tx.inventory.update({ where: { id: inv.id }, data: { quantity: { increment: dir * l.q } } });
    await tx.inventoryLog.create({ data: { inventoryId: inv.id, type: dir < 0 ? 'SALE' : 'RETURN', quantity: l.q, reason: `Bill ${ref}` } });
  }
}
