'use client';

import React, { useState, useEffect } from 'react';
import AdminComingSoon from '@/components/AdminComingSoon';

export default function AdminSettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const [activeLocale, setActiveLocale] = useState('es');

  useEffect(() => {
    params.then((p) => setActiveLocale(p.locale || 'es'));
  }, [params]);

  return (
    <AdminComingSoon
      locale={activeLocale}
      title="Configuración de la Tienda"
      subtitle="Ajustes de pasarela de pago Culqi, envíos, metadatos SEO globales y usuarios administradores"
      sectionName="Configuración"
    />
  );
}
