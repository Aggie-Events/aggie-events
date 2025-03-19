"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEvent } from "@/api/event";
import { FaLocationDot, FaCalendarDay, FaHeart, FaShare, FaArrowLeft } from "react-icons/fa6";
import { FiEdit, FiClock } from "react-icons/fi";
import { MdGroup, MdCalendarMonth } from "react-icons/md";
import IconLabel from "@/components/common/IconLabel";
import { formatDateInterval } from "@/utils/date";
import { EventPageInformation } from "@/config/query-types";
import EventTagList from "@/components/tag/EventTagList";

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
  const router = useRouter();

  const handleBack = () => {
    // Check if there's a previous page and it's from the same origin
    if (document.referrer && new URL(document.referrer).origin === window.location.origin) {
      router.back();
    } else {
      // If no previous page or different origin, go to home
      router.push('/');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-600 hover:text-maroon mb-6 group transition-colors"
      >
        <FaArrowLeft className="text-lg transition-transform group-hover:-translate-x-1" />
        <span>Back</span>
      </button>

      {/* Event Image */}
      {event.event_img && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="relative w-full h-[400px]">
            <img
              src={event.event_img}
              alt={event.event_name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="bg-maroon h-3" />
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{event.event_name}</h1>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full transition-colors ${
                  isLiked ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                }`}
              >
                <FaHeart className="text-xl" />
              </button>
              <button className="p-2 rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 transition-colors">
                <FaShare className="text-xl" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-maroon text-white rounded-full hover:bg-darkmaroon transition-colors">
                <FiEdit />
                <span>Edit</span>
              </button>
            </div>
          </div>

          {/* Organization & Host Info */}
          {event.org_name && (
            <div className="flex items-center gap-2 text-gray-600 mb-6">
              <MdGroup className="text-maroon" />
              <span>Hosted by</span>
              <span className="font-medium">{event.org_name}</span>
            </div>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="mb-6">
              <EventTagList tags={event.tags} />
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Event Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Time & Location Card */}
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Event Details</h2>
            <div className="space-y-4">
              <IconLabel
                text={formatDateInterval(
                  new Date(event.start_time),
                  new Date(event.end_time),
                )}
                className="flex items-center gap-3 text-gray-700"
              >
                <FaCalendarDay className="text-xl text-maroon" />
              </IconLabel>
              {event.event_location && (
                <IconLabel 
                  text={event.event_location}
                  className="flex items-center gap-3 text-gray-700"
                >
                  <FaLocationDot className="text-xl text-maroon" />
                </IconLabel>
              )}
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About this Event</h2>
            <p className="text-gray-600 whitespace-pre-wrap">{event.event_description}</p>
          </div>
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-8">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {EventOptions.map((option, index) => (
                <button
                  key={index}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {option.icon}
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Event Stats Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Event Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-maroon">{event.event_likes}</p>
                <p className="text-sm text-gray-600">Likes</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-maroon">0</p>
                <p className="text-sm text-gray-600">Going</p>
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
      <p className="text-gray-600 mb-8">The event you're looking for doesn't exist or has been removed.</p>
      <button 
        onClick={() => window.history.back()}
        className="px-6 py-3 bg-maroon text-white rounded-full hover:bg-darkmaroon transition-colors"
      >
        Go Back
      </button>
    </div>
  );
}
