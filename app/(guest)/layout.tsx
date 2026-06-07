import AppBar from "@/components/custom/AppBar";

const GuestLayout = ({
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

export default GuestLayout;
