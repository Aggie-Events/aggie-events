"use client";
import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { MdEvent, MdGroups } from "react-icons/md";

export default function CreateMenu() {
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
          <div className="inline-block align-middle h-full">
            {icon}
          </div>
          <div className="inline-block align-middle h-full">{label}</div>
        </Link>
      ))}
    </motion.nav>
  );
} 