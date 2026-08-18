import React from 'react';
import { prisma } from '@/lib/prisma';
import ProductosCatalogClient from '@/components/ProductosCatalogClient';
import FramerPageRenderer from '@/components/FramerPageRenderer';
import { getDictionary } from '@/dictionaries';
import fs from 'fs';
import path from 'path';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function ProductosPage({ params }: PageProps) {
  const { locale } = await params;
  const activeLocale = locale === 'en' ? 'en' : 'es';
  const dict = await getDictionary(activeLocale);

  // Query products with relations from Neon PostgreSQL using Prisma
  let rawProductos: any[] = [];
  let rawCategorias: any[] = [];

  try {
    rawProductos = await prisma.producto.findMany({
      where: { activo: true },
      include: {
        categoria: true,
        variantes: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    rawCategorias = await prisma.categoria.findMany({
      orderBy: { nombre: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching Prisma products for catalog page:', error);
  }

  // Convert Decimal objects to standard numbers for client component serialization
  const productos = rawProductos.map((p) => ({
    ...p,
    precioBase: Number(p.precioBase),
    variantes: p.variantes.map((v: any) => ({
      ...v,
      precio: Number(v.precio),
    })),
  }));

  const categorias = rawCategorias.map((c) => ({
    ...c,
  }));

  return (
    <ProductosCatalogClient
      productos={productos}
      categorias={categorias}
      locale={activeLocale}
    />
  );
}
