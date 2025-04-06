import React, { ReactElement } from "react";
import { FaUserCircle, FaUserFriends, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { IconType } from "react-icons";
import { IoMdNotificationsOutline, IoMdSettings } from "react-icons/io";
import { MdDashboard, MdOutlineExplore, MdFeedback } from "react-icons/md";


export const DefaultHeaderLinks: { href: string; label: string }[] = [
  { href: "/search", label: "Browse" },
  // { href: "/feedback", label: "Feedback" },
];

export const AuthHeaderLinks: { href: string; label: string; icon: ReactElement<IconType> }[] = [
  { href: "/search", label: "Browse", icon: <MdOutlineExplore className="w-6 h-6" /> },
  { href: "/saved", label: "Saved", icon: <FaRegBookmark className="w-5 h-5" /> },
  { href: "/notifications", label: "Notifications", icon: <IoMdNotificationsOutline className="w-7 h-7" /> },
];


export const UserMenuLinks: {
  href: string;
  label: string;
  icon: ReactElement<IconType>;
}[] = [
  // { href: "/users/", label: "Profile", icon: <FaUserCircle /> },
  { href: "/dashboard", label: "Dashboard", icon: <MdDashboard /> },
  // { href: "/friends", label: "Friends", icon: <FaUserFriends /> },
  { href: "/feedback", label: "Feedback", icon: <MdFeedback /> },
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
