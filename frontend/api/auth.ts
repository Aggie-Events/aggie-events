import { fetchUtil } from "@/api/fetch";
import type { User } from "@/config/types";

/**
 * Test the authentication status of the user
 * @returns {Promise<boolean>} True if the user is authenticated, false otherwise. 
 */
export const testAuth = async (): Promise<boolean> => {
    console.log("Testing user authentication");
    const response = await fetchUtil(
        `${process.env.NEXT_PUBLIC_API_URL}/auth`,
        {
            method: "GET",
        },
        false,
    ).catch((error) => {
        throw new Error("Error testing user authentication: " + error);
    });

    return response.status === 200;
};

/**
 * Verify the authentication status of the user
 * @returns {Promise<boolean>} True if the user is authenticated, false otherwise. 
 * Throws an error if the user is not authenticated
 */
export const verifyAuth = async (): Promise<boolean> => {
    const response = await fetchUtil(
        `${process.env.NEXT_PUBLIC_API_URL}/auth`,
        {
            method: "GET",
        },
        true,
    ).catch((error) => {
        throw new Error("Error verifying user authentication: " + error);
    });

    return response.status === 200;
};

const POPUP_WIDTH = 500;
const POPUP_HEIGHT = 600;

export function openAuthPopup(url: string): Promise<User | null> {
  return new Promise((resolve) => {
    // Calculate center position for the popup
    const left = window.screenX + (window.outerWidth - POPUP_WIDTH) / 2;
    const top = window.screenY + (window.outerHeight - POPUP_HEIGHT) / 2;

    // Open popup
    const popup = window.open(
      url,
      'Auth',
      `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},left=${left},top=${top},toolbar=no,menubar=no`
    );

    if (!popup) {
      console.error('Failed to open popup window');
      resolve(null);
      return;
    }

    // Handle message from popup
    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      
      if (e.data?.type === 'auth_complete') {
        window.removeEventListener('message', handleMessage);
        popup.close();

        console.log("Received message from popup:", e.data);
        
        if (e.data.user) {
          resolve(e.data.user);
        } else {
          resolve(null);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    // Handle popup closed manually
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', handleMessage);
        resolve(null);
      }
    }, 500);

    // Cleanup after 2 minutes (in case something goes wrong)
    setTimeout(() => {
      clearInterval(checkClosed);
      window.removeEventListener('message', handleMessage);
      if (!popup.closed) popup.close();
      resolve(null);
    }, 120000);
  });
}

export async function updateUsername(username: string): Promise<void> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/username`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to update username');
  }
}
