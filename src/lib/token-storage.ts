import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "accessToken";

export function getAccessToken(): string | undefined {
  return Cookies.get(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  Cookies.set(ACCESS_TOKEN_KEY, token, { path: "/" });
}

export function clearAccessToken(): void {
  Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
}
