"use client";

import AppBar from "@/components/custom/AppBar";
import { AuthenticatingView } from "@/components/custom/oauth/AuthenticatingView";
import { useSessionQuery } from "@/hooks/useSessionQuery";
import { AuthStatus } from "@/lib/constants/constants";
import { useAuthStore } from "@/store/auth.store";
import { redirect, RedirectType } from "next/navigation";

const AuthenticatedLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const authStatus = useAuthStore((s) => s.status);
  const sessionQuery = useSessionQuery();

  const isBootstrapping =
    authStatus === AuthStatus.Loading ||
    sessionQuery.isPending ||
    (sessionQuery.isSuccess && authStatus !== AuthStatus.Authenticated);

  if (isBootstrapping) {
    return <AuthenticatingView />;
  }

  if (authStatus !== AuthStatus.Authenticated) {
    redirect("/unauthorized", RedirectType.replace);
  }

  return (
    <>
      <AppBar />
      {children}
    </>
  );
};

export default AuthenticatedLayout;