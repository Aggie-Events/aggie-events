"use client";
import React, { useEffect, useState } from "react";
import EventDisplay from "@/app/search/components/event-display/EventDisplay";
import { Event } from "@/config/dbtypes";
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
      <div className="flex flex-col gap-3 my-2">
        {events.map((event: SearchEventsReturn) => (
          <EventDisplay event={event} key={event.event_id} />
        ))}
      </div>
    );
  }
}
