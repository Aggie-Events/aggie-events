import React from "react";
import Image from "next/image";

import { Links } from "@/config/config";
import Link from "next/link";

export default function Header() {
  return (
    <header className="dark:bg-gray-950 border-b-[1px] border-b-gray-300 dark:border-b-white flex">
      <nav className="flex items-center justify-between mx-5 w-full">
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
                <a
                  href={href}
                  className="text-md dark:text-white font-semibold"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* User section */}
        <div className="text-white">
          {/*<Link href="/login" className="">*/}
          {/*  Sign in*/}
          {/*</Link>*/}
          <Image
            src="/cat.webp"
            alt="user"
            width={40}
            height={40}
            className="rounded-full border-[1px] border-maroon-400"
          />
        </div>
      </nav>
    </header>
  );
}
