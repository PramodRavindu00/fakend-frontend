import AppBar from "@/components/custom/AppBar";

const PublicLayout = ({
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

export default PublicLayout;
