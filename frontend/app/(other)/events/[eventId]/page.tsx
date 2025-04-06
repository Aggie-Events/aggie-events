"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEvent } from "@/api/event";
import {
  FaLocationDot,
  FaCalendarDay,
  FaHeart,
  FaShare,
  FaArrowLeft,
  FaRegCalendarCheck,
  FaRegClock,
} from "react-icons/fa6";
import { FiEdit, FiClock, FiExternalLink } from "react-icons/fi";
import { MdGroup, MdCalendarMonth, MdOutlineArrowForward, MdPeople } from "react-icons/md";
import IconLabel from "@/components/common/IconLabel";
import { formatDateInterval } from "@/utils/date";
import { EventPageInformation } from "@/config/query-types";
import EventTagList from "@/components/tag/EventTagList";
import Link from "next/link";
import BackButton from "@/components/common/BackButton";

export default function EventDetails() {
  const { eventId } = useParams<{ eventId: string }>();
  const { data: event, isPending, isError } = useEvent(eventId);

  return (
    <div className="min-h-screen bg-gray-50">
      {isPending && <Loading />}
      {isError && <EventNotFound />}
      {event && <EventData event={event} />}
    </div>
  );
}

const EventOptions = [
  { label: "Add to Personal Calendar", icon: <MdCalendarMonth /> },
  { label: "Add to Google Calendar", icon: <FaCalendarDay /> },
  { label: "Export as ICS", icon: <FiClock /> },
];

function EventData({ event }: { event: EventPageInformation }) {
  const [isLiked, setIsLiked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

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

  // Truncate description for preview if needed
  const shortDescription = event.event_description && event.event_description.length > 200 
    ? `${event.event_description.substring(0, 200)}...` 
    : event.event_description;

  return (
    <div className="max-w-5xl mx-auto pb-8 pt-5 animate-fade-in">
      <div className="px-4">
        <BackButton />
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Title and Basic Info */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-maroon h-1.5"></div>
              <div className="p-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {event.event_name}
                </h1>
                
                {/* Tags moved to header section */}
                {event.tags && event.tags.length > 0 && (
                  <div className="mb-6">
                    <EventTagList tags={event.tags} />
                  </div>
                )}
                
                <div className="flex flex-wrap gap-6 mt-4">
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
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          {new Date(event.end_time).toLocaleTimeString('en-US', { timeZoneName: 'short' }).split(' ')[2]}
                        </span>
                      </div>
                    </div>
                  </div>
    
                  {/* Location */}
                  {event.event_location && (
                    <div className="flex items-start gap-3">
                      <div className="bg-maroon/10 p-2 rounded-full mt.5">
                        <FaLocationDot className="text-maroon" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{event.event_location}</div>
                        <a href={`https://maps.google.com/?q=${event.event_location}`} target="_blank" rel="noreferrer" 
                           className="text-sm text-maroon flex items-center gap-1 hover:underline mt-1">
                          <span>View on map</span>
                          <FiExternalLink />
                        </a>
                      </div>
                    </div>
                  )}
    
                  {/* Organization */}
                  {event.org_name && (
                    <div className="flex items-start gap-3">
                      <div className="bg-maroon/10 p-2 rounded-full mt.5">
                        <MdGroup className="text-maroon" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Hosted by</div>
                        <div className="font-medium text-gray-800">{event.org_name}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
    
            {/* About Event Card - Now more prominent */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  About this Event
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap text-base leading-relaxed">
                    {event.event_description}
                  </p>
                  
                  {/* Additional sections that would typically be in an expanded description */}
                  {event.event_description && (
                    <>
                      <h3 className="text-lg font-medium text-gray-800 mt-6 mb-2">What to Expect</h3>
                      <p className="text-gray-700 mb-4">
                        Join us for this exciting event where you'll have the opportunity to connect with fellow Aggies and enjoy a memorable experience.
                        We've planned a variety of activities and opportunities for engagement.
                      </p>
                      
                      <h3 className="text-lg font-medium text-gray-800 mt-6 mb-2">Who Should Attend</h3>
                      <p className="text-gray-700 mb-4">
                        This event is open to all Texas A&M students, faculty, staff, and community members interested in this topic.
                        Whether you're a beginner or expert, there's something for everyone!
                      </p>
                    </>
                  )}
                </div>
                
                {/* "What to bring" section */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">What to Bring</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-maroon">•</span>
                      <span>Your Texas A&M ID</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-maroon">•</span>
                      <span>A positive attitude</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-maroon">•</span>
                      <span>Questions for our speakers</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* User panel */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-maroon h-1.5"></div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="font-medium text-lg text-gray-900">Event Actions</div>
                  {event.event_likes > 0 && (
                    <div className="bg-maroon/10 py-1 px-3 rounded-full text-sm">
                      <span className="text-maroon font-medium">{event.event_likes}</span>
                      <span className="text-gray-600 ml-1">likes</span>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-2 mb-6">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border transition-colors font-medium ${
                      isLiked
                        ? "bg-red-50 text-red-500 border-red-200"
                        : "bg-white text-gray-700 border-gray-200 hover:border-maroon/50"
                    }`}
                  >
                    <FaHeart className={isLiked ? "text-red-500" : "text-gray-400"} />
                    <span>{isLiked ? "Liked" : "Like Event"}</span>
                  </button>
                  
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white text-gray-700 border border-gray-200 hover:border-maroon/50 transition-colors font-medium">
                    <FaShare className="text-gray-500" />
                    <span>Share Event</span>
                  </button>
                  
                  <Link href={`/dashboard/events/edit/${event.event_id}`} className="block">
                    <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-maroon text-white rounded-lg hover:bg-darkmaroon transition-colors font-medium">
                      <FiEdit />
                      <span>Edit Event</span>
                    </button>
                  </Link>
                </div>
                
                {/* Calendar Options */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="text-sm font-medium text-gray-500 mb-3">ADD TO CALENDAR</div>
                  <div className="space-y-2">
                    {EventOptions.map((option, index) => (
                      <button
                        key={index}
                        className="w-full flex items-center gap-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                      >
                        <div className="bg-maroon/10 p-1.5 rounded-full">
                          {option.icon}
                        </div>
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Attendee Information */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-maroon h-1.5"></div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Attendees
                </h2>
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-full bg-gray-100 p-2 w-10 h-10 flex items-center justify-center text-gray-500">
                    <MdPeople />
                  </div>
                  <div>
                    <div className="font-medium">Join this event</div>
                    <div className="text-sm text-gray-600">0 people are going</div>
                  </div>
                </div>
                
                <button className="w-full bg-maroon hover:bg-darkmaroon text-white rounded-lg py-3 px-6 font-medium transition-colors mt-4">
                  RSVP to Event
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse space-y-4 w-full max-w-5xl">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

function EventNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-5xl font-bold text-maroon mb-4">Event Not Found</h1>
      <p className="text-gray-600 mb-8">
        The event you're looking for doesn't exist or has been removed.
      </p>
      <button
        onClick={() => window.history.back()}
        className="px-6 py-3 bg-maroon text-white rounded-full hover:bg-darkmaroon transition-colors"
      >
        Go Back
      </button>
    </div>
  );
}
