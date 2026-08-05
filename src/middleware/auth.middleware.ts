import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/admin", "/cashier"];

export function withAuthGuard(request: NextRequest): NextResponse {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  const isLoggedIn = Boolean(token);

  if (isLoggedIn && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isLoggedIn && PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
