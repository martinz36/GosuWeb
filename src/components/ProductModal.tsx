'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

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

export interface DetailedProduct {
  id: string | number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  precioBase: number;
  activo?: boolean;
  imagenes: string[];
  categoria?: Categoria | null;
  variantes?: Variante[];
  selectedSizeTitle?: string;
  // Backwards compatibility fields
  nameEs?: string;
  nameEn?: string;
  descriptionEs?: string;
  descriptionEn?: string;
  price?: number;
  image?: string;
  category?: string;
  stock?: number;
  colorsEs?: string | null;
  colorsEn?: string | null;
  detailsEs?: string | null;
  detailsEn?: string | null;
}

interface ProductModalProps {
  category?: string | null;
  product?: DetailedProduct | null;
  onClose: () => void;
  locale: 'es' | 'en';
  dict: any;
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

export default function ProductModal({ category, product, onClose, locale, dict }: ProductModalProps) {
  const { addToCart } = useCart();
  const isEs = locale === 'es';

  // Category products list if category mode
  const [productsList, setProductsList] = useState<DetailedProduct[]>([]);
  const [loading, setLoading] = useState(false);

  // Single Product Detail States
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<Variante | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColors, setSelectedColors] = useState<Record<string | number, string>>({});

  // Active target product
  const [activeSingleProduct, setActiveSingleProduct] = useState<DetailedProduct | null>(product || null);

  useEffect(() => {
    if (product) {
      setActiveSingleProduct(product);
      if (product.variantes && product.variantes.length > 0) {
        setSelectedVariant(product.variantes[0]);
      } else {
        setSelectedVariant(null);
      }
      setQuantity(1);
      setActiveImageIndex(0);
    }
  }, [product]);

  useEffect(() => {
    if (!category || product) return;

    setLoading(true);
    fetch(`/api/products?category=${category}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProductsList(data.products || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching modal products:', err);
        setLoading(false);
      });
  }, [category, product]);

  if (!category && !activeSingleProduct) return null;

  // Single Product Add To Cart -> Adds item, closes modal, returns to catalog!
  const handleSingleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!activeSingleProduct) return;

    const baseName = isEs ? (activeSingleProduct.nombre || activeSingleProduct.nameEs) : (activeSingleProduct.nombre || activeSingleProduct.nameEn);
    const sizeSuffix = activeSingleProduct.selectedSizeTitle ? ` (${activeSingleProduct.selectedSizeTitle})` : '';
    const fullProdName = (baseName || 'Producto GOSU') + sizeSuffix;

    const price = selectedVariant ? Number(selectedVariant.precio) : Number(activeSingleProduct.precioBase || activeSingleProduct.price || 15);
    const rawImg = activeSingleProduct.imagenes?.[activeImageIndex] || activeSingleProduct.image || '/assets/images/image-4f57375b.jpg';
    const img = sanitizeImgUrl(rawImg);
    const stock = selectedVariant ? selectedVariant.stock : (activeSingleProduct.stock || 150);

    addToCart(
      {
        cartItemId: `${activeSingleProduct.id}-${selectedVariant?.id || activeSingleProduct.selectedSizeTitle || 'default'}`,
        productId: activeSingleProduct.id,
        variantId: selectedVariant?.id,
        variantTitle: selectedVariant?.titulo || activeSingleProduct.selectedSizeTitle,
        sku: selectedVariant?.sku,
        slug: activeSingleProduct.slug,
        name: fullProdName,
        price: price,
        image: img,
        stock: stock,
      },
      quantity,
      false // Do NOT auto-open drawer, close modal immediately to show catalog!
    );

    onClose();
  };

  const getCategoryTitle = () => {
    if (category === 'board-sleeves') return isEs ? 'Fundas para Juegos de Mesa' : 'Board Game Sleeves';
    if (category === 'tcg-sleeves') return isEs ? 'Sleeves TCG Matte' : 'TCG Matte Sleeves';
    if (category === 'inner-over') return isEs ? 'Inner & Over Sleeves' : 'Inner & Over Sleeves';
    if (category === 'binders') return isEs ? 'Carpetas Premium (Binders)' : 'Premium Binders';
    if (category === 'deckboxes') return isEs ? 'Cajas Portamazos (Deck Boxes)' : 'Premium Deck Boxes';
    return isEs ? 'Información del Producto' : 'Product Details';
  };

  return (
    <div data-modal-container="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Soft translucent backdrop */}
      <div 
        data-modal-container="true"
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />

      {/* Pop-up Container */}
      <div data-modal-container="true" className="relative z-10 w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl border border-zinc-800 bg-zinc-950/95 text-white shadow-[0_0_50px_rgba(0,0,0,0.8)] p-6 sm:p-8 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 z-20 rounded-full p-2.5 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 transition-colors"
          title={isEs ? 'Cerrar' : 'Close'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* --- SINGLE PRODUCT POP-UP DETAIL --- */}
        {activeSingleProduct ? (
          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              {/* Left Column: Sleeve Pack Image */}
              <div className="space-y-3">
                <div className="relative aspect-square w-full rounded-2xl border border-zinc-900 bg-zinc-950 p-4 flex items-center justify-center overflow-hidden">
                  <Image
                    src={sanitizeImgUrl(
                      activeSingleProduct.imagenes?.[activeImageIndex] ||
                      activeSingleProduct.image ||
                      '/assets/images/image-4f57375b.jpg'
                    )}
                    alt={activeSingleProduct.nombre || 'Producto GOSU'}
                    fill
                    className="object-contain p-2"
                  />
                </div>

                {/* Thumbnails if multiple images */}
                {activeSingleProduct.imagenes && activeSingleProduct.imagenes.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 justify-center">
                    {activeSingleProduct.imagenes.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex(idx);
                        }}
                        className={`relative h-14 w-14 flex-shrink-0 rounded-xl border bg-zinc-950 p-1 transition-all ${
                          activeImageIndex === idx
                            ? 'border-[#00e8ff] shadow-[0_0_10px_rgba(0,232,255,0.4)]'
                            : 'border-zinc-900 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <Image src={sanitizeImgUrl(img)} alt="thumb" fill className="object-contain" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Title, Specs, Price, Stock & Add to Cart */}
              <div className="space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="bg-zinc-900 text-[#00e8ff] text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-zinc-800">
                      GOSU® ACCESSORIES
                    </span>
                    {activeSingleProduct.selectedSizeTitle && (
                      <span className="bg-zinc-900 text-pink-400 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-zinc-800">
                        {activeSingleProduct.selectedSizeTitle}
                      </span>
                    )}
                  </div>
                  
                  <h2 className="text-xl sm:text-2xl font-black uppercase font-sigher tracking-wider text-white">
                    {activeSingleProduct.nombre || activeSingleProduct.nameEs}
                  </h2>

                  {/* Real-time Price & Stock Display */}
                  <div className="flex items-baseline gap-3 mt-3">
                    <span className="text-3xl font-black text-white font-sigher glow-cyan">
                      S/. {(selectedVariant ? Number(selectedVariant.precio) : Number(activeSingleProduct.precioBase || activeSingleProduct.price || 15)).toFixed(2)}
                    </span>

                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border bg-emerald-950/40 text-emerald-400 border-emerald-900/60">
                      {isEs ? 'En Stock' : 'In Stock'}: {selectedVariant ? selectedVariant.stock : (activeSingleProduct.stock || 150)} u.
                    </span>
                  </div>
                </div>

                {/* Specifications Bullets */}
                <div className="border-t border-b border-zinc-900 py-3 space-y-1.5 text-xs text-zinc-300">
                  <div className="flex items-center gap-2 font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00e8ff]" />
                    {isEs ? 'Paquete de 102 unidades por pack' : '102 PCS per pack'}
                  </div>
                  <div className="flex items-center gap-2 font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00e8ff]" />
                    {isEs ? '100 micras de grosor ultra resistente' : '100 microns thickness'}
                  </div>
                  <div className="flex items-center gap-2 font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00e8ff]" />
                    ACID & PVC FREE (Libres de Ácido y PVC)
                  </div>
                </div>

                {/* Variants Selection (if variants exist) */}
                {activeSingleProduct.variantes && activeSingleProduct.variantes.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
                      {isEs ? 'Seleccionar Variante / Color:' : 'Select Variant:'}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {activeSingleProduct.variantes.map((variant) => {
                        const isSelected = selectedVariant?.id === variant.id;
                        return (
                          <button
                            key={variant.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedVariant(variant);
                              setQuantity(1);
                            }}
                            className={`text-xs px-3 py-1.5 rounded-xl font-bold border transition-all ${
                              isSelected
                                ? 'bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                                : 'bg-black text-zinc-300 border-zinc-850 hover:border-zinc-700'
                            }`}
                          >
                            {variant.titulo} (S/. {Number(variant.precio).toFixed(2)})
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity Controls & Add to Cart */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-zinc-800 rounded-xl bg-black px-2 py-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuantity((q) => Math.max(1, q - 1));
                        }}
                        className="px-2.5 py-1 text-zinc-400 hover:text-white text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-bold text-white">{quantity}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuantity((q) => Math.min(selectedVariant?.stock || 150, q + 1));
                        }}
                        className="px-2.5 py-1 text-zinc-400 hover:text-white text-xs font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* Add to cart button */}
                    <button
                      onClick={handleSingleAddToCart}
                      className="flex-1 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-widest py-3.5 px-6 hover:bg-[#00e8ff] hover:shadow-[0_0_20px_rgba(0,232,255,0.4)] transition-all"
                    >
                      {dict?.cart?.add || 'AGREGAR AL CARRITO'}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ) : (
          /* --- CATEGORY PRODUCTS LIST --- */
          <>
            <div className="border-b border-zinc-900 pb-4 mb-6">
              <h2 className="text-xl sm:text-2xl font-black uppercase font-sigher tracking-wider text-white glow-cyan">
                {getCategoryTitle()}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
              {loading ? (
                <div className="flex h-64 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent border-white" />
                </div>
              ) : productsList.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center text-zinc-500">
                  <p className="text-sm font-medium">{isEs ? 'No se encontraron productos.' : 'No products found.'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                  {productsList.map((item) => {
                    const name = isEs ? (item.nombre || item.nameEs) : (item.nombre || item.nameEn);
                    const desc = isEs ? (item.descripcion || item.descriptionEs) : (item.descripcion || item.descriptionEn);
                    const price = Number(item.precioBase || item.price || 15);
                    const img = sanitizeImgUrl(item.imagenes?.[0] || item.image || '/assets/images/image-4f57375b.jpg');

                    return (
                      <div 
                        key={item.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSingleProduct(item);
                        }}
                        className="flex gap-4 p-4 rounded-2xl border border-zinc-900 bg-zinc-950/60 card-glass cursor-pointer hover:border-zinc-700 transition-all group"
                      >
                        <div className="relative h-24 w-24 flex-shrink-0 bg-zinc-950 rounded-xl border border-zinc-900 overflow-hidden flex items-center justify-center p-2">
                          <Image 
                            src={img} 
                            alt={name || 'GOSU Product'} 
                            fill 
                            className="object-contain p-1 group-hover:scale-105 transition-transform"
                          />
                        </div>

                        <div className="flex flex-1 flex-col justify-between space-y-2">
                          <div className="space-y-1">
                            <h3 className="text-sm font-bold text-white uppercase font-opensauce line-clamp-1 group-hover:text-[#00e8ff]">
                              {name}
                            </h3>
                            <p className="text-zinc-500 text-[10px] line-clamp-2 leading-relaxed">
                              {desc}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-zinc-900 mt-2">
                            <span className="text-md font-bold text-white font-sigher">
                              S/. {price.toFixed(2)}
                            </span>
                            
                            <span className="rounded-full bg-white text-black text-[9px] tracking-wider font-extrabold uppercase py-1.5 px-3 group-hover:bg-[#00e8ff] transition-all">
                              {isEs ? 'Ver Información' : 'View Details'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
