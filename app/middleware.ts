import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes (no auth needed)
const publicRoutes = ["/", "/sign-in", "/register"];

export function middleware(request: NextRequest) {
  const isLoggedIn =
    request.cookies.get("next-auth.session-token") ||
    request.cookies.get("__Secure-next-auth.session-token");

  const pathname = request.nextUrl.pathname;

  if (!isLoggedIn && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

// ✅ Add this at the bottom
export const config = {
  matcher: ["/userdashboard", "/dashboard/:path*", "/owner-dashboard/:path*"],
};
