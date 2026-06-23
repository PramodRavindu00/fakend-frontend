"use client";

import { useEffect } from "react";

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
