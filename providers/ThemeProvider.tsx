"use client";

import { ThemeProvider } from "next-themes";

const AppThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      {children}
    </ThemeProvider>
  );

export default AppThemeProvider;