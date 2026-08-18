'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import ProductModal, { DetailedProduct } from './ProductModal';

interface CatalogGridProps {
  initialProducts: any[];
  locale: 'es' | 'en';
  dict: any;
  initialCategory?: string;
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

export default function CatalogGrid({ initialProducts, locale, dict, initialCategory = '' }: CatalogGridProps) {
  const { addToCart } = useCart();
  const isEs = locale === 'es';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedProductForModal, setSelectedProductForModal] = useState<DetailedProduct | null>(null);

  // Quantities for each product ID
  const [quantities, setQuantities] = useState<Record<string | number, number>>({});
  // Selected variant for each product ID
  const [selectedVariants, setSelectedVariants] = useState<Record<string | number, any>>({});

  const categoriesList = [
    { value: '', labelEs: 'Todos los productos', labelEn: 'All products' },
    { value: 'board-sleeves', labelEs: 'Fundas Mesa', labelEn: 'Board Sleeves' },
    { value: 'tcg-sleeves', labelEs: 'TCG Sleeves', labelEn: 'TCG Sleeves' },
    { value: 'inner-over', labelEs: 'Inner/Over', labelEn: 'Inner/Over' },
    { value: 'binders', labelEs: 'Carpetas', labelEn: 'Binders' },
    { value: 'deckboxes', labelEs: 'Deck Boxes', labelEn: 'Deck Boxes' },
  ];

  const filteredProducts = selectedCategory
    ? initialProducts.filter((p) => p.category === selectedCategory || p.categoria?.slug === selectedCategory)
    : initialProducts;

  const handleQuantityChange = (productId: string | number, delta: number, maxStock: number) => {
    setQuantities((prev) => {
      const current = prev[productId] || 1;
      const nextVal = Math.max(1, Math.min(maxStock, current + delta));
      return { ...prev, [productId]: nextVal };
    });
  };

  const handleDirectAddToCart = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();

    const activeVariant = selectedVariants[product.id] || (product.variantes && product.variantes.length > 0 ? product.variantes[0] : null);
    const price = activeVariant ? Number(activeVariant.precio) : Number(product.precioBase || product.price || 15);
    const quantity = quantities[product.id] || 1;
    const img = sanitizeImgUrl(product.image || product.imagenes?.[0]);
    const stock = activeVariant ? activeVariant.stock : (product.stock || 150);

    const name = isEs ? (product.nombre || product.nameEs) : (product.nombre || product.nameEn);

    addToCart(
      {
        cartItemId: `${product.id}-${activeVariant?.id || 'default'}`,
        productId: product.id,
        variantId: activeVariant?.id,
        variantTitle: activeVariant?.titulo,
        sku: activeVariant?.sku,
        slug: product.slug,
        name: name || 'Producto GOSU',
        price: price,
        image: img,
        stock: stock,
      },
      quantity,
      true // Open sliding cart drawer
    );
  };

  return (
    <div className="space-y-12">
      
      {/* Category Filter Pills (Minimal Dark Design) */}
      <div className="flex flex-wrap gap-2 justify-center border-b border-zinc-850 pb-6">
        {categoriesList.map((cat) => {
          const isActive = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`rounded-full px-4 py-2 text-[11px] font-extrabold tracking-wider uppercase transition-all ${
                isActive
                  ? 'bg-[#00e8ff] text-black shadow-[0_0_15px_rgba(0,232,255,0.4)] scale-105'
                  : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              {isEs ? cat.labelEs : cat.labelEn}
            </button>
          );
        })}
      </div>

      {/* Minimal 4-Column Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredProducts.map((product) => {
          const name = isEs ? (product.nombre || product.nameEs) : (product.nombre || product.nameEn);
          const description = isEs ? (product.descripcion || product.descriptionEs) : (product.descripcion || product.descriptionEn);
          const imgUrl = sanitizeImgUrl(product.image || product.imagenes?.[0]);
          
          const variantsList: any[] = product.variantes || [];
          const activeVariant = selectedVariants[product.id] || (variantsList.length > 0 ? variantsList[0] : null);

          const currentPrice = activeVariant ? Number(activeVariant.precio) : Number(product.precioBase || product.price || 15);
          const currentStock = activeVariant ? activeVariant.stock : (product.stock || 150);

          const currentQty = quantities[product.id] || 1;

          return (
            <div
              key={product.id}
              onClick={() => setSelectedProductForModal(product)}
              className="flex flex-col h-full rounded-2xl border border-zinc-850 bg-zinc-950/90 backdrop-blur-md overflow-hidden card-glow-hover transition-all duration-300 group cursor-pointer p-4 space-y-3 justify-between"
            >
              {/* Product Image Box */}
              <div className="relative aspect-square w-full bg-black rounded-xl border border-zinc-900 flex items-center justify-center p-3 overflow-hidden">
                <Image
                  src={imgUrl}
                  alt={name || 'GOSU Product'}
                  fill
                  className="object-contain p-2 transform group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Stock Badge */}
                <span className="absolute top-2.5 right-2.5 bg-emerald-950/90 text-emerald-400 text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-900/60">
                  Stock: {currentStock}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1 flex-1">
                <h3 className="text-xs font-black uppercase text-white font-opensauce line-clamp-1 group-hover:text-[#00e8ff] transition-colors">
                  {name}
                </h3>
                {description && (
                  <p className="text-zinc-500 text-[10px] line-clamp-1 leading-normal">
                    {description}
                  </p>
                )}
              </div>

              {/* Minimal Variant Selector */}
              {variantsList.length > 0 && (
                <div className="space-y-1" onClick={(e) => e.stopPropagation()}>
                  <div className="flex flex-wrap gap-1">
                    {variantsList.map((v: any) => {
                      const isSelected = activeVariant?.id === v.id;
                      return (
                        <button
                          key={v.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedVariants((prev) => ({ ...prev, [product.id]: v }));
                          }}
                          className={`text-[9px] px-2 py-0.5 rounded-lg font-bold border transition-all ${
                            isSelected
                              ? 'bg-white text-black border-white shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                              : 'bg-black text-zinc-400 border-zinc-850 hover:border-zinc-700 hover:text-white'
                          }`}
                        >
                          {v.titulo}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Footer: Price + Quantity + Add to Cart */}
              <div className="pt-2 border-t border-zinc-900 space-y-2 mt-auto">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-white font-sigher glow-cyan">
                    S/. {currentPrice.toFixed(2)}
                  </span>
                  
                  {/* Quantity selector */}
                  <div className="flex items-center border border-zinc-800 rounded-lg bg-black px-1 py-0.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(product.id, -1, currentStock);
                      }}
                      className="px-1.5 py-0.5 text-zinc-400 hover:text-white text-[10px] font-bold"
                    >
                      -
                    </button>
                    <span className="px-1.5 text-[10px] font-extrabold text-white">{currentQty}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(product.id, 1, currentStock);
                      }}
                      className="px-1.5 py-0.5 text-zinc-400 hover:text-white text-[10px] font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={(e) => handleDirectAddToCart(product, e)}
                  className="w-full rounded-full bg-white text-black text-[9px] tracking-widest font-black uppercase py-2.5 px-3 hover:bg-[#00e8ff] hover:shadow-[0_0_12px_rgba(0,232,255,0.4)] transition-all transform hover:scale-[1.01]"
                >
                  {dict?.cart?.add || (isEs ? 'Agregar al Carrito' : 'Add to Cart')}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Pop-up Modal when clicking a product card */}
      <ProductModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        locale={locale}
        dict={dict}
      />

      {/* Intelligently Designed "REGÍSTRATE AQUÍ PARA COMPRAR" CTA Banner */}
      <div className="mt-16 rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00e8ff]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="inline-block bg-orange-950/40 border border-orange-800/60 text-orange-400 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-2">
          {isEs ? '¿ERES DISTRIBUIDOR O TIENDA?' : 'RESELLER OR STORE OWNER?'}
        </div>

        <h3 className="text-2xl sm:text-4xl font-black uppercase font-sigher tracking-wider text-orange-500 max-w-2xl mx-auto leading-tight">
          {isEs ? 'REGÍSTRATE AQUÍ PARA COMPRAR AL POR MAYOR' : 'REGISTER HERE TO BUY WHOLESALE'}
        </h3>

        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto font-medium leading-relaxed">
          {isEs 
            ? 'Accede a nuestro programa exclusivo de distribuidores con precios especiales, atención personalizada y despacho prioritario en todo el país.'
            : 'Access our official partner program with special B2B pricing, wholesale catalog, and priority dispatch.'}
        </p>

        <div className="pt-2">
          <Link
            href={`/${locale}/become-partner`}
            className="inline-flex items-center gap-3 rounded-full bg-orange-500 text-black font-black uppercase text-xs tracking-widest py-4 px-8 hover:bg-orange-400 hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] transition-all transform hover:scale-105 font-sigher"
          >
            <span>{isEs ? 'REGISTRARME COMO PARTNER' : 'REGISTER AS PARTNER'}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>

    </div>
  );
}
