"use client";

import React from "react";
import SearchBar from "@/components/search/SearchBar";
import UserLogoToggle from "@/components/headers/user-menu/UserLogoToggle";
import Logo from "@/components/common/Logo";
import CreateButton from "@/components/headers/create-button/CreateButton";
import Link from "next/link";
import { useSavedEventsCount } from "@/api/event";
import { useAuth } from "@/components/auth/AuthContext";
import { AuthHeaderLinks, DefaultHeaderLinks } from "@/config/config";
import Tooltip from "../common/Tooltip";

// Props interface for AuthenticatedHeader
interface AuthenticatedHeaderProps {
  user: any; // Replace with your actual User type if available
}

// Component for unauthenticated users
function UnauthenticatedHeader() {
  return (
    <ul className="flex gap-x-3 mx-2">
      {DefaultHeaderLinks.map(({ href, label }, index) => (
        <li key={index} className="flex flex-row items-center">
          <Link 
            href={href} 
            className="text-white rounded-md"
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

// Component for authenticated users
function AuthenticatedHeader({ user }: AuthenticatedHeaderProps) {
  const { data: savedEventsCount = 0 } = useSavedEventsCount();
  
  return (
    <>
      <CreateButton />
      <ul className="flex gap-x-1">
        {AuthHeaderLinks.map(({ href, label, icon }, index) => (
          <li key={index} className="flex flex-row items-center">
            <Tooltip text={label}>
              <Link 
                href={href} 
                className="text-white hover:text-white/80 transition-colors p-2 rounded-full hover:bg-white/10 relative"
                title={label}
              >
                {icon}
                {label === "Saved" && savedEventsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-maroon text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {savedEventsCount > 99 ? "99+" : savedEventsCount}
                  </span>
                )}
              </Link>
            </Tooltip>
          </li>
        ))}
      </ul>
    </>
  );
}

// Main HeaderContent component that contains common layout and decides which header to show
export default function HeaderContent() {
  const { user } = useAuth();
  
  return (
    <nav className="flex items-center w-full gap-4">
      {/* Logo section */}
      <div className="mb-2 w-fit mx-3 p-1">
        <Logo 
          width={50}
          height={50}
          className=""
          textClassName="text-xl font-bold italic leading-none mt-1 w-fit justify-center flex flex-col"
        />
      </div>

      <SearchBar />

      {/* User section */}
      <div className="flex mr-5 gap-2 items-center">
        {user ? <AuthenticatedHeader user={user} /> : <UnauthenticatedHeader />}
        <UserLogoToggle />
      </div>
    </nav>
  );
}
