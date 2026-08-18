'use client';

import React, { useState, useEffect } from 'react';
import AdminComingSoon from '@/components/AdminComingSoon';

export default function AdminCustomersPage({ params }: { params: Promise<{ locale: string }> }) {
  const [activeLocale, setActiveLocale] = useState('es');

  useEffect(() => {
    params.then((p) => setActiveLocale(p.locale || 'es'));
  }, [params]);

  return (
    <AdminComingSoon
      locale={activeLocale}
      title="Gestión de Clientes"
      subtitle="Base de datos de compradores, historial de pedidos y valor de vida del cliente (CLV)"
      sectionName="Clientes"
    />
  );
}
