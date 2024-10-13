'use client'
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/AuthContext"
import { useEffect } from "react"

export default function AuthRedirect({ url }: { url: string }) {
    const router = useRouter()
    const { user } = useAuth()
    useEffect(() => {
        if (user === undefined) {
            // User state is still loading, do nothing
            return
        }

        if (!user) {
            router.push(url)
        }
    }, [user])

    return <></>
}