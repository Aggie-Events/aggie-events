import ToastManager from "@/components/toast/ToastManager";
import { fetchUtil } from "@/api/fetch";
import { SearchEventsReturn } from "./event";
import { useQuery } from "@tanstack/react-query";

export interface User {
  user_email: string;
  user_id: number;
  user_mod: boolean;
  user_name: string;
}

/**
 * Add a user
 * @param username - The username of the user
 * @param email - The email of the user
 * @returns The response from the fetch
 */
export const addUser = async (username: string, email: string) => {
  try {
    const response = await fetchUtil(
      `${process.env.NEXT_PUBLIC_API_URL}/users`,
      {
        method: "POST",
        body: { username, email },
      },
    );
    console.log("User added successfully", response);
  } catch (error) {
    throw new Error("Error adding user: " + error);
  }
};

/**
 * Fetch all users
 * @returns List of users
 */
export const fetchUsernames = async (): Promise<User[]> => {
  try {
    const response = await fetchUtil(
      `${process.env.NEXT_PUBLIC_API_URL}/users`,
      {
        method: "GET",
      },
    );
    return response.json() ?? [];
  } catch (error) {
    throw new Error("Error fetching users" + error);
  }
};

/**
 * Delete all users
 * @returns The response from the fetch
 */
export const deleteUser = async () => {
  try {
    const response = await fetchUtil(
      `${process.env.NEXT_PUBLIC_API_URL}/users`,
      {
        method: "DELETE",
      },
    );
  } catch (error) {
    throw new Error("Error deleting users");
  }
};

export interface UserProfile {
  user_id: number;
  user_name: string | null;
  user_displayname: string;
  user_email: string;
  user_verified: boolean;
  user_major: string | null;
  user_year: number | null;
  user_description: string | null;
  user_profile_img: string | null;
  events: SearchEventsReturn[];
  organizations: {
    org_id: number;
    org_name: string;
    org_description: string | null;
    org_icon: string | null;
  }[];
}

/**
 * Get user profile information including their events and organization affiliations
 * @param {string} username - The username of the user to fetch
 * @returns {UseQueryResult<UserProfile>, Error>} The user profile information
 */
export function useUserProfile(username: string) {
  return useQuery<UserProfile, Error>({
    queryKey: ["userProfile", username],
    queryFn: async () => {
      const response = await fetchUtil(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${username}/profile`,
        {
          method: "GET",
        },
      );
      ``;
      const userData = await response.json();

      if (!userData || userData.message === "User not found") {
        throw new Error("User not found");
      }

      return {
        ...userData,
        events: userData.events.map((e: any) => ({
          ...e,
          start_time: new Date(e.start_time),
          end_time: new Date(e.end_time),
          date_created: new Date(e.date_created),
          date_modified: new Date(e.date_modified),
        })),
      };
    },
    retry: false,
  });
}
export function isUsernameValid(username: string) {
  if (!username || typeof username !== "string") {
    return {
      message: "Username is required",
      isValid: false,
    };
  }

  // Check length constraints or other format validations
  if (username.length > 20 || username.length < 3) {
    return {
      isValid: false,
      message: "Username is too long",
    };
  }
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    return {
      isValid: false,
      message: "Username must be alphanumeric",
    };
  }
  return {
    isValid: true,
    message: "Username is valid",
  };
}
