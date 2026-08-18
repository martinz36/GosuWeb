'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AdminSidebar from './AdminSidebar';

interface ProductFormClientProps {
  locale: string;
  initialData?: any;
  isEdit?: boolean;
}

interface VariantOption {
  id: string;
  name: string; // e.g. "Color", "Tamaño", "Material"
  values: string[]; // e.g. ["Negro Matte", "Azul Cobalto", "Rojo Rubí"]
}

interface GeneratedVariant {
  id: string;
  title: string; // e.g. "Negro Matte / Standard (66x91mm)"
  price: string;
  sku: string;
  stock: string;
  image?: string;
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
    price: initialData?.price ? String(initialData.price) : '25.00',
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

  // ----------------------------------------------------
  // VARIANTS MANAGEMENT STATE
  // ----------------------------------------------------
  const [hasVariants, setHasVariants] = useState(true);
  const [options, setOptions] = useState<VariantOption[]>([
    {
      id: 'opt-1',
      name: 'Color',
      values: ['Negro Matte', 'Azul Cobalto', 'Rojo Rubí'],
    },
    {
      id: 'opt-2',
      name: 'Tamaño',
      values: ['Standard (66x91mm)', 'Japanese (62x89mm)'],
    },
  ]);

  const [newValInputs, setNewValInputs] = useState<Record<string, string>>({});
  const [variantsList, setVariantsList] = useState<GeneratedVariant[]>([]);

  // Compute Cartesian product of options to generate dynamic variants
  useMemo(() => {
    const activeOptions = options.filter((o) => o.name.trim() !== '' && o.values.length > 0);

    if (!hasVariants || activeOptions.length === 0) {
      setVariantsList([]);
      return;
    }

    // Helper to cartesian product arrays
    const cartesian = (acc: string[][], option: VariantOption): string[][] => {
      const res: string[][] = [];
      acc.forEach((a) => {
        option.values.forEach((v) => {
          res.push([...a, v]);
        });
      });
      return res;
    };

    let combinations: string[][] = activeOptions[0].values.map((v) => [v]);

    for (let i = 1; i < activeOptions.length; i++) {
      combinations = cartesian(combinations, activeOptions[i]);
    }

    // Map combinations into variant objects while preserving edits
    const baseSku = formData.sku || 'GOSU-SLV';
    const basePrice = formData.price || '25.00';

    setVariantsList((prevVariants) => {
      const prevMap = new Map(prevVariants.map((v) => [v.title, v]));

      return combinations.map((combo, idx) => {
        const title = combo.join(' / ');
        const existing = prevMap.get(title);

        if (existing) return existing;

        const skuSuffix = combo.map((c) => c.slice(0, 3).toUpperCase()).join('-');
        return {
          id: `var-${idx}-${Date.now()}`,
          title,
          price: basePrice,
          sku: `${baseSku}-${skuSuffix}`,
          stock: '50',
          image: images[0] || '/assets/images/image-113ac3f9.png',
        };
      });
    });
  }, [options, hasVariants, formData.sku, formData.price, images]);

  // Option Handlers
  const handleAddOption = () => {
    const newId = `opt-${Date.now()}`;
    setOptions([...options, { id: newId, name: '', values: [] }]);
  };

  const handleRemoveOption = (id: string) => {
    setOptions(options.filter((o) => o.id !== id));
  };

  const handleOptionNameChange = (id: string, name: string) => {
    setOptions(options.map((o) => (o.id === id ? { ...o, name } : o)));
  };

  const handleAddValueToOption = (optionId: string) => {
    const val = (newValInputs[optionId] || '').trim();
    if (!val) return;

    setOptions(
      options.map((o) => {
        if (o.id === optionId && !o.values.includes(val)) {
          return { ...o, values: [...o.values, val] };
        }
        return o;
      })
    );

    setNewValInputs({ ...newValInputs, [optionId]: '' });
  };

  const handleRemoveValueFromOption = (optionId: string, valueToRemove: string) => {
    setOptions(
      options.map((o) => {
        if (o.id === optionId) {
          return { ...o, values: o.values.filter((v) => v !== valueToRemove) };
        }
        return o;
      })
    );
  };

  // Variant Table Handlers
  const handleVariantFieldChange = (
    variantId: string,
    field: 'price' | 'sku' | 'stock',
    val: string
  ) => {
    setVariantsList(
      variantsList.map((v) => (v.id === variantId ? { ...v, [field]: val } : v))
    );
  };

  const handleRemoveVariantRow = (variantId: string) => {
    setVariantsList(variantsList.filter((v) => v.id !== variantId));
  };

  // Tag Handlers
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
        ? '¡Producto y variantes actualizados con éxito!'
        : '¡Nuevo producto con variantes registrado exitosamente!'
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
            
            {/* Left 2 Columns: Main Details & Variants */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* CARD 1: INFORMACIÓN GENERAL */}
              <div className="rounded-2xl border border-zinc-850 bg-zinc-950/80 p-6 space-y-6 backdrop-blur-md shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider font-opensauce text-white flex items-center gap-2">
                    <span className="text-[#00e8ff]">📝</span> Información General
                  </h3>
                </div>

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
                      rows={4}
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

              {/* ----------------------------------------------------------------- */}
              {/* CARD 7: VARIANTES DE PRODUCTO (SHOPIFY STYLE DYNAMIC TABLE) */}
              {/* ----------------------------------------------------------------- */}
              <div className="rounded-2xl border border-zinc-850 bg-zinc-950/80 p-6 space-y-6 backdrop-blur-md shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider font-opensauce text-white flex items-center gap-2">
                      <span className="text-[#00e8ff]">🎨</span> Variantes de Producto
                    </h3>
                    <span className="bg-zinc-900 border border-zinc-800 text-[#00e8ff] text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full font-mono">
                      {variantsList.length} combinaciones
                    </span>
                  </div>

                  {/* Enable/Disable Variants Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer font-opensauce text-xs text-zinc-400">
                    <input
                      type="checkbox"
                      checked={hasVariants}
                      onChange={(e) => setHasVariants(e.target.checked)}
                      className="h-4 w-4 rounded border-zinc-800 bg-black text-[#00e8ff] focus:ring-[#00e8ff]"
                    />
                    <span>Este producto tiene opciones (Color, Tamaño, etc.)</span>
                  </label>
                </div>

                {hasVariants && (
                  <div className="space-y-6">
                    
                    {/* Option Managers List */}
                    <div className="space-y-4 font-opensauce">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Opciones de Variante (Color, Tamaño, Material):
                      </label>

                      {options.map((option, optIdx) => (
                        <div
                          key={option.id}
                          className="p-4 rounded-xl bg-black border border-zinc-850 space-y-3 relative group"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="w-1/3">
                              <label className="text-[10px] text-zinc-500 uppercase font-bold">
                                Nombre de Opción #{optIdx + 1}
                              </label>
                              <input
                                type="text"
                                value={option.name}
                                onChange={(e) => handleOptionNameChange(option.id, e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00e8ff]"
                                placeholder="Ej: Color, Tamaño..."
                              />
                            </div>

                            {/* Add Option Value Input */}
                            <div className="flex-1">
                              <label className="text-[10px] text-zinc-500 uppercase font-bold">
                                Añadir Valor para &ldquo;{option.name || `Opción ${optIdx + 1}`}&rdquo;
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={newValInputs[option.id] || ''}
                                  onChange={(e) =>
                                    setNewValInputs({ ...newValInputs, [option.id]: e.target.value })
                                  }
                                  onKeyDown={(e) =>
                                    e.key === 'Enter' &&
                                    (e.preventDefault(), handleAddValueToOption(option.id))
                                  }
                                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00e8ff]"
                                  placeholder="Ej: Negro Matte, Standard (66x91mm)..."
                                />
                                <button
                                  type="button"
                                  onClick={() => handleAddValueToOption(option.id)}
                                  className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-[#00e8ff] hover:bg-[#00e8ff] hover:text-black font-bold text-xs rounded-lg transition-colors"
                                >
                                  + Agregar
                                </button>
                              </div>
                            </div>

                            {/* Remove Option Group */}
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(option.id)}
                              className="text-zinc-600 hover:text-red-400 p-1.5 rounded-lg hover:bg-zinc-900 transition-colors self-end"
                              title="Eliminar esta opción"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 me-.562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </button>
                          </div>

                          {/* Values Pill Chips */}
                          {option.values.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-900">
                              {option.values.map((val, valIdx) => (
                                <span
                                  key={valIdx}
                                  className="inline-flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full"
                                >
                                  <span>{val}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveValueFromOption(option.id, val)}
                                    className="text-zinc-500 hover:text-red-400"
                                  >
                                    ✕
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Add Another Option Button */}
                      <button
                        type="button"
                        onClick={handleAddOption}
                        className="w-full py-2.5 border border-dashed border-zinc-800 hover:border-[#00e8ff] rounded-xl text-zinc-400 hover:text-[#00e8ff] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span>+ Agregar otra opción de variante (ej: Material)</span>
                      </button>
                    </div>

                    {/* DYNAMIC VARIANTS TABLE */}
                    {variantsList.length > 0 && (
                      <div className="space-y-3 pt-4 border-t border-zinc-900 font-opensauce">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                            Tabla de Variantes Generadas ({variantsList.length}):
                          </label>
                          <span className="text-[10px] text-zinc-500 font-inter">
                            Define precio, SKU y stock independiente para cada combinación
                          </span>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-zinc-850 bg-black">
                          <table className="w-full border-collapse text-left text-xs text-zinc-300">
                            <thead className="bg-zinc-950 text-[10px] uppercase font-bold tracking-wider text-zinc-500 border-b border-zinc-850">
                              <tr>
                                <th className="px-4 py-3">Variante</th>
                                <th className="px-4 py-3">Precio (S/.)</th>
                                <th className="px-4 py-3">SKU</th>
                                <th className="px-4 py-3">Stock</th>
                                <th className="px-4 py-3 text-center">Acción</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-900">
                              {variantsList.map((variant) => (
                                <tr key={variant.id} className="hover:bg-zinc-900/40 transition-colors">
                                  {/* Variant Title */}
                                  <td className="px-4 py-3 font-semibold text-white">
                                    <div className="flex items-center gap-2">
                                      <span className="h-2 w-2 rounded-full bg-[#00e8ff]" />
                                      <span>{variant.title}</span>
                                    </div>
                                  </td>

                                  {/* Independent Price */}
                                  <td className="px-4 py-3">
                                    <div className="relative w-24">
                                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-[10px]">S/.</span>
                                      <input
                                        type="number"
                                        step="0.01"
                                        value={variant.price}
                                        onChange={(e) =>
                                          handleVariantFieldChange(variant.id, 'price', e.target.value)
                                        }
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 pl-6 py-1 text-xs text-white font-mono focus:outline-none focus:border-[#00e8ff]"
                                      />
                                    </div>
                                  </td>

                                  {/* Independent SKU */}
                                  <td className="px-4 py-3">
                                    <input
                                      type="text"
                                      value={variant.sku}
                                      onChange={(e) =>
                                        handleVariantFieldChange(variant.id, 'sku', e.target.value)
                                      }
                                      className="w-32 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200 font-mono focus:outline-none focus:border-[#00e8ff]"
                                    />
                                  </td>

                                  {/* Independent Stock */}
                                  <td className="px-4 py-3">
                                    <input
                                      type="number"
                                      value={variant.stock}
                                      onChange={(e) =>
                                        handleVariantFieldChange(variant.id, 'stock', e.target.value)
                                      }
                                      className="w-16 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-white text-center font-bold focus:outline-none focus:border-[#00e8ff]"
                                    />
                                  </td>

                                  {/* Delete Row Action */}
                                  <td className="px-4 py-3 text-center">
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveVariantRow(variant.id)}
                                      className="text-zinc-600 hover:text-red-400 p-1 transition-colors"
                                      title="Eliminar variante"
                                    >
                                      ✕
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>

              {/* CARD 4: PRECIOS GENERALES */}
              <div className="rounded-2xl border border-zinc-850 bg-zinc-950/80 p-6 space-y-6 backdrop-blur-md shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider font-opensauce text-white flex items-center gap-2">
                    <span className="text-[#00e8ff]">💵</span> Precios Base
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5 font-opensauce">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Precio Base (S/.) *
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
                  </div>
                </div>
              </div>

              {/* CARD 5: INVENTARIO BASE */}
              <div className="rounded-2xl border border-zinc-850 bg-zinc-950/80 p-6 space-y-6 backdrop-blur-md shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider font-opensauce text-white flex items-center gap-2">
                    <span className="text-[#00e8ff]">📦</span> Inventario Base
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5 font-opensauce">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      SKU Principal
                    </label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#00e8ff]"
                      placeholder="GOSU-SLV-100-CLR"
                    />
                  </div>

                  <div className="space-y-1.5 font-opensauce">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Código de Barras
                    </label>
                    <input
                      type="text"
                      value={formData.barcode}
                      onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#00e8ff]"
                      placeholder="7751234567890"
                    />
                  </div>

                  <div className="space-y-1.5 font-opensauce">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Stock Total *
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
