'use client'
import { useEffect, useState } from 'react'

export interface ToastType {
    id: number;
    message: string;
    type: string;
    fading: boolean;
}

export default function Toast({ message, type, onClose, fading }: 
    { message: string, type: string, onClose: () => void, fading: boolean }) {
    const [visible, setVisible] = useState(true);
    const color = type === "error" ? " bg-red-500" : " bg-green-500";
    const border_color = type === "error" ? " border-red-700" : " border-green-700";
    
    useEffect(() => {
        if (fading) {
            setVisible(false);
        } else {
            setVisible(true);
        }
    }, [visible, fading]);

    return (
        <div
            className={`p-2 m-2 border-l-8 inline-block rounded-sm text-gray-100 fixed right-5 bottom-10 ${color} ${border_color} ${!visible ? 'opacity-0 transition-opacity duration-500' : 'opacity-100'}`}
        >
            {message}
            <button className="float-right mx-3 font-bold" onClick={onClose}>x</button>
        </div>
    );
}