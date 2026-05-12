"use client";

import { useState, useEffect } from "react";
import { products, categories } from "@/data/products";
import {
  loadOverrides,
  saveOverrides,
  invalidateCache,
  PriceOverrides,
  calcDescuento,
} from "@/lib/priceStore";

export default function TabProductos() {
  const [overrides, setOverrides] = useState<PriceOverrides>({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterCat, setFilterCat] = useState("todos");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    loadOverrides()
      .then(setOverrides)
      .finally(() => setLoading(false));
  }, []);

  const getOv = (id: string) => overrides[id];
  const getPrice = (id: string) =>
    getOv(id)?.price ?? products.find((p) => p.id === id)?.price ?? 0;
  const getAvailable = (id: string) =>
    getOv(id)?.available ?? products.find((p) => p.id === id)?.available ?? true;
  const getOferta = (id: string) => getOv(id)?.oferta ?? false;
  const getPrecioOv = (id: string) => getOv(id)?.precioOferta ?? 0;

  const update = (id: string, patch: Partial<PriceOverrides[string]>) => {
    setOverrides((prev) => {
      const base = prev[id] ?? {
        price: products.find((p) => p.id === id)?.price ?? 0,
        available: products.find((p) => p.id === id)?.available ?? true,
      };
      return { ...prev, [id]: { ...base, ...patch } };
    });
  };

  const setPrice = (id: string, v: string) =>
    update(id, { price: parseFloat(v.replace(",", ".")) || 0 });
  const toggleAvailable = (id: string) =>
    update(id, { available: !getAvailable(id) });
  const toggleOferta = (id: string) =>
    update(id, { oferta: !getOferta(id) });
  const setPrecioOferta = (id: string, v: string) =>
    update(id, { precioOferta: parseFloat(v.replace(",", ".")) || 0 });

  const handleSave = async () => {
    try {
      await saveOverrides(overrides);
      invalidateCache();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Error al guardar. Verificá tu conexión.");
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchCat = filterCat === "todos" || p.category === filterCat;
    const matchSearch =
      search === "" || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const ofertasActivas = products.filter((p) => getOferta(p.id)).length;

  if (loading) {
    return (
      <div className="text-center py-10 text-verde/40 text-sm font-semibold">
        Cargando precios desde la base de datos...
      </div>
    );
  }

  return (
    <div>
      {ofertasActivas > 0 && (
        <div className="bg-terra/10 border border-terra/20 rounded-2xl px-5 py-3 mb-5 flex items-center gap-3">
          <span className="text-xl">🔥</span>
          <p className="text-sm font-semibold text-terra-dark">
            {ofertasActivas} producto{ofertasActivas !== 1 ? "s" : ""} en
            oferta activa — visible{ofertasActivas !== 1 ? "s" : ""} en la
            página de inicio.
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
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

      <div className="bg-white rounded-2xl overflow-hidden border border-crema-dark/30">
        <div className="hidden sm:flex px-5 py-3 bg-crema/60 border-b border-crema-dark text-[11px] font-bold text-texto/45 uppercase tracking-wide gap-3">
          <div className="w-8 shrink-0" />
          <div className="flex-1">Producto</div>
          <div className="w-28 shrink-0">Precio normal</div>
          <div className="w-36 shrink-0 text-terra">🔥 Oferta del día</div>
          <div className="w-20 shrink-0">Visible</div>
        </div>

        <div className="divide-y divide-crema-dark/30">
          {filteredProducts.map((product) => {
            const price = getPrice(product.id);
            const available = getAvailable(product.id);
            const oferta = getOferta(product.id);
            const precioOv = getPrecioOv(product.id);
            const descuento = oferta ? calcDescuento(price, precioOv) : 0;

            return (
              <div
                key={product.id}
                className={`flex items-center gap-3 px-5 py-4 hover:bg-crema/20 transition flex-wrap sm:flex-nowrap ${
                  !available ? "opacity-50" : ""
                } ${oferta ? "bg-terra/[0.03]" : ""}`}
              >
                <div className="text-2xl w-8 shrink-0">{product.emoji}</div>

                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-verde flex items-center gap-1.5">
                    {product.name}
                    {oferta && (
                      <span className="text-[9px] bg-terra text-white font-black px-1.5 py-0.5 rounded-full">
                        OFERTA
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-texto/40">{product.unit}</div>
                </div>

                <div className="w-28 shrink-0">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-texto/40">
                      $
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={price === 0 ? "" : price}
                      onChange={(e) => setPrice(product.id, e.target.value)}
                      placeholder="0"
                      className="w-full pl-7 pr-2 py-2 border border-crema-dark rounded-xl text-sm focus:outline-none focus:border-verde-light bg-crema/50"
                    />
                  </div>
                </div>

                <div className="w-36 shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => toggleOferta(product.id)}
                    title={oferta ? "Desactivar oferta" : "Activar oferta"}
                    className={`relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0 ${
                      oferta ? "bg-terra" : "bg-crema-darker"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                        oferta ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </button>

                  {oferta && (
                    <div className="relative flex-1">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-texto/40">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={precioOv === 0 ? "" : precioOv}
                        onChange={(e) =>
                          setPrecioOferta(product.id, e.target.value)
                        }
                        placeholder="0"
                        className="w-full pl-6 pr-2 py-2 border border-terra/40 rounded-xl text-sm focus:outline-none focus:border-terra bg-terra/5"
                      />
                      {descuento > 0 && (
                        <span className="absolute -top-2 -right-1 bg-terra text-white text-[9px] font-black px-1 py-0.5 rounded-full leading-none">
                          -{descuento}%
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="w-20 shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => toggleAvailable(product.id)}
                    className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
                      available ? "bg-verde-light" : "bg-crema-darker"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                        available ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                  <span className="text-xs text-texto/40 hidden sm:inline">
                    {available ? "Visible" : "Oculto"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
        Los cambios se guardan en la base de datos y se reflejan en la tienda.
      </p>
    </div>
  );
}
