'use client';

import React, { useState, useEffect } from 'react';
import AdminComingSoon from '@/components/AdminComingSoon';

export default function AdminCouponsPage({ params }: { params: Promise<{ locale: string }> }) {
  const [activeLocale, setActiveLocale] = useState('es');

  useEffect(() => {
    params.then((p) => setActiveLocale(p.locale || 'es'));
  }, [params]);

  return (
    <AdminComingSoon
      locale={activeLocale}
      title="Descuentos & Cupones"
      subtitle="Crea códigos promocionales, reglas de descuento por porcentaje o monto fijo"
      sectionName="Descuentos / Cupones"
    />
  );
}
