import { fetchUtil } from '@/api/fetch';
import ToastManager from '@/components/toast/ToastManager';

// Won't throw an error if the user is not authenticated
export const testApi = async () => {
    console.log("Testing api route")
    console.log(`${process.env.NEXT_PUBLIC_API_URL}/test`)
    const response = await fetchUtil(`${process.env.NEXT_PUBLIC_API_URL}/test`, {
        method: 'GET',
    }).catch((error) => {
        throw new Error('Error testing api: ' + error);
    });

    const message = await response.json().then(data => {return data.message})
    console.log("API Tested: " + message)
    ToastManager.addToast('API Message: ' + message, 'success', 1000);

    return response.status === 200
};