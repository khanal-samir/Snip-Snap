import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (
    (token &&
      (url.pathname === "/" ||
        url.pathname.startsWith("/login") ||
        url.pathname.startsWith("/register") ||
        url.pathname.startsWith("/forgot-password"))) ||
    url.pathname.startsWith("/change-password")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/register",
    "/login",
    "/forgot-password",
    "/change-password",
  ],
};
