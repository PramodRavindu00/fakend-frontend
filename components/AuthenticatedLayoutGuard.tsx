"use client";

import { AuthStatus } from "@/lib/constants/constants";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { AuthenticatingView } from "./custom/oauth/AuthenticatingView";

const AuthenticatedLayoutGuard = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const authStatus = useAuthStore((s) => s.status);
  const router = useRouter();

  useEffect(() => {
    if (authStatus === AuthStatus.Guest) {
      router.replace("/"); // provide unauthorized page in the future
    }
  }, [authStatus, router]);

  if (authStatus === AuthStatus.Loading) {
    return <AuthenticatingView />;
  }

  if (authStatus !== AuthStatus.Authenticated) {
    return null;
  }

  return <>{children}</>;
};

export default AuthenticatedLayoutGuard;
