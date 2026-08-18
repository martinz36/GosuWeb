'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ScriptItem {
  src: string | null;
  type: string | null;
  id: string | null;
  content: string;
}

interface FramerPageRendererProps {
  stylesHtml: string;
  mainHtml: string;
  scripts: ScriptItem[];
  locale: 'es' | 'en';
  pageKey: string;
  dict: any;
}

export default function FramerPageRenderer({ stylesHtml, mainHtml, scripts, locale, pageKey }: FramerPageRendererProps) {
  const router = useRouter();

  // Dynamically inject Framer hydration scripts into DOM without rendering JSX script tags (React 19 compatibility)
  useEffect(() => {
    if (!scripts || scripts.length === 0) return;

    const createdScripts: HTMLScriptElement[] = [];

    scripts.forEach((s) => {
      const scriptEl = document.createElement('script');
      if (s.type) scriptEl.type = s.type;
      if (s.id) scriptEl.id = s.id;
      if (s.src) {
        scriptEl.src = s.src;
        scriptEl.async = true;
      } else if (s.content) {
        scriptEl.innerHTML = s.content;
      }
      document.body.appendChild(scriptEl);
      createdScripts.push(scriptEl);
    });

    return () => {
      createdScripts.forEach((s) => {
        if (s.parentNode) s.parentNode.removeChild(s);
      });
    };
  }, [scripts]);

  // Smooth single-page transitions for internal <a> tags & Shop Now links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor) {
        const href = anchor.getAttribute('href');
        
        if (href && (href.includes('/shop') || href.includes('shop-now') || href.includes('comprar'))) {
          e.preventDefault();
          router.push(`/${locale}/shop`);
          return;
        }

        if (href && (href.startsWith('/es') || href.startsWith('/en'))) {
          e.preventDefault();
          router.push(href);
          return;
        }

        if (href && href.includes('become-partner')) {
          e.preventDefault();
          router.push(`/${locale}/become-partner`);
          return;
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, [router, locale]);

  // Handle partner form submissions
  useEffect(() => {
    if (pageKey !== 'become_partner') return;

    const handleFormSubmit = (e: SubmitEvent) => {
      e.preventDefault();
      
      const form = e.target as HTMLFormElement;
      const inputs = form.querySelectorAll('input, textarea');
      const data: Record<string, string> = {};
      
      inputs.forEach((input: any) => {
        if (input.name) {
          data[input.name] = input.value;
        } else if (input.type === 'email') {
          data['email'] = input.value;
        } else if (input.placeholder) {
          data[input.placeholder.toLowerCase().replace(/\s+/g, '_')] = input.value;
        }
      });

      alert(locale === 'es' 
        ? '¡Solicitud recibida! Nos pondremos en contacto contigo pronto.' 
        : 'Application received! We will get in touch with you shortly.'
      );
      
      form.reset();
    };

    const forms = document.querySelectorAll('form');
    forms.forEach((f) => f.addEventListener('submit', handleFormSubmit));

    return () => {
      forms.forEach((f) => f.removeEventListener('submit', handleFormSubmit));
    };
  }, [pageKey, locale]);

  // Dynamically inject the "Tienda" / "Shop" link in Framer navbar next to become-partner
  const shopLabel = locale === 'es' ? 'Tienda' : 'Shop';
  const localePrefix = `/${locale}`;
  
  const linkRegex = /<a\s+class="([^"]+)"\s+data-styles-preset="([^"]+)"\s+href="([^"]+)become-partner[^"]*">([\s\S]*?)<\/a>/gi;
  
  const processedMainHtml = mainHtml.replace(linkRegex, (match, classes, preset, prefix, content) => {
    const originalLink = match;
    const shopLink = `<a class="${classes} text-[#00e8ff] font-extrabold hover:text-white transition-colors" data-styles-preset="${preset}" href="${localePrefix}/shop">${shopLabel}</a>`;
    return originalLink + shopLink;
  });

  return (
    <div className="relative min-h-screen bg-black" suppressHydrationWarning>
      {/* 100% Original Framer Styles Injection */}
      <style dangerouslySetInnerHTML={{ __html: stylesHtml.replace(/<style[^>]*>|<\/style>/gi, '') }} />

      {/* Main Page Layout */}
      <div 
        className="w-full h-full"
        dangerouslySetInnerHTML={{ __html: processedMainHtml }} 
        suppressHydrationWarning
      />

      {/* Floating "Comprar ahora" Action Banner for Catalog page */}
      {pageKey === 'catalog' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40" suppressHydrationWarning>
          <button
            onClick={() => router.push(`/${locale}/shop`)}
            className="flex items-center gap-3 bg-white text-black font-black uppercase text-xs tracking-widest py-3.5 px-8 rounded-full shadow-[0_0_30px_rgba(0,232,255,0.5)] border border-[#00e8ff] hover:bg-[#00e8ff] hover:scale-105 transition-all font-sigher"
            suppressHydrationWarning
          >
            <span>{locale === 'es' ? '🛒 Ir a la Tienda Online' : '🛒 Go to Online Store'}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
