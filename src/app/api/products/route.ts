import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/admin-auth';
import { products as demoProducts } from '@/lib/products';
export const runtime = 'nodejs';
const schema = z.object({ sku:z.string().min(2), name:z.string().min(2), slug:z.string().min(2), description:z.string().min(5), category:z.string().min(2), colour:z.string().optional(), carat:z.number().nonnegative(), shape:z.string().optional(), origin:z.string().optional(), treatment:z.string().optional(), certification:z.string().optional(), price:z.number().int().positive(), stock:z.number().int().nonnegative(), image:z.string().url(), model3d:z.string().optional(), featured:z.boolean().optional(), trending:z.boolean().optional() });
function mapProduct(p:any) { return { id:p.id, sku:p.sku, name:p.name, slug:p.slug, category:p.category?.name ?? 'Gemstone', colour:p.colour ?? '', carat:Number(p.carat ?? 0), shape:p.shape ?? '', origin:p.origin ?? 'Not verified', treatment:p.treatment ?? 'Not specified', certification:p.certification ?? 'Not specified', price:p.pricePaise / 100, stock:p.inventory?.quantity ?? 0, image:p.images?.[0]?.url ?? '/placeholder-gem.svg', model3d:p.model3dUrl ?? '', description:p.description, featured:p.isFeatured, trending:p.isTrending }; }
export async function GET() {
  if (!process.env.DATABASE_URL) return NextResponse.json({ products: demoProducts, mode: 'demo' });
  try { const rows = await prisma.product.findMany({ where:{status:'PUBLISHED'}, include:{category:true,inventory:true,images:{orderBy:{sortOrder:'asc'}}}, orderBy:{createdAt:'desc'} }); return NextResponse.json({ products:rows.map(mapProduct), mode:'database' }); }
  catch { return NextResponse.json({ error:'Database unavailable. Check DATABASE_URL and run migrations.' }, { status:503 }); }
}
export async function POST(req: Request) {
  if (!await isAdmin()) return NextResponse.json({error:'Unauthorized'}, {status:401});
  const parsed = schema.safeParse(await req.json().catch(()=>null));
  if (!parsed.success) return NextResponse.json({error:'Invalid product data', details:parsed.error.flatten()}, {status:400});
  try {
    const d=parsed.data;
    const row=await prisma.$transaction(async tx=>{
      const category=await tx.category.upsert({where:{slug:d.category.toLowerCase().replace(/[^a-z0-9]+/g,'-')},update:{},create:{name:d.category,slug:d.category.toLowerCase().replace(/[^a-z0-9]+/g,'-')}});
      return tx.product.create({data:{sku:d.sku,name:d.name,slug:d.slug,description:d.description,categoryId:category.id,colour:d.colour,carat:d.carat,shape:d.shape,origin:d.origin,treatment:d.treatment,certification:d.certification,pricePaise:d.price*100,status:'PUBLISHED',isFeatured:!!d.featured,isTrending:!!d.trending,model3dUrl:d.model3d,images:{create:{url:d.image,alt:d.name}},inventory:{create:{quantity:d.stock,isUniqueStone:d.stock===1}}},include:{category:true,inventory:true,images:true}});
    });
    return NextResponse.json({product:mapProduct(row)}, {status:201});
  } catch(e:any) { return NextResponse.json({error:e.code==='P2002'?'SKU or slug already exists':'Could not save product'}, {status:e.code==='P2002'?409:500}); }
}
