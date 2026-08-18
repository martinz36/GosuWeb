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

  const images = product.imagenes && product.imagenes.length > 0
    ? product.imagenes.map((img: string) => sanitizeImgUrl(img))
    : ['/assets/images/image-4f57375b.jpg'];

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(
    product.variantes && product.variantes.length > 0 ? product.variantes[0] : null
  );
  const [quantity, setQuantity] = useState(1);

  const currentPrice = selectedVariant ? Number(selectedVariant.precio) : Number(product.precioBase || 15);
  const currentStock = selectedVariant ? selectedVariant.stock : (product.stockTotal || 150);

  const handleAddToCart = () => {
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
      true // Open cart drawer on add
    );
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#00e8ff] selection:text-black relative" data-framer-cursor="c54oa2">
      
      {/* 1. Framer Style Navbar */}
      <ShopNavbar locale={locale} dict={dict} />

      {/* 2. Breadcrumb Navigation */}
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

      {/* 3. Main Product Detail Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            {/* Main High-Res Image Box */}
            <div className="relative aspect-square w-full rounded-3xl bg-zinc-950/80 border border-zinc-850 overflow-hidden flex items-center justify-center p-8 backdrop-blur-md shadow-2xl">
              <Image
                src={images[activeImgIndex] || images[0]}
                alt={product.nombre}
                fill
                priority
                className="object-contain p-6 transform hover:scale-105 transition-transform duration-300"
              />
              
              {/* Live Stock Badge */}
              <span className="absolute top-4 right-4 bg-emerald-950/90 text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-900/60 font-opensauce">
                Stock: {currentStock} u.
              </span>
            </div>

            {/* Thumbnail Selector */}
            {images.length > 1 && (
              <div className="flex flex-wrap gap-3">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl bg-black border overflow-hidden transition-all ${
                      activeImgIndex === idx
                        ? 'border-[#00e8ff] shadow-[0_0_10px_rgba(0,232,255,0.4)] scale-105'
                        : 'border-zinc-850 hover:border-zinc-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`${product.nombre} ${idx}`} fill className="object-contain p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Information & Purchase Bar */}
          <div className="space-y-8">
            
            {/* Category & Title */}
            <div className="space-y-3">
              {product.categoria && (
                <span className="inline-block bg-zinc-900 border border-zinc-800 text-[#00e8ff] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full font-opensauce">
                  {product.categoria.nombre}
                </span>
              )}

              <h1 className="text-3xl sm:text-5xl font-black uppercase font-sigher tracking-wider text-white leading-tight glow-cyan">
                {product.nombre}
              </h1>

              {/* Price Tag */}
              <div className="pt-2 flex items-baseline gap-3">
                <span className="text-4xl font-black font-sigher text-white glow-cyan">
                  S/. {currentPrice.toFixed(2)}
                </span>
                {selectedVariant?.sku && (
                  <span className="text-xs text-zinc-500 font-mono">
                    SKU: {selectedVariant.sku}
                  </span>
                )}
              </div>
            </div>

            {/* Product Description */}
            <div className="space-y-2 border-t border-zinc-850 pt-6">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-opensauce">
                {isEs ? 'Descripción del Producto' : 'Product Description'}
              </h4>
              <p className="text-sm text-zinc-300 font-inter leading-relaxed">
                {product.descripcion}
              </p>
            </div>

            {/* Specifications Highlights */}
            <div className="bg-zinc-950/90 border border-zinc-850 rounded-2xl p-5 space-y-3 font-opensauce backdrop-blur-md">
              <h4 className="text-xs font-bold text-[#00e8ff] uppercase tracking-wider">
                {isEs ? 'Especificaciones Técnicas' : 'Technical Specifications'}
              </h4>
              <ul className="text-xs text-zinc-300 space-y-2 font-inter">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00e8ff]" />
                  <span>{isEs ? 'Paquete de 102 unidades por pack' : '102 units per pack'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00e8ff]" />
                  <span>{isEs ? '100 y 140 micras de grosor ultra resistente' : '100 & 140 microns ultra durable thickness'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00e8ff]" />
                  <span>{isEs ? 'ACID & PVC FREE (Libres de Ácido y PVC)' : 'Acid & PVC Free'}</span>
                </li>
              </ul>
            </div>

            {/* Variant Option Selector */}
            {product.variantes && product.variantes.length > 0 && (
              <div className="space-y-3 font-opensauce">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  {isEs ? 'Seleccionar Variante / Tamaño:' : 'Select Variant / Size:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.variantes.map((v: any) => {
                    const isSelected = selectedVariant?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`flex items-center justify-between p-3.5 rounded-xl border text-xs font-bold transition-all text-left ${
                          isSelected
                            ? 'bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.4)] scale-102'
                            : 'bg-zinc-950 text-zinc-300 border-zinc-850 hover:border-zinc-700 hover:text-white'
                        }`}
                      >
                        <span>{v.titulo}</span>
                        <span className="font-sigher text-sm font-black">
                          S/. {Number(v.precio).toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector & Add to Cart Action */}
            <div className="space-y-4 pt-4 border-t border-zinc-850">
              <div className="flex items-center gap-4">
                
                {/* Quantity Controls */}
                <div className="flex items-center border border-zinc-800 rounded-full bg-black px-3 py-2 font-opensauce">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1 text-zinc-400 hover:text-white text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-extrabold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                    className="px-3 py-1 text-zinc-400 hover:text-white text-sm font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart CTA Button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 rounded-full bg-[#00e8ff] text-black font-extrabold uppercase tracking-widest text-xs py-4 px-6 hover:bg-white hover:shadow-[0_0_25px_rgba(0,232,255,0.5)] transition-all transform hover:scale-102 font-opensauce shadow-[0_0_15px_rgba(0,232,255,0.3)]"
                >
                  {dict?.cart?.add || (isEs ? 'AGREGAR AL CARRITO' : 'ADD TO CART')}
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Related Products Section */}
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

      {/* 4. Framer Style Footer */}
      <ShopFooter locale={locale} />

      {/* Floating Cart Button & Sliding Cart Drawer */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-[0_0_20px_rgba(0,232,255,0.4)] border border-zinc-800 transition-all hover:bg-[#00e8ff] hover:scale-105"
        title={dict.cart.title}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff09bb] text-[10px] font-extrabold text-white animate-pulse">
            {cartCount}
          </span>
        )}
      </button>

      <CartDrawer locale={locale} dict={dict.cart} />

    </div>
  );
}
