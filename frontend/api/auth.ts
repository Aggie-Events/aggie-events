import { fetchUtil } from '@/api/fetch';

// Won't throw an error if the user is not authenticated
export const testAuth = async (): Promise<boolean> => {
    console.log("Testing user authentication")
    const response = await fetchUtil(`${process.env.API_URL}/auth`, {
        method: 'GET',
    }).catch((error) => {
        throw new Error('Error testing user authentication: ' + error);
    });

    console.log("User authenticated: " + response)

    return response.status === 200
};

// Will throw an error if the user is not authenticated
export const verifyAuth = async (): Promise<boolean> => {
    const response = await fetchUtil(`${process.env.API_URL}/auth`, {
        method: 'GET',
    }).catch((error) => {
        throw new Error('Error verifying user authentication: ' + error);
    });

    return response.status === 200;
};
