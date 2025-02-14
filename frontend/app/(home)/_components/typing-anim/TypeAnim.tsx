"use client";
import TypeAnimMutator from "./TypeAnimMutator";
import CursorBlinker from "./CursorBlinker";

// Heavily based off of: https://blog.noelcserepy.com/how-i-created-a-typing-text-animation-with-framer-motion
export default function TypeAnim({
  baseText,
  texts,
  delay,
  className,
}: {
  baseText: string;
  texts: string[];
  delay: number;
  className?: string;
}) {
  return (
    <div className={className}>
      <TypeAnimMutator baseText={baseText} texts={texts} delay={delay} />
      <CursorBlinker />
    </div>
  );
}
