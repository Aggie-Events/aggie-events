import { ToastType } from './Toast';

class ToastManager {
    toasts: ToastType[];
    addToastCallback: (message: string, type: string, timeout: number) => void = () => {};

    constructor() {
        this.toasts = [];
    }

    public setAddNotificationCallback(callback: (message: string, type: string, timeout: number) => void) {
        this.addToastCallback = callback;
    }

    public addToast(message: string, type: string, timeout = 1000) {
        this.addToastCallback(message, type, timeout);
    }
}

export default new ToastManager();
