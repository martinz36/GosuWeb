'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';

interface CheckoutFormProps {
  locale: 'es' | 'en';
  dict: {
    cart: {
      title: string;
      empty: string;
      total: string;
      remove: string;
    };
  };
}

declare global {
  interface Window {
    Culqi: any;
    culqi: () => void;
  }
}

export default function CheckoutForm({ locale, dict }: CheckoutFormProps) {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [orderId, setOrderId] = useState('');
  const [isCulqiLoaded, setIsCulqiLoaded] = useState(false);

  const isEs = locale === 'es';

  // Initialize Culqi
  const initCulqi = () => {
    if (typeof window !== 'undefined' && window.Culqi) {
      // Use test key or a mock public key if none provided
      const publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY || 'pk_test_dd4340337f71e549';
      window.Culqi.publicKey = publicKey;
      
      window.Culqi.settings({
        title: 'GOSU® Store',
        currency: 'PEN',
        amount: Math.round(cartTotal * 100), // in cents
      });

      window.Culqi.options({
        style: {
          logo: 'https://framerusercontent.com/images/zSe9L6yupLGMFGQqOP2FPk3FPLU.png',
          maincolor: '#00e8ff',
          buttontext: '#000000',
          maintext: '#ffffff',
          bg: '#0a0a0a',
        }
      });
      
      setIsCulqiLoaded(true);
    }
  };

  useEffect(() => {
    if (window.Culqi) {
      initCulqi();
    }
  }, [cartTotal]);

  // Handle the callback from Culqi
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.culqi = async () => {
        if (window.Culqi.token) {
          const token = window.Culqi.token.id;
          const email = window.Culqi.token.email;
          
          await processPayment(token, email);
        } else {
          console.error(window.Culqi.error);
          setStatus('error');
          setErrorMessage(window.Culqi.error.user_message || 'Payment closed or cancelled');
        }
      };
    }
  }, [cartItems, cartTotal, formData]);

  const processPayment = async (token: string, email: string) => {
    setStatus('loading');
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          email: email || formData.email,
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          total: cartTotal,
          items: cartItems.map((item) => ({
            id: item.productId || item.id,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus('success');
        setOrderId(result.orderId);
        clearCart();
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Payment failed.');
      }
    } catch (error) {
      console.error('Error processing checkout:', error);
      setStatus('error');
      setErrorMessage('Network or Server Error.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setStatus('loading');

    // Simulate payment immediately if user chooses to mock/simulate (very helpful for testing!)
    // If not, we open Culqi's checkout window
    const isMock = true; // Set to true to easily test database locally without actual card details!

    if (isMock) {
      setTimeout(async () => {
        // Create a fake token
        const fakeToken = 'tkn_test_' + Math.random().toString(36).substring(2);
        await processPayment(fakeToken, formData.email);
      }, 1000);
    } else {
      if (window.Culqi) {
        window.Culqi.open();
      } else {
        setStatus('error');
        setErrorMessage('Culqi SDK not loaded.');
      }
    }
  };

  if (cartItems.length === 0 && status !== 'success') {
    return (
      <div className="flex h-96 flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-bold uppercase font-sigher text-white">{isEs ? 'TU CARRITO ESTÁ VACÍO' : 'YOUR CART IS EMPTY'}</h2>
        <p className="text-zinc-500 text-xs">{isEs ? 'Agrega algunos accesorios premium y regresa para pagar.' : 'Add some premium accessories first, then come back to checkout.'}</p>
        <Link href={`/${locale}/catalog`} className="btn-cyan py-3 px-8 text-xs tracking-widest uppercase inline-block">
          {isEs ? 'IR AL CATÁLOGO' : 'GO TO CATALOG'}
        </Link>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-6">
        <div className="mx-auto h-20 w-20 rounded-full bg-[#00e8ff]/10 border border-[#00e8ff] flex items-center justify-center text-[#00e8ff] animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold uppercase tracking-wider font-sigher text-white">{isEs ? '¡PAGO EXITOSO!' : 'PAYMENT SUCCESSFUL!'}</h2>
          <p className="text-zinc-400 text-xs leading-relaxed">
            {isEs 
              ? 'Muchas gracias por tu compra en GOSU®. Tu pedido ha sido procesado de forma segura.' 
              : 'Thank you for shopping at GOSU®. Your payment has been processed securely.'}
          </p>
        </div>
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 text-xs font-mono space-y-1">
          <p className="text-zinc-500">{isEs ? 'ID DE ORDEN:' : 'ORDER ID:'}</p>
          <p className="text-white font-bold">{orderId}</p>
        </div>
        <div className="pt-4">
          <Link href={`/${locale}`} className="btn-cyan py-3 px-8 text-xs tracking-widest uppercase inline-block">
            {isEs ? 'IR AL INICIO' : 'GO HOME'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://js.culqi.com/v4"
        onLoad={initCulqi}
        strategy="lazyOnload"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-md space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-wider font-sigher text-white border-b border-zinc-900 pb-3">
            {isEs ? 'Detalles de Envío y Pago' : 'Shipping & Payment Details'}
          </h2>

          {status === 'error' && (
            <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold">
              Error: {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-zinc-400 font-semibold uppercase tracking-wider block">
                {isEs ? 'Nombre Completo' : 'Full Name'} *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg bg-zinc-900 border border-zinc-800 text-white p-3 focus:outline-none focus:border-[#00e8ff] transition-colors"
                placeholder={isEs ? 'Ej. Carlos Rodríguez' : 'e.g. Charlie Rodriguez'}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-zinc-400 font-semibold uppercase tracking-wider block">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg bg-zinc-900 border border-zinc-800 text-white p-3 focus:outline-none focus:border-[#00e8ff] transition-colors"
                  placeholder="carlos@correo.com"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-semibold uppercase tracking-wider block">
                  {isEs ? 'Teléfono Celular' : 'Mobile Phone'} *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg bg-zinc-900 border border-zinc-800 text-white p-3 focus:outline-none focus:border-[#00e8ff] transition-colors"
                  placeholder="987654321"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 font-semibold uppercase tracking-wider block">
                {isEs ? 'Dirección de Envío Completa' : 'Full Shipping Address'} *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg bg-zinc-900 border border-zinc-800 text-white p-3 focus:outline-none focus:border-[#00e8ff] transition-colors"
                placeholder={isEs ? 'Ej. Calle Las Orquídeas 456, Dpto 302, San Isidro, Lima' : 'e.g. 123 Orchid Street, Apt 302, San Isidro, Lima'}
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full mt-6 rounded-full bg-white text-black font-semibold py-4 px-6 transition-all hover:bg-[#00e8ff] hover:shadow-[0_0_20px_rgba(0,232,255,0.4)] transform hover:scale-[1.01] uppercase tracking-wider text-sm"
            >
              {status === 'loading'
                ? (isEs ? 'Procesando pago...' : 'Processing payment...')
                : (isEs ? 'Pagar ahora con Culqi (Simulado)' : 'Pay now with Culqi (Simulated)')}
            </button>
          </form>
        </div>

        {/* Right Column: Cart Summary */}
        <div className="lg:col-span-5 p-6 rounded-2xl border border-zinc-900 bg-zinc-950/20 space-y-6">
          <h2 className="text-lg font-bold uppercase tracking-wider font-sigher text-white border-b border-zinc-900 pb-3">
            {isEs ? 'Resumen del Pedido' : 'Order Summary'}
          </h2>

          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
            {cartItems.map((item) => (
              <div key={item.cartItemId || `${item.productId || item.id}-${item.selectedColor}`} className="flex gap-4 border-b border-zinc-900/60 pb-4">
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded bg-zinc-900 border border-zinc-800">
                  <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-zinc-200 truncate">{item.name}</h3>
                  {item.selectedColor && (
                    <p className="text-[10px] text-zinc-500 mt-0.5">Color: {item.selectedColor}</p>
                  )}
                  <p className="text-[10px] text-zinc-400 mt-1">
                    {item.quantity} x S/. {item.price.toFixed(2)}
                  </p>
                </div>
                <div className="text-xs font-bold text-white">
                  S/. {(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-900 pt-4 space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-500">{isEs ? 'Envío' : 'Shipping'}</span>
              <span className="text-[#22ef00] font-bold uppercase">{isEs ? 'Gratis' : 'Free'}</span>
            </div>
            <div className="flex justify-between items-center border-t border-zinc-900/60 pt-4">
              <span className="text-sm text-zinc-400 font-semibold">{isEs ? 'Total a pagar:' : 'Total amount:'}</span>
              <span className="text-xl font-extrabold text-white font-sigher glow-cyan">
                S/. {cartTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
