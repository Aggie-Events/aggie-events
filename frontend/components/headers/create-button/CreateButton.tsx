"use client";
import React from "react";
import { IoAdd } from "react-icons/io5";
import { useAuth } from "@/components/auth/AuthContext";
import { useMenuHandle } from "@/components/MenuHandle";
import { AnimatePresence } from "motion/react";
import CreateMenu from "./CreateMenu";
import Tooltip from "@/components/common/Tooltip";

export default function CreateButton() {
  const { user } = useAuth();
  const { isMenuOpen: showMenu, menuRef, setIsMenuOpen: setShowMenu } = useMenuHandle({ 
    closeOnScroll: true 
  });

  if (!user) return null;


  return (
    <div className="relative flex flex-row items-center" ref={menuRef}>
      <Tooltip text="Create new..." disabled={showMenu}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className={`text-white transition-colors rounded-lg border-[1.5px] flex flex-row items-center gap-1 px-2 py-0.5 ${
            showMenu 
              ? 'bg-white/20 border-white/80' 
              : 'hover:text-white/80 hover:bg-white/10 border-white'
          }`}
        >
          <IoAdd className={`w-7 h-7 transition-transform duration-200 ${showMenu ? 'rotate-45' : ''}`} />
          <span className="text-md mr-1">Create</span>
        </button>
      </Tooltip>
      <AnimatePresence>
        {showMenu && <CreateMenu />}
      </AnimatePresence>
    </div>
  );
} 