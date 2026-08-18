import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['es', 'en'];
const defaultLocale = 'es';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if pathname already has a supported locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Redirect if there is no locale
  // Exclude static assets, api routes, favicon, etc.
  const isInternal = pathname.startsWith('/_next') || 
                     pathname.startsWith('/api') || 
                     pathname.includes('.') || 
                     pathname === '/favicon.ico';

  if (isInternal) return NextResponse.next();

  // Redirect to default locale
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next) and api routes
    '/((?!_next|api|favicon.ico).*)',
  ],
};
