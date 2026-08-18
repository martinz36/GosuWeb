'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AffiliateLoginClient({ locale }: { locale: string }) {
  const router = useRouter();
  const [email, setEmail] = useState('carlos.tcg@gmail.com');
  const [password, setPassword] = useState('123456');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/${locale}/afiliados/dashboard`);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-6 font-sans relative overflow-hidden">
      
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00e8ff]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#ff09bb]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10 font-opensauce">
        
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black tracking-widest text-white font-sigher glow-cyan uppercase">
            GOSU® AFILIADOS
          </h1>
          <p className="text-xs text-zinc-400 font-inter">
            Portal exclusivo para creadores de contenido, streamers y comunidad TCG
          </p>
        </div>

        {/* Login Form Card */}
        <form onSubmit={handleLogin} className="p-8 rounded-3xl border border-zinc-850 bg-zinc-950/90 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="border-b border-zinc-900 pb-4 text-center">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Iniciar Sesión de Afiliado
            </h2>
            <p className="text-[10px] text-zinc-500 font-inter mt-1">
              Ingresa con tus credenciales asignadas por GOSU®
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00e8ff] font-mono"
                placeholder="afiliado@gosu.pe"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00e8ff]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#00e8ff] text-black font-extrabold uppercase text-xs tracking-wider hover:bg-white hover:shadow-[0_0_20px_rgba(0,232,255,0.4)] transition-all shadow-[0_0_12px_rgba(0,232,255,0.25)]"
          >
            Ingresar al Dashboard →
          </button>

          <div className="text-center pt-2 border-t border-zinc-900">
            <Link href={`/${locale}/shop`} className="text-xs text-zinc-500 hover:text-white transition-colors">
              ← Volver a la Tienda GOSU®
            </Link>
          </div>
        </form>

      </div>

    </div>
  );
}
