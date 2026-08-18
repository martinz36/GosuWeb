import React from 'react';
import { prisma } from '@/lib/prisma';
import ProductoDetalleClient from '@/components/ProductoDetalleClient';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function ProductoDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const activeLocale = locale === 'en' ? 'en' : 'es';

  let rawProducto: any = null;

  try {
    rawProducto = await prisma.producto.findUnique({
      where: { slug: slug },
      include: {
        categoria: true,
        variantes: {
          orderBy: { precio: 'asc' },
        },
      },
    });
  } catch (error) {
    console.error(`Error querying product by slug '${slug}' from Neon:`, error);
  }

  if (!rawProducto) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h1 className="text-3xl font-black font-sigher uppercase text-rose-500">
          {activeLocale === 'es' ? 'Producto No Encontrado' : 'Product Not Found'}
        </h1>
        <p className="text-sm text-zinc-400 max-w-md">
          {activeLocale === 'es'
            ? `El producto con la ruta "${slug}" no existe o fue retirado del catálogo.`
            : `The requested product "${slug}" does not exist in our catalog.`}
        </p>
        <Link
          href={`/${activeLocale}/productos`}
          className="rounded-full bg-white text-black font-bold uppercase text-xs px-6 py-3 hover:bg-[#00e8ff] transition-all"
        >
          {activeLocale === 'es' ? 'Volver al Catálogo' : 'Back to Catalog'}
        </Link>
      </div>
    );
  }

  // Convert Prisma Decimal values to standard numbers for React serialization
  const producto = {
    ...rawProducto,
    precioBase: Number(rawProducto.precioBase),
    variantes: rawProducto.variantes.map((v: any) => ({
      ...v,
      precio: Number(v.precio),
    })),
  };

  return (
    <ProductoDetalleClient
      producto={producto}
      locale={activeLocale}
    />
  );
}
