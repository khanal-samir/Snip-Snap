import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
  if (url.pathname === "/change-password" && url.searchParams.has("token")) {
    return NextResponse.next();
  }
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

  if (
    !token &&
    (url.pathname.startsWith("/dashboard") ||
      url.pathname.startsWith("/create-snippet") ||
      url.pathname.startsWith("/update-snippet") ||
      url.pathname.startsWith("/snippet"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/",
    "/create-snippet",
    "/snippet/:path*",
    "/update-snippet/:path*",
    "/dashboard/:path*",
    "/register",
    "/login",
    "/forgot-password",
    "/change-password",
  ],
};
