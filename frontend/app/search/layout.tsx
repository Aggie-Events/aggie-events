import React from "react";
import Header from "@/app/(other)/_components/CommonHeader";
import Footer from "@/components/footers/Footer";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-y-hidden max-h-screen">
      <Header />
      {children}
    </div>
  );
}
