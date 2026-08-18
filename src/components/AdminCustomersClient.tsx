'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminSidebar from './AdminSidebar';

interface CustomerOrderHistory {
  id: string;
  date: string;
  items: string;
  total: number;
  status: 'completed' | 'shipping' | 'cancelled';
}

interface CustomerItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  address: string;
  orderCount: number;
  totalSpent: number;
  registeredDate: string;
  isVIP: boolean;
  orders: CustomerOrderHistory[];
}

const INITIAL_CUSTOMERS: CustomerItem[] = [
  {
    id: 'cust-1',
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@gmail.com',
    phone: '+51 987 654 321',
    location: 'Miraflores, Lima',
    address: 'Av. Larco 456, Apt. 502, Miraflores, Lima',
    orderCount: 6,
    totalSpent: 540.0,
    registeredDate: '12 de Enero, 2026',
    isVIP: true,
    orders: [
      {
        id: 'GOSU-ORD-1095',
        date: '2026-08-15',
        items: '2x Fundas TCG Matte Azul Cobalto, 1x Deck Box Armor Vault',
        total: 135.0,
        status: 'completed',
      },
      {
        id: 'GOSU-ORD-1082',
        date: '2026-08-02',
        items: '3x Fundas Board Game Clear 57.5x89mm',
        total: 54.0,
        status: 'completed',
      },
      {
        id: 'GOSU-ORD-1044',
        date: '2026-07-18',
        items: '1x Carpeta Premium 9-Pocket Zip Binder Negro',
        total: 85.0,
        status: 'completed',
      },
    ],
  },
  {
    id: 'cust-2',
    name: 'Valeria Rivas',
    email: 'vrivas.tcg@hotmail.com',
    phone: '+51 912 345 678',
    location: 'San Isidro, Lima',
    address: 'Calle Los Laureles 120, San Isidro, Lima',
    orderCount: 4,
    totalSpent: 385.0,
    registeredDate: '05 de Febrero, 2026',
    isVIP: true,
    orders: [
      {
        id: 'GOSU-ORD-1091',
        date: '2026-08-11',
        items: '4x Fundas TCG Matte Negro Azabache',
        total: 140.0,
        status: 'completed',
      },
      {
        id: 'GOSU-ORD-1070',
        date: '2026-07-25',
        items: '1x Carpeta Premium 9-Pocket Zip Binder - Rojo',
        total: 85.0,
        status: 'completed',
      },
    ],
  },
  {
    id: 'cust-3',
    name: 'Gonzalo Alarcón',
    email: 'gonzalo.alarcon@outlook.com',
    phone: '+51 976 543 210',
    location: 'Surco, Lima',
    address: 'Av. Primavera 890, Surco, Lima',
    orderCount: 2,
    totalSpent: 175.0,
    registeredDate: '20 de Marzo, 2026',
    isVIP: false,
    orders: [
      {
        id: 'GOSU-ORD-1088',
        date: '2026-08-09',
        items: '1x Deck Box Magnético Armor Vault + 2x Inner Sleeves',
        total: 105.0,
        status: 'completed',
      },
      {
        id: 'GOSU-ORD-1020',
        date: '2026-06-14',
        items: '2x Fundas TCG Matte Rojo Rubí',
        total: 70.0,
        status: 'completed',
      },
    ],
  },
  {
    id: 'cust-4',
    name: 'Andrea Morales',
    email: 'andrea.morales@gmail.com',
    phone: '+51 955 443 322',
    location: 'Arequipa, Perú',
    address: 'Calle Mercaderes 304, Arequipa',
    orderCount: 3,
    totalSpent: 290.0,
    registeredDate: '10 de Abril, 2026',
    isVIP: false,
    orders: [
      {
        id: 'GOSU-ORD-1093',
        date: '2026-08-14',
        items: '5x Fundas Board Game Standard Clear',
        total: 100.0,
        status: 'shipping',
      },
      {
        id: 'GOSU-ORD-1061',
        date: '2026-07-20',
        items: '2x Carpeta Premium 9-Pocket Zip Binder',
        total: 170.0,
        status: 'completed',
      },
    ],
  },
  {
    id: 'cust-5',
    name: 'Diego Benavides',
    email: 'diego.benavides@yahoo.com',
    phone: '+51 944 332 211',
    location: 'Trujillo, Perú',
    address: 'Av. Larco 1020, Trujillo',
    orderCount: 1,
    totalSpent: 70.0,
    registeredDate: '01 de Agosto, 2026',
    isVIP: false,
    orders: [
      {
        id: 'GOSU-ORD-1077',
        date: '2026-08-01',
        items: '2x Fundas TCG Matte Azul Cobalto',
        total: 70.0,
        status: 'completed',
      },
    ],
  },
];

export default function AdminCustomersClient({ locale }: { locale: string }) {
  const [customers] = useState<CustomerItem[]>(INITIAL_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);

  // Filter customers by search query (Name or Email)
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Financial aggregates
  const totalSpentAll = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgCLV = totalSpentAll / (customers.length || 1);

  return (
    <div className="flex min-h-screen bg-black text-white font-sans selection:bg-[#00e8ff] selection:text-black">
      
      {/* Shopify-style Admin Sidebar */}
      <AdminSidebar locale={locale} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* VIEW 1: TABLA GENERAL DE CLIENTES & BUSCADOR */}
          {!selectedCustomer ? (
            <div className="space-y-6">
              
              {/* Header Action Row */}
              <div className="border-b border-zinc-900 pb-5">
                <span className="inline-block bg-zinc-900 border border-zinc-800 text-[#00e8ff] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full font-opensauce mb-2">
                  MÓDULO DE CLIENTES
                </span>
                <h1 className="text-2xl sm:text-3xl font-black uppercase font-sigher tracking-wider text-white">
                  Clientes Registrados
                </h1>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1 font-inter">
                  Directorio de compradores, historial de transacciones y valor de vida del cliente (CLV)
                </p>
              </div>

              {/* Metrics Summary Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-zinc-850 bg-zinc-950/80 font-opensauce">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">Total Clientes</span>
                  <p className="text-2xl font-black text-white font-sigher mt-1">{customers.length}</p>
                </div>

                <div className="p-4 rounded-xl border border-zinc-850 bg-zinc-950/80 font-opensauce">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">Ticket Promedio (CLV)</span>
                  <p className="text-2xl font-black text-[#00e8ff] font-sigher mt-1 glow-cyan">
                    S/. {avgCLV.toFixed(2)}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-zinc-850 bg-zinc-950/80 font-opensauce">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">Clientes VIP / Frecuentes</span>
                  <p className="text-2xl font-black text-[#ff09bb] font-sigher mt-1">
                    {customers.filter((c) => c.isVIP).length}
                  </p>
                </div>
              </div>

              {/* SEARCH BAR (Filtro por Nombre o Correo) */}
              <div className="relative font-opensauce">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#00e8ff] focus:ring-1 focus:ring-[#00e8ff]/50 font-inter placeholder:text-zinc-600 shadow-xl"
                  placeholder="Buscar cliente por nombre, correo electrónico o ubicación..."
                />

                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs font-bold"
                  >
                    Limpiar ✕
                  </button>
                )}
              </div>

              {/* Customers Table */}
              <div className="overflow-x-auto rounded-2xl border border-zinc-900 bg-zinc-950/40 font-opensauce">
                <table className="w-full border-collapse text-left text-sm text-zinc-400">
                  <thead className="bg-zinc-950 text-[10px] uppercase font-bold tracking-wider text-zinc-500 border-b border-zinc-900">
                    <tr>
                      <th className="px-6 py-4">Nombre del Cliente</th>
                      <th className="px-6 py-4">Correo Electrónico</th>
                      <th className="px-6 py-4">Ubicación</th>
                      <th className="px-6 py-4 text-center">Pedidos</th>
                      <th className="px-6 py-4">Total Gastado (CLV)</th>
                      <th className="px-6 py-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 text-xs font-inter">
                          No se encontraron clientes que coincidan con &ldquo;{searchQuery}&rdquo;.
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((cust) => {
                        const initials = cust.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase();

                        return (
                          <tr
                            key={cust.id}
                            onClick={() => setSelectedCustomer(cust)}
                            className="hover:bg-zinc-900/30 transition-colors cursor-pointer group"
                          >
                            {/* Name with Avatar */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-zinc-900 border border-zinc-800 text-[#00e8ff] flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
                                  {initials}
                                </div>
                                <div>
                                  <span className="font-bold text-white text-sm group-hover:text-[#00e8ff] transition-colors">
                                    {cust.name}
                                  </span>
                                  {cust.isVIP && (
                                    <span className="ml-2 bg-[#ff09bb]/20 text-[#ff09bb] border border-[#ff09bb]/40 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                                      VIP
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Email */}
                            <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-zinc-300">
                              {cust.email}
                            </td>

                            {/* Location */}
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-zinc-400">
                              📍 {cust.location}
                            </td>

                            {/* Orders Count */}
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="bg-zinc-900 border border-zinc-800 text-white px-3 py-1 rounded-full font-extrabold text-[11px]">
                                {cust.orderCount} pedidos
                              </span>
                            </td>

                            {/* Total Spent */}
                            <td className="px-6 py-4 whitespace-nowrap font-mono font-black text-white text-sm">
                              S/. {cust.totalSpent.toFixed(2)}
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCustomer(cust);
                                }}
                                className="rounded-lg bg-zinc-900 border border-zinc-800 hover:border-[#00e8ff] text-[#00e8ff] text-[10px] font-bold uppercase px-3.5 py-1.5 transition-colors"
                              >
                                Ver Detalle →
                              </button>
                            </td>

                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          ) : (
            
            /* VIEW 2: VISTA DE DETALLE DE CLIENTE */
            <div className="space-y-8 pb-16">
              
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b border-zinc-900 pb-5">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                    title="Volver a lista de clientes"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                  </button>
                  <div>
                    <span className="inline-block bg-zinc-900 border border-zinc-800 text-[#00e8ff] text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full font-opensauce mb-1">
                      DETALLE DEL CLIENTE
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black uppercase font-sigher tracking-wider text-white">
                      {selectedCustomer.name}
                    </h1>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-opensauce">
                  {selectedCustomer.isVIP && (
                    <span className="bg-[#ff09bb]/20 text-[#ff09bb] border border-[#ff09bb]/40 text-xs font-black uppercase px-3 py-1 rounded-full">
                      ★ Cliente VIP Frecuente
                    </span>
                  )}
                  <span className="bg-zinc-900 text-zinc-400 border border-zinc-800 text-xs font-bold px-3 py-1 rounded-full">
                    Registrado: {selectedCustomer.registeredDate}
                  </span>
                </div>
              </div>

              {/* Customer Detail Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Contact & Address Card */}
                <div className="space-y-6">
                  
                  <div className="rounded-2xl border border-zinc-850 bg-zinc-950/80 p-6 space-y-6 backdrop-blur-md shadow-xl font-opensauce">
                    <div className="flex items-center gap-4 border-b border-zinc-900 pb-4">
                      <div className="h-14 w-14 rounded-full bg-zinc-900 border border-zinc-800 text-[#00e8ff] flex items-center justify-center font-bold text-lg font-sigher glow-cyan">
                        {selectedCustomer.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-white uppercase">{selectedCustomer.name}</h3>
                        <p className="text-xs text-zinc-500 font-mono mt-0.5">{selectedCustomer.email}</p>
                      </div>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase font-bold block">Teléfono / WhatsApp</span>
                        <span className="text-white font-mono">{selectedCustomer.phone}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase font-bold block">Ubicación</span>
                        <span className="text-zinc-300">📍 {selectedCustomer.location}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase font-bold block">Dirección Principal de Envío</span>
                        <span className="text-zinc-300 font-inter leading-relaxed">{selectedCustomer.address}</span>
                      </div>
                    </div>

                    {/* Financial Summary Card */}
                    <div className="p-4 rounded-xl bg-black border border-zinc-850 space-y-3">
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block">Resumen de Compras</span>

                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="p-2 rounded-lg bg-zinc-900/80">
                          <span className="text-[9px] text-zinc-500 font-bold block">Total Gastado</span>
                          <span className="text-sm font-black text-[#00e8ff] font-mono">
                            S/. {selectedCustomer.totalSpent.toFixed(2)}
                          </span>
                        </div>

                        <div className="p-2 rounded-lg bg-zinc-900/80">
                          <span className="text-[9px] text-zinc-500 font-bold block">Pedidos Totales</span>
                          <span className="text-sm font-black text-white font-mono">
                            {selectedCustomer.orderCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column: Order History */}
                <div className="lg:col-span-2 space-y-6 font-opensauce">
                  <div className="rounded-2xl border border-zinc-850 bg-zinc-950/80 p-6 space-y-6 backdrop-blur-md shadow-xl">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                        <span className="text-[#00e8ff]">🛍️</span> Historial de Pedidos Realizados
                      </h3>
                      <span className="text-[10px] text-zinc-500 font-inter">
                        {selectedCustomer.orders.length} órdenes registradas
                      </span>
                    </div>

                    <div className="space-y-4">
                      {selectedCustomer.orders.map((ord) => (
                        <div
                          key={ord.id}
                          className="p-4 rounded-xl bg-black border border-zinc-850 hover:border-zinc-700 transition-all space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-white text-xs bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800">
                                {ord.id}
                              </span>
                              <span className="text-[11px] text-zinc-500 font-mono">
                                📅 {ord.date}
                              </span>
                            </div>

                            <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                              {ord.status === 'completed' ? 'Completado' : 'En Despacho'}
                            </span>
                          </div>

                          <div className="text-xs text-zinc-300 font-inter">
                            <span className="text-[10px] text-zinc-500 font-bold block font-opensauce uppercase mb-0.5">Artículos Comprados:</span>
                            {ord.items}
                          </div>

                          <div className="flex justify-between items-center pt-2 border-t border-zinc-900 text-xs">
                            <span className="text-zinc-500 font-bold">Monto Total del Pedido:</span>
                            <span className="font-black text-[#00e8ff] font-mono text-sm">
                              S/. {ord.total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      </main>

    </div>
  );
}
