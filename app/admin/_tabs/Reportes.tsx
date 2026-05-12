"use client";

import { useState, useEffect } from "react";
import { getCajaEntries, CajaEntry, PaymentMethod } from "@/lib/adminStore";

type Period = "hoy" | "semana" | "mes";

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

const fmt = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(n);

function getStartDate(period: Period): Date {
  const now = new Date();
  if (period === "hoy") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  if (period === "semana") {
    const d = new Date(now);
    d.setDate(d.getDate() - 6);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

interface DaySummary {
  label: string;
  ingresos: number;
  egresos: number;
}

function buildDailySeries(entries: CajaEntry[], period: Period): DaySummary[] {
  const days: Record<string, DaySummary> = {};
  const now = new Date();

  const dayCount = period === "hoy" ? 1 : period === "semana" ? 7 : now.getDate();
  for (let i = dayCount - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const key = d.toISOString().split("T")[0];
    const label =
      period === "hoy"
        ? "Hoy"
        : d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" });
    days[key] = { label, ingresos: 0, egresos: 0 };
  }

  const start = getStartDate(period);
  for (const e of entries) {
    const d = new Date(e.date);
    if (d < start) continue;
    const key = d.toISOString().split("T")[0];
    if (!days[key]) continue;
    if (e.isIngreso) days[key].ingresos += e.amount;
    else days[key].egresos += e.amount;
  }

  return Object.values(days);
}

export default function TabReportes() {
  const [all, setAll] = useState<CajaEntry[]>([]);
  const [period, setPeriod] = useState<Period>("hoy");

  useEffect(() => {
    setAll(getCajaEntries());
  }, []);

  const start = getStartDate(period);
  const filtered = all.filter((e) => new Date(e.date) >= start);

  const ingresos = filtered.filter((e) => e.isIngreso);
  const egresos = filtered.filter((e) => !e.isIngreso);

  const totalIn = ingresos.reduce((s, e) => s + e.amount, 0);
  const totalOut = egresos.reduce((s, e) => s + e.amount, 0);
  const balance = totalIn - totalOut;

  const byMethod = (["efectivo", "transferencia", "tarjeta"] as PaymentMethod[])
    .map((m) => ({
      method: m,
      total: ingresos.filter((e) => e.paymentMethod === m).reduce((s, e) => s + e.amount, 0),
      count: ingresos.filter((e) => e.paymentMethod === m).length,
    }))
    .filter((x) => x.total > 0)
    .sort((a, b) => b.total - a.total);

  const ventasTotal = ingresos
    .filter((e) => e.category === "venta")
    .reduce((s, e) => s + e.amount, 0);
  const otrosIn = ingresos
    .filter((e) => e.category !== "venta")
    .reduce((s, e) => s + e.amount, 0);

  const dailySeries = buildDailySeries(all, period);
  const maxBar = Math.max(...dailySeries.map((d) => Math.max(d.ingresos, d.egresos)), 1);

  const periodLabel: Record<Period, string> = {
    hoy: "hoy",
    semana: "los últimos 7 días",
    mes: "este mes",
  };

  return (
    <div>
      {/* Selector de período */}
      <div className="flex gap-2 mb-6">
        {(["hoy", "semana", "mes"] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
              period === p
                ? "bg-verde text-white"
                : "bg-white text-verde/70 border border-crema-dark"
            }`}
          >
            {p === "hoy" ? "Hoy" : p === "semana" ? "Esta semana" : "Este mes"}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-crema-dark/30 p-12 text-center">
          <p className="text-4xl mb-3">📊</p>
          <p className="text-texto/40 text-sm">
            No hay movimientos para {periodLabel[period]}.
          </p>
          <p className="text-texto/25 text-xs mt-1">
            Registrá ventas y gastos en la pestaña Caja.
          </p>
        </div>
      ) : (
        <>
          {/* Tarjetas de resumen */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-verde/10 rounded-2xl p-5 border border-verde/20">
              <div className="text-[10px] font-bold text-verde/60 uppercase tracking-wide mb-2">
                Ingresos
              </div>
              <div className="text-2xl font-black text-verde">{fmt(totalIn)}</div>
              <div className="text-xs text-texto/40 mt-1">
                {ingresos.length} movimiento{ingresos.length !== 1 ? "s" : ""}
              </div>
            </div>
            <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
              <div className="text-[10px] font-bold text-red-400 uppercase tracking-wide mb-2">
                Egresos
              </div>
              <div className="text-2xl font-black text-red-500">{fmt(totalOut)}</div>
              <div className="text-xs text-texto/40 mt-1">
                {egresos.length} movimiento{egresos.length !== 1 ? "s" : ""}
              </div>
            </div>
            <div
              className={`rounded-2xl p-5 border ${
                balance >= 0 ? "bg-verde/5 border-verde/15" : "bg-red-50 border-red-100"
              }`}
            >
              <div className="text-[10px] font-bold text-texto/40 uppercase tracking-wide mb-2">
                Balance neto
              </div>
              <div
                className={`text-2xl font-black ${
                  balance >= 0 ? "text-verde" : "text-red-500"
                }`}
              >
                {fmt(balance)}
              </div>
              <div
                className={`text-xs mt-1 font-semibold ${
                  balance >= 0 ? "text-verde/50" : "text-red-400"
                }`}
              >
                {balance >= 0 ? "✓ En positivo" : "⚠ En negativo"}
              </div>
            </div>
          </div>

          {/* Gráfico de barras diario (ocultar si es solo "hoy") */}
          {period !== "hoy" && dailySeries.length > 1 && (
            <div className="bg-white rounded-2xl border border-crema-dark/30 p-5 mb-4">
              <h3 className="font-display font-bold text-verde text-sm mb-4">
                Evolución diaria
              </h3>
              <div className="flex items-end gap-1.5 h-28">
                {dailySeries.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex gap-0.5 items-end" style={{ height: "88px" }}>
                      <div
                        className="flex-1 bg-verde/30 rounded-t transition-all"
                        style={{ height: `${(day.ingresos / maxBar) * 88}px` }}
                        title={`Ingresos: ${fmt(day.ingresos)}`}
                      />
                      <div
                        className="flex-1 bg-red-300/60 rounded-t transition-all"
                        style={{ height: `${(day.egresos / maxBar) * 88}px` }}
                        title={`Egresos: ${fmt(day.egresos)}`}
                      />
                    </div>
                    <span className="text-[9px] text-texto/35 font-semibold">
                      {day.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-xs text-texto/40">
                  <span className="w-3 h-3 bg-verde/30 rounded-sm inline-block" />
                  Ingresos
                </span>
                <span className="flex items-center gap-1.5 text-xs text-texto/40">
                  <span className="w-3 h-3 bg-red-300/60 rounded-sm inline-block" />
                  Egresos
                </span>
              </div>
            </div>
          )}

          {/* Dos columnas */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Ingresos por medio de pago */}
            <div className="bg-white rounded-2xl border border-crema-dark/30 p-5">
              <h3 className="font-display font-bold text-verde text-sm mb-4">
                Ingresos por medio de pago
              </h3>
              {byMethod.length === 0 ? (
                <p className="text-xs text-texto/30">Sin ingresos en este período.</p>
              ) : (
                <div className="space-y-4">
                  {byMethod.map((item) => {
                    const pct =
                      totalIn > 0 ? Math.round((item.total / totalIn) * 100) : 0;
                    return (
                      <div key={item.method}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-sm font-semibold text-texto/70">
                            {METHOD_EMOJI[item.method]} {METHOD_LABEL[item.method]}
                          </span>
                          <span className="text-sm font-black text-verde">
                            {fmt(item.total)}
                          </span>
                        </div>
                        <div className="h-2 bg-crema-dark/40 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-verde rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="text-xs text-texto/30 mt-0.5">
                          {pct}% · {item.count} venta{item.count !== 1 ? "s" : ""}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Resumen financiero */}
            <div className="bg-white rounded-2xl border border-crema-dark/30 p-5">
              <h3 className="font-display font-bold text-verde text-sm mb-4">
                Resumen financiero
              </h3>
              <div className="space-y-0">
                <div className="flex justify-between items-center py-3 border-b border-crema-dark/30">
                  <span className="text-sm text-texto/60">💰 Ventas</span>
                  <span className="font-bold text-verde">{fmt(ventasTotal)}</span>
                </div>
                {otrosIn > 0 && (
                  <div className="flex justify-between items-center py-3 border-b border-crema-dark/30">
                    <span className="text-sm text-texto/60">📥 Otros ingresos</span>
                    <span className="font-bold text-verde">{fmt(otrosIn)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-3 border-b border-crema-dark/30">
                  <span className="text-sm text-texto/60">📤 Gastos</span>
                  <span className="font-bold text-red-500">{fmt(totalOut)}</span>
                </div>
                <div className="flex justify-between items-center pt-3">
                  <span className="text-sm font-bold text-texto/80">
                    Balance neto
                  </span>
                  <span
                    className={`font-black text-base ${
                      balance >= 0 ? "text-verde" : "text-red-500"
                    }`}
                  >
                    {fmt(balance)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-texto/25 text-center mt-4">
            {filtered.length} movimiento{filtered.length !== 1 ? "s" : ""} en{" "}
            {periodLabel[period]} · datos guardados en este dispositivo
          </p>
        </>
      )}
    </div>
  );
}
