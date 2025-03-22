"use client";
import React, { useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "motion/react";
import UserMenu from "@/components/headers/user-menu/UserMenu";
import { useAuth } from "@/components/auth/AuthContext";
import LoginScreen from "@/components/auth/LoginScreen";
import { useMenuHandle } from "@/components/MenuHandle";

export default function UserLogoToggle() {
  const { user, logout } = useAuth();
  const { isMenuOpen: showMenu, menuRef, setIsMenuOpen: setShowMenu } = useMenuHandle({ 
    closeOnScroll: true 
  });
  const [showLogin, setShowLogin] = useState<boolean>(false);

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
        <>
          <button 
            onClick={() => setShowLogin(true)}
            className="py-1 px-3 rounded-md border-[1px] border-white text-white hover:bg-white/10 transition-colors"
          >
            Sign in
          </button>
          <AnimatePresence>
            {showLogin && <LoginScreen onClose={() => setShowLogin(false)} />}
          </AnimatePresence>
        </>
      )}
    </>
  );
}
