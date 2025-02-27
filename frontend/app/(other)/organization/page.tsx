"use client";
import React, { useState } from "react";
import Link from "next/link";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import ToastManager from "@/components/toast/ToastManager";
import { useEventsByUser } from "@/api/event";
import { getAllOrg } from "@/api/organizations";
import { useAuth } from "@/components/auth/AuthContext";
import { EventStatus } from "@/config/query-types";
import { CreateOrgData } from "@/api/organizations";

const orgs: CreateOrgData[] = await getAllOrg();
export default function AllOrganizations() {
  return (
    <div className="space-y-6 p-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">My Organizations</h1>
      </div>

      {!orgs || orgs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">You haven't created any events yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Building
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orgs.map((org) => (
                  <tr key={org.org_name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {org.org_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {org.org_description}
                      </div>
                      <div className="text-sm text-gray-500">
                    
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {org.org_building}
                      </div>
                      <div className="text-sm text-gray-500">
                    
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {org.org_room}
                      </div>
                      <div className="text-sm text-gray-500">
                    
                      </div>
                    </td>
                    
                  </tr>
                ))}
              </tbody>
              
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 