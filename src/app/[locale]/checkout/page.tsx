import React from 'react';
import { getDictionary } from '@/dictionaries';
import CheckoutClient from '@/components/CheckoutClient';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  
  return {
    title: isEs ? 'Checkout Seguro | GOSU®' : 'Secure Checkout | GOSU®',
    description: isEs 
      ? 'Finaliza tu pedido en GOSU®. Mercado Pago Perú y Culqi integrados.' 
      : 'Complete your order at GOSU® Official Store.',
  };
}

export default async function CheckoutPage({ params }: PageProps) {
  const { locale } = await params;
  const activeLocale = locale === 'en' ? 'en' : 'es';
  const dict = await getDictionary(activeLocale);

  return <CheckoutClient locale={activeLocale} dict={dict} />;
}
