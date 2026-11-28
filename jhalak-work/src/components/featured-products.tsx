"use client";
import { useEffect,useState } from 'react';
import { products as demoProducts,type GemProduct } from '@/lib/products';
import { ProductCard } from '@/components/product-card';
export function FeaturedProducts(){const [items,setItems]=useState<GemProduct[]>(demoProducts.slice(0,4));useEffect(()=>{fetch('/api/products').then(async r=>{if(!r.ok)return;const d=await r.json();if(d.products?.length)setItems(d.products.filter((p:GemProduct)=>p.featured).slice(0,4).length?d.products.filter((p:GemProduct)=>p.featured).slice(0,4):d.products.slice(0,4));}).catch(()=>{});},[]);return <div className="product-grid">{items.map(p=><ProductCard key={p.id} product={p}/>)}</div>;}
