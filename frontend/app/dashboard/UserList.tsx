"use client"
import React, { useEffect, useState } from "react";

export default function UserList({ update = false }: { update: boolean }) {
    const [usernames, setUsernames] = useState<string[]>([]);

    useEffect(() => {
        const fetchUsernames = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/usernames`);
                const usernames = await response.json();
                setUsernames(usernames.map((user) => user.user_name));
            } catch (error) {
                console.error('Error fetching usernames:', error);
            }
        };
        console.log("Fetching usernames...");
        fetchUsernames();
    }, [update]);

    return (
        <>
            <h2>All usernames: </h2>
            <ul>
                {usernames.map((username, index) => (
                    <li key={index}>{username}</li>
                ))}
            </ul>
        </>
    );
}