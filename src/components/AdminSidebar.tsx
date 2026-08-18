'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminSidebarProps {
  locale: string;
  orderCount?: number;
}

export default function AdminSidebar({ locale, orderCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();

  // Collapsible state for "Productos" sub-menu
  const isProductsRoute = pathname.includes('/admin/products') || pathname.includes('/admin/categories');
  const [productsOpen, setProductsOpen] = useState(true);

  const navItems = [
    {
      label: 'Inicio',
      href: `/${locale}/admin`,
      exact: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
    },
    {
      label: 'Pedidos',
      href: `/${locale}/admin/orders`,
      badge: orderCount > 0 ? orderCount : null,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      ),
    },
    {
      label: 'Clientes',
      href: `/${locale}/admin/customers`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
    {
      label: 'Descuentos / Cupones',
      href: `/${locale}/admin/coupons`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
      ),
    },
    {
      label: 'Configuración',
      href: `/${locale}/admin/settings`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h3.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.796 3.111a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.798 3.111a1.125 1.125 0 01-1.37.49l-1.216-.456c-.356-.133-.751-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-3.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.797-3.111a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.797-3.111a1.125 1.125 0 011.37-.49l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-900 p-5 flex flex-col justify-between shrink-0 min-h-screen">
      
      <div className="space-y-7">
        
        {/* Brand Header */}
        <div className="px-2">
          <Link href={`/${locale}/admin`} className="block">
            <h1 className="text-2xl font-black tracking-widest text-white font-sigher glow-cyan uppercase">
              GOSU® BACK
            </h1>
            <p className="text-[10px] text-zinc-500 tracking-wider uppercase font-semibold font-opensauce">
              Panel de Administración
            </p>
          </Link>
        </div>

        {/* Navigation List (Shopify Architecture) */}
        <nav className="space-y-1.5 font-opensauce text-xs font-semibold">
          
          {/* 1. Inicio (Dashboard) */}
          <Link
            href={`/${locale}/admin`}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              pathname === `/${locale}/admin`
                ? 'bg-zinc-900 text-[#00e8ff] border border-zinc-800 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
            }`}
          >
            {navItems[0].icon}
            <span>Inicio</span>
          </Link>

          {/* 2. Productos (Collapsible Parent + Sub-items) */}
          <div className="space-y-1">
            <button
              onClick={() => setProductsOpen(!productsOpen)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                isProductsRoute
                  ? 'bg-zinc-900/80 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                <span>Productos</span>
              </div>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${productsOpen ? 'rotate-180' : ''}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {/* Sub-sections */}
            {productsOpen && (
              <div className="pl-9 space-y-1 border-l border-zinc-850 ml-5 py-1">
                <Link
                  href={`/${locale}/admin/products`}
                  className={`block py-1.5 px-3 rounded-lg text-[11px] transition-colors ${
                    pathname === `/${locale}/admin/products`
                      ? 'text-[#00e8ff] font-bold bg-zinc-900/60'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  • Todos los productos
                </Link>
                <Link
                  href={`/${locale}/admin/categories`}
                  className={`block py-1.5 px-3 rounded-lg text-[11px] transition-colors ${
                    pathname === `/${locale}/admin/categories`
                      ? 'text-[#00e8ff] font-bold bg-zinc-900/60'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  • Colecciones / Categorías
                </Link>
              </div>
            )}
          </div>

          {/* 3. Pedidos */}
          <Link
            href={`/${locale}/admin/orders`}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
              pathname === `/${locale}/admin/orders`
                ? 'bg-zinc-900 text-[#00e8ff] border border-zinc-800 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
            }`}
          >
            <div className="flex items-center gap-3">
              {navItems[1].icon}
              <span>Pedidos</span>
            </div>
            {orderCount > 0 && (
              <span className="bg-[#ff09bb] text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
                {orderCount}
              </span>
            )}
          </Link>

          {/* 4. Clientes */}
          <Link
            href={`/${locale}/admin/customers`}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              pathname === `/${locale}/admin/customers`
                ? 'bg-zinc-900 text-[#00e8ff] border border-zinc-800 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
            }`}
          >
            {navItems[2].icon}
            <span>Clientes</span>
          </Link>

          {/* 5. Descuentos / Cupones */}
          <Link
            href={`/${locale}/admin/coupons`}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              pathname === `/${locale}/admin/coupons`
                ? 'bg-zinc-900 text-[#00e8ff] border border-zinc-800 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
            }`}
          >
            {navItems[3].icon}
            <span>Descuentos / Cupones</span>
          </Link>

          {/* 6. Configuración */}
          <Link
            href={`/${locale}/admin/settings`}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              pathname === `/${locale}/admin/settings`
                ? 'bg-zinc-900 text-[#00e8ff] border border-zinc-800 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
            }`}
          >
            {navItems[4].icon}
            <span>Configuración</span>
          </Link>

        </nav>
      </div>

      {/* Footer Return Action */}
      <div className="pt-6 border-t border-zinc-900/80">
        <Link
          href={`/${locale}/shop`}
          className="w-full flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors font-opensauce"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
          <span>Ir a la Tienda</span>
        </Link>
      </div>

    </aside>
  );
}
