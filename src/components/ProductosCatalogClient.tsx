'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface Variante {
  id: string;
  sku: string;
  titulo: string;
  precio: number;
  stock: number;
  opciones: any;
}

interface Categoria {
  id: string;
  nombre: string;
  slug: string;
}

interface Producto {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  precioBase: number;
  activo: boolean;
  imagenes: string[];
  categoriaId: string | null;
  categoria: Categoria | null;
  variantes: Variante[];
}

interface ProductosCatalogClientProps {
  productos: Producto[];
  categorias: Categoria[];
  locale: 'es' | 'en';
}

export default function ProductosCatalogClient({ productos, categorias, locale }: ProductosCatalogClientProps) {
  const { addToCart } = useCart();
  
  // Real-time search & filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const isEs = locale === 'es';

  // Filter products in real time
  const filteredProducts = useMemo(() => {
    return productos.filter((product) => {
      // 1. Search term match (name or description)
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesName = product.nombre.toLowerCase().includes(query);
        const matchesDesc = product.descripcion ? product.descripcion.toLowerCase().includes(query) : false;
        if (!matchesName && !matchesDesc) return false;
      }

      // 2. Category match
      if (selectedCategory !== 'all') {
        if (product.categoriaId !== selectedCategory && product.categoria?.slug !== selectedCategory) {
          return false;
        }
      }

      // 3. Price range match
      const price = Number(product.precioBase);
      if (minPrice !== '' && !isNaN(Number(minPrice)) && price < Number(minPrice)) {
        return false;
      }
      if (maxPrice !== '' && !isNaN(Number(maxPrice)) && price > Number(maxPrice)) {
        return false;
      }

      return true;
    });
  }, [productos, searchTerm, selectedCategory, minPrice, maxPrice]);

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 lg:p-12 space-y-10">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black uppercase font-sigher tracking-widest text-white glow-cyan">
          {isEs ? 'Catálogo de Productos' : 'Product Catalog'}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-medium leading-relaxed">
          {isEs 
            ? 'Explora nuestros sleeves, binders y accesorios premium para TCG y juegos de mesa con stock en tiempo real.' 
            : 'Explore our curated selection of sleeves, binders and premium TCG accessories.'}
        </p>
      </div>

      {/* Real-time Filters Control Bar */}
      <div className="max-w-6xl mx-auto p-6 rounded-3xl border border-zinc-850 bg-zinc-950/80 backdrop-blur-md shadow-2xl space-y-6">
        
        {/* Row 1: Search Bar & Price Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Search Bar Input */}
          <div className="md:col-span-1 space-y-1.5">
            <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
              {isEs ? 'Buscador en tiempo real' : 'Real-time Search'}
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isEs ? 'Buscar por nombre o detalle...' : 'Search by name...'}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 pl-10 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#00e8ff] transition-colors"
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-zinc-500 absolute left-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
          </div>

          {/* Price Range Filter Inputs */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
              {isEs ? 'Rango de Precios (S/.)' : 'Price Range (S/.)'}
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative flex items-center">
                <span className="text-xs text-zinc-500 absolute left-3 font-bold">S/.</span>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min"
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2.5 pl-9 text-xs text-white focus:outline-none focus:border-[#00e8ff]"
                />
              </div>
              <span className="text-zinc-600 font-bold text-xs">-</span>
              <div className="flex-1 relative flex items-center">
                <span className="text-xs text-zinc-500 absolute left-3 font-bold">S/.</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max"
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2.5 pl-9 text-xs text-white focus:outline-none focus:border-[#00e8ff]"
                />
              </div>

              {(searchTerm || selectedCategory !== 'all' || minPrice || maxPrice) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setMinPrice('');
                    setMaxPrice('');
                  }}
                  className="text-[10px] uppercase tracking-wider font-extrabold text-rose-500 hover:text-rose-400 px-3 py-2 border border-rose-900/40 rounded-xl bg-rose-950/20 transition-all whitespace-nowrap"
                >
                  {isEs ? 'Limpiar Filtros' : 'Clear Filters'}
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Row 2: Category Filter Pills */}
        <div className="space-y-2 border-t border-zinc-900 pt-4">
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">
            {isEs ? 'Categoría' : 'Category'}
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#00e8ff] text-black shadow-[0_0_12px_rgba(0,232,255,0.4)]'
                  : 'bg-black border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              {isEs ? 'Todas' : 'All'}
            </button>

            {categorias.map((cat) => {
              const isActive = selectedCategory === cat.id || selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-[#00e8ff] text-black shadow-[0_0_12px_rgba(0,232,255,0.4)]'
                      : 'bg-black border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  {cat.nombre}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Product Grid Container */}
      <div className="max-w-6xl mx-auto">
        {filteredProducts.length === 0 ? (
          <div className="p-16 text-center border border-zinc-900 rounded-3xl bg-zinc-950/40 space-y-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-zinc-600 mx-auto">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <p className="text-zinc-400 text-sm font-medium">
              {isEs ? 'No se encontraron productos que coincidan con la búsqueda.' : 'No products found matching filters.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {
              const price = Number(product.precioBase);
              const firstVariant = product.variantes && product.variantes.length > 0 ? product.variantes[0] : null;
              const hasStock = product.variantes?.some((v) => v.stock > 0);

              return (
                <div
                  key={product.id}
                  className="flex flex-col h-full rounded-3xl border border-zinc-850 bg-zinc-950/60 backdrop-blur-md overflow-hidden card-glow-hover transition-all duration-300 group"
                >
                  {/* Product Image Link */}
                  <Link href={`/${locale}/producto/${product.slug}`} className="relative aspect-square w-full bg-zinc-950 border-b border-zinc-900 p-6 flex items-center justify-center overflow-hidden">
                    <Image
                      src={product.imagenes[0] || '/assets/images/image-113ac3f9.png'}
                      alt={product.nombre}
                      fill
                      className="object-contain p-6 transform group-hover:scale-108 transition-transform duration-300"
                    />
                    
                    {/* Badge Category */}
                    {product.categoria && (
                      <span className="absolute top-4 left-4 bg-zinc-900/90 text-zinc-300 text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-zinc-800">
                        {product.categoria.nombre}
                      </span>
                    )}
                  </Link>

                  {/* Info Details */}
                  <div className="flex flex-1 flex-col p-6 justify-between space-y-4">
                    <div className="space-y-2">
                      <Link href={`/${locale}/producto/${product.slug}`}>
                        <h3 className="text-base font-bold text-white uppercase font-opensauce line-clamp-1 hover:text-[#00e8ff] transition-colors">
                          {product.nombre}
                        </h3>
                      </Link>
                      <p className="text-zinc-500 text-xs line-clamp-2 leading-relaxed">
                        {product.descripcion}
                      </p>

                      {/* Variants counter badge */}
                      {product.variantes && product.variantes.length > 0 && (
                        <div className="pt-1 flex items-center gap-2">
                          <span className="text-[10px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 rounded font-semibold">
                            {product.variantes.length} {isEs ? 'Variantes disponibles' : 'Variants'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Price and Action Button */}
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-900 mt-auto">
                      <div>
                        <span className="text-xs text-zinc-500 uppercase font-bold block text-[9px]">Desde</span>
                        <span className="text-xl font-black text-white font-sigher">
                          S/. {price.toFixed(2)}
                        </span>
                      </div>

                      <Link
                        href={`/${locale}/producto/${product.slug}`}
                        className="rounded-full bg-white text-black text-[10px] tracking-wider font-extrabold uppercase py-2.5 px-4 hover:bg-[#00e8ff] hover:shadow-[0_0_15px_rgba(0,232,255,0.4)] transition-all"
                      >
                        {isEs ? 'Ver Detalle' : 'View Product'}
                      </Link>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
