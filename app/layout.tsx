import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SideCart } from "@/components/cart";
import { Navbar, Footer, InventoryBar } from "@/components/layout";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-background text-foreground font-sans">
        <Providers>
          <InventoryBar />
          <Navbar />
          <div className="pt-24 md:pt-28">
            {children}
          </div>
          <SideCart />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
