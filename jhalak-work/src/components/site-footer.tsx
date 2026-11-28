import Link from "next/link";
export function SiteFooter() {
  const phone = process.env.NEXT_PUBLIC_STORE_PHONE;
  return <footer className="s-foot"><div className="wrap">
    <div><b>Jhalak Gems</b><p>{process.env.NEXT_PUBLIC_STORE_CITY || 'Chandkheda, Ahmedabad'}</p>{phone && <p>{phone}</p>}</div>
    <div><b>Shop</b><Link href="/shop">All stones</Link><Link href="/shop?cert=y">Certified stones</Link><Link href="/cart">Your bag</Link></div>
    <div><b>Help</b><Link href="/certificate">Check certificate</Link><Link href="/#faq">Questions</Link><Link href="/admin">Admin</Link></div>
  </div><p className="wrap s-muted">© {new Date().getFullYear()} Jhalak Gems</p></footer>;
}
