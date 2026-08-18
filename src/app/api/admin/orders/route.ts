import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const rawOrders = await prisma.orden.findMany({
      include: {
        items: {
          include: {
            variante: {
              include: {
                producto: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const orders = rawOrders.map((o) => {
      const datos: any = o.datosEnvio || {};
      return {
        id: `#ORD-${o.numeroOrden}`,
        customerName: datos.nombre || o.clienteEmail,
        customerEmail: o.clienteEmail,
        customerPhone: datos.telefono || '',
        shippingAddress: datos.direccion || '',
        total: Number(o.total),
        status: o.estadoPago,
        paymentId: datos.paymentId || 'N/A',
        createdAt: o.createdAt.getTime(),
      };
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching admin orders via Prisma:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}
