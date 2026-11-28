"use client";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { Trash2, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, remove, total } = useCart();
  return <main className="cart-page wrap"><p className="eyebrow">YOUR SELECTION</p><h1>Your <em>bag.</em></h1>
    {!items.length ? <div className="empty-state"><h3>Your bag is waiting</h3><p>Discover a gemstone that speaks to you.</p><Link className="button button-gold" href="/shop">Explore gemstones</Link></div> :
    <div className="cart-layout"><div className="cart-lines">{items.map(({product})=><div className="cart-line" key={product.id}><img src={product.image} alt={product.name}/><div><small>{product.sku}</small><h3>{product.name}</h3><b>₹{product.price.toLocaleString("en-IN")}</b></div><button onClick={()=>remove(product.id)} aria-label="Remove"><Trash2 size={17}/></button></div>)}</div><aside className="cart-summary"><h3>Order summary</h3><div><span>Subtotal</span><b>₹{total.toLocaleString("en-IN")}</b></div><div><span>Shipping</span><span>Calculated after address</span></div><hr/><div className="summary-total"><span>Total</span><b>₹{total.toLocaleString("en-IN")}</b></div><Link className="button button-gold full-button" href="/checkout">Continue to checkout <ArrowRight size={16}/></Link><p>Demo cart only. Live order placement is not enabled.</p></aside></div>}
  </main>;
}
