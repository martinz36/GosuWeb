'use client';

import React, { useState, useEffect } from 'react';
import AffiliateDashboardClient from '@/components/AffiliateDashboardClient';

export default function AffiliateDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const [activeLocale, setActiveLocale] = useState('es');

  useEffect(() => {
    params.then((p) => setActiveLocale(p.locale || 'es'));
  }, [params]);

  return <AffiliateDashboardClient locale={activeLocale} />;
}
