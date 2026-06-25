"use client";
import AppBar from "@/components/custom/AppBar";
import { AuthStatus } from "@/lib/constants/constants";
import { useAuthStore } from "@/store/auth.store";
import { redirect } from "next/navigation";

const AuthenticatedLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const authStatus = useAuthStore((s) => s.status);

  if (authStatus !== AuthStatus.Authenticated) {
    redirect("/unauthorized");
  }

  return (
    <>
      <AppBar />
      {children}
    </>
  );
};

export default AuthenticatedLayout;
