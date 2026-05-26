import "axios";
import { refresh } from "@/services/auth.service";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth.store";

declare module "axios" {
  interface AxiosRequestConfig {
    public?: boolean;
    _retry?: boolean;
  }
  interface InternalAxiosRequestConfig {
    public?: boolean;
    _retry?: boolean;
  }
}

const api = axios.create({
  baseURL: process.env.SERVER_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const isPublic = config.public ?? false;
    if (!isPublic) {
      const { accessToken } = useAuthStore.getState();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig | undefined;

    if (!originalRequest || originalRequest.public) {
      return Promise.reject(error);
    }
    if (originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { accessToken, user } = await refresh();
        useAuthStore.getState().setAuth({ user, accessToken });

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        useAuthStore.getState().clearAuth();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
