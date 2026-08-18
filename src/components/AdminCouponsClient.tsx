'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminSidebar from './AdminSidebar';

interface CouponItem {
  id: string;
  code: string;
  type: 'percentage' | 'fixed_amount' | 'free_shipping';
  value: number;
  status: 'active' | 'scheduled' | 'expired';
  timesUsed: number;
  maxUses?: number;
  applicability: 'all' | 'categories' | 'products';
  selectedCategoryIds?: string[];
  selectedProductIds?: number[];
  minimumRequirement: 'none' | 'minimum_amount' | 'minimum_quantity';
  minimumAmount?: number;
  minimumQuantity?: number;
  startDate: string;
  endDateEnabled: boolean;
  endDate?: string;
}

const INITIAL_COUPONS: CouponItem[] = [
  {
    id: 'coup-1',
    code: 'GOSU20',
    type: 'percentage',
    value: 20,
    status: 'active',
    timesUsed: 42,
    maxUses: 100,
    applicability: 'all',
    minimumRequirement: 'minimum_amount',
    minimumAmount: 100,
    startDate: '2026-08-01T00:00',
    endDateEnabled: true,
    endDate: '2026-08-31T23:59',
  },
  {
    id: 'coup-2',
    code: 'ENVIO_FREE',
    type: 'free_shipping',
    value: 0,
    status: 'active',
    timesUsed: 18,
    applicability: 'all',
    minimumRequirement: 'minimum_amount',
    minimumAmount: 150,
    startDate: '2026-08-10T00:00',
    endDateEnabled: false,
  },
  {
    id: 'coup-3',
    code: 'LANZAMIENTO15',
    type: 'fixed_amount',
    value: 15,
    status: 'scheduled',
    timesUsed: 0,
    applicability: 'categories',
    selectedCategoryIds: ['cat-2'],
    minimumRequirement: 'none',
    startDate: '2026-09-01T00:00',
    endDateEnabled: true,
    endDate: '2026-09-15T23:59',
  },
  {
    id: 'coup-4',
    code: 'CYBER2026',
    type: 'percentage',
    value: 30,
    status: 'expired',
    timesUsed: 120,
    maxUses: 120,
    applicability: 'all',
    minimumRequirement: 'none',
    startDate: '2026-07-01T00:00',
    endDateEnabled: true,
    endDate: '2026-07-07T23:59',
  },
];

export default function AdminCouponsClient({ locale }: { locale: string }) {
  const [coupons, setCoupons] = useState<CouponItem[]>(INITIAL_COUPONS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponItem | null>(null);

  // Form states
  const [formCode, setFormCode] = useState('GOSU20');
  const [formType, setFormType] = useState<'percentage' | 'fixed_amount' | 'free_shipping'>('percentage');
  const [formValue, setFormValue] = useState('20');
  const [formApplicability, setFormApplicability] = useState<'all' | 'categories' | 'products'>('all');
  const [formMinimumReq, setFormMinimumReq] = useState<'none' | 'minimum_amount' | 'minimum_quantity'>('none');
  const [formMinAmount, setFormMinAmount] = useState('100');
  const [formMinQty, setFormMinQty] = useState('3');
  const [formStartDate, setFormStartDate] = useState('2026-08-18T00:00');
  const [formEndDateEnabled, setFormEndDateEnabled] = useState(true);
  const [formEndDate, setFormEndDate] = useState('2026-09-30T23:59');
  const [formMaxUsesEnabled, setFormMaxUsesEnabled] = useState(false);
  const [formMaxUses, setFormMaxUses] = useState('100');

  // Open Create Form
  const handleOpenCreate = () => {
    setEditingCoupon(null);
    setFormCode(`GOSU${Math.floor(10 + Math.random() * 90)}`);
    setFormType('percentage');
    setFormValue('20');
    setFormApplicability('all');
    setFormMinimumReq('none');
    setFormMinAmount('100');
    setFormMinQty('3');
    setFormStartDate('2026-08-18T00:00');
    setFormEndDateEnabled(true);
    setFormEndDate('2026-09-30T23:59');
    setFormMaxUsesEnabled(false);
    setFormMaxUses('100');
    setIsFormOpen(true);
  };

  // Open Edit Form
  const handleOpenEdit = (coupon: CouponItem) => {
    setEditingCoupon(coupon);
    setFormCode(coupon.code);
    setFormType(coupon.type);
    setFormValue(String(coupon.value));
    setFormApplicability(coupon.applicability);
    setFormMinimumReq(coupon.minimumRequirement);
    setFormMinAmount(String(coupon.minimumAmount || 100));
    setFormMinQty(String(coupon.minimumQuantity || 3));
    setFormStartDate(coupon.startDate);
    setFormEndDateEnabled(coupon.endDateEnabled);
    setFormEndDate(coupon.endDate || '2026-09-30T23:59');
    setFormMaxUsesEnabled(Boolean(coupon.maxUses));
    setFormMaxUses(String(coupon.maxUses || 100));
    setIsFormOpen(true);
  };

  // Generate random code helper
  const handleGenerateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'GOSU';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormCode(result);
  };

  // Handle Form Save
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formCode.trim()) {
      alert('Por favor ingresa un código para el cupón.');
      return;
    }

    if (editingCoupon) {
      setCoupons(
        coupons.map((c) =>
          c.id === editingCoupon.id
            ? {
                ...c,
                code: formCode.toUpperCase().trim(),
                type: formType,
                value: Number(formValue) || 0,
                applicability: formApplicability,
                minimumRequirement: formMinimumReq,
                minimumAmount: Number(formMinAmount) || 0,
                minimumQuantity: Number(formMinQty) || 0,
                startDate: formStartDate,
                endDateEnabled: formEndDateEnabled,
                endDate: formEndDate,
                maxUses: formMaxUsesEnabled ? Number(formMaxUses) : undefined,
              }
            : c
        )
      );
      alert('¡Cupón de descuento actualizado con éxito!');
    } else {
      const newCoupon: CouponItem = {
        id: `coup-${Date.now()}`,
        code: formCode.toUpperCase().trim(),
        type: formType,
        value: Number(formValue) || 0,
        status: 'active',
        timesUsed: 0,
        maxUses: formMaxUsesEnabled ? Number(formMaxUses) : undefined,
        applicability: formApplicability,
        minimumRequirement: formMinimumReq,
        minimumAmount: Number(formMinAmount) || 0,
        minimumQuantity: Number(formMinQty) || 0,
        startDate: formStartDate,
        endDateEnabled: formEndDateEnabled,
        endDate: formEndDate,
      };
      setCoupons([newCoupon, ...coupons]);
      alert('¡Nuevo cupón de descuento creado con éxito!');
    }

    setIsFormOpen(false);
  };

  // Delete Coupon
  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este cupón de descuento?')) {
      setCoupons(coupons.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white font-sans selection:bg-[#00e8ff] selection:text-black">
      
      {/* Shopify-style Admin Sidebar */}
      <AdminSidebar locale={locale} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* VIEW 1: TABLA VISTA GENERAL DE CUPONES */}
          {!isFormOpen ? (
            <div className="space-y-6">
              
              {/* Header Action Row */}
              <div className="flex items-center justify-between border-b border-zinc-900 pb-5">
                <div>
                  <span className="inline-block bg-zinc-900 border border-zinc-800 text-[#00e8ff] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full font-opensauce mb-2">
                    MÓDULO DE DESCUENTOS
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black uppercase font-sigher tracking-wider text-white">
                    Descuentos / Cupones
                  </h1>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1 font-inter">
                    Crea reglas de descuento por porcentaje, monto fijo o envío gratis para tus clientes
                  </p>
                </div>

                <button
                  onClick={handleOpenCreate}
                  className="flex items-center gap-2 rounded-full bg-[#00e8ff] text-black font-extrabold uppercase text-xs px-5 py-2.5 hover:bg-white hover:shadow-[0_0_15px_rgba(0,232,255,0.4)] transition-all font-opensauce shadow-[0_0_12px_rgba(0,232,255,0.25)]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  <span>Crear Descuento</span>
                </button>
              </div>

              {/* Coupons Table */}
              <div className="overflow-x-auto rounded-2xl border border-zinc-900 bg-zinc-950/40 font-opensauce">
                <table className="w-full border-collapse text-left text-sm text-zinc-400">
                  <thead className="bg-zinc-950 text-[10px] uppercase font-bold tracking-wider text-zinc-500 border-b border-zinc-900">
                    <tr>
                      <th className="px-6 py-4">Código de Descuento</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4">Tipo & Valor</th>
                      <th className="px-6 py-4">Requisitos / Aplicabilidad</th>
                      <th className="px-6 py-4 text-center">Veces Utilizado</th>
                      <th className="px-6 py-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {coupons.map((c) => (
                      <tr key={c.id} className="hover:bg-zinc-900/20 transition-colors">
                        
                        {/* Coupon Code */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-white text-sm bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-[#00e8ff] tracking-wider shadow-sm">
                              {c.code}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {c.status === 'active' && (
                            <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Activo
                            </span>
                          )}
                          {c.status === 'scheduled' && (
                            <span className="bg-blue-950/40 text-blue-400 border border-blue-900/60 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                              Programado
                            </span>
                          )}
                          {c.status === 'expired' && (
                            <span className="bg-zinc-900 text-zinc-500 border border-zinc-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                              Expirado
                            </span>
                          )}
                        </td>

                        {/* Type & Value */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-bold text-white text-xs">
                            {c.type === 'percentage' && `Porcentaje: -${c.value}%`}
                            {c.type === 'fixed_amount' && `Monto Fijo: -S/. ${c.value.toFixed(2)}`}
                            {c.type === 'free_shipping' && '🚚 Envío Gratis'}
                          </div>
                          <div className="text-[10px] text-zinc-500 uppercase tracking-wide mt-0.5 font-inter">
                            {c.type === 'percentage' ? 'Descuento directo en carrito' : 'Aplicación automática'}
                          </div>
                        </td>

                        {/* Requirements */}
                        <td className="px-6 py-4 max-w-xs text-xs">
                          <div className="text-zinc-300 font-medium">
                            {c.minimumRequirement === 'none' && 'Sin requisito mínimo'}
                            {c.minimumRequirement === 'minimum_amount' && `Mínimo de compra: S/. ${c.minimumAmount?.toFixed(2)}`}
                            {c.minimumRequirement === 'minimum_quantity' && `Mínimo: ${c.minimumQuantity} artículos`}
                          </div>
                          <div className="text-[10px] text-zinc-500 mt-0.5">
                            {c.applicability === 'all' ? 'Aplica a todos los productos' : 'Aplica a ítems seleccionados'}
                          </div>
                        </td>

                        {/* Usage */}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="font-bold text-white text-xs">
                            {c.timesUsed} {c.maxUses ? `/ ${c.maxUses}` : ''} usos
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenEdit(c)}
                              className="rounded-lg bg-zinc-900 border border-zinc-800 hover:border-[#00e8ff] text-[#00e8ff] text-[10px] font-bold uppercase px-3 py-1.5 transition-colors"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(c.id)}
                              className="rounded-lg bg-red-950/40 border border-red-900/60 hover:bg-red-900 hover:border-red-500 text-red-400 hover:text-white text-[10px] font-bold uppercase px-3 py-1.5 transition-colors"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          ) : (
            
            /* VIEW 2: FORMULARIO DE CREACIÓN ESTRUCTURADO EN CARDS */
            <form onSubmit={handleSaveForm} className="space-y-8 pb-16">
              
              {/* Header Action Bar */}
              <div className="flex items-center justify-between border-b border-zinc-900 pb-5">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                    title="Volver a cupones"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                  </button>
                  <div>
                    <span className="inline-block bg-zinc-900 border border-zinc-800 text-[#00e8ff] text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full font-opensauce mb-1">
                      {editingCoupon ? 'EDITAR DESCUENTO' : 'NUEVO DESCUENTO'}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black uppercase font-sigher tracking-wider text-white">
                      {editingCoupon ? `Editar: ${editingCoupon.code}` : 'Crear Descuento'}
                    </h1>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-5 py-2.5 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 font-bold uppercase text-xs tracking-wider transition-all font-opensauce"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#00e8ff] text-black font-extrabold uppercase text-xs tracking-wider hover:bg-white hover:shadow-[0_0_20px_rgba(0,232,255,0.4)] transition-all font-opensauce shadow-[0_0_12px_rgba(0,232,255,0.25)]"
                  >
                    Guardar Descuento
                  </button>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left 2 Columns: Main Cards */}
                <div className="lg:col-span-2 space-y-8">
                  
                  {/* CARD 1: VALOR DEL DESCUENTO */}
                  <div className="rounded-2xl border border-zinc-850 bg-zinc-950/80 p-6 space-y-6 backdrop-blur-md shadow-xl font-opensauce">
                    <div className="border-b border-zinc-900 pb-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                        <span className="text-[#00e8ff]">🏷️</span> Card 1: Código & Valor del Descuento
                      </h3>
                    </div>

                    {/* Coupon Code Input */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                          Código del Cupón *
                        </label>
                        <button
                          type="button"
                          onClick={handleGenerateRandomCode}
                          className="text-[10px] text-[#00e8ff] font-bold hover:underline"
                        >
                          ⚡ Generar Código Aleatorio
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={formCode}
                        onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-[#00e8ff] font-mono font-bold tracking-wider focus:outline-none focus:border-[#00e8ff]"
                        placeholder="Ej: GOSU20"
                      />
                      <p className="text-[10px] text-zinc-500 font-inter">
                        Los clientes ingresarán este código al momento de realizar el pago en el checkout.
                      </p>
                    </div>

                    {/* Discount Type Selector */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Tipo de Descuento *
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <label
                          onClick={() => setFormType('percentage')}
                          className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                            formType === 'percentage'
                              ? 'bg-zinc-900 border-[#00e8ff] text-white ring-1 ring-[#00e8ff]/40'
                              : 'bg-black border-zinc-850 text-zinc-400'
                          }`}
                        >
                          <span className="text-lg">Porcentaje %</span>
                          <span className="text-[10px] text-zinc-500 mt-1">Descuento de % sobre el subtotal</span>
                        </label>

                        <label
                          onClick={() => setFormType('fixed_amount')}
                          className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                            formType === 'fixed_amount'
                              ? 'bg-zinc-900 border-[#00e8ff] text-white ring-1 ring-[#00e8ff]/40'
                              : 'bg-black border-zinc-850 text-zinc-400'
                          }`}
                        >
                          <span className="text-lg">Monto Fijo S/.</span>
                          <span className="text-[10px] text-zinc-500 mt-1">Rebaja de monto fijo en Soles</span>
                        </label>

                        <label
                          onClick={() => setFormType('free_shipping')}
                          className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                            formType === 'free_shipping'
                              ? 'bg-zinc-900 border-[#00e8ff] text-white ring-1 ring-[#00e8ff]/40'
                              : 'bg-black border-zinc-850 text-zinc-400'
                          }`}
                        >
                          <span className="text-lg">Envío Gratis 🚚</span>
                          <span className="text-[10px] text-zinc-500 mt-1">Cero costo de despacho</span>
                        </label>
                      </div>
                    </div>

                    {/* Numerical Value Input */}
                    {formType !== 'free_shipping' && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                          Valor del Descuento {formType === 'percentage' ? '(%)' : '(S/.)'} *
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm">
                            {formType === 'percentage' ? '%' : 'S/.'}
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            required
                            value={formValue}
                            onChange={(e) => setFormValue(e.target.value)}
                            className="w-full bg-black border border-zinc-800 rounded-xl pl-12 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00e8ff] font-mono font-bold"
                            placeholder={formType === 'percentage' ? '20' : '15.00'}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CARD 2: APLICABILIDAD */}
                  <div className="rounded-2xl border border-zinc-850 bg-zinc-950/80 p-6 space-y-6 backdrop-blur-md shadow-xl font-opensauce">
                    <div className="border-b border-zinc-900 pb-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                        <span className="text-[#00e8ff]">🎯</span> Card 2: Aplicabilidad (¿A qué aplica?)
                      </h3>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Selecciona el alcance del descuento:
                      </label>

                      <div className="space-y-2">
                        <label
                          onClick={() => setFormApplicability('all')}
                          className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                            formApplicability === 'all'
                              ? 'bg-zinc-900 border-[#00e8ff] text-white'
                              : 'bg-black border-zinc-850 text-zinc-400'
                          }`}
                        >
                          <input type="radio" checked={formApplicability === 'all'} readOnly />
                          <div>
                            <p className="text-xs font-bold">Todos los productos</p>
                            <p className="text-[10px] text-zinc-500">Aplica a cualquier ítem del catálogo</p>
                          </div>
                        </label>

                        <label
                          onClick={() => setFormApplicability('categories')}
                          className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                            formApplicability === 'categories'
                              ? 'bg-zinc-900 border-[#00e8ff] text-white'
                              : 'bg-black border-zinc-850 text-zinc-400'
                          }`}
                        >
                          <input type="radio" checked={formApplicability === 'categories'} readOnly />
                          <div>
                            <p className="text-xs font-bold">Colecciones específicas</p>
                            <p className="text-[10px] text-zinc-500">Aplica solo a colecciones seleccionadas</p>
                          </div>
                        </label>

                        <label
                          onClick={() => setFormApplicability('products')}
                          className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                            formApplicability === 'products'
                              ? 'bg-zinc-900 border-[#00e8ff] text-white'
                              : 'bg-black border-zinc-850 text-zinc-400'
                          }`}
                        >
                          <input type="radio" checked={formApplicability === 'products'} readOnly />
                          <div>
                            <p className="text-xs font-bold">Productos específicos</p>
                            <p className="text-[10px] text-zinc-500">Aplica solo a ítems individuales elegidos</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* CARD 3: REQUISITOS MÍNIMOS */}
                  <div className="rounded-2xl border border-zinc-850 bg-zinc-950/80 p-6 space-y-6 backdrop-blur-md shadow-xl font-opensauce">
                    <div className="border-b border-zinc-900 pb-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                        <span className="text-[#00e8ff]">📋</span> Card 3: Requisitos Mínimos de Compra
                      </h3>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Condición para activar el descuento:
                      </label>

                      <div className="space-y-3">
                        <label
                          onClick={() => setFormMinimumReq('none')}
                          className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                            formMinimumReq === 'none'
                              ? 'bg-zinc-900 border-[#00e8ff] text-white'
                              : 'bg-black border-zinc-850 text-zinc-400'
                          }`}
                        >
                          <input type="radio" checked={formMinimumReq === 'none'} readOnly />
                          <div>
                            <p className="text-xs font-bold">Ninguno</p>
                            <p className="text-[10px] text-zinc-500">Sin restricción de monto ni unidades</p>
                          </div>
                        </label>

                        <div className="space-y-2">
                          <label
                            onClick={() => setFormMinimumReq('minimum_amount')}
                            className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                              formMinimumReq === 'minimum_amount'
                                ? 'bg-zinc-900 border-[#00e8ff] text-white'
                                : 'bg-black border-zinc-850 text-zinc-400'
                            }`}
                          >
                            <input type="radio" checked={formMinimumReq === 'minimum_amount'} readOnly />
                            <div>
                              <p className="text-xs font-bold">Monto mínimo de compra (S/.)</p>
                              <p className="text-[10px] text-zinc-500">Requiere un valor total mínimo en el carrito</p>
                            </div>
                          </label>

                          {formMinimumReq === 'minimum_amount' && (
                            <div className="pl-8 pt-1">
                              <input
                                type="number"
                                step="0.01"
                                value={formMinAmount}
                                onChange={(e) => setFormMinAmount(e.target.value)}
                                className="w-48 bg-black border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#00e8ff]"
                                placeholder="100.00"
                              />
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label
                            onClick={() => setFormMinimumReq('minimum_quantity')}
                            className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                              formMinimumReq === 'minimum_quantity'
                                ? 'bg-zinc-900 border-[#00e8ff] text-white'
                                : 'bg-black border-zinc-850 text-zinc-400'
                            }`}
                          >
                            <input type="radio" checked={formMinimumReq === 'minimum_quantity'} readOnly />
                            <div>
                              <p className="text-xs font-bold">Cantidad mínima de artículos</p>
                              <p className="text-[10px] text-zinc-500">Requiere llevar N número de productos</p>
                            </div>
                          </label>

                          {formMinimumReq === 'minimum_quantity' && (
                            <div className="pl-8 pt-1">
                              <input
                                type="number"
                                value={formMinQty}
                                onChange={(e) => setFormMinQty(e.target.value)}
                                className="w-36 bg-black border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#00e8ff]"
                                placeholder="3"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column: Dates & Limits */}
                <div className="space-y-8">
                  
                  {/* CARD 4: FECHAS & LÍMITES */}
                  <div className="rounded-2xl border border-zinc-850 bg-zinc-950/80 p-6 space-y-6 backdrop-blur-md shadow-xl font-opensauce">
                    <div className="border-b border-zinc-900 pb-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                        <span className="text-[#00e8ff]">📅</span> Card 4: Fechas & Programación
                      </h3>
                    </div>

                    {/* Start Date & Time */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Fecha y Hora de Inicio *
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={formStartDate}
                        onChange={(e) => setFormStartDate(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#00e8ff]"
                      />
                    </div>

                    {/* Optional End Date */}
                    <div className="space-y-3 border-t border-zinc-900 pt-4">
                      <label className="flex items-center gap-3 text-zinc-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formEndDateEnabled}
                          onChange={(e) => setFormEndDateEnabled(e.target.checked)}
                          className="h-4 w-4 rounded border-zinc-800 bg-black text-[#00e8ff] focus:ring-[#00e8ff]"
                        />
                        <span className="text-xs font-bold">Establecer fecha y hora de finalización</span>
                      </label>

                      {formEndDateEnabled && (
                        <input
                          type="datetime-local"
                          value={formEndDate}
                          onChange={(e) => setFormEndDate(e.target.value)}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#00e8ff]"
                        />
                      )}
                    </div>

                    {/* Optional Usage Limit */}
                    <div className="space-y-3 border-t border-zinc-900 pt-4">
                      <label className="flex items-center gap-3 text-zinc-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formMaxUsesEnabled}
                          onChange={(e) => setFormMaxUsesEnabled(e.target.checked)}
                          className="h-4 w-4 rounded border-zinc-800 bg-black text-[#00e8ff] focus:ring-[#00e8ff]"
                        />
                        <span className="text-xs font-bold">Limitar número total de usos</span>
                      </label>

                      {formMaxUsesEnabled && (
                        <input
                          type="number"
                          value={formMaxUses}
                          onChange={(e) => setFormMaxUses(e.target.value)}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#00e8ff]"
                          placeholder="100"
                        />
                      )}
                    </div>
                  </div>

                </div>

              </div>

            </form>
          )}

        </div>
      </main>

    </div>
  );
}
