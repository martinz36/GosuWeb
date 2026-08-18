'use client';

import React, { useState, useEffect } from 'react';
import AdminAffiliatesClient from '@/components/AdminAffiliatesClient';

export default function AdminAffiliatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const [activeLocale, setActiveLocale] = useState('es');

  useEffect(() => {
    params.then((p) => setActiveLocale(p.locale || 'es'));
  }, [params]);

  return <AdminAffiliatesClient locale={activeLocale} />;
}
