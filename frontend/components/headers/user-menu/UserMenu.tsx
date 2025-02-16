import { motion } from "motion/react";
import React, { forwardRef } from "react";
import Image from "next/image";
import { UserMenuLinks } from "@/config/config";
import Link from "next/link";
import { MdLogout } from "react-icons/md";
import type { User } from "@/config/types";

interface UserMenuProps {
  user: User;
  logout: () => void;
}
const UserMenu = forwardRef<HTMLElement, UserMenuProps>(
  ({ user, logout }, ref) => (
    <motion.nav
      className="bg-white absolute right-0
    shadow-md rounded-md text-black
    z-50 min-w-fit flex flex-col gap-2 p-1.5"
      ref={ref}
      transition={{ duration: 0.1, type: "linear" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="items-center gap-2 w-fit inline-flex px-0.5">
        <div className="w-max">
          <Image
            src={user.user_img}
            alt="user"
            width={30}
            height={30}
            priority={true}
            className="rounded-full shrink-0"
          />
        </div>
        <div className="">
          <div className="font-semibold">{user.user_displayname}</div>
          <div className="text-xs">@{user.user_name}</div>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {UserMenuLinks.map(({ href, label, icon }, index) => (
          <button
            key={index}
            className="text-md font-semibold rounded-md hover:bg-gray-200 px-2 py-1 text-left"
          >
            <Link href={href}>
              <div className="inline-block align-middle mr-2 h-full">
                {icon}
              </div>
              <div className="inline-block align-middle h-full">{label}</div>
            </Link>
          </button>
        ))}

        <button
          className="text-md font-semibold rounded-md hover:bg-gray-200 px-2 py-1 text-left"
          onClick={logout}
        >
          <div className="inline-block align-middle mr-2 h-full">
            <MdLogout />
          </div>
          <div className="inline-block align-middle h-full">Logout</div>
        </button>
      </div>
    </motion.nav>
  ),
);
export default UserMenu;
