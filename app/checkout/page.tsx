"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { formatPrice } from "@/lib/priceStore";
import { WHATSAPP_NUMBER } from "@/data/products";

type PaymentMethod = "efectivo" | "mercadopago";
type DeliveryMethod = "retiro" | "envio";

export default function CheckoutPage() {
  const { items, total, clearCart, itemCount } = useCart();
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [delivery, setDelivery] = useState<DeliveryMethod>("retiro");
  const [payment, setPayment] = useState<PaymentMethod>("efectivo");
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!nombre.trim()) e.nombre = "Ingresá tu nombre";
    if (!telefono.trim()) e.telefono = "Ingresá tu teléfono";
    if (delivery === "envio" && !direccion.trim())
      e.direccion = "Ingresá la dirección de envío";
    return e;
  };

  const buildWhatsAppMessage = () => {
    const lines = [
      "Hola La Buena Semilla! 🌱",
      "",
      "Quiero hacer el siguiente pedido:",
      ...items.map((i) => `• ${i.quantity} ${i.unit} de ${i.name}${i.price > 0 ? ` — ${formatPrice(i.price * i.quantity)}` : ""}`),
      "",
      total > 0 ? `Subtotal: ${formatPrice(total)}` : "Subtotal: a confirmar",
      "",
      `Nombre: ${nombre}`,
      `Teléfono: ${telefono}`,
      delivery === "retiro"
        ? "Entrega: Retiro en tienda (Moreno 3829, San Martín)"
        : `Envío a: ${direccion}`,
      `Pago: ${payment === "efectivo" ? "Efectivo" : "Mercado Pago"}`,
      "",
      "Gracias! 😊",
    ];
    return encodeURIComponent(lines.join("\n"));
  };

  const handleConfirm = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    setConfirmed(true);
    clearCart();
  };

  if (items.length === 0 && !confirmed) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="font-display text-2xl text-verde font-bold mb-4">
          No hay productos en el carrito
        </h1>
        <Link href="/productos" className="bg-verde text-white px-6 py-3 rounded-xl font-semibold hover:bg-verde-mid transition">
          Ver productos
        </Link>
      </div>
    );
  }

  if (confirmed) {
    const msg = buildWhatsAppMessage();
    return (
      <div className="min-h-screen pt-24 pb-16 flex flex-col items-center justify-center text-center px-4">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-xl">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="font-display text-3xl text-verde font-bold mb-2">
            ¡Pedido confirmado!
          </h1>
          <p className="text-texto/50 mb-6">
            Te contactaremos para coordinar la entrega y confirmar los precios.
            También podés enviarnos tu pedido por WhatsApp.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform w-full justify-center mb-3"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Enviar por WhatsApp
          </a>
          <Link href="/" className="text-sm text-texto/40 hover:text-verde transition">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="font-display text-4xl text-verde font-bold mb-8">
          Finalizar pedido
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer data */}
            <div className="bg-white rounded-2xl p-6">
              <h2 className="font-display font-bold text-verde text-xl mb-4">
                Tus datos
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-texto/60 mb-1">
                    Nombre *
                  </label>
                  <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Juan García"
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-verde-light ${errors.nombre ? "border-red-400" : "border-crema-dark"}`}
                  />
                  {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-texto/60 mb-1">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="11 2345-6789"
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-verde-light ${errors.telefono ? "border-red-400" : "border-crema-dark"}`}
                  />
                  {errors.telefono && <p className="text-xs text-red-500 mt-1">{errors.telefono}</p>}
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="bg-white rounded-2xl p-6">
              <h2 className="font-display font-bold text-verde text-xl mb-4">
                Entrega
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { id: "retiro", label: "Retiro en tienda", sub: "Moreno 3829, San Martín", emoji: "🏪" },
                  { id: "envio", label: "Envío a domicilio", sub: "Coordinamos por WhatsApp", emoji: "🚚" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setDelivery(opt.id as DeliveryMethod)}
                    className={`text-left p-4 rounded-xl border-2 transition ${
                      delivery === opt.id
                        ? "border-verde bg-verde/5"
                        : "border-crema-dark hover:border-verde/30"
                    }`}
                  >
                    <div className="text-2xl mb-1">{opt.emoji}</div>
                    <div className="font-semibold text-sm text-verde">{opt.label}</div>
                    <div className="text-xs text-texto/50">{opt.sub}</div>
                  </button>
                ))}
              </div>

              {delivery === "envio" && (
                <div className="mt-4">
                  <label className="block text-xs font-semibold text-texto/60 mb-1">
                    Dirección de envío *
                  </label>
                  <input
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Calle 123, Piso 2, San Martín"
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-verde-light ${errors.direccion ? "border-red-400" : "border-crema-dark"}`}
                  />
                  {errors.direccion && <p className="text-xs text-red-500 mt-1">{errors.direccion}</p>}
                </div>
              )}
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl p-6">
              <h2 className="font-display font-bold text-verde text-xl mb-4">
                Método de pago
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setPayment("efectivo")}
                  className={`text-left p-4 rounded-xl border-2 transition ${
                    payment === "efectivo"
                      ? "border-verde bg-verde/5"
                      : "border-crema-dark hover:border-verde/30"
                  }`}
                >
                  <div className="text-2xl mb-1">💵</div>
                  <div className="font-semibold text-sm text-verde">Efectivo</div>
                  <div className="text-xs text-texto/50">Al recibir o retirar</div>
                </button>

                <div
                  className="text-left p-4 rounded-xl border-2 border-crema-dark opacity-60 cursor-not-allowed relative"
                >
                  <div className="text-2xl mb-1">💳</div>
                  <div className="font-semibold text-sm text-verde">Mercado Pago</div>
                  <div className="text-xs text-texto/50">Próximamente disponible</div>
                  <span className="absolute top-2 right-2 bg-terra/20 text-terra text-[10px] font-bold px-2 py-0.5 rounded-full">
                    PRONTO
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-24">
              <h2 className="font-display font-bold text-verde text-xl mb-4">
                Tu pedido
              </h2>

              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-texto/60">
                    <span className="truncate mr-2">
                      {item.emoji} {item.quantity}× {item.name}
                    </span>
                    <span className="shrink-0 font-medium">
                      {item.price === 0 ? "—" : formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-crema-dark pt-4 mb-6">
                <div className="flex justify-between font-bold text-verde text-lg">
                  <span>Total</span>
                  <span>{total === 0 ? "A confirmar" : formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                className="w-full bg-verde text-white py-3 rounded-xl font-bold hover:bg-verde-mid transition active:scale-95"
              >
                Confirmar pedido
              </button>

              <p className="text-[11px] text-texto/40 text-center mt-3">
                Al confirmar recibirás un mensaje por WhatsApp para coordinar la entrega.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
