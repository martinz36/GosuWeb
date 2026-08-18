import React from 'react';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/dictionaries';
import { prisma } from '@/lib/prisma';
import ProductDetailClient from '@/components/ProductDetailClient';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const product = await prisma.producto.findUnique({
    where: { slug },
  });

  if (!product) {
    return { title: 'Producto no encontrado | GOSU®' };
  }

  return {
    title: product.seoTitle || `${product.nombre} | GOSU® Official Store`,
    description: product.seoDescription || product.descripcion || 'Producto de alta resistencia de GOSU® Accessories.',
    keywords: product.seoKeywords ? product.seoKeywords.split(',').map((k) => k.trim()) : undefined,
    openGraph: {
      title: product.seoTitle || product.nombre,
      description: product.seoDescription || product.descripcion || '',
      images: product.imagenes.length > 0 ? [{ url: product.imagenes[0] }] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const activeLocale = locale === 'en' ? 'en' : 'es';
  const dict = await getDictionary(activeLocale);

  const productData = await prisma.producto.findUnique({
    where: { slug },
    include: {
      categoria: true,
      variantes: {
        orderBy: { precio: 'asc' },
      },
    },
  });

  if (!productData || !productData.activo) {
    notFound();
  }

  // Fetch related products from same category
  const rawRelated = await prisma.producto.findMany({
    where: {
      categoriaId: productData.categoriaId,
      NOT: { id: productData.id },
      activo: true,
    },
    take: 4,
    include: {
      variantes: { orderBy: { precio: 'asc' } },
    },
  });

  const product = {
    id: productData.id,
    slug: productData.slug,
    nombre: productData.nombre,
    descripcion: productData.descripcion || '',
    precioBase: Number(productData.precioBase),
    imagenes: productData.imagenes,
    categoria: productData.categoria,
    variantes: productData.variantes.map((v) => ({
      id: v.id,
      sku: v.sku,
      titulo: v.titulo,
      precio: Number(v.precio),
      stock: v.stock,
      opciones: v.opciones,
    })),
    stockTotal: productData.variantes.reduce((sum, v) => sum + v.stock, 0),
    seoTitle: productData.seoTitle,
    seoDescription: productData.seoDescription,
    seoKeywords: productData.seoKeywords,
  };

  const relatedProducts = rawRelated.map((p) => ({
    id: p.id,
    slug: p.slug,
    nombre: p.nombre,
    descripcion: p.descripcion || '',
    precioBase: Number(p.precioBase),
    imagenes: p.imagenes,
    variantes: p.variantes.map((v) => ({
      id: v.id,
      sku: v.sku,
      titulo: v.titulo,
      precio: Number(v.precio),
      stock: v.stock,
    })),
    stockTotal: p.variantes.reduce((sum, v) => sum + v.stock, 0),
  }));

  return (
    <ProductDetailClient
      locale={activeLocale}
      dict={dict}
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
