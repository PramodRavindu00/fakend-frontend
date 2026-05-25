import "axios";
import { refresh } from "@/services/auth.service";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

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
    withCredentials: true, // allow sending cookies
  });
  
  // Request Interceptor
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const isPublic = config.public ?? false;
      if (!isPublic) {
        const state = store.getState();
        const token = state.auth.accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error),
  );
  
  // Response Interceptor
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig;
  
      if (!originalRequest || originalRequest.public)
        return Promise.reject(error);
      if (originalRequest.url?.includes("/auth/refresh"))
        return Promise.reject(error);
  
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const {accessToken,user} = await refresh();
          const newAccessToken = res?.data?.accessToken;
  
          store.dispatch(refreshAccessToken(newAccessToken));
  
          if (!originalRequest.headers) {
            originalRequest.headers = {};
          }
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          store.dispatch(clearAuth());
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }
  
      return Promise.reject(error);
    }
  },
);

export default api;
