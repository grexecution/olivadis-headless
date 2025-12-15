import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SideCart } from "@/components/cart";
import { Navbar, Footer, InventoryBar } from "@/components/layout";
import { StoriesButton } from "@/components/stories/stories-button";

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
  title: "Olivadis - Premium Natives Olivenöl Extra",
  description: "Entdecken Sie Premium Natives Olivenöl Extra aus dem Olivadis Familienbetrieb - 100% griechisch und nachhaltig produziert",
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
          <StoriesButton />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
