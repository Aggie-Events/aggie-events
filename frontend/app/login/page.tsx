"use client"
import Image from 'next/image'
import { useAuth } from '@/components/auth/AuthContext'

export default function Login() {
    const { user, logout } = useAuth()
    const handleGoogleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_AUTH_URL}/google`
    }
    
    return (
        <>
            <h1 className="text-3xl my-4">User Page</h1>
            <button onClick={handleGoogleLogin}
                className="bg-blue-400 p-4 m-2 rounded-md">
                Log in with Google
            </button>

            <button onClick={logout}
                className="bg-red-400 p-4 m-2 rounded-md">
                Log out
            </button>

            {user && (<>
                <h2>Welcome, {user.user_name}!</h2>
                <h2>Email: {user.user_email}</h2>
                <Image src={user.picture} width={200} height={200} alt="User Picture" /></>
            )}
        </>
    )
}
