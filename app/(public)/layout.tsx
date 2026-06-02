import AppBar from "@/components/custom/AppBar";

const PublicLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
    <AppBar showMarketingLinks={true}/>
      {children}
    </>
  );
};

export default PublicLayout;
