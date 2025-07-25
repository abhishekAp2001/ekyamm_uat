import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Paths to ignore
  const ignorePaths = ['/login', '/logout','/']

  if (!ignorePaths.includes(pathname)) {
    const response = NextResponse.next()

    response.cookies.set('lastVisited', pathname, {
      path: '/',
      httpOnly: false, // set true if only server needs it
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  }

  return NextResponse.next()
}

// Optional: add a matcher if you want
export const config = {
  matcher: '/:path*',
}
