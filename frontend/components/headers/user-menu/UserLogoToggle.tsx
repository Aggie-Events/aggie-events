"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "motion/react";
import UserMenu from "@/components/headers/user-menu/UserMenu";
import { useAuth } from "@/components/auth/AuthContext";
import Link from "next/link";

export default function UserLogoToggle() {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null); // Ref for the menu container

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    // Add event listener when the menu is open
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("scroll", () => setShowMenu(false));
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", () => setShowMenu(false));
    }

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", () => setShowMenu(false));
    };
  }, [showMenu]);

  return (
    <>
      {user ? (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="inline-flex justify-center w-full py-2 text-sm font-medium text-white"
          >
            <Image
              src={user.user_img}
              alt="user"
              width={35}
              height={35}
              className="rounded-full ring-2 ring-maroon-500 hover:ring-[4px] cursor-pointer"
            />
          </button>
          <AnimatePresence>
            {showMenu && <UserMenu user={user} logout={logout} />}
          </AnimatePresence>
        </div>
      ) : (
        <button className="py-1 px-3 rounded-md border-[1px] border-white">
          <Link
            href={`${process.env.NEXT_PUBLIC_AUTH_URL}/google`}
            className=""
          >
            Sign in
          </Link>
        </button>
      )}
    </>
  );
}
