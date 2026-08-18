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

  freeShippingThreshold: number;
}

interface ShippingZoneItem {
  id: string;
  countryCode: string;
  region: string;
  rate: number;
  currency: string;
  estimatedDays: string;
}

const COUNTRY_FLAGS: Record<string, string> = {
  PE: '🇵🇪 Perú',
  MX: '🇲🇽 México',
  CL: '🇨🇱 Chile',
  CR: '🇨🇷 Costa Rica',
  CO: '🇨🇴 Colombia',
  US: '🇺🇸 Estados Unidos',
  ES: '🇪🇸 España',
  AR: '🇦🇷 Argentina',
};

export default function AdminSettingsClient({ locale }: { locale: string }) {
  const [activeTab, setActiveTab] = useState<'shipping' | 'gateways' | 'general'>('shipping');
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

    freeShippingThreshold: 200.0,
  });

  // Shipping Zones List State
  const [shippingZones, setShippingZones] = useState<ShippingZoneItem[]>([]);
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<ShippingZoneItem | null>(null);

  // Form State for Creating/Editing Shipping Zone
  const [zoneForm, setZoneForm] = useState({
    countryCode: 'PE',
    region: 'Lima',
    rate: '12.00',
    currency: 'PEN',
    estimatedDays: '24 a 48 horas hábiles',
  });

  // Fetch settings & shipping zones
  const loadAllData = async () => {
    setLoading(true);
    try {
      // 1. Fetch StoreSettings
      const resSettings = await fetch('/api/admin/settings');
      const dataSettings = await resSettings.json();
      if (dataSettings.success && dataSettings.settings) {
        setSettings({
          mercadoPagoActive: Boolean(dataSettings.settings.mercadoPagoActive),
          mercadoPagoMode: dataSettings.settings.mercadoPagoMode || 'sandbox',
          mpPublicSandboxKey: dataSettings.settings.mpPublicSandboxKey || '',
          mpAccessSandboxToken: dataSettings.settings.mpAccessSandboxToken || '',
          mpPublicProdKey: dataSettings.settings.mpPublicProdKey || '',
          mpAccessProdToken: dataSettings.settings.mpAccessProdToken || '',

          stripeActive: Boolean(dataSettings.settings.stripeActive),
          stripeMode: dataSettings.settings.stripeMode || 'sandbox',
          stripePublishableKey: dataSettings.settings.stripePublishableKey || '',
          stripeSecretKey: dataSettings.settings.stripeSecretKey || '',

          culqiActive: Boolean(dataSettings.settings.culqiActive),
          culqiPublicKey: dataSettings.settings.culqiPublicKey || '',
          culqiSecretKey: dataSettings.settings.culqiSecretKey || '',

          freeShippingThreshold: Number(dataSettings.settings.freeShippingThreshold || 200.0),
        });
      }

      // 2. Fetch Shipping Zones
      const resZones = await fetch('/api/admin/shipping-zones');
      const dataZones = await resZones.json();
      if (dataZones.success && dataZones.shippingZones) {
        setShippingZones(dataZones.shippingZones);
      }
    } catch (err) {
      console.error('Error fetching settings & zones:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Save Settings (including freeShippingThreshold)
  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (data.success) {
        alert('¡Configuración y umbral de Envío Gratis guardados con éxito en Neon DB!');
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

  // Open modal to create a new Shipping Zone
  const handleOpenCreateZone = () => {
    setEditingZone(null);
    setZoneForm({
      countryCode: 'PE',
      region: 'Lima',
      rate: '12.00',
      currency: 'PEN',
      estimatedDays: '24 a 48 horas hábiles',
    });
    setIsZoneModalOpen(true);
  };

  // Open modal to edit existing Shipping Zone
  const handleOpenEditZone = (zone: ShippingZoneItem) => {
    setEditingZone(zone);
    setZoneForm({
      countryCode: zone.countryCode,
      region: zone.region || '',
      rate: String(zone.rate),
      currency: zone.currency || 'PEN',
      estimatedDays: zone.estimatedDays || '',
    });
    setIsZoneModalOpen(true);
  };

  // Submit Save Shipping Zone (Create or Update)
  const handleSaveZoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingZone ? 'PUT' : 'POST';
      const payload = editingZone
        ? { id: editingZone.id, ...zoneForm, rate: parseFloat(zoneForm.rate) }
        : { ...zoneForm, rate: parseFloat(zoneForm.rate) };

      const res = await fetch('/api/admin/shipping-zones', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert(editingZone ? '¡Zona de envío actualizada!' : '¡Nueva zona de envío creada!');
        setIsZoneModalOpen(false);
        // Reload zones
        const resZones = await fetch('/api/admin/shipping-zones');
        const dataZones = await resZones.json();
        if (dataZones.success) setShippingZones(dataZones.shippingZones);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error('Error saving shipping zone:', err);
      alert('Error al procesar zona de envío.');
    }
  };

  // Delete Shipping Zone
  const handleDeleteZone = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta zona de envío?')) return;

    try {
      const res = await fetch(`/api/admin/shipping-zones?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setShippingZones(shippingZones.filter((z) => z.id !== id));
        alert('Zona de envío eliminada.');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error('Error deleting zone:', err);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white font-sans selection:bg-[#00e8ff] selection:text-black">
      
      {/* Shopify-style Admin Sidebar */}
      <AdminSidebar locale={locale} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8 pb-16">
          
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
            <div>
              <span className="inline-block bg-zinc-900 border border-zinc-800 text-[#00e8ff] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full font-opensauce mb-2">
                CONFIGURACIÓN Y LOGÍSTICA
              </span>
              <h1 className="text-2xl sm:text-3xl font-black uppercase font-sigher tracking-wider text-white">
                Ajustes de Envío & Pasarelas
              </h1>
              <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1 font-inter">
                Gestión de zonas de envío dinámicas, umbral de envío gratis y pasarelas de pago
              </p>
            </div>

            <button
              onClick={() => handleSaveSettings()}
              disabled={saving}
              className="px-6 py-2.5 rounded-full bg-[#00e8ff] text-black font-extrabold uppercase text-xs tracking-wider hover:bg-white hover:shadow-[0_0_20px_rgba(0,232,255,0.4)] transition-all font-opensauce shadow-[0_0_12px_rgba(0,232,255,0.25)] flex items-center gap-2"
            >
              {saving ? (
                <>
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-black border-t-transparent" />
                  <span>Guardando...</span>
                </>
              ) : (
                <span>Guardar Ajustes</span>
              )}
            </button>
          </div>

          {/* Modular Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-zinc-900 pb-2 font-opensauce text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('shipping')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'shipping'
                  ? 'bg-zinc-900 text-[#00e8ff] border border-zinc-800'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>🚚 Tarifas y Zonas de Envío</span>
            </button>

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
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent border-[#00e8ff]" />
            </div>
          ) : (
            <>
              {/* TAB 1: TARIFAS DE ENVÍO Y ZONAS DINÁMICAS */}
              {activeTab === 'shipping' && (
                <div className="space-y-8 font-opensauce">
                  
                  {/* CARD 1: CONFIGURACIÓN GLOBAL DE ENVÍO GRATIS */}
                  <div className="rounded-2xl border border-zinc-850 bg-zinc-950/80 p-6 space-y-4 backdrop-blur-md shadow-xl">
                    <div className="border-b border-zinc-900 pb-3 flex items-center justify-between">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                        <span>🎁 Envío Gratis Global</span>
                        <span className="bg-emerald-950 text-emerald-400 border border-emerald-900 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full">
                          Promoción Activa
                        </span>
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-zinc-300">
                          Envío Gratis a partir de X monto (S/.) *
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-[#00e8ff] font-sigher">S/.</span>
                          <input
                            type="number"
                            step="10"
                            value={settings.freeShippingThreshold}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                freeShippingThreshold: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#00e8ff]"
                          />
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-black border border-zinc-850 text-xs text-zinc-400 leading-relaxed font-inter">
                        💡 <span className="text-white font-bold">Lógica Automática:</span> Cualquier compra cuyo subtotal sea igual o mayor a <span className="text-[#00e8ff] font-bold">S/. {settings.freeShippingThreshold.toFixed(2)}</span> tendrá costo de envío <span className="text-emerald-400 font-bold">S/. 0.00 (Gratis)</span> durante el checkout.
                      </div>
                    </div>
                  </div>

                  {/* CARD 2: TABLA DE ZONAS DE ENVÍO DINÁMICAS */}
                  <div className="rounded-2xl border border-zinc-850 bg-zinc-950/80 p-6 space-y-6 backdrop-blur-md shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                          🗺️ Zonas y Tarifas de Despacho Dinámicas
                        </h3>
                        <p className="text-[10px] text-zinc-500 font-inter mt-0.5">
                          Define costos y tiempos de entrega según el país y la región del cliente
                        </p>
                      </div>

                      <button
                        onClick={handleOpenCreateZone}
                        className="px-4 py-2 rounded-xl bg-[#00e8ff] text-black font-extrabold uppercase text-xs tracking-wider hover:bg-white transition-all shadow-[0_0_10px_rgba(0,232,255,0.3)] shrink-0"
                      >
                        + Crear Nueva Zona
                      </button>
                    </div>

                    {/* Shipping Zones Table */}
                    <div className="overflow-x-auto rounded-xl border border-zinc-850 bg-black">
                      <table className="w-full border-collapse text-left text-xs text-zinc-300">
                        <thead className="bg-zinc-950 text-[10px] uppercase font-bold tracking-wider text-zinc-500 border-b border-zinc-850">
                          <tr>
                            <th className="px-5 py-3.5">País</th>
                            <th className="px-5 py-3.5">Región / Provincia</th>
                            <th className="px-5 py-3.5">Costo Envío</th>
                            <th className="px-5 py-3.5">Tiempo Estimado</th>
                            <th className="px-5 py-3.5 text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900">
                          {shippingZones.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="px-5 py-6 text-center text-zinc-500 font-inter">
                                No hay zonas de envío configuradas. Haz clic en "Crear Nueva Zona".
                              </td>
                            </tr>
                          ) : (
                            shippingZones.map((zone) => (
                              <tr key={zone.id} className="hover:bg-zinc-900/40 transition-colors">
                                
                                {/* Country */}
                                <td className="px-5 py-4 font-bold text-white whitespace-nowrap">
                                  {COUNTRY_FLAGS[zone.countryCode] || zone.countryCode}
                                </td>

                                {/* Region */}
                                <td className="px-5 py-4 font-mono text-zinc-300">
                                  <span className="bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded text-[11px]">
                                    {zone.region || 'Todas las Regiones'}
                                  </span>
                                </td>

                                {/* Rate */}
                                <td className="px-5 py-4 font-mono font-bold text-sm text-[#00e8ff]">
                                  S/. {zone.rate.toFixed(2)} {zone.currency}
                                </td>

                                {/* Estimated Days */}
                                <td className="px-5 py-4 text-zinc-400 font-inter text-[11px]">
                                  🚚 {zone.estimatedDays || '3 a 5 días hábiles'}
                                </td>

                                {/* Actions */}
                                <td className="px-5 py-4 text-center whitespace-nowrap">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={() => handleOpenEditZone(zone)}
                                      className="px-2.5 py-1 rounded bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 text-[10px] font-bold uppercase"
                                    >
                                      Editar
                                    </button>
                                    <button
                                      onClick={() => handleDeleteZone(zone.id)}
                                      className="px-2.5 py-1 rounded bg-red-950/60 text-red-400 hover:bg-red-900 hover:text-white border border-red-900 text-[10px] font-bold"
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                </td>

                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: PASARELAS DE PAGO */}
              {activeTab === 'gateways' && (
                <div className="space-y-8 font-opensauce">
                  {/* Mercado Pago Card */}
                  <div className="rounded-2xl border border-zinc-850 bg-zinc-950/80 p-6 space-y-6 backdrop-blur-md shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-950/60 border border-blue-800/80 flex items-center justify-center text-xl">
                          💙
                        </div>
                        <div>
                          <h3 className="text-base font-extrabold uppercase text-white flex items-center gap-2">
                            Mercado Pago Perú & Internacional
                          </h3>
                          <p className="text-[10px] text-zinc-500 font-inter">
                            Procesa tarjetas de crédito/débito, Yape y PagoEfectivo
                          </p>
                        </div>
                      </div>

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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="p-4 rounded-xl bg-black border border-zinc-850 space-y-3">
                        <h4 className="text-xs font-bold uppercase text-[#00e8ff]">🔑 Sandbox Keys</h4>
                        <input
                          type="text"
                          value={settings.mpPublicSandboxKey}
                          onChange={(e) => setSettings({ ...settings, mpPublicSandboxKey: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white"
                          placeholder="Public Key (Sandbox)"
                        />
                        <input
                          type={showMpSandboxToken ? 'text' : 'password'}
                          value={settings.mpAccessSandboxToken}
                          onChange={(e) => setSettings({ ...settings, mpAccessSandboxToken: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white"
                          placeholder="Access Token (Sandbox)"
                        />
                      </div>

                      <div className="p-4 rounded-xl bg-black border border-zinc-850 space-y-3">
                        <h4 className="text-xs font-bold uppercase text-emerald-400">🔒 Production Keys</h4>
                        <input
                          type="text"
                          value={settings.mpPublicProdKey}
                          onChange={(e) => setSettings({ ...settings, mpPublicProdKey: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white"
                          placeholder="Public Key (Producción)"
                        />
                        <input
                          type={showMpProdToken ? 'text' : 'password'}
                          value={settings.mpAccessProdToken}
                          onChange={(e) => setSettings({ ...settings, mpAccessProdToken: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white"
                          placeholder="Access Token (Producción)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: GENERAL */}
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
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white"
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
            </>
          )}

        </div>
      </main>

      {/* Modal / Form Drawer for Creating or Editing Shipping Zone */}
      {isZoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-opensauce">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-850 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <h3 className="text-base font-black uppercase tracking-wider text-white">
                {editingZone ? 'Editar Zona de Envío' : 'Crear Zona de Envío'}
              </h3>
              <button
                onClick={() => setIsZoneModalOpen(false)}
                className="h-8 w-8 rounded-full bg-zinc-900 text-zinc-400 hover:text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveZoneSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-zinc-400">País *</label>
                  <select
                    value={zoneForm.countryCode}
                    onChange={(e) => setZoneForm({ ...zoneForm, countryCode: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#00e8ff]"
                  >
                    <option value="PE">🇵🇪 Perú</option>
                    <option value="MX">🇲🇽 México</option>
                    <option value="CL">🇨🇱 Chile</option>
                    <option value="CR">🇨🇷 Costa Rica</option>
                    <option value="CO">🇨🇴 Colombia</option>
                    <option value="US">🇺🇸 Estados Unidos</option>
                    <option value="ES">🇪🇸 España</option>
                    <option value="AR">🇦🇷 Argentina</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-zinc-400">Región / Provincia *</label>
                  <input
                    type="text"
                    required
                    value={zoneForm.region}
                    onChange={(e) => setZoneForm({ ...zoneForm, region: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#00e8ff]"
                    placeholder="Ej: Lima / Arequipa / Todas"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-zinc-400">Costo de Envío (S/.) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={zoneForm.rate}
                    onChange={(e) => setZoneForm({ ...zoneForm, rate: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#00e8ff] font-mono"
                    placeholder="12.00"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-zinc-400">Tiempo Estimado *</label>
                  <input
                    type="text"
                    required
                    value={zoneForm.estimatedDays}
                    onChange={(e) => setZoneForm({ ...zoneForm, estimatedDays: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#00e8ff]"
                    placeholder="Ej: 24 a 48 horas hábiles"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-zinc-900">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#00e8ff] text-black font-extrabold uppercase text-xs tracking-wider hover:bg-white transition-colors"
                >
                  {editingZone ? 'Guardar Cambios' : 'Crear Zona'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsZoneModalOpen(false)}
                  className="px-5 py-3 rounded-xl border border-zinc-800 text-zinc-400 text-xs font-bold uppercase hover:text-white"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
