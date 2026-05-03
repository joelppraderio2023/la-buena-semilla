"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { formatPrice } from "@/lib/priceStore";
import { WHATSAPP_NUMBER } from "@/data/products";

type PaymentMethod  = "efectivo" | "mercadopago";
type DeliveryMethod = "retiro" | "envio";

const WA_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

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
  const [delivery, setDelivery]     = useState<DeliveryMethod>("retiro");
  const [payment, setPayment]       = useState<PaymentMethod>("efectivo");
  const [confirmed, setConfirmed]   = useState(false);
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const [loadingMP, setLoadingMP]   = useState(false);
  const [mpError, setMpError]       = useState("");

  const hasUnpricedItems = items.some((i) => i.price === 0);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!nombre.trim())   e.nombre   = "Ingresá tu nombre";
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
      ...items.map(
        (i) =>
          `• ${i.quantity} ${i.unit} de ${i.name}${i.price > 0 ? ` — ${formatPrice(i.price * i.quantity)}` : ""}`
      ),
      "",
      total > 0 ? `Subtotal: ${formatPrice(total)}` : "Subtotal: a confirmar",
      "",
      `Nombre: ${nombre}`,
      `Teléfono: ${telefono}`,
      delivery === "retiro"
        ? "Entrega: Retiro en tienda (Moreno 3829, San Martín)"
        : `Envío a: ${direccion}`,
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
        clearCart();
        window.location.href = data.init_point;
      } catch {
        setMpError("Hubo un error al conectar con Mercado Pago. Intentá de nuevo o pagá en efectivo.");
        setLoadingMP(false);
      }
      return;
    }

    setConfirmed(true);
    clearCart();
  };

  /* ── Empty cart ─── */
  if (items.length === 0 && !confirmed) {
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

  /* ── Success (efectivo) ─── */
  if (confirmed) {
    const msg = buildWhatsAppMessage();
    return (
      <div className="min-h-screen pt-24 pb-16 flex flex-col items-center justify-center text-center px-4">
        <StepBar current={3} />
        <div
          className="bg-white rounded-3xl p-10 max-w-md w-full border border-crema-dark/40"
          style={{ animation: "fadeUp 0.5s ease-out both" }}
        >
          <div className="text-6xl mb-4 select-none">🎉</div>
          <h1 className="font-display text-3xl text-verde font-black mb-2">
            ¡Pedido confirmado!
          </h1>
          <p className="text-texto/45 text-sm mb-7 leading-relaxed">
            Te contactaremos para coordinar la entrega. También podés
            enviarnos el pedido directamente por WhatsApp.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20c45e] text-white px-6 py-3.5 rounded-xl font-bold text-sm w-full justify-center mb-3 transition-all hover:scale-[1.02]"
          >
            {WA_ICON}
            Enviar pedido por WhatsApp
          </a>
          <Link
            href="/"
            className="block text-sm text-texto/35 hover:text-verde transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
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
              <h2 className="font-display font-black text-verde text-lg mb-5 flex items-center gap-2">
                <span className="w-6 h-6 bg-verde text-white rounded-full text-xs flex items-center justify-center font-black">2</span>
                Entrega
              </h2>
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {[
                  { id: "retiro", label: "Retiro en tienda", sub: "Moreno 3829, San Martín", emoji: "🏪" },
                  { id: "envio",  label: "Envío a domicilio", sub: "Coordinamos por WhatsApp", emoji: "🛵" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setDelivery(opt.id as DeliveryMethod)}
                    className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      delivery === opt.id
                        ? "border-verde bg-verde-suave"
                        : "border-crema-dark hover:border-verde/30"
                    }`}
                  >
                    <div className="text-2xl mb-2 select-none">{opt.emoji}</div>
                    <div className="font-bold text-sm text-verde">{opt.label}</div>
                    <div className="text-[11px] text-texto/45 mt-0.5">{opt.sub}</div>
                  </button>
                ))}
              </div>
              {delivery === "envio" && (
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
              )}
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
