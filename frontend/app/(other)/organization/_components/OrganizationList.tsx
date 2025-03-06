"use client";
import React from "react";
import { useOrganizationList } from "@/api/orgs";
import { Organization } from "@/config/dbtypes";

function Loading() {
  return <div>Loading organizations...</div>;
}

export default function OrganizationList() {
  const { data: organizations, isLoading, error } = useOrganizationList();

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading organizations: {error.message}</div>;

  return (
    <>
      <div className="my-3">
        <h2 className="text-xl font-bold">All Organizations: </h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Org Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Org ID</th>
            </tr>
          </thead>
          <tbody>
            {organizations &&
              organizations.map((org, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b">{org.org_name}</td>
                  <td className="py-2 px-4 border-b">{org.org_email}</td>
                  <td className="py-2 px-4 border-b">{org.org_id}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
