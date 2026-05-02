import Link from "next/link";
import { STORE_ADDRESS, STORE_HOURS, WHATSAPP_NUMBER } from "@/data/products";

const WA_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-verde relative overflow-hidden mt-0">
      {/* Dot grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Accent blob */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-verde-mid/20 blob-1 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <span className="text-2xl">🌱</span>
              <div className="leading-none">
                <span className="font-display font-black text-crema text-lg block">
                  La Buena Semilla
                </span>
                <span className="text-[9px] text-terra font-bold tracking-[0.16em] uppercase">
                  Verdulería &amp; Frutería
                </span>
              </div>
            </div>
            <p className="text-crema/45 text-sm leading-relaxed max-w-xs">
              Frutas y verduras frescas con la calidad de siempre. San Martín,
              Buenos Aires.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-bold text-crema text-base mb-5">
              Contacto
            </h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-2.5 text-sm text-crema/55">
                <span className="mt-0.5 shrink-0">📍</span>
                <span>{STORE_ADDRESS}</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-crema/55">
                <span className="shrink-0">🕐</span>
                <span>{STORE_HOURS}</span>
              </li>
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[#4ade80] hover:text-white transition-colors duration-200 font-semibold"
                >
                  {WA_ICON}
                  11 5848-2772
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-display font-bold text-crema text-base mb-5">
              Navegación
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/",          label: "Inicio" },
                { href: "/productos", label: "Productos" },
                { href: "/contacto",  label: "Contacto" },
                { href: "/admin",     label: "Panel Admin" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-crema/45 hover:text-crema transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-crema/25 text-[11px] font-medium">
          <span>© {new Date().getFullYear()} La Buena Semilla. Todos los derechos reservados.</span>
          <span className="tracking-wide">San Martín, Buenos Aires, Argentina</span>
        </div>
      </div>
    </footer>
  );
}
