"use client";

import Link from "next/link";
import { products, categories, WHATSAPP_NUMBER } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const heroEmojis = ["🍎", "🥦", "🍊", "🥕", "🍋", "🫒", "🍅", "🍯", "🌿", "🍇", "🥬", "🌶️"];

const floatDelays = [0, 0.5, 1, 1.5, 2, 0.8, 1.2, 0.3, 1.8, 0.6, 1.4, 2.2];

const featured = products.filter((p) => p.featured).slice(0, 8);

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen bg-verde overflow-hidden flex items-center pt-16">
        {/* Decorative blobs */}
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-verde-mid opacity-50 blob-1"
          style={{ animation: "float 8s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-0 left-1/2 w-[300px] h-[300px] bg-terra opacity-20 blob-2"
          style={{ animation: "float 6s ease-in-out infinite reverse" }}
        />
        <div className="absolute top-1/4 right-1/4 w-[200px] h-[200px] bg-verde-light opacity-10 blob-1" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full grid lg:grid-cols-2 gap-12 items-center py-20 relative z-10">
          {/* Left: Copy */}
          <div>
            <span className="inline-flex items-center gap-2 bg-verde-mid/50 text-verde-pale text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <span>📍</span> San Martín, Buenos Aires
            </span>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-crema leading-[0.9] mb-6">
              Del campo
              <br />
              <em className="text-terra not-italic">a tu mesa.</em>
            </h1>

            <p className="text-crema/60 text-lg leading-relaxed mb-8 max-w-md">
              Frutas, verduras y productos naturales con la frescura de siempre.
              Pedidos online, retiro o envío a domicilio.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/productos"
                className="bg-terra hover:bg-terra-dark text-white px-8 py-4 rounded-2xl font-bold text-base transition-all duration-200 hover:scale-105 text-center"
              >
                Ver productos
              </Link>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-crema/30 text-crema hover:bg-crema/10 px-8 py-4 rounded-2xl font-semibold text-base transition text-center"
              >
                💬 Consultar
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 mt-10 text-crema/40 text-xs font-semibold uppercase tracking-wide">
              <span>✓ Mercado Pago</span>
              <span>✓ Efectivo</span>
              <span>✓ Retiro en tienda</span>
            </div>
          </div>

          {/* Right: Emoji grid */}
          <div className="hidden lg:grid grid-cols-4 gap-4">
            {heroEmojis.map((emoji, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm rounded-2xl aspect-square flex items-center justify-center text-4xl"
                style={{
                  animation: `float 4s ease-in-out ${floatDelays[i]}s infinite`,
                  animationFillMode: "both",
                }}
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-crema/30 animate-bounce">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="font-display text-3xl sm:text-4xl text-verde font-bold mb-3">
          Nuestros productos
        </h2>
        <p className="text-texto/50 mb-8">Seleccionamos lo mejor para vos cada día.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categories.slice(1).map((cat) => (
            <Link
              key={cat.id}
              href={`/productos?categoria=${cat.id}`}
              className="group bg-white rounded-2xl p-5 flex flex-col items-center gap-2 card-hover border border-crema-dark/50"
            >
              <span className="text-4xl group-hover:scale-110 transition-transform duration-200">
                {cat.emoji}
              </span>
              <span className="font-display font-semibold text-verde text-sm text-center">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="py-8 pb-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl text-verde font-bold mb-2">
              Destacados
            </h2>
            <p className="text-texto/50">Los favoritos de nuestros clientes.</p>
          </div>
          <Link
            href="/productos"
            className="text-terra font-semibold text-sm hover:underline hidden sm:block"
          >
            Ver todos →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link href="/productos" className="text-terra font-semibold text-sm hover:underline">
            Ver todos los productos →
          </Link>
        </div>
      </section>

      {/* TRUST BANNER */}
      <section className="bg-verde-mid py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl text-white font-bold mb-4">
            Frescura garantizada, todos los días.
          </h2>
          <p className="text-white/60 mb-8 text-lg">
            Seleccionamos los mejores productos para que lleguen a tu mesa en
            perfectas condiciones.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🌿", label: "Productos Frescos" },
              { icon: "🛒", label: "Pedidos Online" },
              { icon: "💳", label: "Mercado Pago" },
              { icon: "💬", label: "Atención por WhatsApp" },
            ].map((item) => (
              <div key={item.label} className="bg-white/10 rounded-2xl p-4">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="text-white font-semibold text-sm">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA CONTACTO */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-terra font-semibold uppercase text-xs tracking-widest mb-3">
          ¿Tenés dudas?
        </p>
        <h2 className="font-display text-3xl sm:text-4xl text-verde font-bold mb-4">
          Estamos para ayudarte
        </h2>
        <p className="text-texto/50 max-w-md mx-auto mb-8">
          Contactanos por WhatsApp para consultas sobre precios, disponibilidad o
          hacer tu pedido de forma personalizada.
        </p>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-2xl font-bold text-base hover:scale-105 transition-transform duration-200"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Escribinos por WhatsApp
        </a>
      </section>
    </>
  );
}
