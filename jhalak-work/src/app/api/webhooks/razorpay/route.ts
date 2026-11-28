import { NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { prisma } from '@/lib/prisma';
export const runtime='nodejs';
export async function POST(request:Request){
 const secret=process.env.RAZORPAY_WEBHOOK_SECRET;if(!secret||!process.env.DATABASE_URL)return NextResponse.json({error:'Webhook not configured'},{status:503});
 const body=await request.text();const signature=request.headers.get('x-razorpay-signature');if(!signature)return NextResponse.json({error:'Missing signature'},{status:400});
 const expected=createHmac('sha256',secret).update(body).digest('hex');const a=Buffer.from(expected);const b=Buffer.from(signature);if(a.length!==b.length||!timingSafeEqual(a,b))return NextResponse.json({error:'Invalid signature'},{status:400});
 try{const event=JSON.parse(body);const entity=event.payload?.payment?.entity;const gatewayOrderId=entity?.order_id;if(!gatewayOrderId)return NextResponse.json({received:true,ignored:true});
  await prisma.$transaction(async tx=>{const payment=await tx.payment.findUnique({where:{providerOrderId:gatewayOrderId},include:{order:{include:{items:true}}}});if(!payment)return;
   if(event.event==='payment.captured'||event.event==='order.paid'){const changed=await tx.payment.updateMany({where:{id:payment.id,status:'CREATED'},data:{status:'CAPTURED',providerPaymentId:entity?.id??undefined,signatureVerified:true,rawEvent:event}});if(changed.count===1){await tx.order.update({where:{id:payment.orderId},data:{status:'PAID',reservationExpiresAt:null}});for(const item of payment.order.items)await tx.inventory.update({where:{productId:item.productId},data:{quantity:{decrement:item.quantity},reserved:{decrement:item.quantity}}});}}
   else if(event.event==='payment.failed'){if(payment.status==='FAILED'||payment.status==='CAPTURED')return;await tx.payment.update({where:{id:payment.id},data:{status:'FAILED',providerPaymentId:entity?.id??undefined,signatureVerified:true,rawEvent:event}});await tx.order.update({where:{id:payment.orderId},data:{status:'CANCELLED',reservationExpiresAt:null}});for(const item of payment.order.items)await tx.inventory.update({where:{productId:item.productId},data:{reserved:{decrement:item.quantity}}});}
  });return NextResponse.json({received:true,processed:true});
 }catch{return NextResponse.json({error:'Webhook processing failed'},{status:500});}
}
