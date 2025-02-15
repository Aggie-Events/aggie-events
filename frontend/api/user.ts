import ToastManager from "@/components/toast/ToastManager";
import { fetchUtil } from "@/api/fetch";

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

/**
 * Update a user
 * @param username - The username of the user
 * @param email - The email of the user
 * @returns The response from the fetch
 */
export const updateUser = async (username: string, email: string) => {
    try {
        const response = await fetchUtil(
            `${process.env.NEXT_PUBLIC_API_URL}/users`,
            {
                method: "PUT",
                body: { username, email },
            },
        );
        return response;
    } catch (error) {
        throw new Error("Error updating user");
    }
};

/**
 * Verify that the user has been updated
 * @param username - The username of the user
 * @returns The response from the fetch
 */
export const verifyUserUpdate = async (username: string) => {
    console.log(`${process.env.NEXT_PUBLIC_API_URL}/users`);
    const response = await fetchUtil(
        `${process.env.NEXT_PUBLIC_API_URL}/users`,
        {
            method: "GET",
        },
    ).catch((error) => {
        throw new Error("Error modifying user: " + error);
    });
    const message = await response.json().then((data) => {
        for (const user of data) {
            console.log(user.user_name);
            if (user.user_name === username) {
                return `User updated successfully to ${username}`;
            }
        }
        return "User not updated!";
    });

    console.log("API Tested: " + message);
    ToastManager.addToast("API Message: " + message, "success", 1000);

    return response.status === 200;
};
