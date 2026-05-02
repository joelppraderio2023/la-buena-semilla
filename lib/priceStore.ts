export interface ProductOverride {
  price: number;
  available: boolean;
  oferta?: boolean;
  precioOferta?: number;
}

export type PriceOverrides = Record<string, ProductOverride>;

const STORAGE_KEY = "lbs-overrides";

export function getPriceOverrides(): PriceOverrides {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function savePriceOverrides(overrides: PriceOverrides): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

export function formatPrice(price: number): string {
  if (price === 0) return "Consultar precio";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function calcDescuento(original: number, oferta: number): number {
  if (!original || !oferta || oferta >= original) return 0;
  return Math.round((1 - oferta / original) * 100);
}
