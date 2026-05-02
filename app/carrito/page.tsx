"use client";

import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { formatPrice } from "@/lib/priceStore";

export default function CarritoPage() {
  const { items, total, removeItem, updateQuantity, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-4">
        <div className="text-8xl mb-6 select-none" style={{ animation: "float 3s ease-in-out infinite" }}>
          🛒
        </div>
        <h1 className="font-display text-3xl text-verde font-black mb-2">
          Tu carrito está vacío
        </h1>
        <p className="text-texto/45 mb-8 text-sm">
          Explorá nuestros productos frescos y armá tu pedido.
        </p>
        <Link
          href="/productos"
          className="bg-verde text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-verde-mid transition-all hover:scale-105"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  const hasUnpricedItems = items.some((i) => i.price === 0);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div>
            <h1 className="font-display text-4xl text-verde font-black">
              Carrito
            </h1>
            <p className="text-texto/40 text-sm mt-0.5">
              {itemCount} producto{itemCount !== 1 ? "s" : ""} seleccionado{itemCount !== 1 ? "s" : ""}
            </p>
          </div>
          <span className="ml-2 bg-verde text-white text-sm font-black w-8 h-8 rounded-full flex items-center justify-center shrink-0">
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-crema-dark/40 transition-all duration-200 hover:shadow-sm group"
              >
                {/* Emoji */}
                <div className="w-14 h-14 bg-crema rounded-xl flex items-center justify-center text-3xl shrink-0 select-none group-hover:scale-105 transition-transform">
                  {item.emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-verde text-[15px] leading-snug truncate">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-texto/35 font-medium">{item.unit}</p>
                  <p className="text-sm font-black text-verde mt-0.5 font-display">
                    {item.price === 0 ? (
                      <span className="text-terra text-xs font-sans font-semibold">
                        Precio a confirmar
                      </span>
                    ) : (
                      formatPrice(item.price * item.quantity)
                    )}
                  </p>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-1 bg-crema rounded-xl p-1 shrink-0">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-lg hover:bg-white text-verde font-black text-lg flex items-center justify-center transition-all active:scale-90"
                  >
                    −
                  </button>
                  <span className="w-7 text-center font-black text-sm text-verde">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-lg hover:bg-white text-verde font-black text-lg flex items-center justify-center transition-all active:scale-90"
                  >
                    +
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-texto/15 hover:text-terra transition-colors shrink-0 p-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            <Link
              href="/productos"
              className="inline-flex items-center gap-1.5 text-sm text-verde/45 hover:text-verde transition-colors font-semibold mt-2 px-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Seguir comprando
            </Link>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-verde rounded-2xl p-6 sticky top-24">
              <h2 className="font-display font-black text-crema text-xl mb-5">
                Resumen
              </h2>

              <div className="space-y-2 mb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-crema/55 gap-2">
                    <span className="truncate">
                      {item.quantity}× {item.name}
                    </span>
                    <span className="shrink-0 font-semibold text-crema/70">
                      {item.price === 0 ? "—" : formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 mb-5">
                <div className="flex justify-between font-black text-crema text-lg font-display">
                  <span>Total</span>
                  <span>{total === 0 ? "A confirmar" : formatPrice(total)}</span>
                </div>
                {hasUnpricedItems && (
                  <p className="text-[10px] text-crema/35 mt-1.5 leading-relaxed">
                    * Algunos precios se confirman al recibir el pedido.
                  </p>
                )}
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-terra hover:bg-terra-dark text-white text-center py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-terra/20"
              >
                Finalizar pedido →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
