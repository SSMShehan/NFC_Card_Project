// ============================================================
//  NEXUS Mobile — Axios API Client
//  Configured with base URL, auth interceptors, and error handling.
// ============================================================

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';

const SECURE_STORE_KEYS = {
  accessToken:  'nexus_access_token',
  refreshToken: 'nexus_refresh_token',
};

/** Typed API response envelope */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: Record<string, unknown>;
}

// ── Create Axios Instance ─────────────────────────────────────
const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api/v1`,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ── Request Interceptor — Inject Auth Token ───────────────────
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await SecureStore.getItemAsync(SECURE_STORE_KEYS.accessToken);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // SecureStore failure — proceed without token
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response Interceptor — Handle 401 Token Refresh ──────────
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Auto-refresh on 401 Unauthorized (once)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync(SECURE_STORE_KEYS.refreshToken);
        if (!refreshToken) throw new Error('No refresh token');

        const res = await axios.post<ApiResponse<{ accessToken: string }>>(
          `${API_URL}/api/v1/auth/refresh`,
          { refreshToken },
        );

        const newAccessToken = res.data.data?.accessToken;
        if (!newAccessToken) throw new Error('Refresh response missing token');

        // Persist new token
        await SecureStore.setItemAsync(SECURE_STORE_KEYS.accessToken, newAccessToken);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return apiClient(originalRequest);
      } catch {
        // Refresh failed — clear all tokens (force re-login)
        await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.accessToken);
        await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.refreshToken);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

// ── Auth Helpers ──────────────────────────────────────────────
export async function persistTokens(accessToken: string, refreshToken: string): Promise<void> {
  await SecureStore.setItemAsync(SECURE_STORE_KEYS.accessToken, accessToken);
  await SecureStore.setItemAsync(SECURE_STORE_KEYS.refreshToken, refreshToken);
}

export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.accessToken);
  await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.refreshToken);
}

export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(SECURE_STORE_KEYS.accessToken);
}

export { apiClient };
