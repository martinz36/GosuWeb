'use client';

import React, { useState } from 'react';
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

interface ProductoDetalleClientProps {
  producto: Producto;
  locale: 'es' | 'en';
}

export default function ProductoDetalleClient({ producto, locale }: ProductoDetalleClientProps) {
  const { addToCart } = useCart();
  const isEs = locale === 'es';

  // Active image gallery index
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Selected variant state (defaults to first variant if present)
  const [selectedVariant, setSelectedVariant] = useState<Variante | null>(
    producto.variantes && producto.variantes.length > 0 ? producto.variantes[0] : null
  );

  // Selected quantity
  const [quantity, setQuantity] = useState(1);

  // Current real-time price & stock based on selected variant
  const currentPrice = selectedVariant ? Number(selectedVariant.precio) : Number(producto.precioBase);
  const currentStock = selectedVariant ? selectedVariant.stock : 0;
  const isOutOfStock = currentStock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addToCart(
      {
        cartItemId: `${producto.id}-${selectedVariant?.id || 'default'}`,
        productId: producto.id,
        variantId: selectedVariant?.id,
        variantTitle: selectedVariant?.titulo,
        sku: selectedVariant?.sku,
        slug: producto.slug,
        name: producto.nombre,
        price: currentPrice,
        image: producto.imagenes[selectedImageIndex] || '/assets/images/image-113ac3f9.png',
        stock: currentStock,
      },
      quantity
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 lg:p-12">
      {/* Breadcrumb Navigation */}
      <div className="max-w-6xl mx-auto mb-8 flex items-center gap-2 text-xs text-zinc-500 uppercase tracking-widest font-semibold">
        <Link href={`/${locale}/productos`} className="hover:text-[#00e8ff] transition-colors">
          {isEs ? 'Catálogo' : 'Catalog'}
        </Link>
        <span>/</span>
        {producto.categoria && (
          <>
            <span className="text-zinc-400">{producto.categoria.nombre}</span>
            <span>/</span>
          </>
        )}
        <span className="text-white font-bold truncate max-w-xs">{producto.nombre}</span>
      </div>

      {/* Main Product Detail Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          {/* Featured Large Image */}
          <div className="relative aspect-square w-full rounded-3xl border border-zinc-850 bg-zinc-950/80 p-8 flex items-center justify-center overflow-hidden shadow-2xl">
            <Image
              src={producto.imagenes[selectedImageIndex] || '/assets/images/image-113ac3f9.png'}
              alt={producto.nombre}
              fill
              className="object-contain p-8 transform hover:scale-105 transition-transform duration-300"
              priority
            />
          </div>

          {/* Thumbnail Strip */}
          {producto.imagenes.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {producto.imagenes.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative h-20 w-20 flex-shrink-0 rounded-2xl border bg-zinc-950 p-2 overflow-hidden transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#00e8ff] shadow-[0_0_12px_rgba(0,232,255,0.4)]'
                      : 'border-zinc-850 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`${producto.nombre} thumb ${idx}`} fill className="object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information, Variants & Cart Actions */}
        <div className="space-y-8 p-6 sm:p-8 rounded-3xl border border-zinc-850 bg-zinc-950/60 backdrop-blur-md shadow-2xl">
          
          {/* Header Title & Category */}
          <div className="space-y-3">
            {producto.categoria && (
              <span className="inline-block bg-zinc-900 border border-zinc-800 text-[#00e8ff] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                {producto.categoria.nombre}
              </span>
            )}
            
            <h1 className="text-2xl sm:text-4xl font-black uppercase font-sigher tracking-wide text-white leading-tight">
              {producto.nombre}
            </h1>

            {/* Real-time Price & Stock Display */}
            <div className="flex items-baseline gap-4 pt-2">
              <span className="text-3xl sm:text-4xl font-black text-white font-sigher glow-cyan">
                S/. {currentPrice.toFixed(2)}
              </span>

              {/* Stock Status Badge */}
              <span
                className={`text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border ${
                  isOutOfStock
                    ? 'bg-rose-950/40 text-rose-400 border-rose-900/60'
                    : currentStock <= 10
                    ? 'bg-amber-950/40 text-amber-400 border-amber-900/60 animate-pulse'
                    : 'bg-emerald-950/40 text-emerald-400 border-emerald-900/60'
                }`}
              >
                {isOutOfStock
                  ? isEs ? 'Agotado' : 'Out of Stock'
                  : `${isEs ? 'En Stock' : 'In Stock'}: ${currentStock} ${isEs ? 'unidades' : 'units'}`}
              </span>
            </div>
          </div>

          {/* Description */}
          {producto.descripcion && (
            <div className="border-t border-b border-zinc-900 py-4">
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                {producto.descripcion}
              </p>
            </div>
          )}

          {/* Variant Selector Options (e.g., Talla, Color, Modelo) */}
          {producto.variantes && producto.variantes.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs text-zinc-400 uppercase font-bold tracking-wider">
                  {isEs ? 'Selecciona Variante / Modelo:' : 'Select Variant / Option:'}
                </label>
                {selectedVariant && (
                  <span className="text-[10px] text-zinc-500 font-mono">
                    SKU: {selectedVariant.sku}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {producto.variantes.map((variant) => {
                  const isSelected = selectedVariant?.id === variant.id;
                  const variantStockOut = variant.stock <= 0;

                  return (
                    <button
                      key={variant.id}
                      onClick={() => {
                        setSelectedVariant(variant);
                        setQuantity(1); // Reset quantity selector to 1 on variant switch
                      }}
                      disabled={variantStockOut}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] font-bold'
                          : variantStockOut
                          ? 'bg-zinc-950 border-zinc-900 text-zinc-600 opacity-40 cursor-not-allowed'
                          : 'bg-black border-zinc-850 text-zinc-300 hover:border-zinc-700 hover:text-white'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs uppercase font-extrabold">{variant.titulo}</div>
                        <div className={`text-[9px] ${isSelected ? 'text-zinc-700' : 'text-zinc-500'}`}>
                          Stock: {variant.stock} u.
                        </div>
                      </div>

                      <div className="text-xs font-black font-sigher">
                        S/. {Number(variant.precio).toFixed(2)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector & Add to Cart Action */}
          <div className="space-y-4 pt-4 border-t border-zinc-900">
            <div className="flex items-center gap-4">
              
              {/* Quantity Controls */}
              <div className="flex items-center border border-zinc-800 rounded-2xl bg-black px-2 py-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={isOutOfStock || quantity <= 1}
                  className="px-3 py-1.5 text-zinc-400 hover:text-white disabled:opacity-30 text-sm font-bold"
                >
                  -
                </button>
                <span className="px-4 text-sm font-extrabold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                  disabled={isOutOfStock || quantity >= currentStock}
                  className="px-3 py-1.5 text-zinc-400 hover:text-white disabled:opacity-30 text-sm font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 rounded-full py-4 px-6 font-extrabold text-xs uppercase tracking-widest transition-all ${
                  isOutOfStock
                    ? 'bg-zinc-900 text-zinc-600 border border-zinc-850 cursor-not-allowed'
                    : 'bg-white text-black hover:bg-[#00e8ff] hover:shadow-[0_0_25px_rgba(0,232,255,0.5)] transform hover:scale-[1.02]'
                }`}
              >
                {isOutOfStock
                  ? isEs ? 'Producto Agotado' : 'Out of Stock'
                  : isEs ? 'Agregar al Carrito' : 'Add to Cart'}
              </button>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
