import ToastManager from '@/components/toast/ToastManager';

interface FetchOptions extends RequestInit {
    body?: any;
}

export const fetchUtil = async (url: string, options: FetchOptions = {}) => {
    const { body, ...restOptions } = options;

    const response = await fetch(url, {
        ...restOptions,
        headers: {
            'Content-Type': 'application/json',
            ...restOptions.headers,
        },
        credentials: 'include',
        body: body ? JSON.stringify(body) : undefined,
    }).catch((error) => {
        ToastManager.addToast('Server Error', 'error', 1000);
        console.error('Fetch error:', error);
        throw error;
    });

    if (response.status === 401) {
        const errorText = response.text();
        console.error('Unauthorized:', errorText);
        ToastManager.addToast('Unauthorized', 'error', 1000);
        throw new Error("Unauthorized resource");
    }
    
    return response;
};