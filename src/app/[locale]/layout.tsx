import type { Metadata } from "next";
import "../globals.css";
import { CartProvider } from "@/context/CartContext";
import Script from "next/script";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs ? 'GOSU® | Accesorios Premium de TCG para Jugadores y Coleccionistas' : 'GOSU® | Premium TCG Accessories for Players & Collectors',
    description: isEs ? 'Sleeves, binders y accesorios premium de TCG diseñados para proteger, optimizar y lucir tu colección. Diseñado para los que juegan diferente.' : 'Premium sleeves, binders, and TCG accessories designed to protect, optimize, and elevate your collection. Built for those who play different.',
    icons: {
      icon: 'https://framerusercontent.com/images/zSe9L6yupLGMFGQqOP2FPk3FPLU.png',
    }
  };
}

export default async function RootLayout({
  children,
  params,
}: Props) {
  const { locale } = await params;
  const activeLocale = locale === 'en' ? 'en' : 'es';

  return (
    <html lang={activeLocale} className="h-full scroll-smooth">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" />
      </head>
      <body className="min-h-full flex flex-col bg-black text-white antialiased" data-framer-cursor="c54oa2">
        <CartProvider>
          {children}
        </CartProvider>

        {/* 100% Original Framer Spray Cursor Script */}
        <Script
          src="/assets/animate/script_main.3FbrKJgn.mjs"
          type="module"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
