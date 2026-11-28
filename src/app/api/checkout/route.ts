import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
export const runtime='nodejs';
const checkoutSchema=z.object({items:z.array(z.object({productId:z.string().min(1),quantity:z.number().int().positive().max(10)})).min(1).max(20),customer:z.object({name:z.string().min(2),phone:z.string().regex(/^[6-9]\d{9}$/),email:z.string().email().optional().or(z.literal('')),address:z.string().min(8),city:z.string().min(2),state:z.string().min(2),pincode:z.string().regex(/^\d{6}$/)})});
export async function POST(request:Request){
 if(!process.env.DATABASE_URL||!process.env.RAZORPAY_KEY_ID||!process.env.RAZORPAY_KEY_SECRET)return NextResponse.json({error:'Online checkout is not configured. Ask the store to complete payment setup.'},{status:503});
 const parsed=checkoutSchema.safeParse(await request.json().catch(()=>null)); if(!parsed.success)return NextResponse.json({error:'Please check your delivery details.',details:parsed.error.flatten()},{status:400});
 const {items,customer}=parsed.data; const grouped=new Map<string,number>(); for(const i of items)grouped.set(i.productId,(grouped.get(i.productId)||0)+i.quantity);
 let order:any;
 try{
  order=await prisma.$transaction(async tx=>{
   const ids=[...grouped.keys()]; const products=await tx.product.findMany({where:{id:{in:ids},status:'PUBLISHED'},include:{inventory:true,category:true}});
   if(products.length!==ids.length)throw new Error('One or more products are no longer available.');
   let subtotal=0;
   for(const p of products){const qty=grouped.get(p.id)!;if(!p.inventory||p.inventory.quantity-p.inventory.reserved<qty)throw new Error(`${p.name} is out of stock.`);const changed=await tx.$executeRaw`UPDATE \"Inventory\" SET \"reserved\" = \"reserved\" + ${qty} WHERE \"productId\" = ${p.id} AND \"quantity\" - \"reserved\" >= ${qty}`;if(changed!==1)throw new Error(`${p.name} is no longer available.`);subtotal+=p.pricePaise*qty;}
   const number=`JG${Date.now().toString().slice(-8)}${Math.floor(Math.random()*90+10)}`;
   return tx.order.create({data:{orderNumber:number,status:'PENDING_PAYMENT',subtotalPaise:subtotal,totalPaise:subtotal,customerName:customer.name,customerEmail:customer.email||null,customerPhone:customer.phone,shippingAddress:customer,reservationExpiresAt:new Date(Date.now()+15*60*1000),items:{create:products.map(p=>({productId:p.id,skuSnapshot:p.sku,nameSnapshot:p.name,pricePaise:p.pricePaise,quantity:grouped.get(p.id)!,attributesSnapshot:{category:p.category.name,colour:p.colour,carat:p.carat?.toString()??'',shape:p.shape??''}}))}}});
  });
 }catch(e:any){return NextResponse.json({error:e.message||'Unable to reserve products.'},{status:409});}
 try{
  const auth=Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64');
  const response=await fetch('https://api.razorpay.com/v1/orders',{method:'POST',headers:{Authorization:`Basic ${auth}`,'Content-Type':'application/json'},body:JSON.stringify({amount:order.totalPaise,currency:'INR',receipt:order.orderNumber,notes:{orderId:order.id}})});
  const gateway=await response.json(); if(!response.ok)throw new Error(gateway.error?.description||'Payment provider rejected the order.');
  await prisma.payment.create({data:{orderId:order.id,providerOrderId:gateway.id,amountPaise:order.totalPaise,status:'CREATED'}});
  return NextResponse.json({orderId:order.id,orderNumber:order.orderNumber,razorpayOrderId:gateway.id,amount:order.totalPaise,currency:'INR',keyId:process.env.RAZORPAY_KEY_ID});
 }catch(e:any){await prisma.$transaction(async tx=>{await tx.order.update({where:{id:order.id},data:{status:'CANCELLED'}});for(const item of items)await tx.inventory.updateMany({where:{productId:item.productId},data:{reserved:{decrement:item.quantity}}});});return NextResponse.json({error:e.message||'Could not initialize payment.'},{status:502});}
}
