"use client";

import { Product } from "@/data/products";
import { useCart } from "@/lib/CartContext";
import { formatPrice, loadOverrides, calcDescuento } from "@/lib/priceStore";
import { useState, useEffect } from "react";

interface Props {
  product: Product;
}

const categoryBadge: Record<string, string> = {
  frutas:      "bg-terra/10 text-terra-dark",
  verduras:    "bg-verde-light/15 text-verde",
  aceites:     "bg-amber-50 text-amber-700",
  miel:        "bg-amber-100 text-amber-800",
  condimentos: "bg-red-50 text-red-600",
};

const categoryLabels: Record<string, string> = {
  frutas:      "Frutas",
  verduras:    "Verduras",
  aceites:     "Aceites",
  miel:        "Miel",
  condimentos: "Condimentos",
};

const categoryGradient: Record<string, string> = {
  frutas:      "from-terra/8 to-crema",
  verduras:    "from-verde-suave to-crema",
  aceites:     "from-amber-50 to-crema",
  miel:        "from-amber-100/50 to-crema",
  condimentos: "from-red-50 to-crema",
};

export default function ProductCard({ product }: Props) {
  const { addItem, items } = useCart();
  const [added, setAdded]               = useState(false);
  const [displayPrice, setDisplayPrice] = useState(product.price);
  const [isAvailable, setIsAvailable]   = useState(product.available);
  const [enOferta, setEnOferta]         = useState(false);
  const [precioOferta, setPrecioOferta] = useState(0);

  useEffect(() => {
    loadOverrides().then((overrides) => {
      const ov = overrides[product.id];
      if (ov) {
        setDisplayPrice(ov.price);
        setIsAvailable(ov.available);
        if (ov.oferta && ov.precioOferta && ov.precioOferta > 0) {
          setEnOferta(true);
          setPrecioOferta(ov.precioOferta);
        }
      }
    });
  }, [product.id]);

  const inCart   = items.find((i) => i.id === product.id);
  const descuento = enOferta ? calcDescuento(displayPrice, precioOferta) : 0;
  const precioFinal = enOferta && precioOferta > 0 ? precioOferta : displayPrice;

  const handleAdd = () => {
    addItem({ ...product, price: precioFinal });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      className={`group bg-white rounded-2xl overflow-hidden card-hover flex flex-col border transition-all duration-200 ${
        enOferta
          ? "border-terra/30 shadow-sm shadow-terra/10"
          : "border-crema-dark/40"
      } ${!isAvailable ? "opacity-55" : ""}`}
    >
      {/* Emoji area */}
      <div
        className={`relative bg-gradient-to-b ${categoryGradient[product.category]} flex items-center justify-center py-8 select-none overflow-hidden`}
      >
        <span className="text-6xl group-hover:scale-110 transition-transform duration-300 inline-block drop-shadow-sm">
          {product.emoji}
        </span>

        {/* Descuento badge */}
        {enOferta && descuento > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-terra text-white text-[10px] font-black px-2 py-0.5 rounded-full leading-none">
            -{descuento}%
          </span>
        )}

        {/* In-cart badge */}
        {inCart && (
          <span className="absolute top-2.5 right-2.5 bg-verde text-white text-[10px] font-bold px-2 py-0.5 rounded-full leading-none">
            {inCart.quantity} ×
          </span>
        )}

        {/* Category badge */}
        <span
          className={`absolute bottom-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
            categoryBadge[product.category]
          } ${enOferta && descuento > 0 ? "left-auto right-2.5" : ""}`}
        >
          {categoryLabels[product.category]}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-bold text-verde text-[15px] leading-snug mb-1">
          {product.name}
        </h3>

        <p className="text-[11px] text-texto/45 mb-3 leading-relaxed line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="mt-auto space-y-2.5">
          {/* Price */}
          <div className="flex items-baseline gap-2 flex-wrap">
            {enOferta && precioOferta > 0 ? (
              <>
                <span className="font-display font-black text-xl leading-none text-terra">
                  {formatPrice(precioOferta)}
                </span>
                {displayPrice > 0 && (
                  <span className="text-[11px] text-texto/35 line-through">
                    {formatPrice(displayPrice)}
                  </span>
                )}
                <span className="text-[10px] text-texto/35">/ {product.unit}</span>
              </>
            ) : (
              <>
                <span
                  className={`font-display font-black text-xl leading-none ${
                    displayPrice === 0 ? "text-terra text-sm font-sans font-semibold" : "text-verde"
                  }`}
                >
                  {formatPrice(displayPrice)}
                </span>
                {displayPrice > 0 && (
                  <span className="text-[11px] text-texto/35 font-medium">
                    / {product.unit}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Add button */}
          <button
            onClick={handleAdd}
            disabled={!isAvailable}
            className={`w-full py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 ${
              !isAvailable
                ? "bg-crema-dark text-texto/30 cursor-not-allowed"
                : added
                ? "bg-verde-light text-white scale-[0.97]"
                : enOferta
                ? "bg-terra hover:bg-terra-dark text-white active:scale-95"
                : "bg-verde text-white hover:bg-verde-mid active:scale-95"
            }`}
          >
            {!isAvailable ? "Sin stock" : added ? "✓ Agregado" : "Agregar al carrito"}
          </button>
        </div>
      </div>
    </div>
  );
}
