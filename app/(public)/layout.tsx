import AppBar from "@/components/custom/AppBar";

const PublicLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
    <AppBar showMarketingLinks/>
      {children}
    </>
  );
};

export default PublicLayout;
