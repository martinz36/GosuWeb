import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, email, name, phone, address, total, items, refCode } = body;

    if (!token || !email || !name || !phone || !address || !total || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required checkout information.' },
        { status: 400 }
      );
    }

    // --- 1. Stock Validation via Prisma ---
    const variantsToUpdate: Array<{ id: string; newStock: number }> = [];

    for (const item of items) {
      let variant = null;
      if (item.variantId) {
        variant = await prisma.variante.findUnique({ where: { id: item.variantId } });
      } else {
        const prod = await prisma.producto.findFirst({
          where: { id: item.productId || item.id },
          include: { variantes: true },
        });
        if (prod && prod.variantes.length > 0) {
          variant = prod.variantes[0];
        }
      }

      if (variant) {
        if (variant.stock < item.quantity) {
          return NextResponse.json(
            {
              success: false,
              error: `La variante "${variant.titulo}" no tiene suficiente stock disponible. (Solicitado: ${item.quantity}, Disponible: ${variant.stock})`,
            },
            { status: 400 }
          );
        }
        variantsToUpdate.push({
          id: variant.id,
          newStock: variant.stock - item.quantity,
        });
      }
    }

    // --- 2. Process Culqi Payment Charge ---
    let paymentId = 'chr_mock_' + Math.random().toString(36).substring(2, 12);
    let paymentStatus: 'pendiente' | 'pagado' | 'fallido' = 'pagado';

    const culqiSecretKey = process.env.CULQI_SECRET_KEY;

    if (culqiSecretKey && !culqiSecretKey.startsWith('sk_test_mock')) {
      try {
        const culqiResponse = await fetch('https://api.culqi.com/v2/charges', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${culqiSecretKey}`,
          },
          body: JSON.stringify({
            amount: Math.round(total * 100),
            currency_code: 'PEN',
            email: email,
            source_id: token,
          }),
        });

        const chargeResult = await culqiResponse.json();

        if (culqiResponse.ok && (chargeResult.object === 'charge' || chargeResult.outcome?.type === 'venta_exitosa')) {
          paymentId = chargeResult.id;
          paymentStatus = 'pagado';
        } else {
          return NextResponse.json(
            {
              success: false,
              error: chargeResult.user_message || chargeResult.merchant_message || 'Payment rejected by Culqi.',
            },
            { status: 400 }
          );
        }
      } catch (culqiError) {
        console.error('Error communicating with Culqi API:', culqiError);
        return NextResponse.json(
          { success: false, error: 'Could not connect to payment gateway.' },
          { status: 500 }
        );
      }
    }

    // --- 3. Create Order & Items in Neon via Prisma ---
    const newOrden = await prisma.orden.create({
      data: {
        clienteEmail: email,
        total: total,
        estadoPago: paymentStatus,
        estadoEnvio: 'procesando',
        datosEnvio: {
          nombre: name,
          telefono: phone,
          direccion: address,
          paymentId: paymentId,
          refCode: refCode || null,
        },
        items: {
          create: items.map((item: any) => ({
            cantidad: item.quantity,
            precioUnitario: item.price,
            varianteId: item.variantId || variantsToUpdate[0]?.id || '',
          })),
        },
      },
    });

    // --- 4. Decrement Stock on Variants ---
    for (const update of variantsToUpdate) {
      await prisma.variante.update({
        where: { id: update.id },
        data: { stock: update.newStock },
      });
    }

    // --- 5. Process Affiliate Referral Commission ---
    if (refCode) {
      try {
        const affiliate = await prisma.affiliate.findUnique({
          where: { code: refCode },
        });

        if (affiliate && affiliate.status === 'aprobado') {
          const rate = Number(affiliate.commissionRate) || 10;
          const commissionAmount = Number(total) * (rate / 100);

          // Update affiliate pending balance
          await prisma.affiliate.update({
            where: { id: affiliate.id },
            data: {
              balancePending: { increment: commissionAmount },
            },
          });

          // Record referral sale transaction
          await prisma.referralSale.create({
            data: {
              affiliateId: affiliate.id,
              orderId: newOrden.id,
              orderAmount: total,
              commission: commissionAmount,
              status: 'pending',
            },
          });
        }
      } catch (affErr) {
        console.error('Error processing affiliate commission:', affErr);
      }
    }

    // --- 6. Dispatch Order Confirmation Email via Resend ---
    try {
      await sendOrderConfirmationEmail({
        orderId: `#ORD-${newOrden.numeroOrden}`,
        customerName: name,
        customerEmail: email,
        shippingAddress: address,
        total: Number(total),
        items: (items || []).map((i: any) => ({
          name: i.name || 'Producto GOSU',
          variantTitle: i.variantTitle,
          quantity: i.quantity,
          price: Number(i.price),
        })),
      });
    } catch (emailErr) {
      console.error('Error sending confirmation email in checkout route:', emailErr);
    }

    return NextResponse.json({
      success: true,
      orderId: `#ORD-${newOrden.numeroOrden}`,
      paymentId: paymentId,
    });
  } catch (error) {
    console.error('Checkout error with Prisma:', error);
    return NextResponse.json(
      { success: false, error: 'An internal error occurred during checkout.' },
      { status: 500 }
    );
  }
}
