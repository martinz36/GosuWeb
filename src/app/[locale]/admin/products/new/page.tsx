'use client';

import React, { useState, useEffect } from 'react';
import ProductFormClient from '@/components/ProductFormClient';

export default function AdminNewProductPage({ params }: { params: Promise<{ locale: string }> }) {
  const [activeLocale, setActiveLocale] = useState('es');

  useEffect(() => {
    params.then((p) => setActiveLocale(p.locale || 'es'));
  }, [params]);

  return <ProductFormClient locale={activeLocale} isEdit={false} />;
}
