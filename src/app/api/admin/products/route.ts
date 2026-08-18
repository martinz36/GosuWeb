import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Add new product with initial variant in Neon PostgreSQL
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nameEs, nameEn, descriptionEs, price, category, image, stock, colorsEs } = body;

    const nombre = nameEs || nameEn;
    if (!nombre || !price || !category || !image || stock === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required product information.' },
        { status: 400 }
      );
    }

    const slug = nombre
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') + '-' + Date.now().toString(36);

    const numPrice = parseFloat(price);
    const numStock = parseInt(stock);

    // Find category ID or match slug
    const cat = await prisma.categoria.findFirst({
      where: {
        OR: [{ id: category }, { slug: category }],
      },
    });

    const newProduct = await prisma.producto.create({
      data: {
        nombre: nombre,
        slug: slug,
        descripcion: descriptionEs || '',
        precioBase: numPrice,
        activo: true,
        imagenes: [image],
        categoriaId: cat?.id || null,
        variantes: {
          create: [
            {
              sku: `SKU-${slug.substring(0, 8).toUpperCase()}`,
              titulo: colorsEs || 'Estándar',
              precio: numPrice,
              stock: numStock,
              opciones: { color: colorsEs || 'Estándar' },
            },
          ],
        },
      },
    });

    return NextResponse.json({ success: true, slug: newProduct.slug });
  } catch (error) {
    console.error('Error creating product in Prisma:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

// Update existing product stock/price
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, price, stock } = body;

    if (!id || price === undefined || stock === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing product ID, price, or stock count.' },
        { status: 400 }
      );
    }

    const numPrice = parseFloat(price);
    const numStock = parseInt(stock);

    // Update product base price
    await prisma.producto.update({
      where: { id: id.toString() },
      data: {
        precioBase: numPrice,
      },
    });

    // Update variants stock & price
    const product = await prisma.producto.findUnique({
      where: { id: id.toString() },
      include: { variantes: true },
    });

    if (product && product.variantes.length > 0) {
      for (const variant of product.variantes) {
        await prisma.variante.update({
          where: { id: variant.id },
          data: {
            precio: numPrice,
            stock: numStock,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating product in Prisma:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

// Delete product
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing product ID parameter.' },
        { status: 400 }
      );
    }

    await prisma.producto.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product in Prisma:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}
