import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "La Buena Semilla — Verdulería y Frutería",
  description:
    "Frutas, verduras y productos naturales frescos en San Martín, Buenos Aires. Pedidos online con Mercado Pago o efectivo.",
  keywords: "verdulería, frutería, productos frescos, San Martín, Buenos Aires, delivery",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
