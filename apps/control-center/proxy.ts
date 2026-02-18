import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { buildSecurityHeaders } from '@eumetise/security';

export default function proxy(request: NextRequest) {
  // Generate nonce for CSP
  const nonce = crypto.randomUUID();
  const securityHeaders = buildSecurityHeaders(nonce);

  // Clone headers to pass to response
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value as string);
  });

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};