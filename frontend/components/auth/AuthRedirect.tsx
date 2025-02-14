"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { useEffect } from "react";
import ToastManager from "@/components/toast/ToastManager";

/**
 * AuthRedirect Component
 * 
 * This component is responsible for redirecting users to a specified URL 
 * if they are not authenticated. 
 * 
 * Props:
 * - url: string - The URL to redirect to if the user is not logged in.
 * 
 * Behavior:
 * - If the user state is still loading (user is undefined), the component 
 *   does nothing.
 * - If the user is not authenticated, a toast message is displayed to 
 *   inform the user that they are being redirected to the login page, 
 *   and then the router pushes the specified URL.
 */
export default function AuthRedirect({ url }: { url: string }) {
    const router = useRouter();
    const { user } = useAuth();
    useEffect(() => {
        if (user === undefined) {
            // User state is still loading, do nothing
            return;
        }

        if (!user) {
            ToastManager.addToast("Unauthorized resource. Redirecting to login.", "error", 3000);
            router.push(url);
        }
    }, [user]);
    return null;
}
