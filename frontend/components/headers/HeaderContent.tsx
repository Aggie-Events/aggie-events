import React from "react";
import SearchBar from "@/components/search/SearchBar";
import UserLogoToggle from "@/components/headers/user-menu/UserLogoToggle";
import Logo from "@/components/common/Logo";
import CreateButton from "@/components/headers/create-button/CreateButton";
import Link from "next/link";

import { HeaderLinks } from "@/config/config";
import Tooltip from "../common/Tooltip";

export default function HeaderContent() {
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
        <CreateButton />
        <ul className="flex gap-x-1">
          {HeaderLinks.map(({ href, label, icon }, index) => (
            <li key={index} className="flex flex-row items-center">
              <Tooltip text={label}>
                <Link 
                  href={href} 
                  className="text-white hover:text-white/80 transition-colors p-2 rounded-full hover:bg-white/10"
                  title={label}
              >
                {icon}
                </Link>
              </Tooltip>
            </li>
          ))}
        </ul>
        
        
        <UserLogoToggle />
      </div>
    </nav>
  );
}
