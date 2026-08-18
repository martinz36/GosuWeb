'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminSidebar from './AdminSidebar';

interface AffiliateItem {
  id: string;
  name: string;
  email: string;
  code: string;
  commissionRate: number; // e.g. 10%
  balancePending: number;
  balancePaid: number;
  paymentInfo: string;
  status: 'pendiente' | 'aprobado' | 'rechazado';
  totalSalesGenerated: number;
  totalClicks: number;
}

const INITIAL_AFFILIATES: AffiliateItem[] = [
  {
    id: 'aff-1',
    name: 'Carlos TCG Gamer',
    email: 'carlos.tcg@gmail.com',
    code: 'GOSU-CARLOS',
    commissionRate: 10,
    balancePending: 120.0,
    balancePaid: 450.0,
    paymentInfo: 'Yape: 987654321 (Carlos Mendoza)',
    status: 'aprobado',
    totalSalesGenerated: 5700.0,
    totalClicks: 342,
  },
  {
    id: 'aff-2',
    name: 'Valeria Lorcana Streamer',
    email: 'valeria.streamer@gmail.com',
    code: 'GOSU-VALERIA',
    commissionRate: 12,
    balancePending: 240.0,
    balancePaid: 800.0,
    paymentInfo: 'Plin: 912345678 | BCP CCI: 002191000000000000',
    status: 'aprobado',
    totalSalesGenerated: 8666.6,
    totalClicks: 520,
  },
  {
    id: 'aff-3',
    name: 'Mateo Magic Collector',
    email: 'mateo.magic@outlook.com',
    code: 'GOSU-MATEO',
    commissionRate: 10,
    balancePending: 0.0,
    balancePaid: 0.0,
    paymentInfo: 'Yape: 955443322',
    status: 'pendiente',
    totalSalesGenerated: 0.0,
    totalClicks: 15,
  },
];

export default function AdminAffiliatesClient({ locale }: { locale: string }) {
  const [affiliates, setAffiliates] = useState<AffiliateItem[]>(INITIAL_AFFILIATES);
  const [editingRates, setEditingRates] = useState<Record<string, string>>({
    'aff-1': '10',
    'aff-2': '12',
    'aff-3': '10',
  });

  // Calculate global metrics
  const totalPending = affiliates.reduce((sum, a) => sum + a.balancePending, 0);
  const totalPaid = affiliates.reduce((sum, a) => sum + a.balancePaid, 0);
  const totalSalesAll = affiliates.reduce((sum, a) => sum + a.totalSalesGenerated, 0);

  // Approve pending affiliate
  const handleApprove = (id: string) => {
    setAffiliates(
      affiliates.map((a) => (a.id === id ? { ...a, status: 'aprobado' } : a))
    );
    alert('¡Solicitud de afiliado aprobada con éxito!');
  };

  // Mark pending balance as Paid / Liquidated
  const handleMarkAsPaid = (id: string) => {
    setAffiliates(
      affiliates.map((a) => {
        if (a.id === id) {
          if (a.balancePending <= 0) {
            alert('Este afiliado no tiene saldo pendiente por cobrar.');
            return a;
          }
          const amountPaid = a.balancePending;
          alert(`¡Liquidación completada! Se ha registrado el pago de S/. ${amountPaid.toFixed(2)} al afiliado.`);
          return {
            ...a,
            balancePaid: a.balancePaid + amountPaid,
            balancePending: 0.0,
          };
        }
        return a;
      })
    );
  };

  // Save updated commission rate %
  const handleSaveRate = (id: string) => {
    const newRate = parseFloat(editingRates[id]);
    if (isNaN(newRate) || newRate < 0 || newRate > 100) {
      alert('Por favor ingresa una tasa de comisión válida (0 - 100%).');
      return;
    }

    setAffiliates(
      affiliates.map((a) => (a.id === id ? { ...a, commissionRate: newRate } : a))
    );
    alert(`¡Tasa de comisión actualizada a ${newRate}%!`);
  };

  return (
    <div className="flex min-h-screen bg-black text-white font-sans selection:bg-[#00e8ff] selection:text-black">
      
      {/* Shopify-style Admin Sidebar */}
      <AdminSidebar locale={locale} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
            <div>
              <span className="inline-block bg-zinc-900 border border-zinc-800 text-[#00e8ff] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full font-opensauce mb-2">
                MÓDULO DE AFILIADOS & REFERIDOS
              </span>
              <h1 className="text-2xl sm:text-3xl font-black uppercase font-sigher tracking-wider text-white">
                Programa de Afiliados
              </h1>
              <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1 font-inter">
                Gestión de solicitudes, comisiones, liquidaciones de saldo y códigos de descuento
              </p>
            </div>

            <Link
              href={`/${locale}/afiliados/login`}
              target="_blank"
              className="flex items-center gap-2 rounded-full bg-zinc-900 border border-zinc-800 text-white font-extrabold uppercase text-xs px-5 py-2.5 hover:border-[#00e8ff] hover:text-[#00e8ff] transition-all font-opensauce"
            >
              <span>🌐 Ir al Portal de Afiliados →</span>
            </Link>
          </div>

          {/* Metric Cards Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-opensauce">
            <div className="p-4 rounded-xl border border-zinc-850 bg-zinc-950/80">
              <span className="text-[10px] text-zinc-500 font-bold uppercase">Afiliados Activos</span>
              <p className="text-2xl font-black text-white font-sigher mt-1">{affiliates.length}</p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-850 bg-zinc-950/80">
              <span className="text-[10px] text-zinc-500 font-bold uppercase">Comisiones Pendientes por Pagar</span>
              <p className="text-2xl font-black text-[#00e8ff] font-sigher mt-1 glow-cyan">
                S/. {totalPending.toFixed(2)}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-850 bg-zinc-950/80">
              <span className="text-[10px] text-zinc-500 font-bold uppercase">Comisiones Liquidadas</span>
              <p className="text-2xl font-black text-emerald-400 font-sigher mt-1">
                S/. {totalPaid.toFixed(2)}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-850 bg-zinc-950/80">
              <span className="text-[10px] text-zinc-500 font-bold uppercase">Ventas Generadas por Afiliados</span>
              <p className="text-2xl font-black text-[#ff09bb] font-sigher mt-1">
                S/. {totalSalesAll.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Affiliates Management Table */}
          <div className="overflow-x-auto rounded-2xl border border-zinc-900 bg-zinc-950/40 font-opensauce">
            <table className="w-full border-collapse text-left text-sm text-zinc-400">
              <thead className="bg-zinc-950 text-[10px] uppercase font-bold tracking-wider text-zinc-500 border-b border-zinc-900">
                <tr>
                  <th className="px-6 py-4">Afiliado / Email</th>
                  <th className="px-6 py-4">Código / Enlace</th>
                  <th className="px-6 py-4">Comisión (%)</th>
                  <th className="px-6 py-4">Datos de Pago</th>
                  <th className="px-6 py-4">Ventas Generadas</th>
                  <th className="px-6 py-4">Saldo Pendiente</th>
                  <th className="px-6 py-4 text-center">Estado</th>
                  <th className="px-6 py-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {affiliates.map((aff) => (
                  <tr key={aff.id} className="hover:bg-zinc-900/20 transition-colors">
                    
                    {/* Name & Email */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-white text-xs">{aff.name}</div>
                      <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{aff.email}</div>
                    </td>

                    {/* Code */}
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">
                      <span className="bg-zinc-900 text-[#00e8ff] border border-zinc-800 px-2.5 py-1 rounded font-bold">
                        {aff.code}
                      </span>
                    </td>

                    {/* Commission Rate % Editable */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          step="0.5"
                          className="w-16 bg-black border border-zinc-800 rounded px-2 py-1 text-xs text-white text-center font-bold focus:outline-none focus:border-[#00e8ff]"
                          value={editingRates[aff.id] ?? aff.commissionRate}
                          onChange={(e) =>
                            setEditingRates({ ...editingRates, [aff.id]: e.target.value })
                          }
                        />
                        <span className="text-xs text-zinc-500 font-bold">%</span>
                        <button
                          onClick={() => handleSaveRate(aff.id)}
                          className="text-[9px] bg-zinc-900 text-zinc-300 hover:text-white px-2 py-1 rounded border border-zinc-800 font-bold"
                          title="Guardar porcentaje de comisión"
                        >
                          ✓
                        </button>
                      </div>
                    </td>

                    {/* Payment Info */}
                    <td className="px-6 py-4 text-xs max-w-xs truncate" title={aff.paymentInfo}>
                      <span className="text-zinc-300 font-mono text-[11px]">
                        {aff.paymentInfo || 'Sin datos de pago'}
                      </span>
                    </td>

                    {/* Sales Generated */}
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-zinc-200">
                      S/. {aff.totalSalesGenerated.toFixed(2)}
                      <div className="text-[9px] text-zinc-500 font-inter">{aff.totalClicks} clics</div>
                    </td>

                    {/* Pending Balance */}
                    <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-sm">
                      {aff.balancePending > 0 ? (
                        <span className="text-[#00e8ff]">S/. {aff.balancePending.toFixed(2)}</span>
                      ) : (
                        <span className="text-zinc-500">S/. 0.00</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {aff.status === 'aprobado' ? (
                        <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                          Aprobado
                        </span>
                      ) : (
                        <span className="bg-amber-950/40 text-amber-400 border border-amber-900/60 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                          Pendiente
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        {aff.status === 'pendiente' ? (
                          <button
                            onClick={() => handleApprove(aff.id)}
                            className="rounded-lg bg-[#00e8ff] text-black font-extrabold text-[10px] uppercase px-3 py-1.5 hover:bg-white transition-all shadow-[0_0_10px_rgba(0,232,255,0.3)]"
                          >
                            Aprobar
                          </button>
                        ) : (
                          <button
                            onClick={() => handleMarkAsPaid(aff.id)}
                            disabled={aff.balancePending <= 0}
                            className={`rounded-lg text-[10px] font-bold uppercase px-3 py-1.5 transition-all ${
                              aff.balancePending > 0
                                ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-black'
                                : 'bg-zinc-900 border border-zinc-850 text-zinc-600 cursor-not-allowed'
                            }`}
                          >
                            Marcar Pagado
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </main>

    </div>
  );
}
