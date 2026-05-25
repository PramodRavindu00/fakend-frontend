"use client";

import { useEffect } from "react";
import { refresh } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const { accessToken, user } = await refresh();

        setAuth({
          user: user,
          accessToken: accessToken,
        });
      } catch {
        logout();
      }
    };

    bootstrap();
  }, [setAuth, logout]);

  return children;
};
