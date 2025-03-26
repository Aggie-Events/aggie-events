"use client";
import React, { Suspense } from "react";
import EventDisplay from "@/app/search/_components/event-display/EventDisplay";
import { SearchEventsReturn } from "@/api/event";

export default function EventList({
  events,
}: {  
  events: SearchEventsReturn[] | undefined;
}) {
  if (!events) {
    return (
      <div className="my-2">
        <div>
          <p>No Results</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="space-y-4">
        {events.map((event: SearchEventsReturn) => (
          <EventDisplay key={event.event_id} event={event} />
        ))}
      </div>
    );
  }
}
