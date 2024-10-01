"use client"
import React, { useEffect, useState } from "react";
import { User, fetchUsernames } from '@/api/user'

export default function UserList({ update = false }: { update: boolean }) {
    const [users, setUsers] = useState<User[]>();

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchUsernames();
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
                        <th className="py-2 px-4 border-b">Username</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Mod</th>
                    </tr>
                </thead>
                <tbody>
                    {users && users.map((user, index) => (
                        <tr key={index}>
                            <td className="py-2 px-4 border-b">{user.user_name}</td>
                            <td className="py-2 px-4 border-b">{user.user_email}</td>
                            <td className="py-2 px-4 border-b">{user.user_mod.toString()}</td>
                        </tr>
                        
                    ))}
                </tbody>
            </table>
            </div>
        </>
    );
}