import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Check if we already have a country cookie
  const existingCountry = request.cookies.get('user-country')

  if (!existingCountry) {
    // Vercel provides country via header x-vercel-ip-country
    // Cloudflare provides via CF-IPCountry header
    const country =
      request.headers.get('x-vercel-ip-country') ||
      request.headers.get('cf-ipcountry') ||
      'AT' // Default to Austria

    // Set cookie for client-side access (expires in 1 day)
    response.cookies.set('user-country', country, {
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
      sameSite: 'lax',
    })
  }

  return response
}

// Run middleware on all routes except static files and API routes we don't need it for
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
