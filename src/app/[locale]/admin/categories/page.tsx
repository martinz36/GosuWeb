'use client';

import React, { useState, useEffect } from 'react';
import AdminComingSoon from '@/components/AdminComingSoon';

export default function AdminCategoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const [activeLocale, setActiveLocale] = useState('es');

  useEffect(() => {
    params.then((p) => setActiveLocale(p.locale || 'es'));
  }, [params]);

  return (
    <AdminComingSoon
      locale={activeLocale}
      title="Colecciones & Categorías"
      subtitle="Organiza tus productos por tipo de juego, micras y colecciones especiales"
      sectionName="Colecciones / Categorías"
    />
  );
}
