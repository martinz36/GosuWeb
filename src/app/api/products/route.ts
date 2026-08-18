import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let whereCondition: any = { activo: true };
    if (category) {
      whereCondition = {
        activo: true,
        OR: [
          { categoriaId: category },
          { categoria: { slug: category } },
        ],
      };
    }

    const rawProducts = await prisma.producto.findMany({
      where: whereCondition,
      include: {
        categoria: true,
        variantes: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const products = rawProducts.map((p) => ({
      ...p,
      precioBase: Number(p.precioBase),
      // Backwards compatibility fields for UI components
      nameEs: p.nombre,
      nameEn: p.nombre,
      descriptionEs: p.descripcion || '',
      descriptionEn: p.descripcion || '',
      price: Number(p.precioBase),
      image: p.imagenes[0] || '/assets/images/image-113ac3f9.png',
      category: p.categoria?.slug || 'tcg-sleeves',
      stock: p.variantes.reduce((sum, v) => sum + v.stock, 0),
      colorsEs: p.variantes.map((v) => v.titulo).join(', '),
      colorsEn: p.variantes.map((v) => v.titulo).join(', '),
      detailsEs: p.descripcion || '',
      detailsEn: p.descripcion || '',
      variantes: p.variantes.map((v) => ({
        ...v,
        precio: Number(v.precio),
      })),
    }));

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products API:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}
