'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AffiliateDashboardClient({ locale }: { locale: string }) {
  const [copied, setCopied] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState('Yape: 987654321 (Carlos Mendoza)');
  const [editingPayment, setEditingPayment] = useState(false);

  // Mock affiliate portal data
  const affiliateData = {
    name: 'Carlos Mendoza',
    code: 'GOSU-CARLOS',
    refUrl: `http://localhost:3000/${locale}/shop?ref=GOSU-CARLOS`,
    commissionRate: 10,
    totalClicks: 342,
    totalOrders: 18,
    totalCommissionEarned: 570.0,
    balancePending: 120.0,
    balancePaid: 450.0,
  };

  const referralSalesHistory = [
    { id: 'REF-801', orderId: 'GOSU-ORD-1095', date: '2026-08-15', amount: 135.0, commission: 13.5, status: 'pending' },
    { id: 'REF-792', orderId: 'GOSU-ORD-1082', date: '2026-08-02', amount: 240.0, commission: 24.0, status: 'pending' },
    { id: 'REF-755', orderId: 'GOSU-ORD-1044', date: '2026-07-18', amount: 450.0, commission: 45.0, status: 'paid' },
    { id: 'REF-712', orderId: 'GOSU-ORD-1010', date: '2026-06-30', amount: 800.0, commission: 80.0, status: 'paid' },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(affiliateData.refUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSavePaymentInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setEditingPayment(false);
    alert('¡Información de pago actualizada con éxito!');
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#00e8ff] selection:text-black font-opensauce">
      
      {/* Top Header Navigation */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl sm:text-2xl font-black tracking-widest text-white font-sigher glow-cyan uppercase">
              GOSU® AFILIADOS
            </h1>
            <span className="bg-[#00e8ff]/20 text-[#00e8ff] border border-[#00e8ff]/40 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full">
              Portal del Afiliado
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-zinc-400 font-bold hidden sm:inline">
              Hola, <span className="text-white">{affiliateData.name}</span>
            </span>
            <Link
              href={`/${locale}/afiliados/login`}
              className="text-xs text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl transition-colors font-semibold"
            >
              Cerrar Sesión
            </Link>
          </div>
        </div>
      </header>

      {/* Main Portal Dashboard Content */}
      <main className="max-w-7xl mx-auto p-6 sm:p-8 space-y-8 pb-20">
        
        {/* Referral Link Banner Card */}
        <div className="rounded-3xl border border-zinc-850 bg-zinc-950/90 p-6 sm:p-8 space-y-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00e8ff]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                TU ENLACE ÚNICO DE REFERIDO & CÓDIGO
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Comparte tu enlace y gana <span className="text-[#00e8ff]">{affiliateData.commissionRate}% de comisión</span> por cada venta
              </h2>
              <p className="text-xs text-zinc-400 font-inter">
                Tus seguidores obtienen un 10% de descuento automático al ingresar con tu código o enlace.
              </p>
            </div>

            {/* Code Badge */}
            <div className="bg-black border border-zinc-800 p-3 rounded-2xl flex items-center justify-between gap-4 font-mono">
              <div>
                <span className="text-[9px] text-zinc-500 font-bold block font-opensauce uppercase">Tu Código de Cupón:</span>
                <span className="text-lg font-black text-[#00e8ff] tracking-widest">{affiliateData.code}</span>
              </div>
            </div>
          </div>

          {/* Copy Link Input Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 relative z-10">
            <input
              type="text"
              readOnly
              value={affiliateData.refUrl}
              className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-3 text-xs text-[#00e8ff] font-mono focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="w-full sm:w-auto shrink-0 px-6 py-3 rounded-2xl bg-[#00e8ff] text-black font-extrabold uppercase text-xs tracking-wider hover:bg-white transition-all shadow-[0_0_15px_rgba(0,232,255,0.3)]"
            >
              {copied ? '✓ ¡Enlace Copiado!' : 'Copiar Enlace'}
            </button>
          </div>
        </div>

        {/* Real-time Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Card 1: Total Clicks */}
          <div className="p-5 rounded-2xl border border-zinc-850 bg-zinc-950/80 space-y-1">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">👆 Clics Totales</span>
            <p className="text-3xl font-black font-sigher text-white">{affiliateData.totalClicks}</p>
            <p className="text-[10px] text-zinc-500 font-inter">Visitas enviadas a la tienda</p>
          </div>

          {/* Card 2: Total Orders */}
          <div className="p-5 rounded-2xl border border-zinc-850 bg-zinc-950/80 space-y-1">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">📦 Pedidos Realizados</span>
            <p className="text-3xl font-black font-sigher text-white">{affiliateData.totalOrders}</p>
            <p className="text-[10px] text-zinc-500 font-inter">Ventas referidas con éxito</p>
          </div>

          {/* Card 3: Total Commission Earned */}
          <div className="p-5 rounded-2xl border border-zinc-850 bg-zinc-950/80 space-y-1">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">💰 Comisión Ganada</span>
            <p className="text-3xl font-black font-sigher text-[#00e8ff] glow-cyan">
              S/. {affiliateData.totalCommissionEarned.toFixed(2)}
            </p>
            <p className="text-[10px] text-zinc-500 font-inter">Acumulado histórico total</p>
          </div>

          {/* Card 4: Balance Pending */}
          <div className="p-5 rounded-2xl border border-zinc-850 bg-zinc-950/80 space-y-1">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">⏳ Saldo por Cobrar</span>
            <p className="text-3xl font-black font-sigher text-amber-400">
              S/. {affiliateData.balancePending.toFixed(2)}
            </p>
            <p className="text-[10px] text-zinc-500 font-inter">Pendiente de liquidación</p>
          </div>

          {/* Card 5: Balance Paid */}
          <div className="p-5 rounded-2xl border border-zinc-850 bg-zinc-950/80 space-y-1">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">💵 Saldo Cobrado</span>
            <p className="text-3xl font-black font-sigher text-emerald-400">
              S/. {affiliateData.balancePaid.toFixed(2)}
            </p>
            <p className="text-[10px] text-zinc-500 font-inter">Transferido a tu cuenta</p>
          </div>

        </div>

        {/* Layout Bottom Grid: Payment Info & Sales History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Payment Information Form */}
          <div className="rounded-2xl border border-zinc-850 bg-zinc-950/80 p-6 space-y-4 backdrop-blur-md h-fit">
            <div className="border-b border-zinc-900 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                💳 Método de Cobro
              </h3>
              {!editingPayment && (
                <button
                  onClick={() => setEditingPayment(true)}
                  className="text-[10px] text-[#00e8ff] font-bold uppercase hover:underline"
                >
                  Editar Datos
                </button>
              )}
            </div>

            {editingPayment ? (
              <form onSubmit={handleSavePaymentInfo} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 uppercase font-bold">
                    Datos de Depósito (Yape, Plin, CCI o Banco)
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={paymentInfo}
                    onChange={(e) => setPaymentInfo(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#00e8ff] font-mono"
                    placeholder="Ej: Yape: 987654321 a nombre de..."
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-[#00e8ff] text-black text-xs font-extrabold uppercase rounded-xl hover:bg-white transition-colors"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingPayment(false)}
                    className="px-4 py-2 border border-zinc-800 text-zinc-400 text-xs font-bold uppercase rounded-xl hover:text-white"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-zinc-300 font-mono p-3 rounded-xl bg-black border border-zinc-850 leading-relaxed">
                  {paymentInfo}
                </p>
                <p className="text-[10px] text-zinc-500 font-inter">
                  Las liquidaciones se transfieren automáticamente los días 1 y 15 de cada mes a tu cuenta registrada.
                </p>
              </div>
            )}
          </div>

          {/* Sales Referral History Table */}
          <div className="lg:col-span-2 rounded-2xl border border-zinc-850 bg-zinc-950/80 p-6 space-y-4 backdrop-blur-md">
            <div className="border-b border-zinc-900 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                📊 Ventas Referidas Recientes
              </h3>
              <span className="text-[10px] text-zinc-500 font-inter">Comisiones acreditadas</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-zinc-850 bg-black">
              <table className="w-full border-collapse text-left text-xs text-zinc-300">
                <thead className="bg-zinc-950 text-[10px] uppercase font-bold tracking-wider text-zinc-500 border-b border-zinc-850">
                  <tr>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Pedido ID</th>
                    <th className="px-4 py-3">Monto Venta</th>
                    <th className="px-4 py-3">Tu Comisión (10%)</th>
                    <th className="px-4 py-3 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {referralSalesHistory.map((row) => (
                    <tr key={row.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="px-4 py-3 font-mono text-zinc-400">{row.date}</td>
                      <td className="px-4 py-3 font-mono font-bold text-white">{row.orderId}</td>
                      <td className="px-4 py-3 font-mono">S/. {row.amount.toFixed(2)}</td>
                      <td className="px-4 py-3 font-mono font-bold text-[#00e8ff]">
                        + S/. {row.commission.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {row.status === 'paid' ? (
                          <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full">
                            Liquidado
                          </span>
                        ) : (
                          <span className="bg-amber-950/40 text-amber-400 border border-amber-900/60 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full">
                            Pendiente
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </main>

    </div>
  );
}
