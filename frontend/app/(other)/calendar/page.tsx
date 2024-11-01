// app/calendar/page.tsx
"use client";

import React from "react";
import { useState } from "react";
import Calendar from "@/app/(other)/calendar/components/Calendar";
import EventModal from "@/app/(other)/calendar/components/EventModal";

interface Events {
  [key: string]: string[]; // Date string as key, event array as value
}

export default function CalendarPage(): JSX.Element {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Events>({});

  const handleDateClick = (date: Date): void => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const handleSaveEvent = (event: string): void => {
    if (!selectedDate) return;

    const dateKey = selectedDate.toISOString().split("T")[0];
    setEvents((prevEvents) => ({
      ...prevEvents,
      [dateKey]: [...(prevEvents[dateKey] || []), event],
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Calendar</h1>
      <Calendar onDateClick={handleDateClick} />
      {showModal && selectedDate && (
        <EventModal
          selectedDate={selectedDate}
          onClose={() => setShowModal(false)}
          onSave={handleSaveEvent}
        />
      )}
      {/* Event summary for debugging */}
      <pre>{JSON.stringify(events, null, 2)}</pre>
    </div>
  );
}
