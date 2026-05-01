"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";

function ProductosContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("categoria") || "todos";
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const cat = searchParams.get("categoria") || "todos";
    setActiveCategory(cat);
  }, [searchParams]);

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === "todos" || p.category === activeCategory;
    const matchSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Page header */}
      <div className="bg-verde py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="font-display text-4xl sm:text-5xl text-crema font-bold mb-2">
            Nuestros productos
          </h1>
          <p className="text-crema/60">
            {products.length} productos frescos disponibles
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-texto/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white rounded-xl border border-crema-dark text-sm focus:outline-none focus:border-verde-light"
            />
          </div>

          {/* Category filter — scrollable on mobile */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat.id
                    ? "bg-verde text-white shadow-md"
                    : "bg-white text-verde/70 hover:bg-crema-dark border border-crema-dark"
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-xs text-texto/40 mb-4 font-medium">
          {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
          {activeCategory !== "todos" ? ` en ${categories.find((c) => c.id === activeCategory)?.label}` : ""}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-texto/30">
            <div className="text-6xl mb-4">🔍</div>
            <p className="font-display text-xl">Sin resultados para &quot;{search}&quot;</p>
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("todos");
              }}
              className="mt-4 text-sm text-terra hover:underline"
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
    <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center text-verde/40">Cargando...</div>}>
      <ProductosContent />
    </Suspense>
  );
}
