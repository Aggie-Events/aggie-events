'use client'
import RedoAnimText from "./RedoAnimText";
import CursorBlinker from "./CursorBlinker";

// Heavily based off of: https://blog.noelcserepy.com/how-i-created-a-typing-text-animation-with-framer-motion
export default function AnimText({ baseText, texts, delay }: { baseText: string, texts: string[], delay: number }) {
    return (
        <>
            <RedoAnimText baseText={baseText} texts={texts} delay={delay} />
            <CursorBlinker />
        </>
    );
}