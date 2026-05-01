"use client";

import { useState, useEffect } from "react";
import { products, categories } from "@/data/products";
import { getPriceOverrides, savePriceOverrides, PriceOverrides } from "@/lib/priceStore";

const ADMIN_PASSWORD = "admin123";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [overrides, setOverrides] = useState<PriceOverrides>({});
  const [saved, setSaved] = useState(false);
  const [filterCat, setFilterCat] = useState("todos");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (authenticated) {
      setOverrides(getPriceOverrides());
    }
  }, [authenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Contraseña incorrecta");
    }
  };

  const getProductValue = (id: string, field: "price" | "available") => {
    if (field === "price") {
      return overrides[id]?.price ?? products.find((p) => p.id === id)?.price ?? 0;
    }
    return overrides[id]?.available ?? products.find((p) => p.id === id)?.available ?? true;
  };

  const setPrice = (id: string, value: string) => {
    const num = parseFloat(value.replace(",", ".")) || 0;
    setOverrides((prev) => ({
      ...prev,
      [id]: {
        price: num,
        available: (prev[id]?.available ?? products.find((p) => p.id === id)?.available) ?? true,
      },
    }));
  };

  const toggleAvailable = (id: string) => {
    const current =
      overrides[id]?.available ?? products.find((p) => p.id === id)?.available ?? true;
    setOverrides((prev) => ({
      ...prev,
      [id]: {
        price: prev[id]?.price ?? products.find((p) => p.id === id)?.price ?? 0,
        available: !current,
      },
    }));
  };

  const handleSave = () => {
    savePriceOverrides(overrides);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const filteredProducts = products.filter((p) => {
    const matchCat = filterCat === "todos" || p.category === filterCat;
    const matchSearch =
      search === "" || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (!authenticated) {
    return (
      <div className="min-h-screen pt-16 bg-crema flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-xl">
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

          <p className="text-[10px] text-texto/30 text-center mt-4">
            Contraseña por defecto: admin123
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-16 bg-crema">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="bg-verde rounded-3xl p-6 mt-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl text-white font-bold">
              Panel de Administración
            </h1>
            <p className="text-white/50 text-sm">
              Administrá precios y disponibilidad de productos
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                saved
                  ? "bg-verde-light text-white"
                  : "bg-white text-verde hover:bg-crema"
              }`}
            >
              {saved ? "✓ Guardado" : "Guardar cambios"}
            </button>
            <button
              onClick={() => setAuthenticated(false)}
              className="px-4 py-2.5 rounded-xl text-white/60 hover:text-white text-sm transition"
            >
              Salir
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-crema-dark bg-white text-sm focus:outline-none focus:border-verde-light flex-1 max-w-xs"
          />
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCat(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  filterCat === cat.id
                    ? "bg-verde text-white"
                    : "bg-white text-verde/70 border border-crema-dark"
                }`}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products table */}
        <div className="bg-white rounded-2xl overflow-hidden border border-crema-dark/30">
          <div className="hidden sm:grid grid-cols-12 px-5 py-3 bg-crema/60 text-xs font-bold text-texto/50 uppercase tracking-wide border-b border-crema-dark">
            <div className="col-span-1" />
            <div className="col-span-4">Producto</div>
            <div className="col-span-2">Categoría</div>
            <div className="col-span-3">Precio ($)</div>
            <div className="col-span-2">Disponible</div>
          </div>

          <div className="divide-y divide-crema-dark/30">
            {filteredProducts.map((product) => {
              const price = getProductValue(product.id, "price") as number;
              const available = getProductValue(product.id, "available") as boolean;
              return (
                <div
                  key={product.id}
                  className={`grid grid-cols-2 sm:grid-cols-12 gap-2 items-center px-5 py-4 hover:bg-crema/30 transition ${
                    !available ? "opacity-50" : ""
                  }`}
                >
                  <div className="col-span-1 text-2xl">{product.emoji}</div>
                  <div className="col-span-1 sm:col-span-4">
                    <div className="font-semibold text-sm text-verde">{product.name}</div>
                    <div className="text-xs text-texto/40">{product.unit}</div>
                  </div>
                  <div className="col-span-2 hidden sm:block">
                    <span className="text-xs font-medium text-texto/50 capitalize">
                      {product.category}
                    </span>
                  </div>
                  <div className="col-span-1 sm:col-span-3">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-texto/40 font-medium">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={price === 0 ? "" : price}
                        onChange={(e) => setPrice(product.id, e.target.value)}
                        placeholder="0"
                        className="w-full pl-7 pr-3 py-2 border border-crema-dark rounded-xl text-sm focus:outline-none focus:border-verde-light bg-crema/50"
                      />
                    </div>
                  </div>
                  <div className="col-span-1 sm:col-span-2 flex items-center">
                    <button
                      onClick={() => toggleAvailable(product.id)}
                      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                        available ? "bg-verde-light" : "bg-crema-darker"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                          available ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                    <span className="ml-2 text-xs text-texto/50 hidden sm:inline">
                      {available ? "Sí" : "No"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Save reminder */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
              saved
                ? "bg-verde-light text-white"
                : "bg-verde text-white hover:bg-verde-mid"
            }`}
          >
            {saved ? "✓ Cambios guardados" : "Guardar cambios"}
          </button>
        </div>

        <p className="text-xs text-texto/30 text-center mt-4">
          Los cambios se guardan localmente en este dispositivo. Para múltiples
          dispositivos, considera una base de datos.
        </p>
      </div>
    </div>
  );
}
