"use client";

import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { useState, useEffect } from "react";

export default function Header() {
  const { itemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🌱</span>
          <div>
            <span className="font-display font-bold text-verde text-xl leading-none block">
              La Buena Semilla
            </span>
            <span className="text-[10px] text-terra font-sans font-medium tracking-widest uppercase leading-none">
              Verdulería & Frutería
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-semibold text-verde/70 hover:text-verde transition"
          >
            Inicio
          </Link>
          <Link
            href="/productos"
            className="text-sm font-semibold text-verde/70 hover:text-verde transition"
          >
            Productos
          </Link>
          <Link
            href="/contacto"
            className="text-sm font-semibold text-verde/70 hover:text-verde transition"
          >
            Contacto
          </Link>
        </nav>

        {/* Cart + Mobile Menu */}
        <div className="flex items-center gap-3">
          <Link
            href="/carrito"
            className="relative flex items-center gap-2 bg-verde text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-verde-mid transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="hidden sm:inline">Carrito</span>
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-terra text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-verde"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-crema-dark px-4 py-4 flex flex-col gap-4">
          <Link href="/" onClick={() => setMenuOpen(false)} className="font-semibold text-verde py-2">
            Inicio
          </Link>
          <Link href="/productos" onClick={() => setMenuOpen(false)} className="font-semibold text-verde py-2">
            Productos
          </Link>
          <Link href="/contacto" onClick={() => setMenuOpen(false)} className="font-semibold text-verde py-2">
            Contacto
          </Link>
        </div>
      )}
    </header>
  );
}
