import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/admin-auth';
export const runtime='nodejs';
export async function GET(){if(!await isAdmin())return NextResponse.json({error:'Unauthorized'},{status:401});try{const orders=await prisma.order.findMany({include:{items:true,payments:true},orderBy:{createdAt:'desc'},take:100});return NextResponse.json({orders});}catch{return NextResponse.json({error:'Database unavailable'},{status:503});}}
