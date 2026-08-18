'use client';

import React from 'react';
import AdminSidebar from './AdminSidebar';

interface AdminComingSoonProps {
  locale: string;
  title: string;
  subtitle: string;
  sectionName: string;
}

export default function AdminComingSoon({
  locale,
  title,
  subtitle,
  sectionName,
}: AdminComingSoonProps) {
  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      
      {/* Shopify-style Admin Sidebar */}
      <AdminSidebar locale={locale} />

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Section Header */}
          <div className="border-b border-zinc-900 pb-5">
            <span className="inline-block bg-zinc-900 border border-zinc-800 text-[#00e8ff] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full font-opensauce mb-2">
              MÓDULO DE GOSU® BACK
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase font-sigher tracking-wider text-white">
              {title}
            </h2>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1 font-inter">
              {subtitle}
            </p>
          </div>

          {/* Coming Soon Card */}
          <div className="rounded-3xl border border-zinc-850 bg-zinc-950/80 p-12 text-center space-y-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#00e8ff]/5 rounded-full blur-3xl pointer-events-none" />

            {/* Glowing Icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-zinc-900 border border-zinc-800 text-[#00e8ff] shadow-[0_0_20px_rgba(0,232,255,0.2)]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l5.653-4.655m3.03-2.496l3.864-3.864a2.25 2.25 0 00-3.182-3.182l-3.864 3.864m2.496 3.030l-3.03 2.496m-2.496-3.030L4.5 4.5" />
              </svg>
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-xl font-extrabold uppercase tracking-wider font-opensauce text-white">
                Módulo &ldquo;{sectionName}&rdquo; en Construcción
              </h3>
              <p className="text-xs text-zinc-400 font-inter leading-relaxed">
                Estamos preparando este módulo con arquitectura tipo Shopify para GOSU® BACK. Pronto podrás gestionar esta sección con control total de datos y métricas.
              </p>
            </div>

            <div className="pt-4 flex justify-center items-center gap-3">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#00e8ff] animate-ping" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#00e8ff] font-opensauce">
                Próximamente en la siguiente iteración
              </span>
            </div>

          </div>

        </div>
      </main>

    </div>
  );
}
