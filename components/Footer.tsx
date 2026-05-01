import Link from "next/link";
import { STORE_ADDRESS, STORE_HOURS, WHATSAPP_NUMBER } from "@/data/products";

export default function Footer() {
  return (
    <footer className="bg-verde text-white mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🌱</span>
            <span className="font-display font-bold text-xl">La Buena Semilla</span>
          </div>
          <p className="text-white/60 text-sm leading-relaxed">
            Verdulería y frutería con los mejores productos frescos de la región.
            Calidad y frescura garantizadas.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-display font-semibold text-lg mb-4">Contacto</h3>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <span className="mt-0.5">📍</span>
              <span>{STORE_ADDRESS}</span>
            </li>
            <li className="flex items-center gap-2">
              <span>🕐</span>
              <span>{STORE_HOURS}</span>
            </li>
            <li>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-verde-pale hover:text-white transition"
              >
                <span>💬</span>
                <span>WhatsApp: 11 5848-2772</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-display font-semibold text-lg mb-4">Navegación</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li>
              <Link href="/" className="hover:text-white transition">Inicio</Link>
            </li>
            <li>
              <Link href="/productos" className="hover:text-white transition">Productos</Link>
            </li>
            <li>
              <Link href="/contacto" className="hover:text-white transition">Contacto</Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-white transition">Panel de Administración</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} La Buena Semilla. Todos los derechos reservados.
      </div>
    </footer>
  );
}
