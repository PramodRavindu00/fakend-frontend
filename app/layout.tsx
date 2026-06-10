import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { QueryProvider } from "@/providers/QueryClientProvider";
import AppThemeProvider from "@/providers/ThemeProvider";
import { Outfit } from "next/font/google";
import { cn } from "@/util/cn";

export const metadata: Metadata = {
  title: "Fakend",
  description: "Fake API Contracts Tool",
};

const fontSans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          fontSans.variable,
          "min-h-full w-full flex flex-col overflow-x-hidden",
        )}
      >
        <AppThemeProvider>
          <QueryProvider>
            <AuthProvider>{children}</AuthProvider>
          </QueryProvider>
        </AppThemeProvider>
      </body>
    </html>
  );
}
