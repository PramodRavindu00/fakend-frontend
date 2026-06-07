import AppBar from "@/components/custom/AppBar";

const GuestLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <AppBar showMarketingLinks={true} />
      {children}
    </>
  );
};

export default GuestLayout;
