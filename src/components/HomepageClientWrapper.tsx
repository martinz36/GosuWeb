'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';

interface HomepageClientWrapperProps {
  htmlContent: string;
  locale: 'es' | 'en';
  dict: {
    cart: {
      title: string;
      empty: string;
      total: string;
      checkout: string;
      quantity: string;
      remove: string;
    };
  };
}

export default function HomepageClientWrapper({ htmlContent, locale, dict }: HomepageClientWrapperProps) {
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <div className="relative w-full h-full min-h-screen bg-black">
      {/* Inject original Framer HTML */}
      <div 
        className="w-full h-full"
        dangerouslySetInnerHTML={{ __html: htmlContent }} 
      />

      {/* Floating Cart Action Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-[0_0_20px_rgba(0,232,255,0.4)] border border-zinc-800 transition-all hover:bg-[#00e8ff] hover:scale-105"
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

      {/* Cart Sliding Drawer */}
      <CartDrawer locale={locale} dict={dict.cart} />
    </div>
  );
}
