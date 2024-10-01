"use client"
import { useState, useEffect } from 'react'
import ToastManager from './ToastManager'
import { ToastType } from './Toast'
import Toast from './Toast';


export function ToastRenderer() {
    const [toasts, setToasts] = useState<ToastType[]>([]);

    useEffect(() => {
        ToastManager.setAddNotificationCallback(addNotification)
    }, [])
    

    const addNotification = (message: string, type: string, timeout: number) => {
        const newToast = { id: Date.now(), message, type, fading: false };

        // Add the new toast to the list of toasts
        setToasts(toasts => [...toasts, newToast]);

        // Start fading out the toast after the timeout
        setTimeout(() => {
            setToasts(toasts => toasts.map(toast => toast.id === newToast.id ? { ...toast, fading: true } : toast));
            setTimeout(() => {
                onClose(newToast.id);
            }, 500); // Match the transition duration
        }, timeout);
    }

    const onClose = (id: number) => {
        setToasts(toasts => toasts.filter((toast) => toast.id !== id));
    }

    return (
        <>
            {toasts.map((toast) => {
                return (
                    <Toast key={toast.id} message={toast.message} type={toast.type} 
                    onClose={() => onClose(toast.id)} fading={toast.fading} />)
            })}
        </>
    )
}
