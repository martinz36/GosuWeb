import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Initial default seed zones if database is empty
const INITIAL_ZONES = [
  { countryCode: 'PE', region: 'Lima', rate: 12.0, currency: 'PEN', estimatedDays: '24 a 48 horas hábiles' },
  { countryCode: 'PE', region: 'Provincias', rate: 20.0, currency: 'PEN', estimatedDays: '3 a 5 días hábiles' },
  { countryCode: 'MX', region: 'Todas las Regiones', rate: 45.0, currency: 'PEN', estimatedDays: '5 a 7 días hábiles' },
  { countryCode: 'CL', region: 'Todas las Regiones', rate: 45.0, currency: 'PEN', estimatedDays: '5 a 7 días hábiles' },
  { countryCode: 'CR', region: 'Todas las Regiones', rate: 45.0, currency: 'PEN', estimatedDays: '5 a 7 días hábiles' },
];

export async function GET() {
  try {
    let zones = await prisma.shippingZone.findMany({
      orderBy: [{ countryCode: 'asc' }, { region: 'asc' }],
    });

    // Seed default zones if empty
    if (zones.length === 0) {
      for (const z of INITIAL_ZONES) {
        await prisma.shippingZone.create({
          data: {
            countryCode: z.countryCode,
            region: z.region,
            rate: z.rate,
            currency: z.currency,
            estimatedDays: z.estimatedDays,
          },
        });
      }

      zones = await prisma.shippingZone.findMany({
        orderBy: [{ countryCode: 'asc' }, { region: 'asc' }],
      });
    }

    // Format Decimal rate to Number
    const formattedZones = zones.map((z) => ({
      id: z.id,
      countryCode: z.countryCode,
      region: z.region,
      rate: Number(z.rate),
      currency: z.currency,
      estimatedDays: z.estimatedDays,
    }));

    return NextResponse.json({ success: true, shippingZones: formattedZones });
  } catch (error) {
    console.error('Error fetching shipping zones:', error);
    return NextResponse.json(
      { success: false, error: 'Error al consultar zonas de envío' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { countryCode, region, rate, currency, estimatedDays } = body;

    if (!countryCode || rate === undefined) {
      return NextResponse.json(
        { success: false, error: 'Faltan datos obligatorios para crear la zona de envío.' },
        { status: 400 }
      );
    }

    const newZone = await prisma.shippingZone.create({
      data: {
        countryCode: countryCode.toUpperCase(),
        region: region || 'Todas las Regiones',
        rate: Number(rate),
        currency: currency || 'PEN',
        estimatedDays: estimatedDays || '3 a 5 días hábiles',
      },
    });

    return NextResponse.json({
      success: true,
      shippingZone: {
        ...newZone,
        rate: Number(newZone.rate),
      },
    });
  } catch (error) {
    console.error('Error creating shipping zone:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear zona de envío' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, countryCode, region, rate, currency, estimatedDays } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de la zona de envío es requerido.' },
        { status: 400 }
      );
    }

    const updatedZone = await prisma.shippingZone.update({
      where: { id },
      data: {
        countryCode: countryCode ? countryCode.toUpperCase() : undefined,
        region: region,
        rate: rate !== undefined ? Number(rate) : undefined,
        currency: currency,
        estimatedDays: estimatedDays,
      },
    });

    return NextResponse.json({
      success: true,
      shippingZone: {
        ...updatedZone,
        rate: Number(updatedZone.rate),
      },
    });
  } catch (error) {
    console.error('Error updating shipping zone:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar zona de envío' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de la zona de envío es requerido para eliminar.' },
        { status: 400 }
      );
    }

    await prisma.shippingZone.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Zona de envío eliminada correctamente.' });
  } catch (error) {
    console.error('Error deleting shipping zone:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar zona de envío' },
      { status: 500 }
    );
  }
}
