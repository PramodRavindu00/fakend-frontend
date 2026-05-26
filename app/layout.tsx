import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/providers/auth.provider";
import { QueryProvider } from "@/providers/queryClient.provider";

export const metadata: Metadata = {
  title: "Fakend",
  description: "Fake API Contracts Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
