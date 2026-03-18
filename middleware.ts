import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  const site = host.includes('vaatwas') ? 'vaatwasstrips' : 'wasstrips';

  const response = NextResponse.next();
  // For server components via headers()
  response.headers.set('x-site', site);
  // For client components via cookies()
  response.cookies.set('site', site, { path: '/', sameSite: 'lax' });
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
