"use client";

import { AuthStatus, CurrentUser } from "@/lib/constants/constants";
import { completeAuthSession } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { useQuery } from "@tanstack/react-query";
import { redirect, RedirectType } from "next/navigation";
import { useEffect } from "react";
import { AuthenticatingView } from "./AuthenticatingView";
import { OAuthErrorView } from "./OAuthErrorView";

export const OAuthTokenHandler = ({
  token,
  setAuth,
  clearAuth,
}: {
  token: string;
  setAuth: (s: { accessToken: string; user: CurrentUser }) => void;
  clearAuth: () => void;
}) => {
  const authStatus = useAuthStore((s) => s.status);
  const oauthQuery = useQuery({
    queryKey: ["oauth-callback", token],
    enabled: !!token && authStatus !== AuthStatus.Authenticated,
    queryFn: () => completeAuthSession(token),
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (oauthQuery.isSuccess && oauthQuery.data) {
      setAuth(oauthQuery.data);
      redirect("/dashboard", RedirectType.replace);
    }

    if (oauthQuery.isError) {
      clearAuth();
    }
  }, [
    oauthQuery.isSuccess,
    oauthQuery.data,
    oauthQuery.isError,
    setAuth,
    clearAuth,
  ]);

  if (oauthQuery.isError) {
    return <OAuthErrorView error="oauth_failed" clearAuth={clearAuth} />;
  }

  return <AuthenticatingView />;
};
