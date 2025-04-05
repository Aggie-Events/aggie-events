"use client";
import React from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { FaHome, FaCalendarAlt, FaUsers, FaCog, FaExclamationCircle } from "react-icons/fa";
import { useOrgPageInformation } from "@/api/orgs";
import { MdVerified } from "react-icons/md";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import BackButton from "@/components/common/BackButton";

export default function OrgLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { orgParam } = useParams<{ orgParam: string }>();
  const pathname = usePathname();
  const { data: org, isLoading, isError } = useOrgPageInformation(orgParam as string);

  // Navigation tabs for the organization
  const navTabs = [
    { name: "Overview", href: `/orgs/${orgParam}`, icon: <FaHome className="text-lg" /> },
    { name: "Events", href: `/orgs/${orgParam}/events`, icon: <FaCalendarAlt className="text-lg" /> },
    { name: "Members", href: `/orgs/${orgParam}/members`, icon: <FaUsers className="text-lg" /> },
    { name: "Settings", href: `/orgs/${orgParam}/settings`, icon: <FaCog className="text-lg" /> },
  ];

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="w-full px-4 py-8">
          <BackButton />
          
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <FaExclamationCircle className="text-5xl text-maroon mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Organization Not Found</h1>
            <p className="text-gray-600 mb-6">
              The organization you're looking for doesn't exist or has been removed.
            </p>
            <button 
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-maroon text-white rounded-md hover:bg-darkmaroon transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">

        {/* Organization Header */}
        <div className="bg-white shadow-md overflow-hidden mb-8">
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <LoadingSpinner />
              </div>
            ) : org ? (
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {org.org_icon ? (
                      <img 
                        src={org.org_icon} 
                        alt={org.org_name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-semibold text-maroon">
                          {org.org_name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold text-gray-900">{org.org_name}</h1>
                        {org.org_verified && (
                          <MdVerified className="text-maroon text-2xl" />
                        )}
                      </div>
                      <div className="text-gray-500">Reputation: {org.org_reputation}</div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-maroon text-white rounded-full hover:bg-darkmaroon transition-colors">
                    Follow
                  </button>
                </div>

                {/* Navigation Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="flex gap-8 overflow-x-auto pb-1">
                    {navTabs.map((tab) => {
                      const isActive = pathname === tab.href;
                      return (
                        <Link
                          key={tab.name}
                          href={tab.href}
                          className={`flex items-center gap-2 pb-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                            isActive
                              ? "border-maroon text-maroon"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          {tab.icon}
                          {tab.name}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Unable to load organization information</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="px-8 mb-8">{!isLoading && org ? children : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-500">Loading organization content...</p>
          </div>
        )}</div>
      </div>
    </div>
  );
} 