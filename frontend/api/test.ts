import { fetchUtil } from '@/api/fetch';
import ToastManager from '@/components/toast/ToastManager';

// Won't throw an error if the user is not authenticated
export const testApi = async () => {
    console.log("Testing api route")
    const response = await fetchUtil(`${process.env.NEXT_PUBLIC_API_URL}/test`, {
        method: 'GET',
    }).catch((error) => {
        throw new Error('Error testing api: ' + error);
    });

    console.log("API Tested: " + response)
    ToastManager.addToast('API Tested' + response, 'success', 1000);

    return response.status === 200
};