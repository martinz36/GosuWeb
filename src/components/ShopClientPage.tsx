'use client';

import React from 'react';
import ShopNavbar from './ShopNavbar';
import ShopFooter from './ShopFooter';
import CatalogGrid from './CatalogGrid';
import CartDrawer from './CartDrawer';
import { useCart } from '@/context/CartContext';

interface ShopClientPageProps {
  locale: 'es' | 'en';
  dict: any;
  categories: any[];
  products: any[];
}

export default function ShopClientPage({
  locale,
  dict,
  categories,
  products,
}: ShopClientPageProps) {
  const isEs = locale === 'es';
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#00e8ff] selection:text-black relative" data-framer-cursor="c54oa2">
      
      {/* 1. Framer Style Navbar */}
      <ShopNavbar locale={locale} dict={dict} />

      {/* 2. Framer Hero Title & Subtitle */}
      <section className="py-16 px-4 sm:px-8 border-b border-zinc-900/80 bg-gradient-to-b from-zinc-950 via-black to-black text-center space-y-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00e8ff]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <span className="inline-block bg-zinc-900/90 border border-zinc-800 text-[#00e8ff] text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full font-opensauce shadow-[0_0_10px_rgba(0,232,255,0.2)]">
            GOSU® ACCESSORIES STORE
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase font-sigher tracking-wider text-white leading-tight glow-cyan">
            {isEs 
              ? 'ELEVANDO TU CONFIGURACIÓN. PRESERVANDO LO QUE MÁS IMPORTA: TU COLECCIÓN.' 
              : 'ELEVATING YOUR SETUP. PRESERVING WHAT MATTERS MOST: YOUR COLLECTION.'}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto font-medium leading-relaxed font-inter">
            {isEs
              ? 'Protección premium de 100 y 140 micras para TCG y juegos de mesa con stock en tiempo real y despacho directo.'
              : 'Premium 100 & 140 microns protection for TCG and board games with live stock and direct dispatch.'}
          </p>
        </div>
      </section>

      {/* 3. Dynamic 4-Column E-Commerce Storefront */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12 relative z-10">
        <CatalogGrid
          initialProducts={products}
          locale={locale}
          dict={dict}
        />
      </main>

      {/* 4. Framer Style Footer */}
      <ShopFooter locale={locale} />

      {/* Floating Cart Button & Sliding Cart Drawer */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-[0_0_20px_rgba(0,232,255,0.4)] border border-zinc-800 transition-all hover:bg-[#00e8ff] hover:scale-105"
        title={dict.cart.title}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff09bb] text-[10px] font-extrabold text-white animate-pulse">
            {cartCount}
          </span>
        )}
      </button>

      <CartDrawer locale={locale} dict={dict.cart} />

    </div>
  );
}
