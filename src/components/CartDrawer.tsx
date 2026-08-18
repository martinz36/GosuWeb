'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

interface CartDrawerProps {
  locale: 'es' | 'en';
  dict: {
    title: string;
    empty: string;
    total: string;
    checkout: string;
    quantity: string;
    remove: string;
  };
}

export default function CartDrawer({ locale, dict }: CartDrawerProps) {
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Container */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-zinc-950 border-l border-zinc-800 text-white shadow-2xl p-6 md:p-8 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
          <h2 className="text-xl font-bold tracking-wider uppercase font-sigher text-white glow-cyan">
            {dict.title}
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="rounded-full p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          {cartItems.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-16 w-16 text-zinc-600 mb-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              <p className="text-zinc-400 font-medium text-sm">{dict.empty}</p>
            </div>
          ) : (
            cartItems.map((item) => {
              const itemKey = item.cartItemId || (item.productId ? item.productId.toString() : item.id ? item.id.toString() : Math.random().toString());
              return (
                <div key={itemKey} className="flex gap-4 border-b border-zinc-900 pb-4">
                  {/* Thumbnail Image */}
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center p-1">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase font-opensauce line-clamp-1">
                        {item.name}
                      </h3>
                      {item.variantTitle && (
                        <p className="text-[10px] text-zinc-400 mt-0.5 font-semibold">
                          Variante: <span className="text-[#00e8ff]">{item.variantTitle}</span>
                        </p>
                      )}
                      {!item.variantTitle && item.selectedColor && (
                        <p className="text-[10px] text-zinc-400 mt-0.5">
                          Color: {item.selectedColor}
                        </p>
                      )}
                      <p className="text-sm font-black text-white mt-1 font-sigher">
                        S/. {item.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-zinc-800 rounded-lg bg-black">
                        <button
                          onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                          className="px-2.5 py-1 text-zinc-400 hover:text-white transition-colors text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="px-2.5 text-xs text-white font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                          className="px-2.5 py-1 text-zinc-400 hover:text-white transition-colors text-xs font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(itemKey)}
                        className="text-[10px] uppercase font-bold text-rose-500 hover:text-rose-400 hover:underline transition-colors"
                      >
                        {dict.remove}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-zinc-800 pt-6 mt-6 bg-zinc-950">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs text-zinc-400 uppercase font-semibold tracking-wider">{dict.total}:</span>
              <span className="text-2xl font-black text-white font-sigher glow-cyan">
                S/. {cartTotal.toFixed(2)}
              </span>
            </div>

            <Link
              href={`/${locale}/checkout`}
              onClick={() => setIsCartOpen(false)}
              className="flex w-full items-center justify-center rounded-full bg-white text-black font-extrabold py-3.5 px-6 transition-all hover:bg-[#00e8ff] hover:shadow-[0_0_20px_rgba(0,232,255,0.4)] transform hover:scale-[1.02] uppercase text-xs tracking-widest"
            >
              {dict.checkout}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
