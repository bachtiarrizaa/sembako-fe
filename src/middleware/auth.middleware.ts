import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

const PROTECTED_PATHS = ["/admin", "/cashier"];

function getRoleFromToken(token: string): string {
  try {
    const payload = jwtDecode<{ role_name?: string }>(token);
    return (payload.role_name || "").toLowerCase();
  } catch {
    return "";
  }
}

export function withAuthGuard(request: NextRequest): NextResponse {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  if (token && pathname.startsWith("/login")) {
    const role = getRoleFromToken(token);
    const home = role === "admin" ? "/admin" : role === "cashier" ? "/cashier" : "/";
    return NextResponse.redirect(new URL(home, request.url));
  }

  if (!token && PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}