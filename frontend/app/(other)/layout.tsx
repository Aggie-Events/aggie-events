import React from "react";
import "@/app/globals.css";

import Header from "@/components/headers/Header";
import Footer from "@/components/footers/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-[100vh]">
      <Header />
      <div className="grow relative">{children}</div>
      <Footer />
    </div>
  );
}
