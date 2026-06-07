import AppBar from "@/components/custom/AppBar";

const AuthenticatedLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <AppBar/>
      {children}
    </>
  );
};

export default AuthenticatedLayout;
