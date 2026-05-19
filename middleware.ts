import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * MIDDLEWARE
 *
 * Sets custom header with pathname so it can be accessed in generateMetadata
 * This allows dynamic metadata generation in the root layout without needing
 * individual layout.tsx files for each route.
 *
 * Also detects visitor country via Vercel geo headers and sets a preferred
 * currency cookie (NZD for AU/NZ, USD for all others).
 */
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  // Determine preferred currency: respect existing cookie, fall back to geo detection
  const existingCurrency = request.cookies.get('preferred-currency')?.value;
  let currency: string;
  if (existingCurrency === 'NZD' || existingCurrency === 'USD') {
    currency = existingCurrency;
  } else {
    const country = request.headers.get('x-vercel-ip-country') || '';
    currency = ['NZ', 'AU'].includes(country) ? 'NZD' : 'USD';
  }

  // Forward currency as a request header so Server Components can read it
  // on the very first request (before the cookie reaches the browser)
  requestHeaders.set('x-preferred-currency', currency);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Set cookie on first visit so subsequent requests include it
  if (!existingCurrency) {
    response.cookies.set('preferred-currency', currency, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
  }

  return response;
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
