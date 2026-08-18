import React from 'react';
import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-6 text-center font-sans relative overflow-hidden font-opensauce">
      
      {/* Background Glow Accents */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00e8ff]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md space-y-6 relative z-10">
        
        {/* Icon */}
        <div className="h-20 w-20 rounded-full bg-zinc-950 border border-zinc-800 text-[#00e8ff] flex items-center justify-center text-3xl mx-auto shadow-[0_0_20px_rgba(0,232,255,0.25)]">
          🔍
        </div>

        <div className="space-y-2">
          <span className="bg-zinc-900 border border-zinc-800 text-[#00e8ff] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
            ERROR 404
          </span>
          <h1 className="text-3xl font-black uppercase font-sigher tracking-wider text-white glow-cyan">
            PRODUCTO NO ENCONTRADO
          </h1>
          <p className="text-xs text-zinc-400 font-inter">
            El producto que estás buscando no existe, ha sido descontinuado o la URL ingresada es incorrecta.
          </p>
        </div>

        <div>
          <Link
            href="/es/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#00e8ff] text-black font-extrabold uppercase text-xs tracking-wider hover:bg-white transition-all shadow-[0_0_15px_rgba(0,232,255,0.3)]"
          >
            ← Volver al Catálogo GOSU®
          </Link>
        </div>

      </div>

    </div>
  );
}
