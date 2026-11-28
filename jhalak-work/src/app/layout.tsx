import type { Metadata } from "next";
import "./globals.css";
import "./store.css";
import { CartProvider } from "@/components/cart-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Jhalak Gems | Certified gemstones, Ahmedabad",
  description: "Natural gemstones with laboratory reports from Jhalak Gems, Chandkheda, Ahmedabad.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><CartProvider><SiteHeader />{children}<SiteFooter /></CartProvider></body></html>;
}
