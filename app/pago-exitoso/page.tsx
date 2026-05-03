"use client";

import { useEffect } from "react";
import Link from "next/link";
import { WHATSAPP_NUMBER } from "@/data/products";
import { formatPrice } from "@/lib/priceStore";

export default function PagoExitosoPage() {
  useEffect(() => {
    const stored = sessionStorage.getItem("lbs-order");
    if (!stored) return;

    const order = JSON.parse(stored);
    sessionStorage.removeItem("lbs-order");

    const lines = [
      "Hola La Buena Semilla! 🌱",
      "",
      "Acabo de pagar con Mercado Pago:",
      ...order.items.map(
        (i: { quantity: number; unit: string; name: string; price: number }) =>
          `• ${i.quantity} ${i.unit} de ${i.name}${i.price > 0 ? ` — ${formatPrice(i.price * i.quantity)}` : ""}`
      ),
      "",
      order.total > 0 ? `Total: ${formatPrice(order.total)}` : "Total: a confirmar",
      "",
      `Nombre: ${order.nombre}`,
      `Teléfono: ${order.telefono}`,
      `Envío a: ${order.direccion}`,
      "",
      "Gracias! 😊",
    ];

    const msg = encodeURIComponent(lines.join("\n"));
    setTimeout(() => {
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    }, 800);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 flex flex-col items-center justify-center text-center px-4 bg-crema">
      <div className="bg-white rounded-3xl p-10 max-w-md w-full border border-crema-dark/40 shadow-xl">
        <div className="w-20 h-20 bg-verde/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✅</span>
        </div>
        <h1 className="font-display text-3xl text-verde font-black mb-2">
          ¡Pago recibido!
        </h1>
        <p className="text-texto/50 text-sm mb-8 leading-relaxed">
          Tu pago fue aprobado. Te estamos enviando el pedido por WhatsApp para coordinar la entrega.
        </p>
        <Link href="/" className="block text-sm text-texto/35 hover:text-verde transition-colors">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
