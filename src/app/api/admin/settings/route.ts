import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let settings = await prisma.storeSettings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: {
          id: 'default',
          mercadoPagoActive: false,
          mercadoPagoMode: 'sandbox',
          mpPublicSandboxKey: 'TEST-12345678-ABCD-EFGH',
          mpAccessSandboxToken: 'TEST-87654321-DCBA-HGFE',
          mpPublicProdKey: 'APP_USR-12345678-PROD',
          mpAccessProdToken: 'APP_USR-87654321-PROD',
          stripeActive: false,
          stripeMode: 'sandbox',
          stripePublishableKey: 'pk_test_51MockStripeKey123',
          stripeSecretKey: 'sk_test_51MockStripeSecret456',
          culqiActive: true,
          culqiPublicKey: process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY || 'pk_test_mock123',
          culqiSecretKey: process.env.CULQI_SECRET_KEY || 'sk_test_mock123',
        },
      });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, error: 'Could not fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const updatedSettings = await prisma.storeSettings.upsert({
      where: { id: 'default' },
      update: {
        mercadoPagoActive: Boolean(body.mercadoPagoActive),
        mercadoPagoMode: body.mercadoPagoMode || 'sandbox',
        mpPublicSandboxKey: body.mpPublicSandboxKey,
        mpAccessSandboxToken: body.mpAccessSandboxToken,
        mpPublicProdKey: body.mpPublicProdKey,
        mpAccessProdToken: body.mpAccessProdToken,

        stripeActive: Boolean(body.stripeActive),
        stripeMode: body.stripeMode || 'sandbox',
        stripePublishableKey: body.stripePublishableKey,
        stripeSecretKey: body.stripeSecretKey,

        culqiActive: Boolean(body.culqiActive),
        culqiPublicKey: body.culqiPublicKey,
        culqiSecretKey: body.culqiSecretKey,
      },
      create: {
        id: 'default',
        mercadoPagoActive: Boolean(body.mercadoPagoActive),
        mercadoPagoMode: body.mercadoPagoMode || 'sandbox',
        mpPublicSandboxKey: body.mpPublicSandboxKey,
        mpAccessSandboxToken: body.mpAccessSandboxToken,
        mpPublicProdKey: body.mpPublicProdKey,
        mpAccessProdToken: body.mpAccessProdToken,

        stripeActive: Boolean(body.stripeActive),
        stripeMode: body.stripeMode || 'sandbox',
        stripePublishableKey: body.stripePublishableKey,
        stripeSecretKey: body.stripeSecretKey,

        culqiActive: Boolean(body.culqiActive),
        culqiPublicKey: body.culqiPublicKey,
        culqiSecretKey: body.culqiSecretKey,
      },
    });

    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch (error) {
    console.error('Error saving store settings:', error);
    return NextResponse.json(
      { success: false, error: 'Could not save store settings' },
      { status: 500 }
    );
  }
}
