import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SideCart } from "@/components/cart";
import { Navbar, Footer, InventoryBar } from "@/components/layout";

// Self-hosted Lora font (GDPR-compliant, faster)
const lora = Lora({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lora',
  adjustFontFallback: true, // Prevent layout shift during font load
});

export const metadata: Metadata = {
  title: "Olivadis - Premium Bio-Olivenöl",
  description: "Entdecken Sie Premium Bio-Olivenöl aus dem Olivadis Familienbetrieb - 100% griechisch, biologisch und nachhaltig produziert",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body className={`antialiased bg-background text-foreground font-sans ${lora.variable}`} suppressHydrationWarning>
        <Providers>
          <InventoryBar />
          <Navbar />
          <div className="pt-[120px] md:pt-28">
            {children}
          </div>
          <SideCart />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
