"use client";

import { useAuthStore } from "@/store/auth.store";
import { OAuthErrorView } from "./OAuthErrorView";
import { OAuthTokenHandler } from "./OAuthTokenHandler";

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
    return <OAuthErrorView error={error} clearAuth={clearAuth} />;
  }

  if (!token) {
    return <OAuthErrorView error="oauth_failed" clearAuth={clearAuth} />;
  }

  return (
    <OAuthTokenHandler
      token={token}
      setAuth={setAuth}
      clearAuth={clearAuth}
    />
  );
};
