"use client";

import { Product } from "@/data/products";
import { useCart } from "@/lib/CartContext";
import { formatPrice, getPriceOverrides } from "@/lib/priceStore";
import { useState, useEffect } from "react";

interface Props {
  product: Product;
}

const categoryColors: Record<string, string> = {
  frutas: "bg-orange-100 text-orange-700",
  verduras: "bg-green-100 text-green-700",
  aceites: "bg-yellow-100 text-yellow-700",
  miel: "bg-amber-100 text-amber-700",
  condimentos: "bg-red-100 text-red-700",
};

const categoryLabels: Record<string, string> = {
  frutas: "Frutas",
  verduras: "Verduras",
  aceites: "Aceites",
  miel: "Miel",
  condimentos: "Condimentos",
};

export default function ProductCard({ product }: Props) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const [displayPrice, setDisplayPrice] = useState(product.price);
  const [isAvailable, setIsAvailable] = useState(product.available);

  useEffect(() => {
    const overrides = getPriceOverrides();
    if (overrides[product.id]) {
      setDisplayPrice(overrides[product.id].price);
      setIsAvailable(overrides[product.id].available);
    }
  }, [product.id]);

  const inCart = items.find((i) => i.id === product.id);

  const handleAdd = () => {
    addItem({ ...product, price: displayPrice });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden card-hover flex flex-col ${
        !isAvailable ? "opacity-60" : ""
      }`}
    >
      {/* Emoji section */}
      <div className="bg-crema/60 flex items-center justify-center py-8 text-6xl select-none">
        {product.emoji}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display font-semibold text-verde text-base leading-snug">
            {product.name}
          </h3>
          <span
            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${
              categoryColors[product.category]
            }`}
          >
            {categoryLabels[product.category]}
          </span>
        </div>

        <p className="text-xs text-texto/50 mb-3 leading-relaxed line-clamp-2">
          {product.description}
        </p>

        <div className="mt-auto">
          <div className="flex items-end justify-between mb-3">
            <div>
              <span
                className={`font-bold text-lg ${
                  displayPrice === 0 ? "text-terra text-sm" : "text-verde"
                }`}
              >
                {formatPrice(displayPrice)}
              </span>
              {displayPrice > 0 && (
                <span className="text-xs text-texto/40 ml-1">/ {product.unit}</span>
              )}
            </div>
            {inCart && (
              <span className="text-xs text-verde-light font-semibold">
                {inCart.quantity} en carrito
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={!isAvailable}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              !isAvailable
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : added
                ? "bg-verde-light text-white scale-95"
                : "bg-verde text-white hover:bg-verde-mid active:scale-95"
            }`}
          >
            {!isAvailable
              ? "Sin stock"
              : added
              ? "✓ Agregado"
              : "Agregar al carrito"}
          </button>
        </div>
      </div>
    </div>
  );
}
