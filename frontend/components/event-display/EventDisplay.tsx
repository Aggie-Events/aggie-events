"use client";
import React, { useState } from "react";
import EventCard from "@/components/event-display/EventCard";
import { motion, AnimatePresence } from "framer-motion";
import { SearchEventsReturn } from "@/api/event";
import EventDateDisplay from "@/components/event-display/EventDateDisplay";

interface EventDisplayProps {
  event: SearchEventsReturn;
  onSaveEvent: (eventId: number) => void;
  onBlockEvent: (eventId: number) => void;
  onReportEvent: (eventId: number) => void;
  onCardClick: () => void;
  isSaved: boolean;
  saves: number;
  isActive: boolean;
}

export default function EventDisplay({
  event,
  onSaveEvent,
  onBlockEvent,
  onReportEvent,
  onCardClick,
  isSaved,
  saves,
  isActive,
}: EventDisplayProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="flex gap-4 w-full cursor-pointer group relative text-left border-none"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onCardClick}
    >
      <EventDateDisplay event={event} />
      <EventCard
        event={event}
        onSaveEvent={onSaveEvent}
        onBlockEvent={onBlockEvent}
        onReportEvent={onReportEvent}
        isSaved={isSaved}
        saves={saves}
        isActive={isHovered || isActive}
      />
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute bottom-3 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium text-gray-600 pointer-events-none shadow-sm"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            Click to view details
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
