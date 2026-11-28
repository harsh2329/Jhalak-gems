"use client";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { Trash2, ArrowRight, Plus, Minus, ShieldCheck, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, remove, updateQuantity, total } = useCart();
  return <main className="cart-page wrap jg-cart-page">
    <div className="jg-breadcrumb"><Link href="/">Home</Link><span>/</span><span>Shopping bag</span></div>
    <p className="eyebrow">YOUR JHALAK SELECTION</p><h1>Your <em>shopping bag.</em></h1>
    <p className="jg-page-intro">Beautiful stones, thoughtfully chosen.</p>
    {!items.length ? <div className="empty-state jg-empty"><ShoppingBag size={36}/><h3>Your bag is waiting</h3><p>Discover a gemstone that speaks to you.</p><Link className="button button-gold" href="/shop">Explore gemstones <ArrowRight size={16}/></Link></div> :
    <div className="cart-layout jg-cart-layout">
      <div className="cart-lines"><div className="jg-cart-head"><span>PRODUCT</span><span>QUANTITY</span><span>SUBTOTAL</span></div>
        {items.map(({product,quantity})=><div className="cart-line jg-cart-line" key={product.id}>
          <Link href={`/product/${product.slug}`} className="jg-cart-thumb"><img src={product.image} alt={product.name}/></Link>
          <div className="jg-cart-product"><small>{product.category} · {product.sku}</small><Link href={`/product/${product.slug}`}><h3>{product.name}</h3></Link><b>₹{product.price.toLocaleString("en-IN")}</b><button className="jg-remove" onClick={()=>remove(product.id)}><Trash2 size={14}/> Remove</button></div>
          <div className="jg-quantity"><button aria-label="Decrease quantity" onClick={()=>updateQuantity(product.id,quantity-1)}><Minus size={13}/></button><span>{quantity}</span><button aria-label="Increase quantity" onClick={()=>updateQuantity(product.id,quantity+1)}><Plus size={13}/></button></div>
          <strong className="jg-line-total">₹{(product.price*quantity).toLocaleString("en-IN")}</strong>
        </div>)}
        <Link className="jg-continue" href="/shop">← Continue shopping</Link>
      </div>
      <aside className="cart-summary jg-summary"><p className="eyebrow">ORDER SUMMARY</p><h3>Your total</h3><div><span>Subtotal</span><b>₹{total.toLocaleString("en-IN")}</b></div><div><span>Shipping</span><span>Calculated after address</span></div><hr/><div className="summary-total"><span>Estimated total</span><b>₹{total.toLocaleString("en-IN")}</b></div><Link className="button button-gold full-button" href="/checkout">Proceed to checkout <ArrowRight size={16}/></Link><p className="jg-secure"><ShieldCheck size={15}/> Secure checkout · Razorpay</p></aside>
    </div>}
  </main>;
}
