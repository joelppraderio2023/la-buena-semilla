"use client";

import { useState, useEffect } from "react";
import { products, categories } from "@/data/products";
import { getStock, saveStock, StockData } from "@/lib/adminStore";

export default function TabInventario() {
  const [stock, setStock] = useState<StockData>({});
  const [saved, setSaved] = useState(false);
  const [filterCat, setFilterCat] = useState("todos");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setStock(getStock());
  }, []);

  const getQty = (id: string) => stock[id]?.quantity ?? 0;
  const getThreshold = (id: string) => stock[id]?.alertThreshold ?? 5;
  const isLow = (id: string) => getQty(id) > 0 && getQty(id) <= getThreshold(id);
  const isEmpty = (id: string) => getQty(id) === 0;

  const update = (id: string, patch: Partial<StockData[string]>) => {
    setStock((prev) => ({
      ...prev,
      [id]: {
        ...{ quantity: getQty(id), alertThreshold: getThreshold(id) },
        ...prev[id],
        ...patch,
      },
    }));
  };

  const handleSave = () => {
    saveStock(stock);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const filtered = products.filter((p) => {
    const matchCat = filterCat === "todos" || p.category === filterCat;
    const matchSearch =
      search === "" || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const lowCount = products.filter((p) => isLow(p.id)).length;
  const emptyCount = products.filter((p) => isEmpty(p.id)).length;
  const okCount = products.length - lowCount - emptyCount;

  return (
    <div>
      {/* Resumen rápido */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white rounded-2xl p-4 border border-crema-dark/30 text-center">
          <div className="text-2xl font-black text-verde">{okCount}</div>
          <div className="text-xs text-texto/40 font-semibold mt-0.5">Con stock</div>
        </div>
        <div
          className={`rounded-2xl p-4 border text-center ${
            lowCount > 0 ? "bg-amber-50 border-amber-200" : "bg-white border-crema-dark/30"
          }`}
        >
          <div className={`text-2xl font-black ${lowCount > 0 ? "text-amber-500" : "text-verde"}`}>
            {lowCount}
          </div>
          <div className="text-xs text-texto/40 font-semibold mt-0.5">Stock bajo</div>
        </div>
        <div
          className={`rounded-2xl p-4 border text-center ${
            emptyCount > 0 ? "bg-red-50 border-red-200" : "bg-white border-crema-dark/30"
          }`}
        >
          <div className={`text-2xl font-black ${emptyCount > 0 ? "text-red-500" : "text-verde"}`}>
            {emptyCount}
          </div>
          <div className="text-xs text-texto/40 font-semibold mt-0.5">Sin stock</div>
        </div>
      </div>

      {/* Alertas activas */}
      {(lowCount > 0 || emptyCount > 0) && (
        <div className="mb-4 space-y-2">
          {emptyCount > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
              <span className="text-sm">🚨</span>
              <p className="text-xs font-semibold text-red-600">
                {products
                  .filter((p) => isEmpty(p.id))
                  .map((p) => p.name)
                  .join(", ")}{" "}
                — sin stock
              </p>
            </div>
          )}
          {lowCount > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
              <span className="text-sm">⚠️</span>
              <p className="text-xs font-semibold text-amber-700">
                {products
                  .filter((p) => isLow(p.id))
                  .map((p) => p.name)
                  .join(", ")}{" "}
                — stock bajo
              </p>
            </div>
          )}
        </div>
      )}

      {/* Filtros */}
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

      {/* Tabla */}
      <div className="bg-white rounded-2xl overflow-hidden border border-crema-dark/30">
        <div className="hidden sm:flex px-5 py-3 bg-crema/60 border-b border-crema-dark text-[11px] font-bold text-texto/45 uppercase tracking-wide gap-3">
          <div className="w-8 shrink-0" />
          <div className="flex-1">Producto</div>
          <div className="w-32 shrink-0 text-center">Cantidad en stock</div>
          <div className="w-36 shrink-0 text-center">Alerta si baja de</div>
          <div className="w-24 shrink-0">Estado</div>
        </div>

        <div className="divide-y divide-crema-dark/30">
          {filtered.map((product) => {
            const qty = getQty(product.id);
            const threshold = getThreshold(product.id);
            const low = isLow(product.id);
            const empty = isEmpty(product.id);

            return (
              <div
                key={product.id}
                className={`flex items-center gap-3 px-5 py-4 hover:bg-crema/20 transition flex-wrap sm:flex-nowrap ${
                  empty ? "bg-red-50/40" : low ? "bg-amber-50/40" : ""
                }`}
              >
                <div className="text-2xl w-8 shrink-0">{product.emoji}</div>

                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-verde">
                    {product.name}
                  </div>
                  <div className="text-xs text-texto/40">{product.unit}</div>
                </div>

                {/* Cantidad */}
                <div className="w-32 shrink-0">
                  <input
                    type="number"
                    min="0"
                    value={qty === 0 ? "" : qty}
                    onChange={(e) =>
                      update(product.id, { quantity: parseInt(e.target.value) || 0 })
                    }
                    placeholder="0"
                    className="w-full px-3 py-2 border border-crema-dark rounded-xl text-sm focus:outline-none focus:border-verde-light bg-crema/50 text-center"
                  />
                </div>

                {/* Umbral de alerta */}
                <div className="w-36 shrink-0">
                  <input
                    type="number"
                    min="0"
                    value={threshold}
                    onChange={(e) =>
                      update(product.id, {
                        alertThreshold: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-crema-dark rounded-xl text-sm focus:outline-none focus:border-verde-light bg-crema/50 text-center"
                  />
                </div>

                {/* Estado */}
                <div className="w-24 shrink-0">
                  {empty ? (
                    <span className="text-xs font-bold text-red-500 bg-red-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                      Sin stock
                    </span>
                  ) : low ? (
                    <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                      Stock bajo
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-verde/70 bg-verde/10 px-2.5 py-1 rounded-full">
                      OK
                    </span>
                  )}
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
          {saved ? "✓ Inventario guardado" : "Guardar inventario"}
        </button>
      </div>

      <p className="text-xs text-texto/30 text-center mt-4">
        El inventario se guarda en este dispositivo. La columna &quot;Alerta si baja de&quot; define el umbral de advertencia.
      </p>
    </div>
  );
}
