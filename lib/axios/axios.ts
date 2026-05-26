import "axios";
import axios, {
  AxiosError,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/store/auth.store";
import { RefreshTokenResponse } from "../constants/constants";

declare module "axios" {
  interface AxiosRequestConfig {
    public?: boolean;
    _retry?: boolean;
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const isPublic = config.public ?? false;
  if (!isPublic) {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      const headers = AxiosHeaders.from(config.headers);
      headers.set("Authorization", `Bearer ${token}`);
      config.headers = headers;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config;

    if (!original) return Promise.reject(error);
    if (original.public) return Promise.reject(error);
    if (original._retry) {
      return Promise.reject(error);
    }
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }
    if (original.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }
    original._retry = true;
    try {
      //call the auth refresh endpoint as an standalone http request
      // not as this context's api client
      const { data } = await axios.post<RefreshTokenResponse>(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });

      const { accessToken, user } = data;

      useAuthStore.getState().setAuth({ user, accessToken });

      const headers = AxiosHeaders.from(original.headers);
      headers.set("Authorization", `Bearer ${accessToken}`);
      original.headers = headers;

      return api(original);
    } catch (refreshError) {
      console.error("Token refresh failed:", refreshError);
      useAuthStore.getState().clearAuth();
      return Promise.reject(refreshError);
    }
  },
);

export default api;
