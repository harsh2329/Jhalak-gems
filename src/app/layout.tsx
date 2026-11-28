import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Jhalak Gems | Discover the beauty of gemstones",
  description: "Explore a curated collection of gemstones at Jhalak Gems, Chandkheda, Ahmedabad.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><CartProvider><SiteHeader/>{children}</CartProvider></body></html>;
}
