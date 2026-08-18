'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const [activeLocale, setActiveLocale] = useState('es');
  const [stats, setStats] = useState({
    productsCount: 0,
    ordersCount: 0,
    totalSales: 0,
    totalStock: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => setActiveLocale(p.locale || 'es'));
  }, [params]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const prodRes = await fetch('/api/products');
        const prodData = await prodRes.json();
        
        const ordRes = await fetch('/api/admin/orders');
        const ordData = await ordRes.json();

        const products = prodData.products || [];
        const orders = ordData.orders || [];

        const totalSales = orders.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0);
        const totalStock = products.reduce((sum: number, p: any) => sum + (Number(p.stock) || 0), 0);

        setStats({
          productsCount: products.length,
          ordersCount: orders.length,
          totalSales,
          totalStock,
        });
      } catch (err) {
        console.error('Error fetching admin dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      
      {/* Shopify-style Admin Sidebar */}
      <AdminSidebar locale={activeLocale} orderCount={stats.ordersCount} />

      {/* Main Dashboard Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-900 pb-5">
            <div>
              <span className="inline-block bg-zinc-900 border border-zinc-800 text-[#00e8ff] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full font-opensauce mb-2">
                PANEL DE CONTROL
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase font-sigher tracking-wider text-white">
                Inicio (Dashboard)
              </h2>
              <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1 font-inter">
                Resumen general de rendimiento, métricas de inventario y pedidos en tiempo real
              </p>
            </div>

            <Link
              href={`/${activeLocale}/admin/products`}
              className="flex items-center gap-2 rounded-full bg-white text-black font-extrabold uppercase text-xs px-5 py-2.5 hover:bg-[#00e8ff] hover:shadow-[0_0_15px_rgba(0,232,255,0.4)] transition-all font-opensauce"
            >
              <span>Gestionar Productos</span>
            </Link>
          </div>

          {/* Metric Cards Grid */}
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent border-[#00e8ff]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Card 1: Ventas Totales */}
              <div className="p-6 rounded-2xl border border-zinc-850 bg-zinc-950/80 backdrop-blur-md space-y-2">
                <div className="flex items-center justify-between text-zinc-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider font-opensauce">Ventas Totales</span>
                  <span className="text-[#00e8ff]">💰</span>
                </div>
                <p className="text-3xl font-black font-sigher text-white glow-cyan">
                  S/. {stats.totalSales.toFixed(2)}
                </p>
                <p className="text-[10px] text-zinc-500 font-inter">Registradas vía pasarela</p>
              </div>

              {/* Card 2: Total Pedidos */}
              <div className="p-6 rounded-2xl border border-zinc-850 bg-zinc-950/80 backdrop-blur-md space-y-2">
                <div className="flex items-center justify-between text-zinc-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider font-opensauce">Pedidos Realizados</span>
                  <span className="text-[#ff09bb]">📦</span>
                </div>
                <p className="text-3xl font-black font-sigher text-white">
                  {stats.ordersCount}
                </p>
                <p className="text-[10px] text-zinc-500 font-inter">Órdenes procesadas</p>
              </div>

              {/* Card 3: Productos Activos */}
              <div className="p-6 rounded-2xl border border-zinc-850 bg-zinc-950/80 backdrop-blur-md space-y-2">
                <div className="flex items-center justify-between text-zinc-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider font-opensauce">Productos en Catálogo</span>
                  <span className="text-[#00e8ff]">🏷️</span>
                </div>
                <p className="text-3xl font-black font-sigher text-white">
                  {stats.productsCount}
                </p>
                <p className="text-[10px] text-zinc-500 font-inter">En tienda pública</p>
              </div>

              {/* Card 4: Stock Total */}
              <div className="p-6 rounded-2xl border border-zinc-850 bg-zinc-950/80 backdrop-blur-md space-y-2">
                <div className="flex items-center justify-between text-zinc-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider font-opensauce">Stock Total en Almacén</span>
                  <span className="text-emerald-400">⚡</span>
                </div>
                <p className="text-3xl font-black font-sigher text-emerald-400">
                  {stats.totalStock} u.
                </p>
                <p className="text-[10px] text-zinc-500 font-inter">Unidades disponibles</p>
              </div>

            </div>
          )}

          {/* Quick Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            
            <Link
              href={`/${activeLocale}/admin/products`}
              className="p-6 rounded-2xl border border-zinc-850 bg-zinc-950/60 hover:bg-zinc-900/60 transition-all space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold uppercase tracking-wider font-opensauce text-white group-hover:text-[#00e8ff] transition-colors">
                  📦 Módulo de Productos
                </h3>
                <span className="text-xs text-[#00e8ff] font-bold">Ver Todos →</span>
              </div>
              <p className="text-xs text-zinc-400 font-inter">
                Administra inventarios, carga nuevos lanzamientos, modifica precios y ajusta cantidades de stock.
              </p>
            </Link>

            <Link
              href={`/${activeLocale}/admin/orders`}
              className="p-6 rounded-2xl border border-zinc-850 bg-zinc-950/60 hover:bg-zinc-900/60 transition-all space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold uppercase tracking-wider font-opensauce text-white group-hover:text-[#00e8ff] transition-colors">
                  🛒 Módulo de Pedidos
                </h3>
                <span className="text-xs text-[#00e8ff] font-bold">Ver Órdenes →</span>
              </div>
              <p className="text-xs text-zinc-400 font-inter">
                Audita las ventas registradas, datos del comprador, método de pago y estado de despacho.
              </p>
            </Link>

          </div>

        </div>
      </main>

    </div>
  );
}
