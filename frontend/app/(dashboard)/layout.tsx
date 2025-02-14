import React from "react";
import Header from "@/components/headers/Header";
import Footer from "@/components/footers/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
