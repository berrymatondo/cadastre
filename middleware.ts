import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check for better-auth session cookie
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ??
    request.cookies.get("__Secure-better-auth.session_token")?.value

  // Already logged in → redirect away from login
  if (pathname === "/login") {
    if (sessionToken) return NextResponse.redirect(new URL("/", request.url))
    return NextResponse.next()
  }

  // Not logged in → redirect to login
  if (!sessionToken) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon\\.ico|icon.*|apple-icon.*|placeholder.*).*)",
  ],
}
