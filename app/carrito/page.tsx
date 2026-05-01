"use client";

import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { formatPrice } from "@/lib/priceStore";

export default function CarritoPage() {
  const { items, total, removeItem, updateQuantity, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-4">
        <div className="text-8xl mb-6">🛒</div>
        <h1 className="font-display text-3xl text-verde font-bold mb-2">
          Tu carrito está vacío
        </h1>
        <p className="text-texto/50 mb-8">
          ¡Explorá nuestros productos frescos!
        </p>
        <Link
          href="/productos"
          className="bg-verde text-white px-8 py-3 rounded-2xl font-semibold hover:bg-verde-mid transition"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  const hasUnpricedItems = items.some((i) => i.price === 0);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl text-verde font-bold mb-1">
            Carrito
          </h1>
          <p className="text-texto/50">
            {itemCount} producto{itemCount !== 1 ? "s" : ""} seleccionado
            {itemCount !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 flex items-center gap-4"
              >
                {/* Emoji */}
                <div className="w-16 h-16 bg-crema rounded-xl flex items-center justify-center text-3xl shrink-0">
                  {item.emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-verde truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-texto/40">{item.unit}</p>
                  <p className="text-sm font-bold text-verde mt-1">
                    {item.price === 0 ? (
                      <span className="text-terra text-xs">Precio a confirmar</span>
                    ) : (
                      formatPrice(item.price * item.quantity)
                    )}
                  </p>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-lg bg-crema hover:bg-crema-dark text-verde font-bold text-lg flex items-center justify-center transition"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-crema hover:bg-crema-dark text-verde font-bold text-lg flex items-center justify-center transition"
                  >
                    +
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-1 text-texto/20 hover:text-terra transition shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            <Link
              href="/productos"
              className="inline-flex items-center gap-2 text-sm text-verde/60 hover:text-verde transition mt-2"
            >
              ← Seguir comprando
            </Link>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-24">
              <h2 className="font-display font-bold text-verde text-xl mb-4">
                Resumen
              </h2>

              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-texto/60">
                    <span className="truncate mr-2">
                      {item.quantity}× {item.name}
                    </span>
                    <span className="shrink-0 font-medium">
                      {item.price === 0 ? "—" : formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-crema-dark pt-4 mb-6">
                <div className="flex justify-between font-bold text-verde">
                  <span>Total</span>
                  <span>{total === 0 ? "A confirmar" : formatPrice(total)}</span>
                </div>
                {hasUnpricedItems && (
                  <p className="text-[11px] text-terra mt-1">
                    * Algunos precios se confirmarán al recibir tu pedido.
                  </p>
                )}
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-verde text-white text-center py-3 rounded-xl font-semibold hover:bg-verde-mid transition"
              >
                Proceder al pago
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
