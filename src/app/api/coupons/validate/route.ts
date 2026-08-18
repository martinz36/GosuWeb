import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Por favor ingresa un código válido.' },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    // 1. Check Coupon in Cupon table
    const coupon = await prisma.cupon.findUnique({
      where: { codigo: cleanCode },
    });

    if (coupon && coupon.activo) {
      // Check expiration date
      if (coupon.fechaExpiracion && new Date(coupon.fechaExpiracion) < new Date()) {
        return NextResponse.json(
          { success: false, error: 'Este cupón de descuento ha expirado.' },
          { status: 400 }
        );
      }

      // Check usage limit
      if (coupon.limiteUso && coupon.vecesUsado >= coupon.limiteUso) {
        return NextResponse.json(
          { success: false, error: 'Este cupón ha alcanzado su límite de usos.' },
          { status: 400 }
        );
      }

      const discountType = coupon.descuentoPorcentaje ? 'percentage' : 'fixed';
      const discountValue = coupon.descuentoPorcentaje
        ? Number(coupon.descuentoPorcentaje)
        : Number(coupon.descuentoMonto || 0);

      return NextResponse.json({
        success: true,
        type: 'coupon',
        code: coupon.codigo,
        discountType,
        discountValue,
        message: `Cupón "${coupon.codigo}" aplicado con éxito.`,
      });
    }

    // 2. Check Affiliate in Affiliate table
    const affiliate = await prisma.affiliate.findUnique({
      where: { code: cleanCode },
    });

    if (affiliate && affiliate.status === 'aprobado') {
      const discountValue = 10; // Default 10% discount for affiliate referral code users

      return NextResponse.json({
        success: true,
        type: 'affiliate',
        code: affiliate.code,
        discountType: 'percentage',
        discountValue: discountValue,
        affiliateName: affiliate.name,
        message: `¡Código de Afiliado de ${affiliate.name} aplicado! 10% de descuento.`,
      });
    }

    return NextResponse.json(
      { success: false, error: 'El código de descuento o de afiliado no es válido o ha expirado.' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error validating coupon/affiliate code:', error);
    return NextResponse.json(
      { success: false, error: 'Error al validar el código.' },
      { status: 500 }
    );
  }
}
