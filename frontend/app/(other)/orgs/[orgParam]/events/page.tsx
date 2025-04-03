"use client";
import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaCalendarAlt, FaSearch } from "react-icons/fa";
import { useOrgPageInformation } from "@/api/orgs";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function OrgEventsPage() {
  const { orgParam } = useParams<{ orgParam: string }>();
  const { data: org, isLoading, isError } = useOrgPageInformation(orgParam as string);
  const [searchQuery, setSearchQuery] = React.useState("");
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (isError || !org) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-2xl font-bold text-maroon mb-4">Organization Not Found</h1>
        <p className="text-gray-600">The organization you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  // Placeholder for events
  const events: any[] = [];

  return (
    <div className="space-y-8">
      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Events</h2>
          <div className="relative w-full md:w-auto md:min-w-[300px]">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {events.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {events.map((event) => (
              <div key={event.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                    <FaCalendarAlt className="text-xl text-gray-400" />
                  </div>
                  <div className="flex-grow">
                    <Link 
                      href={`/events/${event.id}`}
                      className="text-lg font-medium text-maroon hover:underline"
                    >
                      {event.title}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString()} • {event.location || "No location"}
                    </p>
                    <p className="text-gray-600 line-clamp-2 mt-1">{event.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <FaCalendarAlt className="text-5xl text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No events found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              This organization hasn't posted any events yet. Check back later or follow to get notified when they do.
            </p>
          </div>
        )}
      </div>

      {/* Pagination - would implement when there are events */}
      {events.length > 0 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <div className="px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
              Page 1
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
} 