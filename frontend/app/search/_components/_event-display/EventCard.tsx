import React from "react";
import Image from "next/image";
import { FaTag, FaBookmark } from "react-icons/fa";
import Link from "next/link";
import { SearchEventsReturn } from "@/api/event";
import IconLabel from "@/components/common/IconLabel";
import EventImage from "@/app/search/_components/_event-display/EventImage";
import SaveButton from "@/app/search/_components/_event-display/SaveButton";
import EventMenu from "@/app/search/_components/_event-display/EventMenu";

interface EventCardProps {
  event: SearchEventsReturn;
  onSaveEvent: (eventId: number) => void;
  onBlockEvent: (eventId: number) => void;
  onReportEvent: (eventId: number) => void;
  isSaved: boolean;
  saves: number;
}

export default function EventCard({
  event,
  onSaveEvent,
  onBlockEvent,
  onReportEvent,
  isSaved,
  saves,
}: EventCardProps) {
  return (
    <div className="bg-gray-150 rounded-lg py-3 px-3 grow shadow-md w-full border-[1px] border-gray-200">
      <div className="flex gap-4">
        <EventImage event={event} />
        <div className="grow my-auto">
          <Link
            className="text-2xl font-semibold text-maroon w-fit hover:underline"
            href={`/events/${event.event_id}`}
          >
            {event.event_name}
          </Link>

          <p className="h-max line-clamp-3">{event.event_description}</p>
          
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 my-2">
              {event.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/search?tags=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-200 text-xs text-gray-700 rounded-full hover:bg-maroon hover:text-white transition-colors"
                >
                  <FaTag className="w-3 h-3" />
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center h-fit gap-2">
          <SaveButton
            isSaved={isSaved}
            onSaveEvent={onSaveEvent}
            eventId={event.event_id}
          />
          <EventMenu
            onBlockEvent={onBlockEvent}
            onReportEvent={onReportEvent}
            eventId={event.event_id}
          />
        </div>
      </div>

      <hr className="mt-3 mb-1"/>

      <div className="flex items-center gap-1.5 h-fit">
        <p className="text-sm w-fit">
          {event.org_id ? (
            <>
              Hosted by{" "}
              <Link
                className="text-maroon hover:underline"
                href={`/orgs/${event.org_slug}`}
              >
                {event.org_name}
              </Link>
            </>
          ) : (
            <>
              Posted by{" "}
              <Link
                className="text-maroon hover:underline"
                href={`/users/${event.contributor_name}`}
              >
                {event.contributor_name}
              </Link>
            </>
          )}
        </p>
        <span className="text-maroon text-sm flex items-center">•</span>
        <div className="flex gap-2">
          <IconLabel text={saves.toString()}>
            <FaBookmark color="maroon" />
          </IconLabel>
        </div>
      </div>
    </div>
  );
}
