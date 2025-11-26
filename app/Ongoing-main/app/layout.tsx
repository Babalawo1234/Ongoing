import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/app/contexts/AuthContext";
import { DarkModeProvider } from "@/app/contexts/DarkModeContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Academic Check Sheet - AUN",
  description: "Comprehensive academic progress tracking system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <DarkModeProvider>{children}</DarkModeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
