import type { GemProduct } from './products';
export function mapProduct(p: any): GemProduct {
  const c = p.certificates?.[0];
  return { id: p.id, sku: p.sku, name: p.name, slug: p.slug, category: p.category?.name ?? 'Gemstone', colour: p.colour ?? '', carat: Number(p.carat ?? 0), shape: p.shape ?? '', origin: p.origin ?? '', treatment: p.treatment ?? '', clarity: p.clarity ?? '', certification: c?.issuer ?? '', certificateNo: c?.certificateNo ?? '', price: p.pricePaise / 100, stock: p.inventory?.quantity ?? 0, image: p.images?.[0]?.url ?? '', description: p.description, featured: p.isFeatured, trending: p.isTrending, status: p.status };
}
