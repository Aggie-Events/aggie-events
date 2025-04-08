"use client";
import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaClock } from "react-icons/fa";
import IconLabel from "@/components/common/IconLabel";
import EventCard from "@/app/search/_components/_event-display/EventCard";
import { motion } from "framer-motion";
import { SearchEventsReturn } from "@/api/event";
import { formatTimeInterval } from "@/utils/date";
import EventDateDisplay from "@/app/search/_components/_event-display/EventDateDisplay";

interface EventDisplayProps {
  event: SearchEventsReturn;
  onSaveEvent: (eventId: number) => void;
  onBlockEvent: (eventId: number) => void;
  onReportEvent: (eventId: number) => void;
  isSaved: boolean;
  saves: number;
}

export default function EventDisplay({ 
  event,
  onSaveEvent,
  onBlockEvent,
  onReportEvent,
  isSaved,
  saves
}: EventDisplayProps) {
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
      <EventCard 
        event={event} 
        onSaveEvent={onSaveEvent}
        onBlockEvent={onBlockEvent}
        onReportEvent={onReportEvent}
        isSaved={isSaved}
        saves={saves}
      />
    </motion.div>
  );
}
