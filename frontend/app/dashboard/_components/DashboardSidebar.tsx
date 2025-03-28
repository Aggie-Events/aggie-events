import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdDashboard, MdEvent, MdGroup, MdSettings, MdCode } from "react-icons/md";
import { useSidebar } from "@/components/layout/SidebarContext";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: <MdDashboard /> },
  { href: "/dashboard/events", label: "Events", icon: <MdEvent /> },
  { href: "/dashboard/orgs", label: "Organizations", icon: <MdGroup /> },
  { href: "/dashboard/development", label: "Development", icon: <MdCode /> },
  { href: "/dashboard/settings", label: "Settings", icon: <MdSettings /> },
];

export default function DashboardSidebar() {
  const { isOpen } = useSidebar();
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (href === '/dashboard') {
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
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
} 