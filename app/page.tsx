"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  products,
  categories,
  WHATSAPP_NUMBER,
  STORE_ADDRESS,
  STORE_HOURS,
} from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { getPriceOverrides } from "@/lib/priceStore";

function OfertasDelDia() {
  const [ofertaIds, setOfertaIds] = useState<string[]>([]);

  useEffect(() => {
    const overrides = getPriceOverrides();
    const ids = products
      .filter((p) => {
        const ov = overrides[p.id];
        return ov?.oferta && ov?.precioOferta && ov.precioOferta > 0 && ov.available !== false;
      })
      .map((p) => p.id);
    setOfertaIds(ids);
  }, []);

  if (ofertaIds.length === 0) return null;

  const ofertaProducts = products.filter((p) => ofertaIds.includes(p.id));

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Warm background */}
      <div className="absolute inset-0 bg-gradient-to-br from-terra/8 via-crema to-crema pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-terra/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-terra/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🔥</span>
              <p className="text-terra font-bold text-[11px] uppercase tracking-[0.14em]">
                Solo por hoy
              </p>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl text-verde font-black">
              Ofertas del día
            </h2>
          </div>
          <span className="hidden sm:flex items-center justify-center bg-terra text-white text-xs font-black px-3 py-1.5 rounded-full">
            {ofertaProducts.length} oferta{ofertaProducts.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {ofertaProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

const heroEmojis = [
  "🍎", "🥦", "🍊", "🥕",
  "🍋", "🫒", "🍅", "🍯",
  "🌿", "🍇", "🥬", "🌶️",
];
const floatDelays = [0, 0.5, 1, 1.5, 2, 0.8, 1.2, 0.3, 1.8, 0.6, 1.4, 2.2];

const marqueeItems = [
  "Frutas frescas",
  "Verduras del día",
  "Aceites artesanales",
  "Miel natural",
  "Envío a domicilio",
  "Retiro en tienda",
  "San Martín, Bs As",
  "Pedidos por WhatsApp",
];

const features = [
  {
    icon: "🌿",
    title: "Siempre fresco",
    desc: "Recibimos mercadería todos los días para que llegue en perfectas condiciones.",
  },
  {
    icon: "🛵",
    title: "Envío a domicilio",
    desc: "Llevamos tu pedido hasta tu puerta en San Martín y alrededores.",
  },
  {
    icon: "💬",
    title: "Atención personal",
    desc: "Respondemos rápido por WhatsApp para cualquier consulta o pedido especial.",
  },
  {
    icon: "🏪",
    title: "Retiro en tienda",
    desc: `Pasá a buscar tu pedido en ${STORE_ADDRESS}.`,
  },
];

const featured = products.filter((p) => p.featured).slice(0, 8);

export default function HomePage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen bg-verde overflow-hidden flex flex-col pt-16">
        {/* Dot grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Decorative blobs */}
        <div
          className="absolute -top-40 -right-40 w-[640px] h-[640px] bg-verde-mid opacity-40 blob-1"
          style={{ animation: "float 8s ease-in-out infinite" }}
        />
        <div
          className="absolute -bottom-24 left-1/3 w-[420px] h-[420px] bg-terra opacity-10 blob-2"
          style={{ animation: "float 6s ease-in-out infinite reverse" }}
        />
        <div className="absolute top-1/3 -left-16 w-[240px] h-[240px] bg-verde-light opacity-8 blob-1" />

        {/* Main grid */}
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full grid lg:grid-cols-2 gap-8 items-center py-16 relative z-10">
          {/* Left copy */}
          <div style={{ animation: "fadeUp 0.7s ease-out both" }}>
            <span className="inline-flex items-center gap-2 bg-terra/20 text-terra-light text-[11px] font-bold px-4 py-2 rounded-full mb-8 tracking-[0.12em] uppercase">
              📍 San Martín, Buenos Aires
            </span>

            <h1 className="font-display font-black text-crema leading-[0.85] mb-6 tracking-tight">
              <span className="block text-[clamp(3.2rem,7.5vw,6rem)]">
                Del campo
              </span>
              <span className="block text-[clamp(3.2rem,7.5vw,6rem)] italic text-terra">
                a tu mesa.
              </span>
            </h1>

            <p className="text-crema/55 text-lg leading-relaxed mb-10 max-w-md">
              Frutas, verduras y productos naturales con la frescura de siempre.
              Pedidos online, retiro o envío a domicilio en San Martín.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link
                href="/productos"
                className="bg-terra hover:bg-terra-dark text-white px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-200 hover:scale-105 text-center tracking-wide shadow-lg shadow-terra/20"
              >
                Ver productos
              </Link>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-crema/20 text-crema hover:bg-crema/8 px-8 py-4 rounded-2xl font-semibold text-sm transition-all duration-200 text-center"
              >
                💬 Consultar por WhatsApp
              </a>
            </div>

            <div className="flex flex-wrap gap-6 text-crema/30 text-[11px] font-bold uppercase tracking-[0.12em]">
              <span className="flex items-center gap-1.5">
                <span className="text-verde-light/60">✓</span> Mercado Pago
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-verde-light/60">✓</span> Efectivo
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-verde-light/60">✓</span> Envío a domicilio
              </span>
            </div>
          </div>

          {/* Right emoji grid */}
          <div
            className="hidden lg:grid grid-cols-4 gap-3 py-8"
            style={{ animation: "fadeUp 0.7s ease-out 0.15s both" }}
          >
            {heroEmojis.map((emoji, i) => (
              <div
                key={i}
                className="group bg-white/[0.06] hover:bg-white/[0.11] backdrop-blur-sm rounded-3xl aspect-square flex items-center justify-center text-4xl transition-all duration-300 border border-white/[0.06] cursor-default"
                style={{
                  animation: `float 4s ease-in-out ${floatDelays[i]}s infinite`,
                }}
              >
                <span className="group-hover:scale-110 transition-transform duration-300 inline-block select-none">
                  {emoji}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="relative z-10 pb-8 flex justify-center">
          <div className="text-crema/20 animate-bounce">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────── */}
      <div className="bg-terra overflow-hidden py-3 border-y border-terra-dark/30">
        <div className="flex" style={{ animation: "marquee 22s linear infinite" }}>
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="text-white font-bold text-[11px] uppercase tracking-[0.15em] whitespace-nowrap px-8 flex items-center gap-8 shrink-0"
            >
              {item}
              <span className="text-white/35 text-[8px]">◆</span>
            </span>
          ))}
        </div>
      </div>

      <OfertasDelDia />

      {/* ── CATEGORÍAS ───────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-terra font-bold text-[11px] uppercase tracking-[0.14em] mb-2">
              Explorá nuestros
            </p>
            <h2 className="font-display text-4xl sm:text-5xl text-verde font-black">
              Productos
            </h2>
          </div>
          <Link
            href="/productos"
            className="hidden sm:flex items-center gap-1 text-verde/40 hover:text-verde text-sm font-semibold transition-colors"
          >
            Ver todos →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categories.slice(1).map((cat, i) => (
            <Link
              key={cat.id}
              href={`/productos?categoria=${cat.id}`}
              className="group relative bg-crema-dark/40 hover:bg-verde rounded-2xl p-6 flex flex-col items-center gap-3 transition-all duration-300 border border-crema-darker/60 hover:border-verde hover:shadow-xl hover:shadow-verde/15 overflow-hidden"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <span className="text-4xl group-hover:scale-110 transition-transform duration-300 relative z-10 select-none">
                {cat.emoji}
              </span>
              <span className="font-display font-bold text-verde group-hover:text-crema text-sm text-center relative z-10 transition-colors duration-300">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── PROPUESTA DE VALOR ───────────────────────────── */}
      <section className="py-24 bg-verde relative overflow-hidden">
        {/* Background accents */}
        <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-verde-mid/25 blob-1 pointer-events-none" />
        <div className="absolute -bottom-24 -left-16 w-[320px] h-[320px] bg-terra/8 blob-2 pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-terra font-bold text-[11px] uppercase tracking-[0.14em] mb-4">
                Por qué elegirnos
              </p>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] text-crema font-black leading-[1.05] mb-6 tracking-tight">
                La frescura de siempre, en tu puerta.
              </h2>
              <p className="text-crema/50 text-base leading-relaxed max-w-sm">
                En La Buena Semilla seleccionamos cada producto con cuidado,
                priorizando la calidad y la frescura. Trabajamos con
                proveedores locales para ofrecerte lo mejor de la huerta
                argentina.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {features.map((item, i) => (
                <div
                  key={i}
                  className="bg-white/[0.05] hover:bg-white/[0.09] rounded-2xl p-5 transition-all duration-200 border border-white/[0.06] group"
                >
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200 inline-block">
                    {item.icon}
                  </div>
                  <h3 className="font-display font-bold text-crema text-[15px] mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-crema/38 text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCTOS DESTACADOS ─────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-terra font-bold text-[11px] uppercase tracking-[0.14em] mb-2">
              Los más pedidos
            </p>
            <h2 className="font-display text-4xl sm:text-5xl text-verde font-black">
              Destacados
            </h2>
          </div>
          <Link
            href="/productos"
            className="hidden sm:flex items-center gap-1 text-verde/40 hover:text-verde text-sm font-semibold transition-colors"
          >
            Ver todos →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/productos"
            className="text-terra font-bold text-sm hover:underline"
          >
            Ver todos los productos →
          </Link>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────── */}
      <section className="py-24 bg-crema-dark/40 border-t border-crema-darker/50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-terra font-bold text-[11px] uppercase tracking-[0.14em] mb-4">
            ¿Tenés dudas?
          </p>
          <h2 className="font-display text-4xl sm:text-5xl text-verde font-black mb-4 tracking-tight">
            Estamos para ayudarte
          </h2>
          <p className="text-texto/45 text-base mb-10 max-w-sm mx-auto leading-relaxed">
            Escribinos por WhatsApp y te ayudamos con tu pedido, precios
            y disponibilidad.
          </p>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20c45e] text-white px-10 py-4 rounded-2xl font-bold text-sm transition-all duration-200 hover:scale-105 shadow-lg shadow-[#25D366]/25"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Escribinos por WhatsApp
          </a>

          <div className="mt-10 flex flex-wrap justify-center gap-6 text-texto/28 text-[11px] font-semibold uppercase tracking-[0.1em]">
            <span>📍 {STORE_ADDRESS}</span>
            <span>🕐 {STORE_HOURS}</span>
          </div>
        </div>
      </section>
    </>
  );
}
