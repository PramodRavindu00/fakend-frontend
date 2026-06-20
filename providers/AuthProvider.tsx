"use client";

import { useEffect } from "react";
import { refreshToken } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { AuthStatus } from "@/lib/constants/constants";

const OAUTH_CALLBACK_PATH = "/auth/oauth/callback";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setLoading = useAuthStore((state) => state.setLoading);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const sessionQuery = useQuery({
    queryKey: ["session"],
    queryFn: refreshToken,
    enabled:
      pathname !== OAUTH_CALLBACK_PATH &&
      useAuthStore.getState().status !== AuthStatus.Authenticated,
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (pathname === OAUTH_CALLBACK_PATH) return;

    if (sessionQuery.isPending) {
      setLoading();
      return;
    }

    if (sessionQuery.isSuccess && sessionQuery.data) {
      setAuth({
        accessToken: sessionQuery.data.accessToken,
        user: sessionQuery.data.user,
      });
      return;
    }

    if (sessionQuery.isError) {
      clearAuth();
    }
  }, [
    pathname,
    sessionQuery.isPending,
    sessionQuery.isSuccess,
    sessionQuery.isError,
    sessionQuery.data,
    setLoading,
    setAuth,
    clearAuth,
  ]);

  return children;
};
