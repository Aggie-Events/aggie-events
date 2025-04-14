"use client";
import React from "react";
import { IoAdd } from "react-icons/io5";
import { useAuth } from "@/components/auth/AuthContext";
import { useMenuSelect } from "@/components/common/MenuSelectionHook";
import { AnimatePresence, motion } from "motion/react";
import Tooltip from "@/components/common/Tooltip";
import { MdEvent, MdGroups } from "react-icons/md";
import Link from "next/link";

export default function CreateButton() {
  const { user } = useAuth();
  const {
    isMenuOpen: showMenu,
    menuRef,
    setIsMenuOpen: setShowMenu,
  } = useMenuSelect({
    closeOnScroll: true,
  });

  if (!user) return null;

  return (
    <div className="relative flex flex-row items-center" ref={menuRef}>
      <Tooltip text="Create new..." disabled={showMenu}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className={`text-white transition-colors rounded-lg border-[1.5px] flex flex-row items-center gap-1 px-2 py-0.5 ${
            showMenu
              ? "bg-white/20 border-white/80"
              : "hover:text-white/80 hover:bg-white/10 border-white"
          }`}
        >
          <IoAdd
            className={`w-7 h-7 transition-transform duration-200 ${showMenu ? "rotate-45" : ""}`}
          />
          <span className="text-md mr-1">Create</span>
        </button>
      </Tooltip>
      <AnimatePresence>{showMenu && <CreateMenu />}</AnimatePresence>
    </div>
  );
}

function CreateMenu() {
  const createOptions = [
    {
      href: "/dashboard/events/create",
      label: "New Event",
      icon: <MdEvent className="w-5 h-5" />,
    },
    {
      href: "/dashboard/organizations/create",
      label: "New Organization",
      icon: <MdGroups className="w-5 h-5" />,
    },
  ];

  return (
    <motion.nav
      className="bg-white absolute top-full left-0 mt-2
      shadow-md rounded-md text-black
      z-50 min-w-fit flex flex-col gap-1 p-1.5 w-[200px]"
      transition={{ duration: 0.1, type: "linear" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {createOptions.map(({ href, label, icon }, index) => (
        <Link
          key={index}
          href={href}
          className="text-md font-semibold rounded-md hover:bg-gray-200 px-2 py-1.5 text-left flex items-center gap-2"
        >
          <div className="inline-block align-middle h-full">{icon}</div>
          <div className="inline-block align-middle h-full">{label}</div>
        </Link>
      ))}
    </motion.nav>
  );
}
