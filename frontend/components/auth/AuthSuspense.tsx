import { useAuth } from "@/components/auth/AuthContext";
// Please use regular react suspense for loading. This component is for displaying a fallback while checking authentication.

import { ReactNode } from "react";
import AuthRedirect from "./AuthRedirect";
import { motion } from "framer-motion";

interface AuthSuspenseProps {
  children: ReactNode;
}

export default function AuthSuspense({ children }: AuthSuspenseProps) {
  const { user } = useAuth();

  return (
    <>
      <AuthRedirect url={"/login"} />
      {user ? (
        <>{children}</>
      ) : (
        <div className="fixed inset-0 flex items-center justify-center">
          <motion.div
            className="w-12 h-12 border-4 border-maroon/30 border-t-maroon rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}
    </>
  );
}
