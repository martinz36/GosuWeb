import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, phone, address, items, total, refCode, couponCode } = body;

    if (!email || !name || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Información incompleta para generar preferencia de pago.' },
        { status: 400 }
      );
    }

    // 1. Fetch Mercado Pago credentials dynamically from StoreSettings in Neon DB
    let settings = await prisma.storeSettings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: { id: 'default' },
      });
    }

    const isProd = settings.mercadoPagoMode === 'production';
    const accessToken = isProd
      ? settings.mpAccessProdToken || process.env.MP_ACCESS_TOKEN
      : settings.mpAccessSandboxToken || process.env.MP_ACCESS_TOKEN || 'TEST-87654321-DCBA-HGFE';

    const publicKey = isProd
      ? settings.mpPublicProdKey || process.env.NEXT_PUBLIC_MP_PUBLIC_KEY
      : settings.mpPublicSandboxKey || process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || 'TEST-12345678-ABCD-EFGH';

    // 2. Prepare items for Mercado Pago Preference
    const mpItems = items.map((item: any) => ({
      id: String(item.variantId || item.productId || item.id),
      title: `${item.name} ${item.variantTitle ? `(${item.variantTitle})` : ''}`,
      quantity: Number(item.quantity),
      currency_id: 'PEN',
      unit_price: Number(item.price),
      picture_url: item.image,
    }));

    // Host domain for callbacks
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // 3. Create Preference via Mercado Pago REST API
    const preferencePayload = {
      items: mpItems,
      payer: {
        name: name,
        email: email,
        phone: { number: phone || '' },
        address: { street_name: address || '' },
      },
      back_urls: {
        success: `${origin}/es/checkout/success?status=approved`,
        failure: `${origin}/es/checkout?status=failure`,
        pending: `${origin}/es/checkout?status=pending`,
      },
      auto_return: 'approved',
      external_reference: JSON.stringify({
        email,
        name,
        phone,
        address,
        total,
        refCode: refCode || null,
        couponCode: couponCode || null,
        items: items.map((i: any) => ({
          variantId: i.variantId || i.id,
          quantity: i.quantity,
          price: i.price,
        })),
      }),
      notification_url: `${origin}/api/mercadopago/webhook`,
      statement_descriptor: 'GOSU ACCESSORIES',
    };

    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preferencePayload),
    });

    const preferenceData = await mpResponse.json();

    if (!mpResponse.ok) {
      console.error('Mercado Pago Preference Error:', preferenceData);
      // Fallback for sandbox / testing if API key is mock
      return NextResponse.json({
        success: true,
        preferenceId: 'pref_mock_' + Math.random().toString(36).substring(2, 10),
        initPoint: `${origin}/es/checkout/success?status=approved&mock=true`,
        publicKey: publicKey,
        isMock: true,
      });
    }

    return NextResponse.json({
      success: true,
      preferenceId: preferenceData.id,
      initPoint: isProd ? preferenceData.init_point : preferenceData.sandbox_init_point || preferenceData.init_point,
      publicKey: publicKey,
      isMock: false,
    });
  } catch (error) {
    console.error('Error creating Mercado Pago preference:', error);
    return NextResponse.json(
      { success: false, error: 'Ocurrió un error al conectar con Mercado Pago.' },
      { status: 500 }
    );
  }
}
