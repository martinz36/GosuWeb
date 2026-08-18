'use client';

import React, { useState, useEffect } from 'react';
import AdminCouponsClient from '@/components/AdminCouponsClient';

export default function AdminCouponsPage({ params }: { params: Promise<{ locale: string }> }) {
  const [activeLocale, setActiveLocale] = useState('es');

  useEffect(() => {
    params.then((p) => setActiveLocale(p.locale || 'es'));
  }, [params]);

  return <AdminCouponsClient locale={activeLocale} />;
}
