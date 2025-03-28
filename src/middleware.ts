import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // Allow password reset with token
  if (url.pathname === "/change-password" && url.searchParams.has("token")) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from auth pages
  if (
    (token &&
      (url.pathname === "/" ||
        url.pathname.startsWith("/login") ||
        url.pathname.startsWith("/register") ||
        url.pathname.startsWith("/forgot-password"))) ||
    url.pathname === "/change-password"
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protect private routes
  if (
    !token &&
    (url.pathname.startsWith("/dashboard") ||
      url.pathname.startsWith("/create-snippet") ||
      url.pathname.startsWith("/update-snippet") ||
      url.pathname.startsWith("/snippet") ||
      url.pathname.startsWith("/star") ||
      url.pathname.startsWith("/user") ||
      url.pathname.startsWith("/search"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/",
    "/user/:path*",
    "/search",
    "/create-snippet",
    "/snippet/:path*",
    "/update-snippet/:path*",
    "/dashboard/:path*",
    "/star/:path*",
    "/explore/:path*",
    "/register",
    "/login",
    "/forgot-password",
    "/change-password",
  ],
};
