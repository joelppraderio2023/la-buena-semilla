"use client";

import { WHATSAPP_NUMBER, STORE_ADDRESS, STORE_HOURS } from "@/data/products";

export default function ContactoPage() {
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}`;
  const mapsQuery = encodeURIComponent(STORE_ADDRESS);
  const mapsEmbed = `https://maps.google.com/maps?q=${mapsQuery}&output=embed`;

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <div className="bg-verde py-12 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="font-display text-4xl sm:text-5xl text-crema font-bold mb-2">
            Contacto
          </h1>
          <p className="text-crema/60">
            Estamos para ayudarte con tu pedido o consulta.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10">
        {/* Contact info */}
        <div className="space-y-6">
          {/* WhatsApp card */}
          <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-crema-dark/30">
            <div className="w-16 h-16 bg-[#25D366]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="#25D366" className="w-8 h-8">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <h2 className="font-display font-bold text-2xl text-verde mb-1">
              WhatsApp
            </h2>
            <p className="text-texto/50 text-sm mb-5">
              Escribinos para consultas, pedidos personalizados o precios
            </p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
            >
              Chatear ahora · 11 5848-2772
            </a>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-crema-dark/30">
              <div className="text-2xl mb-2">📍</div>
              <h3 className="font-semibold text-verde text-sm mb-1">Dirección</h3>
              <p className="text-texto/60 text-sm leading-relaxed">{STORE_ADDRESS}</p>
              <a
                href={`https://maps.google.com/maps?q=${mapsQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-xs text-terra hover:underline"
              >
                Cómo llegar →
              </a>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-crema-dark/30">
              <div className="text-2xl mb-2">🕐</div>
              <h3 className="font-semibold text-verde text-sm mb-1">Horario</h3>
              <p className="text-texto/60 text-sm leading-relaxed">{STORE_HOURS}</p>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="rounded-3xl overflow-hidden shadow-sm border border-crema-dark/30 min-h-[400px]">
          <iframe
            src={mapsEmbed}
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: "400px" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación La Buena Semilla"
          />
        </div>
      </div>
    </div>
  );
}
