"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const TabProductos  = dynamic(() => import("./_tabs/Productos"),  { ssr: false });
const TabInventario = dynamic(() => import("./_tabs/Inventario"), { ssr: false });
const TabCaja       = dynamic(() => import("./_tabs/Caja"),       { ssr: false });
const TabReportes   = dynamic(() => import("./_tabs/Reportes"),   { ssr: false });

const ADMIN_PASSWORD = "Salvacion777+";

type Tab = "productos" | "inventario" | "caja" | "reportes";

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "productos",  label: "Productos",  emoji: "🛒" },
  { id: "inventario", label: "Inventario", emoji: "📦" },
  { id: "caja",       label: "Caja",       emoji: "💰" },
  { id: "reportes",   label: "Reportes",   emoji: "📊" },
];

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword]           = useState("");
  const [error, setError]                 = useState("");
  const [activeTab, setActiveTab]         = useState<Tab>("productos");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Contraseña incorrecta");
    }
  };

  /* ── Login ── */
  if (!authenticated) {
    return (
      <div className="min-h-screen pt-16 bg-crema flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-xl border border-crema-dark/40">
          <div className="text-center mb-6">
            <span className="text-4xl">🌱</span>
            <h1 className="font-display font-bold text-verde text-2xl mt-2">
              Panel de Administración
            </h1>
            <p className="text-texto/50 text-sm mt-1">La Buena Semilla</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-texto/60 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-crema-dark focus:outline-none focus:border-verde-light text-sm"
                autoFocus
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-verde text-white py-3 rounded-xl font-semibold hover:bg-verde-mid transition"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ── Panel ── */
  return (
    <div className="min-h-screen pt-16 pb-16 bg-crema">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="bg-verde rounded-3xl p-6 mt-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl text-white font-bold">
              Panel de Administración
            </h1>
            <p className="text-white/50 text-sm">La Buena Semilla</p>
          </div>
          <button
            onClick={() => setAuthenticated(false)}
            className="px-4 py-2.5 rounded-xl text-white/60 hover:text-white text-sm transition border border-white/20 hover:border-white/40"
          >
            Salir
          </button>
        </div>

        {/* Tabs nav */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? "bg-verde text-white shadow-sm"
                  : "bg-white text-verde/70 border border-crema-dark hover:border-verde/30"
              }`}
            >
              <span>{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenido de la pestaña activa */}
        {activeTab === "productos"  && <TabProductos />}
        {activeTab === "inventario" && <TabInventario />}
        {activeTab === "caja"       && <TabCaja />}
        {activeTab === "reportes"   && <TabReportes />}
      </div>
    </div>
  );
}
