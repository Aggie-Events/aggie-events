import React from "react";
import Image from "next/image";

import { Links } from "@/config/config";

export default function HomeHeader() {
  return (
    <header className="bg-gradient-to-b from-20% from-maroon h-[120px] flex">
      <nav className="flex items-center justify-between w-full mx-5 h-fit">
        {/* Logo section */}
        <div className="mb-2">
          <a href="/">
            <Image src="/logo2.png" alt="logo" width={50} height={50} />
          </a>
        </div>

        {/* Navigation section */}
        <div className="">
          <ul className="flex gap-x-[4vw]">
            {Links.map(({ href, label }, index) => (
              <li key={index}>
                <a href={href} className="text-md text-white font-semibold">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* User section */}
        <div>
          {/* <button className="bg-slate-700 text-white px-4 py-2 rounded-lg">
                    <a href='/login'>Login</a>
                </button> */}
        </div>
      </nav>
    </header>
  );
}
