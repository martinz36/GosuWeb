import React from 'react';
import { getDictionary } from '@/dictionaries';
import FramerPageRenderer from '@/components/FramerPageRenderer';
import fs from 'fs';
import path from 'path';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function CatalogPage({ params }: PageProps) {
  const { locale } = await params;
  const activeLocale = locale === 'en' ? 'en' : 'es';
  const dict = await getDictionary(activeLocale);

  const key = `catalog_${activeLocale}`;
  const stylesPath = path.join(process.cwd(), 'framer_source', 'extracted_data', `${key}_styles.html`);
  const mainPath = path.join(process.cwd(), 'framer_source', 'extracted_data', `${key}_main.html`);
  const scriptsPath = path.join(process.cwd(), 'framer_source', 'extracted_data', `${key}_scripts.json`);

  let stylesHtml = '';
  let mainHtml = '';
  let scripts = [];

  try {
    stylesHtml = fs.readFileSync(stylesPath, 'utf-8');
    mainHtml = fs.readFileSync(mainPath, 'utf-8');
    scripts = JSON.parse(fs.readFileSync(scriptsPath, 'utf-8'));
  } catch (error) {
    console.error('Error reading catalog Framer files:', error);
    return <div className="p-8 text-center text-red-500 font-bold">Error loading Catalog page.</div>;
  }

  return (
    <FramerPageRenderer
      stylesHtml={stylesHtml}
      mainHtml={mainHtml}
      scripts={scripts}
      locale={activeLocale}
      pageKey="catalog"
      dict={dict}
    />
  );
}
