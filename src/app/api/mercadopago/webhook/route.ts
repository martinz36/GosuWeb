import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic') || searchParams.get('type');
    const paymentId = searchParams.get('data.id') || searchParams.get('id');

    if (topic === 'payment' && paymentId) {
      // 1. Fetch credentials from StoreSettings
      const settings = await prisma.storeSettings.findUnique({
        where: { id: 'default' },
      });

      const accessToken =
        settings?.mercadoPagoMode === 'production'
          ? settings?.mpAccessProdToken || process.env.MP_ACCESS_TOKEN
          : settings?.mpAccessSandboxToken || process.env.MP_ACCESS_TOKEN;

      if (!accessToken) {
        return NextResponse.json({ success: false, error: 'Access token not configured' }, { status: 400 });
      }

      // 2. Fetch Payment details from Mercado Pago API
      const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const paymentData = await mpRes.json();

      if (mpRes.ok && paymentData.status === 'approved') {
        const extRef = paymentData.external_reference
          ? JSON.parse(paymentData.external_reference)
          : null;

        if (extRef) {
          const { email, name, phone, address, total, refCode, items } = extRef;

          // Check if order already exists to prevent duplicate processing
          const existingOrder = await prisma.orden.findFirst({
            where: {
              datosEnvio: {
                path: ['paymentId'],
                equals: String(paymentId),
              },
            },
          });

          if (!existingOrder) {
            // --- A. Create Order in Neon DB ---
            const newOrden = await prisma.orden.create({
              data: {
                clienteEmail: email,
                total: total,
                estadoPago: 'pagado',
                estadoEnvio: 'procesando',
                datosEnvio: {
                  nombre: name,
                  telefono: phone,
                  direccion: address,
                  paymentId: String(paymentId),
                  refCode: refCode || null,
                  gateway: 'Mercado Pago Perú',
                },
                items: {
                  create: (items || []).map((item: any) => ({
                    cantidad: item.quantity,
                    precioUnitario: item.price,
                    varianteId: item.variantId || '',
                  })),
                },
              },
            });

            // --- B. Decrement Product Variant Stock ---
            if (items && items.length > 0) {
              for (const item of items) {
                if (item.variantId) {
                  try {
                    await prisma.variante.update({
                      where: { id: item.variantId },
                      data: {
                        stock: { decrement: item.quantity },
                      },
                    });
                  } catch (e) {
                    console.error(`Failed to decrement stock for variant ${item.variantId}:`, e);
                  }
                }
              }
            }

            // --- C. Register Affiliate Referral Commission ---
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

                  // Insert ReferralSale record
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
                console.error('Error processing affiliate commission in Webhook:', affErr);
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mercado Pago Webhook error:', error);
    return NextResponse.json({ success: false, error: 'Webhook handler error' }, { status: 500 });
  }
}
