"use client";

import { WHATSAPP_NUMBER, STORE_ADDRESS, STORE_HOURS } from "@/data/products";

const WA_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function ContactoPage() {
  const waLink    = `https://wa.me/${WHATSAPP_NUMBER}`;
  const mapsQuery = encodeURIComponent(STORE_ADDRESS);
  const mapsEmbed = `https://maps.google.com/maps?q=${mapsQuery}&output=embed`;

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-verde relative overflow-hidden pt-24 pb-14">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -top-20 -right-20 w-[380px] h-[380px] bg-verde-mid/30 blob-1 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <p className="text-terra font-bold text-[11px] uppercase tracking-[0.14em] mb-2">
            La Buena Semilla
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-crema font-black mb-2">
            Contacto
          </h1>
          <p className="text-crema/45 text-sm">
            Estamos para ayudarte con tu pedido o consulta.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-10">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left column: cards */}
          <div className="space-y-4">
            {/* WhatsApp card */}
            <div className="bg-verde rounded-2xl p-8 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-[#25D366]/20 rounded-xl flex items-center justify-center mb-4">
                  {WA_ICON}
                </div>
                <h2 className="font-display font-black text-crema text-2xl mb-1">
                  WhatsApp
                </h2>
                <p className="text-crema/45 text-sm mb-5 leading-relaxed">
                  La forma más rápida de consultar precios, disponibilidad o
                  hacer tu pedido personalizado.
                </p>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20c45e] text-white px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.03]"
                >
                  {WA_ICON}
                  Chatear · 11 5848-2772
                </a>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-crema-dark/40">
                <div className="text-3xl mb-3 select-none">📍</div>
                <h3 className="font-display font-black text-verde text-sm mb-1.5">
                  Dirección
                </h3>
                <p className="text-texto/55 text-sm leading-relaxed">{STORE_ADDRESS}</p>
                <a
                  href={`https://maps.google.com/maps?q=${mapsQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-xs text-terra font-semibold hover:underline"
                >
                  Cómo llegar →
                </a>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-crema-dark/40">
                <div className="text-3xl mb-3 select-none">🕐</div>
                <h3 className="font-display font-black text-verde text-sm mb-1.5">
                  Horario
                </h3>
                <p className="text-texto/55 text-sm leading-relaxed">{STORE_HOURS}</p>
                <p className="text-[11px] text-texto/30 mt-2 font-medium">
                  Domingos y feriados consultar.
                </p>
              </div>
            </div>
          </div>

          {/* Right column: map */}
          <div className="rounded-2xl overflow-hidden border border-crema-dark/40 min-h-[420px] shadow-sm">
            <iframe
              src={mapsEmbed}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "420px", display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación La Buena Semilla"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
