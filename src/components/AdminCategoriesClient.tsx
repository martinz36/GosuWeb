'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AdminSidebar from './AdminSidebar';

interface CategoryItem {
  id: string;
  nameEs: string;
  nameEn: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  status: 'active' | 'inactive';
  selectedProductIds: number[];
}

interface ProductOption {
  id: number;
  nameEs: string;
  price: number;
  image: string;
  category: string;
}

const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-1',
    nameEs: 'Board Game Sleeves',
    nameEn: 'Board Game Sleeves',
    slug: 'board-sleeves',
    description: 'Fundas protectoras transparentes de 100 micras diseñadas especialmente para juegos de mesa estándar.',
    image: '/assets/images/image-4f57375b.jpg',
    productCount: 8,
    status: 'active',
    selectedProductIds: [1, 2, 3],
  },
  {
    id: 'cat-2',
    nameEs: 'TCG Matte Sleeves',
    nameEn: 'TCG Matte Sleeves',
    slug: 'tcg-sleeves',
    description: 'Fundas mate texturizadas de alta durabilidad para cartas TCG (Magic: The Gathering, Pokémon, Lorcana).',
    image: '/assets/images/image-52e660c6.jpg',
    productCount: 14,
    status: 'active',
    selectedProductIds: [4, 5, 6],
  },
  {
    id: 'cat-3',
    nameEs: 'Inner / Over Sleeves',
    nameEn: 'Inner & Over Sleeves',
    slug: 'inner-over',
    description: 'Fundas de encaje perfecto (Perfect Fit) y protectores externos rígidos para doble enfundado.',
    image: '/assets/images/image-113ac3f9.png',
    productCount: 6,
    status: 'active',
    selectedProductIds: [7, 8],
  },
  {
    id: 'cat-4',
    nameEs: 'Carpetas Premium (Binders)',
    nameEn: 'Premium Binders',
    slug: 'binders',
    description: 'Carpetas de cuero sintético con cierre e interiores acolchados para coleccionistas exigentes.',
    image: '/assets/images/image-3a743382.jpg',
    productCount: 5,
    status: 'active',
    selectedProductIds: [9],
  },
  {
    id: 'cat-5',
    nameEs: 'Cajas de Mazo (Deck Boxes)',
    nameEn: 'Deck Boxes',
    slug: 'deckboxes',
    description: 'Cajas magnéticas de máxima protección para guardar tu mazo principal y side deck.',
    image: '/assets/images/image-113ac3f9.png',
    productCount: 4,
    status: 'inactive',
    selectedProductIds: [10],
  },
];

const AVAILABLE_PRODUCTS: ProductOption[] = [
  { id: 1, nameEs: 'Fundas Board Game Clear - 57.5 x 89mm (100 u.)', price: 18.0, image: '/assets/images/image-4f57375b.jpg', category: 'board-sleeves' },
  { id: 2, nameEs: 'Fundas Board Game Standard - 63.5 x 88mm (100 u.)', price: 20.0, image: '/assets/images/image-4f57375b.jpg', category: 'board-sleeves' },
  { id: 3, nameEs: 'Fundas TCG Matte - Azul Cobalto (100 u.)', price: 35.0, image: '/assets/images/image-52e660c6.jpg', category: 'tcg-sleeves' },
  { id: 4, nameEs: 'Fundas TCG Matte - Negro Azabache (100 u.)', price: 35.0, image: '/assets/images/image-52e660c6.jpg', category: 'tcg-sleeves' },
  { id: 5, nameEs: 'Fundas TCG Matte - Rojo Rubí (100 u.)', price: 35.0, image: '/assets/images/image-52e660c6.jpg', category: 'tcg-sleeves' },
  { id: 6, nameEs: 'Carpetas Premium 9-Pocket Zip Binder - Negro', price: 85.0, image: '/assets/images/image-3a743382.jpg', category: 'binders' },
  { id: 7, nameEs: 'Deck Box Magnético Armor Vault - Cyan', price: 65.0, image: '/assets/images/image-113ac3f9.png', category: 'deckboxes' },
];

export default function AdminCategoriesClient({ locale }: { locale: string }) {
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Form states
  const [formNameEs, setFormNameEs] = useState('');
  const [formNameEn, setFormNameEn] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('/assets/images/image-4f57375b.jpg');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([1, 3]);

  // Open creation form
  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormNameEs('');
    setFormNameEn('');
    setFormSlug('');
    setFormDescription('');
    setFormImage('/assets/images/image-4f57375b.jpg');
    setFormStatus('active');
    setSelectedProductIds([1, 3]);
    setIsFormOpen(true);
  };

  // Open edit form
  const handleOpenEdit = (category: CategoryItem) => {
    setEditingCategory(category);
    setFormNameEs(category.nameEs);
    setFormNameEn(category.nameEn);
    setFormSlug(category.slug);
    setFormDescription(category.description);
    setFormImage(category.image);
    setFormStatus(category.status);
    setSelectedProductIds(category.selectedProductIds);
    setIsFormOpen(true);
  };

  // Toggle product selection in manual picker
  const handleToggleProduct = (productId: number) => {
    if (selectedProductIds.includes(productId)) {
      setSelectedProductIds(selectedProductIds.filter((id) => id !== productId));
    } else {
      setSelectedProductIds([...selectedProductIds, productId]);
    }
  };

  // Handle Save
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formNameEs.trim()) {
      alert('Por favor ingresa el nombre de la colección.');
      return;
    }

    const newSlug = formSlug.trim() || formNameEs.toLowerCase().replace(/\s+/g, '-');

    if (editingCategory) {
      // Update existing
      setCategories(
        categories.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                nameEs: formNameEs,
                nameEn: formNameEn || formNameEs,
                slug: newSlug,
                description: formDescription,
                image: formImage,
                status: formStatus,
                productCount: selectedProductIds.length,
                selectedProductIds,
              }
            : c
        )
      );
      alert('¡Colección actualizada con éxito!');
    } else {
      // Create new
      const newCat: CategoryItem = {
        id: `cat-${Date.now()}`,
        nameEs: formNameEs,
        nameEn: formNameEn || formNameEs,
        slug: newSlug,
        description: formDescription,
        image: formImage,
        productCount: selectedProductIds.length,
        status: formStatus,
        selectedProductIds,
      };
      setCategories([newCat, ...categories]);
      alert('¡Nueva colección creada con éxito!');
    }

    setIsFormOpen(false);
  };

  // Handle Delete
  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta colección?')) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white font-sans selection:bg-[#00e8ff] selection:text-black">
      
      {/* Shopify-style Admin Sidebar */}
      <AdminSidebar locale={locale} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* VIEW 1: TABLA PRINCIPAL DE COLECCIONES */}
          {!isFormOpen ? (
            <div className="space-y-6">
              
              {/* Header Action Row */}
              <div className="flex items-center justify-between border-b border-zinc-900 pb-5">
                <div>
                  <span className="inline-block bg-zinc-900 border border-zinc-800 text-[#00e8ff] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full font-opensauce mb-2">
                    MÓDULO DE COLECCIONES
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black uppercase font-sigher tracking-wider text-white">
                    Colecciones / Categorías
                  </h1>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1 font-inter">
                    Organiza y agrupa tus productos por categorías principales en la tienda pública
                  </p>
                </div>

                <button
                  onClick={handleOpenCreate}
                  className="flex items-center gap-2 rounded-full bg-[#00e8ff] text-black font-extrabold uppercase text-xs px-5 py-2.5 hover:bg-white hover:shadow-[0_0_15px_rgba(0,232,255,0.4)] transition-all font-opensauce shadow-[0_0_12px_rgba(0,232,255,0.25)]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  <span>Crear Colección</span>
                </button>
              </div>

              {/* Collections Table */}
              <div className="overflow-x-auto rounded-2xl border border-zinc-900 bg-zinc-950/40 font-opensauce">
                <table className="w-full border-collapse text-left text-sm text-zinc-400">
                  <thead className="bg-zinc-950 text-[10px] uppercase font-bold tracking-wider text-zinc-500 border-b border-zinc-900">
                    <tr>
                      <th className="px-6 py-4">Portada</th>
                      <th className="px-6 py-4">Nombre de la Colección</th>
                      <th className="px-6 py-4">Slug URL</th>
                      <th className="px-6 py-4">Productos Incluidos</th>
                      <th className="px-6 py-4 text-center">Estado</th>
                      <th className="px-6 py-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-zinc-900/20 transition-colors">
                        
                        {/* Cover Image */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="relative h-12 w-16 rounded-xl border border-zinc-850 bg-black flex items-center justify-center p-1 overflow-hidden">
                            <Image
                              src={cat.image}
                              alt={cat.nameEs}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                        </td>

                        {/* Name & Description */}
                        <td className="px-6 py-4 max-w-xs">
                          <div className="font-bold text-white text-sm uppercase">{cat.nameEs}</div>
                          <div className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5 font-inter">
                            {cat.description}
                          </div>
                        </td>

                        {/* Slug */}
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-[#00e8ff]">
                          /{cat.slug}
                        </td>

                        {/* Product Count */}
                        <td className="px-6 py-4 whitespace-nowrap text-xs">
                          <span className="bg-zinc-900 border border-zinc-800 text-white px-3 py-1 rounded-full font-extrabold text-[11px]">
                            {cat.productCount} productos
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {cat.status === 'active' ? (
                            <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Activa
                            </span>
                          ) : (
                            <span className="bg-zinc-900 text-zinc-500 border border-zinc-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                              Inactiva
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenEdit(cat)}
                              className="rounded-lg bg-zinc-900 border border-zinc-800 hover:border-[#00e8ff] text-[#00e8ff] text-[10px] font-bold uppercase px-3 py-1.5 transition-colors"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(cat.id)}
                              className="rounded-lg bg-red-950/40 border border-red-900/60 hover:bg-red-900 hover:border-red-500 text-red-400 hover:text-white text-[10px] font-bold uppercase px-3 py-1.5 transition-colors"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          ) : (
            
            /* VIEW 2: FORMULARIO DE CREACIÓN / EDICIÓN DE COLECCIÓN */
            <form onSubmit={handleSaveForm} className="space-y-8 pb-16">
              
              {/* Header Action Bar */}
              <div className="flex items-center justify-between border-b border-zinc-900 pb-5">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                    title="Volver a colecciones"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                  </button>
                  <div>
                    <span className="inline-block bg-zinc-900 border border-zinc-800 text-[#00e8ff] text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full font-opensauce mb-1">
                      {editingCategory ? 'EDITAR COLECCIÓN' : 'NUEVA COLECCIÓN'}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black uppercase font-sigher tracking-wider text-white">
                      {editingCategory ? `Editar: ${editingCategory.nameEs}` : 'Crear Colección'}
                    </h1>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-5 py-2.5 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 font-bold uppercase text-xs tracking-wider transition-all font-opensauce"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#00e8ff] text-black font-extrabold uppercase text-xs tracking-wider hover:bg-white hover:shadow-[0_0_20px_rgba(0,232,255,0.4)] transition-all font-opensauce shadow-[0_0_12px_rgba(0,232,255,0.25)]"
                  >
                    Guardar Colección
                  </button>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left 2 Columns: Main Details */}
                <div className="lg:col-span-2 space-y-8">
                  
                  {/* CARD 1: INFORMACIÓN GENERAL */}
                  <div className="rounded-2xl border border-zinc-850 bg-zinc-950/80 p-6 space-y-6 backdrop-blur-md shadow-xl">
                    <div className="border-b border-zinc-900 pb-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider font-opensauce text-white flex items-center gap-2">
                        <span className="text-[#00e8ff]">📂</span> Detalles de la Colección
                      </h3>
                    </div>

                    {/* Name ES */}
                    <div className="space-y-1.5 font-opensauce">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Nombre de la Colección (Español) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formNameEs}
                        onChange={(e) => setFormNameEs(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00e8ff] font-inter"
                        placeholder="Ej: Board Game Sleeves 100 Micras"
                      />
                    </div>

                    {/* Name EN */}
                    <div className="space-y-1.5 font-opensauce">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Nombre de la Colección (Inglés)
                      </label>
                      <input
                        type="text"
                        value={formNameEn}
                        onChange={(e) => setFormNameEn(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00e8ff] font-inter"
                        placeholder="Ej: Board Game Sleeves 100 Microns"
                      />
                    </div>

                    {/* Custom Slug */}
                    <div className="space-y-1.5 font-opensauce">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Slug de la URL (Identificador)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs">/shop/</span>
                        <input
                          type="text"
                          value={formSlug}
                          onChange={(e) => setFormSlug(e.target.value)}
                          className="w-full bg-black border border-zinc-800 rounded-xl pl-20 pr-4 py-2.5 text-xs text-[#00e8ff] font-mono focus:outline-none focus:border-[#00e8ff]"
                          placeholder="board-game-sleeves"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5 font-opensauce">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Descripción de la Colección
                      </label>
                      <textarea
                        rows={4}
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-sm text-zinc-200 focus:outline-none focus:border-[#00e8ff] font-inter leading-relaxed"
                        placeholder="Escribe una breve descripción para destacar esta colección en la tienda..."
                      />
                    </div>
                  </div>

                  {/* CARD 2: IMAGEN DE PORTADA */}
                  <div className="rounded-2xl border border-zinc-850 bg-zinc-950/80 p-6 space-y-6 backdrop-blur-md shadow-xl">
                    <div className="border-b border-zinc-900 pb-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider font-opensauce text-white flex items-center gap-2">
                        <span className="text-[#00e8ff]">🖼️</span> Imagen de Portada (Banner)
                      </h3>
                    </div>

                    {/* Drag & Drop Zone */}
                    <div className="border-2 border-dashed border-zinc-800 hover:border-[#00e8ff] rounded-2xl p-8 text-center bg-black/60 transition-all cursor-pointer group space-y-3">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-[#00e8ff] group-hover:scale-110 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-7 h-7">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                      </div>

                      <div className="space-y-1 font-opensauce">
                        <p className="text-xs font-bold text-white group-hover:text-[#00e8ff] transition-colors">
                          Arrastra y suelta el banner de portada de la colección
                        </p>
                        <p className="text-[10px] text-zinc-500 font-inter">
                          Recomendado: 1200 x 600 px en alta definición (PNG, JPG)
                        </p>
                      </div>
                    </div>

                    {/* Image Selector Dropdown Mockup */}
                    <div className="space-y-2 font-opensauce">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        O selecciona un asset de GOSU® existente:
                      </label>
                      <select
                        value={formImage}
                        onChange={(e) => setFormImage(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00e8ff]"
                      >
                        <option value="/assets/images/image-4f57375b.jpg">Board Game Sleeves (image-4f57375b.jpg)</option>
                        <option value="/assets/images/image-52e660c6.jpg">TCG Matte Sleeves (image-52e660c6.jpg)</option>
                        <option value="/assets/images/image-3a743382.jpg">Premium Binders (image-3a743382.jpg)</option>
                        <option value="/assets/images/image-113ac3f9.png">Deck Boxes (image-113ac3f9.png)</option>
                      </select>
                    </div>

                    {/* Image Preview */}
                    <div className="relative aspect-video rounded-xl border border-zinc-800 bg-black overflow-hidden">
                      <Image src={formImage} alt="Preview" fill className="object-cover" />
                    </div>
                  </div>

                  {/* CARD 3: ASIGNACIÓN MANUAL DE PRODUCTOS */}
                  <div className="rounded-2xl border border-zinc-850 bg-zinc-950/80 p-6 space-y-6 backdrop-blur-md shadow-xl font-opensauce">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                        <span className="text-[#00e8ff]">🏷️</span> Productos Incluidos ({selectedProductIds.length})
                      </h3>
                      <span className="text-[10px] text-zinc-500 font-inter">
                        Selecciona los productos pertenecientes a esta colección
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                      {AVAILABLE_PRODUCTS.map((prod) => {
                        const isSelected = selectedProductIds.includes(prod.id);

                        return (
                          <div
                            key={prod.id}
                            onClick={() => handleToggleProduct(prod.id)}
                            className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-zinc-900 border-[#00e8ff] text-white ring-1 ring-[#00e8ff]/40'
                                : 'bg-black border-zinc-850 text-zinc-400 hover:border-zinc-700'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="h-4 w-4 rounded border-zinc-800 bg-black text-[#00e8ff] focus:ring-[#00e8ff]"
                            />

                            <div className="relative h-10 w-10 shrink-0 rounded-lg bg-zinc-950 border border-zinc-800 overflow-hidden">
                              <Image src={prod.image} alt={prod.nameEs} fill className="object-contain p-1" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-white truncate">{prod.nameEs}</p>
                              <p className="text-[10px] text-[#00e8ff] font-mono font-bold mt-0.5">
                                S/. {prod.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Right Column: Settings & Visibility */}
                <div className="space-y-8">
                  
                  {/* CARD 4: ESTADO Y VISIBILIDAD */}
                  <div className="rounded-2xl border border-zinc-850 bg-zinc-950/80 p-6 space-y-6 backdrop-blur-md shadow-xl font-opensauce">
                    <div className="border-b border-zinc-900 pb-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                        <span className="text-[#00e8ff]">⚡</span> Estado & Visibilidad
                      </h3>
                    </div>

                    {/* Status Radio Group */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Estado de Publicación *
                      </label>

                      <div className="space-y-2">
                        <label
                          onClick={() => setFormStatus('active')}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            formStatus === 'active'
                              ? 'bg-zinc-900 border-emerald-500 text-white'
                              : 'bg-black border-zinc-850 text-zinc-400'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            <div>
                              <p className="text-xs font-bold">Activa</p>
                              <p className="text-[10px] text-zinc-500">Visible en la tienda pública</p>
                            </div>
                          </div>
                          <input type="radio" checked={formStatus === 'active'} readOnly />
                        </label>

                        <label
                          onClick={() => setFormStatus('inactive')}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            formStatus === 'inactive'
                              ? 'bg-zinc-900 border-zinc-700 text-white'
                              : 'bg-black border-zinc-850 text-zinc-400'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full bg-zinc-600" />
                            <div>
                              <p className="text-xs font-bold">Inactiva</p>
                              <p className="text-[10px] text-zinc-500">Oculta en la tienda pública</p>
                            </div>
                          </div>
                          <input type="radio" checked={formStatus === 'inactive'} readOnly />
                        </label>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </form>
          )}

        </div>
      </main>

    </div>
  );
}
