import React from 'react';
import { getDictionary } from '@/dictionaries';
import Navbar from '@/components/Navbar';
import CheckoutForm from '@/components/CheckoutForm';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function CheckoutPage({ params }: PageProps) {
  const { locale } = await params;
  const activeLocale = locale === 'en' ? 'en' : 'es';
  const dict = await getDictionary(activeLocale);
  const isEs = activeLocale === 'es';

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans">
      {/* Header / Navbar */}
      <Navbar locale={activeLocale} dict={dict} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-5xl font-black tracking-widest uppercase font-sigher text-white">
            {isEs ? 'COMPLETAR COMPRA' : 'CHECKOUT'}
          </h1>
          <p className="text-xs tracking-[0.2em] font-semibold text-zinc-500 uppercase">
            {isEs ? 'PAGO SEGURO Y GARANTIZADO' : 'SECURE & GUARANTEED PAYMENT'}
          </p>
        </div>

        {/* Checkout Form */}
        <CheckoutForm locale={activeLocale} dict={dict} />
      </main>

      {/* Footer */}
      <footer className="bg-black py-12 px-4 sm:px-6 lg:px-8 border-t border-zinc-900 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2">
            <span className="text-xl font-black tracking-wider uppercase font-sigher text-white glow-cyan">
              GOSU®
            </span>
            <p className="text-xs text-zinc-500">{dict.footer.rights}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
