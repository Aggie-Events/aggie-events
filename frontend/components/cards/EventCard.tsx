"use client";
import Image from "next/image";
import { motion } from "framer-motion";
export interface Event {
  title: string;
  description: string;
  location: string;
  date: string;
  link: string;
  time: string;
}

export default function EventCard() {
  return (
    <>
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.95 }}
        className="border-4 border-lightmaroon bg-slate-100
        rounded-md w-[300px] h-[300px]
        hover:shadow-md relative"
      >
        <div className="h-36 relative">
          <Image
            src="/cat.webp"
            alt="event"
            fill={true}
            className="object-cover"
          />
        </div>
        <div className="relative p-3">
          <h1 className="font-semibold text-lg">Aggie Events Meeting!</h1>
          <h2 className="text-sm">ZACH 461</h2>
        </div>
        <div className="absolute bottom-0 border-t-2 p-2 border-gray-400 w-full">
          <h3 className="text-gray-500">Saturday, November 16, 2024</h3>
          <h3 className="text-gray-500">All-day</h3>
        </div>
      </motion.div>
    </>
  );
}
