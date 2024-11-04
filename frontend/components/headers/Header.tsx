import React from "react";
import Image from "next/image";

import { Links } from "@/config/config";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";

export default function Header() {
  return (
    <header className="dark:bg-gray-950 bg-lightmaroon border-b-[1px] border-b-gray-300 dark:border-b-white flex">
      <nav className="flex items-center mx-5 w-full text-white dark:text-white">
        {/* Logo section */}
        <div className="mb-2">
          <a href="/" className="flex items-center gap-2">
            <Image
              src="/logo2.png"
              alt="logo"
              width={50}
              height={50}
              className="mb-2 mt-1"
            />
            <div className="text-xl font-bold italic leading-none w-10 mt-2">
              Aggie Events
            </div>
          </a>
        </div>

        <form className="flex grow justify-center hover:drop-shadow-lg">
          <input
            alt="Test"
            className="text-black bg-gray-100 rounded-l-md px-2 py-1 max-w-[700px]
            w-full h-10 outline-none
            focus:border-[#202020] focus:border-y-2 focus:border-l-2 peer"
            placeholder="Search..."
          />
          <button
            className="bg-maroon rounded-r-md py-2 px-3
          peer-focus:border-[#202020] peer-focus:border-y-2 peer-focus:border-r-2"
          >
            <FaSearch color="white" />
          </button>
        </form>

        {/* User section */}
        <div className="flex">
          <ul className="flex gap-x-5 px-5">
            {Links.map(({ href, label }, index) => (
              <li key={index} className="flex flex-row items-center">
                <a href={href} className="text-md font-semibold">
                  {label}
                </a>
              </li>
            ))}
          </ul>
          {/*<Link href="/login" className="">*/}
          {/*  Sign in*/}
          {/*</Link>*/}
          <Image
            src="/cat.webp"
            alt="user"
            width={40}
            height={40}
            className="rounded-full ring-2 ring-maroon-500 hover:ring-[3px] cursor-pointer"
          />
        </div>
      </nav>
    </header>
  );
}
