'use client';

import React, { useState, useEffect } from 'react';
import AdminCategoriesClient from '@/components/AdminCategoriesClient';

export default function AdminCategoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const [activeLocale, setActiveLocale] = useState('es');

  useEffect(() => {
    params.then((p) => setActiveLocale(p.locale || 'es'));
  }, [params]);

  return <AdminCategoriesClient locale={activeLocale} />;
}
