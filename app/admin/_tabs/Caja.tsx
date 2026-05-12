"use client";

import { useState, useEffect, useMemo } from "react";
import { products, categories } from "@/data/products";
import { getPriceOverrides, PriceOverrides } from "@/lib/priceStore";
import {
  getCajaEntries,
  addCajaEntry,
  deleteCajaEntry,
  getStock,
  saveStock,
  generateId,
  CajaEntry,
  VentaItem,
  PaymentMethod,
  EntryCategory,
} from "@/lib/adminStore";

/* ── Helpers de display ── */
const METHOD_LABEL: Record<PaymentMethod, string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
  tarjeta: "Tarjeta",
};
const METHOD_EMOJI: Record<PaymentMethod, string> = {
  efectivo: "💵",
  transferencia: "📲",
  tarjeta: "💳",
};

const EGRESO_CATS: { value: EntryCategory; label: string; emoji: string }[] = [
  { value: "mercaderia", label: "Compra de mercadería", emoji: "🥦" },
  { value: "operativo",  label: "Gastos operativos",   emoji: "📦" },
  { value: "proveedor",  label: "Pago a proveedor",    emoji: "🤝" },
  { value: "otro",       label: "Otro gasto",          emoji: "📋" },
];

const CAT_LABEL: Record<EntryCategory, string> = {
  venta:      "Venta",
  mercaderia: "Mercadería",
  operativo:  "Operativo",
  proveedor:  "Proveedor",
  otro:       "Otro",
};

const fmt = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(n);

function todayPrefix() {
  return new Date().toISOString().split("T")[0];
}

function resolvePrice(id: string, basePrice: number, ovs: PriceOverrides): number {
  const ov = ovs[id];
  if (ov?.oferta && ov.precioOferta && ov.precioOferta > 0) return ov.precioOferta;
  return ov?.price ?? basePrice;
}

function fmtQty(q: number): string {
  return q % 1 === 0 ? q.toString() : q.toString();
}

/* ═══════════════════════════════════════════
   Panel: Nueva venta en local
═══════════════════════════════════════════ */
function PanelNuevaVenta({
  onConfirm,
  onCancel,
}: {
  onConfirm: (items: VentaItem[], method: PaymentMethod) => void;
  onCancel: () => void;
}) {
  const [priceOvs, setPriceOvs] = useState<PriceOverrides>({});
  const [qtys, setQtys] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("todos");
  const [method, setMethod] = useState<PaymentMethod>("efectivo");

  useEffect(() => {
    setPriceOvs(getPriceOverrides());
  }, []);

  const setQty = (id: string, v: number) => {
    const rounded = Math.round(Math.max(0, v) * 1000) / 1000;
    setQtys((prev) => ({ ...prev, [id]: rounded }));
  };

  const handleQtyInput = (id: string, raw: string) => {
    const v = parseFloat(raw.replace(",", "."));
    setQtys((prev) => ({ ...prev, [id]: isNaN(v) ? 0 : Math.max(0, v) }));
  };

  const filteredProducts = useMemo(
    () =>
      products.filter((p) => {
        const matchCat = filterCat === "todos" || p.category === filterCat;
        const matchSearch =
          search === "" || p.name.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
      }),
    [search, filterCat]
  );

  const selectedItems = useMemo<VentaItem[]>(
    () =>
      products
        .filter((p) => (qtys[p.id] ?? 0) > 0)
        .map((p) => ({
          productId: p.id,
          name: p.name,
          unit: p.unit,
          qty: qtys[p.id],
          price: resolvePrice(p.id, p.price, priceOvs),
        })),
    [qtys, priceOvs]
  );

  const total = selectedItems.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="bg-white rounded-2xl border border-crema-dark/40 mb-5 overflow-hidden">
      {/* Header */}
      <div className="bg-verde/8 border-b border-crema-dark/30 px-5 py-4 flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-verde text-base">
            Nueva venta en local
          </h3>
          <p className="text-xs text-texto/40 mt-0.5">
            Escribí la cantidad exacta — admite decimales (0.5, 0.250...)
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-texto/30 hover:text-texto text-2xl leading-none transition"
        >
          ×
        </button>
      </div>

      {/* Resumen del carrito */}
      {selectedItems.length > 0 && (
        <div className="border-b border-crema-dark/30 px-5 py-3 bg-verde/[0.03]">
          <p className="text-[10px] font-bold text-verde/60 uppercase tracking-wide mb-2">
            Seleccionado
          </p>
          <div className="space-y-1">
            {selectedItems.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-texto/70">
                  {products.find((p) => p.id === item.productId)?.emoji}{" "}
                  {item.name}{" "}
                  <span className="text-texto/40">
                    × {fmtQty(item.qty)} {item.unit}
                  </span>
                </span>
                <span className="font-semibold text-verde">
                  {fmt(item.price * item.qty)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Buscador y filtros */}
      <div className="px-5 pt-4 pb-3 space-y-3">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 border border-crema-dark rounded-xl text-sm focus:outline-none focus:border-verde-light"
        />
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCat(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                filterCat === cat.id
                  ? "bg-verde text-white"
                  : "bg-crema text-verde/70 border border-crema-dark"
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de productos */}
      <div className="max-h-72 overflow-y-auto divide-y divide-crema-dark/20">
        {filteredProducts.map((product) => {
          const qty = qtys[product.id] ?? 0;
          const price = resolvePrice(product.id, product.price, priceOvs);
          const ov = priceOvs[product.id];
          const isOferta = ov?.oferta && ov.precioOferta && ov.precioOferta > 0;

          return (
            <div
              key={product.id}
              className={`flex items-center gap-3 px-5 py-3 transition ${
                qty > 0 ? "bg-verde/[0.04]" : "hover:bg-crema/40"
              }`}
            >
              <span className="text-xl shrink-0">{product.emoji}</span>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-verde truncate">
                  {product.name}
                </div>
                <div className="text-xs text-texto/40 flex items-center gap-1.5">
                  {price > 0 ? fmt(price) : "Sin precio"} / {product.unit}
                  {isOferta && (
                    <span className="text-[9px] bg-terra text-white font-black px-1.5 py-0.5 rounded-full">
                      OFERTA
                    </span>
                  )}
                </div>
              </div>

              {/* Controles de cantidad — centro editable */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setQty(product.id, qty - 1)}
                  disabled={qty === 0}
                  className="w-7 h-7 rounded-lg bg-crema border border-crema-dark text-verde font-bold text-sm flex items-center justify-center disabled:opacity-30 hover:bg-crema-dark transition"
                >
                  −
                </button>

                <input
                  type="number"
                  min="0"
                  step="0.25"
                  value={qty === 0 ? "" : qty}
                  onChange={(e) => handleQtyInput(product.id, e.target.value)}
                  onFocus={(e) => e.target.select()}
                  placeholder="0"
                  className={`w-14 text-center text-sm font-bold border rounded-lg px-1 py-1 focus:outline-none transition ${
                    qty > 0
                      ? "border-verde/40 text-verde bg-verde/5 focus:border-verde"
                      : "border-crema-dark text-texto/30 bg-white focus:border-verde-light"
                  }`}
                />

                <button
                  onClick={() => setQty(product.id, qty + 1)}
                  className="w-7 h-7 rounded-lg bg-verde text-white font-bold text-sm flex items-center justify-center hover:bg-verde-mid transition"
                >
                  +
                </button>
              </div>

              {/* Subtotal de línea */}
              {qty > 0 && price > 0 && (
                <div className="w-20 text-right text-sm font-bold text-verde shrink-0">
                  {fmt(price * qty)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-crema-dark/30 px-5 py-4 bg-crema/40">
        <div className="flex items-center justify-between mb-4">
          <span className="font-display font-bold text-texto/70 text-base">Total</span>
          <span className="font-display font-black text-verde text-2xl">{fmt(total)}</span>
        </div>

        <div className="mb-4">
          <label className="text-[10px] font-bold text-texto/50 uppercase tracking-wide mb-2 block">
            Medio de pago
          </label>
          <div className="flex gap-2">
            {(["efectivo", "transferencia", "tarjeta"] as PaymentMethod[]).map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex flex-col items-center gap-0.5 ${
                  method === m
                    ? "bg-verde text-white"
                    : "bg-white text-texto/60 border border-crema-dark hover:border-verde/30"
                }`}
              >
                <span className="text-base">{METHOD_EMOJI[m]}</span>
                <span>{METHOD_LABEL[m]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onConfirm(selectedItems, method)}
            disabled={selectedItems.length === 0 || total === 0}
            className="flex-1 bg-verde text-white py-3 rounded-xl font-bold text-sm hover:bg-verde-mid transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Registrar venta — {fmt(total)}
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-3 rounded-xl text-texto/50 hover:text-texto text-sm transition border border-crema-dark"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Panel: Nuevo gasto
═══════════════════════════════════════════ */
function PanelNuevoGasto({
  onConfirm,
  onCancel,
}: {
  onConfirm: (entry: Omit<CajaEntry, "id" | "date">) => void;
  onCancel: () => void;
}) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<EntryCategory>("mercaderia");
  const [method, setMethod] = useState<PaymentMethod>("efectivo");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    const amt = parseFloat(amount.replace(",", "."));
    if (!description.trim()) { setError("Ingresá una descripción."); return; }
    if (!amt || amt <= 0) { setError("Ingresá un monto válido."); return; }

    onConfirm({
      description: description.trim(),
      amount: amt,
      isIngreso: false,
      paymentMethod: method,
      category,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-crema-dark/40 p-5 mb-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-texto text-base">
          📤 Nuevo gasto
        </h3>
        <button
          onClick={onCancel}
          className="text-texto/30 hover:text-texto text-2xl leading-none transition"
        >
          ×
        </button>
      </div>

      {/* Categoría */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-texto/50 mb-2 block">
          Tipo de gasto
        </label>
        <div className="grid grid-cols-2 gap-2">
          {EGRESO_CATS.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition border ${
                category === cat.value
                  ? "bg-texto/10 border-texto/30 text-texto"
                  : "bg-crema border-crema-dark text-texto/60 hover:border-texto/20"
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs font-semibold text-texto/50 mb-1 block">
            Descripción
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={
              category === "mercaderia"
                ? "Ej: Papa 50kg mayorista"
                : category === "proveedor"
                ? "Ej: Factura Verduras XYZ"
                : category === "operativo"
                ? "Ej: Nafta reparto"
                : "Descripción del gasto"
            }
            className="w-full px-3 py-2.5 border border-crema-dark rounded-xl text-sm focus:outline-none focus:border-verde-light"
            onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-texto/50 mb-1 block">
            Monto ($)
          </label>
          <input
            type="number"
            min="0"
            step="50"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2.5 border border-crema-dark rounded-xl text-sm focus:outline-none focus:border-verde-light"
            onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
          />
        </div>
      </div>

      {/* Medio de pago */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-texto/50 mb-2 block">
          Medio de pago
        </label>
        <div className="flex gap-2">
          {(["efectivo", "transferencia", "tarjeta"] as PaymentMethod[]).map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${
                method === m
                  ? "bg-texto/80 text-white"
                  : "bg-crema text-texto/60 border border-crema-dark"
              }`}
            >
              {METHOD_EMOJI[m]} {METHOD_LABEL[m]}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

      <div className="flex gap-2">
        <button
          onClick={handleConfirm}
          className="flex-1 bg-texto/80 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-texto transition"
        >
          Registrar gasto
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2.5 rounded-xl text-texto/50 hover:text-texto text-sm transition border border-crema-dark"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Componente principal
═══════════════════════════════════════════ */
type ActivePanel = "venta" | "gasto" | "manual" | null;

export default function TabCaja() {
  const [entries, setEntries] = useState<CajaEntry[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Formulario "otro ingreso" manual
  const [manualDesc, setManualDesc] = useState("");
  const [manualAmt, setManualAmt] = useState("");
  const [manualMethod, setManualMethod] = useState<PaymentMethod>("efectivo");
  const [manualError, setManualError] = useState("");

  useEffect(() => {
    setEntries(getCajaEntries());
  }, []);

  const reload = () => setEntries(getCajaEntries());

  const togglePanel = (p: ActivePanel) =>
    setActivePanel((prev) => (prev === p ? null : p));

  const todayEntries = entries.filter((e) => e.date.startsWith(todayPrefix()));
  const displayed = showAll ? entries : todayEntries;

  const todayIn = todayEntries.filter((e) => e.isIngreso).reduce((s, e) => s + e.amount, 0);
  const todayOut = todayEntries.filter((e) => !e.isIngreso).reduce((s, e) => s + e.amount, 0);
  const todayBalance = todayIn - todayOut;

  /* ── Confirmar venta ── */
  const handleVentaConfirm = (items: VentaItem[], method: PaymentMethod) => {
    const description = items.map((i) => `${i.name} ×${fmtQty(i.qty)}`).join(", ");
    const total = items.reduce((s, i) => s + i.price * i.qty, 0);

    addCajaEntry({
      id: generateId(),
      date: new Date().toISOString(),
      description,
      amount: total,
      isIngreso: true,
      paymentMethod: method,
      category: "venta",
      items,
    });

    const stock = getStock();
    for (const item of items) {
      const cur = stock[item.productId];
      if (cur && cur.quantity > 0) {
        stock[item.productId] = {
          ...cur,
          quantity: Math.max(0, cur.quantity - item.qty),
        };
      }
    }
    saveStock(stock);
    setActivePanel(null);
    reload();
  };

  /* ── Confirmar gasto ── */
  const handleGastoConfirm = (entry: Omit<CajaEntry, "id" | "date">) => {
    addCajaEntry({ id: generateId(), date: new Date().toISOString(), ...entry });
    setActivePanel(null);
    reload();
  };

  /* ── Confirmar ingreso manual ── */
  const handleManualAdd = () => {
    const amt = parseFloat(manualAmt.replace(",", "."));
    if (!manualDesc.trim()) { setManualError("Ingresá una descripción."); return; }
    if (!amt || amt <= 0) { setManualError("Ingresá un monto válido."); return; }

    addCajaEntry({
      id: generateId(),
      date: new Date().toISOString(),
      description: manualDesc.trim(),
      amount: amt,
      isIngreso: true,
      paymentMethod: manualMethod,
      category: "otro",
    });

    setManualDesc(""); setManualAmt(""); setManualError("");
    setActivePanel(null);
    reload();
  };

  const handleDelete = (id: string) => {
    if (!confirm("¿Eliminar este movimiento?")) return;
    deleteCajaEntry(id);
    reload();
  };

  return (
    <div>
      {/* Resumen del día */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-verde/10 rounded-2xl p-4 border border-verde/20 text-center">
          <div className="text-[10px] font-bold text-verde/60 uppercase tracking-wide mb-1">
            Ingresos hoy
          </div>
          <div className="text-xl font-black text-verde">{fmt(todayIn)}</div>
        </div>
        <div className="bg-red-50 rounded-2xl p-4 border border-red-100 text-center">
          <div className="text-[10px] font-bold text-red-400 uppercase tracking-wide mb-1">
            Egresos hoy
          </div>
          <div className="text-xl font-black text-red-500">{fmt(todayOut)}</div>
        </div>
        <div
          className={`rounded-2xl p-4 border text-center ${
            todayBalance >= 0 ? "bg-verde/5 border-verde/15" : "bg-red-50 border-red-100"
          }`}
        >
          <div className="text-[10px] font-bold text-texto/40 uppercase tracking-wide mb-1">
            Balance hoy
          </div>
          <div className={`text-xl font-black ${todayBalance >= 0 ? "text-verde" : "text-red-500"}`}>
            {fmt(todayBalance)}
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => togglePanel("venta")}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 ${
            activePanel === "venta"
              ? "bg-verde-mid text-white ring-2 ring-verde/40"
              : "bg-verde text-white hover:bg-verde-mid"
          }`}
        >
          🛒 Nueva venta
        </button>
        <button
          onClick={() => togglePanel("gasto")}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 ${
            activePanel === "gasto"
              ? "bg-texto/90 text-white ring-2 ring-texto/30"
              : "bg-white text-texto/70 border border-crema-dark hover:border-texto/30"
          }`}
        >
          📤 Nuevo gasto
        </button>
        <button
          onClick={() => togglePanel("manual")}
          title="Otro ingreso"
          className={`px-4 py-3 rounded-xl text-sm transition border ${
            activePanel === "manual"
              ? "bg-crema-dark border-texto/20 text-texto"
              : "bg-white border-crema-dark text-texto/50 hover:border-texto/20"
          }`}
        >
          📥
        </button>
      </div>

      {/* Paneles */}
      {activePanel === "venta" && (
        <PanelNuevaVenta
          onConfirm={handleVentaConfirm}
          onCancel={() => setActivePanel(null)}
        />
      )}

      {activePanel === "gasto" && (
        <PanelNuevoGasto
          onConfirm={handleGastoConfirm}
          onCancel={() => setActivePanel(null)}
        />
      )}

      {activePanel === "manual" && (
        <div className="bg-white rounded-2xl border border-crema-dark/40 p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-verde text-base">📥 Otro ingreso</h3>
            <button onClick={() => setActivePanel(null)} className="text-texto/30 hover:text-texto text-2xl leading-none">×</button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs font-semibold text-texto/50 mb-1 block">Descripción</label>
              <input
                type="text"
                value={manualDesc}
                onChange={(e) => setManualDesc(e.target.value)}
                placeholder="Ej: Anticipo pedido"
                className="w-full px-3 py-2.5 border border-crema-dark rounded-xl text-sm focus:outline-none focus:border-verde-light"
                onKeyDown={(e) => e.key === "Enter" && handleManualAdd()}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-texto/50 mb-1 block">Monto ($)</label>
              <input
                type="number"
                min="0"
                step="50"
                value={manualAmt}
                onChange={(e) => setManualAmt(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2.5 border border-crema-dark rounded-xl text-sm focus:outline-none focus:border-verde-light"
                onKeyDown={(e) => e.key === "Enter" && handleManualAdd()}
              />
            </div>
          </div>
          <div className="flex gap-1.5 mb-4">
            {(["efectivo", "transferencia", "tarjeta"] as PaymentMethod[]).map((m) => (
              <button
                key={m}
                onClick={() => setManualMethod(m)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${
                  manualMethod === m ? "bg-verde text-white" : "bg-crema text-texto/60 border border-crema-dark"
                }`}
              >
                {METHOD_EMOJI[m]} {METHOD_LABEL[m]}
              </button>
            ))}
          </div>
          {manualError && <p className="text-red-500 text-xs mb-3">{manualError}</p>}
          <div className="flex gap-2">
            <button onClick={handleManualAdd} className="flex-1 bg-verde text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-verde-mid transition">
              Guardar ingreso
            </button>
            <button onClick={() => { setActivePanel(null); setManualError(""); }} className="px-4 py-2.5 rounded-xl text-texto/50 hover:text-texto text-sm border border-crema-dark">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de movimientos */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-semibold text-texto/50">
          {showAll ? `${entries.length} movimientos en total` : `${todayEntries.length} movimientos hoy`}
        </span>
        <button onClick={() => setShowAll(!showAll)} className="text-xs text-verde/60 hover:text-verde underline transition">
          {showAll ? "Ver solo hoy" : "Ver historial"}
        </button>
      </div>

      {displayed.length === 0 ? (
        <div className="bg-white rounded-2xl border border-crema-dark/30 p-10 text-center">
          <p className="text-3xl mb-3">💰</p>
          <p className="text-texto/30 text-sm">
            {showAll ? "No hay movimientos registrados aún." : "No hay movimientos hoy."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden border border-crema-dark/30">
          <div className="divide-y divide-crema-dark/30">
            {displayed.map((entry) => {
              const d = new Date(entry.date);
              const dateStr = d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" });
              const timeStr = d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
              const isExpanded = expandedId === entry.id;
              const hasDetail = entry.items && entry.items.length > 0;

              return (
                <div key={entry.id}>
                  <div
                    className={`flex items-center gap-3 px-5 py-3.5 hover:bg-crema/20 transition ${hasDetail ? "cursor-pointer" : ""}`}
                    onClick={() => hasDetail && setExpandedId(isExpanded ? null : entry.id)}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      entry.isIngreso ? "bg-verde/10 text-verde" : "bg-red-100 text-red-500"
                    }`}>
                      {entry.isIngreso ? "↑" : "↓"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-texto truncate">
                        {entry.description}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-texto/40 mt-0.5 flex-wrap">
                        <span>{dateStr} {timeStr}</span>
                        <span>·</span>
                        <span>{METHOD_EMOJI[entry.paymentMethod]} {METHOD_LABEL[entry.paymentMethod]}</span>
                        <span>·</span>
                        <span>{CAT_LABEL[entry.category]}</span>
                        {hasDetail && (
                          <span className="text-verde/50 font-semibold">
                            · {entry.items!.length} ítem{entry.items!.length !== 1 ? "s" : ""} {isExpanded ? "▲" : "▼"}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={`font-black text-sm shrink-0 ${entry.isIngreso ? "text-verde" : "text-red-500"}`}>
                      {entry.isIngreso ? "+" : "−"}{fmt(entry.amount)}
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(entry.id); }}
                      className="text-texto/20 hover:text-red-400 transition text-xl leading-none shrink-0 ml-1"
                      title="Eliminar"
                    >
                      ×
                    </button>
                  </div>

                  {isExpanded && hasDetail && (
                    <div className="bg-crema/40 border-t border-crema-dark/20 px-5 py-3">
                      <p className="text-[10px] font-bold text-texto/40 uppercase tracking-wide mb-2">
                        Detalle de la venta
                      </p>
                      <div className="space-y-1">
                        {entry.items!.map((item) => {
                          const p = products.find((p) => p.id === item.productId);
                          return (
                            <div key={item.productId} className="flex items-center justify-between text-sm">
                              <span className="text-texto/70">
                                {p?.emoji} {item.name}{" "}
                                <span className="text-texto/40">
                                  × {fmtQty(item.qty)} {item.unit}
                                </span>
                              </span>
                              <span className="font-semibold text-verde">
                                {fmt(item.price * item.qty)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className="text-xs text-texto/25 text-center mt-4">
        Los movimientos se guardan en este dispositivo.
      </p>
    </div>
  );
}
