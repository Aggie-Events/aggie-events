import React from "react";
import Link from "next/link";
import Logo from "@/components/common/Logo";
import { FaGithub, FaTwitter, FaInstagram, FaLinkedin, FaXTwitter } from "react-icons/fa6";

const footerLinks = {
  About: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
  Resources: [
    { label: "Help Center", href: "/help" },
    { label: "Create Event", href: "/dashboard/events/create" },
    { label: "Organizations", href: "/organizations" },
    { label: "Calendar", href: "/calendar" },
  ],
  Community: [
    { label: "Browse Events", href: "/search" },
    { label: "Join Organization", href: "/organizations/join" },
    { label: "Feedback", href: "/feedback" },
    { label: "Blog", href: "/blog" },
  ],
};

const socialLinks = [
  { icon: <FaGithub className="text-xl" />, href: "https://github.com/Aggie-Events/aggie-events" },
  { icon: <FaXTwitter className="text-xl" />, href: "https://twitter.com/aggieevents" },
  { icon: <FaInstagram className="text-xl" />, href: "https://instagram.com/aggieevents" },
  { icon: <FaLinkedin className="text-xl" />, href: "https://linkedin.com/company/aggieevents" },
];

export default function Footer() {
  return (
    <footer className="bg-maroon dark:bg-gray-950 text-white font-semibold dark:text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <Logo 
              width={50} 
              height={50} 
              className="brightness-0 invert"
              textClassName="text-lg font-bold italic leading-none text-white"
            />
            <p className="mt-4 text-gray-300 text-sm">
              Your one-stop platform for discovering and creating events at Texas A&M University.
              Connect with organizations, find exciting events, and make the most of your Aggie experience.
            </p>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-lg font-bold mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-gray-300 text-sm">
              © {new Date().getFullYear()} Aggie Events. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
