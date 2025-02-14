"use client";
import { motion } from "framer-motion";

export default function CursorBlinker() {
  return (
    <motion.div
      animate={{
        opacity: [0, 0, 1, 1],
        transition: {
          duration: 1,
          repeat: Infinity,
          repeatDelay: 0,
          ease: "linear",
          times: [0, 0.5, 0.5, 1],
        },
      }}
      className="inline-block h-16 w-[1px] translate-y-1 bg-white"
    />
  );
}
