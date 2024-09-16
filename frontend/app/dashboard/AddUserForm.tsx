"use client";
import { useEffect, useState } from "react"
import UserList from "./UserList"

export default function AddUserForm() {
  const [username, setUsername] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [update, setUpdate] = useState<boolean>(false);

  const addUser = async (username: string, email: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username: username, email: email})
    });
    setUpdate(!update)
  }

  return (<>
    <input 
        type="text" 
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username" 
      />
    <input type="text" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)}/>
    <button onClick={() => { addUser(username, email)}}>Create user</button>
    <UserList update={update} />
  </>);
}