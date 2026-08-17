import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from "axios";
import { createTokenRefreshManager } from "@/api/token-refresh";
import { getAccessToken } from "@/lib/token-storage";

export const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getAccessToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

const tokenRefresh = createTokenRefreshManager(apiClient);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config;
    const status = error.response?.status;

    if (
      status === 401 &&
      original &&
      !original._retry &&
      !tokenRefresh.isAuthUrl(original.url ?? "")
    ) {
      try {
        return await tokenRefresh.handleUnauthorized(original);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const { scheduleTokenRefresh, clearTokenRefresh } = tokenRefresh;
