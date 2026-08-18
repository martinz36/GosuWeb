'use client';

import React from 'react';
import Link from 'next/link';
import ShopNavbar from '@/components/ShopNavbar';
import ShopFooter from '@/components/ShopFooter';

export default function CheckoutSuccessPage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = React.useState<'es' | 'en'>('es');

  React.useEffect(() => {
    params.then((p) => setLocale(p.locale === 'en' ? 'en' : 'es'));
  }, [params]);

  const isEs = locale === 'es';

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#00e8ff] selection:text-black relative font-opensauce">
      
      <ShopNavbar locale={locale} dict={{}} />

      <main className="max-w-3xl mx-auto px-6 py-20 text-center space-y-8">
        
        {/* Success Icon Badge */}
        <div className="h-24 w-24 rounded-full bg-emerald-950/80 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center text-4xl mx-auto shadow-[0_0_30px_rgba(16,185,129,0.4)]">
          ✓
        </div>

        <div className="space-y-3">
          <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-900/80 text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full">
            {isEs ? 'PAGO CONFIRMADO CON ÉXITO' : 'PAYMENT SUCCESSFUL'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase font-sigher tracking-wider text-white glow-cyan">
            {isEs ? '¡GRACIAS POR TU COMPRA EN GOSU®!' : 'THANK YOU FOR YOUR PURCHASE!'}
          </h1>
          <p className="text-sm text-zinc-400 font-inter max-w-lg mx-auto">
            {isEs
              ? 'Hemos recibido tu pago y estamos preparando tu paquete con la máxima protección de 100 micras. Recibirás el número de seguimiento por WhatsApp y Email.'
              : 'Payment confirmed. We are packing your order with maximum 100 micron protection.'}
          </p>
        </div>

        {/* Order Details Summary Box */}
        <div className="rounded-3xl border border-zinc-850 bg-zinc-950 p-6 text-left space-y-4 max-w-md mx-auto">
          <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
            <span className="text-xs text-zinc-500 font-bold uppercase">Estado de la Orden:</span>
            <span className="bg-emerald-950 text-emerald-400 border border-emerald-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              PAGADO & PROCESANDO
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400 font-bold">Pasarela de Pago:</span>
            <span className="text-white font-mono">Mercado Pago Perú / Culqi</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400 font-bold">Tiempo de Despacho:</span>
            <span className="text-[#00e8ff] font-bold">24 a 48 Horas Háviles</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href={`/${locale}/shop`}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#00e8ff] text-black font-extrabold uppercase text-xs tracking-wider hover:bg-white transition-all shadow-[0_0_15px_rgba(0,232,255,0.3)]"
          >
            ← Volver a la Tienda GOSU®
          </Link>
          <a
            href="https://wa.me/51987654321?text=Hola%20GOSU,%20acabo%20de%20realizar%20una%20compra%20en%20la%20web"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-extrabold uppercase text-xs tracking-wider hover:border-emerald-500 hover:text-emerald-400 transition-all"
          >
            Contactar por WhatsApp 💬
          </a>
        </div>

      </main>

      <ShopFooter locale={locale} />

    </div>
  );
}
