"use client";
import React, { useEffect, useState } from "react";
import { fetchOrganization } from "@/api/orgs";
import { Organization } from "@/config/dbtypes";

export default function UserList({ update = false }: { update: boolean }) {
  const [users, setUsers] = useState<Organization[]>();

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchOrganization();
      console.log(data);
      setUsers(data);
    };
    fetchData();
  }, [update]);

  return (
    <>
      <div className="my-3">
        <h2 className="text-xl font-bold">All users: </h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Org Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Org ID</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b">{user.org_name}</td>
                  <td className="py-2 px-4 border-b">{user.org_email}</td>
                  <td className="py-2 px-4 border-b">{user.org_id}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
