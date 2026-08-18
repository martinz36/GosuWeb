'use client';

import React, { useState, useEffect } from 'react';
import AdminSettingsClient from '@/components/AdminSettingsClient';

export default function AdminSettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const [activeLocale, setActiveLocale] = useState('es');

  useEffect(() => {
    params.then((p) => setActiveLocale(p.locale || 'es'));
  }, [params]);

  return <AdminSettingsClient locale={activeLocale} />;
}
