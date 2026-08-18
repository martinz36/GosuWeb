'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import ShopNavbar from './ShopNavbar';
import ShopFooter from './ShopFooter';

interface CountryCodeOption {
  code: string;
  country: string;
  flag: string;
}

const COUNTRY_CODES: CountryCodeOption[] = [
  { code: '+51', country: 'Perú', flag: '🇵🇪' },
  { code: '+52', country: 'México', flag: '🇲🇽' },
  { code: '+56', country: 'Chile', flag: '🇨🇱' },
  { code: '+506', country: 'Costa Rica', flag: '🇨🇷' },
  { code: '+57', country: 'Colombia', flag: '🇨🇴' },
  { code: '+1', country: 'EE.UU. / Canadá', flag: '🇺🇸' },
  { code: '+34', country: 'España', flag: '🇪🇸' },
  { code: '+54', country: 'Argentina', flag: '🇦🇷' },
];

const REGIONS_BY_COUNTRY: Record<string, string[]> = {
  PE: ['Lima', 'Arequipa', 'Cusco', 'La Libertad', 'Lambayeque', 'Piura', 'Junín', 'Callao', 'Moquegua', 'Tacna', 'Ancash', 'Puno', 'Ica', 'Cajamarca'],
  MX: ['CDMX', 'Jalisco', 'Nuevo León', 'Estado de México', 'Puebla', 'Guanajuato', 'Yucatán', 'Querétaro'],
  CL: ['Región Metropolitana', 'Valparaíso', 'Biobío', 'Antofagasta', 'Araucanía', 'Coquimbo'],
  CR: ['San José', 'Alajuela', 'Cartago', 'Heredia', 'Guanacaste', 'Puntarenas', 'Limón'],
  CO: ['Bogotá D.C.', 'Antioquia', 'Valle del Cauca', 'Cundinamarca', 'Atlántico'],
  US: ['California', 'Florida', 'Texas', 'New York', 'Illinois'],
  ES: ['Madrid', 'Cataluña', 'Andalucía', 'Comunidad Valenciana'],
  AR: ['Buenos Aires', 'Córdoba', 'Santa Fe', 'Mendoza'],
};

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

  // Customer Contact & Shipping Form State
  const [formData, setFormData] = useState({
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@gmail.com',
    countryCode: '+51',
    phone: '987654321',
    
    // Structured Shipping Address
    country: 'PE',
    state: 'Lima',
    cityDistrict: 'Miraflores',
    zipCode: '15074',
    streetAddress: 'Av. Benavides 1234, Dpto 402',
    reference: 'Frente al Parque Reducto, timbre 4',

    // Billing Info (B2B & Fiscal)
    sameAsShipping: true,
    billingTaxId: '',
    billingCompanyName: '',
    billingCountry: 'PE',
    billingState: 'Lima',
    billingCityDistrict: '',
    billingZipCode: '',
    billingStreetAddress: '',
  });

  // Payment Gateway Selector: 'mercadopago' | 'culqi'
  const [paymentGateway, setPaymentGateway] = useState<'mercadopago' | 'culqi'>('mercadopago');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dynamic Shipping Cost
  const shippingCost = formData.country === 'PE' ? 12.0 : 45.0; // International shipping S/. 45.00
  const grandTotal = finalTotal + (cartItems.length > 0 ? shippingCost : 0);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else if (name === 'country') {
      // Auto-update default region state when country changes
      const defaultState = REGIONS_BY_COUNTRY[value]?.[0] || 'Otra Región';
      setFormData({ ...formData, country: value, state: defaultState });
    } else if (name === 'billingCountry') {
      const defaultState = REGIONS_BY_COUNTRY[value]?.[0] || 'Otra Región';
      setFormData({ ...formData, billingCountry: value, billingState: defaultState });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
    const fullPhone = `${formData.countryCode} ${formData.phone}`;
    const fullShippingAddress = `${formData.streetAddress}, ${formData.cityDistrict}, ${formData.state}, ${formData.country} (Zip: ${formData.zipCode}). Ref: ${formData.reference}`;

    if (paymentGateway === 'mercadopago') {
      try {
        const res = await fetch('/api/mercadopago/create-preference', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: fullPhone,
            address: fullShippingAddress,
            items: cartItems,
            total: grandTotal,
            refCode: refCode || appliedCoupon?.code,
            couponCode: appliedCoupon?.code,
            taxId: !formData.sameAsShipping ? formData.billingTaxId : null,
            companyName: !formData.sameAsShipping ? formData.billingCompanyName : null,
          }),
        });

        const data = await res.json();

        if (data.success && data.initPoint) {
          if (data.isMock) {
            clearCart();
            router.push(`/${locale}/checkout/success?status=approved&mock=true`);
          } else {
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
      // Culqi Option
      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: 'tok_test_mock_culqi',
            email: formData.email,
            name: formData.name,
            phone: fullPhone,
            address: fullShippingAddress,
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

  const availableRegions = REGIONS_BY_COUNTRY[formData.country] || [];
  const availableBillingRegions = REGIONS_BY_COUNTRY[formData.billingCountry] || [];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#00e8ff] selection:text-black relative font-opensauce">
      
      {/* Top Navbar */}
      <ShopNavbar locale={locale} dict={dict} />

      {/* Hero Header */}
      <section className="py-10 px-4 sm:px-8 border-b border-zinc-900 bg-zinc-950/90 text-center space-y-2">
        <span className="bg-zinc-900 border border-zinc-800 text-[#00e8ff] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
          COMPRA SEGURA INTERNACIONAL EN GOSU®
        </span>
        <h1 className="text-2xl sm:text-4xl font-black uppercase font-sigher tracking-wider text-white glow-cyan">
          {isEs ? 'FINALIZAR PEDIDO (CHECKOUT)' : 'SECURE CHECKOUT'}
        </h1>
        <p className="text-xs text-zinc-400 font-inter">
          {isEs ? 'Soporte logístico internacional y facturación B2B' : 'International shipping & B2B tax billing support'}
        </p>
      </section>

      {/* Main Checkout Layout Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <form onSubmit={handleProcessPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Side: Shipping & Billing Forms (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* CARD 1: CONTACTO Y DIRECCIÓN ESTRUCTURADA DE ENVÍO */}
            <div className="rounded-3xl border border-zinc-850 bg-zinc-950/80 p-6 sm:p-8 space-y-6 backdrop-blur-md shadow-2xl">
              <h2 className="text-base font-extrabold uppercase tracking-wider text-white border-b border-zinc-900 pb-4 flex items-center gap-2">
                <span>📍 1. Datos de Contacto y Envío Internacional</span>
              </h2>

              <div className="space-y-4 text-xs">
                
                {/* Full Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                </div>

                {/* Phone Input with Country Code Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-zinc-400">Teléfono / WhatsApp *</label>
                  <div className="flex gap-2">
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleFormChange}
                      className="bg-black border border-zinc-800 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-[#00e8ff] font-mono shrink-0"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code} ({c.country})
                        </option>
                      ))}
                    </select>

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

                {/* Country & State/Region Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-900 pt-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-zinc-400">País de Envío *</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleFormChange}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00e8ff]"
                    >
                      <option value="PE">🇵🇪 Perú</option>
                      <option value="MX">🇲🇽 México</option>
                      <option value="CL">🇨🇱 Chile</option>
                      <option value="CR">🇨🇷 Costa Rica</option>
                      <option value="CO">🇨🇴 Colombia</option>
                      <option value="US">🇺🇸 Estados Unidos</option>
                      <option value="ES">🇪🇸 España</option>
                      <option value="AR">🇦🇷 Argentina</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-zinc-400">Estado / Región / Provincia *</label>
                    {availableRegions.length > 0 ? (
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleFormChange}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00e8ff]"
                      >
                        {availableRegions.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleFormChange}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00e8ff]"
                        placeholder="Nombre de Región / Estado"
                      />
                    )}
                  </div>
                </div>

                {/* City/District & Zip Code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-zinc-400">Ciudad / Distrito *</label>
                    <input
                      type="text"
                      name="cityDistrict"
                      required
                      value={formData.cityDistrict}
                      onChange={handleFormChange}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00e8ff]"
                      placeholder="Ej: Miraflores / Guadalajara"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-zinc-400">Código Postal (Zip Code) *</label>
                    <input
                      type="text"
                      name="zipCode"
                      required
                      value={formData.zipCode}
                      onChange={handleFormChange}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00e8ff] font-mono"
                      placeholder="15074"
                    />
                  </div>
                </div>

                {/* Street Address & Reference */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-zinc-400">Dirección de Calle y Número *</label>
                  <input
                    type="text"
                    name="streetAddress"
                    required
                    value={formData.streetAddress}
                    onChange={handleFormChange}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00e8ff]"
                    placeholder="Av. Benavides 1234, Dpto 402"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-zinc-400">Referencia o Dpto (Opcional)</label>
                  <input
                    type="text"
                    name="reference"
                    value={formData.reference}
                    onChange={handleFormChange}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00e8ff]"
                    placeholder="Al frente del Parque Reducto, intermitente timbre 4"
                  />
                </div>

              </div>
            </div>

            {/* CARD 2: DATOS DE FACTURACIÓN (B2B & FISCAL) */}
            <div className="rounded-3xl border border-zinc-850 bg-zinc-950/80 p-6 sm:p-8 space-y-6 backdrop-blur-md shadow-2xl">
              <div className="border-b border-zinc-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-base font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
                  <span>📑 2. Datos de Facturación B2B & Fiscal</span>
                </h2>

                {/* Same as shipping checkbox */}
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 font-bold">
                  <input
                    type="checkbox"
                    name="sameAsShipping"
                    checked={formData.sameAsShipping}
                    onChange={handleFormChange}
                    className="h-4 w-4 rounded accent-[#00e8ff]"
                  />
                  <span>Misma dirección que la de envío</span>
                </label>
              </div>

              {/* Conditional Billing Address Form */}
              {!formData.sameAsShipping && (
                <div className="space-y-4 text-xs pt-2 animate-fadeIn">
                  
                  {/* Tax ID & Company Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-[#00e8ff]">
                        RUC / RFC / RUT / Documento Fiscal *
                      </label>
                      <input
                        type="text"
                        name="billingTaxId"
                        required={!formData.sameAsShipping}
                        value={formData.billingTaxId}
                        onChange={handleFormChange}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00e8ff] font-mono"
                        placeholder="Ej: 20601234567"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-[#00e8ff]">
                        Razón Social / Nombre Comercial *
                      </label>
                      <input
                        type="text"
                        name="billingCompanyName"
                        required={!formData.sameAsShipping}
                        value={formData.billingCompanyName}
                        onChange={handleFormChange}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00e8ff]"
                        placeholder="Ej: Tienda TCG Game Store S.A.C."
                      />
                    </div>
                  </div>

                  {/* Billing Country & Region */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-zinc-400">País de Facturación *</label>
                      <select
                        name="billingCountry"
                        value={formData.billingCountry}
                        onChange={handleFormChange}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00e8ff]"
                      >
                        <option value="PE">🇵🇪 Perú</option>
                        <option value="MX">🇲🇽 México</option>
                        <option value="CL">🇨🇱 Chile</option>
                        <option value="CR">🇨🇷 Costa Rica</option>
                        <option value="CO">🇨🇴 Colombia</option>
                        <option value="US">🇺🇸 Estados Unidos</option>
                        <option value="ES">🇪🇸 España</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-zinc-400">Estado / Región *</label>
                      {availableBillingRegions.length > 0 ? (
                        <select
                          name="billingState"
                          value={formData.billingState}
                          onChange={handleFormChange}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00e8ff]"
                        >
                          {availableBillingRegions.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          name="billingState"
                          required={!formData.sameAsShipping}
                          value={formData.billingState}
                          onChange={handleFormChange}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00e8ff]"
                        />
                      )}
                    </div>
                  </div>

                  {/* Billing Street */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-zinc-400">Dirección Fiscal Completa *</label>
                    <input
                      type="text"
                      name="billingStreetAddress"
                      required={!formData.sameAsShipping}
                      value={formData.billingStreetAddress}
                      onChange={handleFormChange}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00e8ff]"
                      placeholder="Dirección fiscal registrada ante SUNAT / SAT"
                    />
                  </div>

                </div>
              )}
            </div>

            {/* CARD 3: PASARELA DE PAGO */}
            <div className="rounded-3xl border border-zinc-850 bg-zinc-950/80 p-6 sm:p-8 space-y-6 backdrop-blur-md shadow-2xl">
              <h2 className="text-base font-extrabold uppercase tracking-wider text-white border-b border-zinc-900 pb-4 flex items-center gap-2">
                <span>💳 3. Método de Pago Seguro</span>
              </h2>

              <div className="space-y-3">
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
                        <span>💙 Mercado Pago Perú & Internacional</span>
                        <span className="bg-[#00e8ff] text-black text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                          Recomendado
                        </span>
                      </span>
                      <p className="text-[10px] text-zinc-400 font-inter mt-0.5">
                        Paga en Soles/USD con Yape, Plin, Tarjetas de Crédito/Débito o PagoEfectivo
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Right Side: Order Summary Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-zinc-850 bg-zinc-950/90 p-6 sm:p-8 space-y-6 backdrop-blur-xl shadow-2xl sticky top-28 font-opensauce">
              
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
                  <span>Envío ({formData.country === 'PE' ? 'Nacional' : 'Internacional'})</span>
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

              {/* Primary Submit Payment CTA (Mercado Pago Button) */}
              <button
                type="submit"
                disabled={isProcessing || cartItems.length === 0}
                className="w-full py-4 rounded-2xl bg-[#00e8ff] text-black font-extrabold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white hover:shadow-[0_0_25px_rgba(0,232,255,0.5)] transition-all shadow-[0_0_15px_rgba(0,232,255,0.3)] disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                    <span>Conectando Mercado Pago...</span>
                  </>
                ) : (
                  <span>PAGAR CON MERCADO PAGO 🔒</span>
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
