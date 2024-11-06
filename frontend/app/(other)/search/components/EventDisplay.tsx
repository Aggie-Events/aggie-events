"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaLocationDot } from "react-icons/fa6";
import { FaClock } from "react-icons/fa";
import IconLabel from "@/app/(other)/search/components/IconLabel";
import EventCard from "@/app/(other)/search/components/EventCard";
import { motion } from "framer-motion";
import { Event } from "@/config/dbtypes";

const hasOrg = true;

export default function EventDisplay({ event }: { event: Event }) {
  return (
    <motion.div
      className="flex gap-2 max-w-[800px] opacity-0 translate-y-2"
      animate={{
        transform: "translateY(0px)",
        opacity: 1,
      }}
    >
      <div className="flex flex-col border-r-2 border-gray-100 shrink-0 pr-2 ">
        <div className="text-maroon-400 font-semibold text-xl">
          {event.date.toLocaleDateString("en-US", {
            weekday: "long",
          }) + ","}
        </div>
        <div className="font-semibold text-xl">
          {event.date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
          })}
        </div>
        <IconLabel text={event.location}>
          <FaLocationDot color="maroon" />
        </IconLabel>
        <IconLabel text={event.time}>
          <FaClock color="maroon" />
        </IconLabel>
      </div>
      <EventCard event={event} />
    </motion.div>
  );
}
