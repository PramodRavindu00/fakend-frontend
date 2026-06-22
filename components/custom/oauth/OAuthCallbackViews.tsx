"use client";

import { AuthStatus, CurrentUser } from "@/lib/constants/constants";
import { completeAuthSession } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const AuthenticatingView = () => {
  return <div>Authenticating....</div>;
};

export const OAuthErrorView = ({
  error,
  clearAuth,
}: {
  error: string;
  clearAuth: () => void;
}) => {
  useEffect(() => {
    clearAuth();
  }, [clearAuth, error]);
  return <div>Error....</div>;
};

export const OAuthHandlerView = ({
  error,
  token,
}: {
  error: string | null;
  token: string | null;
}) => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  if (error) {
    return (
      <OAuthErrorView error={error} clearAuth={clearAuth} />
    );
  }

  if (!token) {
    return (
      <OAuthErrorView
        error="oauth_failed"
        clearAuth={clearAuth}
      />
    );
  }

  return (
    <OAuthTokenHandler
      token={token}
      setAuth={setAuth}
      clearAuth={clearAuth}
    />
  );
};

export const OAuthTokenHandler = ({
  token,
  setAuth,
  clearAuth,
}: {
  token: string;
  setAuth: (s: { accessToken: string; user: CurrentUser }) => void;
  clearAuth: () => void;
}) => {
  const router = useRouter();
  const oauthQuery = useQuery({
    queryKey: ["oauth-callback", token],
    enabled:
      !!token && useAuthStore.getState().status !== AuthStatus.Authenticated,
    queryFn: () => completeAuthSession(token),
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (oauthQuery.isSuccess && oauthQuery.data) {
      setAuth(oauthQuery.data);
      router.replace("/dashboard");
    }

    if (oauthQuery.isError) {
      clearAuth();
    }
  }, [
    oauthQuery.isSuccess,
    oauthQuery.data,
    oauthQuery.isError,
    router,
    setAuth,
    clearAuth,
  ]);

  if (oauthQuery.isError) {
    return (
      <OAuthErrorView
        error="oauth_failed"
        clearAuth={clearAuth}
      />
    );
  }

  return <AuthenticatingView />;
};
