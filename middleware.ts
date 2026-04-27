import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/login"];

export function middleware(req: NextRequest) {
  const user = req.cookies.get("user")?.value;
  const { pathname } = req.nextUrl;

  // Not logged in, trying to access protected route → redirect to login
  if (!user && !PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Already logged in, trying to access login → redirect to dashboard
  if (user && PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|images|favicon.ico).*)"],
};
