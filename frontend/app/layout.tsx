import React from "react";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthContext";
import { ToastRenderer } from "@/components/toast/ToastRenderer";
import { Metadata } from "next";
import QueryProvider from "@/app/providers";

export const metadata: Metadata = {
  title: "Aggie Events",
  description:
    "One stop shop for events and organizations happening on the Texas A&M campus",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon/favicon.ico" sizes="any" />
      </head>
      <body className="flex flex-col min-h-screen relative">
        <ToastRenderer />
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
