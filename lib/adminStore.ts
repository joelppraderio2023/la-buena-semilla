export type PaymentMethod = "efectivo" | "transferencia" | "tarjeta";
export type EntryCategory = "venta" | "mercaderia" | "operativo" | "proveedor" | "otro";

export interface VentaItem {
  productId: string;
  name: string;
  unit: string;
  qty: number;
  price: number;
}

export interface CajaEntry {
  id: string;
  date: string; // ISO string
  description: string;
  amount: number; // always positive
  isIngreso: boolean;
  paymentMethod: PaymentMethod;
  category: EntryCategory;
  items?: VentaItem[]; // detalle de productos vendidos
}

export interface StockItem {
  quantity: number;
  alertThreshold: number;
}

export type StockData = Record<string, StockItem>;

const STOCK_KEY = "lbs-stock";
const CAJA_KEY = "lbs-caja";

// ── Stock ──

export function getStock(): StockData {
  if (typeof window === "undefined") return {};
  try {
    const s = localStorage.getItem(STOCK_KEY);
    return s ? JSON.parse(s) : {};
  } catch {
    return {};
  }
}

export function saveStock(data: StockData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STOCK_KEY, JSON.stringify(data));
}

// ── Caja ──

export function getCajaEntries(): CajaEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const s = localStorage.getItem(CAJA_KEY);
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

export function saveCajaEntries(entries: CajaEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CAJA_KEY, JSON.stringify(entries));
}

export function addCajaEntry(entry: CajaEntry): void {
  const entries = getCajaEntries();
  saveCajaEntries([entry, ...entries]);
}

export function deleteCajaEntry(id: string): void {
  const entries = getCajaEntries();
  saveCajaEntries(entries.filter((e) => e.id !== id));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
