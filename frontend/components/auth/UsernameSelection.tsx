import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MdClose, MdCheck, MdWarning } from 'react-icons/md';
import ToastManager from '@/components/toast/ToastManager';
import Image from 'next/image';
import debounce from 'lodash.debounce';
import {useValidation} from '../../api/user'
interface UsernameSelectionProps {
  onSubmit: (username: string) => Promise<void>;
  onClose?: () => void;
}

export default function UsernameSelection({ onSubmit, onClose }: UsernameSelectionProps) {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [ValidUsername, setValidUsername] = useState<boolean | null>(null);

  const checkUsername = useCallback(
    debounce(async (value: string) => {
      if (!value.trim()) {
        setIsAvailable(null);
        setValidUsername(null);
        return;
      }

      setIsChecking(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/exists`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: value }),
        });
        const data = await response.json();
        console.log(data);
        setIsAvailable(!data.exists);
      } catch (error) {
        console.error('Error checking username:', error);
        setIsAvailable(null);
      } finally {
        setIsChecking(false);
      }
    }, 300),
    []
  );
useEffect(() => {
    // If username changes, validate it
    if (username) {
      const validationResult = useValidation(username).isValid;  // Assume validateUsername is a function
        setValidUsername(validationResult);
    }
  }, [username]);  // useEffect will run whenever 'username' changes

  useEffect(() => {
    checkUsername(username);
    return () => checkUsername.cancel();
  }, [username, checkUsername]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      ToastManager.addToast('Please enter a username', 'error', 3000);
      return;
    }

    if (!isAvailable) {
      ToastManager.addToast('This username is already taken', 'error', 3000);
      return;
    }
    
    setIsLoading(true);
    try {
      await onSubmit(username);
      ToastManager.addToast('Username set successfully!', 'success', 3000);
    } catch (error) {
      console.error('Failed to set username:', error);
      ToastManager.addToast('Failed to set username', 'error', 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="relative w-full max-w-md mx-4"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={{
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
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative w-full p-8 bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/10">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors"
          >
            <MdClose size={24} />
          </button>
        )}

        <div className="text-center mb-8">
          <Image
            src="/logo/logo2.png"
            alt="Logo"
            width={64}
            height={64}
            className="mx-auto drop-shadow-lg mb-6"
          />
          <h2 className="text-3xl font-bold text-white drop-shadow-md">
            Choose Your Username
          </h2>
          <p className="mt-2 text-sm text-white/80">
            Pick a unique username for your Aggie Events account
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-4 py-3 bg-white/5 border rounded-lg outline-none transition-all
                ${isAvailable === true && ValidUsername === true ? 'border-green-500/50 focus:border-green-500' : 
                  isAvailable === false || ValidUsername ===false ? 'border-red-500/50 focus:border-red-500' : 
                  'border-white/10 focus:border-white/30'}
                text-white placeholder-white/50`}
              placeholder="Enter your username"
              disabled={isLoading}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isChecking ? (
                <motion.div 
                  className="w-5 h-5 border-2 border-white/30 border-t-white/80 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : username && (
                isAvailable === true && ValidUsername === true ? (
                  <MdCheck className="text-green-500 text-xl" />
                ) : isAvailable === false || ValidUsername === false ? (
                  <MdWarning className="text-red-500 text-xl" />
                ) : null
              )}
            </div>
          </div>
         
          {username && !isChecking && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-sm ${
                isAvailable === true && ValidUsername === true ? 'text-green-400' :
                isAvailable === false || ValidUsername === false  ? 'text-red-400' :
                'text-white/60'
              }`}
            >
              {isAvailable === true && ValidUsername === true ? '✓ Username is available' :
               isAvailable === false  ? '✗ Username is already taken' :
               ValidUsername === false ? '✗ Please use a valid username without special characters or spaces.' :
               'Checking username availability...'}
            </motion.p>
          )}
            
          <button
            type="submit"
            disabled={isLoading || !isAvailable || isChecking}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all
              ${isLoading || !isAvailable || isChecking
                ? 'bg-white/10 cursor-not-allowed'
                : 'bg-white/20 hover:bg-white/30'
              }`}
          >
            {isLoading ? 'Setting username...' : 'Continue'}
          </button>
        </form>
      </div>
    </motion.div>
  );
} 