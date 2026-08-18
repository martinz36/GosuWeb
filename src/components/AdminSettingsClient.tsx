'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';

interface StoreSettingsData {
  mercadoPagoActive: boolean;
  mercadoPagoMode: 'sandbox' | 'production';
  mpPublicSandboxKey: string;
  mpAccessSandboxToken: string;
  mpPublicProdKey: string;
  mpAccessProdToken: string;

  stripeActive: boolean;
  stripeMode: 'sandbox' | 'production';
  stripePublishableKey: string;
  stripeSecretKey: string;

  culqiActive: boolean;
  culqiPublicKey: string;
  culqiSecretKey: string;
}

export default function AdminSettingsClient({ locale }: { locale: string }) {
  const [activeTab, setActiveTab] = useState<'gateways' | 'general' | 'shipping'>('gateways');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Show/Hide Secrets toggles
  const [showMpSandboxToken, setShowMpSandboxToken] = useState(false);
  const [showMpProdToken, setShowMpProdToken] = useState(false);
  const [showStripeSecret, setShowStripeSecret] = useState(false);

  // Settings State
  const [settings, setSettings] = useState<StoreSettingsData>({
    mercadoPagoActive: true,
    mercadoPagoMode: 'sandbox',
    mpPublicSandboxKey: 'TEST-12345678-ABCD-EFGH',
    mpAccessSandboxToken: 'TEST-87654321-DCBA-HGFE',
    mpPublicProdKey: 'APP_USR-12345678-PROD',
    mpAccessProdToken: 'APP_USR-87654321-PROD',

    stripeActive: false,
    stripeMode: 'sandbox',
    stripePublishableKey: 'pk_test_51MockStripeKey123',
    stripeSecretKey: 'sk_test_51MockStripeSecret456',

    culqiActive: true,
    culqiPublicKey: 'pk_test_mock123',
    culqiSecretKey: 'sk_test_mock123',
  });

  // Fetch current settings from database via API
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (data.success && data.settings) {
          setSettings({
            mercadoPagoActive: Boolean(data.settings.mercadoPagoActive),
            mercadoPagoMode: data.settings.mercadoPagoMode || 'sandbox',
            mpPublicSandboxKey: data.settings.mpPublicSandboxKey || '',
            mpAccessSandboxToken: data.settings.mpAccessSandboxToken || '',
            mpPublicProdKey: data.settings.mpPublicProdKey || '',
            mpAccessProdToken: data.settings.mpAccessProdToken || '',

            stripeActive: Boolean(data.settings.stripeActive),
            stripeMode: data.settings.stripeMode || 'sandbox',
            stripePublishableKey: data.settings.stripePublishableKey || '',
            stripeSecretKey: data.settings.stripeSecretKey || '',

            culqiActive: Boolean(data.settings.culqiActive),
            culqiPublicKey: data.settings.culqiPublicKey || '',
            culqiSecretKey: data.settings.culqiSecretKey || '',
          });
        }
      } catch (err) {
        console.error('Error fetching store settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Save Settings to Database via API
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (data.success) {
        alert('¡Configuración de pasarelas de pago guardada de forma segura en Neon DB!');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Error al guardar configuración.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white font-sans selection:bg-[#00e8ff] selection:text-black">
      
      {/* Shopify-style Admin Sidebar */}
      <AdminSidebar locale={locale} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <form onSubmit={handleSaveSettings} className="max-w-5xl mx-auto space-y-8 pb-16">
          
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
            <div>
              <span className="inline-block bg-zinc-900 border border-zinc-800 text-[#00e8ff] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full font-opensauce mb-2">
                CONFIGURACIÓN GLOBAL
              </span>
              <h1 className="text-2xl sm:text-3xl font-black uppercase font-sigher tracking-wider text-white">
                Ajustes de la Tienda
              </h1>
              <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1 font-inter">
                Gestión segura de credenciales de Mercado Pago, Stripe, Culqi y envíos
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-full bg-[#00e8ff] text-black font-extrabold uppercase text-xs tracking-wider hover:bg-white hover:shadow-[0_0_20px_rgba(0,232,255,0.4)] transition-all font-opensauce shadow-[0_0_12px_rgba(0,232,255,0.25)] flex items-center gap-2"
            >
              {saving ? (
                <>
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-black border-t-transparent" />
                  <span>Guardando...</span>
                </>
              ) : (
                <span>Guardar Cambios</span>
              )}
            </button>
          </div>

          {/* Modular Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-zinc-900 pb-2 font-opensauce text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('gateways')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'gateways'
                  ? 'bg-zinc-900 text-[#00e8ff] border border-zinc-800'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>💳 Pasarelas de Pago</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('general')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'general'
                  ? 'bg-zinc-900 text-[#00e8ff] border border-zinc-800'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>⚙️ Ajustes Generales</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('shipping')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'shipping'
                  ? 'bg-zinc-900 text-[#00e8ff] border border-zinc-800'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>🚚 Tarifas de Envío</span>
            </button>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent border-[#00e8ff]" />
            </div>
          ) : (
            <>
              {/* TAB 1: PASARELAS DE PAGO */}
              {activeTab === 'gateways' && (
                <div className="space-y-8">
                  
                  {/* CARD 1: MERCADO PAGO PERÚ */}
                  <div className="rounded-2xl border border-zinc-850 bg-zinc-950/80 p-6 space-y-6 backdrop-blur-md shadow-xl font-opensauce">
                    
                    {/* Header & Toggle Switch */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-950/60 border border-blue-800/80 flex items-center justify-center text-xl">
                          💙
                        </div>
                        <div>
                          <h3 className="text-base font-extrabold uppercase text-white flex items-center gap-2">
                            Mercado Pago Perú
                          </h3>
                          <p className="text-[10px] text-zinc-500 font-inter">
                            Procesa tarjetas de crédito/débito, Yape y efectivo en Perú
                          </p>
                        </div>
                      </div>

                      {/* Active Toggle Switch */}
                      <label className="flex items-center gap-3 cursor-pointer">
                        <span className="text-xs font-bold text-zinc-300">
                          {settings.mercadoPagoActive ? 'ACTIVO' : 'INACTIVO'}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setSettings({
                              ...settings,
                              mercadoPagoActive: !settings.mercadoPagoActive,
                            })
                          }
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            settings.mercadoPagoActive ? 'bg-[#00e8ff]' : 'bg-zinc-800'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${
                              settings.mercadoPagoActive ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </label>
                    </div>

                    {/* Environment Radio (Sandbox / Production) */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Entorno de Ejecución *
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label
                          onClick={() => setSettings({ ...settings, mercadoPagoMode: 'sandbox' })}
                          className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                            settings.mercadoPagoMode === 'sandbox'
                              ? 'bg-zinc-900 border-[#00e8ff] text-white'
                              : 'bg-black border-zinc-850 text-zinc-400'
                          }`}
                        >
                          <input type="radio" checked={settings.mercadoPagoMode === 'sandbox'} readOnly />
                          <div>
                            <p className="text-xs font-bold">Modo Sandbox (Pruebas)</p>
                            <p className="text-[10px] text-zinc-500">Prueba pagos con tarjetas de test de Mercado Pago</p>
                          </div>
                        </label>

                        <label
                          onClick={() => setSettings({ ...settings, mercadoPagoMode: 'production' })}
                          className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                            settings.mercadoPagoMode === 'production'
                              ? 'bg-emerald-950/40 border-emerald-500 text-white'
                              : 'bg-black border-zinc-850 text-zinc-400'
                          }`}
                        >
                          <input type="radio" checked={settings.mercadoPagoMode === 'production'} readOnly />
                          <div>
                            <p className="text-xs font-bold text-emerald-400">Modo Producción (En Vivo 🚀)</p>
                            <p className="text-[10px] text-zinc-500">Cobra dinero real directamente a tu cuenta bancaria</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Keys Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                      
                      {/* Sandbox Keys */}
                      <div className="p-4 rounded-xl bg-black border border-zinc-850 space-y-4">
                        <h4 className="text-xs font-bold uppercase text-[#00e8ff]">
                          🔑 Credenciales de Pruebas (Sandbox)
                        </h4>

                        <div className="space-y-1">
                          <label className="text-[10px] text-zinc-500 uppercase font-bold">Public Key (Sandbox)</label>
                          <input
                            type="text"
                            value={settings.mpPublicSandboxKey}
                            onChange={(e) =>
                              setSettings({ ...settings, mpPublicSandboxKey: e.target.value })
                            }
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00e8ff]"
                            placeholder="TEST-12345678-..."
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] text-zinc-500 uppercase font-bold">Access Token (Sandbox)</label>
                            <button
                              type="button"
                              onClick={() => setShowMpSandboxToken(!showMpSandboxToken)}
                              className="text-[9px] text-[#00e8ff] font-bold"
                            >
                              {showMpSandboxToken ? 'Ocultar' : 'Mostrar'}
                            </button>
                          </div>
                          <input
                            type={showMpSandboxToken ? 'text' : 'password'}
                            value={settings.mpAccessSandboxToken}
                            onChange={(e) =>
                              setSettings({ ...settings, mpAccessSandboxToken: e.target.value })
                            }
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00e8ff]"
                            placeholder="TEST-87654321-..."
                          />
                        </div>
                      </div>

                      {/* Production Keys */}
                      <div className="p-4 rounded-xl bg-black border border-zinc-850 space-y-4">
                        <h4 className="text-xs font-bold uppercase text-emerald-400">
                          🔒 Credenciales de Producción (En Vivo)
                        </h4>

                        <div className="space-y-1">
                          <label className="text-[10px] text-zinc-500 uppercase font-bold">Public Key (Producción)</label>
                          <input
                            type="text"
                            value={settings.mpPublicProdKey}
                            onChange={(e) =>
                              setSettings({ ...settings, mpPublicProdKey: e.target.value })
                            }
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00e8ff]"
                            placeholder="APP_USR-12345678-..."
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] text-zinc-500 uppercase font-bold">Access Token (Producción)</label>
                            <button
                              type="button"
                              onClick={() => setShowMpProdToken(!showMpProdToken)}
                              className="text-[9px] text-emerald-400 font-bold"
                            >
                              {showMpProdToken ? 'Ocultar' : 'Mostrar'}
                            </button>
                          </div>
                          <input
                            type={showMpProdToken ? 'text' : 'password'}
                            value={settings.mpAccessProdToken}
                            onChange={(e) =>
                              setSettings({ ...settings, mpAccessProdToken: e.target.value })
                            }
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00e8ff]"
                            placeholder="APP_USR-87654321-..."
                          />
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* CARD 2: STRIPE (FUTURO) */}
                  <div className="rounded-2xl border border-zinc-850 bg-zinc-950/80 p-6 space-y-6 backdrop-blur-md shadow-xl font-opensauce">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-purple-950/60 border border-purple-800/80 flex items-center justify-center text-xl">
                          🟣
                        </div>
                        <div>
                          <h3 className="text-base font-extrabold uppercase text-white flex items-center gap-2">
                            Stripe (Pagos Internacionales)
                          </h3>
                          <p className="text-[10px] text-zinc-500 font-inter">
                            Procesa pagos en USD, Euros y tarjetas internacionales
                          </p>
                        </div>
                      </div>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <span className="text-xs font-bold text-zinc-300">
                          {settings.stripeActive ? 'ACTIVO' : 'INACTIVO'}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setSettings({
                              ...settings,
                              stripeActive: !settings.stripeActive,
                            })
                          }
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            settings.stripeActive ? 'bg-[#00e8ff]' : 'bg-zinc-800'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${
                              settings.stripeActive ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-bold">Publishable Key</label>
                        <input
                          type="text"
                          value={settings.stripePublishableKey}
                          onChange={(e) =>
                            setSettings({ ...settings, stripePublishableKey: e.target.value })
                          }
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#00e8ff]"
                          placeholder="pk_test_..."
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] text-zinc-500 uppercase font-bold">Secret Key</label>
                          <button
                            type="button"
                            onClick={() => setShowStripeSecret(!showStripeSecret)}
                            className="text-[9px] text-[#00e8ff] font-bold"
                          >
                            {showStripeSecret ? 'Ocultar' : 'Mostrar'}
                          </button>
                        </div>
                        <input
                          type={showStripeSecret ? 'text' : 'password'}
                          value={settings.stripeSecretKey}
                          onChange={(e) =>
                            setSettings({ ...settings, stripeSecretKey: e.target.value })
                          }
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#00e8ff]"
                          placeholder="sk_test_..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* CARD 3: CULQI */}
                  <div className="rounded-2xl border border-zinc-850 bg-zinc-950/80 p-6 space-y-6 backdrop-blur-md shadow-xl font-opensauce">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-cyan-950/60 border border-cyan-800/80 flex items-center justify-center text-xl">
                          ⚡
                        </div>
                        <div>
                          <h3 className="text-base font-extrabold uppercase text-white">
                            Culqi (Pasarela Configurada)
                          </h3>
                          <p className="text-[10px] text-zinc-500 font-inter">
                            Integración nativa activa para pagos con tarjeta y Yape
                          </p>
                        </div>
                      </div>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <span className="text-xs font-bold text-zinc-300">
                          {settings.culqiActive ? 'ACTIVO' : 'INACTIVO'}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setSettings({ ...settings, culqiActive: !settings.culqiActive })
                          }
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            settings.culqiActive ? 'bg-[#00e8ff]' : 'bg-zinc-800'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${
                              settings.culqiActive ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-bold">Public Key</label>
                        <input
                          type="text"
                          value={settings.culqiPublicKey}
                          onChange={(e) => setSettings({ ...settings, culqiPublicKey: e.target.value })}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#00e8ff]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-bold">Secret Key</label>
                        <input
                          type="password"
                          value={settings.culqiSecretKey}
                          onChange={(e) => setSettings({ ...settings, culqiSecretKey: e.target.value })}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#00e8ff]"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: AJUSTES GENERALES */}
              {activeTab === 'general' && (
                <div className="rounded-2xl border border-zinc-850 bg-zinc-950/80 p-6 space-y-6 backdrop-blur-md font-opensauce">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-900 pb-3">
                    ⚙️ Información General de la Tienda
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-zinc-400">Nombre de la Tienda</label>
                      <input
                        type="text"
                        defaultValue="GOSU® E-Commerce Perú"
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00e8ff]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-zinc-400">Moneda por Defecto</label>
                      <input
                        type="text"
                        disabled
                        value="S/. PEN (Soles Peruanos)"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-400 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: TARIFAS DE ENVÍO */}
              {activeTab === 'shipping' && (
                <div className="rounded-2xl border border-zinc-850 bg-zinc-950/80 p-6 space-y-6 backdrop-blur-md font-opensauce">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-900 pb-3">
                    🚚 Cobertura y Tarifas de Despacho
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-zinc-400">Envío Lima Metropolitana (S/.)</label>
                      <input
                        type="number"
                        defaultValue="12.00"
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00e8ff]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-zinc-400">Envío Provincias Olva / Shalom (S/.)</label>
                      <input
                        type="number"
                        defaultValue="20.00"
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00e8ff]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </form>
      </main>

    </div>
  );
}
