import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const USER_MP_PUBLIC_KEY = 'APP_USR-08d9d9e0-117e-42c9-9225-0658cd99a424';
const USER_MP_ACCESS_TOKEN = 'APP_USR-3957004131601630-081800-91959106186021086c02a3fd5d6055bb-1675360619';

export async function GET() {
  try {
    let settings = await prisma.storeSettings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: {
          id: 'default',
          mercadoPagoActive: true,
          mercadoPagoMode: 'production',
          mpPublicSandboxKey: USER_MP_PUBLIC_KEY,
          mpAccessSandboxToken: USER_MP_ACCESS_TOKEN,
          mpPublicProdKey: USER_MP_PUBLIC_KEY,
          mpAccessProdToken: USER_MP_ACCESS_TOKEN,
          stripeActive: false,
          stripeMode: 'sandbox',
          stripePublishableKey: 'pk_test_51MockStripeKey123',
          stripeSecretKey: 'sk_test_51MockStripeSecret456',
          culqiActive: true,
          culqiPublicKey: process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY || 'pk_test_mock123',
          culqiSecretKey: process.env.CULQI_SECRET_KEY || 'sk_test_mock123',
          freeShippingThreshold: 200.0,
        },
      });
    } else {
      // Upsert/update with user's newly provided Mercado Pago credentials if they were still mock
      if (
        !settings.mpAccessProdToken ||
        settings.mpAccessProdToken.startsWith('APP_USR-87654321-PROD') ||
        settings.mpAccessSandboxToken?.startsWith('TEST-87654321')
      ) {
        settings = await prisma.storeSettings.update({
          where: { id: 'default' },
          data: {
            mercadoPagoActive: true,
            mercadoPagoMode: 'production',
            mpPublicSandboxKey: USER_MP_PUBLIC_KEY,
            mpAccessSandboxToken: USER_MP_ACCESS_TOKEN,
            mpPublicProdKey: USER_MP_PUBLIC_KEY,
            mpAccessProdToken: USER_MP_ACCESS_TOKEN,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      settings: {
        ...settings,
        freeShippingThreshold: Number(settings.freeShippingThreshold || 200.0),
      },
    });
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
        mercadoPagoMode: body.mercadoPagoMode || 'production',
        mpPublicSandboxKey: body.mpPublicSandboxKey || USER_MP_PUBLIC_KEY,
        mpAccessSandboxToken: body.mpAccessSandboxToken || USER_MP_ACCESS_TOKEN,
        mpPublicProdKey: body.mpPublicProdKey || USER_MP_PUBLIC_KEY,
        mpAccessProdToken: body.mpAccessProdToken || USER_MP_ACCESS_TOKEN,

        stripeActive: Boolean(body.stripeActive),
        stripeMode: body.stripeMode || 'sandbox',
        stripePublishableKey: body.stripePublishableKey,
        stripeSecretKey: body.stripeSecretKey,

        culqiActive: Boolean(body.culqiActive),
        culqiPublicKey: body.culqiPublicKey,
        culqiSecretKey: body.culqiSecretKey,

        freeShippingThreshold:
          body.freeShippingThreshold !== undefined ? Number(body.freeShippingThreshold) : 200.0,
      },
      create: {
        id: 'default',
        mercadoPagoActive: Boolean(body.mercadoPagoActive),
        mercadoPagoMode: body.mercadoPagoMode || 'production',
        mpPublicSandboxKey: body.mpPublicSandboxKey || USER_MP_PUBLIC_KEY,
        mpAccessSandboxToken: body.mpAccessSandboxToken || USER_MP_ACCESS_TOKEN,
        mpPublicProdKey: body.mpPublicProdKey || USER_MP_PUBLIC_KEY,
        mpAccessProdToken: body.mpAccessProdToken || USER_MP_ACCESS_TOKEN,

        stripeActive: Boolean(body.stripeActive),
        stripeMode: body.stripeMode || 'sandbox',
        stripePublishableKey: body.stripePublishableKey,
        stripeSecretKey: body.stripeSecretKey,

        culqiActive: Boolean(body.culqiActive),
        culqiPublicKey: body.culqiPublicKey,
        culqiSecretKey: body.culqiSecretKey,

        freeShippingThreshold:
          body.freeShippingThreshold !== undefined ? Number(body.freeShippingThreshold) : 200.0,
      },
    });

    return NextResponse.json({
      success: true,
      settings: {
        ...updatedSettings,
        freeShippingThreshold: Number(updatedSettings.freeShippingThreshold || 200.0),
      },
    });
  } catch (error) {
    console.error('Error saving store settings:', error);
    return NextResponse.json(
      { success: false, error: 'Could not save store settings' },
      { status: 500 }
    );
  }
}
