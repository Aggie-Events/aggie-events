import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdDashboard,
  MdEvent,
  MdGroup,
  MdSettings,
  MdCode,
  MdNotifications,
} from "react-icons/md";
import { useSidebar } from "@/components/context-providers/SidebarContext";
import NotificationService from "@/api/notifications";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: <MdDashboard /> },
  { href: "/dashboard/events", label: "Events", icon: <MdEvent /> },
  { href: "/dashboard/orgs", label: "Organizations", icon: <MdGroup /> },
  { href: "/notifications", label: "Notifications", icon: <MdNotifications /> },
  { href: "/dashboard/development", label: "Development", icon: <MdCode /> },
  { href: "/dashboard/settings", label: "Settings", icon: <MdSettings /> },
];

export default function DashboardSidebar() {
  const { isOpen } = useSidebar();
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notifications = await NotificationService.getNotifications();
        const unread = notifications.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();

    // Check for new notifications periodically
    const interval = setInterval(fetchNotifications, 60000); // every minute

    return () => clearInterval(interval);
  }, []);

  const isLinkActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  if (!isOpen) return null;

  return (
    <aside className="w-64 bg-gray-50 border-r">
      <nav className="p-4">
        <ul className="space-y-2">
          {sidebarLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  isLinkActive(link.href)
                    ? "bg-maroon text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {link.icon}
                <span>{link.label}</span>

                {/* Notification Badge */}
                {link.href === "/notifications" && unreadCount > 0 && (
                  <span
                    className={`ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full ${
                      isLinkActive(link.href)
                        ? "bg-white text-maroon"
                        : "bg-maroon text-white"
                    }`}
                  >
                    {unreadCount}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
