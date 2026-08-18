'use client';

import React from 'react';
import Link from 'next/link';
import GosuLogo from './GosuLogo';

export default function ShopFooter({ locale }: { locale: 'es' | 'en' }) {
  const isEs = locale === 'es';

  return (
    <footer className="border-t border-zinc-900 bg-black/90 py-12 px-4 text-center text-xs text-zinc-500 space-y-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-left space-y-2">
          <Link href={`/${locale}`} className="inline-block">
            <GosuLogo width={70} height={38} />
          </Link>
          <p className="text-zinc-500 text-[11px] font-inter max-w-sm">
            {isEs
              ? 'Accesorios de alta calidad diseñados para proteger, optimizar y flexibilizar tu colección.'
              : 'High quality accessories designed to protect, optimize and elevate your collection.'}
          </p>
        </div>

        <div className="flex items-center gap-6 font-inter text-xs text-zinc-400">
          <Link href={`/${locale}/catalog`} className="hover:text-white transition-colors">
            {isEs ? 'Catálogo' : 'Catalog'}
          </Link>
          <Link href={`/${locale}/stores`} className="hover:text-white transition-colors">
            {isEs ? 'Tiendas' : 'Stores'}
          </Link>
          <Link href={`/${locale}/become-partner`} className="hover:text-[#00e8ff] transition-colors">
            {isEs ? 'Vuélvete partner' : 'Become partner'}
          </Link>
        </div>
      </div>

      <div className="pt-6 border-t border-zinc-900/60 text-[10px] text-zinc-600 font-inter">
        © {new Date().getFullYear()} GOSU®. Todos los derechos reservados.
      </div>
    </footer>
  );
}
