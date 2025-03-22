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
      <div className="flex flex-col gap-3 my-2 w-full">
        <Suspense fallback={<div>Loading...</div>}>
          {events.map((event: SearchEventsReturn) => (
            <EventDisplay event={event} key={event.event_id} />
          ))}
        </Suspense>
      </div>
    );
  }
}
