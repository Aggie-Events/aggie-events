"use client";
import React, { useState } from "react";
import UserList from "./UserList";
import { useAuth } from "@/components/auth/AuthContext";
import { addUser, deleteUser } from "@/api/user";

export default function Dashboard() {
  const { user } = useAuth();
  const [page, setPage] = useState<number>(0);
  const options = ["Users"];
  return (
    <div className="flex grow justify-center mt-5 h-full">
      <div className="max-w-[1000px] w-full">
        <ul className="flex gap-2">
          {options.map((option, i) => (
            <li
              className={
                "px-3 py-1 rounded-t-lg " +
                (page === i && "bg-maroon-500 text-white")
              }
              key={i}
            >
              <button onClick={() => setPage(i)}>{option}</button>
            </li>
          ))}
        </ul>
        <div className="p-2 bg-gray-200 rounded-b-lg">
          {user && (
            <h1 className="text-xl font-bold">Welcome, {user.user_name}!</h1>
          )}
          {page === 0 && <UserForm />}
        </div>
      </div>
    </div>
  );
}

function UserForm() {
  const [username, setUsername] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [update, setUpdate] = useState<boolean>(false);

  return (
    <>
      <div className="my-2">
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          className="border border-gray-300 bg-gray-100 p-1 rounded mr-2"
        />
        <input
          type="text"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 bg-gray-100 p-1 rounded mr-2"
        />
        <button
          onClick={() => {
            addUser(username!, email!);
            setUpdate(!update);
          }}
          className="bg-blue-500 rounded-md px-2 py-1"
        >
          Create user
        </button>
      </div>
      <div className="my-2">
        <button
          className="bg-red-400 rounded-md px-2 py-1"
          onClick={() => {
            deleteUser();
            setUpdate(!update);
          }}
        >
          Delete users
        </button>
      </div>
      <div className="mx-3 w-2/5">
        <UserList update={update} />
      </div>
    </>
  );
}

