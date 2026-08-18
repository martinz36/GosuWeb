'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ShopNavbar from './ShopNavbar';
import ShopFooter from './ShopFooter';
import CartDrawer from './CartDrawer';
import { useCart } from '@/context/CartContext';

interface ProductDetailClientProps {
  locale: 'es' | 'en';
  dict: any;
  product: any;
  relatedProducts: any[];
}

function sanitizeImgUrl(url: string | undefined): string {
  if (!url) return '/assets/images/image-4f57375b.jpg';
  try {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const parsed = new URL(url);
      if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
        return parsed.pathname;
      }
    }
  } catch (e) {
    // fallback
  }
  return url;
}

export default function ProductDetailClient({
  locale,
  dict,
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const isEs = locale === 'es';
  const { addToCart, cartCount, setIsCartOpen } = useCart();
  const router = useRouter();

  // Process Images List
  const images = product.imagenes && product.imagenes.length > 0
    ? product.imagenes.map((img: string) => sanitizeImgUrl(img))
    : ['/assets/images/image-4f57375b.jpg'];

  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Active Selected Variant State
  const [selectedVariant, setSelectedVariant] = useState<any>(
    product.variantes && product.variantes.length > 0 ? product.variantes[0] : null
  );
  const [quantity, setQuantity] = useState(1);

  // Dynamic Calculated Fields
  const currentPrice = selectedVariant ? Number(selectedVariant.precio) : Number(product.precioBase || 15);
  // Compare Price (e.g. 20% higher than current price for discount presentation)
  const comparePrice = selectedVariant?.precioComparacion
    ? Number(selectedVariant.precioComparacion)
    : currentPrice * 1.2;

  const currentStock = selectedVariant ? selectedVariant.stock : (product.stockTotal || 0);
  const isOutOfStock = currentStock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addToCart(
      {
        cartItemId: `${product.id}-${selectedVariant?.id || 'default'}`,
        productId: product.id,
        variantId: selectedVariant?.id,
        variantTitle: selectedVariant?.titulo,
        sku: selectedVariant?.sku,
        slug: product.slug,
        name: product.nombre,
        price: currentPrice,
        image: images[activeImgIndex] || images[0],
        stock: currentStock,
      },
      quantity,
      true // Open cart drawer automatically
    );
  };

  const isHtml = product.descripcion && /<[a-z][\s\S]*>/i.test(product.descripcion);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#00e8ff] selection:text-black relative" data-framer-cursor="c54oa2">
      
      {/* 1. Transparent Framer Navbar */}
      <ShopNavbar locale={locale} dict={dict} />

      {/* 2. Breadcrumb Trail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 font-opensauce text-xs text-zinc-400 flex items-center gap-2">
        <Link href={`/${locale}/shop`} className="hover:text-[#00e8ff] transition-colors">
          {isEs ? 'Tienda' : 'Store'}
        </Link>
        <span>/</span>
        {product.categoria && (
          <>
            <span className="text-zinc-300">{product.categoria.nombre}</span>
            <span>/</span>
          </>
        )}
        <span className="text-white font-bold line-clamp-1">{product.nombre}</span>
      </div>

      {/* 3. Main 2-Column Product Detail Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* COLUMN 1 (LEFT): IMAGE GALLERY */}
          <div className="space-y-4">
            {/* Main High-Res Image Box */}
            <div className="relative aspect-square w-full rounded-3xl bg-zinc-950/80 border border-zinc-850 overflow-hidden flex items-center justify-center p-8 backdrop-blur-md shadow-2xl group">
              <Image
                src={images[activeImgIndex] || images[0]}
                alt={product.nombre}
                fill
                priority
                className="object-contain p-6 transform group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Dynamic Live Stock Badge */}
              <div className="absolute top-4 right-4 font-opensauce">
                {isOutOfStock ? (
                  <span className="bg-red-950/90 text-red-400 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-red-900/60 shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                    🚫 AGOTADO
                  </span>
                ) : (
                  <span className="bg-emerald-950/90 text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-900/60 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                    ✓ EN STOCK ({currentStock} u.)
                  </span>
                )}
              </div>
            </div>

            {/* Interactive Thumbnail Selector Grid */}
            {images.length > 1 && (
              <div className="flex flex-wrap gap-3">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl bg-black border overflow-hidden transition-all ${
                      activeImgIndex === idx
                        ? 'border-[#00e8ff] shadow-[0_0_12px_rgba(0,232,255,0.4)] scale-105'
                        : 'border-zinc-850 hover:border-zinc-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`${product.nombre} ${idx}`} fill className="object-contain p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* COLUMN 2 (RIGHT): PRODUCT DETAILS & PURCHASING CONTROLS */}
          <div className="space-y-8 font-opensauce">
            
            {/* Title & Category Badge */}
            <div className="space-y-3">
              {product.categoria && (
                <span className="inline-block bg-zinc-900 border border-zinc-800 text-[#00e8ff] text-[10px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full">
                  {product.categoria.nombre}
                </span>
              )}

              <h1 className="text-3xl sm:text-5xl font-black uppercase font-sigher tracking-wider text-white leading-tight glow-cyan">
                {product.nombre}
              </h1>

              {/* Price & Compare Price Display */}
              <div className="pt-2 flex items-baseline gap-4">
                <span className="text-4xl font-black font-sigher text-white glow-cyan">
                  S/. {currentPrice.toFixed(2)}
                </span>

                {comparePrice > currentPrice && (
                  <span className="text-lg text-zinc-500 line-through font-sigher">
                    S/. {comparePrice.toFixed(2)}
                  </span>
                )}

                {comparePrice > currentPrice && (
                  <span className="bg-[#ff09bb] text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full animate-pulse">
                    OFERTA GOSU
                  </span>
                )}
              </div>

              {selectedVariant?.sku && (
                <p className="text-xs text-zinc-500 font-mono">
                  SKU: <span className="text-zinc-300">{selectedVariant.sku}</span>
                </p>
              )}
            </div>

            {/* Interactive Variant Option Selector Buttons */}
            {product.variantes && product.variantes.length > 0 && (
              <div className="space-y-3 border-t border-zinc-850 pt-6">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    {isEs ? 'Seleccionar Variante / Opciones:' : 'Select Variant / Options:'}
                  </label>
                  <span className="text-[10px] text-[#00e8ff] font-bold uppercase">
                    {selectedVariant?.titulo}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.variantes.map((v: any) => {
                    const isSelected = selectedVariant?.id === v.id;
                    const vStock = v.stock;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`flex items-center justify-between p-4 rounded-2xl border text-xs font-bold transition-all text-left ${
                          isSelected
                            ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-102'
                            : 'bg-zinc-950 text-zinc-300 border-zinc-850 hover:border-zinc-700 hover:text-white'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <span className="block font-bold">{v.titulo}</span>
                          <span className="text-[9px] text-zinc-500 block font-mono">
                            {vStock > 0 ? `${vStock} disponibles` : 'Sin stock'}
                          </span>
                        </div>

                        <span className="font-sigher text-base font-black">
                          S/. {Number(v.precio).toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Controls & Primary Framer CTA Button */}
            <div className="space-y-4 pt-4 border-t border-zinc-850">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                
                {/* Quantity Picker (- 1 +) */}
                <div className="flex items-center justify-between border border-zinc-800 rounded-full bg-black px-4 py-3 sm:py-2.5">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={isOutOfStock}
                    className="px-2 text-zinc-400 hover:text-white text-base font-bold disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-extrabold text-white font-mono">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                    disabled={isOutOfStock}
                    className="px-2 text-zinc-400 hover:text-white text-base font-bold disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                {/* Main Call To Action Button (Framer Style) */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 rounded-full text-black font-extrabold uppercase tracking-widest text-xs py-4 px-8 transition-all transform font-opensauce ${
                    isOutOfStock
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                      : 'bg-[#00e8ff] hover:bg-white hover:shadow-[0_0_25px_rgba(0,232,255,0.5)] hover:scale-102 shadow-[0_0_15px_rgba(0,232,255,0.3)]'
                  }`}
                >
                  {isOutOfStock
                    ? (isEs ? 'PRODUCTO AGOTADO' : 'OUT OF STOCK')
                    : (dict?.cart?.add || (isEs ? 'AGREGAR AL CARRITO 🛒' : 'ADD TO CART 🛒'))}
                </button>
              </div>
            </div>

            {/* Product Description (Supports Rich Text HTML or Plain Text) */}
            <div className="space-y-3 border-t border-zinc-850 pt-6">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                {isEs ? 'Descripción Detallada' : 'Detailed Description'}
              </h4>

              {isHtml ? (
                <div
                  className="text-sm text-zinc-300 font-inter leading-relaxed prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.descripcion }}
                />
              ) : (
                <p className="text-sm text-zinc-300 font-inter leading-relaxed whitespace-pre-line">
                  {product.descripcion}
                </p>
              )}
            </div>

            {/* Technical Highlights Box */}
            <div className="bg-zinc-950/90 border border-zinc-850 rounded-2xl p-5 space-y-3 backdrop-blur-md">
              <h4 className="text-xs font-bold text-[#00e8ff] uppercase tracking-wider">
                🛡️ Garantía de Calidad GOSU®
              </h4>
              <ul className="text-xs text-zinc-300 space-y-2 font-inter">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00e8ff]" />
                  <span>100 y 140 micras de polipropileno de alta densidad</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00e8ff]" />
                  <span>Libres de Ácido y PVC (ACID & PVC FREE)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00e8ff]" />
                  <span>Despacho directo y stock asegurado en tiempo real</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 space-y-8 border-t border-zinc-850 pt-12">
            <h3 className="text-2xl font-black uppercase font-sigher tracking-wider text-white glow-cyan">
              {isEs ? 'PRODUCTOS RELACIONADOS' : 'RELATED PRODUCTS'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((relProduct) => {
                const relImg = sanitizeImgUrl(relProduct.imagenes?.[0]);
                const relPrice = relProduct.variantes?.[0] ? Number(relProduct.variantes[0].precio) : Number(relProduct.precioBase || 15);
                
                return (
                  <div
                    key={relProduct.id}
                    onClick={() => router.push(`/${locale}/shop/${relProduct.slug}`)}
                    className="flex flex-col h-full rounded-2xl border border-zinc-850 bg-zinc-950/90 backdrop-blur-md overflow-hidden card-glow-hover transition-all duration-300 group cursor-pointer p-4 space-y-3 justify-between"
                  >
                    <div className="relative aspect-square w-full bg-black rounded-xl border border-zinc-900 flex items-center justify-center p-3 overflow-hidden">
                      <Image
                        src={relImg}
                        alt={relProduct.nombre}
                        fill
                        className="object-contain p-2 transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-black uppercase text-white font-opensauce line-clamp-1 group-hover:text-[#00e8ff] transition-colors">
                        {relProduct.nombre}
                      </h4>
                      <p className="text-lg font-black font-sigher text-white glow-cyan">
                        S/. {relPrice.toFixed(2)}
                      </p>
                    </div>

                    <button className="w-full rounded-full bg-white text-black text-[9px] tracking-widest font-black uppercase py-2 px-3 hover:bg-[#00e8ff] transition-all font-opensauce font-extrabold">
                      {isEs ? 'Ver Producto' : 'View Product'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <ShopFooter locale={locale} />

      {/* Sliding Cart Drawer */}
      <CartDrawer locale={locale} dict={dict.cart} />

    </div>
  );
}
