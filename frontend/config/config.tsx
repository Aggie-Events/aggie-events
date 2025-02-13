import React, { Component, ReactElement } from "react";
import { FaUserCircle, FaUserFriends } from "react-icons/fa";
import { IconType } from "react-icons";
import { IoIosSettings, IoMdSettings } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { MdDashboard, MdLogout } from "react-icons/md";

export const HeaderLinks: { href: string; label: string }[] = [
  { href: "/search", label: "Browse" },
  { href: "/create", label: "Create" },
  { href: "/calendar", label: "Calendar" },
];

export const UserMenuLinks: {
  href: string;
  label: string;
  icon: ReactElement<IconType>;
}[] = [
  { href: "/profile", label: "Profile", icon: <FaUserCircle /> },
  { href: "/friends", label: "Friends", icon: <FaUserFriends /> },
  { href: "/dashboard", label: "Dashboard", icon: <MdDashboard /> },
  { href: "/settings", label: "Settings", icon: <IoMdSettings /> },
  // { href: "/logout", label: "Logout", icon: <MdLogout /> },
];

export const TypingTextBase = "Find ";
export const TypingText: string[] = [
  "Study Groups",
  "Free Food",
  "Organizations",
  "Career Opportunities",
  "Friends",
];
