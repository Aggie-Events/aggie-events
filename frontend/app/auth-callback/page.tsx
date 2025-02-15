"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    async function handleCallback() {
      // If there's no opener, this page was accessed directly
      if (!window.opener) {
        router.replace('/');
        return;
      }

      try {
        // Fetch the user data
        const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/user`, {
          credentials: 'include'
        });
        const data = await response.json();

        // Send message to parent window
        if (data && data.user_email) {
          window.opener.postMessage({
            type: 'auth_complete',
            user: {
              user_email: data.user_email,
              user_name: data.user_name,
              user_img: data.user_img,
              user_id: data.user_id
            }
          }, window.location.origin);
        } else {
          window.opener.postMessage({
            type: 'auth_complete',
            user: null
          }, window.location.origin);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        window.opener.postMessage({
          type: 'auth_complete',
          user: null
        }, window.location.origin);
      }
    }

    handleCallback();
  }, [router]);

  return (
    <div className="p-2">
        <h1 className="text-2xl font-bold mb-4">Authentication Complete</h1>
        <p>This window will close automatically.</p>
    </div>
  );
} 