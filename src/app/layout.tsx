import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { headers } from "next/headers"; // This will throw an error if used in client component
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
export const metadata: Metadata = {
  title: "Snip Snap",
  description: "Share code in a snap",
};

import { ThemeProvider } from "@/providers/theme-provider";
import AuthProvider from "@/providers/Authprovider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  headers(); // to check server side
  return (
    <html lang="en" suppressHydrationWarning>
      <AuthProvider>
        <body className={`${inter.variable} antialiased`}>
          <ThemeProvider> {children}</ThemeProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
