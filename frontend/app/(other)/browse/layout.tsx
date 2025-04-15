import React from "react";
import Header from "@/app/(other)/_components/CommonHeader";
import Footer from "@/components/footers/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
