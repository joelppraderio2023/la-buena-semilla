import Link from "next/link";

export default function PagoFallidoPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 flex flex-col items-center justify-center text-center px-4 bg-crema">
      <div className="bg-white rounded-3xl p-10 max-w-md w-full border border-crema-dark/40 shadow-xl">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">❌</span>
        </div>
        <h1 className="font-display text-3xl text-verde font-black mb-2">
          El pago no se completó
        </h1>
        <p className="text-texto/50 text-sm mb-8 leading-relaxed">
          No pudimos procesar tu pago. Podés intentarlo de nuevo o elegir pagar en efectivo al retirar o recibir tu pedido.
        </p>
        <Link
          href="/checkout"
          className="block w-full bg-verde hover:bg-verde-mid text-white px-6 py-3.5 rounded-xl font-bold text-sm mb-3 transition-all hover:scale-[1.02]"
        >
          Volver al checkout
        </Link>
        <Link href="/" className="block text-sm text-texto/35 hover:text-verde transition-colors">
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
