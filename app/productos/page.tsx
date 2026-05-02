"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";

function ProductosContent() {
  const searchParams     = useSearchParams();
  const initialCategory  = searchParams.get("categoria") || "todos";
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [search, setSearch]                 = useState("");

  useEffect(() => {
    setActiveCategory(searchParams.get("categoria") || "todos");
  }, [searchParams]);

  const filtered = products.filter((p) => {
    const matchCat    = activeCategory === "todos" || p.category === activeCategory;
    const matchSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const countFor = (id: string) =>
    id === "todos" ? products.length : products.filter((p) => p.category === id).length;

  return (
    <div className="min-h-screen pb-20">
      {/* Page header */}
      <div className="bg-verde relative overflow-hidden pt-24 pb-14">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-verde-mid/30 blob-1 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <p className="text-terra font-bold text-[11px] uppercase tracking-[0.14em] mb-2">
            La Buena Semilla
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-crema font-black mb-2">
            Nuestros productos
          </h1>
          <p className="text-crema/45 text-sm">
            {products.length} productos frescos seleccionados para vos.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-texto/30"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-white rounded-xl border border-crema-dark/60 text-sm focus:outline-none focus:border-verde-light focus:ring-2 focus:ring-verde-light/20 transition shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-texto/30 hover:text-texto/60 transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 flex-1">
            {categories.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 pl-3 pr-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border shrink-0 ${
                    active
                      ? "bg-verde text-white border-verde shadow-md shadow-verde/20"
                      : "bg-white text-verde/60 hover:text-verde border-crema-dark/60 hover:border-verde/30 hover:bg-crema-dark/30"
                  }`}
                >
                  <span className="text-base leading-none">{cat.emoji}</span>
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                      active ? "bg-white/20 text-white" : "bg-crema-dark text-verde/40"
                    }`}
                  >
                    {countFor(cat.id)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results count */}
        {(search || activeCategory !== "todos") && (
          <p className="text-[11px] text-texto/35 mb-4 font-semibold uppercase tracking-wide">
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
            {activeCategory !== "todos"
              ? ` en ${categories.find((c) => c.id === activeCategory)?.label}`
              : ""}
            {search ? ` para "${search}"` : ""}
          </p>
        )}

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-7xl mb-5 select-none">🔍</div>
            <h2 className="font-display text-2xl text-verde font-black mb-2">
              Sin resultados
            </h2>
            <p className="text-texto/40 text-sm mb-6">
              No encontramos productos para &quot;{search}&quot;
            </p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("todos"); }}
              className="bg-verde text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-verde-mid transition"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductosPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-24 flex items-center justify-center">
          <span className="text-4xl animate-bounce select-none">🥦</span>
        </div>
      }
    >
      <ProductosContent />
    </Suspense>
  );
}
