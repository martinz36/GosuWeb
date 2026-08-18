'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import GosuLogo from './GosuLogo';

interface ShopNavbarProps {
  locale: 'es' | 'en';
  dict?: any;
}

export default function ShopNavbar({ locale }: ShopNavbarProps) {
  const isEs = locale === 'es';
  const { cartCount, setIsCartOpen } = useCart();
  const pathname = usePathname();

  const otherLocale = locale === 'es' ? 'en' : 'es';
  const targetLocalePath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent py-4 px-4 sm:px-8 transition-all">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between">
        
        {/* Exact Framer Vector SVG Logo */}
        <Link href={`/${locale}`} className="flex items-center group">
          <GosuLogo width={65} height={36} className="group-hover:opacity-80 transition-opacity" />
        </Link>

        {/* Right Section: Nav Items & Cart (Matching Screenshot 1) */}
        <div className="flex items-center gap-6 sm:gap-8 font-opensauce text-[14px] font-light text-white tracking-normal">
          <nav className="hidden md:flex items-center gap-6 sm:gap-8">
            <Link href={`/${locale}/about-us`} className="hover:opacity-75 transition-opacity">
              {isEs ? 'Nosotros' : 'About Us'}
            </Link>
            <Link href={`/${locale}/catalog`} className="hover:opacity-75 transition-opacity">
              {isEs ? 'Catálogo' : 'Catalog'}
            </Link>
            <Link href={`/${locale}/shop`} className="text-white hover:text-[#00e8ff] font-normal transition-colors">
              {isEs ? 'Tienda' : 'Store'}
            </Link>
            <Link href={`/${locale}/stores`} className="hover:opacity-75 transition-opacity">
              {isEs ? 'Tiendas' : 'Stores'}
            </Link>
            <Link href={`/${locale}/become-partner`} className="hover:opacity-75 transition-opacity">
              {isEs ? 'Vuélvete partner' : 'Become partner'}
            </Link>
          </nav>

          {/* Language Switcher */}
          <Link
            href={targetLocalePath}
            className="flex items-center gap-1 hover:opacity-75 transition-opacity"
          >
            <span className="text-[13px]">🌐</span>
            <span className="capitalize">{locale === 'es' ? 'Es' : 'En'}</span>
          </Link>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-1.5 text-white hover:text-[#00e8ff] transition-colors"
            title="Cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff09bb] text-[9px] font-black text-white animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
