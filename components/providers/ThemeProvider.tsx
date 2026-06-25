"use client";

import { ThemeProvider, type ThemeProviderProps } from "next-themes";

const AppThemeProvider = ({
  children,
  ...props
}: ThemeProviderProps) => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
    scriptProps={{ type: "application/json" }}
    {...props}
  >
    {children}
  </ThemeProvider>
);

export default AppThemeProvider;