"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { useEffect, useState } from "react";
import ToastManager from "@/components/toast/ToastManager";
import LoginScreen from "./LoginScreen";

/**
 * AuthRedirect Component
 * 
 * This component is responsible for showing the login screen
 * if the user is not authenticated.
 * 
 * Props:
 * - url: string - The fallback URL to redirect to (no longer used directly)
 * 
 * Behavior:
 * - If the user state is still loading (user is undefined), the component 
 *   does nothing.
 * - If the user is not authenticated, shows the login screen
 */
export default function AuthRedirect({ url }: { url: string }) {
    const router = useRouter();
    const { user } = useAuth();
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        if (user === undefined) {
            // User state is still loading, do nothing
            return;
        }

        if (!user) {
            ToastManager.addToast("Please sign in to continue", "info", 3000);
            setShowLogin(true);
        }
    }, [user]);

    if (showLogin) {
        return (
            <LoginScreen 
                onClose={() => {
                    setShowLogin(false);
                    ToastManager.addToast("Error, login failed.", "error", 3000);
                    router.push('/');
                }}
            />
        );
    }

    return null;
}
