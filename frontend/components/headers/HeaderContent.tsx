import React from "react";
import SearchBar from "@/components/search/SearchBar";
import UserLogoToggle from "@/components/headers/user-menu/UserLogoToggle";
import Logo from "@/components/common/Logo";

import { HeaderLinks } from "@/config/config";

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
      <div className="flex mx-5 gap-5">
        <ul className="flex gap-x-5">
          {HeaderLinks.map(({ href, label }, index) => (
            <li key={index} className="flex flex-row items-center">
              <a href={href} className="text-md font-semibold">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <UserLogoToggle />
      </div>
    </nav>
  );
}
