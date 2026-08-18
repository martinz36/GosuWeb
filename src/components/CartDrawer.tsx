'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface CartDrawerProps {
  locale: string;
  dict: any;
}

export default function CartDrawer({ locale, dict }: CartDrawerProps) {
  const isEs = locale === 'es';
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    finalTotal,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    setCouponMessage(null);

    const res = await applyCoupon(couponInput);
    setCouponLoading(false);

    if (res.success) {
      setCouponMessage({ text: res.message, isError: false });
      setCouponInput('');
    } else {
      setCouponMessage({ text: res.message, isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-opensauce">
      
      {/* Dark Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        
        {/* Sliding Panel */}
        <div className="w-screen max-w-md bg-zinc-950 border-l border-zinc-850 text-white shadow-2xl flex flex-col justify-between relative">
          
          {/* Top Header */}
          <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black uppercase font-sigher tracking-wider text-white glow-cyan">
                {dict?.title || (isEs ? 'TU CARRITO' : 'YOUR CART')}
              </h2>
              <span className="bg-zinc-900 border border-zinc-800 text-[#00e8ff] text-[10px] font-black px-2.5 py-0.5 rounded-full">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="h-9 w-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-zinc-500 py-12">
                <div className="text-4xl">🛒</div>
                <p className="text-xs uppercase tracking-wider font-bold">
                  {dict?.empty || (isEs ? 'Tu carrito está vacío' : 'Your cart is empty')}
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 text-xs text-[#00e8ff] font-bold uppercase underline"
                >
                  {isEs ? 'Explorar la Tienda GOSU®' : 'Explore GOSU® Store'}
                </button>
              </div>
            ) : (
              cartItems.map((item) => {
                const itemKey = item.cartItemId || item.id || 'item';
                return (
                  <div
                    key={itemKey}
                    className="flex gap-4 p-3 rounded-2xl border border-zinc-850 bg-black/60 items-center justify-between"
                  >
                    {/* Item Image */}
                    <div className="relative h-16 w-16 shrink-0 bg-zinc-950 rounded-xl border border-zinc-900 overflow-hidden flex items-center justify-center p-1">
                      <Image
                        src={item.image || '/assets/images/image-4f57375b.jpg'}
                        alt={item.name}
                        fill
                        className="object-contain"
                      />
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="text-xs font-extrabold uppercase text-white truncate">
                        {item.name}
                      </h4>
                      {item.variantTitle && (
                        <span className="text-[10px] text-zinc-400 bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded font-mono">
                          {item.variantTitle}
                        </span>
                      )}
                      <p className="text-xs font-black font-sigher text-[#00e8ff]">
                        S/. {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls & Delete */}
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeFromCart(itemKey)}
                        className="text-zinc-500 hover:text-red-400 text-xs transition-colors p-1"
                        title="Eliminar del carrito"
                      >
                        🗑️
                      </button>

                      <div className="flex items-center border border-zinc-800 rounded-lg bg-black px-1 py-0.5">
                        <button
                          onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                          className="px-1.5 py-0.5 text-zinc-400 hover:text-white text-[10px] font-bold"
                        >
                          -
                        </button>
                        <span className="px-1.5 text-[10px] font-extrabold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                          className="px-1.5 py-0.5 text-zinc-400 hover:text-white text-[10px] font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Financial Summary & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-zinc-900 bg-zinc-950 space-y-4">
              
              {/* Coupon / Affiliate Code Input Bar */}
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                  ¿TIENES UN CÓDIGO DE DESCUENTO O AFILIADO?
                </label>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#00e8ff]/10 border border-[#00e8ff]/30 text-xs">
                    <div>
                      <span className="font-extrabold text-[#00e8ff] font-mono">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-[10px] text-zinc-400 ml-2 font-inter">
                        ({appliedCoupon.discountType === 'percentage'
                          ? `-${appliedCoupon.discountValue}%`
                          : `-S/. ${appliedCoupon.discountValue.toFixed(2)}`})
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-[10px] text-red-400 font-bold hover:underline"
                    >
                      Quitar
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Ej: GOSU20 o GOSU-CARLOS"
                      className="flex-1 bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00e8ff] uppercase"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading}
                      className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-extrabold text-xs uppercase hover:bg-white hover:text-black transition-colors"
                    >
                      {couponLoading ? '...' : 'Aplicar'}
                    </button>
                  </form>
                )}

                {couponMessage && (
                  <p
                    className={`text-[10px] font-bold font-inter ${
                      couponMessage.isError ? 'text-red-400' : 'text-emerald-400'
                    }`}
                  >
                    {couponMessage.text}
                  </p>
                )}
              </div>

              {/* Subtotal, Discount & Total Math */}
              <div className="space-y-1.5 text-xs pt-2 border-t border-zinc-900">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">S/. {cartTotal.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Descuento Aplicado</span>
                    <span className="font-mono">- S/. {discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-black pt-2 border-t border-zinc-900">
                  <span className="uppercase text-white font-sigher tracking-wider">Total a Pagar</span>
                  <span className="font-sigher text-[#00e8ff] glow-cyan">
                    S/. {finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Primary Button */}
              <Link
                href={`/${locale}/checkout`}
                onClick={() => setIsCartOpen(false)}
                className="w-full py-4 rounded-2xl bg-[#00e8ff] text-black font-extrabold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white hover:shadow-[0_0_25px_rgba(0,232,255,0.4)] transition-all shadow-[0_0_15px_rgba(0,232,255,0.3)] font-opensauce"
              >
                <span>{dict?.checkout || (isEs ? 'IR A PAGAR (CHECKOUT) →' : 'PROCEED TO CHECKOUT →')}</span>
              </Link>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
