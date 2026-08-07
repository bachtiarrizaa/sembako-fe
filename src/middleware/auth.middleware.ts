import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

const PROTECTED_PATHS = ["/admin", "/cashier"];
const LOGIN_PATHS = ["/admin/login", "/cashier/login"];

function getRoleFromToken(token: string): string {
  try {
    const payload = jwtDecode<{ role?: string; role_name?: string; roleName?: string }>(token);
    return (payload.role || payload.role_name || payload.roleName || "").toLowerCase();
  } catch {
    return "";
  }
}

function getSection(pathname: string): string | null {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/cashier")) return "cashier";
  return null;
}

function getHome(role: string): string {
  if (role === "admin") return "/admin/dashboard";
  if (role === "cashier") return "/cashier/dashboard";
  return "/";
}

function getLoginPath(section: string): string {
  return section === "cashier" ? "/cashier/login" : "/admin/login";
}

export function withAuthGuard(request: NextRequest): NextResponse {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  const section = getSection(pathname);
  const isLoginPath = LOGIN_PATHS.includes(pathname);

  // Sudah login, kunjungi halaman login -> arahkan ke dashboard sesuai role
  if (token && isLoginPath) {
    const role = getRoleFromToken(token);
    const home =
      role === "admin" || role === "cashier"
        ? getHome(role)
        : section === "cashier"
          ? "/cashier/dashboard"
          : "/admin/dashboard";
    return NextResponse.redirect(new URL(home, request.url));
  }

  // Belum login & mengakses area ter-proteksi
  if (!token && section && PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
    // Halaman login boleh diakses tanpa token
    if (isLoginPath) return NextResponse.next();
    return NextResponse.redirect(new URL(getLoginPath(section), request.url));
  }

  return NextResponse.next();
}