import React from 'react';
import { getDictionary } from '@/dictionaries';
import { prisma } from '@/lib/prisma';
import ShopClientPage from '@/components/ShopClientPage';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  
  return {
    title: isEs ? 'Tienda Oficial GOSU® | Fundas & Accesorios TCG' : 'GOSU® Official Store | TCG Sleeves & Accessories',
    description: isEs 
      ? 'Tienda oficial de GOSU®. Fundas de 100 y 140 micras para juegos de mesa y TCG. Stock en tiempo real y despacho directo.' 
      : 'Official GOSU® Store. 100 & 140 micron protection sleeves for TCG and board games. Real-time stock.',
    keywords: ['gosu', 'sleeves', 'fundas juegos de mesa', 'tcg matte sleeves', 'binder', 'deckbox'],
  };
}

export default async function ShopPage({ params }: PageProps) {
  const { locale } = await params;
  const activeLocale = locale === 'en' ? 'en' : 'es';
  const dict = await getDictionary(activeLocale);

  // Query categories & active products with variants from Neon PostgreSQL via Prisma
  let categories: any[] = [];
  let rawProducts: any[] = [];

  try {
    categories = await prisma.categoria.findMany({
      orderBy: { nombre: 'asc' },
    });

    rawProducts = await prisma.producto.findMany({
      where: { activo: true },
      include: {
        categoria: true,
        variantes: {
          orderBy: { precio: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Error querying products from Prisma:', error);
  }

  // Format products for React client component serialization
  const products = rawProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    nombre: p.nombre,
    descripcion: p.descripcion || '',
    precioBase: Number(p.precioBase),
    imagenes: p.imagenes,
    categoria: p.categoria,
    variantes: p.variantes.map((v: any) => ({
      id: v.id,
      sku: v.sku,
      titulo: v.titulo,
      precio: Number(v.precio),
      stock: v.stock,
      opciones: v.opciones,
    })),
    stockTotal: p.variantes.reduce((sum: number, v: any) => sum + v.stock, 0),
    seoTitle: p.seoTitle,
    seoDescription: p.seoDescription,
    seoKeywords: p.seoKeywords,
  }));

  return (
    <ShopClientPage
      locale={activeLocale}
      dict={dict}
      categories={categories}
      products={products}
    />
  );
}
