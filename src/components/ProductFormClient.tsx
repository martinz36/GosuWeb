'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AdminSidebar from './AdminSidebar';

interface ProductFormClientProps {
  locale: string;
  initialData?: any;
  isEdit?: boolean;
}

export default function ProductFormClient({
  locale,
  initialData,
  isEdit = false,
}: ProductFormClientProps) {
  const router = useRouter();

  // Tab for Description (ES / EN)
  const [descLang, setDescLang] = useState<'es' | 'en'>('es');

  // Form State
  const [formData, setFormData] = useState({
    titleEs: initialData?.nameEs || '',
    titleEn: initialData?.nameEn || '',
    descriptionEs: initialData?.descriptionEs || '',
    descriptionEn: initialData?.descriptionEn || '',
    category: initialData?.category || 'tcg-sleeves',
    productType: initialData?.productType || 'Fundas de Protección',
    tags: initialData?.tags || ['100 micras', 'Acid & PVC Free', 'Premium TCG'],
    price: initialData?.price ? String(initialData.price) : '',
    comparePrice: initialData?.comparePrice ? String(initialData.comparePrice) : '',
    sku: initialData?.sku || 'GOSU-SLV-100-CLR',
    barcode: initialData?.barcode || '7751234567890',
    stock: initialData?.stock ? String(initialData.stock) : '100',
    trackStock: true,
    continueSellingOutOfStock: false,
    seoTitle: initialData?.seoTitle || '',
    seoDescription: initialData?.seoDescription || '',
    seoKeywords: initialData?.seoKeywords || '',
  });

  // Media state
  const [images, setImages] = useState<string[]>(
    initialData?.images && initialData.images.length > 0
      ? initialData.images
      : [
          '/assets/images/image-113ac3f9.png',
          '/assets/images/image-52e660c6.jpg',
          '/assets/images/image-4f57375b.jpg',
        ]
  );
  const [featuredImgIndex, setFeaturedImgIndex] = useState(0);

  // New tag input state
  const [newTagInput, setNewTagInput] = useState('');

  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    if (!formData.tags.includes(newTagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTagInput.trim()] });
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t: string) => t !== tagToRemove),
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    setImages(updated);
    if (featuredImgIndex >= updated.length) {
      setFeaturedImgIndex(Math.max(0, updated.length - 1));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      isEdit
        ? '¡Producto actualizado con éxito!'
        : '¡Nuevo producto registrado exitosamente!'
    );
    router.push(`/${locale}/admin/products`);
  };

  return (
    <div className="flex min-h-screen bg-black text-white font-sans selection:bg-[#00e8ff] selection:text-black">
      
      {/* Shopify-style Admin Sidebar */}
      <AdminSidebar locale={locale} />

      {/* Main Form Area */}
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8 pb-16">
          
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
            <div className="flex items-center gap-3">
              <Link
                href={`/${locale}/admin/products`}
                className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                title="Volver a productos"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </Link>
              <div>
                <span className="inline-block bg-zinc-900 border border-zinc-800 text-[#00e8ff] text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full font-opensauce mb-1">
                  {isEdit ? 'EDITAR PRODUCTO' : 'NUEVO PRODUCTO'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black uppercase font-sigher tracking-wider text-white">
                  {isEdit ? 'Editar Producto' : 'Cargar Producto'}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/${locale}/admin/products`}
                className="px-5 py-2.5 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 font-bold uppercase text-xs tracking-wider transition-all font-opensauce"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#00e8ff] text-black font-extrabold uppercase text-xs tracking-wider hover:bg-white hover:shadow-[0_0_20px_rgba(0,232,255,0.4)] transition-all font-opensauce shadow-[0_0_12px_rgba(0,232,255,0.25)]"
              >
                {isEdit ? 'Guardar Cambios' : 'Guardar Producto'}
              </button>
            </div>
          </div>

          {/* Form Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Columns: Main Details */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* CARD 1: INFORMACIÓN GENERAL */}
              <div className="rounded-2xl border border-zinc-850 bg-zinc-950/80 p-6 space-y-6 backdrop-blur-md shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider font-opensauce text-white flex items-center gap-2">
                    <span className="text-[#00e8ff]">📝</span> Información General
                  </h3>
                </div>

                {/* Title ES */}
                <div className="space-y-1.5 font-opensauce">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Título (Español) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titleEs}
                    onChange={(e) => setFormData({ ...formData, titleEs: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00e8ff] font-inter"
                    placeholder="Ej: Fundas TCG Standard Matte - Azul Cobalto"
                  />
                </div>

                {/* Title EN */}
                <div className="space-y-1.5 font-opensauce">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Título (Inglés) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00e8ff] font-inter"
                    placeholder="Ej: TCG Standard Matte Sleeves - Cobalt Blue"
                  />
                </div>

                {/* Rich Text Editor for Description */}
                <div className="space-y-2 font-opensauce">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Descripción del Producto
                    </label>
                    
                    {/* Language Switcher Tabs */}
                    <div className="flex items-center border border-zinc-800 rounded-lg p-0.5 bg-black text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setDescLang('es')}
                        className={`px-3 py-1 rounded-md transition-all ${
                          descLang === 'es'
                            ? 'bg-[#00e8ff] text-black font-extrabold'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Español
                      </button>
                      <button
                        type="button"
                        onClick={() => setDescLang('en')}
                        className={`px-3 py-1 rounded-md transition-all ${
                          descLang === 'en'
                            ? 'bg-[#00e8ff] text-black font-extrabold'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Inglés
                      </button>
                    </div>
                  </div>

                  {/* Rich Text Toolbar Mockup */}
                  <div className="rounded-xl border border-zinc-800 bg-black overflow-hidden">
                    <div className="flex items-center gap-1 bg-zinc-900/90 border-b border-zinc-850 px-3 py-2 text-zinc-400 text-xs font-mono">
                      <button type="button" className="p-1 hover:text-white hover:bg-zinc-800 rounded font-bold">B</button>
                      <button type="button" className="p-1 hover:text-white hover:bg-zinc-800 rounded italic">I</button>
                      <button type="button" className="p-1 hover:text-white hover:bg-zinc-800 rounded underline">U</button>
                      <span className="h-4 w-px bg-zinc-800 mx-1" />
                      <button type="button" className="p-1 hover:text-white hover:bg-zinc-800 rounded">• List</button>
                      <button type="button" className="p-1 hover:text-white hover:bg-zinc-800 rounded">1. List</button>
                      <span className="h-4 w-px bg-zinc-800 mx-1" />
                      <button type="button" className="p-1 hover:text-white hover:bg-zinc-800 rounded">🔗 Link</button>
                      <button type="button" className="p-1 hover:text-white hover:bg-zinc-800 rounded">‹/› Code</button>
                    </div>

                    <textarea
                      rows={5}
                      value={descLang === 'es' ? formData.descriptionEs : formData.descriptionEn}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [descLang === 'es' ? 'descriptionEs' : 'descriptionEn']: e.target.value,
                        })
                      }
                      className="w-full bg-black p-4 text-sm text-zinc-200 focus:outline-none font-inter leading-relaxed border-none"
                      placeholder={
                        descLang === 'es'
                          ? 'Escribe la descripción detallada del producto en español...'
                          : 'Write the detailed product description in English...'
                      }
                    />
                  </div>
                </div>
              </div>

              {/* CARD 2: MULTIMEDIA */}
              <div className="rounded-2xl border border-zinc-850 bg-zinc-950/80 p-6 space-y-6 backdrop-blur-md shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider font-opensauce text-white flex items-center gap-2">
                    <span className="text-[#00e8ff]">🖼️</span> Multimedia (Imágenes)
                  </h3>
                  <span className="text-[10px] text-zinc-500 font-inter">Formatos: PNG, JPG, WEBP</span>
                </div>

                {/* Drag & Drop Upload Zone */}
                <div className="border-2 border-dashed border-zinc-800 hover:border-[#00e8ff] rounded-2xl p-8 text-center bg-black/60 transition-all cursor-pointer group space-y-3">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-[#00e8ff] group-hover:scale-110 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-7 h-7">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                    </svg>
                  </div>

                  <div className="space-y-1 font-opensauce">
                    <p className="text-xs font-bold text-white group-hover:text-[#00e8ff] transition-colors">
                      Arrastra y suelta tus imágenes aquí, o <span className="underline">examina archivos</span>
                    </p>
                    <p className="text-[10px] text-zinc-500 font-inter">
                      Admite imágenes en alta resolución hasta 10 MB por archivo
                    </p>
                  </div>
                </div>

                {/* Uploaded Images Grid */}
                {images.length > 0 && (
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-opensauce">
                      Galería del Producto (Selecciona la imagen principal):
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {images.map((img, idx) => {
                        const isFeatured = featuredImgIndex === idx;
                        return (
                          <div
                            key={idx}
                            className={`relative aspect-square rounded-xl bg-black border p-2 overflow-hidden group transition-all ${
                              isFeatured
                                ? 'border-[#00e8ff] shadow-[0_0_15px_rgba(0,232,255,0.3)] ring-2 ring-[#00e8ff]/50'
                                : 'border-zinc-850 hover:border-zinc-700'
                            }`}
                          >
                            <Image src={img} alt={`Media ${idx}`} fill className="object-contain p-2" />

                            {/* Featured Badge */}
                            {isFeatured ? (
                              <span className="absolute top-2 left-2 bg-[#00e8ff] text-black text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded font-opensauce">
                                ★ Principal
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setFeaturedImgIndex(idx)}
                                className="absolute top-2 left-2 bg-black/80 text-zinc-300 hover:text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-opensauce border border-zinc-800"
                              >
                                Hacer Principal
                              </button>
                            )}

                            {/* Remove Action */}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute top-2 right-2 bg-red-950/80 text-red-400 hover:text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Eliminar imagen"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* CARD 3: PRECIOS */}
              <div className="rounded-2xl border border-zinc-850 bg-zinc-950/80 p-6 space-y-6 backdrop-blur-md shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider font-opensauce text-white flex items-center gap-2">
                    <span className="text-[#00e8ff]">💵</span> Precios & Ofertas
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Selling Price */}
                  <div className="space-y-1.5 font-opensauce">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Precio de Venta (S/.) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm">S/.</span>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full bg-black border border-zinc-800 rounded-xl pl-12 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00e8ff] font-mono font-bold"
                        placeholder="25.00"
                      />
                    </div>
                  </div>

                  {/* Compare Price */}
                  <div className="space-y-1.5 font-opensauce">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Precio de Comparación (S/.)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm">S/.</span>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.comparePrice}
                        onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                        className="w-full bg-black border border-zinc-800 rounded-xl pl-12 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00e8ff] font-mono"
                        placeholder="30.00"
                      />
                    </div>
                    <p className="text-[10px] text-zinc-500 font-inter">
                      Para mostrar el precio tachado y destacar un descuento en la tienda.
                    </p>
                  </div>
                </div>

                {/* Discount Badge Preview */}
                {Number(formData.comparePrice) > Number(formData.price) && Number(formData.price) > 0 && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/60 flex items-center justify-between text-xs text-emerald-400 font-opensauce">
                    <span className="font-bold">✨ Oferta activa detectada:</span>
                    <span className="font-extrabold bg-emerald-900/80 px-2.5 py-0.5 rounded text-[10px] uppercase">
                      Descuento del {Math.round(((Number(formData.comparePrice) - Number(formData.price)) / Number(formData.comparePrice)) * 100)}%
                    </span>
                  </div>
                )}
              </div>

              {/* CARD 4: INVENTARIO */}
              <div className="rounded-2xl border border-zinc-850 bg-zinc-950/80 p-6 space-y-6 backdrop-blur-md shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider font-opensauce text-white flex items-center gap-2">
                    <span className="text-[#00e8ff]">📦</span> Inventario & Seguimiento
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* SKU */}
                  <div className="space-y-1.5 font-opensauce">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      SKU (Código Interno)
                    </label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#00e8ff]"
                      placeholder="GOSU-SLV-100-CLR"
                    />
                  </div>

                  {/* Barcode */}
                  <div className="space-y-1.5 font-opensauce">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Código de Barras (UPC/GTIN)
                    </label>
                    <input
                      type="text"
                      value={formData.barcode}
                      onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#00e8ff]"
                      placeholder="7751234567890"
                    />
                  </div>

                  {/* Stock Units */}
                  <div className="space-y-1.5 font-opensauce">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Cantidad Disponible *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00e8ff] font-bold"
                      placeholder="100"
                    />
                  </div>
                </div>

                {/* Stock Behavior Checkboxes */}
                <div className="space-y-3 border-t border-zinc-900 pt-4 font-opensauce text-xs">
                  <label className="flex items-center gap-3 text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.trackStock}
                      onChange={(e) => setFormData({ ...formData, trackStock: e.target.checked })}
                      className="h-4 w-4 rounded border-zinc-800 bg-black text-[#00e8ff] focus:ring-[#00e8ff]"
                    />
                    <span>Rastrear cantidad de stock automáticamente</span>
                  </label>

                  <label className="flex items-center gap-3 text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.continueSellingOutOfStock}
                      onChange={(e) => setFormData({ ...formData, continueSellingOutOfStock: e.target.checked })}
                      className="h-4 w-4 rounded border-zinc-800 bg-black text-[#00e8ff] focus:ring-[#00e8ff]"
                    />
                    <span>Continuar vendiendo cuando este producto no tenga stock (Pre-orden)</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Right Column: Taxonomy & SEO */}
            <div className="space-y-8">
              
              {/* CARD 5: ORGANIZACIÓN */}
              <div className="rounded-2xl border border-zinc-850 bg-zinc-950/80 p-6 space-y-6 backdrop-blur-md shadow-xl">
                <div className="border-b border-zinc-900 pb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider font-opensauce text-white flex items-center gap-2">
                    <span className="text-[#00e8ff]">🗂️</span> Organización
                  </h3>
                </div>

                {/* Category Select */}
                <div className="space-y-1.5 font-opensauce">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Categoría del Producto *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00e8ff]"
                  >
                    <option value="board-sleeves">Board Game Sleeves</option>
                    <option value="tcg-sleeves">TCG Matte Sleeves</option>
                    <option value="inner-over">Inner / Over Sleeves</option>
                    <option value="binders">Premium Binders</option>
                    <option value="deckboxes">Deck Boxes</option>
                  </select>
                </div>

                {/* Product Type */}
                <div className="space-y-1.5 font-opensauce">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Tipo de Producto
                  </label>
                  <input
                    type="text"
                    value={formData.productType}
                    onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00e8ff]"
                    placeholder="Ej: Fundas de Protección"
                  />
                </div>

                {/* Tags Adder */}
                <div className="space-y-3 font-opensauce">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Etiquetas (Tags)
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="flex-1 bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00e8ff]"
                      placeholder="Añadir etiqueta..."
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-3 py-2 bg-zinc-900 border border-zinc-800 text-white rounded-xl text-xs font-bold hover:bg-[#00e8ff] hover:text-black transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Active Tags List */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {formData.tags.map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-bold px-2.5 py-1 rounded-full"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-zinc-500 hover:text-red-400"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* CARD 6: SEO */}
              <div className="rounded-2xl border border-zinc-850 bg-zinc-950/80 p-6 space-y-6 backdrop-blur-md shadow-xl">
                <div className="border-b border-zinc-900 pb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider font-opensauce text-white flex items-center gap-2">
                    <span className="text-[#00e8ff]">🔍</span> Optimización SEO
                  </h3>
                </div>

                {/* Google Snippet Live Preview */}
                <div className="p-4 rounded-xl bg-black border border-zinc-850 space-y-1">
                  <p className="text-[10px] text-emerald-400 font-mono line-clamp-1">
                    https://gosu.pe › shop › {formData.titleEs.toLowerCase().replace(/\s+/g, '-')}
                  </p>
                  <h4 className="text-sm font-bold text-[#8ab4f8] hover:underline line-clamp-1 font-opensauce">
                    {formData.seoTitle || formData.titleEs || 'Título SEO del Producto | GOSU®'}
                  </h4>
                  <p className="text-xs text-zinc-400 line-clamp-2 font-inter">
                    {formData.seoDescription || formData.descriptionEs || 'Descripción meta para buscadores de Google...'}
                  </p>
                </div>

                {/* SEO Title */}
                <div className="space-y-1.5 font-opensauce">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Título para Buscadores
                  </label>
                  <input
                    type="text"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00e8ff]"
                    placeholder="Fundas TCG Matte GOSU® | 100 Micras"
                  />
                </div>

                {/* SEO Description */}
                <div className="space-y-1.5 font-opensauce">
                  <div className="flex justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Meta Descripción
                    </label>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {formData.seoDescription.length} / 160
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={160}
                    value={formData.seoDescription}
                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#00e8ff] font-inter"
                    placeholder="Compren fundas premium para TCG de 100 micras con despacho directo en Perú..."
                  />
                </div>
              </div>

            </div>

          </div>

        </form>
      </main>

    </div>
  );
}
