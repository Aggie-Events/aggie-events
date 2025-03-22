"use client";
import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaClock } from "react-icons/fa";
import IconLabel from "@/components/common/IconLabel";
import EventCard from "@/app/search/_components/event-display/EventCard";
import EventImage from "@/app/search/_components/event-display/EventImage";
import { motion } from "motion/react";
import { SearchEventsReturn } from "@/api/event";
import { formatTimeInterval } from "@/utils/date";
import EventDateDisplay from "@/app/search/_components/event-display/EventDateDisplay";

export default function EventDisplay({ event }: { event: SearchEventsReturn }) {
  return (
    <motion.div
      className="flex gap-4 w-full"
      initial={{
        opacity: 0,
        transform: "translateY(4px)",
      }}
      animate={{
        transform: "translateY(0px)",
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transform: "translateY(4px)",
      }}
    >
      <EventDateDisplay event={event} />
      <EventCard event={event} />
      {/* <EventImage event={event} /> */}
    </motion.div>
  );
}
