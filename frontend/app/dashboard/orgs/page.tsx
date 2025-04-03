"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MdAdd } from "react-icons/md";
import { useOrganizationList } from "@/api/orgs";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function OrganizationsPage() {
  const { data: organizations, isLoading, error } = useOrganizationList();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error loading organizations: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Organizations</h1>
        <Link
          href="/dashboard/orgs/create"
          className="flex items-center gap-2 px-4 py-2 bg-maroon text-white rounded-md hover:bg-maroon-600 transition-colors"
        >
          <MdAdd className="text-xl" />
          New organization
        </Link>
      </div>

      <div className="space-y-4">
        {organizations?.map((org) => (
          <div key={org.org_id} className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {org.org_icon ? (
                  <Image
                    src={org.org_icon}
                    alt={org.org_name}
                    width={32}
                    height={32}
                    className="rounded-md"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                    <span className="text-lg font-semibold text-maroon">
                      {org.org_name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Link 
                    href={`/orgs/${org.org_slug ? org.org_slug : org.org_id}`}
                    className="text-maroon hover:underline font-medium"
                  >
                    {org.org_name}
                  </Link>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                    {org.org_role || "Owner"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/orgs/${org.org_slug ?? org.org_id}/edit`}
                  className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Settings
                </Link>
                <button className="px-3 py-1.5 text-sm bg-gray-100 text-red-600 rounded-md hover:bg-gray-200 transition-colors">
                  Leave
                </button>
              </div>
            </div>
          </div>
        ))}

        {organizations?.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No organizations found.
          </div>
        )}
      </div>
    </div>
  );
} 