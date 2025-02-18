import React, { ReactElement } from "react";
import { FaUserCircle, FaUserFriends } from "react-icons/fa";
import { IconType } from "react-icons";
import { IoMdSettings } from "react-icons/io";
import { MdDashboard } from "react-icons/md";

export const HeaderLinks: { href: string; label: string }[] = [
  { href: "/search", label: "Browse" },
  { href: "/dashboard/events/create", label: "Create" },
  { href: "/calendar", label: "Calendar" },
];

export const UserMenuLinks: {
  href: string;
  label: string;
  icon: ReactElement<IconType>;
}[] = [
  // { href: "/users/", label: "Profile", icon: <FaUserCircle /> },
  { href: "/dashboard", label: "Dashboard", icon: <MdDashboard /> },
  { href: "/friends", label: "Friends", icon: <FaUserFriends /> },
  { href: "/settings", label: "Settings", icon: <IoMdSettings /> },
];

export const TypingTextBase = "Find ";
export const TypingText: string[] = [
  "Study Groups",
  "Free Food",
  "Organizations",
  "Career Opportunities",
  "Friends",
];
