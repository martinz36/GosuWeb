'use client';

import React, { useState, useEffect } from 'react';
import AdminCustomersClient from '@/components/AdminCustomersClient';

export default function AdminCustomersPage({ params }: { params: Promise<{ locale: string }> }) {
  const [activeLocale, setActiveLocale] = useState('es');

  useEffect(() => {
    params.then((p) => setActiveLocale(p.locale || 'es'));
  }, [params]);

  return <AdminCustomersClient locale={activeLocale} />;
}
