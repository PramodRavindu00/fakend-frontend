"use client";

import { useEffect } from "react";
import { refreshToken } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { AuthStatus, OAUTH_CALLBACK_PATH } from "@/lib/constants/constants";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setLoading = useAuthStore((state) => state.setLoading);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const authStatus = useAuthStore((s) => s.status);
  const shouldBootstrapSession =
    pathname !== OAUTH_CALLBACK_PATH && authStatus !== AuthStatus.Authenticated;
  const sessionQuery = useQuery({
    queryKey: ["session"],
    queryFn: refreshToken,
    enabled: shouldBootstrapSession,
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!shouldBootstrapSession) return;

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
    shouldBootstrapSession,
  ]);

  return children;
};
