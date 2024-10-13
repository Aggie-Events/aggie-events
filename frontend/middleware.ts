import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    // const auth = await testAuth();
    // console.log('Auth middleware: ', auth)
    // if (request.nextUrl.pathname.startsWith('/dashboard') && !auth) {
    //     const response = NextResponse.redirect(new URL('/login', request.url));
    //     response.headers.set('x-middleware-cache', 'no-cache');
    //     return response;
    // }
    return NextResponse.next();
}
 
// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
      ],
}