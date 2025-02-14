"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MdAdd, MdEdit, MdDelete, MdPeople } from "react-icons/md";

export default function OrganizationsPage() {
  const organizations = [
    {
      id: 1,
      name: "Texas A&M Athletics",
      role: "Admin",
      members: 50,
      events: 12,
      logo: "/images/placeholder.jpg",
    },
    {
      id: 2,
      name: "Memorial Student Center",
      role: "Member",
      members: 30,
      events: 8,
      logo: "/images/placeholder.jpg",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Organizations</h1>
        <Link
          href="/dashboard/organizations/create"
          className="flex items-center gap-2 px-4 py-2 bg-maroon text-white rounded-md hover:bg-darkmaroon transition-colors"
        >
          <MdAdd className="text-xl" />
          Create Organization
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map((org) => (
          <div key={org.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-4">
                <Image
                  src={org.logo}
                  alt={org.name}
                  width={60}
                  height={60}
                  className="rounded-lg"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{org.name}</h3>
                  <span className="text-sm text-gray-500">{org.role}</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Members</div>
                  <div className="mt-1 text-xl font-semibold text-gray-900">
                    {org.members}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Events</div>
                  <div className="mt-1 text-xl font-semibold text-gray-900">
                    {org.events}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Link
                  href={`/dashboard/organizations/${org.id}/members`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <MdPeople className="text-xl" />
                  Members
                </Link>
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                  <MdEdit className="text-xl" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors">
                  <MdDelete className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 