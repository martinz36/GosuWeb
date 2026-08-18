'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
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

  // Form states for creating a new product
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    nameEs: '',
    nameEn: '',
    descriptionEs: '',
    descriptionEn: '',
    price: '',
    category: 'tcg-sleeves',
    image: '/assets/images/image-113ac3f9.png',
    stock: '',
    colorsEs: '',
    colorsEn: '',
    detailsEs: '',
    detailsEn: '',
  });

  // Edit states for price/stock
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

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProduct.nameEs || !newProduct.nameEn || !newProduct.price || !newProduct.stock) {
      alert('Por favor completa los campos requeridos (Nombre, Precio y Stock).');
      return;
    }

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock),
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('¡Nuevo producto cargado en catálogo con éxito!');
        setShowAddForm(false);
        setNewProduct({
          nameEs: '',
          nameEn: '',
          descriptionEs: '',
          descriptionEn: '',
          price: '',
          category: 'tcg-sleeves',
          image: '/assets/images/image-113ac3f9.png',
          stock: '',
          colorsEs: '',
          colorsEn: '',
          detailsEs: '',
          detailsEn: '',
        });
        fetchData();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error al guardar producto.');
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
            
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 rounded-full bg-white text-black font-extrabold uppercase text-xs px-5 py-2.5 hover:bg-[#00e8ff] hover:shadow-[0_0_15px_rgba(0,232,255,0.4)] transition-all font-opensauce"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              {showAddForm ? 'Ocultar Formulario' : 'Cargar Producto'}
            </button>
          </div>

          {/* Create Product Form */}
          {showAddForm && (
            <form onSubmit={handleCreateProduct} className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950 space-y-4 animate-in slide-in-from-top-4 duration-200">
              <h3 className="text-md font-bold text-white uppercase tracking-wider border-b border-zinc-900 pb-2 font-opensauce">
                Detalles del nuevo producto
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold">Nombre (Español) *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.nameEs}
                    onChange={(e) => setNewProduct({ ...newProduct, nameEs: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#00e8ff]"
                    placeholder="Ej: Fundas TCG Matte - Azul Cobalto"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold">Nombre (Inglés) *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.nameEn}
                    onChange={(e) => setNewProduct({ ...newProduct, nameEn: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#00e8ff]"
                    placeholder="Ej: TCG Matte Sleeves - Cobalt Blue"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold">Descripción (Español)</label>
                  <textarea
                    rows={2}
                    value={newProduct.descriptionEs}
                    onChange={(e) => setNewProduct({ ...newProduct, descriptionEs: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#00e8ff]"
                    placeholder="Descripción breve..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold">Descripción (Inglés)</label>
                  <textarea
                    rows={2}
                    value={newProduct.descriptionEn}
                    onChange={(e) => setNewProduct({ ...newProduct, descriptionEn: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#00e8ff]"
                    placeholder="Short description..."
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 md:col-span-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold">Precio (S/.) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#00e8ff]"
                      placeholder="25.00"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold">Stock (Unidades) *</label>
                    <input
                      type="number"
                      required
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#00e8ff]"
                      placeholder="100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold">Categoría *</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00e8ff]"
                    >
                      <option value="board-sleeves">Board Game Sleeves</option>
                      <option value="tcg-sleeves">TCG Matte Sleeves</option>
                      <option value="inner-over">Inner / Over Sleeves</option>
                      <option value="binders">Premium Binders</option>
                      <option value="deckboxes">Deck Boxes</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold">Ruta de Imagen GOSU</label>
                  <select
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00e8ff]"
                  >
                    <option value="/assets/images/image-113ac3f9.png">Deckbox Premium (image-113ac3f9.png)</option>
                    <option value="/assets/images/image-3a743382.jpg">Binder Premium (image-3a743382.jpg)</option>
                    <option value="/assets/images/image-52e660c6.jpg">Sleeves TCG Estándar (image-52e660c6.jpg)</option>
                    <option value="/assets/images/image-d02d8bfe.jpg">Sleeves TCG Japonés (image-d02d8bfe.jpg)</option>
                    <option value="/assets/images/image-cbe9164e.png">Inner Sleeves (image-cbe9164e.png)</option>
                    <option value="/assets/images/image-f5e8b751.png">Over Sleeves (image-f5e8b751.png)</option>
                    <option value="/assets/images/image-4f57375b.jpg">Boardgame Sleeves (image-4f57375b.jpg)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold">Colores Disponibles</label>
                  <input
                    type="text"
                    value={newProduct.colorsEs}
                    onChange={(e) => setNewProduct({ ...newProduct, colorsEs: e.target.value, colorsEn: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#00e8ff]"
                    placeholder="Negro, Azul, Rojo"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#00e8ff] hover:bg-white text-black font-extrabold uppercase py-3 px-4 text-xs tracking-wider transition-all font-opensauce"
              >
                Guardar Producto en Base de Datos
              </button>
            </form>
          )}

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
                          <div className="font-bold text-white text-xs uppercase line-clamp-1">{product.nameEs}</div>
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
                            <button
                              onClick={() => handleSaveEdit(product.id)}
                              className="rounded bg-zinc-900 border border-zinc-800 hover:border-white text-white text-[10px] font-bold uppercase px-3 py-1.5 transition-colors"
                            >
                              Guardar
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
