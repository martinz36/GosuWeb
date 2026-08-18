'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import ShopNavbar from './ShopNavbar';
import ShopFooter from './ShopFooter';

export default function CheckoutClient({ locale, dict }: { locale: 'es' | 'en'; dict: any }) {
  const isEs = locale === 'es';
  const router = useRouter();
  const {
    cartItems,
    cartTotal,
    appliedCoupon,
    discountAmount,
    finalTotal,
    clearCart,
  } = useCart();

  // Customer Shipping & Billing Form State
  const [formData, setFormData] = useState({
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@gmail.com',
    phone: '987654321',
    address: 'Av. Primavera 123, Of. 402, Surco',
    city: 'Lima',
    notes: 'Entregar en portería del edificio.',
  });

  // Payment Gateway Selector: 'mercadopago' | 'culqi'
  const [paymentGateway, setPaymentGateway] = useState<'mercadopago' | 'culqi'>('mercadopago');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Shipping Cost: S/. 12.00
  const shippingCost = 12.0;
  const grandTotal = finalTotal + (cartItems.length > 0 ? shippingCost : 0);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const refCode = typeof window !== 'undefined' ? localStorage.getItem('gosu_ref_code') : null;

    if (paymentGateway === 'mercadopago') {
      try {
        // 1. Call Mercado Pago Create Preference API Route
        const res = await fetch('/api/mercadopago/create-preference', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: `${formData.address}, ${formData.city}`,
            items: cartItems,
            total: grandTotal,
            refCode: refCode || appliedCoupon?.code,
            couponCode: appliedCoupon?.code,
          }),
        });

        const data = await res.json();

        if (data.success && data.initPoint) {
          // If Mercado Pago preference initialized successfully
          if (data.isMock) {
            // Simulated payment redirect for testing mode
            clearCart();
            router.push(`/${locale}/checkout/success?status=approved&mock=true`);
          } else {
            // Redirect to Mercado Pago Official Checkout / Wallet
            window.location.href = data.initPoint;
          }
        } else {
          setErrorMessage(data.error || 'Error al generar preferencia de Mercado Pago.');
          setIsProcessing(false);
        }
      } catch (err) {
        console.error('Error initiating Mercado Pago:', err);
        setErrorMessage('No se pudo conectar con Mercado Pago.');
        setIsProcessing(false);
      }
    } else {
      // Culqi Gateway Option
      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: 'tok_test_mock_culqi',
            email: formData.email,
            name: formData.name,
            phone: formData.phone,
            address: `${formData.address}, ${formData.city}`,
            total: grandTotal,
            items: cartItems,
            refCode: refCode || appliedCoupon?.code,
          }),
        });

        const data = await res.json();

        if (data.success) {
          clearCart();
          router.push(`/${locale}/checkout/success?order_id=${data.orderId}`);
        } else {
          setErrorMessage(data.error || 'Error procesando el pago con Culqi.');
          setIsProcessing(false);
        }
      } catch (err) {
        console.error('Error processing Culqi:', err);
        setErrorMessage('Error de servidor al procesar pago.');
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#00e8ff] selection:text-black relative font-opensauce">
      
      {/* Top Navbar */}
      <ShopNavbar locale={locale} dict={dict} />

      {/* Hero Header */}
      <section className="py-10 px-4 sm:px-8 border-b border-zinc-900 bg-zinc-950/90 text-center space-y-2">
        <span className="bg-zinc-900 border border-zinc-800 text-[#00e8ff] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
          COMPRA SEGURA EN GOSU®
        </span>
        <h1 className="text-2xl sm:text-4xl font-black uppercase font-sigher tracking-wider text-white glow-cyan">
          {isEs ? 'FINALIZAR PEDIDO (CHECKOUT)' : 'SECURE CHECKOUT'}
        </h1>
        <p className="text-xs text-zinc-400 font-inter">
          {isEs ? 'Ingresa tus datos de envío y elige tu pasarela preferida' : 'Enter shipping info and select payment gateway'}
        </p>
      </section>

      {/* Main Checkout Layout Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <form onSubmit={handleProcessPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Side: Shipping & Gateway Forms (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* CARD 1: INFORMACIÓN DE CONTACTO & ENVÍO */}
            <div className="rounded-3xl border border-zinc-850 bg-zinc-950/80 p-6 sm:p-8 space-y-6 backdrop-blur-md shadow-2xl">
              <h2 className="text-base font-extrabold uppercase tracking-wider text-white border-b border-zinc-900 pb-4 flex items-center gap-2">
                <span>📍 1. Datos de Contacto y Envío</span>
              </h2>

              <div className="space-y-4 text-xs">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-zinc-400">Nombres y Apellidos *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00e8ff]"
                    placeholder="Juan Pérez"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-zinc-400">Correo Electrónico *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleFormChange}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00e8ff] font-mono"
                      placeholder="cliente@gmail.com"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-zinc-400">Teléfono / WhatsApp *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleFormChange}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00e8ff] font-mono"
                      placeholder="987654321"
                    />
                  </div>
                </div>

                {/* Address & City */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-zinc-400">Dirección de Entrega *</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleFormChange}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00e8ff]"
                      placeholder="Av. Larco 1234, Dpto 302"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-zinc-400">Ciudad / Dpto *</label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleFormChange}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00e8ff]"
                    >
                      <option value="Lima">Lima Metropolitana</option>
                      <option value="Arequipa">Arequipa</option>
                      <option value="Cusco">Cusco</option>
                      <option value="Trujillo">Trujillo</option>
                      <option value="Chiclayo">Chiclayo</option>
                      <option value="Piura">Piura</option>
                      <option value="Provincias">Otra Provincia (Shalom / Olva)</option>
                    </select>
                  </div>
                </div>

                {/* Reference Notes */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-zinc-400">Referencia de Dirección (Opcional)</label>
                  <textarea
                    name="notes"
                    rows={2}
                    value={formData.notes}
                    onChange={handleFormChange}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#00e8ff]"
                    placeholder="Instrucciones para la empresa de courier..."
                  />
                </div>

              </div>
            </div>

            {/* CARD 2: SELECCIÓN DE PASARELA DE PAGO */}
            <div className="rounded-3xl border border-zinc-850 bg-zinc-950/80 p-6 sm:p-8 space-y-6 backdrop-blur-md shadow-2xl">
              <h2 className="text-base font-extrabold uppercase tracking-wider text-white border-b border-zinc-900 pb-4 flex items-center gap-2">
                <span>💳 2. Método de Pago Seguro</span>
              </h2>

              <div className="space-y-3">
                
                {/* Mercado Pago Option (Recommended) */}
                <label
                  onClick={() => setPaymentGateway('mercadopago')}
                  className={`p-5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentGateway === 'mercadopago'
                      ? 'bg-blue-950/30 border-[#00e8ff] shadow-[0_0_15px_rgba(0,232,255,0.2)]'
                      : 'bg-black border-zinc-850 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="paymentGateway"
                      checked={paymentGateway === 'mercadopago'}
                      readOnly
                      className="accent-[#00e8ff]"
                    />
                    <div>
                      <span className="text-xs font-black uppercase text-white flex items-center gap-2">
                        <span>💙 Mercado Pago Perú</span>
                        <span className="bg-[#00e8ff] text-black text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                          Recomendado
                        </span>
                      </span>
                      <p className="text-[10px] text-zinc-400 font-inter mt-0.5">
                        Paga en Soles con Yape, Plin, Tarjeta de Crédito/Débito o PagoEfectivo
                      </p>
                    </div>
                  </div>
                </label>

                {/* Culqi Option */}
                <label
                  onClick={() => setPaymentGateway('culqi')}
                  className={`p-5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentGateway === 'culqi'
                      ? 'bg-zinc-900 border-[#00e8ff]'
                      : 'bg-black border-zinc-850 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="paymentGateway"
                      checked={paymentGateway === 'culqi'}
                      readOnly
                      className="accent-[#00e8ff]"
                    />
                    <div>
                      <span className="text-xs font-black uppercase text-white">
                        ⚡ Culqi (Tarjetas Directas & Yape)
                      </span>
                      <p className="text-[10px] text-zinc-400 font-inter mt-0.5">
                        Procesa tu tarjeta Visa, Mastercard o Yape nativo
                      </p>
                    </div>
                  </div>
                </label>

              </div>
            </div>

          </div>

          {/* Right Side: Order Summary Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-zinc-850 bg-zinc-950/90 p-6 sm:p-8 space-y-6 backdrop-blur-xl shadow-2xl sticky top-28">
              
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-white border-b border-zinc-900 pb-3 flex items-center justify-between">
                <span>🛍️ Resumen del Pedido</span>
                <span className="text-[10px] text-zinc-500 font-mono">({cartItems.length} ítems)</span>
              </h3>

              {/* Items Mini List */}
              <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                {cartItems.length === 0 ? (
                  <p className="text-xs text-zinc-500 font-inter text-center py-4">No hay ítems en el carrito.</p>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.cartItemId || item.id} className="flex items-center gap-3 text-xs">
                      <div className="relative h-12 w-12 shrink-0 bg-black rounded-xl border border-zinc-850 overflow-hidden flex items-center justify-center p-1">
                        <Image src={item.image || '/assets/images/image-4f57375b.jpg'} alt={item.name} fill className="object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-white truncate">{item.name}</p>
                        <p className="text-[10px] text-zinc-400 font-mono">Cant: {item.quantity}</p>
                      </div>
                      <span className="font-sigher text-white font-black">
                        S/. {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Coupon Badge if active */}
              {appliedCoupon && (
                <div className="p-3 rounded-xl bg-[#00e8ff]/10 border border-[#00e8ff]/30 text-xs flex items-center justify-between">
                  <span className="font-bold text-[#00e8ff]">🎟️ Cupón: {appliedCoupon.code}</span>
                  <span className="text-emerald-400 font-mono font-bold">- S/. {discountAmount.toFixed(2)}</span>
                </div>
              )}

              {/* Breakdown Math */}
              <div className="space-y-2 text-xs pt-4 border-t border-zinc-900 font-opensauce">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">S/. {cartTotal.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Descuento</span>
                    <span className="font-mono">- S/. {discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-400">
                  <span>Envío a {formData.city}</span>
                  <span className="font-mono text-white">
                    {cartItems.length > 0 ? `S/. ${shippingCost.toFixed(2)}` : 'S/. 0.00'}
                  </span>
                </div>

                <div className="flex justify-between text-lg font-black text-white pt-3 border-t border-zinc-900">
                  <span className="font-sigher uppercase tracking-wider">TOTAL</span>
                  <span className="font-sigher text-[#00e8ff] glow-cyan">
                    S/. {grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-900 text-red-400 text-xs font-bold font-inter">
                  ⚠️ {errorMessage}
                </div>
              )}

              {/* Primary Submit Payment CTA */}
              <button
                type="submit"
                disabled={isProcessing || cartItems.length === 0}
                className="w-full py-4 rounded-2xl bg-[#00e8ff] text-black font-extrabold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white hover:shadow-[0_0_25px_rgba(0,232,255,0.5)] transition-all shadow-[0_0_15px_rgba(0,232,255,0.3)] disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                    <span>Conectando Pasarela...</span>
                  </>
                ) : (
                  <span>CONFIRMAR Y PAGAR S/. {grandTotal.toFixed(2)} 🔒</span>
                )}
              </button>

              <p className="text-[10px] text-zinc-500 font-inter text-center">
                🔒 Transacción encriptada SSL de 256 bits con Mercado Pago Perú.
              </p>

            </div>
          </div>

        </form>
      </main>

      {/* Footer */}
      <ShopFooter locale={locale} />

    </div>
  );
}
