"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MdDashboard, MdEvent, MdGroup, MdSettings } from "react-icons/md";
import SearchBar from "@/components/search/SearchBar";
import UserLogoToggle from "@/components/headers/user-menu/UserLogoToggle";
import DashboardHeader from "@/app/dashboard/_components/DashboardHeader";
import DashboardSidebar from "@/app/dashboard/_components/DashboardSidebar";
import { SidebarProvider } from "@/components/context-providers/SidebarContext";
import AuthSuspense from "@/components/auth/AuthSuspense";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: <MdDashboard /> },
  { href: "/dashboard/events", label: "Events", icon: <MdEvent /> },
  {
    href: "/dashboard/organizations",
    label: "Organizations",
    icon: <MdGroup />,
  },
  { href: "/dashboard/settings", label: "Settings", icon: <MdSettings /> },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col">
        <DashboardHeader />

        {/* Main Content with Sidebar */}
        <div className="flex flex-1">
          <DashboardSidebar />

          {/* Main Content */}
          <main className="flex-1 bg-gray-100">
            <AuthSuspense>
              <div className="p-6">{children}</div>
            </AuthSuspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
