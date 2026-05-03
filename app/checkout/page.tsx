"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { formatPrice } from "@/lib/priceStore";
import { WHATSAPP_NUMBER } from "@/data/products";

type PaymentMethod  = "efectivo" | "mercadopago";


const steps = [
  { n: 1, label: "Carrito" },
  { n: 2, label: "Tus datos" },
  { n: 3, label: "Confirmado" },
];

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((step, i) => (
        <div key={step.n} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
                current >= step.n
                  ? "bg-verde text-white"
                  : "bg-crema-dark text-texto/30"
              }`}
            >
              {current > step.n ? "✓" : step.n}
            </div>
            <span
              className={`text-[10px] font-bold uppercase tracking-wide ${
                current >= step.n ? "text-verde" : "text-texto/25"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-16 sm:w-24 h-0.5 mb-4 mx-2 transition-all duration-300 ${
                current > step.n ? "bg-verde" : "bg-crema-dark"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function CheckoutPage() {
  const { items, total, clearCart, itemCount } = useCart();
  const [nombre, setNombre]         = useState("");
  const [telefono, setTelefono]     = useState("");
  const [direccion, setDireccion]   = useState("");
  const [payment, setPayment]       = useState<PaymentMethod>("efectivo");
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const [loadingMP, setLoadingMP]   = useState(false);
  const [mpError, setMpError]       = useState("");

  const hasUnpricedItems = items.some((i) => i.price === 0);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!nombre.trim())   e.nombre   = "Ingresá tu nombre";
    if (!telefono.trim()) e.telefono = "Ingresá tu teléfono";
    if (!direccion.trim())
      e.direccion = "Ingresá la dirección de envío";
    return e;
  };

  const buildWhatsAppMessage = () => {
    const lines = [
      "Hola La Buena Semilla! 🌱",
      "",
      "Quiero hacer el siguiente pedido:",
      ...items.map(
        (i) =>
          `• ${i.quantity} ${i.unit} de ${i.name}${i.price > 0 ? ` — ${formatPrice(i.price * i.quantity)}` : ""}`
      ),
      "",
      total > 0 ? `Subtotal: ${formatPrice(total)}` : "Subtotal: a confirmar",
      "",
      `Nombre: ${nombre}`,
      `Teléfono: ${telefono}`,
      `Envío a: ${direccion}`,
      `Pago: Efectivo`,
      "",
      "Gracias! 😊",
    ];
    return encodeURIComponent(lines.join("\n"));
  };

  const handleConfirm = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});

    if (payment === "mercadopago") {
      setLoadingMP(true);
      setMpError("");
      try {
        const res = await fetch("/.netlify/functions/create-preference", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.filter((i) => i.price > 0),
            nombre,
            telefono,
            external_reference: `order-${Date.now()}`,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.init_point) {
          throw new Error("No se pudo crear el pago");
        }
        // Guardar pedido para mostrar en WhatsApp al volver de MP
        sessionStorage.setItem("lbs-order", JSON.stringify({ items, total, nombre, telefono, direccion }));
        clearCart();
        window.location.href = data.init_point;
      } catch {
        setMpError("Hubo un error al conectar con Mercado Pago. Intentá de nuevo o pagá en efectivo.");
        setLoadingMP(false);
      }
      return;
    }

    // Efectivo: redirigir directo a WhatsApp con el pedido
    const msg = buildWhatsAppMessage();
    clearCart();
    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
  };

  /* ── Empty cart ─── */
  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4 select-none">🛒</div>
        <h1 className="font-display text-2xl text-verde font-black mb-4">
          No hay productos en el carrito
        </h1>
        <Link
          href="/productos"
          className="bg-verde text-white px-7 py-3 rounded-xl font-bold text-sm hover:bg-verde-mid transition"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  /* ── Form ─── */
  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
      errors[field]
        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
        : "border-crema-dark focus:border-verde-light focus:ring-verde-light/15"
    }`;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <p className="text-terra font-bold text-[11px] uppercase tracking-[0.14em] mb-1">
            Pedido
          </p>
          <h1 className="font-display text-4xl text-verde font-black">
            Finalizar pedido
          </h1>
        </div>

        <StepBar current={2} />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 space-y-5">
            {/* Datos personales */}
            <div className="bg-white rounded-2xl p-6 border border-crema-dark/40">
              <h2 className="font-display font-black text-verde text-lg mb-5 flex items-center gap-2">
                <span className="w-6 h-6 bg-verde text-white rounded-full text-xs flex items-center justify-center font-black">1</span>
                Tus datos
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-texto/50 mb-1.5 uppercase tracking-wide">
                    Nombre *
                  </label>
                  <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Juan García"
                    className={inputClass("nombre")}
                  />
                  {errors.nombre && (
                    <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>
                  )}
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-texto/50 mb-1.5 uppercase tracking-wide">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="11 2345-6789"
                    className={inputClass("telefono")}
                  />
                  {errors.telefono && (
                    <p className="text-xs text-red-500 mt-1">{errors.telefono}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Entrega */}
            <div className="bg-white rounded-2xl p-6 border border-crema-dark/40">
              <h2 className="font-display font-black text-verde text-lg mb-1 flex items-center gap-2">
                <span className="w-6 h-6 bg-verde text-white rounded-full text-xs flex items-center justify-center font-black">2</span>
                Envío a domicilio
              </h2>
              <p className="text-[11px] text-texto/40 mb-5 ml-8">
                🛵 Entregas de 18:00 a 20:00 hs · Pedidos hasta las 16:00 hs
              </p>
              <div>
                <label className="block text-[11px] font-bold text-texto/50 mb-1.5 uppercase tracking-wide">
                  Dirección de envío *
                </label>
                <input
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Calle 123, Piso 2, San Martín"
                  className={inputClass("direccion")}
                />
                {errors.direccion && (
                  <p className="text-xs text-red-500 mt-1">{errors.direccion}</p>
                )}
              </div>
            </div>

            {/* Pago */}
            <div className="bg-white rounded-2xl p-6 border border-crema-dark/40">
              <h2 className="font-display font-black text-verde text-lg mb-5 flex items-center gap-2">
                <span className="w-6 h-6 bg-verde text-white rounded-full text-xs flex items-center justify-center font-black">3</span>
                Método de pago
              </h2>

              {hasUnpricedItems && payment === "mercadopago" && (
                <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700 leading-relaxed">
                  Algunos productos tienen precio a confirmar y no se incluyen en el pago online. El resto se cobra por Mercado Pago y los artículos sin precio los coordinamos aparte.
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setPayment("efectivo")}
                  className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    payment === "efectivo"
                      ? "border-verde bg-verde-suave"
                      : "border-crema-dark hover:border-verde/30"
                  }`}
                >
                  <div className="text-2xl mb-2 select-none">💵</div>
                  <div className="font-bold text-sm text-verde">Efectivo</div>
                  <div className="text-[11px] text-texto/45 mt-0.5">Al recibir o retirar</div>
                </button>

                <button
                  onClick={() => setPayment("mercadopago")}
                  className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    payment === "mercadopago"
                      ? "border-[#009ee3] bg-blue-50"
                      : "border-crema-dark hover:border-[#009ee3]/40"
                  }`}
                >
                  <div className="text-2xl mb-2 select-none">💳</div>
                  <div className="font-bold text-sm text-[#009ee3]">Mercado Pago</div>
                  <div className="text-[11px] text-texto/45 mt-0.5">Tarjeta, débito o saldo</div>
                </button>
              </div>

              {mpError && (
                <p className="text-xs text-red-500 mt-3 bg-red-50 rounded-xl px-4 py-2">{mpError}</p>
              )}
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-verde rounded-2xl p-6 sticky top-24">
              <h2 className="font-display font-black text-crema text-lg mb-4">
                Tu pedido
                <span className="ml-2 text-crema/40 text-sm font-sans font-semibold">
                  ({itemCount} ítem{itemCount !== 1 ? "s" : ""})
                </span>
              </h2>

              <div className="space-y-2 mb-5 max-h-48 overflow-y-auto pr-1 scrollbar-hide">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm gap-2">
                    <span className="truncate text-crema/55">
                      {item.emoji} {item.quantity}× {item.name}
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
              </div>

              <button
                onClick={handleConfirm}
                disabled={loadingMP}
                className={`w-full py-3.5 rounded-xl font-black text-sm transition-all shadow-lg active:scale-95 ${
                  loadingMP
                    ? "bg-crema-dark text-texto/40 cursor-not-allowed"
                    : payment === "mercadopago"
                    ? "bg-[#009ee3] hover:bg-[#0086c8] text-white hover:scale-[1.02] shadow-blue-500/20"
                    : "bg-terra hover:bg-terra-dark text-white hover:scale-[1.02] shadow-terra/20"
                }`}
              >
                {loadingMP
                  ? "Conectando con MP..."
                  : payment === "mercadopago"
                  ? "Pagar con Mercado Pago →"
                  : "Confirmar pedido →"}
              </button>
              <p className="text-[10px] text-crema/25 text-center mt-3 leading-relaxed">
                {payment === "mercadopago"
                  ? "Serás redirigido a Mercado Pago para completar el pago."
                  : "Te contactaremos por WhatsApp para coordinar la entrega."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
