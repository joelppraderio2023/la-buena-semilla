import { supabase } from "./supabase";

export interface ProductOverride {
  price: number;
  available: boolean;
  oferta?: boolean;
  precioOferta?: number;
}

export type PriceOverrides = Record<string, ProductOverride>;

const LOCAL_KEY = "lbs-overrides";

/* ── Formato ── */
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

/* ── Cache local (evita múltiples llamadas a Supabase) ── */
let _cache: PriceOverrides | null = null;

function readLocalCache(): PriceOverrides {
  if (typeof window === "undefined") return {};
  try {
    const s = localStorage.getItem(LOCAL_KEY);
    return s ? JSON.parse(s) : {};
  } catch {
    return {};
  }
}

function writeLocalCache(overrides: PriceOverrides) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_KEY, JSON.stringify(overrides));
  _cache = overrides;
}

/* ── Lectura ── */
export async function loadOverrides(): Promise<PriceOverrides> {
  if (_cache) return _cache;

  if (!supabase) {
    const local = readLocalCache();
    _cache = local;
    return local;
  }

  try {
    const { data, error } = await supabase
      .from("product_overrides")
      .select("*");

    if (error) throw error;

    const overrides: PriceOverrides = {};
    for (const row of data || []) {
      overrides[row.id] = {
        price:        row.price,
        available:    row.available,
        oferta:       row.oferta,
        precioOferta: row.precio_oferta,
      };
    }

    writeLocalCache(overrides);
    return overrides;
  } catch {
    const local = readLocalCache();
    _cache = local;
    return local;
  }
}

/* ── Escritura ── */
export async function saveOverrides(overrides: PriceOverrides): Promise<void> {
  if (!supabase) {
    writeLocalCache(overrides);
    return;
  }

  const rows = Object.entries(overrides).map(([id, ov]) => ({
    id,
    price:         ov.price,
    available:     ov.available,
    oferta:        ov.oferta        ?? false,
    precio_oferta: ov.precioOferta  ?? 0,
  }));

  const { error } = await supabase
    .from("product_overrides")
    .upsert(rows, { onConflict: "id" });

  if (error) throw error;

  writeLocalCache(overrides);
}

/* ── Invalidar cache (para forzar recarga desde DB) ── */
export function invalidateCache() {
  _cache = null;
}

/* ── Compatibilidad con código viejo (sync, solo localStorage) ── */
export function getPriceOverrides(): PriceOverrides {
  return readLocalCache();
}

export function savePriceOverrides(overrides: PriceOverrides): void {
  writeLocalCache(overrides);
}
