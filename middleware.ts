import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * MIDDLEWARE
 * 
 * Sets custom header with pathname so it can be accessed in generateMetadata
 * This allows dynamic metadata generation in the root layout without needing
 * individual layout.tsx files for each route.
 */
export function middleware(request: NextRequest) {
  // Create a new headers object
  const requestHeaders = new Headers(request.headers);
  
  // Set the pathname as a custom header
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  // Return response with modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
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
