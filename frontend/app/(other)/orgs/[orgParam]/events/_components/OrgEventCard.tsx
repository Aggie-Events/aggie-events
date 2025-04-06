import React from "react";
import Link from "next/link";
import { FaCalendarAlt, FaTag, FaBookmark, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { formatDateInterval } from "@/utils/date";

interface OrgEventCardProps {
  event: {
    event_id: number;
    event_name: string;
    event_description: string | null;
    event_location: string | null;
    event_img: string | null;
    event_likes: number;
    start_time: Date | null;
    end_time: Date | null;
    contributor_name: string;
    tags: string[];
  };
}

export default function OrgEventCard({ event }: OrgEventCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-200">
      <div className="flex flex-col md:flex-row">
        {/* Event Image */}
        <div className="md:w-1/4 lg:w-1/5">
          {event.event_img ? (
            <div className="h-48 md:h-full w-full">
              <img
                src={event.event_img}
                alt={event.event_name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-48 md:h-full w-full bg-gray-100 flex items-center justify-center">
              <FaCalendarAlt className="text-5xl text-gray-400" />
            </div>
          )}
        </div>
        
        {/* Event Content */}
        <div className="p-5 md:p-6 flex-1">
          {/* Header with title and likes */}
          <div className="flex justify-between items-start mb-3">
            <Link
              href={`/events/${event.event_id}`}
              className="text-2xl font-bold text-maroon hover:underline line-clamp-2"
            >
              {event.event_name}
            </Link>
            
            {event.event_likes > 0 && (
              <div className="flex items-center gap-1 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                <FaBookmark className="text-maroon" />
                <span>{event.event_likes}</span>
              </div>
            )}
          </div>
          
          {/* Event metadata */}
          <div className="flex flex-wrap gap-y-2 gap-x-4 mb-4 text-sm text-gray-600">
            {event.start_time && event.end_time && (
              <div className="flex items-center gap-1.5">
                <FaCalendarAlt className="text-maroon flex-shrink-0" />
                <span>{formatDateInterval(new Date(event.start_time), new Date(event.end_time))}</span>
              </div>
            )}
            
            {event.event_location && (
              <div className="flex items-center gap-1.5">
                <FaMapMarkerAlt className="text-maroon flex-shrink-0" />
                <span>{event.event_location}</span>
              </div>
            )}

          </div>
          
          {/* Event description */}
          {event.event_description && (
            <p className="text-gray-700 line-clamp-2 mb-4">
              {event.event_description}
            </p>
          )}
          
          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-auto pt-2">
              {event.tags.map((tag, index) => (
                <Link
                  key={tag + index}
                  href={`/search?tags=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-gray-100 text-xs font-medium text-gray-700 rounded-full hover:bg-maroon hover:text-white transition-colors"
                >
                  <FaTag className="text-[10px]" />
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
