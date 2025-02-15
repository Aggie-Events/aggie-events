import { fetchUtil } from "@/api/fetch";

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
