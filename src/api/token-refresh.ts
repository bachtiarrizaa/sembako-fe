import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";
import type { ApiResponse } from "@/types/api-response";
import type { RefreshResponse } from "@/features/auth/types/auth";
import { useAuthStore } from "@/stores/auth.store";
import { setAccessToken, clearAccessToken } from "@/lib/token-storage";

const REFRESH_URL = "/auth/refresh";
const REFRESH_BUFFER_MS = 60_000;
const REFRESH_RETRY_DELAY_MS = 30_000;

interface QueuedRequest {
  config: InternalAxiosRequestConfig;
  resolve: (value: AxiosResponse | PromiseLike<AxiosResponse>) => void;
  reject: (reason?: unknown) => void;
}

export interface TokenRefreshManager {
  scheduleTokenRefresh(token: string): void;
  clearTokenRefresh(): void;
  handleUnauthorized(config: InternalAxiosRequestConfig): Promise<AxiosResponse>;
  isAuthUrl(url: string): boolean;
}

export function createTokenRefreshManager(api: AxiosInstance): TokenRefreshManager {
  let refreshTimer: ReturnType<typeof setTimeout> | null = null;
  let isRefreshing = false;
  let queuedRequests: QueuedRequest[] = [];

  function clearTokenRefresh() {
    if (refreshTimer) {
      clearTimeout(refreshTimer);
      refreshTimer = null;
    }
  }

  async function refreshAccessToken(): Promise<string> {
    const res = await api.post<ApiResponse<RefreshResponse>>(REFRESH_URL);
    const newToken = res.data.data.accessToken;
    setAccessToken(newToken);
    return newToken;
  }

  function forceLogout() {
    clearTokenRefresh();
    clearAccessToken();
    useAuthStore.getState().clearAuth();
    if (typeof window !== "undefined") {
      const role = (useAuthStore.getState().user?.role?.name || "").toLowerCase();
      const section = window.location.pathname.startsWith("/cashier") ? "cashier" : "admin";
      const loginPath =
        role === "cashier"
          ? "/cashier/login"
          : role === "admin"
            ? "/admin/login"
            : section === "cashier"
              ? "/cashier/login"
              : "/admin/login";
      // Force a full page reload to reset all client state after session expiry.
      window.location.assign(loginPath);
    }
  }

  function performRefresh() {
    clearTokenRefresh();
    refreshAccessToken()
      .then((newToken) => scheduleTokenRefresh(newToken))
      .catch(() => {
        refreshTimer = setTimeout(() => {
          refreshAccessToken()
            .then((newToken) => scheduleTokenRefresh(newToken))
            .catch(() => {
              // leave it to the reactive 401 interceptor to handle
            });
        }, REFRESH_RETRY_DELAY_MS);
      });
  }

  function scheduleTokenRefresh(token: string) {
    clearTokenRefresh();
    if (typeof window === "undefined") return;

    let exp = 0;
    try {
      exp = jwtDecode<{ exp?: number }>(token).exp ?? 0;
    } catch {
      return;
    }
    if (!exp) return;

    const delay = exp * 1000 - Date.now() - REFRESH_BUFFER_MS;
    if (delay <= 0) return;

    refreshTimer = setTimeout(performRefresh, delay);
  }

  async function handleUnauthorized(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queuedRequests.push({ config, resolve, reject });
      });
    }

    config._retry = true;
    isRefreshing = true;
    try {
      const newToken = await refreshAccessToken();
      scheduleTokenRefresh(newToken);

      queuedRequests.forEach(({ config: queued, resolve }) => {
        if (queued.headers) queued.headers.Authorization = `Bearer ${newToken}`;
        resolve(api(queued));
      });
      queuedRequests = [];

      if (config.headers) config.headers.Authorization = `Bearer ${newToken}`;
      return api(config);
    } catch (refreshError) {
      queuedRequests.forEach(({ reject }) => reject(refreshError));
      queuedRequests = [];
      forceLogout();
      throw refreshError;
    } finally {
      isRefreshing = false;
    }
  }

  function isAuthUrl(url: string): boolean {
    return url === "/auth/login" || url === REFRESH_URL;
  }

  return {
    scheduleTokenRefresh,
    clearTokenRefresh,
    handleUnauthorized,
    isAuthUrl,
  };
}
