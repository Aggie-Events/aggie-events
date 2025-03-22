"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MdAdd, MdEdit, MdDelete, MdPeople } from "react-icons/md";
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
        <h1 className="text-2xl font-bold text-gray-800">Organizations</h1>
        <Link
          href="/dashboard/orgs/create"
          className="flex items-center gap-2 px-4 py-2 bg-maroon text-white rounded-md hover:bg-darkmaroon transition-colors"
        >
          <MdAdd className="text-xl" />
          Create Organization
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations?.map((org) => (
          <div key={org.org_id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-4">
                {org.org_icon && (
                  <Image
                    src={org.org_icon}
                    alt={org.org_name}
                    width={60}
                    height={60}
                    className="rounded-lg object-cover"
                  />
                )}
                <div className="flex flex-col">
                  <Link href={`/orgs/${org.org_slug ? org.org_slug : org.org_id}`} className="text-lg font-semibold text-gray-900 hover:text-maroon hover:underline transition-colors">{org.org_name}</Link>
                  <span className="text-sm text-gray-500">Member</span>
                </div>
              </div>

              {org.org_description && (
                <p className="mt-4 text-sm text-gray-600 line-clamp-2">
                  {org.org_description}
                </p>
              )}

              <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Reputation</div>
                  <div className="mt-1 text-xl font-semibold text-gray-900">
                    {org.org_reputation}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Status</div>
                  <div className="mt-1 text-sm font-semibold text-gray-900">
                    {org.org_verified ? "Verified" : "Unverified"}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Link
                  href={`/dashboard/organizations/${org.org_slug ?? org.org_id}/members`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <MdPeople className="text-xl" />
                  Members
                </Link>
                <Link
                  href={`/dashboard/organizations/${org.org_slug ?? org.org_id}/edit`}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <MdEdit className="text-xl" />
                </Link>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors">
                  <MdDelete className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {organizations?.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No organizations found.
          </div>
        )}
      </div>
    </div>
  );
} 