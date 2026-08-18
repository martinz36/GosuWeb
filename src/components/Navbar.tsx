'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';

interface NavbarProps {
  locale: 'es' | 'en';
  dict: {
    nav: {
      aboutUs: string;
      catalog: string;
      stores: string;
      becomePartner: string;
      cart: string;
    };
    cart: {
      title: string;
      empty: string;
      total: string;
      checkout: string;
      quantity: string;
      remove: string;
    };
  };
}

export default function Navbar({ locale, dict }: NavbarProps) {
  const { cartCount, setIsCartOpen } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper to change language
  const changeLanguage = (newLocale: 'es' | 'en') => {
    // pathname looks like "/es/about-us" or "/en/catalog"
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    router.push(newPath);
  };

  const navLinks = [
    { href: `/${locale}/about-us`, label: dict.nav.aboutUs },
    { href: `/${locale}/catalog`, label: dict.nav.catalog },
    { href: `/${locale}/stores`, label: dict.nav.stores },
    { href: `/${locale}/become-partner`, label: dict.nav.becomePartner },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-black/80 backdrop-blur-md border-b border-zinc-900 transition-all">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <span className="text-2xl font-black uppercase font-sigher tracking-wider text-white glow-cyan transition-all hover:text-[#00e8ff]">
              GOSU®
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs uppercase font-medium tracking-widest transition-colors ${
                    isActive ? 'text-[#00e8ff]' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="flex items-center gap-1 border border-zinc-800 rounded-full px-2 py-0.5 bg-zinc-950">
              <button
                onClick={() => changeLanguage('es')}
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-colors ${
                  locale === 'es' ? 'bg-[#00e8ff] text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                ES
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-colors ${
                  locale === 'en' ? 'bg-[#00e8ff] text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-zinc-400 hover:text-white rounded-full transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff09bb] text-[9px] font-extrabold text-white animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-zinc-400 hover:text-white md:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-zinc-900 bg-black/95 p-4 space-y-4">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-semibold tracking-wider text-zinc-400 hover:text-white uppercase"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Cart Sliding Drawer */}
      <CartDrawer locale={locale} dict={dict.cart} />
    </>
  );
}
