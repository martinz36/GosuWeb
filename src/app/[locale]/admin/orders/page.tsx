'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  total: number;
  status: string;
  paymentId: string;
  createdAt: number;
}

export default function AdminOrdersPage({ params }: { params: Promise<{ locale: string }> }) {
  const [activeLocale, setActiveLocale] = useState('es');
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => setActiveLocale(p.locale || 'es'));
  }, [params]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/orders');
        const data = await res.json();
        if (data.success) {
          setOrdersList(data.orders || []);
        }
      } catch (err) {
        console.error('Error fetching admin orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      
      {/* Shopify-style Admin Sidebar */}
      <AdminSidebar locale={activeLocale} orderCount={ordersList.length} />

      {/* Main Orders Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="border-b border-zinc-900 pb-5">
            <span className="inline-block bg-zinc-900 border border-zinc-800 text-[#00e8ff] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full font-opensauce mb-2">
              MÓDULO DE PEDIDOS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase font-sigher tracking-wider text-white">
              Ventas / Pedidos
            </h2>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1 font-inter">
              Auditoría de transacciones completadas, cliente, dirección de envío y comprobante
            </p>
          </div>

          {/* Orders Table */}
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent border-[#00e8ff]" />
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-zinc-900 bg-zinc-950/40 font-opensauce">
              <table className="w-full border-collapse text-left text-sm text-zinc-400">
                <thead className="bg-zinc-950 text-[10px] uppercase font-bold tracking-wider text-zinc-500 border-b border-zinc-900">
                  <tr>
                    <th className="px-6 py-4">Pedido ID</th>
                    <th className="px-6 py-4">Fecha</th>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">Dirección de Envío</th>
                    <th className="px-6 py-4">Transacción ID</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {ordersList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-zinc-500 text-xs font-inter">
                        No se han registrado ventas en la base de datos todavía.
                      </td>
                    </tr>
                  ) : (
                    ordersList.map((order) => (
                      <tr key={order.id} className="hover:bg-zinc-900/20 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-white text-xs">
                          {order.id}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-xs">
                          {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>

                        <td className="px-6 py-4">
                          <div className="font-bold text-white text-xs">{order.customerName}</div>
                          <div className="text-[10px] text-zinc-500 mt-0.5">{order.customerEmail}</div>
                          <div className="text-[10px] text-zinc-500 mt-0.5">{order.customerPhone}</div>
                        </td>

                        <td className="px-6 py-4 text-xs max-w-xs truncate" title={order.shippingAddress}>
                          {order.shippingAddress}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap font-mono text-[10px] text-zinc-500">
                          {order.paymentId}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap font-black text-white text-sm font-sigher text-[#00e8ff]">
                          S/. {Number(order.total).toFixed(2)}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                            {order.status === 'completed' ? 'Completado' : order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
