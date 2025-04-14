import { useAuth } from "@/components/auth/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { MdClose } from "react-icons/md";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { openAuthPopup, updateUsername } from "@/api/auth";
import ToastManager from "@/components/toast/ToastManager";
import UsernameSelection from "./UsernameSelection";
import type { User } from "@/config/types";

interface LoginScreenProps {
  onClose?: () => void;
  showBackButton?: boolean;
}

export default function LoginScreen({ onClose, showBackButton = true }: LoginScreenProps) {
  const { setUser } = useAuth();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showUsernameSelection, setShowUsernameSelection] = useState(false);
  const [tempUserData, setTempUserData] = useState<User | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Logout failed');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      window.location.reload();
    }
  };

  const handleUsernameSelectionClose = async () => {
    setShowUsernameSelection(false);
    await handleLogout();
    ToastManager.addToast('Username selection cancelled. Please try signing in again.', 'error', 3000);
    if (onClose) onClose();
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const user = await openAuthPopup(`${process.env.NEXT_PUBLIC_AUTH_URL}/google`);
      if (user) {
        console.log("User:", user);
        if (!user.user_name) {
          // If user has no username, show username selection
          setTempUserData({
            ...user,
            user_name: '',
            user_displayname: user.user_displayname || ''
          });
          setShowUsernameSelection(true);
        } else {
          // If user has username, complete login
          setUser(user);
          if (onClose) onClose();
          ToastManager.addToast('Successfully signed in!', 'success', 3000);
          window.location.reload();
        }
      } else {
        ToastManager.addToast('Sign in was cancelled or failed', 'error', 3000);
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      ToastManager.addToast('Failed to sign in', 'error', 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameSubmit = async (username: string) => {
    if (!tempUserData) return;
    
    try {
      await updateUsername(username);
      const updatedUser: User = {
        ...tempUserData,
        user_name: username,
        user_displayname: username
      };
      setUser(updatedUser);
      if (onClose) onClose();
      ToastManager.addToast('Successfully signed in!', 'success', 3000);
      window.location.reload();
    } catch (error) {
      console.error('Error updating username:', error);
      throw error;
    }
  };

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else if (document.referrer && document.referrer.includes(window.location.hostname)) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: -20,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  if (showUsernameSelection) {
    return (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={overlayVariants}
      >
        <UsernameSelection 
          onSubmit={handleUsernameSubmit}
          onClose={handleUsernameSelectionClose}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={overlayVariants}
      onClick={onClose}
    >
      <motion.div 
        className="relative w-full max-w-md mx-4 bg-black/10 backdrop-blur-lg p-8 rounded-xl shadow-2xl border border-white/10"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={cardVariants}
        onClick={(e) => e.stopPropagation()}
      >
          {/* Back Button */}
          {showBackButton && (
            <button
              onClick={handleBack}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors"
            >
              <MdClose size={24} />
            </button>
          )}

          {/* Logo and Title */}
          <div className="text-center mb-8">
            <Image
              src="/logo/logo2.png"
              alt="Logo"
              width={64}
              height={64}
              className="mx-auto drop-shadow-lg mb-6"
            />
            <motion.h2 
              className="text-3xl font-bold text-white drop-shadow-md"
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </motion.h2>
            <motion.p 
              className="mt-2 text-sm text-white/80"
              key={isLogin ? 'login-desc' : 'register-desc'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {isLogin 
                ? 'Access your Aggie Events account' 
                : 'Join the Aggie Events community'}
            </motion.p>
          </div>

          {/* Auth Options */}
          <div className="space-y-4">
            <button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-3 px-4 py-3 bg-white rounded-md shadow-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white/50 transition group ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              <FcGoogle size={20} className={`transition ${isLoading ? '' : 'group-hover:scale-110'}`} />
              <span>
                {isLoading 
                  ? 'Connecting...' 
                  : (isLogin ? 'Continue with Google' : 'Sign up with Google')}
              </span>
            </button>
          </div>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center">
            <p className="text-sm text-white/80">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-white hover:text-white/80 underline font-medium"
                disabled={isLoading}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-white/80">
              By {isLogin ? 'signing in' : 'signing up'}, you agree to our{" "}
              <a href="#" className="text-white hover:text-white/80 underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-white hover:text-white/80 underline">
                Privacy Policy
              </a>
            </p>
          </div>
      </motion.div>
    </motion.div>
  );
} 