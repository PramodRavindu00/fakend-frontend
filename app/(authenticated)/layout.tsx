import AppBar from "@/components/custom/AppBar";

const AuthenticatedLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <AppBar showMarketingLinks={false} />
      {children}
    </>
  );
};

export default AuthenticatedLayout;
