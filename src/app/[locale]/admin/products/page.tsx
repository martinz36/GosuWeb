'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';

interface Product {
  id: number;
  slug: string;
  nameEs: string;
  nameEn: string;
  descriptionEs: string;
  descriptionEn: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  colorsEs: string | null;
  colorsEn: string | null;
  detailsEs: string | null;
  detailsEn: string | null;
}

export default function AdminProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const [activeLocale, setActiveLocale] = useState('es');
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit states for price/stock inline quick edit
  const [editingProduct, setEditingProduct] = useState<Record<number, { price: string; stock: string }>>({});

  useEffect(() => {
    params.then((p) => setActiveLocale(p.locale || 'es'));
  }, [params]);

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const prodRes = await fetch('/api/products');
      const prodData = await prodRes.json();
      if (prodData.success) {
        setProductsList(prodData.products || []);
        
        const editMap: Record<number, { price: string; stock: string }> = {};
        prodData.products.forEach((p: Product) => {
          editMap[p.id] = { price: p.price.toString(), stock: p.stock.toString() };
        });
        setEditingProduct(editMap);
      }
    } catch (error) {
      console.error('Error fetching admin products data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveEdit = async (productId: number) => {
    const editState = editingProduct[productId];
    if (!editState) return;

    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: productId,
          price: parseFloat(editState.price),
          stock: parseInt(editState.stock),
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Inventario actualizado con éxito.');
        fetchData();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error al actualizar producto.');
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('¿Estás seguro de eliminar este producto del catálogo?')) return;

    try {
      const res = await fetch(`/api/admin/products?id=${productId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        alert('Producto eliminado con éxito.');
        fetchData();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error al conectar con la base de datos.');
    }
  };

  const handleEditChange = (productId: number, field: 'price' | 'stock', value: string) => {
    setEditingProduct((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      
      {/* Shopify-style Admin Sidebar */}
      <AdminSidebar locale={activeLocale} />

      {/* Main Products Module Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header Action Row */}
          <div className="flex items-center justify-between border-b border-zinc-900 pb-5">
            <div>
              <span className="inline-block bg-zinc-900 border border-zinc-800 text-[#00e8ff] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full font-opensauce mb-2">
                MÓDULO DE PRODUCTOS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase font-sigher tracking-wider text-white">
                Todos los productos
              </h2>
              <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1 font-inter">
                Gestión completa de catálogo, precios, variantes y stock en tiempo real
              </p>
            </div>
            
            {/* Cargar Producto Button -> Navigates to full page form /admin/products/new */}
            <Link
              href={`/${activeLocale}/admin/products/new`}
              className="flex items-center gap-2 rounded-full bg-[#00e8ff] text-black font-extrabold uppercase text-xs px-5 py-2.5 hover:bg-white hover:shadow-[0_0_15px_rgba(0,232,255,0.4)] transition-all font-opensauce shadow-[0_0_12px_rgba(0,232,255,0.25)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>Cargar Producto</span>
            </Link>
          </div>

          {/* Products Table */}
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent border-[#00e8ff]" />
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-zinc-900 bg-zinc-950/40 font-opensauce">
              <table className="w-full border-collapse text-left text-sm text-zinc-400">
                <thead className="bg-zinc-950 text-[10px] uppercase font-bold tracking-wider text-zinc-500 border-b border-zinc-900">
                  <tr>
                    <th className="px-6 py-4">Foto</th>
                    <th className="px-6 py-4">Nombre (ES / EN)</th>
                    <th className="px-6 py-4">Categoría</th>
                    <th className="px-6 py-4">Precio (S/.)</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {productsList.map((product) => {
                    const editState = editingProduct[product.id] || { price: '0', stock: '0' };
                    
                    return (
                      <tr key={product.id} className="hover:bg-zinc-900/20 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="relative h-12 w-12 rounded-lg border border-zinc-850 bg-zinc-950 flex items-center justify-center p-1.5 overflow-hidden">
                            <Image
                              src={product.image}
                              alt={product.nameEs}
                              fill
                              className="object-contain"
                            />
                          </div>
                        </td>

                        <td className="px-6 py-4 max-w-xs">
                          <Link
                            href={`/${activeLocale}/admin/products/new`}
                            className="font-bold text-white text-xs uppercase line-clamp-1 hover:text-[#00e8ff] transition-colors"
                          >
                            {product.nameEs}
                          </Link>
                          <div className="text-[10px] text-zinc-500 uppercase tracking-wide mt-0.5">{product.nameEn}</div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-xs">
                          <span className="bg-zinc-900 text-zinc-300 border border-zinc-850 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold">
                            {product.category}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-zinc-500 font-bold">S/.</span>
                            <input
                              type="number"
                              step="0.01"
                              className="w-20 bg-black border border-zinc-800 rounded px-2 py-1 text-xs text-white text-right focus:outline-none focus:border-[#00e8ff]"
                              value={editState.price}
                              onChange={(e) => handleEditChange(product.id, 'price', e.target.value)}
                            />
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            className="w-16 bg-black border border-zinc-800 rounded px-2 py-1 text-xs text-white text-center focus:outline-none focus:border-[#00e8ff]"
                            value={editState.stock}
                            onChange={(e) => handleEditChange(product.id, 'stock', e.target.value)}
                          />
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              href={`/${activeLocale}/admin/products/new`}
                              className="rounded bg-zinc-900 border border-zinc-800 hover:border-[#00e8ff] text-[#00e8ff] text-[10px] font-bold uppercase px-3 py-1.5 transition-colors"
                            >
                              Editar
                            </Link>
                            <button
                              onClick={() => handleSaveEdit(product.id)}
                              className="rounded bg-zinc-900 border border-zinc-800 hover:border-white text-white text-[10px] font-bold uppercase px-3 py-1.5 transition-colors"
                            >
                              Rápido
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="rounded bg-red-950/40 border border-red-900/60 hover:bg-red-900 hover:border-red-500 text-red-400 hover:text-white text-[10px] font-bold uppercase px-3 py-1.5 transition-colors"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
