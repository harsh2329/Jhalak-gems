"use client";
import Link from "next/link";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import type { GemProduct } from "@/lib/products";
import { useCart } from "./cart-provider";

export function ProductCard({ product }: { product: GemProduct }) {
  const { add } = useCart();
  return (
    <article className="product-card">
      <Link href={`/product/${product.slug}`} className="product-image">
        <img src={product.image} alt={`${product.name} gemstone`} />
        {product.trending && <span className="product-tag">TRENDING</span>}
        <span className="image-arrow"><ArrowUpRight size={17}/></span>
      </Link>
      <div className="product-meta"><span>{product.category}</span><span>{product.carat.toFixed(2)} CT</span></div>
      <div className="product-title-row"><Link href={`/product/${product.slug}`}><h3>{product.name}</h3></Link><button aria-label="Add to cart" onClick={() => add(product)}><ShoppingBag size={17}/></button></div>
      <div className="product-bottom"><strong>₹{product.price.toLocaleString("en-IN")}</strong><span>{product.stock > 0 ? "Available" : "Sold"}</span></div>
    </article>
  );
}
