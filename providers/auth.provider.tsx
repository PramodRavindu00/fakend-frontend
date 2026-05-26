"use client";

import { useEffect } from "react";
import { refreshToken } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const { accessToken, user } = await refreshToken();

        setAuth({
          user: user,
          accessToken: accessToken,
        });
      } catch {
        clearAuth();
      }
    };

    bootstrap();
  }, [setAuth, clearAuth]);

  return children;
};
