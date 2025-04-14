import React from "react";
import Link from "next/link";
import { MdMenu } from "react-icons/md";
import SearchBar from "@/components/search/SearchBar";
import UserLogoToggle from "@/components/headers/user-menu/UserLogoToggle";
import Logo from "@/components/common/Logo";
import { useSidebar } from "@/components/context-providers/SidebarContext";

import { MdAdd } from "react-icons/md";

export default function DashboardHeader() {
  const { toggle } = useSidebar();

  return (
    <header className="bg-lightmaroon text-white shadow-md">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="p-2 hover:bg-maroon rounded-lg transition-colors"
          >
            <MdMenu className="text-2xl" />
          </button>
          <Logo />
        </div>

        {/* Search and Create Button */}
        <div className="flex items-center gap-4 flex-1 max-w-2xl mx-4">
          <SearchBar />
          <Link
            href="/dashboard/events/create"
            className="bg-maroon hover:bg-darkmaroon text-white flex items-center px-4 py-2 rounded-md transition-colors"
          >
            <MdAdd className="mr-2" />
            Create Event
          </Link>
        </div>

        {/* User Profile */}
        <div className="flex items-center">
          <UserLogoToggle />
        </div>
      </div>
    </header>
  );
}
