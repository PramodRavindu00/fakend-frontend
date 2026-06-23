import AuthenticatedLayoutGuard from "@/components/AuthenticatedLayoutGuard";
import AppBar from "@/components/custom/AppBar";

const AuthenticatedLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <AuthenticatedLayoutGuard>
      <AppBar/>
      {children}
    </AuthenticatedLayoutGuard>
  );
};

export default AuthenticatedLayout;
