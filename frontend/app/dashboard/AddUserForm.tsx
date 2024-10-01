"use client";
import { useState } from "react"
import UserList from "./UserList"
import { useAuth } from '@/components/auth/AuthContext'
import { addUser, deleteUser } from "@/api/user"
import { testAuth } from "@/api/auth"

export default function AddUserForm() {
  const { user } = useAuth()
  const [username, setUsername] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [update, setUpdate] = useState<boolean>(false);

  return (<>
    {/* {user?  */}
    {/* ( */}
    <div className="bg-gray-200 rounded-lg p-4 my-3">
      {user && <h1 className="text-xl font-bold">Welcome, {user.user_name}!</h1>}
      <div className="my-2">
        <input type="text"
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
        <button onClick={() => {
          addUser(username!, email!)
          setUpdate(!update)
        }}
          className="bg-blue-500 rounded-md px-2 py-1">
          Create user
        </button>
      </div>
      <div className="my-2">
        <button className="bg-red-400 rounded-md px-2 py-1" onClick={() => {
          deleteUser()
          setUpdate(!update)
        }}>
          Delete users
        </button>
      </div>
      <div className="my-2">
        <button className="bg-green-400 rounded-md px-2 py-1" onClick={testAuth}>
          Test authentication
        </button>
      </div>
      <div className="mx-3 w-2/5">
        <UserList update={update} />
      </div>
    </div>
    {/* ):(
      // <h1 className="text-xl my-4">Please log in to see the dashboard.</h1>
      // )}*/}
  </>);
}