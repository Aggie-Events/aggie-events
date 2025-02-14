"use client";
import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    if (user) {
      router.push(callbackUrl);
    }
  }, [user, router, callbackUrl]);

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_AUTH_URL}/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 animate-hue-rotate" />
      </div>

      {/* Glass Card */}
      <div className="relative max-w-md w-full m-4 p-8 bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/10">
        {/* Logo and Title */}
        <div className="text-center">
          <Image
            src="/logo/logo2.png"
            alt="Logo"
            width={64}
            height={64}
            className="mx-auto drop-shadow-lg"
          />
          <h2 className="mt-6 text-3xl font-bold text-white drop-shadow-md">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-white/80">
            Sign in to access your account
          </p>
        </div>

        {/* Login Options */}
        <div className="mt-8 space-y-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white rounded-md shadow-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white/50 transition group"
          >
            <FcGoogle size={20} className="group-hover:scale-110 transition" />
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-white/80">
            By signing in, you agree to our{" "}
            <a href="#" className="text-white hover:text-white/80 underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-white hover:text-white/80 underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
