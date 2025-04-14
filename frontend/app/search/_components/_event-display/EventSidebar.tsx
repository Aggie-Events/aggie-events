import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchEventsReturn } from "@/api/event";
import { FaLocationDot, FaHeart, FaShare, FaRegClock, FaChevronUp, FaChevronDown } from "react-icons/fa6";
import { MdGroup } from "react-icons/md";
import { FiExternalLink, FiLink } from "react-icons/fi";
import EventTagList from "@/components/tag/EventTagList";
import Link from "next/link";
import Image from "next/image";

interface EventSidebarProps {
  event: SearchEventsReturn;
  onClose: () => void;
  onNavigate?: (direction: 'up' | 'down') => void;
}

export default function EventSidebar({ 
  event, 
  onClose, 
  onNavigate,
}: EventSidebarProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowUp' && onNavigate) {
        e.preventDefault();
        onNavigate('up');
      } else if (e.key === 'ArrowDown' && onNavigate) {
        e.preventDefault();
        onNavigate('down');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNavigate]);

  const renderDate = () => {
    const startDate = new Date(event.start_time);
    const month = startDate.toLocaleString('default', { month: 'short' }).toUpperCase();
    const day = startDate.getDate();
    
    return (
      <div className="bg-maroon/10 rounded-lg p-3 text-center w-16">
        <div className="text-xs font-medium text-maroon">{month}</div>
        <div className="text-2xl font-bold text-maroon">{day}</div>
      </div>
    );
  };

  return (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ ease: "easeInOut", duration: 0.25 }}
            className="fixed right-0 top-0 h-full w-[500px] bg-white shadow-xl z-50 overflow-y-auto rounded-l-md"
          >
            <div className="relative">
              {/* Top Bar */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex items-center gap-2">
                    <FiLink />
                    Copy Link
                  </button>
                  <Link 
                    href={`/events/${event.event_id}`}
                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex items-center gap-2"
                  >
                    Event Page
                    <FiExternalLink />
                  </Link>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-md transition-colors" onClick={() => onNavigate?.('up')}>
                    <FaChevronUp className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-md transition-colors" onClick={() => onNavigate?.('down')}>
                    <FaChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Event Image */}
                {event.event_img && (
                  <div className="relative w-full h-[200px] rounded-xl overflow-hidden mb-6">
                    <Image
                      src={event.event_img}
                      alt={event.event_name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                )}

                {/* Header */}
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold text-gray-900">{event.event_name}</h1>
                  {event.tags && event.tags.length > 0 && (
                    <EventTagList tags={event.tags} />
                  )}
                </div>

                {/* Event Info */}
                <div className="space-y-4">
                  {/* Date/Time */}
                  <div className="flex items-start gap-3">
                    {renderDate()}
                    <div>
                      <div className="font-medium text-gray-800">
                        {new Date(event.start_time).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </div>
                      <div className="text-gray-600 flex items-center gap-1 text-sm mt-1">
                        <FaRegClock className="text-maroon" />
                        <span>
                          {new Date(event.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          {' - '}
                          {new Date(event.end_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          <span className="text-xs text-gray-500 ml-1">EDT</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  {event.event_location && (
                    <div className="flex items-start gap-3">
                      <div className="bg-maroon/10 p-2 rounded-full">
                        <FaLocationDot className="text-maroon" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{event.event_location}</div>
                        <div className="text-sm text-gray-600">McDonough, Georgia</div>
                        <a
                          href={`https://maps.google.com/?q=${event.event_location}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-maroon flex items-center gap-1 hover:underline mt-1"
                        >
                          <span>View on map</span>
                          <FiExternalLink />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Organization */}
                  {event.org_name && (
                    <div className="flex items-start gap-3">
                      <div className="bg-maroon/10 p-2 rounded-full">
                        <MdGroup className="text-maroon" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Hosted by</div>
                        <div className="font-medium text-gray-800">{event.org_name}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Registration Section */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">Registration</h2>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="bg-gray-200 p-1.5 rounded-full">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
                      </svg>
                    </div>
                    <span className="font-medium">Limited Spots Remaining</span>
                  </div>
                  <p className="text-gray-600 text-sm">Hurry up and register before the event fills up!</p>
                  <button className="w-full bg-maroon hover:bg-darkmaroon text-white rounded-lg py-2.5 font-medium transition-colors">
                    RSVP to Event
                  </button>
                </div>

                {/* Description */}
                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">About this Event</h2>
                  <p className="text-gray-700 whitespace-pre-wrap">{event.event_description}</p>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-gray-200 pt-6 space-y-3">
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-200 hover:border-maroon/50 transition-colors">
                      <FaHeart className="text-gray-400" />
                      <span>Like</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-200 hover:border-maroon/50 transition-colors">
                      <FaShare className="text-gray-400" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
    </>
  );
} 