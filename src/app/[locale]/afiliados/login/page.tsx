'use client';

import React, { useState, useEffect } from 'react';
import AffiliateLoginClient from '@/components/AffiliateLoginClient';

export default function AffiliateLoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const [activeLocale, setActiveLocale] = useState('es');

  useEffect(() => {
    params.then((p) => setActiveLocale(p.locale || 'es'));
  }, [params]);

  return <AffiliateLoginClient locale={activeLocale} />;
}
